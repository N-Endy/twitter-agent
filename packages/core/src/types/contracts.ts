import { z } from "zod";

export const sourceKindSchema = z.enum(["URL", "RSS", "X_POST", "X_ACCOUNT"]);
export const draftStatusSchema = z.enum([
  "PENDING_QA",
  "NEEDS_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHING",
  "PUBLISHED",
  "REJECTED"
]);
export const moderationDecisionSchema = z.enum(["ALLOW", "REVIEW", "BLOCK", "IGNORE", "ESCALATE"]);
export const promptKindSchema = z.enum([
  "STRATEGIST",
  "IDEATION",
  "WRITER",
  "VOICE_TUNER",
  "EDITOR",
  "VOICE_CHECKER",
  "COMPLIANCE_CHECKER",
  "REPLY_CLASSIFIER",
  "REPLY_DRAFTER",
  "ESCALATION"
]);
export const mentionCategorySchema = z.enum([
  "QUESTION",
  "PRAISE",
  "CRITIQUE",
  "TROLL",
  "SPAM",
  "PARTNERSHIP",
  "SENSITIVE",
  "OTHER"
]);
export const riskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const researchSourceSchema = z.object({
  id: z.string(),
  kind: sourceKindSchema,
  title: z.string(),
  uri: z.string().url(),
  isActive: z.boolean(),
  allowlistHandle: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export const researchSnapshotSchema = z.object({
  id: z.string(),
  sourceItemId: z.string(),
  title: z.string(),
  rawText: z.string(),
  summary: z.string(),
  sourcePublishedAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({})
});

export const contentIdeaSchema = z.object({
  id: z.string(),
  pillar: z.string(),
  hook: z.string(),
  angle: z.string(),
  audience: z.string(),
  rationale: z.string(),
  tags: z.array(z.string()),
  sourceBacked: z.boolean(),
  topical: z.boolean()
});

export const reviewDecisionSchema = z.object({
  status: moderationDecisionSchema,
  notes: z.string(),
  issues: z.array(z.string()),
  rewrite: z.string().nullable(),
  voiceScore: z.number().min(0).max(10),
  clarityScore: z.number().min(0).max(10),
  noveltyScore: z.number().min(0).max(10),
  safetyScore: z.number().min(0).max(10),
  sourceConfidenceScore: z.number().min(0).max(10)
});

export const scheduleSlotSchema = z.object({
  id: z.string(),
  slotAt: z.string().datetime(),
  timezone: z.string(),
  isExperimental: z.boolean()
});

export const publishResultSchema = z.object({
  xPostId: z.string(),
  postedAt: z.string().datetime(),
  rateLimitRemaining: z.number().nullable(),
  raw: z.record(z.string(), z.unknown()).default({})
});

export const mentionRecordSchema = z.object({
  id: z.string(),
  xMentionId: z.string(),
  conversationId: z.string().nullable(),
  authorId: z.string(),
  authorUsername: z.string(),
  text: z.string(),
  receivedAt: z.string().datetime()
});

export const mentionClassificationSchema = z.object({
  category: mentionCategorySchema,
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "MIXED"]),
  userIntent: z.string(),
  riskLevel: riskLevelSchema,
  shouldRespond: z.boolean(),
  requiresEscalation: z.boolean(),
  rationale: z.string()
});

export const replySuggestionSchema = z.object({
  suggestedReply: z.string(),
  rationale: z.string(),
  confidence: z.number().min(0).max(1),
  toneChecklist: z.array(z.string()),
  safetyNotes: z.array(z.string())
});

export const moderationEventSchema = z.object({
  decision: moderationDecisionSchema,
  reasons: z.array(z.string()),
  riskLevel: riskLevelSchema,
  requiresHumanApproval: z.boolean()
});

export const auditEventSchema = z.object({
  actor: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  details: z.record(z.string(), z.unknown()).default({})
});

export type ResearchSource = z.infer<typeof researchSourceSchema>;
export type ResearchSnapshot = z.infer<typeof researchSnapshotSchema>;
export type ContentIdea = z.infer<typeof contentIdeaSchema>;
export type ReviewDecision = z.infer<typeof reviewDecisionSchema>;
export type ScheduleSlot = z.infer<typeof scheduleSlotSchema>;
export type PublishResult = z.infer<typeof publishResultSchema>;
export type MentionRecord = z.infer<typeof mentionRecordSchema>;
export type MentionClassification = z.infer<typeof mentionClassificationSchema>;
export type ReplySuggestion = z.infer<typeof replySuggestionSchema>;
export type ModerationDecision = z.infer<typeof moderationEventSchema>;
export type AuditEvent = z.infer<typeof auditEventSchema>;
export type PromptKind = z.infer<typeof promptKindSchema>;
