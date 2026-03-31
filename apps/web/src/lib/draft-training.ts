import {
  ensureInitialDraftRevision,
  formatVoiceExamplesForPrompt,
  getPrismaClient,
  getRelevantVoiceExamples,
  normalizeVoiceFeedbackTags
} from "@twitter-agent/core";

type DraftTrainingStatus =
  | "PENDING_QA"
  | "NEEDS_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "REJECTED";

export class DraftTrainingError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function buildOperatorFeedback(note: string | null, tags: string[]) {
  const parts = [
    tags.length > 0 ? `Feedback tags: ${tags.join(", ")}` : null,
    note?.trim() ? `Operator note: ${note.trim()}` : null
  ].filter(Boolean);

  return parts.join("\n") || "No extra operator feedback.";
}

export function isDraftLockedForTraining(status: string) {
  return status === "SCHEDULED" || status === "PUBLISHING" || status === "PUBLISHED";
}

export function getStatusUpdateAfterRewrite(status: string, approvedAt: Date | null) {
  return {
    status: (status === "APPROVED" ? "NEEDS_REVIEW" : status) as DraftTrainingStatus,
    approvedAt: status === "APPROVED" ? null : approvedAt
  };
}

export function getLatestHumanRevision<T extends { kind: string }>(revisions: T[]) {
  return revisions.find((revision) => revision.kind === "HUMAN_EDIT") ?? null;
}

export function getLatestAiRevision<T extends { kind: string }>(revisions: T[]) {
  return revisions.find((revision) => revision.kind !== "HUMAN_EDIT") ?? null;
}

export async function saveHumanRewrite(params: {
  draftId: string;
  actor: string;
  text: string;
  note?: string | null;
  feedbackTags?: unknown;
}) {
  const prisma = getPrismaClient();
  const draft = await prisma.draft.findUnique({
    where: { id: params.draftId },
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
    throw new DraftTrainingError("Draft not found.", 404);
  }

  if (isDraftLockedForTraining(draft.status)) {
    throw new DraftTrainingError("Scheduled or published drafts cannot be retrained.", 409);
  }

  const text = params.text.trim();

  if (!text) {
    throw new DraftTrainingError("Rewrite text is required.", 400);
  }

  const note = params.note?.trim() || null;
  const feedbackTags = normalizeVoiceFeedbackTags(params.feedbackTags);

  const result = await prisma.$transaction(async (tx) => {
    await ensureInitialDraftRevision(tx, {
      draftId: draft.id,
      text: draft.text,
      rationale: draft.rationale,
      createdAt: draft.createdAt
    });

    const latestHumanRevision = draft.revisions.find((revision) => revision.kind === "HUMAN_EDIT") ?? null;
    const revision =
      latestHumanRevision &&
      latestHumanRevision.text === text &&
      (latestHumanRevision.note ?? null) === note &&
      latestHumanRevision.feedbackTags.join("|") === feedbackTags.join("|")
        ? latestHumanRevision
        : await tx.draftRevision.create({
            data: {
              draftId: draft.id,
              kind: "HUMAN_EDIT",
              text,
              note,
              feedbackTags,
              createdBy: params.actor,
              basedOnRevisionId: draft.revisions[0]?.id ?? null
            }
          });

    const updatedDraft = await tx.draft.update({
      where: { id: draft.id },
      data: {
        text,
        characterCount: text.length,
        qualitySummary: note ?? draft.qualitySummary,
        ...getStatusUpdateAfterRewrite(draft.status, draft.approvedAt)
      }
    });

    return {
      draft,
      updatedDraft,
      revision,
      note,
      feedbackTags
    };
  });

  return result;
}

export async function getDraftVoiceExamplesPrompt(params: {
  sourceItemId?: string | null;
  pillarTag?: string | null;
  hookTag?: string | null;
  excludeDraftId?: string | null;
  limit?: number;
}) {
  const examples = await getRelevantVoiceExamples(params);

  return {
    examples,
    promptText: formatVoiceExamplesForPrompt(examples)
  };
}
