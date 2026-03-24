export type StoredXTokens = {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    scope?: string;
    userId?: string;
    username?: string;
};
export declare function saveSystemState(key: string, value: Record<string, unknown>): Promise<{
    value: import("@prisma/client/runtime/client").JsonValue;
    key: string;
    updatedAt: Date;
}>;
export declare function readSystemState<T>(key: string): Promise<NonNullable<T> | null>;
export declare function saveXTokens(tokens: StoredXTokens): Promise<void>;
export declare function readXTokens(): Promise<StoredXTokens | null>;
export declare function getValidXAccessToken(): Promise<StoredXTokens | null>;
export declare function saveMentionCursor(sinceId: string | null): Promise<void>;
export declare function readMentionCursor(): Promise<string | null>;
export declare function ensureUpcomingScheduleSlots(params?: {
    days?: number;
    timezone?: string;
}): Promise<void>;
