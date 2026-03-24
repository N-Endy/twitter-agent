import { Client, OAuth2 } from "@xdevplatform/xdk";
type XTokens = {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
};
export declare function getXBearerClient(): Client;
export declare function getXUserClient(accessToken: string): Client;
export declare function createPkceFlow(): Promise<{
    oauth2: OAuth2;
    codeVerifier: string;
}>;
export declare function createAuthorizationUrl(state: string): Promise<{
    codeVerifier: string;
    authorizationUrl: string;
}>;
export declare function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<XTokens>;
export declare function refreshAccessToken(refreshToken: string): Promise<XTokens>;
export declare function createPost(params: {
    accessToken: string;
    text: string;
    replyToPostId?: string;
}): Promise<{
    data: Record<string, unknown>;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
}>;
export declare function getAuthenticatedUser(accessToken: string): Promise<{
    data: {
        id: string;
        username: string;
        name: string;
    } | null;
}>;
export declare function getMentions(params: {
    accessToken: string;
    userId: string;
    sinceId?: string;
}): Promise<{
    data: Record<string, unknown>;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
}>;
export declare function getUserByUsername(username: string): Promise<{
    data: {
        id: string;
        username: string;
        name: string;
    } | null;
}>;
export declare function getUserPosts(params: {
    authToken: string;
    userId: string;
    maxResults?: number;
}): Promise<{
    data: Record<string, unknown>;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
}>;
export declare function getPost(params: {
    authToken: string;
    tweetId: string;
}): Promise<{
    data: Record<string, unknown>;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
}>;
export declare function extractTweetIdFromUrl(url: string): string | null;
export {};
