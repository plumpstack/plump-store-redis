var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as Bluebird from 'bluebird';
import * as Redis from 'redis';
import { KeyValueStore } from 'plump';
var RedisService = Bluebird.promisifyAll(Redis);
var RedisStore = (function (_super) {
    __extends(RedisStore, _super);
    function RedisStore(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, opts) || this;
        var options = Object.assign({}, {
            port: 6379,
            host: 'localhost',
            db: 0,
            retry_strategy: function (o) {
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
        }, opts);
        if (opts.redisClient !== undefined) {
            _this.redis = opts.redisClient;
        }
        else {
            _this.redis = RedisService.createClient(options);
        }
        return _this;
    }
    RedisStore.prototype.teardown = function () {
        return this.redis.quitAsync();
    };
    RedisStore.prototype._keys = function (typeName) {
        return this.redis.keysAsync(typeName + ":*");
    };
    RedisStore.prototype._get = function (k) {
        return this.redis.getAsync(k).then(function (v) { return JSON.parse(v); });
    };
    RedisStore.prototype._set = function (k, v) {
        return this.redis.setAsync(k, JSON.stringify(v));
    };
    RedisStore.prototype._del = function (k) {
        return this.redis.delAsync(k);
    };
    return RedisStore;
}(KeyValueStore));
export { RedisStore };

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQXZEQSxBQXVEQyxDQXZEK0IsYUFBYSxHQXVENUMiLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgKiBhcyBSZWRpcyBmcm9tICdyZWRpcyc7XG5pbXBvcnQgeyBLZXlWYWx1ZVN0b3JlLCBNb2RlbERhdGEgfSBmcm9tICdwbHVtcCc7XG5cbmNvbnN0IFJlZGlzU2VydmljZTogYW55ID0gQmx1ZWJpcmQucHJvbWlzaWZ5QWxsKFJlZGlzKTtcblxuZXhwb3J0IGNsYXNzIFJlZGlzU3RvcmUgZXh0ZW5kcyBLZXlWYWx1ZVN0b3JlIHtcbiAgcHJpdmF0ZSByZWRpczogYW55O1xuICBjb25zdHJ1Y3RvcihvcHRzOiB7IHJlZGlzQ2xpZW50PzogYW55IH0gPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIHBvcnQ6IDYzNzksXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBkYjogMCxcbiAgICAgICAgcmV0cnlfc3RyYXRlZ3k6IChvKSA9PiB7XG4gICAgICAgICAgaWYgKG8uZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgb24gYSBzcGVjaWZpYyBlcnJvciBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdUaGUgc2VydmVyIHJlZnVzZWQgdGhlIGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udG90YWxfcmV0cnlfdGltZSA+IDEwMDAgKiA2MCAqIDYwKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIGFmdGVyIGEgc3BlY2lmaWMgdGltZW91dCBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXRyeSB0aW1lIGV4aGF1c3RlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoby50aW1lc19jb25uZWN0ZWQgPiAxMCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyB3aXRoIGJ1aWx0IGluIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZWNvbm5lY3QgYWZ0ZXJcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoby5hdHRlbXB0ICogMTAwLCAzMDAwKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICBpZiAob3B0cy5yZWRpc0NsaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlZGlzID0gb3B0cy5yZWRpc0NsaWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWRpcyA9IFJlZGlzU2VydmljZS5jcmVhdGVDbGllbnQob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXMucXVpdEFzeW5jKCk7XG4gIH1cblxuICBfa2V5cyh0eXBlTmFtZTogc3RyaW5nKTogQmx1ZWJpcmQ8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gdGhpcy5yZWRpcy5rZXlzQXN5bmMoYCR7dHlwZU5hbWV9OipgKTtcbiAgfVxuXG4gIF9nZXQoazogc3RyaW5nKTogQmx1ZWJpcmQ8TW9kZWxEYXRhIHwgbnVsbD4ge1xuICAgIHJldHVybiB0aGlzLnJlZGlzLmdldEFzeW5jKGspLnRoZW4odiA9PiBKU09OLnBhcnNlKHYpKTtcbiAgfVxuXG4gIF9zZXQoazogc3RyaW5nLCB2OiBNb2RlbERhdGEpOiBCbHVlYmlyZDxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5yZWRpcy5zZXRBc3luYyhrLCBKU09OLnN0cmluZ2lmeSh2KSk7XG4gIH1cblxuICBfZGVsKGs6IHN0cmluZyk6IEJsdWViaXJkPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnJlZGlzLmRlbEFzeW5jKGspO1xuICB9XG59XG4iXX0=
