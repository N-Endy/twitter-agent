import type { Job } from "bullmq";

import { runMetricsSyncJob } from "../lib/pipeline.js";

export async function handleMetricsSync(job: Job) {
  const result = await runMetricsSyncJob();
  await job.log(`Synced ${result.synced} published posts.`);
  return result;
}
