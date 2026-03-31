import { NextResponse } from "next/server";

import { getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

type VoiceExampleArchiveBody = {
  action?: "archive" | "restore";
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as VoiceExampleArchiveBody;
  const action = body.action === "restore" ? "restore" : "archive";
  const example = await prisma.voiceExample.findUnique({
    where: { id }
  });

  if (!example) {
    return NextResponse.json({ error: "Voice example not found." }, { status: 404 });
  }

  if (action === "archive" && example.status === "ARCHIVED") {
    return NextResponse.json({ error: "This voice example is already archived." }, { status: 409 });
  }

  if (action === "restore" && example.status === "ACTIVE") {
    return NextResponse.json({ error: "This voice example is already active." }, { status: 409 });
  }

  const updated = await prisma.voiceExample.update({
    where: { id },
    data: {
      status: action === "archive" ? "ARCHIVED" : "ACTIVE"
    }
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: action === "archive" ? "voiceExample.archived" : "voiceExample.restored",
    entityType: "voiceExample",
    entityId: id,
    details: {
      previousStatus: example.status,
      nextStatus: updated.status
    }
  });

  return NextResponse.json({
    ok: true,
    voiceExample: updated
  });
}
