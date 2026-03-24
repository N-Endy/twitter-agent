export declare const SourceKind: {
    readonly URL: "URL";
    readonly RSS: "RSS";
    readonly X_POST: "X_POST";
    readonly X_ACCOUNT: "X_ACCOUNT";
};
export type SourceKind = (typeof SourceKind)[keyof typeof SourceKind];
export declare const IdeaStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly ARCHIVED: "ARCHIVED";
};
export type IdeaStatus = (typeof IdeaStatus)[keyof typeof IdeaStatus];
export declare const DraftStatus: {
    readonly PENDING_QA: "PENDING_QA";
    readonly NEEDS_REVIEW: "NEEDS_REVIEW";
    readonly APPROVED: "APPROVED";
    readonly SCHEDULED: "SCHEDULED";
    readonly PUBLISHED: "PUBLISHED";
    readonly REJECTED: "REJECTED";
};
export type DraftStatus = (typeof DraftStatus)[keyof typeof DraftStatus];
export declare const ReviewStatus: {
    readonly PASS: "PASS";
    readonly FAIL: "FAIL";
    readonly REWRITE: "REWRITE";
};
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];
export declare const ScheduleStatus: {
    readonly OPEN: "OPEN";
    readonly RESERVED: "RESERVED";
    readonly POSTED: "POSTED";
    readonly SKIPPED: "SKIPPED";
};
export type ScheduleStatus = (typeof ScheduleStatus)[keyof typeof ScheduleStatus];
export declare const MentionStatus: {
    readonly NEW: "NEW";
    readonly CLASSIFIED: "CLASSIFIED";
    readonly DRAFTED: "DRAFTED";
    readonly APPROVED: "APPROVED";
    readonly SENT: "SENT";
    readonly IGNORED: "IGNORED";
    readonly ESCALATED: "ESCALATED";
    readonly BLOCKED: "BLOCKED";
};
export type MentionStatus = (typeof MentionStatus)[keyof typeof MentionStatus];
export declare const ReplyActionType: {
    readonly APPROVE: "APPROVE";
    readonly IGNORE: "IGNORE";
    readonly SEND: "SEND";
    readonly REJECT: "REJECT";
    readonly ESCALATE: "ESCALATE";
};
export type ReplyActionType = (typeof ReplyActionType)[keyof typeof ReplyActionType];
export declare const MetricWindow: {
    readonly H1: "H1";
    readonly D1: "D1";
    readonly D7: "D7";
};
export type MetricWindow = (typeof MetricWindow)[keyof typeof MetricWindow];
export declare const PromptKind: {
    readonly STRATEGIST: "STRATEGIST";
    readonly IDEATION: "IDEATION";
    readonly WRITER: "WRITER";
    readonly EDITOR: "EDITOR";
    readonly VOICE_CHECKER: "VOICE_CHECKER";
    readonly COMPLIANCE_CHECKER: "COMPLIANCE_CHECKER";
    readonly REPLY_CLASSIFIER: "REPLY_CLASSIFIER";
    readonly REPLY_DRAFTER: "REPLY_DRAFTER";
    readonly ESCALATION: "ESCALATION";
};
export type PromptKind = (typeof PromptKind)[keyof typeof PromptKind];
export declare const ModerationDecision: {
    readonly ALLOW: "ALLOW";
    readonly REVIEW: "REVIEW";
    readonly BLOCK: "BLOCK";
    readonly IGNORE: "IGNORE";
    readonly ESCALATE: "ESCALATE";
};
export type ModerationDecision = (typeof ModerationDecision)[keyof typeof ModerationDecision];
