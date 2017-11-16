'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RedisStore = undefined;

var _redis = require('redis');

var Redis = _interopRequireWildcard(_redis);

var _plump = require('plump');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function saneNumber(i) {
    return typeof i === 'number' && !isNaN(i) && i !== Infinity && i !== -Infinity;
}
class RedisStore extends _plump.KeyValueStore {
    constructor(opts = {}) {
        super(opts);
        const options = Object.assign({}, {
            port: 6379,
            host: 'localhost',
            db: 0,
            retry_strategy: o => {
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
            }
        }, opts);
        if (opts.redisClient !== undefined) {
            this.redis = opts.redisClient;
        } else {
            this.redis = Redis.createClient(options);
        }
    }
    promiseCall(method, ...args) {
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
    addSchema(t) {
        return super.addSchema(t).then(() => {
            return this._keys(t.type).then(keyArray => {
                if (keyArray.length === 0) {
                    return 0;
                } else {
                    return keyArray.map(k => k.split(':')[1]).map(k => parseInt(k, 10)).filter(i => saneNumber(i)).reduce((max, current) => current > max ? current : max, 0);
                }
            }).then(n => {
                this.maxKeys[t.type] = n;
            });
        });
    }
    readAttributes(req) {
        return super.readAttributes(req).then(response => {
            const schema = this.getSchema(req.item.type);
            Object.keys(schema.attributes).filter(attr => schema.attributes[attr].type === 'date').forEach(dateAttr => {
                response.attributes[dateAttr] = new Date(response.attributes[dateAttr]);
            });
            return response;
        });
    }
    _keys(type) {
        return this.promiseCall('keys', `${type}:*`);
    }
    _get(k) {
        return this.promiseCall('get', k).then(v => JSON.parse(v));
    }
    _set(k, v) {
        return this.promiseCall('set', k, JSON.stringify(v));
    }
    _del(k) {
        return this.promiseCall('del', k);
    }
}
exports.RedisStore = RedisStore;