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
    return ((typeof i === 'number') && (!isNaN(i)) && (i !== Infinity) && (i !== -Infinity));
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
    RedisStore.prototype.teardown = function () {
        return this.redis.quitAsync();
    };
    RedisStore.prototype.addSchema = function (t) {
        var _this = this;
        return _super.prototype.addSchema.call(this, t)
            .then(function () {
            return _this._keys(t.typeName)
                .then(function (keyArray) {
                if (keyArray.length === 0) {
                    return 0;
                }
                else {
                    return keyArray.map(function (k) { return k.split(':')[1]; })
                        .map(function (k) { return parseInt(k, 10); })
                        .filter(function (i) { return saneNumber(i); })
                        .reduce(function (max, current) { return (current > max) ? current : max; }, 0);
                }
            }).then(function (n) {
                _this.maxKeys[t.typeName] = n;
            });
        });
    };
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
    RedisStore.prototype._keys = function (typeName) {
        return this.promiseCall('keys', typeName + ":*");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBSyxRQUFRLE9BQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCx5QkFBSSxHQUFKLFVBQUssQ0FBUztRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCx5QkFBSSxHQUFKLFVBQUssQ0FBUyxFQUFFLENBQVk7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDSCxpQkFBQztBQUFELENBdkZBLEFBdUZDLENBdkYrQixxQkFBYSxHQXVGNUM7QUF2RlksZ0NBQVUiLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWRpcyBmcm9tICdyZWRpcyc7XG5pbXBvcnQgeyBLZXlWYWx1ZVN0b3JlLCBNb2RlbERhdGEsIE1vZGVsU2NoZW1hIH0gZnJvbSAncGx1bXAnO1xuXG5mdW5jdGlvbiBzYW5lTnVtYmVyKGkpIHtcbiAgcmV0dXJuICgodHlwZW9mIGkgPT09ICdudW1iZXInKSAmJiAoIWlzTmFOKGkpKSAmJiAoaSAhPT0gSW5maW5pdHkpICYmIChpICE9PSAtSW5maW5pdHkpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJlZGlzU3RvcmUgZXh0ZW5kcyBLZXlWYWx1ZVN0b3JlIHtcbiAgcHJpdmF0ZSByZWRpczogYW55O1xuICBjb25zdHJ1Y3RvcihvcHRzOiB7IHJlZGlzQ2xpZW50PzogYW55LCB0ZXJtaW5hbD86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHtcbiAgICAgICAgcG9ydDogNjM3OSxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIGRiOiAwLFxuICAgICAgICByZXRyeV9zdHJhdGVneTogKG8pID0+IHtcbiAgICAgICAgICBpZiAoby5lcnJvci5jb2RlID09PSAnRUNPTk5SRUZVU0VEJykge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyBvbiBhIHNwZWNpZmljIGVycm9yIGFuZCBmbHVzaCBhbGwgY29tbWFuZHMgd2l0aCBhIGluZGl2aWR1YWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1RoZSBzZXJ2ZXIgcmVmdXNlZCB0aGUgY29ubmVjdGlvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoby50b3RhbF9yZXRyeV90aW1lID4gMTAwMCAqIDYwICogNjApIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3RpbmcgYWZ0ZXIgYSBzcGVjaWZpYyB0aW1lb3V0IGFuZCBmbHVzaCBhbGwgY29tbWFuZHMgd2l0aCBhIGluZGl2aWR1YWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1JldHJ5IHRpbWUgZXhoYXVzdGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvLnRpbWVzX2Nvbm5lY3RlZCA+IDEwKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIHdpdGggYnVpbHQgaW4gZXJyb3JcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHJlY29ubmVjdCBhZnRlclxuICAgICAgICAgIHJldHVybiBNYXRoLm1heChvLmF0dGVtcHQgKiAxMDAsIDMwMDApO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIGlmIChvcHRzLnJlZGlzQ2xpZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVkaXMgPSBvcHRzLnJlZGlzQ2xpZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZGlzID0gUmVkaXMuY3JlYXRlQ2xpZW50KG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHRlYXJkb3duKCkge1xuICAgIHJldHVybiB0aGlzLnJlZGlzLnF1aXRBc3luYygpO1xuICB9XG5cbiAgYWRkU2NoZW1hKHQ6IHt0eXBlTmFtZTogc3RyaW5nLCBzY2hlbWE6IE1vZGVsU2NoZW1hfSkge1xuICAgIHJldHVybiBzdXBlci5hZGRTY2hlbWEodClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fa2V5cyh0LnR5cGVOYW1lKVxuICAgICAgLnRoZW4oKGtleUFycmF5KSA9PiB7XG4gICAgICAgIGlmIChrZXlBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ga2V5QXJyYXkubWFwKChrKSA9PiBrLnNwbGl0KCc6JylbMV0pXG4gICAgICAgICAgLm1hcCgoaykgPT4gcGFyc2VJbnQoaywgMTApKVxuICAgICAgICAgIC5maWx0ZXIoKGkpID0+IHNhbmVOdW1iZXIoaSkpXG4gICAgICAgICAgLnJlZHVjZSgobWF4LCBjdXJyZW50KSA9PiAoY3VycmVudCA+IG1heCkgPyBjdXJyZW50IDogbWF4LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSkudGhlbigobikgPT4ge1xuICAgICAgICB0aGlzLm1heEtleXNbdC50eXBlTmFtZV0gPSBuO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9taXNlQ2FsbChtZXRob2Q6IHN0cmluZywgLi4uYXJncyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGFyZ3NXaXRoQ0IgPSBhcmdzLmNvbmNhdCgoZXJyLCB2YWwpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZGlzW21ldGhvZF0uYXBwbHkodGhpcy5yZWRpcywgYXJnc1dpdGhDQik7XG4gICAgfSk7XG4gIH1cblxuICBfa2V5cyh0eXBlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdrZXlzJywgYCR7dHlwZU5hbWV9OipgKTtcbiAgfVxuXG4gIF9nZXQoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGEgfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2dldCcsIGspLnRoZW4odiA9PiBKU09OLnBhcnNlKHYpKTtcbiAgfVxuXG4gIF9zZXQoazogc3RyaW5nLCB2OiBNb2RlbERhdGEpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdzZXQnLCBrLCBKU09OLnN0cmluZ2lmeSh2KSk7XG4gIH1cblxuICBfZGVsKGs6IHN0cmluZyk6IFByb21pc2U8TW9kZWxEYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2RlbCcsIGspO1xuICB9XG59XG4iXX0=
