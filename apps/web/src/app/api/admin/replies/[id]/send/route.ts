import { NextResponse } from "next/server";

import {
  createPost,
  getPrismaClient,
  getValidXAccessToken,
  isXApiError,
  isXIntegrationPaused,
  markXIntegrationFailure,
  markXIntegrationHealthy,
  moderateMention
} from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const prisma = getPrismaClient();

function getXFailureReason(error: { bodyJson?: Record<string, unknown> | null; bodyText?: string; message: string }) {
  const errors = error.bodyJson?.errors;

  if (Array.isArray(errors)) {
    const firstMessage = errors.find(
      (entry): entry is { message: string } =>
        typeof entry === "object" && entry !== null && "message" in entry && typeof entry.message === "string"
    );

    if (firstMessage?.message) {
      return firstMessage.message;
    }
  }

  const detail = error.bodyJson?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return error.bodyText || error.message;
}

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

  const xState = await prisma.systemState.findUnique({
    where: { key: "xIntegration" }
  });

  const integrationValue = xState?.value as
    | {
        status?: "AVAILABLE" | "BILLING_BLOCKED" | "ERROR";
        pauseUntil?: string | null;
      }
    | null;

  if (
    isXIntegrationPaused(
      integrationValue?.status ? { status: integrationValue.status, pauseUntil: integrationValue.pauseUntil ?? null } : null
    )
  ) {
    return NextResponse.json(
      { error: "X billing credits are required before replies can be sent." },
      { status: 409 }
    );
  }

  let tokens;

  try {
    tokens = await getValidXAccessToken();
  } catch (error) {
    if (isXApiError(error)) {
      await markXIntegrationFailure({
        billingRequired: error.billingRequired,
        reason: getXFailureReason(error),
        statusCode: error.status
      });

      return NextResponse.json(
        {
          error: error.billingRequired
            ? "X billing credits are required before replies can be sent."
            : "Unable to validate the connected X account right now."
        },
        { status: error.billingRequired ? 409 : 502 }
      );
    }

    throw error;
  }

  if (!tokens?.accessToken) {
    return NextResponse.json({ error: "Connect the X account before sending replies." }, { status: 409 });
  }

  const claim = await prisma.mention.updateMany({
    where: {
      id: suggestion.mentionId,
      status: {
        in: ["DRAFTED", "APPROVED"]
      }
    },
    data: {
      status: "SENDING"
    }
  });

  if (claim.count === 0) {
    const duplicateSend = await prisma.replyAction.findFirst({
      where: {
        sentForMentionId: suggestion.mentionId
      }
    });

    return NextResponse.json(
      {
        error: duplicateSend
          ? "A reply has already been sent for this mention."
          : "This reply is no longer available for sending."
      },
      { status: 409 }
    );
  }

  let response;

  try {
    response = await createPost({
      accessToken: tokens.accessToken,
      text: suggestion.draftText,
      replyToPostId: suggestion.mention.xMentionId
    });
    await markXIntegrationHealthy();
  } catch (error) {
    await prisma.mention.updateMany({
      where: {
        id: suggestion.mentionId,
        status: "SENDING"
      },
      data: {
        status: suggestion.mention.status
      }
    });

    if (isXApiError(error)) {
      await markXIntegrationFailure({
        billingRequired: error.billingRequired,
        reason: getXFailureReason(error),
        statusCode: error.status
      });

      return NextResponse.json(
        {
          error: error.billingRequired
            ? "X billing credits are required before replies can be sent."
            : getXFailureReason(error)
        },
        { status: error.billingRequired ? 409 : 502 }
      );
    }

    throw error;
  }

  const replyData = response.data.data as { id?: string } | undefined;

  const action = await prisma.$transaction(async (tx) => {
    await tx.replySuggestion.update({
      where: { id },
      data: {
        selected: true
      }
    });

    await tx.mention.updateMany({
      where: {
        id: suggestion.mentionId,
        status: "SENDING"
      },
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
