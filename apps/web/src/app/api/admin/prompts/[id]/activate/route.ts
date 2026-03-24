import { NextResponse } from "next/server";

import { getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const prompt = await prisma.promptVersion.findUnique({ where: { id } });

  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found." }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.promptVersion.updateMany({
      where: { kind: prompt.kind },
      data: {
        isActive: false
      }
    });

    await tx.promptVersion.update({
      where: { id },
      data: {
        isActive: true,
        activatedAt: new Date()
      }
    });
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: "prompt.activated",
    entityType: "promptVersion",
    entityId: id,
    details: {
      kind: prompt.kind,
      version: prompt.version
    }
  });

  return NextResponse.json({ ok: true });
}
