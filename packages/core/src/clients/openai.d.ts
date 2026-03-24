import OpenAI from "openai";
import { z, type ZodTypeAny } from "zod";
export declare function getOpenAIClient(): OpenAI;
export declare function runStructuredPrompt<T extends ZodTypeAny>(params: {
    model: string;
    schema: T;
    schemaName: string;
    systemPrompt: string;
    userPrompt: string;
}): Promise<z.core.output<T>>;
export declare function classifyText(params: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
}): Promise<string>;
export declare function parseJsonOutput<T extends ZodTypeAny>(schema: T, raw: string): z.core.output<T>;
export declare const jsonStringSchema: z.ZodObject<{
    value: z.ZodString;
}, z.core.$strip>;
