import type { Job } from "bullmq";

import { runDraftQaJob } from "../lib/pipeline.js";

export async function handleDraftQa(job: Job<{ draftId?: string }>) {
  const result = await runDraftQaJob(job.data.draftId);
  await job.log(`Processed ${result.processed} drafts.`);
  return result;
}
