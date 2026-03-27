import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getServerAuthSession } from "@/auth";
import { getEnv } from "@twitter-agent/core";

const readSession = cache(async () => getServerAuthSession());

export const requireSession = cache(async () => {
  const session = await readSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
});

export async function requireApiSession() {
  const session = await readSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

export function verifyCronSecret(request: NextRequest) {
  const headerSecret = request.headers.get("x-cron-secret");

  if (headerSecret !== getEnv().CRON_SHARED_SECRET) {
    return NextResponse.json({ error: "Invalid cron secret" }, { status: 401 });
  }

  return null;
}
