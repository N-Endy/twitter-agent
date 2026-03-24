import { Worker } from "bullmq";

import { getRedisConnection, queueNames } from "@twitter-agent/core";

import { handleCleanup } from "./jobs/cleanup";
import { handleDraftQa } from "./jobs/draft-qa";
import { handleMentionPoll } from "./jobs/mention-poll";
import { handleMetricsSync } from "./jobs/metrics-sync";
import { handlePublishPost } from "./jobs/publish-post";
import { handleReplyDraft } from "./jobs/reply-draft";
import { handleSourceIngest } from "./jobs/source-ingest";
import { handleWeeklyBatch } from "./jobs/weekly-batch";

const connection = getRedisConnection();

const workers = [
  new Worker(queueNames.sourceIngest, handleSourceIngest, { connection }),
  new Worker(queueNames.weeklyBatch, handleWeeklyBatch, { connection }),
  new Worker(queueNames.draftQa, handleDraftQa, { connection }),
  new Worker(queueNames.publishPost, handlePublishPost, { connection }),
  new Worker(queueNames.mentionPoll, handleMentionPoll, { connection }),
  new Worker(queueNames.replyDraft, handleReplyDraft, { connection }),
  new Worker(queueNames.metricsSync, handleMetricsSync, { connection }),
  new Worker(queueNames.cleanup, handleCleanup, { connection })
];

for (const worker of workers) {
  worker.on("completed", (job) => {
    console.log(`[${worker.name}] completed job ${job.id}`);
  });

  worker.on("failed", (job, error) => {
    console.error(`[${worker.name}] failed job ${job?.id ?? "unknown"}`, error);
  });
}

console.log("Twitter Agent worker started.");
