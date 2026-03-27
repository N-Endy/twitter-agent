import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@twitter-agent/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@twitter-agent/core")>();

  return {
    ...actual,
    getOpenAIErrorMessage: actual.getOpenAIErrorMessage,
    isOpenAIQuotaError: actual.isOpenAIQuotaError,
    isOpenAIRateLimitError: actual.isOpenAIRateLimitError,
    runStructuredPrompt: vi.fn(async () => {
      const error = new Error("You exceeded your current quota, please check your plan and billing details.");
      Object.assign(error, {
        status: 429,
        code: "insufficient_quota",
        error: {
          message: "You exceeded your current quota, please check your plan and billing details.",
          code: "insufficient_quota"
        }
      });
      throw error;
    })
  };
});

describe("worker provider quota fallback", () => {
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

  it("falls back and pauses repeated Groq-backed LLM calls after an insufficient quota error", async () => {
    const ai = await import("../../apps/worker/src/lib/ai");
    const core = await import("@twitter-agent/core");
    const structuredPrompt = vi.mocked(core.runStructuredPrompt);

    ai.resetAIProviderFallbackStateForTests();

    const first = await ai.draftReply({
      mentionText: "How would you structure the queue for this?",
      classification: JSON.stringify({ category: "QUESTION" }),
      conversationContext: "A builder asked about queues.",
      supportingEvidence: ["Start simple, then add idempotency and retries."]
    });

    const second = await ai.draftReply({
      mentionText: "What would you do next?",
      classification: JSON.stringify({ category: "QUESTION" }),
      conversationContext: "A builder asked about queues.",
      supportingEvidence: ["Use one durable queue and clear ownership boundaries."]
    });

    expect(first.suggestedReply).toContain("Appreciate you.");
    expect(second.suggestedReply).toContain("Appreciate you.");
    expect(structuredPrompt).toHaveBeenCalledTimes(1);
  });
});
