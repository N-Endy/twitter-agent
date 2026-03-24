export const queueNames = {
  sourceIngest: "source-ingest",
  weeklyBatch: "weekly-batch",
  draftQa: "draft-qa",
  publishPost: "publish-post",
  mentionPoll: "mention-poll",
  replyDraft: "reply-draft",
  metricsSync: "metrics-sync",
  cleanup: "cleanup-retry"
} as const;

export type QueueName = (typeof queueNames)[keyof typeof queueNames];
