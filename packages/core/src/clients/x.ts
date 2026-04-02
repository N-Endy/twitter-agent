import { OAuth2, generateCodeChallenge, generateCodeVerifier } from "@xdevplatform/xdk";

import { getEnv } from "../env";

type XTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

const X_API_BASE = "https://api.x.com";

export class XApiError extends Error {
  status: number;
  bodyText: string;
  bodyJson: Record<string, unknown> | null;
  rateLimitRemaining: number | null;
  rateLimitReset: number | null;
  billingRequired: boolean;

  constructor(params: {
    status: number;
    bodyText: string;
    bodyJson: Record<string, unknown> | null;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
    billingRequired: boolean;
  }) {
    super(`X API request failed: ${params.status} ${params.bodyText}`.trim());
    this.name = "XApiError";
    this.status = params.status;
    this.bodyText = params.bodyText;
    this.bodyJson = params.bodyJson;
    this.rateLimitRemaining = params.rateLimitRemaining;
    this.rateLimitReset = params.rateLimitReset;
    this.billingRequired = params.billingRequired;
  }
}

export function isXApiError(error: unknown): error is XApiError {
  return error instanceof XApiError;
}

async function buildXApiError(response: Response) {
  const bodyText = await response.text();
  let bodyJson: Record<string, unknown> | null = null;

  try {
    bodyJson = bodyText ? (JSON.parse(bodyText) as Record<string, unknown>) : null;
  } catch {
    bodyJson = null;
  }

  const preferredMessage =
    (typeof bodyJson?.detail === "string" && bodyJson.detail) ||
    (typeof bodyJson?.message === "string" && bodyJson.message) ||
    (typeof bodyJson?.title === "string" && bodyJson.title) ||
    bodyText ||
    response.statusText ||
    "Request failed.";

  const detail = typeof bodyJson?.detail === "string" ? bodyJson.detail.toLowerCase() : "";
  const title = typeof bodyJson?.title === "string" ? bodyJson.title.toLowerCase() : "";
  const type = typeof bodyJson?.type === "string" ? bodyJson.type.toLowerCase() : "";
  const billingRequired =
    response.status === 402 ||
    title === "spendcapreached" ||
    type.includes("/problems/credits") ||
    detail.includes("spend cap") ||
    detail.includes("billing cycle") ||
    detail.includes("increase your spend cap");

  return new XApiError({
    status: response.status,
    bodyText: preferredMessage,
    bodyJson,
    rateLimitRemaining: Number(response.headers.get("x-rate-limit-remaining")) || null,
    rateLimitReset: Number(response.headers.get("x-rate-limit-reset")) || null,
    billingRequired
  });
}

function getBearerTokenOrThrow() {
  const { X_BEARER_TOKEN } = getEnv();

  if (!X_BEARER_TOKEN) {
    throw new Error("X_BEARER_TOKEN is required for X read operations.");
  }

  return X_BEARER_TOKEN;
}

export async function createPkceFlow() {
  const env = getEnv();

  if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET || !env.X_REDIRECT_URI) {
    throw new Error("X OAuth credentials are not fully configured.");
  }

  const oauth2 = new OAuth2({
    clientId: env.X_CLIENT_ID,
    clientSecret: env.X_CLIENT_SECRET,
    redirectUri: env.X_REDIRECT_URI,
    scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]
  });

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  oauth2.setPkceParameters(codeVerifier, codeChallenge);

  return {
    oauth2,
    codeVerifier
  };
}

export async function createAuthorizationUrl(state: string) {
  const { oauth2, codeVerifier } = await createPkceFlow();

  return {
    codeVerifier,
    authorizationUrl: await oauth2.getAuthorizationUrl(state)
  };
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const env = getEnv();

  if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET || !env.X_REDIRECT_URI) {
    throw new Error("X OAuth credentials are not fully configured.");
  }

  const oauth2 = new OAuth2({
    clientId: env.X_CLIENT_ID,
    clientSecret: env.X_CLIENT_SECRET,
    redirectUri: env.X_REDIRECT_URI,
    scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]
  });

  return (await oauth2.exchangeCode(code, codeVerifier)) as XTokens;
}

export async function refreshAccessToken(refreshToken: string) {
  const env = getEnv();

  if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET) {
    throw new Error("X_CLIENT_ID and X_CLIENT_SECRET are required to refresh access tokens.");
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    client_id: env.X_CLIENT_ID
  });

  const credentials = Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(`${X_API_BASE}/2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`
    },
    body
  });

  if (!response.ok) {
    throw await buildXApiError(response);
  }

  return (await response.json()) as XTokens;
}

type XFetchOptions = RequestInit & {
  authToken: string;
};

async function xFetch(path: string, options: XFetchOptions, attempt = 0) {
  const response = await fetch(`${X_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${options.authToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  if ((response.status === 429 || response.status >= 500) && attempt < 2) {
    const resetAt = Number(response.headers.get("x-rate-limit-reset"));
    const waitMs = Number.isFinite(resetAt)
      ? Math.max(resetAt * 1000 - Date.now(), 2_000)
      : 2_000 * 2 ** attempt;

    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return xFetch(path, options, attempt + 1);
  }

  if (!response.ok) {
    throw await buildXApiError(response);
  }

  return {
    data: (await response.json()) as Record<string, unknown>,
    rateLimitRemaining: Number(response.headers.get("x-rate-limit-remaining")) || null,
    rateLimitReset: Number(response.headers.get("x-rate-limit-reset")) || null
  };
}

export async function createPost(params: {
  accessToken: string;
  text: string;
  replyToPostId?: string;
}) {
  return xFetch("/2/tweets", {
    authToken: params.accessToken,
    method: "POST",
    body: JSON.stringify({
      text: params.text,
      ...(params.replyToPostId
        ? {
            reply: {
              in_reply_to_tweet_id: params.replyToPostId
            }
          }
        : {})
    })
  });
}

export async function createThread(params: {
  accessToken: string;
  parts: string[];
}) {
  if (params.parts.length === 0) {
    throw new Error("Thread must have at least one part.");
  }

  const postIds: string[] = [];
  let previousPostId: string | undefined;

  for (const part of params.parts) {
    const response = await createPost({
      accessToken: params.accessToken,
      text: part,
      replyToPostId: previousPostId
    });

    const postId = String((response.data.data as { id?: string } | undefined)?.id ?? "");
    postIds.push(postId);
    previousPostId = postId;

    if (params.parts.indexOf(part) < params.parts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1_500));
    }
  }

  return { postIds, firstPostId: postIds[0] ?? "" };
}

export async function getAuthenticatedUser(accessToken: string) {
  const response = await xFetch("/2/users/me?user.fields=username,name", {
    authToken: accessToken,
    method: "GET"
  });
  const data = response.data.data as { id?: string; username?: string; name?: string } | undefined;

  return {
    data: data
      ? {
          id: data.id,
          username: data.username,
          name: data.name
        }
      : null
  };
}

export async function getMentions(params: {
  accessToken: string;
  userId: string;
  sinceId?: string;
}) {
  const query = new URLSearchParams({
    "tweet.fields": "created_at,conversation_id,author_id,referenced_tweets",
    expansions: "author_id",
    "user.fields": "username,name",
    max_results: "20"
  });

  if (params.sinceId) {
    query.set("since_id", params.sinceId);
  }

  return xFetch(`/2/users/${params.userId}/mentions?${query.toString()}`, {
    authToken: params.accessToken,
    method: "GET"
  });
}

export async function getUserByUsername(username: string) {
  const response = await xFetch(`/2/users/by/username/${encodeURIComponent(username)}?user.fields=username,name`, {
    authToken: getBearerTokenOrThrow(),
    method: "GET"
  });
  const data = response.data.data as { id?: string; username?: string; name?: string } | undefined;

  return {
    data: data
      ? {
          id: data.id,
          username: data.username,
          name: data.name
        }
      : null
  };
}

export async function getUserPosts(params: {
  authToken: string;
  userId: string;
  maxResults?: number;
}) {
  const query = new URLSearchParams({
    exclude: "replies",
    max_results: String(params.maxResults ?? 5),
    "tweet.fields": "created_at,public_metrics"
  });

  return xFetch(`/2/users/${params.userId}/tweets?${query.toString()}`, {
    authToken: params.authToken,
    method: "GET"
  });
}

export async function getPost(params: { authToken: string; tweetId: string }) {
  const query = new URLSearchParams({
    "tweet.fields": "created_at,author_id,conversation_id,public_metrics"
  });

  return xFetch(`/2/tweets/${params.tweetId}?${query.toString()}`, {
    authToken: params.authToken,
    method: "GET"
  });
}

export function compareXIds(left?: string | null, right?: string | null) {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return -1;
  }

  if (!right) {
    return 1;
  }

  const leftId = BigInt(left);
  const rightId = BigInt(right);

  if (leftId === rightId) {
    return 0;
  }

  return leftId > rightId ? 1 : -1;
}

export function pickLatestXId(...ids: Array<string | null | undefined>) {
  return ids.reduce<string | null>((latest, candidate) => {
    if (!candidate) {
      return latest;
    }

    return compareXIds(candidate, latest) > 0 ? candidate : latest;
  }, null);
}

export function extractTweetIdFromUrl(url: string) {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}
