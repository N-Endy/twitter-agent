import { z } from "zod";
export declare const sourceKindSchema: z.ZodEnum<{
    URL: "URL";
    RSS: "RSS";
    X_POST: "X_POST";
    X_ACCOUNT: "X_ACCOUNT";
}>;
export declare const draftStatusSchema: z.ZodEnum<{
    PENDING_QA: "PENDING_QA";
    NEEDS_REVIEW: "NEEDS_REVIEW";
    APPROVED: "APPROVED";
    SCHEDULED: "SCHEDULED";
    PUBLISHED: "PUBLISHED";
    REJECTED: "REJECTED";
}>;
export declare const moderationDecisionSchema: z.ZodEnum<{
    ALLOW: "ALLOW";
    REVIEW: "REVIEW";
    BLOCK: "BLOCK";
    IGNORE: "IGNORE";
    ESCALATE: "ESCALATE";
}>;
export declare const promptKindSchema: z.ZodEnum<{
    STRATEGIST: "STRATEGIST";
    IDEATION: "IDEATION";
    WRITER: "WRITER";
    EDITOR: "EDITOR";
    VOICE_CHECKER: "VOICE_CHECKER";
    COMPLIANCE_CHECKER: "COMPLIANCE_CHECKER";
    REPLY_CLASSIFIER: "REPLY_CLASSIFIER";
    REPLY_DRAFTER: "REPLY_DRAFTER";
    ESCALATION: "ESCALATION";
}>;
export declare const mentionCategorySchema: z.ZodEnum<{
    QUESTION: "QUESTION";
    PRAISE: "PRAISE";
    CRITIQUE: "CRITIQUE";
    TROLL: "TROLL";
    SPAM: "SPAM";
    PARTNERSHIP: "PARTNERSHIP";
    SENSITIVE: "SENSITIVE";
    OTHER: "OTHER";
}>;
export declare const riskLevelSchema: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
    CRITICAL: "CRITICAL";
}>;
export declare const researchSourceSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<{
        URL: "URL";
        RSS: "RSS";
        X_POST: "X_POST";
        X_ACCOUNT: "X_ACCOUNT";
    }>;
    title: z.ZodString;
    uri: z.ZodString;
    isActive: z.ZodBoolean;
    allowlistHandle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const researchSnapshotSchema: z.ZodObject<{
    id: z.ZodString;
    sourceItemId: z.ZodString;
    title: z.ZodString;
    rawText: z.ZodString;
    summary: z.ZodString;
    sourcePublishedAt: z.ZodNullable<z.ZodString>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const contentIdeaSchema: z.ZodObject<{
    id: z.ZodString;
    pillar: z.ZodString;
    hook: z.ZodString;
    angle: z.ZodString;
    audience: z.ZodString;
    rationale: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    sourceBacked: z.ZodBoolean;
    topical: z.ZodBoolean;
}, z.core.$strip>;
export declare const reviewDecisionSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ALLOW: "ALLOW";
        REVIEW: "REVIEW";
        BLOCK: "BLOCK";
        IGNORE: "IGNORE";
        ESCALATE: "ESCALATE";
    }>;
    notes: z.ZodString;
    issues: z.ZodArray<z.ZodString>;
    rewrite: z.ZodNullable<z.ZodString>;
    voiceScore: z.ZodNumber;
    clarityScore: z.ZodNumber;
    noveltyScore: z.ZodNumber;
    safetyScore: z.ZodNumber;
    sourceConfidenceScore: z.ZodNumber;
}, z.core.$strip>;
export declare const scheduleSlotSchema: z.ZodObject<{
    id: z.ZodString;
    slotAt: z.ZodString;
    timezone: z.ZodString;
    isExperimental: z.ZodBoolean;
}, z.core.$strip>;
export declare const publishResultSchema: z.ZodObject<{
    xPostId: z.ZodString;
    postedAt: z.ZodString;
    rateLimitRemaining: z.ZodNullable<z.ZodNumber>;
    raw: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const mentionRecordSchema: z.ZodObject<{
    id: z.ZodString;
    xMentionId: z.ZodString;
    conversationId: z.ZodNullable<z.ZodString>;
    authorId: z.ZodString;
    authorUsername: z.ZodString;
    text: z.ZodString;
    receivedAt: z.ZodString;
}, z.core.$strip>;
export declare const mentionClassificationSchema: z.ZodObject<{
    category: z.ZodEnum<{
        QUESTION: "QUESTION";
        PRAISE: "PRAISE";
        CRITIQUE: "CRITIQUE";
        TROLL: "TROLL";
        SPAM: "SPAM";
        PARTNERSHIP: "PARTNERSHIP";
        SENSITIVE: "SENSITIVE";
        OTHER: "OTHER";
    }>;
    sentiment: z.ZodEnum<{
        POSITIVE: "POSITIVE";
        NEUTRAL: "NEUTRAL";
        NEGATIVE: "NEGATIVE";
        MIXED: "MIXED";
    }>;
    userIntent: z.ZodString;
    riskLevel: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    shouldRespond: z.ZodBoolean;
    requiresEscalation: z.ZodBoolean;
    rationale: z.ZodString;
}, z.core.$strip>;
export declare const replySuggestionSchema: z.ZodObject<{
    suggestedReply: z.ZodString;
    rationale: z.ZodString;
    confidence: z.ZodNumber;
    toneChecklist: z.ZodArray<z.ZodString>;
    safetyNotes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const moderationEventSchema: z.ZodObject<{
    decision: z.ZodEnum<{
        ALLOW: "ALLOW";
        REVIEW: "REVIEW";
        BLOCK: "BLOCK";
        IGNORE: "IGNORE";
        ESCALATE: "ESCALATE";
    }>;
    reasons: z.ZodArray<z.ZodString>;
    riskLevel: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    requiresHumanApproval: z.ZodBoolean;
}, z.core.$strip>;
export declare const auditEventSchema: z.ZodObject<{
    actor: z.ZodString;
    action: z.ZodString;
    entityType: z.ZodString;
    entityId: z.ZodString;
    details: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
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
