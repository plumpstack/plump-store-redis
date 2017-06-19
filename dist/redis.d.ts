import * as Redis from 'redis';
import { KeyValueStore, ModelData, ModelSchema } from 'plump';
export declare class RedisStore extends KeyValueStore {
    redis: Redis.RedisClient;
    constructor(opts?: {
        redisClient?: Redis.RedisClient;
        terminal?: boolean;
    });
    promiseCall(method: string, ...args: any[]): Promise<any>;
    teardown(): Promise<any>;
    addSchema(t: {
        type: string;
        schema: ModelSchema;
    }): Promise<void>;
    _keys(type: string): Promise<string[]>;
    _get(k: string): Promise<ModelData | null>;
    _set(k: string, v: ModelData): Promise<ModelData>;
    _del(k: string): Promise<ModelData>;
}
