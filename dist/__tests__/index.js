'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fixturesApp = require('./fixtures/app');

var _fixturesApp2 = _interopRequireDefault(_fixturesApp);

var _fixturesComponentsUser = require('./fixtures/components/User');

var _fixturesComponentsUser2 = _interopRequireDefault(_fixturesComponentsUser);

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var before = global.before;
var after = global.after;
var describe = global.describe;
var it = global.it;

_bluebird2['default'].promisifyAll(_fs2['default']);

describe('Nexus', function () {
  var server = undefined;
  before(function () {
    return server = _fixturesApp2['default'].listen(8888);
  });
  it('.prepare', function (done) {
    var context = { http: new _3['default'].HTTPFlux('http://localhost:8888') };
    var tree = _react2['default'].createElement(
      _3['default'].Context,
      context,
      _react2['default'].createElement(_fixturesComponentsUser2['default'], { userId: 'CategoricalDude' })
    );
    _3['default'].prepare(tree).then(function () {
      return _fs2['default'].readFileAsync(__dirname + '/fixtures/expected/Users.html');
    }).then(function (rawHtml) {
      return rawHtml.toString('utf-8').trim();
    }).then(function (expectedHtml) {
      function fetched(path, params) {
        return context.http.versions(context.http.get(path, params).params);
      }
      function checkFetched(path, params, fn) {
        var versions = fetched(path, params);
        _shouldAsFunction2['default'](versions).be.an.Array().which.has.length(1);
        var _versions$0 = versions[0];
        var err = _versions$0[0];
        var val = _versions$0[1];
        var date = _versions$0[2];

        _shouldAsFunction2['default'](date).be.an.instanceOf(Date);
        return fn(err, val, date);
      }
      checkFetched('/users', { refreshEvery: 5000 }, function (err, val) {
        _shouldAsFunction2['default'](err).be.exactly(void 0);
        _shouldAsFunction2['default'](val).be.eql(_fixturesApp.users);
      });
      checkFetched('/me', { query: {
          authToken: _lodash2['default'].find(_fixturesApp.authTokens, function (_ref) {
            var userId = _ref.userId;
            return userId === _lodash2['default'].find(_fixturesApp.users, function (_ref2) {
              var userName = _ref2.userName;
              return userName === 'Frierich Nietzsche';
            }).userId;
          }).authToken
        } }, function (err, val) {
        _shouldAsFunction2['default'](err).be.exactly(void 0);
        _shouldAsFunction2['default'](val).be.eql(_lodash2['default'].find(_fixturesApp.users, function (_ref3) {
          var userName = _ref3.userName;
          return userName === 'Frierich Nietzsche';
        }));
      });
      checkFetched('/error', {}, function (err, val) {
        _shouldAsFunction2['default'](err).be.a.String().containEql('Not Found');
        _shouldAsFunction2['default'](val).be.exactly(void 0);
      });
      var html = _reactDomServer.renderToStaticMarkup(tree);
      _shouldAsFunction2['default'](html).be.exactly(expectedHtml);
      done(null);
    })['catch'](function (err) {
      return done(err);
    });
  });
  after(function () {
    return server.close();
  });
});
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxDQUFDO0NBQzdCLENBQUMsQ0FBQyIsImZpbGUiOiJfX3Rlc3RzX18vaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyByZW5kZXJUb1N0YXRpY01hcmt1cCB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xyXG5jb25zdCB7IGJlZm9yZSwgYWZ0ZXIsIGRlc2NyaWJlLCBpdCB9ID0gZ2xvYmFsO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpO1xyXG5cclxuaW1wb3J0IGFwcCwgeyB1c2VycywgYXV0aFRva2VucyB9IGZyb20gJy4vZml4dHVyZXMvYXBwJztcclxuaW1wb3J0IFVzZXIgZnJvbSAnLi9maXh0dXJlcy9jb21wb25lbnRzL1VzZXInO1xyXG5pbXBvcnQgTmV4dXMgZnJvbSAnLi4vJztcclxuXHJcbmRlc2NyaWJlKCdOZXh1cycsICgpID0+IHtcclxuICBsZXQgc2VydmVyO1xyXG4gIGJlZm9yZSgoKSA9PiBzZXJ2ZXIgPSBhcHAubGlzdGVuKDg4ODgpKTtcclxuICBpdCgnLnByZXBhcmUnLCAoZG9uZSkgPT4ge1xyXG4gICAgY29uc3QgY29udGV4dCA9IHsgaHR0cDogbmV3IE5leHVzLkhUVFBGbHV4KCdodHRwOi8vbG9jYWxob3N0Ojg4ODgnKSB9O1xyXG4gICAgY29uc3QgdHJlZSA9IDxOZXh1cy5Db250ZXh0IHsuLi5jb250ZXh0fT5cclxuICAgICAgPFVzZXIgdXNlcklkPSdDYXRlZ29yaWNhbER1ZGUnIC8+XHJcbiAgICA8L05leHVzLkNvbnRleHQ+O1xyXG4gICAgTmV4dXMucHJlcGFyZSh0cmVlKVxyXG4gICAgLnRoZW4oKCkgPT4gZnMucmVhZEZpbGVBc3luYyhgJHtfX2Rpcm5hbWV9L2ZpeHR1cmVzL2V4cGVjdGVkL1VzZXJzLmh0bWxgKSlcclxuICAgIC50aGVuKChyYXdIdG1sKSA9PiByYXdIdG1sLnRvU3RyaW5nKCd1dGYtOCcpLnRyaW0oKSlcclxuICAgIC50aGVuKChleHBlY3RlZEh0bWwpID0+IHtcclxuICAgICAgZnVuY3Rpb24gZmV0Y2hlZChwYXRoLCBwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gY29udGV4dC5odHRwLnZlcnNpb25zKGNvbnRleHQuaHR0cC5nZXQocGF0aCwgcGFyYW1zKS5wYXJhbXMpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrRmV0Y2hlZChwYXRoLCBwYXJhbXMsIGZuKSB7XHJcbiAgICAgICAgY29uc3QgdmVyc2lvbnMgPSBmZXRjaGVkKHBhdGgsIHBhcmFtcyk7XHJcbiAgICAgICAgc2hvdWxkKHZlcnNpb25zKS5iZS5hbi5BcnJheSgpLndoaWNoLmhhcy5sZW5ndGgoMSk7XHJcbiAgICAgICAgY29uc3QgW1tlcnIsIHZhbCwgZGF0ZV1dID0gdmVyc2lvbnM7XHJcbiAgICAgICAgc2hvdWxkKGRhdGUpLmJlLmFuLmluc3RhbmNlT2YoRGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGZuKGVyciwgdmFsLCBkYXRlKTtcclxuICAgICAgfVxyXG4gICAgICBjaGVja0ZldGNoZWQoJy91c2VycycsIHsgcmVmcmVzaEV2ZXJ5OiA1MDAwIH0sIChlcnIsIHZhbCkgPT4ge1xyXG4gICAgICAgIHNob3VsZChlcnIpLmJlLmV4YWN0bHkodm9pZCAwKTtcclxuICAgICAgICBzaG91bGQodmFsKS5iZS5lcWwodXNlcnMpO1xyXG4gICAgICB9KTtcclxuICAgICAgY2hlY2tGZXRjaGVkKCcvbWUnLCB7IHF1ZXJ5OiB7XHJcbiAgICAgICAgYXV0aFRva2VuOiBfLmZpbmQoYXV0aFRva2VucywgKHsgdXNlcklkIH0pID0+XHJcbiAgICAgICAgICB1c2VySWQgPT09IF8uZmluZCh1c2VycywgKHsgdXNlck5hbWUgfSkgPT4gdXNlck5hbWUgPT09ICdGcmllcmljaCBOaWV0enNjaGUnKS51c2VySWQpLmF1dGhUb2tlbixcclxuICAgICAgfSB9LCAoZXJyLCB2YWwpID0+IHtcclxuICAgICAgICBzaG91bGQoZXJyKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgICAgc2hvdWxkKHZhbCkuYmUuZXFsKF8uZmluZCh1c2VycywgKHsgdXNlck5hbWUgfSkgPT4gdXNlck5hbWUgPT09ICdGcmllcmljaCBOaWV0enNjaGUnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjaGVja0ZldGNoZWQoJy9lcnJvcicsIHt9LCAoZXJyLCB2YWwpID0+IHtcclxuICAgICAgICBzaG91bGQoZXJyKS5iZS5hLlN0cmluZygpLmNvbnRhaW5FcWwoJ05vdCBGb3VuZCcpO1xyXG4gICAgICAgIHNob3VsZCh2YWwpLmJlLmV4YWN0bHkodm9pZCAwKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IGh0bWwgPSByZW5kZXJUb1N0YXRpY01hcmt1cCh0cmVlKTtcclxuICAgICAgc2hvdWxkKGh0bWwpLmJlLmV4YWN0bHkoZXhwZWN0ZWRIdG1sKTtcclxuICAgICAgZG9uZShudWxsKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goKGVycikgPT4gZG9uZShlcnIpKTtcclxuICB9KTtcclxuICBhZnRlcigoKSA9PiBzZXJ2ZXIuY2xvc2UoKSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
