import { z } from "zod";

export const researchExtractionSchema = z.object({
  summary: z.string(),
  keyFacts: z.array(z.string()),
  quoteCandidates: z.array(z.string()),
  hookIdeas: z.array(z.string()),
  pillarCandidates: z.array(z.string()),
  safetyFlags: z.array(z.string())
});

export const contentIdeaBatchSchema = z.object({
  ideas: z.array(
    z.object({
      pillar: z.string(),
      hook: z.string(),
      angle: z.string(),
      audience: z.string(),
      rationale: z.string(),
      supportingEvidence: z.array(z.string()),
      topical: z.boolean(),
      tags: z.array(z.string())
    })
  )
});

export const tweetDraftOutputSchema = z.object({
  text: z.string(),
  rationale: z.string(),
  hookTag: z.string(),
  pillarTag: z.string(),
  evidenceUsed: z.array(z.string()),
  suggestedCta: z.string(),
  confidence: z.number().min(0).max(1)
});

export const draftReviewOutputSchema = z.object({
  approvedForReview: z.boolean(),
  voiceScore: z.number().min(0).max(10),
  clarityScore: z.number().min(0).max(10),
  noveltyScore: z.number().min(0).max(10),
  safetyScore: z.number().min(0).max(10),
  sourceConfidenceScore: z.number().min(0).max(10),
  issues: z.array(z.string()),
  rewrite: z.string()
});

export const replyClassificationOutputSchema = z.object({
  category: z.enum(["QUESTION", "PRAISE", "CRITIQUE", "TROLL", "SPAM", "PARTNERSHIP", "SENSITIVE", "OTHER"]),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "MIXED"]),
  userIntent: z.string(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  shouldRespond: z.boolean(),
  requiresEscalation: z.boolean(),
  rationale: z.string()
});

export const replyDraftOutputSchema = z.object({
  suggestedReply: z.string(),
  rationale: z.string(),
  confidence: z.number().min(0).max(1),
  toneChecklist: z.array(z.string()),
  safetyNotes: z.array(z.string())
});

export const threadDraftOutputSchema = z.object({
  parts: z.array(z.string()).min(2).max(10),
  hookSummary: z.string(),
  ctaPart: z.string(),
  rationale: z.string(),
  hookTag: z.string(),
  pillarTag: z.string(),
  evidenceUsed: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

export const performanceLearningSchema = z.object({
  analysis: z.string(),
  patterns: z.array(z.string()),
  antiPatterns: z.array(z.string()),
  recommendations: z.array(z.string())
});

export const hookPatternSchema = z.enum([
  "question",
  "stat_lead",
  "story",
  "contrarian",
  "controversial",
  "pattern_break",
  "observation",
  "lesson"
]);
