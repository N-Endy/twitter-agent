import OpenAI from "openai";
import { z, type ZodTypeAny } from "zod";

import { getEnv } from "../env";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

let cachedClient: OpenAI | null = null;
let cachedApiKey: string | null = null;

function readErrorProperty(error: unknown, key: string) {
  if (!error || typeof error !== "object" || !(key in error)) {
    return null;
  }

  const value = (error as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? value : null;
}

function readNestedOpenAIError(error: unknown) {
  if (!error || typeof error !== "object" || !("error" in error)) {
    return null;
  }

  const nested = (error as Record<string, unknown>).error;
  return nested && typeof nested === "object" ? (nested as Record<string, unknown>) : null;
}

function getProviderApiKey() {
  const env = getEnv();
  return env.GROQ_API_KEY ?? env.OPENAI_API_KEY ?? null;
}

function getFastModel() {
  const env = getEnv();
  return env.GROQ_FAST_MODEL ?? env.OPENAI_FAST_MODEL ?? "openai/gpt-oss-20b";
}

function getResponseText(content: unknown) {
  if (typeof content === "string" && content.trim().length > 0) {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .map((item) => {
        if (!item || typeof item !== "object" || !("type" in item)) {
          return null;
        }

        if ((item as { type?: string }).type !== "text") {
          return null;
        }

        const value = (item as { text?: string }).text;
        return typeof value === "string" ? value : null;
      })
      .filter((item): item is string => Boolean(item))
      .join("\n")
      .trim();

    if (text.length > 0) {
      return text;
    }
  }

  return null;
}

function buildJsonSchema(schema: ZodTypeAny) {
  const jsonSchema = z.toJSONSchema(schema);
  return "$schema" in jsonSchema ? (({ $schema: _unused, ...rest }) => rest)(jsonSchema) : jsonSchema;
}

export function getGroqClient() {
  const apiKey = getProviderApiKey();

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required for AI features.");
  }

  if (!cachedClient || cachedApiKey !== apiKey) {
    cachedClient = new OpenAI({
      apiKey,
      baseURL: GROQ_BASE_URL
    });
    cachedApiKey = apiKey;
  }

  return cachedClient;
}

export const getOpenAIClient = getGroqClient;

export function getOpenAIErrorStatus(error: unknown) {
  const status = readErrorProperty(error, "status");
  return typeof status === "number" ? status : null;
}

export function getOpenAIErrorCode(error: unknown) {
  const topLevelCode = readErrorProperty(error, "code");
  if (typeof topLevelCode === "string") {
    return topLevelCode;
  }

  const nested = readNestedOpenAIError(error);
  return nested && typeof nested.code === "string" ? nested.code : null;
}

export function getOpenAIErrorMessage(error: unknown) {
  const topLevelMessage = readErrorProperty(error, "message");
  if (typeof topLevelMessage === "string" && topLevelMessage.trim().length > 0) {
    return topLevelMessage;
  }

  const nested = readNestedOpenAIError(error);
  return nested && typeof nested.message === "string" ? nested.message : "LLM provider request failed.";
}

export function isOpenAIQuotaError(error: unknown) {
  const status = getOpenAIErrorStatus(error);
  const code = getOpenAIErrorCode(error);

  return code === "insufficient_quota" || (status === 429 && code === "billing_hard_limit_reached");
}

export function isOpenAIRateLimitError(error: unknown) {
  return getOpenAIErrorStatus(error) === 429;
}

export function isOpenAISchemaValidationError(error: unknown) {
  const code = getOpenAIErrorCode(error);
  const message = getOpenAIErrorMessage(error).toLowerCase();

  return code === "json_validate_failed" || message.includes("does not match the expected schema");
}

export function isOpenAIToolUseError(error: unknown) {
  const code = getOpenAIErrorCode(error);
  const message = getOpenAIErrorMessage(error).toLowerCase();

  return code === "tool_use_failed" || message.includes("model called a tool");
}

export async function runStructuredPrompt<T extends ZodTypeAny>(params: {
  model: string;
  schema: T;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const response = await getGroqClient().chat.completions.create({
    model: params.model,
    messages: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userPrompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: params.schemaName,
        strict: true,
        schema: buildJsonSchema(params.schema)
      }
    }
  });

  const content = getResponseText(response.choices[0]?.message?.content);

  if (!content) {
    throw new Error("Groq response did not contain structured output content.");
  }

  return params.schema.parse(JSON.parse(content));
}

export async function classifyText(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}) {
  const response = await getGroqClient().chat.completions.create({
    model: params.model ?? getFastModel(),
    messages: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userPrompt }
    ]
  });

  const outputText = getResponseText(response.choices[0]?.message?.content);

  if (!outputText) {
    throw new Error("Groq response did not include text output.");
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
