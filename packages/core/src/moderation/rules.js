import { moderationEventSchema } from "../types/contracts";
const sensitivePatterns = [
    /\bmedical\b/i,
    /\blegal\b/i,
    /\bfinancial\b/i,
    /\bsuicide\b/i,
    /\bkill myself\b/i,
    /\binvestment advice\b/i
];
const aggressionPatterns = [/\bidiot\b/i, /\bstupid\b/i, /\bdumb\b/i, /\bscam\b/i];
const spamPatterns = [/\bDM me\b/i, /\bpromo code\b/i, /\bbuy now\b/i, /\bguaranteed\b/i];
const breakingNewsPatterns = [/\bbreaking\b/i, /\bjust happened\b/i, /\bconfirmed\b/i];
function makeDecision(input) {
    return moderationEventSchema.parse(input);
}
export function moderateDraft(params) {
    const reasons = [];
    if (spamPatterns.some((pattern) => pattern.test(params.text))) {
        reasons.push("Potentially spammy phrasing detected.");
    }
    if (breakingNewsPatterns.some((pattern) => pattern.test(params.text)) && !params.sourceBacked) {
        reasons.push("Breaking-news style claim without source backing.");
    }
    if (params.topical && !params.sourceBacked) {
        reasons.push("Topical post must be backed by a stored source.");
    }
    if (params.mentionsThirdParty) {
        reasons.push("Third-party mention requires explicit human review.");
    }
    if (reasons.length > 0) {
        return makeDecision({
            decision: reasons.some((reason) => reason.includes("without")) ? "BLOCK" : "REVIEW",
            reasons,
            riskLevel: reasons.some((reason) => reason.includes("without")) ? "HIGH" : "MEDIUM",
            requiresHumanApproval: true
        });
    }
    return makeDecision({
        decision: "ALLOW",
        reasons: ["Draft passes baseline moderation checks."],
        riskLevel: "LOW",
        requiresHumanApproval: true
    });
}
export function moderateMention(text) {
    const reasons = [];
    if (sensitivePatterns.some((pattern) => pattern.test(text))) {
        reasons.push("Sensitive professional-advice topic.");
    }
    if (aggressionPatterns.some((pattern) => pattern.test(text))) {
        reasons.push("Aggressive or insulting wording.");
    }
    if (spamPatterns.some((pattern) => pattern.test(text))) {
        reasons.push("Spam-like outreach language.");
    }
    if (reasons.length === 0) {
        return makeDecision({
            decision: "ALLOW",
            reasons: ["Mention is eligible for AI drafting and human review."],
            riskLevel: "LOW",
            requiresHumanApproval: true
        });
    }
    if (reasons.some((reason) => reason.includes("Sensitive"))) {
        return makeDecision({
            decision: "ESCALATE",
            reasons,
            riskLevel: "HIGH",
            requiresHumanApproval: true
        });
    }
    if (reasons.some((reason) => reason.includes("Aggressive"))) {
        return makeDecision({
            decision: "IGNORE",
            reasons,
            riskLevel: "MEDIUM",
            requiresHumanApproval: false
        });
    }
    return makeDecision({
        decision: "BLOCK",
        reasons,
        riskLevel: "MEDIUM",
        requiresHumanApproval: true
    });
}
