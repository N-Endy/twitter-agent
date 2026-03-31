import { describe, expect, it } from "vitest";

import {
  getStatusUpdateAfterRewrite,
  isDraftLockedForTraining
} from "../../apps/web/src/lib/draft-training.ts";

describe("draft training rules", () => {
  it("moves approved drafts back to NEEDS_REVIEW after a rewrite", () => {
    expect(getStatusUpdateAfterRewrite("APPROVED", new Date("2026-03-31T10:00:00.000Z"))).toEqual({
      status: "NEEDS_REVIEW",
      approvedAt: null
    });
  });

  it("keeps other draft states unchanged when saving a rewrite", () => {
    const approvedAt = new Date("2026-03-31T10:00:00.000Z");

    expect(getStatusUpdateAfterRewrite("NEEDS_REVIEW", approvedAt)).toEqual({
      status: "NEEDS_REVIEW",
      approvedAt
    });
  });

  it("treats scheduled, publishing, and published drafts as locked", () => {
    expect(isDraftLockedForTraining("SCHEDULED")).toBe(true);
    expect(isDraftLockedForTraining("PUBLISHING")).toBe(true);
    expect(isDraftLockedForTraining("PUBLISHED")).toBe(true);
    expect(isDraftLockedForTraining("NEEDS_REVIEW")).toBe(false);
  });
});
