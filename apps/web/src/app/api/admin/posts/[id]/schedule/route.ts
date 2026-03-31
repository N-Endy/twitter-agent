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
  const body = (await request.json().catch(() => ({}))) as {
    slotId?: string;
    action?: "unschedule";
  };
  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      scheduleSlot: true
    }
  });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  if (body.action === "unschedule") {
    if (!draft.scheduleSlotId || draft.status !== "SCHEDULED") {
      return NextResponse.json({ error: "Only scheduled drafts can be unscheduled." }, { status: 409 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.scheduleSlot.updateMany({
        where: {
          id: draft.scheduleSlotId as string,
          status: "RESERVED"
        },
        data: {
          status: "OPEN"
        }
      });

      return tx.draft.update({
        where: { id },
        data: {
          status: "APPROVED",
          scheduleSlotId: null
        },
        include: {
          scheduleSlot: true
        }
      });
    });

    await createAuditLog({
      actor: session.user.email ?? "owner",
      action: "draft.unscheduled",
      entityType: "draft",
      entityId: id,
      details: {
        slotId: draft.scheduleSlotId,
        previousStatus: draft.status
      }
    });

    return NextResponse.json({ ok: true, draft: updated });
  }

  if (draft.status !== "APPROVED") {
    return NextResponse.json({ error: "Draft must be approved before scheduling." }, { status: 409 });
  }

  if (draft.scheduleSlotId) {
    return NextResponse.json({ error: "This draft is already scheduled." }, { status: 409 });
  }

  await ensureUpcomingScheduleSlots();

  const slot =
    (body.slotId
      ? await prisma.scheduleSlot.findFirst({
          where: {
            id: body.slotId,
            status: "OPEN",
            slotAt: {
              gt: new Date()
            }
          }
        })
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
    const reserved = await tx.scheduleSlot.updateMany({
      where: {
        id: slot.id,
        status: "OPEN"
      },
      data: {
        status: "RESERVED"
      }
    });

    if (reserved.count === 0) {
      throw new Error("slot-unavailable");
    }

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
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === "slot-unavailable") {
      return null;
    }

    throw error;
  });

  if (!updated) {
    return NextResponse.json({ error: "That schedule slot was just claimed. Please choose another one." }, { status: 409 });
  }

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
