export declare function moderateDraft(params: {
    text: string;
    sourceBacked: boolean;
    topical: boolean;
    mentionsThirdParty?: boolean;
}): {
    decision: "ALLOW" | "REVIEW" | "BLOCK" | "IGNORE" | "ESCALATE";
    reasons: string[];
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    requiresHumanApproval: boolean;
};
export declare function moderateMention(text: string): {
    decision: "ALLOW" | "REVIEW" | "BLOCK" | "IGNORE" | "ESCALATE";
    reasons: string[];
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    requiresHumanApproval: boolean;
};
