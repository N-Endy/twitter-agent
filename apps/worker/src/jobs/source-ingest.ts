import type { Job } from "bullmq";

import { runSourceIngestJob } from "../lib/pipeline";

export async function handleSourceIngest(job: Job) {
  const result = await runSourceIngestJob();
  await job.log(`Created ${result.created} research snapshots.`);
  return result;
}
