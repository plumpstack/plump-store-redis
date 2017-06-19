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
        return _super.prototype.addSchema.call(this, t)
            .then(function () {
            return _this._keys(t.type)
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
                _this.maxKeys[t.type] = n;
            });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFLLElBQUksT0FBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVMsSUFBSyxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTLEVBQUUsQ0FBWTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQseUJBQUksR0FBSixVQUFLLENBQVM7UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0F2RkEsQUF1RkMsQ0F2RitCLHFCQUFhLEdBdUY1QztBQXZGWSxnQ0FBVSIsImZpbGUiOiJyZWRpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlZGlzIGZyb20gJ3JlZGlzJztcbmltcG9ydCB7IEtleVZhbHVlU3RvcmUsIE1vZGVsRGF0YSwgTW9kZWxTY2hlbWEgfSBmcm9tICdwbHVtcCc7XG5cbmZ1bmN0aW9uIHNhbmVOdW1iZXIoaSkge1xuICByZXR1cm4gKCh0eXBlb2YgaSA9PT0gJ251bWJlcicpICYmICghaXNOYU4oaSkpICYmIChpICE9PSBJbmZpbml0eSkgJiYgKGkgIT09IC1JbmZpbml0eSkpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVkaXNTdG9yZSBleHRlbmRzIEtleVZhbHVlU3RvcmUge1xuICBwdWJsaWMgcmVkaXM6IFJlZGlzLlJlZGlzQ2xpZW50O1xuICBjb25zdHJ1Y3RvcihvcHRzOiB7IHJlZGlzQ2xpZW50PzogUmVkaXMuUmVkaXNDbGllbnQsIHRlcm1pbmFsPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBwb3J0OiA2Mzc5LFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgZGI6IDAsXG4gICAgICAgIHJldHJ5X3N0cmF0ZWd5OiAobykgPT4ge1xuICAgICAgICAgIGlmIChvLmVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIG9uIGEgc3BlY2lmaWMgZXJyb3IgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVGhlIHNlcnZlciByZWZ1c2VkIHRoZSBjb25uZWN0aW9uJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvLnRvdGFsX3JldHJ5X3RpbWUgPiAxMDAwICogNjAgKiA2MCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyBhZnRlciBhIHNwZWNpZmljIHRpbWVvdXQgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmV0cnkgdGltZSBleGhhdXN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udGltZXNfY29ubmVjdGVkID4gMTApIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgd2l0aCBidWlsdCBpbiBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVjb25uZWN0IGFmdGVyXG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KG8uYXR0ZW1wdCAqIDEwMCwgMzAwMCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgaWYgKG9wdHMucmVkaXNDbGllbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZWRpcyA9IG9wdHMucmVkaXNDbGllbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXMgPSBSZWRpcy5jcmVhdGVDbGllbnQob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZUNhbGwobWV0aG9kOiBzdHJpbmcsIC4uLmFyZ3MpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBhcmdzV2l0aENCID0gYXJncy5jb25jYXQoKGVyciwgdmFsKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWRpc1ttZXRob2RdLmFwcGx5KHRoaXMucmVkaXMsIGFyZ3NXaXRoQ0IpO1xuICAgIH0pO1xuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ3F1aXQnKTtcbiAgfVxuXG4gIGFkZFNjaGVtYSh0OiB7dHlwZTogc3RyaW5nLCBzY2hlbWE6IE1vZGVsU2NoZW1hfSkge1xuICAgIHJldHVybiBzdXBlci5hZGRTY2hlbWEodClcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fa2V5cyh0LnR5cGUpXG4gICAgICAudGhlbigoa2V5QXJyYXk6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgIGlmIChrZXlBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ga2V5QXJyYXkubWFwKChrKSA9PiBrLnNwbGl0KCc6JylbMV0pXG4gICAgICAgICAgLm1hcCgoaykgPT4gcGFyc2VJbnQoaywgMTApKVxuICAgICAgICAgIC5maWx0ZXIoKGkpID0+IHNhbmVOdW1iZXIoaSkpXG4gICAgICAgICAgLnJlZHVjZSgobWF4LCBjdXJyZW50KSA9PiAoY3VycmVudCA+IG1heCkgPyBjdXJyZW50IDogbWF4LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSkudGhlbigobjogbnVtYmVyKSA9PiB7XG4gICAgICAgIHRoaXMubWF4S2V5c1t0LnR5cGVdID0gbjtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX2tleXModHlwZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdrZXlzJywgYCR7dHlwZX06KmApO1xuICB9XG5cbiAgX2dldChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YSB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgnZ2V0JywgaykudGhlbigodjogc3RyaW5nKSA9PiBKU09OLnBhcnNlKHYpKTtcbiAgfVxuXG4gIF9zZXQoazogc3RyaW5nLCB2OiBNb2RlbERhdGEpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdzZXQnLCBrLCBKU09OLnN0cmluZ2lmeSh2KSk7XG4gIH1cblxuICBfZGVsKGs6IHN0cmluZyk6IFByb21pc2U8TW9kZWxEYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2RlbCcsIGspO1xuICB9XG59XG4iXX0=
