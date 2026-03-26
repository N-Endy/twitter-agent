import { NextRequest, NextResponse } from "next/server";

import {
  exchangeCodeForTokens,
  getAuthenticatedUser,
  saveSystemState,
  saveXTokens
} from "@twitter-agent/core";
import { getAppOrigin } from "@/lib/app-origin";

export async function GET(request: NextRequest) {
  const appOrigin = getAppOrigin(request.url);
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const storedState = request.cookies.get("x_oauth_state")?.value;
  const codeVerifier = request.cookies.get("x_code_verifier")?.value;

  if (!state || !code || !storedState || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/?x=invalid-callback", appOrigin));
  }

  const tokens = await exchangeCodeForTokens(code, codeVerifier);
  const me = await getAuthenticatedUser(tokens.access_token);

  await saveXTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : undefined,
    scope: tokens.scope,
    userId: me.data?.id,
    username: me.data?.username
  });

  if (me.data) {
    await saveSystemState("xOwnerProfile", {
      id: me.data.id,
      username: me.data.username,
      name: me.data.name
    });
  }

  const response = NextResponse.redirect(new URL("/", appOrigin));

  response.cookies.delete("x_oauth_state");
  response.cookies.delete("x_code_verifier");

  return response;
}
