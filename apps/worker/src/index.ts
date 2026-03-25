import { Worker } from "bullmq";

import { getRedisConnection, queueNames } from "@twitter-agent/core";

import { handleCleanup } from "./jobs/cleanup.js";
import { handleDraftQa } from "./jobs/draft-qa.js";
import { handleMentionPoll } from "./jobs/mention-poll.js";
import { handleMetricsSync } from "./jobs/metrics-sync.js";
import { handlePublishPost } from "./jobs/publish-post.js";
import { handleReplyDraft } from "./jobs/reply-draft.js";
import { handleSourceIngest } from "./jobs/source-ingest.js";
import { handleWeeklyBatch } from "./jobs/weekly-batch.js";

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
