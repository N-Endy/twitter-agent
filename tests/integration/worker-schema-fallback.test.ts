import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@twitter-agent/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@twitter-agent/core")>();

  return {
    ...actual,
    getOpenAIErrorMessage: actual.getOpenAIErrorMessage,
    isOpenAIQuotaError: actual.isOpenAIQuotaError,
    isOpenAIRateLimitError: actual.isOpenAIRateLimitError,
    isOpenAISchemaValidationError:
      actual.isOpenAISchemaValidationError ??
      ((error: unknown) =>
        typeof actual.getOpenAIErrorMessage === "function" &&
        actual.getOpenAIErrorMessage(error).toLowerCase().includes("does not match the expected schema")),
    runStructuredPrompt: vi.fn(async () => {
      const error = new Error("Generated JSON does not match the expected schema.");
      Object.assign(error, {
        status: 400,
        code: "json_validate_failed",
        error: {
          message: "Generated JSON does not match the expected schema.",
          code: "json_validate_failed"
        }
      });
      throw error;
    })
  };
});

describe("worker provider schema fallback", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.GROQ_API_KEY = "gsk_test";
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/twitter_agent";
    process.env.REDIS_URL = "redis://localhost:6379";
    process.env.NEXTAUTH_SECRET = "test-secret-value";
    process.env.ADMIN_EMAIL = "owner@example.com";
    process.env.TOKEN_ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef";
    process.env.CRON_SHARED_SECRET = "cron-secret";
    process.env.ADMIN_PASSWORD = "password";
  });

  afterEach(() => {
    delete process.env.GROQ_API_KEY;
    delete process.env.DATABASE_URL;
    delete process.env.REDIS_URL;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.ADMIN_EMAIL;
    delete process.env.TOKEN_ENCRYPTION_KEY;
    delete process.env.CRON_SHARED_SECRET;
    delete process.env.ADMIN_PASSWORD;
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("falls back during source-style structured extraction when Groq rejects the generated schema output", async () => {
    const ai = await import("../../apps/worker/src/lib/ai");
    const result = await ai.extractResearch(
      "The speaker wishes to feel emotions without dragging yesterday into today.",
      "Reflection",
      "URL"
    );

    expect(result.quoteCandidates.length).toBeGreaterThan(0);
    expect(result.hookIdeas.length).toBeGreaterThan(0);
    expect(result.pillarCandidates.length).toBeGreaterThan(0);
    expect(result.safetyFlags).toEqual([]);
  });
});
