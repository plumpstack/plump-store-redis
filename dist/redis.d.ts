/// <reference types="bluebird" />
import * as Bluebird from 'bluebird';
import { KeyValueStore, ModelData } from 'plump';
export declare class RedisStore extends KeyValueStore {
    private redis;
    constructor(opts?: {
        redisClient?: any;
    });
    teardown(): any;
    _keys(typeName: string): Bluebird<string[]>;
    _get(k: string): Bluebird<ModelData | null>;
    _set(k: string, v: ModelData): Bluebird<ModelData>;
    _del(k: string): Bluebird<ModelData>;
}
