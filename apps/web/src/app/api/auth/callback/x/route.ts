import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  exchangeCodeForTokens,
  getAuthenticatedUser,
  saveSystemState,
  saveXTokens
} from "@twitter-agent/core";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const storedState = cookieStore.get("x_oauth_state")?.value;
  const codeVerifier = cookieStore.get("x_code_verifier")?.value;

  if (!state || !code || !storedState || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/?x=invalid-callback", request.url));
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

  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.delete("x_oauth_state");
  response.cookies.delete("x_code_verifier");

  return response;
}
