import { NextResponse } from "next/server";

import {
  buildSourceGuidance,
  buildVoiceRules,
  getEnv,
  getPrismaClient,
  promptCatalog,
  readBrandVoiceProfile,
  renderPromptTemplate,
  runStructuredPrompt,
  tweetDraftOutputSchema
} from "@twitter-agent/core";
import { buildOperatorFeedback, DraftTrainingError, getDraftVoiceExamplesPrompt, getLatestAiRevision, saveHumanRewrite } from "@/lib/draft-training";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

type DraftTuneBody = {
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
  const body = (await request.json().catch(() => ({}))) as DraftTuneBody;

  try {
    const saved = await saveHumanRewrite({
      draftId: id,
      actor: session.user.email ?? "owner",
      text: String(body.text ?? ""),
      note: body.note,
      feedbackTags: body.feedbackTags
    });

    const draft = await prisma.draft.findUnique({
      where: { id },
      include: {
        idea: {
          include: {
            sourceItem: true,
            snapshot: true
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

    const sourceRevision = getLatestAiRevision(draft.revisions);

    if (!sourceRevision) {
      return NextResponse.json({ error: "No AI draft revision is available to tune from yet." }, { status: 409 });
    }

    const accountVoiceGuide = await readBrandVoiceProfile();
    const prompt = promptCatalog.VOICE_TUNER;
    const voiceExamples = await getDraftVoiceExamplesPrompt({
      sourceItemId: draft.idea.sourceItem.id,
      pillarTag: draft.pillarTag ?? draft.idea.pillar,
      hookTag: draft.hookTag ?? draft.idea.hook.slice(0, 40),
      excludeDraftId: draft.id,
      limit: 3
    });

    const tuned = await runStructuredPrompt({
      model: getEnv().OPENAI_QUALITY_MODEL,
      fallbackModel: getEnv().GROQ_QUALITY_MODEL,
      schema: tweetDraftOutputSchema,
      schemaName: prompt.schemaName,
      systemPrompt: prompt.systemPrompt,
      userPrompt: renderPromptTemplate(prompt.userTemplate, {
        sourceGuidance: buildSourceGuidance(draft.idea.sourceItem, accountVoiceGuide, draft.idea.snapshot ?? undefined),
        voiceNotes: buildVoiceRules(
          draft.idea.sourceItem,
          accountVoiceGuide,
          draft.idea.snapshot ?? undefined
        ),
        draftText: sourceRevision.text,
        humanRewrite: saved.revision.text,
        operatorFeedback: buildOperatorFeedback(saved.note, saved.feedbackTags),
        voiceExamples: voiceExamples.promptText
      })
    });

    const tunedRevision = await prisma.draftRevision.create({
      data: {
        draftId: draft.id,
        kind: "AI_TUNED",
        text: tuned.text,
        rationale: tuned.rationale,
        note: buildOperatorFeedback(saved.note, saved.feedbackTags),
        feedbackTags: saved.feedbackTags,
        createdBy: "ai-tuner",
        basedOnRevisionId: saved.revision.id
      }
    });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: "draft.tuned",
      entityType: "draft",
      entityId: draft.id,
      details: {
        sourceRevisionId: sourceRevision.id,
        preferredRevisionId: saved.revision.id,
        tunedRevisionId: tunedRevision.id,
        feedbackTags: saved.feedbackTags
      }
    });

    return NextResponse.json({
      ok: true,
      draft: saved.updatedDraft,
      humanRevision: saved.revision,
      tunedRevision
    });
  } catch (error) {
    if (error instanceof DraftTrainingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to tune this draft right now."
      },
      { status: 502 }
    );
  }
}
