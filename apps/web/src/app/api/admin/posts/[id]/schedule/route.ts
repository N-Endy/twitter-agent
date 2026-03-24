import { NextResponse } from "next/server";

import { ensureUpcomingScheduleSlots, getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { slotId?: string };
  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      scheduleSlot: true
    }
  });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  if (draft.status !== "APPROVED" && draft.status !== "SCHEDULED") {
    return NextResponse.json({ error: "Draft must be approved before scheduling." }, { status: 409 });
  }

  await ensureUpcomingScheduleSlots();

  const slot =
    (body.slotId
      ? await prisma.scheduleSlot.findUnique({ where: { id: body.slotId } })
      : await prisma.scheduleSlot.findFirst({
          where: {
            status: "OPEN",
            slotAt: {
              gt: new Date()
            }
          },
          orderBy: { slotAt: "asc" }
        })) ?? null;

  if (!slot) {
    return NextResponse.json({ error: "No open schedule slots available." }, { status: 409 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.scheduleSlot.update({
      where: { id: slot.id },
      data: {
        status: "RESERVED"
      }
    });

    return tx.draft.update({
      where: { id },
      data: {
        status: "SCHEDULED",
        scheduleSlotId: slot.id
      },
      include: {
        scheduleSlot: true
      }
    });
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: "draft.scheduled",
    entityType: "draft",
    entityId: id,
    details: {
      slotId: slot.id,
      slotAt: slot.slotAt.toISOString()
    }
  });

  return NextResponse.json({ ok: true, draft: updated });
}
