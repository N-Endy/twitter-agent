import { describe, expect, it } from "vitest";

import { moderateDraft, moderateMention } from "../../packages/core/src/moderation/rules";

describe("moderation rules", () => {
  it("blocks unsourced topical breaking-news drafts", () => {
    const result = moderateDraft({
      text: "Breaking: this just happened and here is the confirmed twist.",
      sourceBacked: false,
      topical: true
    });

    expect(result.decision).toBe("BLOCK");
  });

  it("escalates sensitive mentions", () => {
    const result = moderateMention("Can you give me financial advice on what to invest in?");

    expect(result.decision).toBe("ESCALATE");
    expect(result.requiresHumanApproval).toBe(true);
  });

  it("allows normal questions into the draft queue", () => {
    const result = moderateMention("How would you structure the first version of this workflow?");

    expect(result.decision).toBe("ALLOW");
  });
});
