import { RedisStore } from '../src/redis';
import { testSuite } from './storageTests';
import { TestType } from './testType';
import * as Redis from 'fakeredis';
import * as Bluebird from 'bluebird';

import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

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

describe('Redis-specific functionality', () => {
  it('should pre-allocate id values based on the store contents', () => {
    const testClient = Redis.createClient();
    const testStore = new RedisStore({ redisClient: testClient, terminal: true });
    return testClient.setAsync(testStore.keyString({ typeName: TestType.typeName, id: 1 }), 'foo')
    .then(() => testClient.setAsync(testStore.keyString({ typeName: TestType.typeName, id: 7 }), 'foo'))
    .then(() => testStore.addSchema(TestType))
    .then(() => testStore.allocateId(TestType.typeName))
    .then((n) => expect(n).to.equal(8))
    .then(() => testStore.allocateId(TestType.typeName))
    .then((n) => expect(n).to.equal(9));
  });
});
