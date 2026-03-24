import { refreshAccessToken } from "./clients/x";
import { getPrismaClient } from "./db";
import { getEnv } from "./env";
import { decryptString, encryptString } from "./security";
import { buildWeeklySlots, parseSlotWindows } from "./scheduling";
export async function saveSystemState(key, value) {
    const prisma = getPrismaClient();
    return prisma.systemState.upsert({
        where: { key },
        update: { value: value },
        create: { key, value: value }
    });
}
export async function readSystemState(key) {
    const prisma = getPrismaClient();
    const state = await prisma.systemState.findUnique({ where: { key } });
    return state?.value ?? null;
}
export async function saveXTokens(tokens) {
    const env = getEnv();
    const encrypted = encryptString(JSON.stringify(tokens), env.TOKEN_ENCRYPTION_KEY);
    await saveSystemState("xOAuthTokens", { encrypted });
}
export async function readXTokens() {
    const env = getEnv();
    const state = await readSystemState("xOAuthTokens");
    if (!state?.encrypted) {
        return null;
    }
    return JSON.parse(decryptString(state.encrypted, env.TOKEN_ENCRYPTION_KEY));
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
    const nextTokens = {
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
export async function saveMentionCursor(sinceId) {
    await saveSystemState("lastMentionSinceId", { value: sinceId });
}
export async function readMentionCursor() {
    const state = await readSystemState("lastMentionSinceId");
    return state?.value ?? null;
}
export async function ensureUpcomingScheduleSlots(params) {
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
