import { PrismaClient } from "./generated/prisma/client";
declare global {
    var __twitterAgentPrisma__: PrismaClient | undefined;
}
export declare function getPrismaClient(): PrismaClient;
