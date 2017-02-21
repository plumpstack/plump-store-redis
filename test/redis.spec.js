/* eslint-env node, mocha*/
/* eslint no-shadow: 0 */

import { RedisStore } from '../src/redis';
import { testSuite } from 'plump/test/storageTests';
import * as Redis from 'fakeredis';
import Bluebird from 'bluebird';

Bluebird.promisifyAll(Redis);

testSuite({
  describe, it, before, after,
}, {
  ctor: RedisStore,
  opts: {
    redisClient: Redis.createClient(),
    terminal: true,
  },
  name: 'Plump Redis Store',
});
