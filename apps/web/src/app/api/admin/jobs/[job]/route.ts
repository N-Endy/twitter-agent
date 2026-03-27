import { NextResponse } from "next/server";

import { getQueue, queueNames } from "@twitter-agent/core";
import { requireApiSession } from "@/lib/guards";
import { createAuditLog } from "@/lib/operator";

const JOB_CONFIG = {
  "source-ingest": {
    queue: queueNames.sourceIngest,
    action: "job.source_ingest.triggered"
  },
  "weekly-batch": {
    queue: queueNames.weeklyBatch,
    action: "job.weekly_batch.triggered"
  },
  "draft-qa": {
    queue: queueNames.draftQa,
    action: "job.draft_qa.triggered"
  },
  "publish-post": {
    queue: queueNames.publishPost,
    action: "job.publish_post.triggered"
  },
  "mention-poll": {
    queue: queueNames.mentionPoll,
    action: "job.mention_poll.triggered"
  },
  "reply-draft": {
    queue: queueNames.replyDraft,
    action: "job.reply_draft.triggered"
  },
  "metrics-sync": {
    queue: queueNames.metricsSync,
    action: "job.metrics_sync.triggered"
  },
  cleanup: {
    queue: queueNames.cleanup,
    action: "job.cleanup.triggered"
  }
} as const;

type JobSlug = keyof typeof JOB_CONFIG;

export async function POST(request: Request, { params }: { params: Promise<{ job: string }> }) {
  const session = await requireApiSession();

  if (session instanceof NextResponse) {
    return session;
  }

  const { job } = await params;
  const config = JOB_CONFIG[job as JobSlug];

  if (!config) {
    return NextResponse.json({ error: "Unknown operator job." }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    mentionId?: string;
    draftId?: string;
  };

  const payload: Record<string, unknown> = {
    triggeredAt: new Date().toISOString(),
    triggeredBy: session.user.email ?? "owner"
  };

  if (job === "reply-draft" && body.mentionId) {
    payload.mentionId = body.mentionId;
  }

  if (job === "draft-qa" && body.draftId) {
    payload.draftId = body.draftId;
  }

  const queuedJob = await getQueue(config.queue).add("admin", payload);

  await createAuditLog({
    actor: session.user.email ?? "owner",
    action: config.action,
    entityType: "queue",
    entityId: config.queue,
    details: payload
  });

  return NextResponse.json({
    ok: true,
    queue: config.queue,
    jobId: queuedJob.id
  });
}
