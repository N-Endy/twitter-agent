import { Client, OAuth2, generateCodeChallenge, generateCodeVerifier } from "@xdevplatform/xdk";

import { getEnv } from "../env";

type XTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

const X_API_BASE = "https://api.x.com";

export function getXBearerClient() {
  const { X_BEARER_TOKEN } = getEnv();

  if (!X_BEARER_TOKEN) {
    throw new Error("X_BEARER_TOKEN is required for X read operations.");
  }

  return new Client({ bearerToken: X_BEARER_TOKEN });
}

export function getXUserClient(accessToken: string) {
  return new Client({ accessToken });
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

  if (!env.X_CLIENT_ID) {
    throw new Error("X_CLIENT_ID is required to refresh access tokens.");
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    client_id: env.X_CLIENT_ID
  });

  const response = await fetch(`${X_API_BASE}/2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`Unable to refresh X token: ${response.status} ${await response.text()}`);
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
    throw new Error(`X API request failed: ${response.status} ${await response.text()}`);
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

export async function getAuthenticatedUser(accessToken: string) {
  const client = getXUserClient(accessToken);
  const response = await client.users.getMe();
  const data = response.data;

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
    "tweet.fields": "created_at,conversation_id,author_id",
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
  const response = await getXBearerClient().users.getByUsername(username);
  const data = response.data;

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

export function extractTweetIdFromUrl(url: string) {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}
