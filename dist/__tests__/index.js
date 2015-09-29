'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _fixturesApp = require('./fixtures/app');

var _fixturesApp2 = _interopRequireDefault(_fixturesApp);

var _fixturesComponentsUser = require('./fixtures/components/User');

var _fixturesComponentsUser2 = _interopRequireDefault(_fixturesComponentsUser);

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _fixturesFluxesHTTPFlux = require('./fixtures/fluxes/HTTPFlux');

var _fixturesFluxesHTTPFlux2 = _interopRequireDefault(_fixturesFluxesHTTPFlux);

var before = global.before;
var after = global.after;
var describe = global.describe;
var it = global.it;

describe('Nexus', function () {
  var server = undefined;
  before(function () {
    return server = _fixturesApp2['default'].listen(8888);
  });
  it('.prepare', function (done) {
    var context = { http: new _fixturesFluxesHTTPFlux2['default']('http://localhost:8888') };
    _3['default'].prepare(_react2['default'].createElement(
      _3['default'].Context,
      context,
      _react2['default'].createElement(_fixturesComponentsUser2['default'], { userId: 'CategoricalDude' })
    )).then(function () {
      function fetched(path, params) {
        return context.http.values(context.http.get(path, params).params);
      }
      function checkFetched(path, params, fn) {
        var values = fetched(path, params);
        _shouldAsFunction2['default'](values).be.an.Array().which.has.length(1);
        var _values$0 = values[0];
        var err = _values$0[0];
        var res = _values$0[1];
        var date = _values$0[2];

        _shouldAsFunction2['default'](date).be.an.instanceOf(Date);
        return fn(err, res, date);
      }
      checkFetched('/users', { refreshEvery: 5000 }, function (err, res) {
        _shouldAsFunction2['default'](err).be.exactly(void 0);
        _shouldAsFunction2['default'](res).be.eql(_fixturesApp.users);
      });
      checkFetched('/me', { query: {
          authToken: _lodash2['default'].find(_fixturesApp.authTokens, function (_ref) {
            var userId = _ref.userId;
            return userId === _lodash2['default'].find(_fixturesApp.users, function (_ref2) {
              var userName = _ref2.userName;
              return userName === 'Frierich Nietzsche';
            }).userId;
          }).authToken
        } }, function (err, res) {
        _shouldAsFunction2['default'](err).be.exactly(void 0);
        _shouldAsFunction2['default'](res).be.eql(_lodash2['default'].find(_fixturesApp.users, function (_ref3) {
          var userName = _ref3.userName;
          return userName === 'Frierich Nietzsche';
        }));
      });
      checkFetched('/error', {}, function (err, res) {
        _shouldAsFunction2['default'](err).be.a.String().containEql('Not Found');
        _shouldAsFunction2['default'](res).be.exactly(void 0);
      });
      done(null);
    })['catch'](function (err) {
      return done(err);
    });
  });
  after(function () {
    return server.close();
  });
});
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsb0JBQUUsSUFBSSxxQkFBUSxVQUFDLEtBQVk7Y0FBVixRQUFRLEdBQVYsS0FBWSxDQUFWLFFBQVE7aUJBQU8sUUFBUSxLQUFLLG9CQUFvQjtTQUFBLENBQUMsQ0FBQyxDQUFDO09BQ3hGLENBQUMsQ0FBQztBQUNILGtCQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDdkMsc0NBQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEQsc0NBQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQ2hDLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNaLENBQUMsU0FDSSxDQUFDLFVBQUMsR0FBRzthQUFLLElBQUksQ0FBQyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDNUIsQ0FBQyxDQUFDO0FBQ0gsT0FBSyxDQUFDO1dBQU0sTUFBTSxDQUFDLEtBQUssRUFBRTtHQUFBLENBQUMsQ0FBQztDQUM3QixDQUFDLENBQUMiLCJmaWxlIjoiX190ZXN0c19fL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuY29uc3QgeyBiZWZvcmUsIGFmdGVyLCBkZXNjcmliZSwgaXQgfSA9IGdsb2JhbDtcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5cclxuaW1wb3J0IGFwcCwgeyB1c2VycywgYXV0aFRva2VucyB9IGZyb20gJy4vZml4dHVyZXMvYXBwJztcclxuaW1wb3J0IFVzZXIgZnJvbSAnLi9maXh0dXJlcy9jb21wb25lbnRzL1VzZXInO1xyXG5pbXBvcnQgTmV4dXMgZnJvbSAnLi4vJztcclxuaW1wb3J0IEhUVFBGbHV4IGZyb20gJy4vZml4dHVyZXMvZmx1eGVzL0hUVFBGbHV4JztcclxuXHJcbmRlc2NyaWJlKCdOZXh1cycsICgpID0+IHtcclxuICBsZXQgc2VydmVyO1xyXG4gIGJlZm9yZSgoKSA9PiBzZXJ2ZXIgPSBhcHAubGlzdGVuKDg4ODgpKTtcclxuICBpdCgnLnByZXBhcmUnLCAoZG9uZSkgPT4ge1xyXG4gICAgY29uc3QgY29udGV4dCA9IHsgaHR0cDogbmV3IEhUVFBGbHV4KCdodHRwOi8vbG9jYWxob3N0Ojg4ODgnKSB9O1xyXG4gICAgTmV4dXMucHJlcGFyZSg8TmV4dXMuQ29udGV4dCB7Li4uY29udGV4dH0+XHJcbiAgICAgIDxVc2VyIHVzZXJJZD0nQ2F0ZWdvcmljYWxEdWRlJyAvPlxyXG4gICAgPC9OZXh1cy5Db250ZXh0PilcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgZnVuY3Rpb24gZmV0Y2hlZChwYXRoLCBwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gY29udGV4dC5odHRwLnZhbHVlcyhjb250ZXh0Lmh0dHAuZ2V0KHBhdGgsIHBhcmFtcykucGFyYW1zKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBjaGVja0ZldGNoZWQocGF0aCwgcGFyYW1zLCBmbikge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGZldGNoZWQocGF0aCwgcGFyYW1zKTtcclxuICAgICAgICBzaG91bGQodmFsdWVzKS5iZS5hbi5BcnJheSgpLndoaWNoLmhhcy5sZW5ndGgoMSk7XHJcbiAgICAgICAgY29uc3QgW1tlcnIsIHJlcywgZGF0ZV1dID0gdmFsdWVzO1xyXG4gICAgICAgIHNob3VsZChkYXRlKS5iZS5hbi5pbnN0YW5jZU9mKERhdGUpO1xyXG4gICAgICAgIHJldHVybiBmbihlcnIsIHJlcywgZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgICAgY2hlY2tGZXRjaGVkKCcvdXNlcnMnLCB7IHJlZnJlc2hFdmVyeTogNTAwMCB9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBzaG91bGQoZXJyKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgICAgc2hvdWxkKHJlcykuYmUuZXFsKHVzZXJzKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNoZWNrRmV0Y2hlZCgnL21lJywgeyBxdWVyeToge1xyXG4gICAgICAgIGF1dGhUb2tlbjogXy5maW5kKGF1dGhUb2tlbnMsICh7IHVzZXJJZCB9KSA9PlxyXG4gICAgICAgICAgdXNlcklkID09PSBfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykudXNlcklkKS5hdXRoVG9rZW4sXHJcbiAgICAgIH0gfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuZXhhY3RseSh2b2lkIDApO1xyXG4gICAgICAgIHNob3VsZChyZXMpLmJlLmVxbChfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgY2hlY2tGZXRjaGVkKCcvZXJyb3InLCB7fSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuYS5TdHJpbmcoKS5jb250YWluRXFsKCdOb3QgRm91bmQnKTtcclxuICAgICAgICBzaG91bGQocmVzKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb25lKG51bGwpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBkb25lKGVycikpO1xyXG4gIH0pO1xyXG4gIGFmdGVyKCgpID0+IHNlcnZlci5jbG9zZSgpKTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
