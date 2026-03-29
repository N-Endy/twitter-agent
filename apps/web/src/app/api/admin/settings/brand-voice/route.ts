import { NextResponse } from "next/server";

import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";
import { saveBrandVoiceProfile } from "@twitter-agent/core";

type BrandVoiceBody = {
  guide?: string | null;
};

export async function POST(request: Request) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const body = (await request.json().catch(() => ({}))) as BrandVoiceBody;
  const guide = typeof body.guide === "string" ? body.guide.trim() : "";

  if (guide.length > 5000) {
    return NextResponse.json({ error: "Brand voice is too long. Keep it under 5000 characters." }, { status: 400 });
  }

  await saveBrandVoiceProfile(guide || null);

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: guide ? "brandVoice.updated" : "brandVoice.cleared",
    entityType: "brandVoiceProfile",
    entityId: "account",
    details: {
      characterCount: guide.length
    }
  });

  return NextResponse.json({
    ok: true,
    guide: guide || null
  });
}
