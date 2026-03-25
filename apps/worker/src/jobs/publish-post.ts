import type { Job } from "bullmq";

import { runPublishPostJob } from "../lib/pipeline";

export async function handlePublishPost(job: Job) {
  const result = await runPublishPostJob();
  await job.log(`Published ${result.published} posts.`);
  return result;
}
