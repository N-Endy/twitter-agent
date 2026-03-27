import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@twitter-agent/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@twitter-agent/core")>();

  return {
    ...actual,
    getOpenAIErrorMessage: actual.getOpenAIErrorMessage,
    isOpenAIQuotaError: actual.isOpenAIQuotaError,
    isOpenAIRateLimitError: actual.isOpenAIRateLimitError,
    isOpenAISchemaValidationError: actual.isOpenAISchemaValidationError ?? (() => false),
    isOpenAIToolUseError:
      actual.isOpenAIToolUseError ??
      ((error: unknown) =>
        typeof actual.getOpenAIErrorMessage === "function" &&
        actual.getOpenAIErrorMessage(error).toLowerCase().includes("model called a tool")),
    runStructuredPrompt: vi.fn(async () => {
      const error = new Error("Tool choice is none, but model called a tool");
      Object.assign(error, {
        status: 400,
        code: "tool_use_failed",
        error: {
          message: "Tool choice is none, but model called a tool",
          code: "tool_use_failed"
        }
      });
      throw error;
    })
  };
});

describe("worker provider tool-use fallback", () => {
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

  it("falls back during draft writing when Groq returns a tool-use failure", async () => {
    const ai = await import("../../apps/worker/src/lib/ai");
    const result = await ai.writeDraft({
      pillar: "Prompt Engineering",
      hook: "Stop treating prompts like magic spells",
      angle: "Treat them like reusable code.",
      audience: "Technical builders",
      supportingEvidence: ["Reusable templates improve reliability and reduce chaos."],
      voiceNotes: "Sharp and practical."
    });

    expect(result.text.length).toBeGreaterThan(0);
    expect(result.evidenceUsed.length).toBeGreaterThan(0);
  });
});
