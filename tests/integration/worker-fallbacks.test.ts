import { beforeEach, describe, expect, it } from "vitest";

import {
  classifyMention,
  draftReply,
  extractResearch,
  generateIdeas,
  reviewDraft,
  writeDraft
} from "../../apps/worker/src/lib/ai";

describe("worker fallback AI flows", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it("produces structured fallback research and ideas without OpenAI", async () => {
    const research = await extractResearch(
      "Building the first version taught us that queues, retries, and explicit approval states reduce chaos.",
      "Notes",
      "URL"
    );
    const ideas = await generateIdeas({
      summary: research.summary,
      keyFacts: research.keyFacts,
      recentWinners: [],
      recentLosers: []
    });

    expect(research.keyFacts.length).toBeGreaterThan(0);
    expect(ideas.ideas.length).toBeGreaterThan(0);
  });

  it("writes, reviews, classifies, and drafts replies through fallback logic", async () => {
    const draft = await writeDraft({
      pillar: "AI systems",
      hook: "The hard part is not generating tweets",
      angle: "The hard part is controlling the workflow around them.",
      audience: "Technical builders",
      supportingEvidence: ["Approval states beat vibes when the queue grows."],
      voiceNotes: "Sharp and practical."
    });
    const review = await reviewDraft({
      draftText: draft.text,
      supportingEvidence: draft.evidenceUsed,
      voiceRules: "Sharp and practical."
    });
    const classification = await classifyMention({
      mentionText: "How would you structure the queue for this?",
      conversationContext: "A builder asked about queues."
    });
    const reply = await draftReply({
      mentionText: "How would you structure the queue for this?",
      classification: JSON.stringify(classification),
      conversationContext: "A builder asked about queues.",
      supportingEvidence: ["Start simple, then add idempotency and retries."]
    });

    expect(review.rewrite.length).toBeGreaterThan(0);
    expect(classification.shouldRespond).toBe(true);
    expect(reply.suggestedReply.length).toBeGreaterThan(0);
  });
});
