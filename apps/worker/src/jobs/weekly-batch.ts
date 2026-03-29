import type { Job } from "bullmq";

import {
  markWeeklyBatchFailed,
  markWeeklyBatchRunning,
  markWeeklyBatchSucceeded
} from "@twitter-agent/core";

import { runWeeklyBatchJob } from "../lib/pipeline";

export async function handleWeeklyBatch(
  job: Job<{ triggeredAt?: string; triggeredBy?: string }>
) {
  const jobId = typeof job.id === "string" ? job.id : null;

  await markWeeklyBatchRunning({
    jobId,
    triggeredAt: typeof job.data?.triggeredAt === "string" ? job.data.triggeredAt : null,
    triggeredBy: typeof job.data?.triggeredBy === "string" ? job.data.triggeredBy : null
  });

  try {
    const result = await runWeeklyBatchJob();
    await markWeeklyBatchSucceeded({
      jobId,
      ideasCreated: result.ideas,
      draftsCreated: result.drafts
    });
    await job.log(`Created ${result.ideas} ideas and ${result.drafts} drafts.`);
    return result;
  } catch (error) {
    await markWeeklyBatchFailed({
      jobId,
      errorMessage: error instanceof Error ? error.message : "Weekly batch failed."
    });
    throw error;
  }
}
