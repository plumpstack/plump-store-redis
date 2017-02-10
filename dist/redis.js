'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedisStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var Promise = _interopRequireWildcard(_bluebird);

var _redis = require('redis');

var Redis = _interopRequireWildcard(_redis);

var _plump = require('plump');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RedisService = Promise.promisifyAll(Redis);
var $redis = Symbol('$redis');

var RedisStorage = exports.RedisStorage = function (_KeyValueStore) {
  _inherits(RedisStorage, _KeyValueStore);

  function RedisStorage() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RedisStorage);

    var _this = _possibleConstructorReturn(this, (RedisStorage.__proto__ || Object.getPrototypeOf(RedisStorage)).call(this, opts));

    var options = Object.assign({}, {
      port: 6379,
      host: 'localhost',
      db: 0,
      retry_strategy: function retry_strategy(o) {
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
      _this[$redis] = opts.redisClient;
    } else {
      _this[$redis] = RedisService.createClient(options);
    }
    _this.isCache = true;
    return _this;
  }

  _createClass(RedisStorage, [{
    key: 'teardown',
    value: function teardown() {
      return this[$redis].quitAsync();
    }
  }, {
    key: '_keys',
    value: function _keys(typeName) {
      return this[$redis].keysAsync(typeName + ':store:*');
    }
  }, {
    key: '_get',
    value: function _get(k) {
      return this[$redis].getAsync(k);
    }
  }, {
    key: '_set',
    value: function _set(k, v) {
      return this[$redis].setAsync(k, v);
    }
  }, {
    key: '_del',
    value: function _del(k) {
      return this[$redis].delAsync(k);
    }
  }]);

  return RedisStorage;
}(_plump.KeyValueStore);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZGlzLmpzIl0sIm5hbWVzIjpbIlByb21pc2UiLCJSZWRpcyIsIlJlZGlzU2VydmljZSIsInByb21pc2lmeUFsbCIsIiRyZWRpcyIsIlN5bWJvbCIsIlJlZGlzU3RvcmFnZSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwicG9ydCIsImhvc3QiLCJkYiIsInJldHJ5X3N0cmF0ZWd5IiwibyIsImVycm9yIiwiY29kZSIsIkVycm9yIiwidG90YWxfcmV0cnlfdGltZSIsInRpbWVzX2Nvbm5lY3RlZCIsInVuZGVmaW5lZCIsIk1hdGgiLCJtYXgiLCJhdHRlbXB0IiwicmVkaXNDbGllbnQiLCJjcmVhdGVDbGllbnQiLCJpc0NhY2hlIiwicXVpdEFzeW5jIiwidHlwZU5hbWUiLCJrZXlzQXN5bmMiLCJrIiwiZ2V0QXN5bmMiLCJ2Iiwic2V0QXN5bmMiLCJkZWxBc3luYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0lBQVlBLE87O0FBQ1o7O0lBQVlDLEs7O0FBQ1o7Ozs7Ozs7Ozs7QUFHQSxJQUFNQyxlQUFlRixRQUFRRyxZQUFSLENBQXFCRixLQUFyQixDQUFyQjtBQUNBLElBQU1HLFNBQVNDLE9BQU8sUUFBUCxDQUFmOztJQUVhQyxZLFdBQUFBLFk7OztBQUVYLDBCQUF1QjtBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSw0SEFDZkEsSUFEZTs7QUFFckIsUUFBTUMsVUFBVUMsT0FBT0MsTUFBUCxDQUNkLEVBRGMsRUFFZDtBQUNFQyxZQUFNLElBRFI7QUFFRUMsWUFBTSxXQUZSO0FBR0VDLFVBQUksQ0FITjtBQUlFQyxzQkFBZ0Isd0JBQUNDLENBQUQsRUFBTztBQUNyQixZQUFJQSxFQUFFQyxLQUFGLENBQVFDLElBQVIsS0FBaUIsY0FBckIsRUFBcUM7QUFDbkM7QUFDQSxpQkFBTyxJQUFJQyxLQUFKLENBQVUsbUNBQVYsQ0FBUDtBQUNEO0FBQ0QsWUFBSUgsRUFBRUksZ0JBQUYsR0FBcUIsT0FBTyxFQUFQLEdBQVksRUFBckMsRUFBeUM7QUFDdkM7QUFDQSxpQkFBTyxJQUFJRCxLQUFKLENBQVUsc0JBQVYsQ0FBUDtBQUNEO0FBQ0QsWUFBSUgsRUFBRUssZUFBRixHQUFvQixFQUF4QixFQUE0QjtBQUMxQjtBQUNBLGlCQUFPQyxTQUFQO0FBQ0Q7QUFDRDtBQUNBLGVBQU9DLEtBQUtDLEdBQUwsQ0FBU1IsRUFBRVMsT0FBRixHQUFZLEdBQXJCLEVBQTBCLElBQTFCLENBQVA7QUFDRDtBQW5CSCxLQUZjLEVBdUJkakIsSUF2QmMsQ0FBaEI7QUF5QkEsUUFBSUEsS0FBS2tCLFdBQUwsS0FBcUJKLFNBQXpCLEVBQW9DO0FBQ2xDLFlBQUtqQixNQUFMLElBQWVHLEtBQUtrQixXQUFwQjtBQUNELEtBRkQsTUFFTztBQUNMLFlBQUtyQixNQUFMLElBQWVGLGFBQWF3QixZQUFiLENBQTBCbEIsT0FBMUIsQ0FBZjtBQUNEO0FBQ0QsVUFBS21CLE9BQUwsR0FBZSxJQUFmO0FBaENxQjtBQWlDdEI7Ozs7K0JBRVU7QUFDVCxhQUFPLEtBQUt2QixNQUFMLEVBQWF3QixTQUFiLEVBQVA7QUFDRDs7OzBCQUVLQyxRLEVBQVU7QUFDZCxhQUFPLEtBQUt6QixNQUFMLEVBQWEwQixTQUFiLENBQTBCRCxRQUExQixjQUFQO0FBQ0Q7Ozt5QkFFSUUsQyxFQUFHO0FBQ04sYUFBTyxLQUFLM0IsTUFBTCxFQUFhNEIsUUFBYixDQUFzQkQsQ0FBdEIsQ0FBUDtBQUNEOzs7eUJBRUlBLEMsRUFBR0UsQyxFQUFHO0FBQ1QsYUFBTyxLQUFLN0IsTUFBTCxFQUFhOEIsUUFBYixDQUFzQkgsQ0FBdEIsRUFBeUJFLENBQXpCLENBQVA7QUFDRDs7O3lCQUVJRixDLEVBQUc7QUFDTixhQUFPLEtBQUszQixNQUFMLEVBQWErQixRQUFiLENBQXNCSixDQUF0QixDQUFQO0FBQ0QiLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCAqIGFzIFJlZGlzIGZyb20gJ3JlZGlzJztcbmltcG9ydCB7IEtleVZhbHVlU3RvcmUgfSBmcm9tICdwbHVtcCc7XG5cblxuY29uc3QgUmVkaXNTZXJ2aWNlID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoUmVkaXMpO1xuY29uc3QgJHJlZGlzID0gU3ltYm9sKCckcmVkaXMnKTtcblxuZXhwb3J0IGNsYXNzIFJlZGlzU3RvcmFnZSBleHRlbmRzIEtleVZhbHVlU3RvcmUge1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIHBvcnQ6IDYzNzksXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBkYjogMCxcbiAgICAgICAgcmV0cnlfc3RyYXRlZ3k6IChvKSA9PiB7XG4gICAgICAgICAgaWYgKG8uZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgb24gYSBzcGVjaWZpYyBlcnJvciBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdUaGUgc2VydmVyIHJlZnVzZWQgdGhlIGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udG90YWxfcmV0cnlfdGltZSA+IDEwMDAgKiA2MCAqIDYwKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIGFmdGVyIGEgc3BlY2lmaWMgdGltZW91dCBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXRyeSB0aW1lIGV4aGF1c3RlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoby50aW1lc19jb25uZWN0ZWQgPiAxMCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyB3aXRoIGJ1aWx0IGluIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZWNvbm5lY3QgYWZ0ZXJcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoby5hdHRlbXB0ICogMTAwLCAzMDAwKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICBpZiAob3B0cy5yZWRpc0NsaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRyZWRpc10gPSBvcHRzLnJlZGlzQ2xpZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyRyZWRpc10gPSBSZWRpc1NlcnZpY2UuY3JlYXRlQ2xpZW50KG9wdGlvbnMpO1xuICAgIH1cbiAgICB0aGlzLmlzQ2FjaGUgPSB0cnVlO1xuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5xdWl0QXN5bmMoKTtcbiAgfVxuXG4gIF9rZXlzKHR5cGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5rZXlzQXN5bmMoYCR7dHlwZU5hbWV9OnN0b3JlOipgKTtcbiAgfVxuXG4gIF9nZXQoaykge1xuICAgIHJldHVybiB0aGlzWyRyZWRpc10uZ2V0QXN5bmMoayk7XG4gIH1cblxuICBfc2V0KGssIHYpIHtcbiAgICByZXR1cm4gdGhpc1skcmVkaXNdLnNldEFzeW5jKGssIHYpO1xuICB9XG5cbiAgX2RlbChrKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5kZWxBc3luYyhrKTtcbiAgfVxufVxuIl19
