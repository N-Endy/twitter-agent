import type { Job } from "bullmq";

import { runMentionPollJob } from "../lib/pipeline.js";

export async function handleMentionPoll(job: Job) {
  const result = await runMentionPollJob();
  await job.log(`Ingested ${result.created} mentions.`);
  return result;
}
