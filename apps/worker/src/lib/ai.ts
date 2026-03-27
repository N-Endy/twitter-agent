import {
  contentIdeaBatchSchema,
  draftReviewOutputSchema,
  getOpenAIErrorMessage,
  promptCatalog,
  renderPromptTemplate,
  replyClassificationOutputSchema,
  replyDraftOutputSchema,
  researchExtractionSchema,
  isOpenAIQuotaError,
  isOpenAIRateLimitError,
  isOpenAISchemaValidationError,
  isOpenAIToolUseError,
  runStructuredPrompt,
  tweetDraftOutputSchema,
  getEnv
} from "@twitter-agent/core";

const AI_PROVIDER_PAUSE_MS = 60 * 60 * 1000;

let aiProviderPauseUntil = 0;

function sentenceChunks(text: string, count: number) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, count);
}

export function hasAIProvider() {
  return Boolean(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
}

function isAIProviderPaused(now = Date.now()) {
  return aiProviderPauseUntil > now;
}

function pauseAIProvider() {
  aiProviderPauseUntil = Date.now() + AI_PROVIDER_PAUSE_MS;
}

function clearAIProviderPause() {
  aiProviderPauseUntil = 0;
}

export function resetAIProviderFallbackStateForTests() {
  clearAIProviderPause();
}

async function runWithProviderFallback<T>(params: {
  label: string;
  fallback: () => T;
  execute: () => Promise<T>;
}) {
  if (!hasAIProvider()) {
    return params.fallback();
  }

  if (isAIProviderPaused()) {
    return params.fallback();
  }

  try {
    const result = await params.execute();
    clearAIProviderPause();
    return result;
  } catch (error) {
    const reason = getOpenAIErrorMessage(error);

    if (isOpenAIQuotaError(error)) {
      pauseAIProvider();
      console.warn(`[ai] ${params.label} falling back after Groq quota error: ${reason}`);
      return params.fallback();
    }

    if (isOpenAIRateLimitError(error)) {
      console.warn(`[ai] ${params.label} falling back after Groq rate limit: ${reason}`);
      return params.fallback();
    }

    if (isOpenAISchemaValidationError(error)) {
      console.warn(`[ai] ${params.label} falling back after Groq schema validation error: ${reason}`);
      return params.fallback();
    }

    if (isOpenAIToolUseError(error)) {
      console.warn(`[ai] ${params.label} falling back after Groq tool-use error: ${reason}`);
      return params.fallback();
    }

    throw error;
  }
}

function buildFallbackResearch(rawText: string) {
  const keyFacts = sentenceChunks(rawText, 5);
  return researchExtractionSchema.parse({
    summary: keyFacts.slice(0, 2).join(" "),
    keyFacts,
    quoteCandidates: keyFacts.slice(0, 2),
    hookIdeas: keyFacts.map((fact) => `What this changes: ${fact}`).slice(0, 4),
    pillarCandidates: ["build-in-public", "ai-systems", "execution"],
    safetyFlags: []
  });
}

function buildFallbackIdeas(params: {
  keyFacts: string[];
}) {
  return contentIdeaBatchSchema.parse({
    ideas: params.keyFacts.slice(0, 7).map((fact, index) => ({
      pillar: index % 2 === 0 ? "AI systems" : "Build in public",
      hook: `Most builders miss this: ${fact.slice(0, 90)}`,
      angle: `Turn the source insight into a practical builder lesson ${index + 1}.`,
      audience: "Technical builders in Nigeria and the US",
      rationale: "Grounded in stored research and expressed as a practical takeaway.",
      supportingEvidence: [fact],
      topical: false,
      tags: ["ai-builder", "systems", "execution"]
    }))
  });
}

function buildFallbackDraft(params: {
  hook: string;
  angle: string;
  pillar: string;
  supportingEvidence: string[];
}) {
  const sentence = `${params.hook}\n\n${params.angle}\n\n${params.supportingEvidence[0] ?? "Ship the lesson, not the hype."}`;
  const text = sentence.slice(0, 260);
  return tweetDraftOutputSchema.parse({
    text,
    rationale: "Fallback deterministic draft composed from the idea and strongest fact.",
    hookTag: params.hook.split(" ").slice(0, 4).join("-").toLowerCase(),
    pillarTag: params.pillar.toLowerCase().replace(/\s+/g, "-"),
    evidenceUsed: params.supportingEvidence.slice(0, 3),
    suggestedCta: "What would you change?",
    confidence: 0.52
  });
}

function buildFallbackReview(params: {
  draftText: string;
  supportingEvidence: string[];
}) {
  const tooLong = params.draftText.length > 280;
  const rewrite = tooLong ? `${params.draftText.slice(0, 250)}...` : params.draftText;

  return draftReviewOutputSchema.parse({
    approvedForReview: !tooLong,
    voiceScore: 7,
    clarityScore: tooLong ? 5 : 7,
    noveltyScore: 6,
    safetyScore: 8,
    sourceConfidenceScore: params.supportingEvidence.length > 0 ? 8 : 4,
    issues: tooLong ? ["Draft exceeds X character constraints."] : [],
    rewrite
  });
}

function buildFallbackClassification(mentionText: string) {
  const lowered = mentionText.toLowerCase();
  const shouldRespond = lowered.includes("?") || lowered.includes("how") || lowered.includes("what");

  return replyClassificationOutputSchema.parse({
    category: lowered.includes("scam") ? "TROLL" : shouldRespond ? "QUESTION" : "OTHER",
    sentiment: lowered.includes("love") ? "POSITIVE" : lowered.includes("scam") ? "NEGATIVE" : "NEUTRAL",
    userIntent: shouldRespond ? "Looking for clarification or a practical answer." : "General engagement.",
    riskLevel: lowered.includes("money") || lowered.includes("legal") ? "HIGH" : "LOW",
    shouldRespond,
    requiresEscalation: lowered.includes("money") || lowered.includes("legal"),
    rationale: "Fallback classifier based on simple heuristics."
  });
}

function buildFallbackReply(supportingEvidence: string[]) {
  return replyDraftOutputSchema.parse({
    suggestedReply: `Appreciate you. Short answer: ${
      supportingEvidence[0] ?? "I’d start with the simplest working version, learn from the response, then tighten the system."
    }`,
    rationale: "Fallback reply uses the safest supporting evidence available.",
    confidence: 0.48,
    toneChecklist: ["practical", "non-defensive", "brief"],
    safetyNotes: ["Human approval required before sending."]
  });
}

export async function extractResearch(rawText: string, title: string, sourceType: string) {
  const prompt = promptCatalog.STRATEGIST;
  return runWithProviderFallback({
    label: "extractResearch",
    fallback: () => buildFallbackResearch(rawText),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_FAST_MODEL,
        schema: researchExtractionSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          title,
          sourceType,
          rawText
        })
      })
  });
}

export async function generateIdeas(params: {
  summary: string;
  keyFacts: string[];
  recentWinners: string[];
  recentLosers: string[];
}) {
  const prompt = promptCatalog.IDEATION;
  return runWithProviderFallback({
    label: "generateIdeas",
    fallback: () => buildFallbackIdeas({ keyFacts: params.keyFacts }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_QUALITY_MODEL,
        schema: contentIdeaBatchSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          summary: params.summary,
          keyFacts: params.keyFacts.join("\n"),
          recentWinners: params.recentWinners.join("\n") || "None yet",
          recentLosers: params.recentLosers.join("\n") || "None yet"
        })
      })
  });
}

export async function writeDraft(params: {
  pillar: string;
  hook: string;
  angle: string;
  audience: string;
  supportingEvidence: string[];
  voiceNotes: string;
}) {
  const prompt = promptCatalog.WRITER;
  return runWithProviderFallback({
    label: "writeDraft",
    fallback: () =>
      buildFallbackDraft({
        hook: params.hook,
        angle: params.angle,
        pillar: params.pillar,
        supportingEvidence: params.supportingEvidence
      }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_QUALITY_MODEL,
        schema: tweetDraftOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          pillar: params.pillar,
          hook: params.hook,
          angle: params.angle,
          audience: params.audience,
          supportingEvidence: params.supportingEvidence.join("\n"),
          voiceNotes: params.voiceNotes
        })
      })
  });
}

export async function reviewDraft(params: {
  draftText: string;
  supportingEvidence: string[];
  voiceRules: string;
}) {
  const prompt = promptCatalog.EDITOR;
  return runWithProviderFallback({
    label: "reviewDraft",
    fallback: () =>
      buildFallbackReview({
        draftText: params.draftText,
        supportingEvidence: params.supportingEvidence
      }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_FAST_MODEL,
        schema: draftReviewOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          draftText: params.draftText,
          supportingEvidence: params.supportingEvidence.join("\n"),
          voiceRules: params.voiceRules
        })
      })
  });
}

export async function classifyMention(params: {
  mentionText: string;
  conversationContext: string;
}) {
  const prompt = promptCatalog.REPLY_CLASSIFIER;
  return runWithProviderFallback({
    label: "classifyMention",
    fallback: () => buildFallbackClassification(params.mentionText),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_FAST_MODEL,
        schema: replyClassificationOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          mentionText: params.mentionText,
          conversationContext: params.conversationContext
        })
      })
  });
}

export async function draftReply(params: {
  mentionText: string;
  classification: string;
  conversationContext: string;
  supportingEvidence: string[];
}) {
  const prompt = promptCatalog.REPLY_DRAFTER;
  return runWithProviderFallback({
    label: "draftReply",
    fallback: () => buildFallbackReply(params.supportingEvidence),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().GROQ_FAST_MODEL,
        schema: replyDraftOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          mentionText: params.mentionText,
          classification: params.classification,
          conversationContext: params.conversationContext,
          supportingEvidence: params.supportingEvidence.join("\n")
        })
      })
  });
}
