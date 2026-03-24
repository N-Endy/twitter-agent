import { describe, expect, it } from "vitest";

import { extractTweetIdFromUrl } from "../../packages/core/src/clients/x";

describe("x helpers", () => {
  it("extracts a post id from a standard X status URL", () => {
    expect(extractTweetIdFromUrl("https://x.com/nnamdi/status/1234567890123456789")).toBe(
      "1234567890123456789"
    );
  });

  it("returns null when there is no status segment", () => {
    expect(extractTweetIdFromUrl("https://x.com/nnamdi")).toBeNull();
  });
});
