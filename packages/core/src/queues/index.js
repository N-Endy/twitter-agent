import { Queue } from "bullmq";
import { getEnv } from "../env";
export function getRedisConnection() {
    const redisUrl = new URL(getEnv().REDIS_URL);
    return {
        host: redisUrl.hostname,
        port: Number(redisUrl.port || 6379),
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
        db: redisUrl.pathname ? Number(redisUrl.pathname.replace("/", "") || 0) : undefined,
        maxRetriesPerRequest: null
    };
}
export function getQueue(name) {
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
