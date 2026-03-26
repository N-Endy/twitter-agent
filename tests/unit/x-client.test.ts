import { afterEach, describe, expect, it, vi } from "vitest";

import {
  XApiError,
  compareXIds,
  createPost,
  extractTweetIdFromUrl,
  pickLatestXId
} from "../../packages/core/src/clients/x.ts";

describe("x helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts a post id from a standard X status URL", () => {
    expect(extractTweetIdFromUrl("https://x.com/nnamdi/status/1234567890123456789")).toBe(
      "1234567890123456789"
    );
  });

  it("returns null when there is no status segment", () => {
    expect(extractTweetIdFromUrl("https://x.com/nnamdi")).toBeNull();
  });

  it("compares large X ids numerically instead of lexicographically", () => {
    expect(compareXIds("10000000000000000001", "9999999999999999999")).toBe(1);
    expect(pickLatestXId("9999999999999999999", "10000000000000000001", null)).toBe("10000000000000000001");
  });

  it("throws a typed billing error when X returns 402", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ detail: "Upgrade plan for access." }), {
          status: 402,
          headers: {
            "Content-Type": "application/json"
          }
        })
      )
    );

    await expect(createPost({ accessToken: "token", text: "hello" })).rejects.toMatchObject<XApiError>({
      name: "XApiError",
      status: 402,
      billingRequired: true,
      bodyText: "Upgrade plan for access."
    });
  });
});
