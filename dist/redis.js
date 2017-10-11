"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Redis = require("redis");
var plump_1 = require("plump");
function saneNumber(i) {
    return (typeof i === 'number' && !isNaN(i) && i !== Infinity && i !== -Infinity);
}
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
                    return new Error('The server refused the connection');
                }
                if (o.total_retry_time > 1000 * 60 * 60) {
                    return new Error('Retry time exhausted');
                }
                if (o.times_connected > 10) {
                    return undefined;
                }
                return Math.max(o.attempt * 100, 3000);
            },
        }, opts);
        if (opts.redisClient !== undefined) {
            _this.redis = opts.redisClient;
        }
        else {
            _this.redis = Redis.createClient(options);
        }
        return _this;
    }
    RedisStore.prototype.promiseCall = function (method) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            var argsWithCB = args.concat(function (err, val) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(val);
                }
            });
            _this.redis[method].apply(_this.redis, argsWithCB);
        });
    };
    RedisStore.prototype.teardown = function () {
        return this.promiseCall('quit');
    };
    RedisStore.prototype.addSchema = function (t) {
        var _this = this;
        return _super.prototype.addSchema.call(this, t).then(function () {
            return _this._keys(t.type)
                .then(function (keyArray) {
                if (keyArray.length === 0) {
                    return 0;
                }
                else {
                    return keyArray
                        .map(function (k) { return k.split(':')[1]; })
                        .map(function (k) { return parseInt(k, 10); })
                        .filter(function (i) { return saneNumber(i); })
                        .reduce(function (max, current) { return (current > max ? current : max); }, 0);
                }
            })
                .then(function (n) {
                _this.maxKeys[t.type] = n;
            });
        });
    };
    RedisStore.prototype.readAttributes = function (value) {
        var _this = this;
        return _super.prototype.readAttributes.call(this, value).then(function (response) {
            var schema = _this.getSchema(value.type);
            Object.keys(schema.attributes)
                .filter(function (attr) { return schema.attributes[attr].type === 'date'; })
                .forEach(function (dateAttr) {
                response.attributes[dateAttr] = new Date(response.attributes[dateAttr]);
            });
            return response;
        });
    };
    RedisStore.prototype._keys = function (type) {
        return this.promiseCall('keys', type + ":*");
    };
    RedisStore.prototype._get = function (k) {
        return this.promiseCall('get', k).then(function (v) { return JSON.parse(v); });
    };
    RedisStore.prototype._set = function (k, v) {
        return this.promiseCall('set', k, JSON.stringify(v));
    };
    RedisStore.prototype._del = function (k) {
        return this.promiseCall('del', k);
    };
    return RedisStore;
}(plump_1.KeyValueStore));
exports.RedisStore = RedisStore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDSCxpQkFBQztBQUFELENBeEdBLEFBd0dDLENBeEcrQixxQkFBYSxHQXdHNUM7QUF4R1ksZ0NBQVUiLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWRpcyBmcm9tICdyZWRpcyc7XG5pbXBvcnQgeyBLZXlWYWx1ZVN0b3JlLCBNb2RlbERhdGEsIE1vZGVsU2NoZW1hLCBNb2RlbFJlZmVyZW5jZSB9IGZyb20gJ3BsdW1wJztcblxuZnVuY3Rpb24gc2FuZU51bWJlcihpKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIGkgPT09ICdudW1iZXInICYmICFpc05hTihpKSAmJiBpICE9PSBJbmZpbml0eSAmJiBpICE9PSAtSW5maW5pdHlcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZGlzU3RvcmUgZXh0ZW5kcyBLZXlWYWx1ZVN0b3JlIHtcbiAgcHVibGljIHJlZGlzOiBSZWRpcy5SZWRpc0NsaWVudDtcbiAgY29uc3RydWN0b3IoXG4gICAgb3B0czogeyByZWRpc0NsaWVudD86IFJlZGlzLlJlZGlzQ2xpZW50OyB0ZXJtaW5hbD86IGJvb2xlYW4gfSA9IHt9LFxuICApIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBwb3J0OiA2Mzc5LFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgZGI6IDAsXG4gICAgICAgIHJldHJ5X3N0cmF0ZWd5OiBvID0+IHtcbiAgICAgICAgICBpZiAoby5lcnJvci5jb2RlID09PSAnRUNPTk5SRUZVU0VEJykge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyBvbiBhIHNwZWNpZmljIGVycm9yIGFuZCBmbHVzaCBhbGwgY29tbWFuZHMgd2l0aCBhIGluZGl2aWR1YWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1RoZSBzZXJ2ZXIgcmVmdXNlZCB0aGUgY29ubmVjdGlvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoby50b3RhbF9yZXRyeV90aW1lID4gMTAwMCAqIDYwICogNjApIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3RpbmcgYWZ0ZXIgYSBzcGVjaWZpYyB0aW1lb3V0IGFuZCBmbHVzaCBhbGwgY29tbWFuZHMgd2l0aCBhIGluZGl2aWR1YWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1JldHJ5IHRpbWUgZXhoYXVzdGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvLnRpbWVzX2Nvbm5lY3RlZCA+IDEwKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIHdpdGggYnVpbHQgaW4gZXJyb3JcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlY29ubmVjdCBhZnRlclxuICAgICAgICAgIHJldHVybiBNYXRoLm1heChvLmF0dGVtcHQgKiAxMDAsIDMwMDApO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9wdHMsXG4gICAgKTtcbiAgICBpZiAob3B0cy5yZWRpc0NsaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlZGlzID0gb3B0cy5yZWRpc0NsaWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWRpcyA9IFJlZGlzLmNyZWF0ZUNsaWVudChvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlQ2FsbChtZXRob2Q6IHN0cmluZywgLi4uYXJncyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3NXaXRoQ0IgPSBhcmdzLmNvbmNhdCgoZXJyLCB2YWwpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZGlzW21ldGhvZF0uYXBwbHkodGhpcy5yZWRpcywgYXJnc1dpdGhDQik7XG4gICAgfSk7XG4gIH1cblxuICB0ZWFyZG93bigpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgncXVpdCcpO1xuICB9XG5cbiAgYWRkU2NoZW1hKHQ6IHsgdHlwZTogc3RyaW5nOyBzY2hlbWE6IE1vZGVsU2NoZW1hIH0pIHtcbiAgICByZXR1cm4gc3VwZXIuYWRkU2NoZW1hKHQpLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2tleXModC50eXBlKVxuICAgICAgICAudGhlbigoa2V5QXJyYXk6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgaWYgKGtleUFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlBcnJheVxuICAgICAgICAgICAgICAubWFwKGsgPT4gay5zcGxpdCgnOicpWzFdKVxuICAgICAgICAgICAgICAubWFwKGsgPT4gcGFyc2VJbnQoaywgMTApKVxuICAgICAgICAgICAgICAuZmlsdGVyKGkgPT4gc2FuZU51bWJlcihpKSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgobWF4LCBjdXJyZW50KSA9PiAoY3VycmVudCA+IG1heCA/IGN1cnJlbnQgOiBtYXgpLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKChuOiBudW1iZXIpID0+IHtcbiAgICAgICAgICB0aGlzLm1heEtleXNbdC50eXBlXSA9IG47XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVhZEF0dHJpYnV0ZXModmFsdWU6IE1vZGVsUmVmZXJlbmNlKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gc3VwZXIucmVhZEF0dHJpYnV0ZXModmFsdWUpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5nZXRTY2hlbWEodmFsdWUudHlwZSk7XG4gICAgICBPYmplY3Qua2V5cyhzY2hlbWEuYXR0cmlidXRlcylcbiAgICAgICAgLmZpbHRlcihhdHRyID0+IHNjaGVtYS5hdHRyaWJ1dGVzW2F0dHJdLnR5cGUgPT09ICdkYXRlJylcbiAgICAgICAgLmZvckVhY2goZGF0ZUF0dHIgPT4ge1xuICAgICAgICAgIHJlc3BvbnNlLmF0dHJpYnV0ZXNbZGF0ZUF0dHJdID0gbmV3IERhdGUoXG4gICAgICAgICAgICByZXNwb25zZS5hdHRyaWJ1dGVzW2RhdGVBdHRyXSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfVxuXG4gIF9rZXlzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgna2V5cycsIGAke3R5cGV9OipgKTtcbiAgfVxuXG4gIF9nZXQoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGEgfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2dldCcsIGspLnRoZW4oKHY6IHN0cmluZykgPT4gSlNPTi5wYXJzZSh2KSk7XG4gIH1cblxuICBfc2V0KGs6IHN0cmluZywgdjogTW9kZWxEYXRhKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgnc2V0JywgaywgSlNPTi5zdHJpbmdpZnkodikpO1xuICB9XG5cbiAgX2RlbChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdkZWwnLCBrKTtcbiAgfVxufVxuIl19
