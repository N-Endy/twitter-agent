import { describe, expect, it } from "vitest";

import { isXIntegrationPaused } from "../../packages/core/src/system-state.ts";

describe("x integration state helpers", () => {
  it("treats a future billing pause window as blocked", () => {
    expect(
      isXIntegrationPaused({
        status: "BILLING_BLOCKED",
        pauseUntil: "2030-01-01T00:00:00.000Z"
      })
    ).toBe(true);
  });

  it("stops treating the integration as blocked after the pause window", () => {
    expect(
      isXIntegrationPaused(
        {
          status: "BILLING_BLOCKED",
          pauseUntil: "2025-01-01T00:00:00.000Z"
        },
        new Date("2026-01-01T00:00:00.000Z")
      )
    ).toBe(false);
  });
});
