/* eslint-env node, mocha*/
/* eslint no-shadow: 0 */

import { RedisStore } from '../src/redis';
import { testSuite } from './storageTests';
import * as Redis from 'fakeredis';
import * as Bluebird from 'bluebird';

import 'mocha';

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
