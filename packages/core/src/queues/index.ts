import { Queue, type ConnectionOptions } from "bullmq";

import { getEnv } from "../env.js";
import { queueNames } from "./names.js";

export function getRedisConnection() {
  const redisUrl = new URL(getEnv().REDIS_URL);

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    db: redisUrl.pathname ? Number(redisUrl.pathname.replace("/", "") || 0) : undefined,
    maxRetriesPerRequest: null
  } satisfies ConnectionOptions;
}

export function getQueue(name: (typeof queueNames)[keyof typeof queueNames]) {
  return new Queue(name, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5_000
      },
      removeOnComplete: 100,
      removeOnFail: 200
    }
  });
}
