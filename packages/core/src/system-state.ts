import { refreshAccessToken } from "./clients/x.js";
import { getPrismaClient } from "./db.js";
import { getEnv } from "./env.js";
import { Prisma } from "./generated/prisma/client.js";
import { decryptString, encryptString } from "./security.js";
import { buildWeeklySlots, parseSlotWindows } from "./scheduling.js";

export type StoredXTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
  userId?: string;
  username?: string;
};

export async function saveSystemState(key: string, value: Record<string, unknown>) {
  const prisma = getPrismaClient();

  return prisma.systemState.upsert({
    where: { key },
    update: { value: value as Prisma.InputJsonValue },
    create: { key, value: value as Prisma.InputJsonValue }
  });
}

export async function readSystemState<T>(key: string) {
  const prisma = getPrismaClient();
  const state = await prisma.systemState.findUnique({ where: { key } });
  return (state?.value as T | undefined) ?? null;
}

export async function saveXTokens(tokens: StoredXTokens) {
  const env = getEnv();
  const encrypted = encryptString(JSON.stringify(tokens), env.TOKEN_ENCRYPTION_KEY);
  await saveSystemState("xOAuthTokens", { encrypted });
}

export async function readXTokens() {
  const env = getEnv();
  const state = await readSystemState<{ encrypted?: string }>("xOAuthTokens");

  if (!state?.encrypted) {
    return null;
  }

  return JSON.parse(decryptString(state.encrypted, env.TOKEN_ENCRYPTION_KEY)) as StoredXTokens;
}

export async function getValidXAccessToken() {
  const tokens = await readXTokens();

  if (!tokens) {
    return null;
  }

  if (!tokens.expiresAt || new Date(tokens.expiresAt).getTime() > Date.now() + 60_000) {
    return tokens;
  }

  if (!tokens.refreshToken) {
    return tokens;
  }

  const refreshed = await refreshAccessToken(tokens.refreshToken);
  const nextTokens: StoredXTokens = {
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
    expiresAt: refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : tokens.expiresAt,
    scope: refreshed.scope ?? tokens.scope,
    userId: tokens.userId,
    username: tokens.username
  };

  await saveXTokens(nextTokens);

  return nextTokens;
}

export async function saveMentionCursor(sinceId: string | null) {
  await saveSystemState("lastMentionSinceId", { value: sinceId });
}

export async function readMentionCursor() {
  const state = await readSystemState<{ value?: string | null }>("lastMentionSinceId");
  return state?.value ?? null;
}

export async function ensureUpcomingScheduleSlots(params?: { days?: number; timezone?: string }) {
  const prisma = getPrismaClient();
  const env = getEnv();
  const timezone = params?.timezone ?? env.DEFAULT_TIMEZONE;
  const slots = buildWeeklySlots({
    timezone,
    days: params?.days ?? 7,
    windows: parseSlotWindows(env.DEFAULT_POST_SLOT_HOURS, env.ENABLE_EXPERIMENTAL_SLOT)
  });

  for (const slot of slots) {
    await prisma.scheduleSlot.upsert({
      where: { slotAt: slot.slotAt },
      update: {
        timezone: slot.timezone,
        isExperimental: slot.isExperimental
      },
      create: {
        slotAt: slot.slotAt,
        timezone: slot.timezone,
        isExperimental: slot.isExperimental
      }
    });
  }
}
