export declare const queueNames: {
    readonly sourceIngest: "source-ingest";
    readonly weeklyBatch: "weekly-batch";
    readonly draftQa: "draft-qa";
    readonly publishPost: "publish-post";
    readonly mentionPoll: "mention-poll";
    readonly replyDraft: "reply-draft";
    readonly metricsSync: "metrics-sync";
    readonly cleanup: "cleanup-retry";
};
export type QueueName = (typeof queueNames)[keyof typeof queueNames];
