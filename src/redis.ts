import * as Redis from 'redis';
import { KeyValueStore, ModelData, ModelSchema } from 'plump';

function saneNumber(i) {
  return ((typeof i === 'number') && (!isNaN(i)) && (i !== Infinity) && (i !== -Infinity));
}

export class RedisStore extends KeyValueStore {
  public redis: Redis.RedisClient;
  constructor(opts: { redisClient?: Redis.RedisClient, terminal?: boolean } = {}) {
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
      this.redis = Redis.createClient(options);
    }
  }

  promiseCall(method: string, ...args): Promise<any> {
    return new Promise((resolve, reject) => {
      const argsWithCB = args.concat((err, val) => {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      });
      this.redis[method].apply(this.redis, argsWithCB);
    });
  }

  teardown() {
    return this.promiseCall('quit');
  }

  addSchema(t: {type: string, schema: ModelSchema}) {
    return super.addSchema(t)
    .then(() => {
      return this._keys(t.type)
      .then((keyArray: string[]) => {
        if (keyArray.length === 0) {
          return 0;
        } else {
          return keyArray.map((k) => k.split(':')[1])
          .map((k) => parseInt(k, 10))
          .filter((i) => saneNumber(i))
          .reduce((max, current) => (current > max) ? current : max, 0);
        }
      }).then((n: number) => {
        this.maxKeys[t.type] = n;
      });
    });
  }

  _keys(type: string): Promise<string[]> {
    return this.promiseCall('keys', `${type}:*`);
  }

  _get(k: string): Promise<ModelData | null> {
    return this.promiseCall('get', k).then((v: string) => JSON.parse(v));
  }

  _set(k: string, v: ModelData): Promise<ModelData> {
    return this.promiseCall('set', k, JSON.stringify(v));
  }

  _del(k: string): Promise<ModelData> {
    return this.promiseCall('del', k);
  }
}
