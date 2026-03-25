import type { Job } from "bullmq";

import { runWeeklyBatchJob } from "../lib/pipeline.js";

export async function handleWeeklyBatch(job: Job) {
  const result = await runWeeklyBatchJob();
  await job.log(`Created ${result.ideas} ideas and ${result.drafts} drafts.`);
  return result;
}
