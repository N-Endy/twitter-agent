import { describe, expect, it } from "vitest";

import { buildStyleReferenceText } from "../../packages/core/src/voice-guidance.ts";
import {
  formatVoiceExamplesForPrompt,
  getVoiceExampleScore,
  normalizeVoiceFeedbackTags
} from "../../packages/core/src/voice-training.ts";

describe("voice training helpers", () => {
  it("scores same-source examples ahead of generic ones", () => {
    expect(
      getVoiceExampleScore(
        {
          sourceItemId: "source-a",
          pillarTag: "quiet-reflections",
          hookTag: "soft-landing"
        },
        {
          sourceItemId: "source-a",
          pillarTag: "quiet-reflections",
          hookTag: "soft-landing"
        }
      )
    ).toBeGreaterThan(
      getVoiceExampleScore(
        {
          sourceItemId: "source-b",
          pillarTag: "quiet-reflections",
          hookTag: "soft-landing"
        },
        {
          sourceItemId: "source-a",
          pillarTag: "quiet-reflections",
          hookTag: "soft-landing"
        }
      )
    );
  });

  it("formats curated examples into a prompt-friendly block", () => {
    const formatted = formatVoiceExamplesForPrompt([
      {
        id: "example-1",
        sourceTitle: "UndercoverWriter",
        sourceText: "The AI version sounded polished but cold.",
        preferredText: "The human version sounds softer and more intimate.",
        operatorNote: "Less polished, more human.",
        feedbackTags: ["too_polished", "too_generic"],
        pillarTag: "quiet-reflections",
        hookTag: "soft-landing",
        createdAt: new Date("2026-03-31T10:00:00.000Z")
      }
    ]);

    expect(formatted).toContain("Original AI draft");
    expect(formatted).toContain("Preferred rewrite");
    expect(formatted).toContain("too_polished");
    expect(formatted).toContain("UndercoverWriter");
  });

  it("normalizes feedback tags to the supported unique set", () => {
    expect(
      normalizeVoiceFeedbackTags([
        "too_polished",
        "TOO_POLISHED",
        "weak_hook",
        "unknown_tag",
        123
      ])
    ).toEqual(["too_polished", "weak_hook"]);
  });

  it("formats style-only references without reusing literal subject matter", () => {
    const formatted = buildStyleReferenceText([
      {
        title: "Commando gone wrong",
        notes: "Use for dramatic Nigerian storytelling and embarrassment humor, not the literal commando topic.",
        researchSnapshots: [
          {
            title: "Church breeze disaster",
            summary: "A self-mocking story with dramatic build-up, playful narration, and a funny final reveal.",
            quoteCandidates: ["Freedom is beautiful until the wind reminds you why fences were invented."],
            hookIdeas: ["Dramatic build-up", "Funny reveal"]
          }
        ]
      }
    ]);

    expect(formatted).toContain("Style reference 1");
    expect(formatted).toContain("dramatic Nigerian storytelling");
    expect(formatted).toContain("Do not reuse their literal scenario");
  });
});
