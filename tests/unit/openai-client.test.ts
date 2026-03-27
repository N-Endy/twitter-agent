import { describe, expect, it } from "vitest";

import {
  getOpenAIErrorMessage,
  getOpenAIErrorStatus,
  getProviderRequestPlan,
  isOpenAIQuotaError,
  isOpenAIRateLimitError,
  isOpenAISchemaValidationError,
  isOpenAIToolUseError
} from "../../packages/core/src/clients/openai.ts";

describe("provider error helpers", () => {
  it("detects insufficient quota errors from the SDK shape", () => {
    const error = {
      status: 429,
      message: "You exceeded your current quota.",
      error: {
        message: "You exceeded your current quota.",
        code: "insufficient_quota"
      }
    };

    expect(getOpenAIErrorStatus(error)).toBe(429);
    expect(isOpenAIQuotaError(error)).toBe(true);
    expect(isOpenAIRateLimitError(error)).toBe(true);
    expect(getOpenAIErrorMessage(error)).toContain("quota");
  });

  it("handles top-level SDK error properties", () => {
    const error = {
      status: 429,
      message: "Rate limit reached.",
      code: "rate_limit_exceeded"
    };

    expect(isOpenAIQuotaError(error)).toBe(false);
    expect(isOpenAIRateLimitError(error)).toBe(true);
    expect(getOpenAIErrorMessage(error)).toBe("Rate limit reached.");
  });

  it("detects schema validation errors from structured output requests", () => {
    const error = {
      status: 400,
      message: "Generated JSON does not match the expected schema.",
      code: "json_validate_failed",
      error: {
        message: "Generated JSON does not match the expected schema.",
        code: "json_validate_failed"
      }
    };

    expect(isOpenAISchemaValidationError(error)).toBe(true);
  });

  it("detects tool-use failures from structured output requests", () => {
    const error = {
      status: 400,
      message: "Tool choice is none, but model called a tool",
      code: "tool_use_failed",
      error: {
        message: "Tool choice is none, but model called a tool",
        code: "tool_use_failed"
      }
    };

    expect(isOpenAIToolUseError(error)).toBe(true);
  });

  it("prefers OpenAI first and Groq second when both providers are configured", () => {
    const plan = getProviderRequestPlan(
      {
        openaiModel: "gpt-5-mini",
        groqModel: "openai/gpt-oss-20b"
      },
      {
        OPENAI_API_KEY: "sk-test",
        GROQ_API_KEY: "gsk-test"
      } as never
    );

    expect(plan).toEqual([
      { provider: "openai", model: "gpt-5-mini" },
      { provider: "groq", model: "openai/gpt-oss-20b" }
    ]);
  });

  it("uses Groq alone when OpenAI is not configured", () => {
    const plan = getProviderRequestPlan(
      {
        openaiModel: "gpt-5-mini",
        groqModel: "openai/gpt-oss-20b"
      },
      {
        OPENAI_API_KEY: undefined,
        GROQ_API_KEY: "gsk-test"
      } as never
    );

    expect(plan).toEqual([{ provider: "groq", model: "openai/gpt-oss-20b" }]);
  });
});
