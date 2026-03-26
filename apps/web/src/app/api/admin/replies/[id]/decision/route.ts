import { NextResponse } from "next/server";

import { getPrismaClient } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

const ACTION_TO_STATUS = {
  IGNORE: "IGNORED",
  ESCALATE: "ESCALATED"
} as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: keyof typeof ACTION_TO_STATUS };
  const action = body.action;

  if (!action || !(action in ACTION_TO_STATUS)) {
    return NextResponse.json({ error: "Action must be IGNORE or ESCALATE." }, { status: 400 });
  }

  const suggestion = await prisma.replySuggestion.findUnique({
    where: { id },
    include: {
      mention: true
    }
  });

  if (!suggestion) {
    return NextResponse.json({ error: "Reply suggestion not found." }, { status: 404 });
  }

  if (suggestion.mention.status === "SENT" || suggestion.mention.status === "SENDING") {
    return NextResponse.json({ error: "A sent or sending reply cannot be changed." }, { status: 409 });
  }

  const duplicateSend = await prisma.replyAction.findFirst({
    where: {
      sentForMentionId: suggestion.mentionId
    }
  });

  if (duplicateSend) {
    return NextResponse.json({ error: "A reply has already been sent for this mention." }, { status: 409 });
  }

  const targetStatus = ACTION_TO_STATUS[action];

  if (suggestion.mention.status === targetStatus) {
    return NextResponse.json({ error: `This mention is already marked as ${targetStatus}.` }, { status: 409 });
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.replySuggestion.update({
      where: { id: suggestion.id },
      data: {
        selected: false
      }
    });

    await tx.mention.update({
      where: { id: suggestion.mentionId },
      data: {
        status: targetStatus,
        shouldRespond: action === "IGNORE" ? false : suggestion.mention.shouldRespond
      }
    });

    return tx.replyAction.create({
      data: {
        mentionId: suggestion.mentionId,
        suggestionId: suggestion.id,
        actionType: action,
        actor: session.user.email ?? "owner",
        notes:
          action === "IGNORE"
            ? "Ignored from admin dashboard."
            : "Escalated for manual handling from admin dashboard."
      }
    });
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: `reply.${action.toLowerCase()}`,
    entityType: "replySuggestion",
    entityId: suggestion.id,
    details: {
      mentionId: suggestion.mentionId,
      nextStatus: targetStatus
    }
  });

  return NextResponse.json({ ok: true, replyAction: result });
}
