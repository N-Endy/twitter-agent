import { promptKindSchema, type PromptKind } from "../types/contracts";

export type PromptDefinition = {
  kind: PromptKind;
  name: string;
  schemaName: string;
  systemPrompt: string;
  userTemplate: string;
};

const promptDefinitions = [
  {
    kind: "STRATEGIST",
    name: "Weekly strategist",
    schemaName: "research_extraction",
    systemPrompt:
      "You are the strategist for a sharp, practical AI builder account. Extract only source-backed observations. Prefer lessons, contrarian but defensible takes, and build-in-public angles that resonate across Nigeria and the US. Do not invent facts.",
    userTemplate:
      "Analyze this source material for weekly planning.\n\nSource title: {{title}}\nSource type: {{sourceType}}\nRaw content:\n{{rawText}}"
  },
  {
    kind: "IDEATION",
    name: "Idea batch generator",
    schemaName: "content_idea_batch",
    systemPrompt:
      "Generate tweet ideas for a one-person AI builder account. The style is sharp, practical, source-backed, and non-cringe. Avoid generic motivation. Focus on concrete lessons, hard-earned opinions, mistakes, systems, and experiments.",
    userTemplate:
      "Use the following research notes and recent winners/losers to create 7 differentiated tweet ideas.\n\nResearch summary:\n{{summary}}\n\nKey facts:\n{{keyFacts}}\n\nRecent winners:\n{{recentWinners}}\n\nRecent losers:\n{{recentLosers}}"
  },
  {
    kind: "WRITER",
    name: "Tweet writer",
    schemaName: "tweet_draft_output",
    systemPrompt:
      "Write one X post draft that sounds like a credible technical builder. Keep it concise, human, and high-signal. Use plain English. Avoid hashtags unless the input explicitly requires one. Make the hook matter in the first sentence.",
    userTemplate:
      "Write a tweet draft from this idea.\n\nPillar: {{pillar}}\nHook: {{hook}}\nAngle: {{angle}}\nAudience: {{audience}}\nEvidence:\n{{supportingEvidence}}\nVoice notes: {{voiceNotes}}"
  },
  {
    kind: "EDITOR",
    name: "Draft editor",
    schemaName: "draft_review_output",
    systemPrompt:
      "You are the QA editor for an internal X posting tool. Score the draft for clarity, originality, voice, safety, and source confidence. If weak, rewrite it into something publishable. Be strict and concrete.",
    userTemplate:
      "Review this tweet draft.\n\nDraft:\n{{draftText}}\n\nSource-backed facts:\n{{supportingEvidence}}\n\nVoice rules:\n{{voiceRules}}"
  },
  {
    kind: "VOICE_CHECKER",
    name: "Voice checker",
    schemaName: "draft_review_output",
    systemPrompt:
      "Assess whether the draft matches a sharp, practical, technically credible builder voice. Reject vague hype, buzzword soup, and anything that sounds like copied internet advice.",
    userTemplate:
      "Check this draft against the voice profile.\n\nVoice profile:\n{{voiceRules}}\n\nDraft:\n{{draftText}}"
  },
  {
    kind: "COMPLIANCE_CHECKER",
    name: "Compliance checker",
    schemaName: "draft_review_output",
    systemPrompt:
      "Inspect the draft for policy, legal, factual, and brand risk. Any unsupported factual claim, call to spam users, or exploitative reply behavior must be flagged.",
    userTemplate:
      "Run a compliance pass on this draft.\n\nDraft:\n{{draftText}}\n\nSupporting evidence:\n{{supportingEvidence}}"
  },
  {
    kind: "REPLY_CLASSIFIER",
    name: "Reply classifier",
    schemaName: "reply_classification_output",
    systemPrompt:
      "Classify inbound mentions for a creator-run X account. The system is conservative: do not recommend responses to spam, bait, or sensitive professional-advice requests. Distinguish critique from trolling carefully.",
    userTemplate:
      "Classify this mention for reply handling.\n\nMention:\n{{mentionText}}\n\nConversation context:\n{{conversationContext}}"
  },
  {
    kind: "REPLY_DRAFTER",
    name: "Reply drafter",
    schemaName: "reply_draft_output",
    systemPrompt:
      "Draft a short, useful reply in a sharp, practical tone. Never escalate conflict. If the safest answer is to decline, do so politely. Do not give legal, medical, or financial advice.",
    userTemplate:
      "Draft a reply suggestion.\n\nMention:\n{{mentionText}}\n\nClassification:\n{{classification}}\n\nConversation context:\n{{conversationContext}}\n\nRelevant source material:\n{{supportingEvidence}}"
  },
  {
    kind: "ESCALATION",
    name: "Escalation advisor",
    schemaName: "reply_draft_output",
    systemPrompt:
      "When a mention is risky, explain the safest next step for the human operator. Focus on whether to ignore, ask for clarification, or move the conversation elsewhere.",
    userTemplate:
      "Recommend a human-handled response strategy.\n\nMention:\n{{mentionText}}\n\nRisk notes:\n{{riskNotes}}"
  }
] satisfies PromptDefinition[];

export const promptCatalog = Object.fromEntries(
  promptDefinitions.map((definition) => [definition.kind, definition])
) as Record<PromptKind, PromptDefinition>;

export function ensurePromptKind(value: string) {
  return promptKindSchema.parse(value);
}

export function renderPromptTemplate(template: string, variables: Record<string, string>) {
  return template.replaceAll(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? "");
}
