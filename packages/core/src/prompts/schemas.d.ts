import { z } from "zod";
export declare const researchExtractionSchema: z.ZodObject<{
    summary: z.ZodString;
    keyFacts: z.ZodArray<z.ZodString>;
    quoteCandidates: z.ZodArray<z.ZodString>;
    hookIdeas: z.ZodArray<z.ZodString>;
    pillarCandidates: z.ZodArray<z.ZodString>;
    safetyFlags: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const contentIdeaBatchSchema: z.ZodObject<{
    ideas: z.ZodArray<z.ZodObject<{
        pillar: z.ZodString;
        hook: z.ZodString;
        angle: z.ZodString;
        audience: z.ZodString;
        rationale: z.ZodString;
        supportingEvidence: z.ZodArray<z.ZodString>;
        topical: z.ZodBoolean;
        tags: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const tweetDraftOutputSchema: z.ZodObject<{
    text: z.ZodString;
    rationale: z.ZodString;
    hookTag: z.ZodString;
    pillarTag: z.ZodString;
    evidenceUsed: z.ZodArray<z.ZodString>;
    suggestedCta: z.ZodString;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export declare const draftReviewOutputSchema: z.ZodObject<{
    approvedForReview: z.ZodBoolean;
    voiceScore: z.ZodNumber;
    clarityScore: z.ZodNumber;
    noveltyScore: z.ZodNumber;
    safetyScore: z.ZodNumber;
    sourceConfidenceScore: z.ZodNumber;
    issues: z.ZodArray<z.ZodString>;
    rewrite: z.ZodString;
}, z.core.$strip>;
export declare const replyClassificationOutputSchema: z.ZodObject<{
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
export declare const replyDraftOutputSchema: z.ZodObject<{
    suggestedReply: z.ZodString;
    rationale: z.ZodString;
    confidence: z.ZodNumber;
    toneChecklist: z.ZodArray<z.ZodString>;
    safetyNotes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
