import { describe, expect, it } from "vitest";

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
});
