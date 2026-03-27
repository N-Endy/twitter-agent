import OpenAI from "openai";
import { z, type ZodTypeAny } from "zod";

import { getEnv } from "../env";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export type AIProvider = "openai" | "groq";

type ProviderRequestPlan = Array<{ provider: AIProvider; model: string }>;

const cachedClients: Partial<Record<AIProvider, OpenAI>> = {};
const cachedApiKeys: Partial<Record<AIProvider, string>> = {};

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

function getProviderApiKey(provider: AIProvider) {
  const env = getEnv();
  return provider === "openai" ? env.OPENAI_API_KEY ?? null : env.GROQ_API_KEY ?? null;
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

function getProviderClient(provider: AIProvider) {
  const apiKey = getProviderApiKey(provider);

  if (!apiKey) {
    throw new Error(`${provider === "openai" ? "OPENAI_API_KEY" : "GROQ_API_KEY"} is required for AI features.`);
  }

  if (!cachedClients[provider] || cachedApiKeys[provider] !== apiKey) {
    cachedClients[provider] = new OpenAI(
      provider === "groq"
        ? {
            apiKey,
            baseURL: GROQ_BASE_URL
          }
        : {
            apiKey
          }
    );
    cachedApiKeys[provider] = apiKey;
  }

  return cachedClients[provider] as OpenAI;
}

export function getOpenAIClient() {
  return getProviderClient("openai");
}

export function getGroqClient() {
  return getProviderClient("groq");
}

export function getProviderRequestPlan(params: {
  openaiModel: string;
  groqModel?: string;
}, env = getEnv()) {
  const plan: ProviderRequestPlan = [];

  if (env.OPENAI_API_KEY) {
    plan.push({ provider: "openai", model: params.openaiModel });
  }

  if (env.GROQ_API_KEY) {
    plan.push({ provider: "groq", model: params.groqModel ?? params.openaiModel });
  }

  return plan;
}

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

async function withProviderFallback<T>(plan: ProviderRequestPlan, run: (step: ProviderRequestPlan[number]) => Promise<T>) {
  if (plan.length === 0) {
    throw new Error("OPENAI_API_KEY or GROQ_API_KEY is required for AI features.");
  }

  let lastError: unknown;

  for (let index = 0; index < plan.length; index += 1) {
    const step = plan[index]!;

    try {
      return await run(step);
    } catch (error) {
      lastError = error;

      if (index < plan.length - 1) {
        console.warn(
          `[ai-provider] ${step.provider} failed, trying next provider: ${getOpenAIErrorMessage(error)}`
        );
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("LLM provider request failed.");
}

export async function runStructuredPrompt<T extends ZodTypeAny>(params: {
  model: string;
  fallbackModel?: string;
  schema: T;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const plan = getProviderRequestPlan({
    openaiModel: params.model,
    groqModel: params.fallbackModel
  });

  return withProviderFallback(plan, async (step) => {
    const response = await getProviderClient(step.provider).chat.completions.create({
      model: step.model,
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
      throw new Error(`${step.provider} response did not contain structured output content.`);
    }

    return params.schema.parse(JSON.parse(content));
  });
}

export async function classifyText(params: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  fallbackModel?: string;
}) {
  const env = getEnv();
  const plan = getProviderRequestPlan({
    openaiModel: params.model ?? env.OPENAI_FAST_MODEL,
    groqModel: params.fallbackModel ?? env.GROQ_FAST_MODEL
  });

  return withProviderFallback(plan, async (step) => {
    const response = await getProviderClient(step.provider).chat.completions.create({
      model: step.model,
      messages: [
        { role: "system", content: params.systemPrompt },
        { role: "user", content: params.userPrompt }
      ]
    });

    const outputText = getResponseText(response.choices[0]?.message?.content);

    if (!outputText) {
      throw new Error(`${step.provider} response did not include text output.`);
    }

    return outputText;
  });
}

export function parseJsonOutput<T extends ZodTypeAny>(schema: T, raw: string) {
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
}

export const jsonStringSchema = z.object({
  value: z.string()
});
