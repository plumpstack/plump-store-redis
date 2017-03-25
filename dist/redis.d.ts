/// <reference types="bluebird" />
import * as Bluebird from 'bluebird';
import { KeyValueStore, ModelData, ModelSchema } from 'plump';
export declare class RedisStore extends KeyValueStore {
    private redis;
    constructor(opts?: {
        redisClient?: any;
        terminal?: boolean;
    });
    teardown(): any;
    addSchema(t: {
        typeName: string;
        schema: ModelSchema;
    }): Bluebird<void>;
    _keys(typeName: string): Bluebird<string[]>;
    _get(k: string): Bluebird<ModelData | null>;
    _set(k: string, v: ModelData): Bluebird<ModelData>;
    _del(k: string): Bluebird<ModelData>;
}
