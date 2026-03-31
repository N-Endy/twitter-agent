import { Prisma } from "./generated/prisma/client";
import { getPrismaClient } from "./db";

export const VOICE_FEEDBACK_TAGS = [
  "too_formal",
  "too_polished",
  "too_generic",
  "not_nigerian_enough",
  "unnatural_slang",
  "weak_hook",
  "too_long",
  "overwritten"
] as const;

export type VoiceFeedbackTag = (typeof VOICE_FEEDBACK_TAGS)[number];

export type PromptVoiceExample = {
  id: string;
  sourceTitle: string | null;
  sourceText: string;
  preferredText: string;
  operatorNote: string | null;
  feedbackTags: string[];
  pillarTag: string | null;
  hookTag: string | null;
  createdAt: Date;
};

type RevisionClient = ReturnType<typeof getPrismaClient> | Prisma.TransactionClient;

function uniqueStrings(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value?.trim().toLowerCase();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

export function normalizeVoiceFeedbackTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  const allowed = new Set<string>(VOICE_FEEDBACK_TAGS);

  return uniqueStrings(
    tags.map((tag) => (typeof tag === "string" ? tag : null))
  ).filter((tag): tag is VoiceFeedbackTag => allowed.has(tag));
}

export async function ensureInitialDraftRevision(
  client: RevisionClient,
  params: {
    draftId: string;
    text: string;
    rationale?: string | null;
    createdAt?: Date;
  }
) {
  const existing = await client.draftRevision.findFirst({
    where: { draftId: params.draftId },
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return client.draftRevision.create({
    data: {
      draftId: params.draftId,
      kind: "INITIAL_AI",
      text: params.text,
      rationale: params.rationale ?? null,
      createdBy: "ai-writer",
      createdAt: params.createdAt
    }
  });
}

export function getVoiceExampleScore(
  example: {
    sourceItemId: string | null;
    pillarTag: string | null;
    hookTag: string | null;
  },
  target: {
    sourceItemId?: string | null;
    pillarTag?: string | null;
    hookTag?: string | null;
  }
) {
  let score = 0;

  if (target.sourceItemId && example.sourceItemId === target.sourceItemId) {
    score += 100;
  }

  if (target.pillarTag && example.pillarTag && example.pillarTag === target.pillarTag) {
    score += 10;
  }

  if (target.hookTag && example.hookTag && example.hookTag === target.hookTag) {
    score += 5;
  }

  return score;
}

export async function getRelevantVoiceExamples(params: {
  sourceItemId?: string | null;
  pillarTag?: string | null;
  hookTag?: string | null;
  excludeDraftId?: string | null;
  limit?: number;
}) {
  const prisma = getPrismaClient();
  const examples = await prisma.voiceExample.findMany({
    where: {
      status: "ACTIVE",
      ...(params.excludeDraftId ? { draftId: { not: params.excludeDraftId } } : {})
    },
    orderBy: {
      updatedAt: "desc"
    },
    take: 40,
    include: {
      sourceItem: {
        select: {
          title: true
        }
      },
      sourceRevision: true,
      preferredRevision: true
    }
  });

  return examples
    .map((example) => ({
      id: example.id,
      sourceTitle: example.sourceItem?.title ?? null,
      sourceText: example.sourceRevision.text,
      preferredText: example.preferredRevision.text,
      operatorNote: example.operatorNote,
      feedbackTags: example.feedbackTags,
      pillarTag: example.pillarTag,
      hookTag: example.hookTag,
      createdAt: example.createdAt,
      score: getVoiceExampleScore(example, params)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.createdAt.getTime() - left.createdAt.getTime();
    })
    .slice(0, params.limit ?? 3)
    .map(({ score: _score, ...example }) => example);
}

export function formatVoiceExamplesForPrompt(examples: PromptVoiceExample[]) {
  if (examples.length === 0) {
    return "No curated voice examples yet.";
  }

  return examples
    .map((example, index) => {
      const parts = [
        `Example ${index + 1}`,
        example.sourceTitle ? `Source lane: ${example.sourceTitle}` : null,
        `Original AI draft:\n${example.sourceText}`,
        `Preferred rewrite:\n${example.preferredText}`,
        example.feedbackTags.length > 0 ? `Feedback tags: ${example.feedbackTags.join(", ")}` : null,
        example.operatorNote ? `Operator note: ${example.operatorNote}` : null
      ].filter(Boolean);

      return parts.join("\n\n");
    })
    .join("\n\n---\n\n");
}
