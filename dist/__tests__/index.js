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

var _fixturesFluxesCustomHTTPFlux = require('./fixtures/fluxes/CustomHTTPFlux');

var _fixturesFluxesCustomHTTPFlux2 = _interopRequireDefault(_fixturesFluxesCustomHTTPFlux);

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
    var authTokenValue = 'E47Exd7RdDds';
    var http = new _fixturesFluxesCustomHTTPFlux2['default']('http://localhost:8888');
    var local = new _3['default'].LocalFlux();
    local.set('/authToken', authTokenValue);
    local.set('/fontSize', 12);
    var context = { http: http, local: local };
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
        return http.versions(http.get(path, params).params);
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
      _shouldAsFunction2['default'](_3['default'].lastValueOf(local.versions('/authToken'))).be.exactly(authTokenValue);
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
//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkYsVUFBTSxJQUFJLEdBQUcscUNBQXFCLElBQUksQ0FBQyxDQUFDO0FBQ3hDLG9DQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsVUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ1osQ0FBQyxTQUNJLENBQUMsVUFBQyxHQUFHO2FBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUM1QixDQUFDLENBQUM7QUFDSCxPQUFLLENBQUM7V0FBTSxNQUFNLENBQUMsS0FBSyxFQUFFO0dBQUEsQ0FBQyxDQUFDO0NBQzdCLENBQUMsQ0FBQyIsImZpbGUiOiJfX3Rlc3RzX18vaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyByZW5kZXJUb1N0YXRpY01hcmt1cCB9IGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xyXG5jb25zdCB7IGJlZm9yZSwgYWZ0ZXIsIGRlc2NyaWJlLCBpdCB9ID0gZ2xvYmFsO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuUHJvbWlzZS5wcm9taXNpZnlBbGwoZnMpO1xyXG5cclxuaW1wb3J0IGFwcCwgeyB1c2VycywgYXV0aFRva2VucyB9IGZyb20gJy4vZml4dHVyZXMvYXBwJztcclxuaW1wb3J0IFVzZXIgZnJvbSAnLi9maXh0dXJlcy9jb21wb25lbnRzL1VzZXInO1xyXG5pbXBvcnQgQ3VzdG9tSFRUUEZsdXggZnJvbSAnLi9maXh0dXJlcy9mbHV4ZXMvQ3VzdG9tSFRUUEZsdXgnO1xyXG5pbXBvcnQgTmV4dXMgZnJvbSAnLi4vJztcclxuXHJcbmRlc2NyaWJlKCdOZXh1cycsICgpID0+IHtcclxuICBsZXQgc2VydmVyO1xyXG4gIGJlZm9yZSgoKSA9PiBzZXJ2ZXIgPSBhcHAubGlzdGVuKDg4ODgpKTtcclxuICBpdCgnLnByZXBhcmUnLCAoZG9uZSkgPT4ge1xyXG4gICAgY29uc3QgYXV0aFRva2VuVmFsdWUgPSAnRTQ3RXhkN1JkRGRzJztcclxuICAgIGNvbnN0IGh0dHAgPSBuZXcgQ3VzdG9tSFRUUEZsdXgoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OCcpO1xyXG4gICAgY29uc3QgbG9jYWwgPSBuZXcgTmV4dXMuTG9jYWxGbHV4KCk7XHJcbiAgICBsb2NhbC5zZXQoJy9hdXRoVG9rZW4nLCBhdXRoVG9rZW5WYWx1ZSk7XHJcbiAgICBsb2NhbC5zZXQoJy9mb250U2l6ZScsIDEyKTtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB7IGh0dHAsIGxvY2FsIH07XHJcbiAgICBjb25zdCB0cmVlID0gPE5leHVzLkNvbnRleHQgey4uLmNvbnRleHR9PlxyXG4gICAgICA8VXNlciB1c2VySWQ9J0NhdGVnb3JpY2FsRHVkZScgLz5cclxuICAgIDwvTmV4dXMuQ29udGV4dD47XHJcbiAgICBOZXh1cy5wcmVwYXJlKHRyZWUpXHJcbiAgICAudGhlbigoKSA9PiBmcy5yZWFkRmlsZUFzeW5jKGAke19fZGlybmFtZX0vZml4dHVyZXMvZXhwZWN0ZWQvVXNlcnMuaHRtbGApKVxyXG4gICAgLnRoZW4oKHJhd0h0bWwpID0+IHJhd0h0bWwudG9TdHJpbmcoJ3V0Zi04JykudHJpbSgpKVxyXG4gICAgLnRoZW4oKGV4cGVjdGVkSHRtbCkgPT4ge1xyXG4gICAgICBmdW5jdGlvbiBmZXRjaGVkKHBhdGgsIHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiBodHRwLnZlcnNpb25zKGh0dHAuZ2V0KHBhdGgsIHBhcmFtcykucGFyYW1zKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBjaGVja0ZldGNoZWQocGF0aCwgcGFyYW1zLCBmbikge1xyXG4gICAgICAgIGNvbnN0IHZlcnNpb25zID0gZmV0Y2hlZChwYXRoLCBwYXJhbXMpO1xyXG4gICAgICAgIHNob3VsZCh2ZXJzaW9ucykuYmUuYW4uQXJyYXkoKS53aGljaC5oYXMubGVuZ3RoKDEpO1xyXG4gICAgICAgIGNvbnN0IFtbZXJyLCB2YWwsIGRhdGVdXSA9IHZlcnNpb25zO1xyXG4gICAgICAgIHNob3VsZChkYXRlKS5iZS5hbi5pbnN0YW5jZU9mKERhdGUpO1xyXG4gICAgICAgIHJldHVybiBmbihlcnIsIHZhbCwgZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgICAgY2hlY2tGZXRjaGVkKCcvdXNlcnMnLCB7IHJlZnJlc2hFdmVyeTogNTAwMCB9LCAoZXJyLCB2YWwpID0+IHtcclxuICAgICAgICBzaG91bGQoZXJyKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgICAgc2hvdWxkKHZhbCkuYmUuZXFsKHVzZXJzKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNoZWNrRmV0Y2hlZCgnL21lJywgeyBxdWVyeToge1xyXG4gICAgICAgIGF1dGhUb2tlbjogXy5maW5kKGF1dGhUb2tlbnMsICh7IHVzZXJJZCB9KSA9PlxyXG4gICAgICAgICAgdXNlcklkID09PSBfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykudXNlcklkKS5hdXRoVG9rZW4sXHJcbiAgICAgIH0gfSwgKGVyciwgdmFsKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuZXhhY3RseSh2b2lkIDApO1xyXG4gICAgICAgIHNob3VsZCh2YWwpLmJlLmVxbChfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgY2hlY2tGZXRjaGVkKCcvZXJyb3InLCB7fSwgKGVyciwgdmFsKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuYS5TdHJpbmcoKS5jb250YWluRXFsKCdOb3QgRm91bmQnKTtcclxuICAgICAgICBzaG91bGQodmFsKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzaG91bGQoTmV4dXMubGFzdFZhbHVlT2YobG9jYWwudmVyc2lvbnMoJy9hdXRoVG9rZW4nKSkpLmJlLmV4YWN0bHkoYXV0aFRva2VuVmFsdWUpO1xyXG4gICAgICBjb25zdCBodG1sID0gcmVuZGVyVG9TdGF0aWNNYXJrdXAodHJlZSk7XHJcbiAgICAgIHNob3VsZChodG1sKS5iZS5leGFjdGx5KGV4cGVjdGVkSHRtbCk7XHJcbiAgICAgIGRvbmUobnVsbCk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKChlcnIpID0+IGRvbmUoZXJyKSk7XHJcbiAgfSk7XHJcbiAgYWZ0ZXIoKCkgPT4gc2VydmVyLmNsb3NlKCkpO1xyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
