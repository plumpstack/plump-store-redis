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
import * as Redis from 'redis';
import { KeyValueStore } from 'plump';
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
}(KeyValueStore));
export { RedisStore };

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMEJBQUssR0FBTCxVQUFNLFFBQWdCO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBSyxRQUFRLE9BQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCx5QkFBSSxHQUFKLFVBQUssQ0FBUztRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCx5QkFBSSxHQUFKLFVBQUssQ0FBUyxFQUFFLENBQVk7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFDSCxpQkFBQztBQUFELENBdkZBLEFBdUZDLENBdkYrQixhQUFhLEdBdUY1QyIsImZpbGUiOiJyZWRpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlZGlzIGZyb20gJ3JlZGlzJztcbmltcG9ydCB7IEtleVZhbHVlU3RvcmUsIE1vZGVsRGF0YSwgTW9kZWxTY2hlbWEgfSBmcm9tICdwbHVtcCc7XG5cbmZ1bmN0aW9uIHNhbmVOdW1iZXIoaSkge1xuICByZXR1cm4gKCh0eXBlb2YgaSA9PT0gJ251bWJlcicpICYmICghaXNOYU4oaSkpICYmIChpICE9PSBJbmZpbml0eSkgJiYgKGkgIT09IC1JbmZpbml0eSkpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVkaXNTdG9yZSBleHRlbmRzIEtleVZhbHVlU3RvcmUge1xuICBwcml2YXRlIHJlZGlzOiBhbnk7XG4gIGNvbnN0cnVjdG9yKG9wdHM6IHsgcmVkaXNDbGllbnQ/OiBhbnksIHRlcm1pbmFsPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBwb3J0OiA2Mzc5LFxuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgZGI6IDAsXG4gICAgICAgIHJldHJ5X3N0cmF0ZWd5OiAobykgPT4ge1xuICAgICAgICAgIGlmIChvLmVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIG9uIGEgc3BlY2lmaWMgZXJyb3IgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignVGhlIHNlcnZlciByZWZ1c2VkIHRoZSBjb25uZWN0aW9uJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvLnRvdGFsX3JldHJ5X3RpbWUgPiAxMDAwICogNjAgKiA2MCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyBhZnRlciBhIHNwZWNpZmljIHRpbWVvdXQgYW5kIGZsdXNoIGFsbCBjb21tYW5kcyB3aXRoIGEgaW5kaXZpZHVhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmV0cnkgdGltZSBleGhhdXN0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udGltZXNfY29ubmVjdGVkID4gMTApIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgd2l0aCBidWlsdCBpbiBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gcmVjb25uZWN0IGFmdGVyXG4gICAgICAgICAgcmV0dXJuIE1hdGgubWF4KG8uYXR0ZW1wdCAqIDEwMCwgMzAwMCk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgaWYgKG9wdHMucmVkaXNDbGllbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZWRpcyA9IG9wdHMucmVkaXNDbGllbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXMgPSBSZWRpcy5jcmVhdGVDbGllbnQob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXMucXVpdEFzeW5jKCk7XG4gIH1cblxuICBhZGRTY2hlbWEodDoge3R5cGVOYW1lOiBzdHJpbmcsIHNjaGVtYTogTW9kZWxTY2hlbWF9KSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZFNjaGVtYSh0KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlzKHQudHlwZU5hbWUpXG4gICAgICAudGhlbigoa2V5QXJyYXkpID0+IHtcbiAgICAgICAgaWYgKGtleUFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBrZXlBcnJheS5tYXAoKGspID0+IGsuc3BsaXQoJzonKVsxXSlcbiAgICAgICAgICAubWFwKChrKSA9PiBwYXJzZUludChrLCAxMCkpXG4gICAgICAgICAgLmZpbHRlcigoaSkgPT4gc2FuZU51bWJlcihpKSlcbiAgICAgICAgICAucmVkdWNlKChtYXgsIGN1cnJlbnQpID0+IChjdXJyZW50ID4gbWF4KSA/IGN1cnJlbnQgOiBtYXgsIDApO1xuICAgICAgICB9XG4gICAgICB9KS50aGVuKChuKSA9PiB7XG4gICAgICAgIHRoaXMubWF4S2V5c1t0LnR5cGVOYW1lXSA9IG47XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb21pc2VDYWxsKG1ldGhvZDogc3RyaW5nLCAuLi5hcmdzKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgYXJnc1dpdGhDQiA9IGFyZ3MuY29uY2F0KChlcnIsIHZhbCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVkaXNbbWV0aG9kXS5hcHBseSh0aGlzLnJlZGlzLCBhcmdzV2l0aENCKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9rZXlzKHR5cGVOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ2tleXMnLCBgJHt0eXBlTmFtZX06KmApO1xuICB9XG5cbiAgX2dldChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YSB8IG51bGw+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgnZ2V0JywgaykudGhlbih2ID0+IEpTT04ucGFyc2UodikpO1xuICB9XG5cbiAgX3NldChrOiBzdHJpbmcsIHY6IE1vZGVsRGF0YSk6IFByb21pc2U8TW9kZWxEYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucHJvbWlzZUNhbGwoJ3NldCcsIGssIEpTT04uc3RyaW5naWZ5KHYpKTtcbiAgfVxuXG4gIF9kZWwoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlQ2FsbCgnZGVsJywgayk7XG4gIH1cbn1cbiJdfQ==
