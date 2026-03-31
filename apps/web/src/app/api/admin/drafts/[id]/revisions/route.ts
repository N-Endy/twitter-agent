import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";
import { DraftTrainingError, saveHumanRewrite } from "@/lib/draft-training";

type DraftRevisionBody = {
  text?: string;
  note?: string | null;
  feedbackTags?: string[];
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as DraftRevisionBody;

  try {
    const result = await saveHumanRewrite({
      draftId: id,
      actor: session.user.email ?? "owner",
      text: String(body.text ?? ""),
      note: body.note,
      feedbackTags: body.feedbackTags
    });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: "draft.rewritten",
      entityType: "draft",
      entityId: id,
      details: {
        previousStatus: result.draft.status,
        nextStatus: result.updatedDraft.status,
        revisionId: result.revision.id,
        feedbackTags: result.feedbackTags
      }
    });

    return NextResponse.json({
      ok: true,
      draft: result.updatedDraft,
      revision: result.revision
    });
  } catch (error) {
    if (error instanceof DraftTrainingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    throw error;
  }
}
