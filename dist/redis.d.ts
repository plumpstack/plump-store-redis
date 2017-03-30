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
    }): Promise<void>;
    promiseCall(method: string, ...args: any[]): Promise<any>;
    _keys(typeName: string): Promise<string[]>;
    _get(k: string): Promise<ModelData | null>;
    _set(k: string, v: ModelData): Promise<ModelData>;
    _del(k: string): Promise<ModelData>;
}
