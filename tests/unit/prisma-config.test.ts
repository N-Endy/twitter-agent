import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("prisma config", () => {
  const originalDirectUrl = process.env.DIRECT_URL;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalDirectUrl === undefined) {
      delete process.env.DIRECT_URL;
    } else {
      process.env.DIRECT_URL = originalDirectUrl;
    }

    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("prefers DIRECT_URL for Prisma CLI configuration when available", async () => {
    process.env.DIRECT_URL = "postgresql://direct";
    process.env.DATABASE_URL = "postgresql://pooled";

    const configModule = await import("../../prisma.config.ts");

    expect(configModule.default.datasource?.url).toBe("postgresql://direct");
  });
});
