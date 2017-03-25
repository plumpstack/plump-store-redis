import * as Bluebird from 'bluebird';
import * as Redis from 'redis';
import { KeyValueStore, ModelData } from 'plump';

const RedisService: any = Bluebird.promisifyAll(Redis);

export class RedisStore extends KeyValueStore {
  private redis: any;
  constructor(opts: { redisClient?: any } = {}) {
    super(opts);
    const options = Object.assign(
      {},
      {
        port: 6379,
        host: 'localhost',
        db: 0,
        retry_strategy: (o) => {
          if (o.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
          }
          if (o.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
          }
          if (o.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
          }
          // reconnect after
          return Math.max(o.attempt * 100, 3000);
        },
      },
      opts
    );
    if (opts.redisClient !== undefined) {
      this.redis = opts.redisClient;
    } else {
      this.redis = RedisService.createClient(options);
    }
  }

  teardown() {
    return this.redis.quitAsync();
  }

  _keys(typeName: string): Bluebird<string[]> {
    return this.redis.keysAsync(`${typeName}:*`);
  }

  _get(k: string): Bluebird<ModelData | null> {
    return this.redis.getAsync(k).then(v => JSON.parse(v));
  }

  _set(k: string, v: ModelData): Bluebird<ModelData> {
    return this.redis.setAsync(k, JSON.stringify(v));
  }

  _del(k: string): Bluebird<ModelData> {
    return this.redis.delAsync(k);
  }
}
