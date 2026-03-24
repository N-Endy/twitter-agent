import { PrismaPg } from "@prisma/adapter-pg";

import { getEnv } from "./env";
import { PrismaClient } from "./generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __twitterAgentPrisma__: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (!globalThis.__twitterAgentPrisma__) {
    globalThis.__twitterAgentPrisma__ = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: getEnv().DATABASE_URL
      })
    });
  }

  return globalThis.__twitterAgentPrisma__;
}
