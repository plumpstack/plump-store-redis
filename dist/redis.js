'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedisStore = undefined;

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

var RedisStore = exports.RedisStore = function (_KeyValueStore) {
  _inherits(RedisStore, _KeyValueStore);

  function RedisStore() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RedisStore);

    var _this = _possibleConstructorReturn(this, (RedisStore.__proto__ || Object.getPrototypeOf(RedisStore)).call(this, opts));

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

  _createClass(RedisStore, [{
    key: 'teardown',
    value: function teardown() {
      return this[$redis].quitAsync();
    }
  }, {
    key: '_keys',
    value: function _keys(typeName) {
      return this[$redis].keysAsync(typeName + ':attributes:*');
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

  return RedisStore;
}(_plump.KeyValueStore);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZGlzLmpzIl0sIm5hbWVzIjpbIlByb21pc2UiLCJSZWRpcyIsIlJlZGlzU2VydmljZSIsInByb21pc2lmeUFsbCIsIiRyZWRpcyIsIlN5bWJvbCIsIlJlZGlzU3RvcmUiLCJvcHRzIiwib3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsInBvcnQiLCJob3N0IiwiZGIiLCJyZXRyeV9zdHJhdGVneSIsIm8iLCJlcnJvciIsImNvZGUiLCJFcnJvciIsInRvdGFsX3JldHJ5X3RpbWUiLCJ0aW1lc19jb25uZWN0ZWQiLCJ1bmRlZmluZWQiLCJNYXRoIiwibWF4IiwiYXR0ZW1wdCIsInJlZGlzQ2xpZW50IiwiY3JlYXRlQ2xpZW50IiwiaXNDYWNoZSIsInF1aXRBc3luYyIsInR5cGVOYW1lIiwia2V5c0FzeW5jIiwiayIsImdldEFzeW5jIiwidiIsInNldEFzeW5jIiwiZGVsQXN5bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztJQUFZQSxPOztBQUNaOztJQUFZQyxLOztBQUNaOzs7Ozs7Ozs7O0FBR0EsSUFBTUMsZUFBZUYsUUFBUUcsWUFBUixDQUFxQkYsS0FBckIsQ0FBckI7QUFDQSxJQUFNRyxTQUFTQyxPQUFPLFFBQVAsQ0FBZjs7SUFFYUMsVSxXQUFBQSxVOzs7QUFFWCx3QkFBdUI7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsd0hBQ2ZBLElBRGU7O0FBRXJCLFFBQU1DLFVBQVVDLE9BQU9DLE1BQVAsQ0FDZCxFQURjLEVBRWQ7QUFDRUMsWUFBTSxJQURSO0FBRUVDLFlBQU0sV0FGUjtBQUdFQyxVQUFJLENBSE47QUFJRUMsc0JBQWdCLHdCQUFDQyxDQUFELEVBQU87QUFDckIsWUFBSUEsRUFBRUMsS0FBRixDQUFRQyxJQUFSLEtBQWlCLGNBQXJCLEVBQXFDO0FBQ25DO0FBQ0EsaUJBQU8sSUFBSUMsS0FBSixDQUFVLG1DQUFWLENBQVA7QUFDRDtBQUNELFlBQUlILEVBQUVJLGdCQUFGLEdBQXFCLE9BQU8sRUFBUCxHQUFZLEVBQXJDLEVBQXlDO0FBQ3ZDO0FBQ0EsaUJBQU8sSUFBSUQsS0FBSixDQUFVLHNCQUFWLENBQVA7QUFDRDtBQUNELFlBQUlILEVBQUVLLGVBQUYsR0FBb0IsRUFBeEIsRUFBNEI7QUFDMUI7QUFDQSxpQkFBT0MsU0FBUDtBQUNEO0FBQ0Q7QUFDQSxlQUFPQyxLQUFLQyxHQUFMLENBQVNSLEVBQUVTLE9BQUYsR0FBWSxHQUFyQixFQUEwQixJQUExQixDQUFQO0FBQ0Q7QUFuQkgsS0FGYyxFQXVCZGpCLElBdkJjLENBQWhCO0FBeUJBLFFBQUlBLEtBQUtrQixXQUFMLEtBQXFCSixTQUF6QixFQUFvQztBQUNsQyxZQUFLakIsTUFBTCxJQUFlRyxLQUFLa0IsV0FBcEI7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFLckIsTUFBTCxJQUFlRixhQUFhd0IsWUFBYixDQUEwQmxCLE9BQTFCLENBQWY7QUFDRDtBQUNELFVBQUttQixPQUFMLEdBQWUsSUFBZjtBQWhDcUI7QUFpQ3RCOzs7OytCQUVVO0FBQ1QsYUFBTyxLQUFLdkIsTUFBTCxFQUFhd0IsU0FBYixFQUFQO0FBQ0Q7OzswQkFFS0MsUSxFQUFVO0FBQ2QsYUFBTyxLQUFLekIsTUFBTCxFQUFhMEIsU0FBYixDQUEwQkQsUUFBMUIsbUJBQVA7QUFDRDs7O3lCQUVJRSxDLEVBQUc7QUFDTixhQUFPLEtBQUszQixNQUFMLEVBQWE0QixRQUFiLENBQXNCRCxDQUF0QixDQUFQO0FBQ0Q7Ozt5QkFFSUEsQyxFQUFHRSxDLEVBQUc7QUFDVCxhQUFPLEtBQUs3QixNQUFMLEVBQWE4QixRQUFiLENBQXNCSCxDQUF0QixFQUF5QkUsQ0FBekIsQ0FBUDtBQUNEOzs7eUJBRUlGLEMsRUFBRztBQUNOLGFBQU8sS0FBSzNCLE1BQUwsRUFBYStCLFFBQWIsQ0FBc0JKLENBQXRCLENBQVA7QUFDRCIsImZpbGUiOiJyZWRpcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0ICogYXMgUmVkaXMgZnJvbSAncmVkaXMnO1xuaW1wb3J0IHsgS2V5VmFsdWVTdG9yZSB9IGZyb20gJ3BsdW1wJztcblxuXG5jb25zdCBSZWRpc1NlcnZpY2UgPSBQcm9taXNlLnByb21pc2lmeUFsbChSZWRpcyk7XG5jb25zdCAkcmVkaXMgPSBTeW1ib2woJyRyZWRpcycpO1xuXG5leHBvcnQgY2xhc3MgUmVkaXNTdG9yZSBleHRlbmRzIEtleVZhbHVlU3RvcmUge1xuXG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIHBvcnQ6IDYzNzksXG4gICAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgICBkYjogMCxcbiAgICAgICAgcmV0cnlfc3RyYXRlZ3k6IChvKSA9PiB7XG4gICAgICAgICAgaWYgKG8uZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcbiAgICAgICAgICAgIC8vIEVuZCByZWNvbm5lY3Rpbmcgb24gYSBzcGVjaWZpYyBlcnJvciBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdUaGUgc2VydmVyIHJlZnVzZWQgdGhlIGNvbm5lY3Rpb24nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG8udG90YWxfcmV0cnlfdGltZSA+IDEwMDAgKiA2MCAqIDYwKSB7XG4gICAgICAgICAgICAvLyBFbmQgcmVjb25uZWN0aW5nIGFmdGVyIGEgc3BlY2lmaWMgdGltZW91dCBhbmQgZmx1c2ggYWxsIGNvbW1hbmRzIHdpdGggYSBpbmRpdmlkdWFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdSZXRyeSB0aW1lIGV4aGF1c3RlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoby50aW1lc19jb25uZWN0ZWQgPiAxMCkge1xuICAgICAgICAgICAgLy8gRW5kIHJlY29ubmVjdGluZyB3aXRoIGJ1aWx0IGluIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZWNvbm5lY3QgYWZ0ZXJcbiAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoby5hdHRlbXB0ICogMTAwLCAzMDAwKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICBpZiAob3B0cy5yZWRpc0NsaWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRyZWRpc10gPSBvcHRzLnJlZGlzQ2xpZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzWyRyZWRpc10gPSBSZWRpc1NlcnZpY2UuY3JlYXRlQ2xpZW50KG9wdGlvbnMpO1xuICAgIH1cbiAgICB0aGlzLmlzQ2FjaGUgPSB0cnVlO1xuICB9XG5cbiAgdGVhcmRvd24oKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5xdWl0QXN5bmMoKTtcbiAgfVxuXG4gIF9rZXlzKHR5cGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5rZXlzQXN5bmMoYCR7dHlwZU5hbWV9OmF0dHJpYnV0ZXM6KmApO1xuICB9XG5cbiAgX2dldChrKSB7XG4gICAgcmV0dXJuIHRoaXNbJHJlZGlzXS5nZXRBc3luYyhrKTtcbiAgfVxuXG4gIF9zZXQoaywgdikge1xuICAgIHJldHVybiB0aGlzWyRyZWRpc10uc2V0QXN5bmMoaywgdik7XG4gIH1cblxuICBfZGVsKGspIHtcbiAgICByZXR1cm4gdGhpc1skcmVkaXNdLmRlbEFzeW5jKGspO1xuICB9XG59XG4iXX0=
