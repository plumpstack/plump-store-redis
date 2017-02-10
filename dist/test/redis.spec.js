'use strict';

var _redis = require('../redis');

var _plump = require('plump');

var _fakeredis = require('fakeredis');

var Redis = _interopRequireWildcard(_fakeredis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint-env node, mocha*/
/* eslint no-shadow: 0 */

_bluebird2.default.promisifyAll(Redis);

(0, _plump.testSuite)({
  describe: describe, it: it, before: before, after: after
}, {
  ctor: _redis.RedisStorage,
  opts: {
    redisClient: Redis.createClient(),
    terminal: true
  },
  name: 'Plump Redis Store'
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvcmVkaXMuc3BlYy5qcyJdLCJuYW1lcyI6WyJSZWRpcyIsInByb21pc2lmeUFsbCIsImRlc2NyaWJlIiwiaXQiLCJiZWZvcmUiLCJhZnRlciIsImN0b3IiLCJvcHRzIiwicmVkaXNDbGllbnQiLCJjcmVhdGVDbGllbnQiLCJ0ZXJtaW5hbCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7O0FBR0E7O0FBQ0E7O0FBQ0E7O0lBQVlBLEs7O0FBQ1o7Ozs7Ozs7O0FBTkE7QUFDQTs7QUFPQSxtQkFBU0MsWUFBVCxDQUFzQkQsS0FBdEI7O0FBRUEsc0JBQVU7QUFDUkUsb0JBRFEsRUFDRUMsTUFERixFQUNNQyxjQUROLEVBQ2NDO0FBRGQsQ0FBVixFQUVHO0FBQ0RDLDJCQURDO0FBRURDLFFBQU07QUFDSkMsaUJBQWFSLE1BQU1TLFlBQU4sRUFEVDtBQUVKQyxjQUFVO0FBRk4sR0FGTDtBQU1EQyxRQUFNO0FBTkwsQ0FGSCIsImZpbGUiOiJ0ZXN0L3JlZGlzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG5vZGUsIG1vY2hhKi9cbi8qIGVzbGludCBuby1zaGFkb3c6IDAgKi9cblxuaW1wb3J0IHsgUmVkaXNTdG9yYWdlIH0gZnJvbSAnLi4vcmVkaXMnO1xuaW1wb3J0IHsgdGVzdFN1aXRlIH0gZnJvbSAncGx1bXAnO1xuaW1wb3J0ICogYXMgUmVkaXMgZnJvbSAnZmFrZXJlZGlzJztcbmltcG9ydCBCbHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5cbkJsdWViaXJkLnByb21pc2lmeUFsbChSZWRpcyk7XG5cbnRlc3RTdWl0ZSh7XG4gIGRlc2NyaWJlLCBpdCwgYmVmb3JlLCBhZnRlcixcbn0sIHtcbiAgY3RvcjogUmVkaXNTdG9yYWdlLFxuICBvcHRzOiB7XG4gICAgcmVkaXNDbGllbnQ6IFJlZGlzLmNyZWF0ZUNsaWVudCgpLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICB9LFxuICBuYW1lOiAnUGx1bXAgUmVkaXMgU3RvcmUnLFxufSk7XG4iXX0=
