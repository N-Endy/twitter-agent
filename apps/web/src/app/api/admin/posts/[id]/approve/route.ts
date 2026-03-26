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
  const draft = await prisma.draft.findUnique({ where: { id } });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  if (draft.status !== "NEEDS_REVIEW") {
    return NextResponse.json({ error: "Only drafts awaiting human review can be approved." }, { status: 409 });
  }

  const updated = await prisma.draft.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedAt: new Date()
    }
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: "draft.approved",
    entityType: "draft",
    entityId: id,
    details: {
      previousStatus: draft.status,
      nextStatus: updated.status
    }
  });

  return NextResponse.json({ ok: true, draft: updated });
}
