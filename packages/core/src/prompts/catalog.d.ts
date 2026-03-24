import { type PromptKind } from "../types/contracts";
export type PromptDefinition = {
    kind: PromptKind;
    name: string;
    schemaName: string;
    systemPrompt: string;
    userTemplate: string;
};
export declare const promptCatalog: Record<PromptKind, PromptDefinition>;
export declare function ensurePromptKind(value: string): "STRATEGIST" | "IDEATION" | "WRITER" | "EDITOR" | "VOICE_CHECKER" | "COMPLIANCE_CHECKER" | "REPLY_CLASSIFIER" | "REPLY_DRAFTER" | "ESCALATION";
export declare function renderPromptTemplate(template: string, variables: Record<string, string>): string;
