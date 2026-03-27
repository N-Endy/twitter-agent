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
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  it("produces structured fallback research and ideas without an external LLM provider", async () => {
    const research = await extractResearch(
      "Building the first version taught us that queues, retries, and explicit approval states reduce chaos.",
      "Notes",
      "URL",
      "Source: Notes\nType: URL\nAudience: operators who care about workflow clarity."
    );
    const ideas = await generateIdeas({
      summary: research.summary,
      keyFacts: research.keyFacts,
      recentWinners: [],
      recentLosers: [],
      sourceName: "Notes",
      sourceGuidance: "Source: Notes\nAudience: operators who care about workflow clarity.",
      sourceHooks: research.hookIdeas,
      sourcePillars: research.pillarCandidates
    });

    expect(research.keyFacts.length).toBeGreaterThan(0);
    expect(ideas.ideas.length).toBeGreaterThan(0);
  });

  it("keeps fallback ideation aligned to the source instead of defaulting to tech-builder content", async () => {
    const research = await extractResearch(
      "Softness does not make your standards weaker. Protect your peace without apologizing for it.",
      "Femininity page",
      "X_ACCOUNT",
      "Source: Femininity page\nNotes: Themes include femininity, standards, peace, and relationships.\nAudience: women who want grounded, emotionally honest content."
    );
    const ideas = await generateIdeas({
      summary: research.summary,
      keyFacts: research.keyFacts,
      recentWinners: [],
      recentLosers: [],
      sourceName: "Femininity page",
      sourceGuidance:
        "Source: Femininity page\nNotes: Themes include femininity, standards, peace, and relationships.\nAudience: women who want grounded, emotionally honest content.",
      sourceHooks: research.hookIdeas,
      sourcePillars: research.pillarCandidates
    });

    expect(ideas.ideas[0]?.pillar.toLowerCase()).not.toContain("ai");
    expect(ideas.ideas[0]?.pillar.toLowerCase()).not.toContain("build");
    expect(ideas.ideas[0]?.audience.toLowerCase()).toContain("women");
  });

  it("writes, reviews, classifies, and drafts replies through fallback logic", async () => {
    const draft = await writeDraft({
      pillar: "AI systems",
      hook: "The hard part is not generating tweets",
      angle: "The hard part is controlling the workflow around them.",
      audience: "Technical builders",
      supportingEvidence: ["Approval states beat vibes when the queue grows."],
      voiceNotes: "Sharp and practical.",
      sourceGuidance: "Source: Ops notes\nAudience: technical operators."
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
