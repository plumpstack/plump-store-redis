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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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TSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFLLElBQUksT0FBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQVMsSUFBSyxPQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTLEVBQUUsQ0FBWTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQseUJBQUksR0FBSixVQUFLLENBQVM7UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0F2RkEsQUF1RkMsQ0F2RitCLHFCQUFhLEdBdUY1QztBQXZGWSxnQ0FBVSIsImZpbGUiOiJyZWRpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlZGlzIGZyb20gJ3JlZGlzJztcbmltcG9ydCB7IEtleVZhbHVlU3RvcmUsIE1vZGVsRGF0YSwgTW9kZWxTY2hlbWEgfSBmcm9tICdwbHVtcCc7XG5cbmZ1bmN0aW9uIHNhbmVOdW1iZXIoaSkge1xuICByZXR1cm4gKCh0eXBlb2YgaSA9PT0gJ251bWJlcicpICYmICghaXNOYU4oaSkpICYmIChpICE9PSBJbmZpbml0eSkgJiYgKGkgIT09IC1JbmZpbml0eSkpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVkaXNTdG9yZSBleHRlbmRzIEtleVZhbHVlU3RvcmUge1xuICBwcml2YXRlIHJlZGlzOiBhbnk7XG4gIGNvbnN0cnVjdG9yKG9wdHM6IHsgcmVkaXNDbGllbnQ/OiBhbnksIHRlcm1pbmFsPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBwb3J0OiA2Mzc5LFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgZGI6IDAsXG4gICAgICAgIHJldHJ5X3N0cmF0ZWd5OiAobykgPT4ge1xuICAgICAgICAgIGlmIChvLmVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIG9uIGEgc3BlY2lmaWMgZXJyb3IgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVGhlIHNlcnZlciByZWZ1c2VkIHRoZSBjb25uZWN0aW9uJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvLnRvdGFsX3JldHJ5X3RpbWUgPiAxMDAwICogNjAgKiA2MCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyBhZnRlciBhIHNwZWNpZmljIHRpbWVvdXQgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmV0cnkgdGltZSBleGhhdXN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udGltZXNfY29ubmVjdGVkID4gMTApIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgd2l0aCBidWlsdCBpbiBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVjb25uZWN0IGFmdGVyXG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KG8uYXR0ZW1wdCAqIDEwMCwgMzAwMCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgaWYgKG9wdHMucmVkaXNDbGllbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZWRpcyA9IG9wdHMucmVkaXNDbGllbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXMgPSBSZWRpcy5jcmVhdGVDbGllbnQob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXMucXVpdEFzeW5jKCk7XG4gIH1cblxuICBhZGRTY2hlbWEodDoge3R5cGU6IHN0cmluZywgc2NoZW1hOiBNb2RlbFNjaGVtYX0pIHtcbiAgICByZXR1cm4gc3VwZXIuYWRkU2NoZW1hKHQpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2tleXModC50eXBlKVxuICAgICAgLnRoZW4oKGtleUFycmF5OiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICBpZiAoa2V5QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGtleUFycmF5Lm1hcCgoaykgPT4gay5zcGxpdCgnOicpWzFdKVxuICAgICAgICAgIC5tYXAoKGspID0+IHBhcnNlSW50KGssIDEwKSlcbiAgICAgICAgICAuZmlsdGVyKChpKSA9PiBzYW5lTnVtYmVyKGkpKVxuICAgICAgICAgIC5yZWR1Y2UoKG1heCwgY3VycmVudCkgPT4gKGN1cnJlbnQgPiBtYXgpID8gY3VycmVudCA6IG1heCwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oKG46IG51bWJlcikgPT4ge1xuICAgICAgICB0aGlzLm1heEtleXNbdC50eXBlXSA9IG47XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb21pc2VDYWxsKG1ldGhvZDogc3RyaW5nLCAuLi5hcmdzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYXJnc1dpdGhDQiA9IGFyZ3MuY29uY2F0KChlcnIsIHZhbCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVkaXNbbWV0aG9kXS5hcHBseSh0aGlzLnJlZGlzLCBhcmdzV2l0aENCKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9rZXlzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgna2V5cycsIGAke3R5cGV9OipgKTtcbiAgfVxuXG4gIF9nZXQoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGEgfCBudWxsPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2dldCcsIGspLnRoZW4oKHY6IHN0cmluZykgPT4gSlNPTi5wYXJzZSh2KSk7XG4gIH1cblxuICBfc2V0KGs6IHN0cmluZywgdjogTW9kZWxEYXRhKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgnc2V0JywgaywgSlNPTi5zdHJpbmdpZnkodikpO1xuICB9XG5cbiAgX2RlbChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2VDYWxsKCdkZWwnLCBrKTtcbiAgfVxufVxuIl19
