import { NextResponse } from "next/server";

import {
  createPost,
  getPrismaClient,
  getValidXAccessToken,
  moderateMention
} from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const suggestion = await prisma.replySuggestion.findUnique({
    where: { id },
    include: {
      mention: true
    }
  });

  if (!suggestion) {
    return NextResponse.json({ error: "Reply suggestion not found." }, { status: 404 });
  }

  const existingSend = await prisma.replyAction.findFirst({
    where: {
      sentForMentionId: suggestion.mentionId
    }
  });

  if (existingSend) {
    return NextResponse.json({ error: "A reply has already been sent for this mention." }, { status: 409 });
  }

  const moderation = moderateMention(suggestion.mention.text);

  if (moderation.decision === "BLOCK" || moderation.decision === "ESCALATE") {
    return NextResponse.json({ error: "This mention is not eligible for sending." }, { status: 409 });
  }

  const tokens = await getValidXAccessToken();

  if (!tokens?.accessToken) {
    return NextResponse.json({ error: "Connect the X account before sending replies." }, { status: 409 });
  }

  const response = await createPost({
    accessToken: tokens.accessToken,
    text: suggestion.draftText,
    replyToPostId: suggestion.mention.xMentionId
  });

  const replyData = response.data.data as { id?: string } | undefined;

  const action = await prisma.$transaction(async (tx) => {
    await tx.replySuggestion.update({
      where: { id },
      data: {
        selected: true
      }
    });

    await tx.mention.update({
      where: { id: suggestion.mentionId },
      data: {
        status: "SENT"
      }
    });

    return tx.replyAction.create({
      data: {
        mentionId: suggestion.mentionId,
        suggestionId: suggestion.id,
        sentForMentionId: suggestion.mentionId,
        xReplyPostId: replyData?.id,
        actionType: "SEND",
        actor: session.user.email ?? "owner",
        notes: "Sent from admin dashboard."
      }
    });
  });

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: "reply.sent",
    entityType: "replySuggestion",
    entityId: suggestion.id,
    details: {
      mentionId: suggestion.mentionId,
      xReplyPostId: action.xReplyPostId
    }
  });

  return NextResponse.json({ ok: true, replyAction: action, rateLimitRemaining: response.rateLimitRemaining });
}
