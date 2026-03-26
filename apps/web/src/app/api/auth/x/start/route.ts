import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { createAuthorizationUrl } from "@twitter-agent/core";
import { getServerAuthSession } from "@/auth";
import { getAppOrigin, isSecureAppOrigin } from "@/lib/app-origin";

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();
  const appOrigin = getAppOrigin(request.url);

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", appOrigin));
  }

  const state = crypto.randomUUID();
  const { authorizationUrl, codeVerifier } = await createAuthorizationUrl(state);
  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("x_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureAppOrigin(request.url),
    path: "/",
    maxAge: 60 * 15
  });
  response.cookies.set("x_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureAppOrigin(request.url),
    path: "/",
    maxAge: 60 * 15
  });

  return response;
}
