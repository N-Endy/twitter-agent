import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { createAuthorizationUrl } from "@twitter-agent/core";
import { getServerAuthSession } from "@/auth";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
  }

  const state = crypto.randomUUID();
  const { authorizationUrl, codeVerifier } = await createAuthorizationUrl(state);
  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("x_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  response.cookies.set("x_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return response;
}
