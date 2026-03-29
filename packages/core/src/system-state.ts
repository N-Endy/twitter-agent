import { refreshAccessToken } from "./clients/x";
import { getPrismaClient } from "./db";
import { getEnv } from "./env";
import { Prisma } from "./generated/prisma/client";
import { decryptString, encryptString } from "./security";
import { buildWeeklySlots, parseSlotWindows } from "./scheduling";

const X_INTEGRATION_KEY = "xIntegration";
const BRAND_VOICE_KEY = "brandVoiceProfile";
const X_BILLING_BLOCK_WINDOW_MS = 60 * 60 * 1000;

export type StoredXTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
  userId?: string;
  username?: string;
};

export type XIntegrationState = {
  status: "AVAILABLE" | "BILLING_BLOCKED" | "ERROR";
  reason?: string | null;
  lastFailureAt?: string | null;
  lastSuccessAt?: string | null;
  lastStatusCode?: number | null;
  pauseUntil?: string | null;
};

export type BrandVoiceProfile = {
  guide: string | null;
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

export async function readXIntegrationState() {
  return readSystemState<XIntegrationState>(X_INTEGRATION_KEY);
}

export async function saveBrandVoiceProfile(guide: string | null) {
  await saveSystemState(BRAND_VOICE_KEY, {
    guide
  });
}

export async function readBrandVoiceProfile() {
  const state = await readSystemState<BrandVoiceProfile>(BRAND_VOICE_KEY);
  return state?.guide?.trim() ? state.guide.trim() : null;
}

export async function markXIntegrationHealthy() {
  const current = await readXIntegrationState();

  await saveSystemState(X_INTEGRATION_KEY, {
    status: "AVAILABLE",
    reason: null,
    lastFailureAt: current?.lastFailureAt ?? null,
    lastSuccessAt: new Date().toISOString(),
    lastStatusCode: null,
    pauseUntil: null
  });
}

export async function markXIntegrationFailure(params: {
  billingRequired?: boolean;
  reason: string;
  statusCode?: number | null;
}) {
  const current = await readXIntegrationState();

  await saveSystemState(X_INTEGRATION_KEY, {
    status: params.billingRequired ? "BILLING_BLOCKED" : "ERROR",
    reason: params.reason,
    lastFailureAt: new Date().toISOString(),
    lastSuccessAt: current?.lastSuccessAt ?? null,
    lastStatusCode: params.statusCode ?? null,
    pauseUntil: params.billingRequired
      ? new Date(Date.now() + X_BILLING_BLOCK_WINDOW_MS).toISOString()
      : null
  });
}

export function isXIntegrationPaused(
  state: Pick<XIntegrationState, "status" | "pauseUntil"> | null | undefined,
  now = new Date()
) {
  if (state?.status !== "BILLING_BLOCKED") {
    return false;
  }

  if (!state.pauseUntil) {
    return true;
  }

  return new Date(state.pauseUntil).getTime() > now.getTime();
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
