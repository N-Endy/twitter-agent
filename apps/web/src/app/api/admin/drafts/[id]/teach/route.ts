import { NextResponse } from "next/server";

import { getPrismaClient, normalizeVoiceFeedbackTags } from "@twitter-agent/core";
import { DraftTrainingError, getLatestAiRevision, getLatestHumanRevision } from "@/lib/draft-training";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

type TeachDraftBody = {
  sourceRevisionId?: string;
  preferredRevisionId?: string;
  note?: string | null;
  feedbackTags?: string[];
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as TeachDraftBody;
  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      idea: {
        include: {
          sourceItem: true
        }
      },
      revisions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  try {
    const sourceRevision =
      draft.revisions.find((revision) => revision.id === body.sourceRevisionId) ?? getLatestAiRevision(draft.revisions);
    const preferredRevision =
      draft.revisions.find((revision) => revision.id === body.preferredRevisionId) ?? getLatestHumanRevision(draft.revisions);

    if (!sourceRevision) {
      throw new DraftTrainingError("Choose an AI revision to teach from.", 409);
    }

    if (sourceRevision.kind === "HUMAN_EDIT") {
      throw new DraftTrainingError("The source side of a voice example must be an AI revision.", 409);
    }

    if (!preferredRevision || preferredRevision.kind !== "HUMAN_EDIT") {
      throw new DraftTrainingError("Teach this style requires a saved human rewrite.", 409);
    }

    const feedbackTags = normalizeVoiceFeedbackTags(body.feedbackTags);
    const operatorNote = body.note?.trim() || preferredRevision.note || null;
    const mergedTags = [...new Set([...preferredRevision.feedbackTags, ...feedbackTags])];

    const existing = await prisma.voiceExample.findFirst({
      where: {
        sourceRevisionId: sourceRevision.id,
        preferredRevisionId: preferredRevision.id
      }
    });

    const voiceExample = existing
      ? await prisma.voiceExample.update({
          where: { id: existing.id },
          data: {
            status: "ACTIVE",
            operatorNote,
            feedbackTags: mergedTags
          }
        })
      : await prisma.voiceExample.create({
          data: {
            draftId: draft.id,
            sourceItemId: draft.idea.sourceItemId,
            pillarTag: draft.pillarTag ?? draft.idea.pillar,
            hookTag: draft.hookTag ?? draft.idea.hook.slice(0, 40),
            sourceRevisionId: sourceRevision.id,
            preferredRevisionId: preferredRevision.id,
            operatorNote,
            feedbackTags: mergedTags,
            createdBy: session.user.email ?? "owner"
          }
        });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: existing ? "voiceExample.restored" : "voiceExample.created",
      entityType: "voiceExample",
      entityId: voiceExample.id,
      details: {
        draftId: draft.id,
        sourceRevisionId: sourceRevision.id,
        preferredRevisionId: preferredRevision.id,
        feedbackTags: mergedTags
      }
    });

    return NextResponse.json({
      ok: true,
      voiceExample
    });
  } catch (error) {
    if (error instanceof DraftTrainingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }
}
