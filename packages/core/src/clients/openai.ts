import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z, type ZodTypeAny } from "zod";

import { getEnv } from "../env";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  const { OPENAI_API_KEY } = getEnv();

  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for AI features.");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  return cachedClient;
}

export async function runStructuredPrompt<T extends ZodTypeAny>(params: {
  model: string;
  schema: T;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const response = await getOpenAIClient().responses.parse({
    model: params.model,
    input: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userPrompt }
    ],
    text: {
      format: zodTextFormat(params.schema, params.schemaName)
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI response did not contain parsed structured output.");
  }

  return params.schema.parse(response.output_parsed);
}

export async function classifyText(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}) {
  const response = await getOpenAIClient().responses.create({
    model: params.model ?? getEnv().OPENAI_FAST_MODEL,
    input: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userPrompt }
    ]
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("OpenAI response did not include output_text.");
  }

  return outputText;
}

export function parseJsonOutput<T extends ZodTypeAny>(schema: T, raw: string) {
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
}

export const jsonStringSchema = z.object({
  value: z.string()
});
