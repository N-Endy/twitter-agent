import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  if (token) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/sources/:path*",
    "/ideas/:path*",
    "/drafts/:path*",
    "/scheduled/:path*",
    "/published/:path*",
    "/mentions/:path*",
    "/replies/:path*",
    "/incidents/:path*",
    "/prompts/:path*",
    "/api/admin/:path*",
    "/api/auth/x/start"
  ]
};
