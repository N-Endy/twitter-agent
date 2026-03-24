import type { Job } from "bullmq";

import { runReplyDraftJob } from "../lib/pipeline";

export async function handleReplyDraft(job: Job<{ mentionId?: string }>) {
  const result = await runReplyDraftJob(job.data.mentionId);
  await job.log(`Drafted ${result.drafted} replies.`);
  return result;
}
