import { Queue } from "bullmq";
import { queueNames } from "./names";
export declare function getRedisConnection(): {
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    db: number | undefined;
    maxRetriesPerRequest: null;
};
export declare function getQueue(name: (typeof queueNames)[keyof typeof queueNames]): Queue<any, any, string, any, any, string>;
