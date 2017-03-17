import * as Promise from 'bluebird';
import * as Redis from 'redis';
import { KeyValueStore } from 'plump';


const RedisService = Promise.promisifyAll(Redis);
const $redis = Symbol('$redis');

export class RedisStore extends KeyValueStore {

  constructor(opts = {}) {
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
      this[$redis] = opts.redisClient;
    } else {
      this[$redis] = RedisService.createClient(options);
    }
    this.isCache = true;
  }

  teardown() {
    return this[$redis].quitAsync();
  }

  _keys(typeName) {
    return this[$redis].keysAsync(`${typeName}:attributes:*`);
  }

  _get(k) {
    return this[$redis].getAsync(k);
  }

  _set(k, v) {
    return this[$redis].setAsync(k, v);
  }

  _del(k) {
    return this[$redis].delAsync(k);
  }
}
