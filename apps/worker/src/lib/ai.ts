import {
  contentIdeaBatchSchema,
  draftReviewOutputSchema,
  getOpenAIErrorMessage,
  hookPatternSchema,
  performanceLearningSchema,
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
  threadDraftOutputSchema,
  tweetDraftOutputSchema,
  getEnv
} from "@twitter-agent/core";

const AI_PROVIDER_PAUSE_MS = 60 * 60 * 1000;

let aiProviderPauseUntil = 0;

const fallbackStopwords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "being",
  "between",
  "could",
  "every",
  "first",
  "from",
  "have",
  "into",
  "just",
  "like",
  "more",
  "most",
  "only",
  "other",
  "over",
  "really",
  "that",
  "their",
  "them",
  "there",
  "these",
  "they",
  "this",
  "those",
  "today",
  "very",
  "want",
  "when",
  "with",
  "would",
  "your"
]);

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

function uniqueStrings(values: Array<string | null | undefined>, limit?: number) {
  const seen = new Set<string>();
  const items: string[] = [];

  for (const value of values) {
    const normalized = value?.replace(/\s+/g, " ").trim();

    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    items.push(normalized);

    if (typeof limit === "number" && items.length >= limit) {
      break;
    }
  }

  return items;
}

function slugTag(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractTopicTerms(text: string, limit: number) {
  const counts = new Map<string, number>();

  for (const rawWord of text.toLowerCase().match(/[a-z0-9]{4,}/g) ?? []) {
    if (fallbackStopwords.has(rawWord)) {
      continue;
    }

    counts.set(rawWord, (counts.get(rawWord) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function buildGenericAudience(sourceName: string, sourceGuidance: string) {
  const fromGuidance = sourceGuidance
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.toLowerCase().startsWith("audience:"));

  if (fromGuidance) {
    return fromGuidance.replace(/^audience:\s*/i, "").trim();
  }

  return `People who follow ${sourceName} for this topic and tone.`;
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
      console.warn(`[ai] ${params.label} falling back after AI provider quota error: ${reason}`);
      return params.fallback();
    }

    if (isOpenAIRateLimitError(error)) {
      console.warn(`[ai] ${params.label} falling back after AI provider rate limit: ${reason}`);
      return params.fallback();
    }

    if (isOpenAISchemaValidationError(error)) {
      console.warn(`[ai] ${params.label} falling back after AI provider schema validation error: ${reason}`);
      return params.fallback();
    }

    if (isOpenAIToolUseError(error)) {
      console.warn(`[ai] ${params.label} falling back after AI provider tool-use error: ${reason}`);
      return params.fallback();
    }

    throw error;
  }
}

function buildFallbackResearch(rawText: string, title: string, sourceType: string, sourceGuidance: string) {
  const keyFacts = sentenceChunks(rawText, 5);
  const topicTerms = extractTopicTerms(`${title} ${sourceGuidance} ${keyFacts.join(" ")}`, 4);
  const pillarCandidates = uniqueStrings(
    topicTerms.map((term) => toTitleCase(term)),
    4
  );

  return researchExtractionSchema.parse({
    summary: keyFacts.slice(0, 2).join(" "),
    keyFacts,
    quoteCandidates: keyFacts.slice(0, 2),
    hookIdeas: keyFacts
      .map((fact) => `A specific angle here: ${fact}`)
      .slice(0, 4),
    pillarCandidates:
      pillarCandidates.length > 0 ? pillarCandidates : uniqueStrings([title, sourceType, "Commentary", "Story"], 4),
    safetyFlags: []
  });
}

function buildFallbackIdeas(params: {
  keyFacts: string[];
  sourceName: string;
  sourceGuidance: string;
  sourcePillars: string[];
  sourceHooks: string[];
}) {
  const fallbackPillars = uniqueStrings(
    [...params.sourcePillars, ...extractTopicTerms(`${params.sourceName} ${params.sourceGuidance}`, 4).map(toTitleCase)],
    4
  );
  const fallbackHooks = uniqueStrings([...params.sourceHooks, ...params.keyFacts], 7);
  const audience = buildGenericAudience(params.sourceName, params.sourceGuidance);
  const tags = uniqueStrings(
    [
      ...fallbackPillars.map((pillar) => slugTag(pillar)),
      ...extractTopicTerms(`${params.sourceName} ${params.sourceGuidance}`, 3).map((term) => slugTag(term))
    ],
    4
  );

  return contentIdeaBatchSchema.parse({
    ideas: params.keyFacts.slice(0, 7).map((fact, index) => ({
      pillar: fallbackPillars[index % Math.max(fallbackPillars.length, 1)] ?? "Commentary",
      hook:
        fallbackHooks[index] ??
        `A source-backed angle from ${params.sourceName}: ${fact.slice(0, 90)}`,
      angle: `Turn the source insight into a post that stays in ${params.sourceName}'s lane and highlights one clear takeaway.`,
      audience,
      rationale: `Grounded in stored research and aligned with the source profile for ${params.sourceName}.`,
      supportingEvidence: [fact],
      topical: false,
      tags: tags.length > 0 ? tags : ["commentary", "source-led"]
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

export async function extractResearch(rawText: string, title: string, sourceType: string, sourceGuidance: string) {
  const prompt = promptCatalog.STRATEGIST;
  return runWithProviderFallback({
    label: "extractResearch",
    fallback: () => buildFallbackResearch(rawText, title, sourceType, sourceGuidance),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().OPENAI_FAST_MODEL,
        fallbackModel: getEnv().GROQ_FAST_MODEL,
        schema: researchExtractionSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          title,
          sourceType,
          sourceGuidance,
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
  sourceName: string;
  sourceGuidance: string;
  sourceHooks: string[];
  sourcePillars: string[];
  performanceInsights?: string;
}) {
  const prompt = promptCatalog.IDEATION;
  return runWithProviderFallback({
    label: "generateIdeas",
    fallback: () =>
      buildFallbackIdeas({
        keyFacts: params.keyFacts,
        sourceName: params.sourceName,
        sourceGuidance: params.sourceGuidance,
        sourceHooks: params.sourceHooks,
        sourcePillars: params.sourcePillars
      }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().OPENAI_QUALITY_MODEL,
        fallbackModel: getEnv().GROQ_QUALITY_MODEL,
        schema: contentIdeaBatchSchema,
        schemaName: prompt.schemaName,
        systemPrompt: params.performanceInsights
          ? `${prompt.systemPrompt}\n\nPerformance insights from past posts:\n${params.performanceInsights}`
          : prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          sourceGuidance: params.sourceGuidance,
          sourceHooks: params.sourceHooks.join("\n") || "None provided",
          sourcePillars: params.sourcePillars.join("\n") || "None provided",
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
  sourceGuidance: string;
  voiceExamplesText?: string;
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
        model: getEnv().OPENAI_QUALITY_MODEL,
        fallbackModel: getEnv().GROQ_QUALITY_MODEL,
        schema: tweetDraftOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          sourceGuidance: params.sourceGuidance,
          pillar: params.pillar,
          hook: params.hook,
          angle: params.angle,
          audience: params.audience,
          supportingEvidence: params.supportingEvidence.join("\n"),
          voiceNotes: params.voiceNotes,
          voiceExamples: params.voiceExamplesText ?? "No curated voice examples yet."
        })
      })
  });
}

export async function writeThread(params: {
  pillar: string;
  hook: string;
  angle: string;
  audience: string;
  supportingEvidence: string[];
  voiceNotes: string;
  sourceGuidance: string;
  voiceExamplesText?: string;
  performanceInsights?: string;
}) {
  const prompt = promptCatalog.THREAD_WRITER;
  return runWithProviderFallback({
    label: "writeThread",
    fallback: () => {
      const part1 = `${params.hook}\n\n${params.angle}`;
      const part2 = params.supportingEvidence[0] ?? "Here's what the data shows.";
      const part3 = params.supportingEvidence[1] ?? "The lesson is clear.";
      const part4 = "What's your take on this? Drop a reply.";
      return threadDraftOutputSchema.parse({
        parts: [part1.slice(0, 270), part2.slice(0, 270), part3.slice(0, 270), part4],
        hookSummary: params.hook,
        ctaPart: part4,
        rationale: "Fallback thread composed from idea evidence.",
        hookTag: params.hook.split(" ").slice(0, 4).join("-").toLowerCase(),
        pillarTag: params.pillar.toLowerCase().replace(/\s+/g, "-"),
        evidenceUsed: params.supportingEvidence.slice(0, 3),
        confidence: 0.45
      });
    },
    execute: () =>
      runStructuredPrompt({
        model: getEnv().OPENAI_QUALITY_MODEL,
        fallbackModel: getEnv().GROQ_QUALITY_MODEL,
        schema: threadDraftOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          sourceGuidance: params.sourceGuidance,
          pillar: params.pillar,
          hook: params.hook,
          angle: params.angle,
          audience: params.audience,
          supportingEvidence: params.supportingEvidence.join("\n"),
          voiceNotes: params.voiceNotes,
          voiceExamples: params.voiceExamplesText ?? "No curated voice examples yet.",
          performanceInsights: params.performanceInsights ?? "No performance data yet."
        })
      })
  });
}

export async function analyzePerformance(params: {
  winners: string[];
  losers: string[];
  voiceGuide: string;
  previousLearnings?: string;
}) {
  const prompt = promptCatalog.PERFORMANCE_ANALYST;
  return runWithProviderFallback({
    label: "analyzePerformance",
    fallback: () =>
      performanceLearningSchema.parse({
        analysis: "Insufficient data for AI analysis. Continue publishing to build a performance baseline.",
        patterns: ["source-backed-content", "specific-examples"],
        antiPatterns: ["generic-motivation", "unsupported-claims"],
        recommendations: ["Focus on posts grounded in real research.", "Vary hook styles."]
      }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().OPENAI_QUALITY_MODEL,
        fallbackModel: getEnv().GROQ_QUALITY_MODEL,
        schema: performanceLearningSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          winners: params.winners.join("\n---\n") || "No winners yet",
          losers: params.losers.join("\n---\n") || "No losers yet",
          voiceGuide: params.voiceGuide,
          previousLearnings: params.previousLearnings ?? "No previous learnings."
        })
      })
  });
}

export function classifyHookPattern(hookText: string) {
  const lowered = hookText.toLowerCase();

  if (lowered.includes("?")) return "question";
  if (/\d+%|\d+x|\$\d/.test(lowered)) return "stat_lead";
  if (/\bi (was|did|had|used|tried|built|learned)\b/.test(lowered)) return "story";
  if (/\bnot\b|\bnever\b|\bstop\b|\bwrong\b|\blie\b/.test(lowered)) return "contrarian";
  if (/\bunpopular\b|\bhot take\b|\bcontroversial\b/.test(lowered)) return "controversial";
  if (/\beveryone\b.*\bbut\b|\bmost people\b/.test(lowered)) return "pattern_break";
  if (/\bnoticed\b|\brealized\b|\bthe thing about\b/.test(lowered)) return "observation";

  return "lesson";
}

export async function reviewDraft(params: {
  draftText: string;
  supportingEvidence: string[];
  voiceRules: string;
  voiceExamplesText?: string;
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
        model: getEnv().OPENAI_FAST_MODEL,
        fallbackModel: getEnv().GROQ_FAST_MODEL,
        schema: draftReviewOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          draftText: params.draftText,
          supportingEvidence: params.supportingEvidence.join("\n"),
          voiceRules: params.voiceRules,
          voiceExamples: params.voiceExamplesText ?? "No curated voice examples yet."
        })
      })
  });
}

export async function tuneDraftInVoice(params: {
  draftText: string;
  humanRewrite: string;
  operatorFeedback: string;
  voiceNotes: string;
  sourceGuidance: string;
  voiceExamplesText?: string;
}) {
  const prompt = promptCatalog.VOICE_TUNER;
  return runWithProviderFallback({
    label: "tuneDraftInVoice",
    fallback: () =>
      buildFallbackDraft({
        hook: params.humanRewrite.split(/\s+/).slice(0, 10).join(" "),
        angle: params.operatorFeedback || "Keep the human rewrite as the strongest guide.",
        pillar: "voice-tuned",
        supportingEvidence: [params.humanRewrite]
      }),
    execute: () =>
      runStructuredPrompt({
        model: getEnv().OPENAI_QUALITY_MODEL,
        fallbackModel: getEnv().GROQ_QUALITY_MODEL,
        schema: tweetDraftOutputSchema,
        schemaName: prompt.schemaName,
        systemPrompt: prompt.systemPrompt,
        userPrompt: renderPromptTemplate(prompt.userTemplate, {
          sourceGuidance: params.sourceGuidance,
          voiceNotes: params.voiceNotes,
          draftText: params.draftText,
          humanRewrite: params.humanRewrite,
          operatorFeedback: params.operatorFeedback || "No extra operator feedback.",
          voiceExamples: params.voiceExamplesText ?? "No curated voice examples yet."
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
        model: getEnv().OPENAI_FAST_MODEL,
        fallbackModel: getEnv().GROQ_FAST_MODEL,
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
        model: getEnv().OPENAI_FAST_MODEL,
        fallbackModel: getEnv().GROQ_FAST_MODEL,
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

