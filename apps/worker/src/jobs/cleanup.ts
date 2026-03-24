import type { Job } from "bullmq";

import { runCleanupJob } from "../lib/pipeline";

export async function handleCleanup(job: Job) {
  const result = await runCleanupJob();
  await job.log(`Reopened ${result.reopened} stale schedule slots.`);
  return result;
}
