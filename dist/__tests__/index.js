'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

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
    var tree = _react2['default'].createElement(
      _3['default'].Context,
      context,
      _react2['default'].createElement(_fixturesComponentsUser2['default'], { userId: 'CategoricalDude' })
    );
    _3['default'].prepare(tree).then(function () {
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
      var html = _reactDomServer.renderToStaticMarkup(tree);
      _shouldAsFunction2['default'](html).be.a.String();
      done(null);
    })['catch'](function (err) {
      return done(err);
    });
  });
  after(function () {
    return server.close();
  });
});
//# sourceMappingURL=data:application/json;base64,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QUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMvQixzQ0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLG9CQUFFLElBQUkscUJBQVEsVUFBQyxLQUFZO2NBQVYsUUFBUSxHQUFWLEtBQVksQ0FBVixRQUFRO2lCQUFPLFFBQVEsS0FBSyxvQkFBb0I7U0FBQSxDQUFDLENBQUMsQ0FBQztPQUN4RixDQUFDLENBQUM7QUFDSCxrQkFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFLO0FBQ3ZDLHNDQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xELHNDQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUNoQyxDQUFDLENBQUM7QUFDSCxVQUFNLElBQUksR0FBRyxxQ0FBcUIsSUFBSSxDQUFDLENBQUM7QUFDeEMsb0NBQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDWixDQUFDLFNBQ0ksQ0FBQyxVQUFDLEdBQUc7YUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0dBQzVCLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQztXQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUU7R0FBQSxDQUFDLENBQUM7Q0FDN0IsQ0FBQyxDQUFDIiwiZmlsZSI6Il9fdGVzdHNfXy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlclRvU3RhdGljTWFya3VwIH0gZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XHJcbmNvbnN0IHsgYmVmb3JlLCBhZnRlciwgZGVzY3JpYmUsIGl0IH0gPSBnbG9iYWw7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmltcG9ydCBhcHAsIHsgdXNlcnMsIGF1dGhUb2tlbnMgfSBmcm9tICcuL2ZpeHR1cmVzL2FwcCc7XHJcbmltcG9ydCBVc2VyIGZyb20gJy4vZml4dHVyZXMvY29tcG9uZW50cy9Vc2VyJztcclxuaW1wb3J0IE5leHVzIGZyb20gJy4uLyc7XHJcbmltcG9ydCBIVFRQRmx1eCBmcm9tICcuL2ZpeHR1cmVzL2ZsdXhlcy9IVFRQRmx1eCc7XHJcblxyXG5kZXNjcmliZSgnTmV4dXMnLCAoKSA9PiB7XHJcbiAgbGV0IHNlcnZlcjtcclxuICBiZWZvcmUoKCkgPT4gc2VydmVyID0gYXBwLmxpc3Rlbig4ODg4KSk7XHJcbiAgaXQoJy5wcmVwYXJlJywgKGRvbmUpID0+IHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSB7IGh0dHA6IG5ldyBIVFRQRmx1eCgnaHR0cDovL2xvY2FsaG9zdDo4ODg4JykgfTtcclxuICAgIGNvbnN0IHRyZWUgPSA8TmV4dXMuQ29udGV4dCB7Li4uY29udGV4dH0+XHJcbiAgICAgIDxVc2VyIHVzZXJJZD0nQ2F0ZWdvcmljYWxEdWRlJyAvPlxyXG4gICAgPC9OZXh1cy5Db250ZXh0PjtcclxuICAgIE5leHVzLnByZXBhcmUodHJlZSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgZnVuY3Rpb24gZmV0Y2hlZChwYXRoLCBwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gY29udGV4dC5odHRwLnZhbHVlcyhjb250ZXh0Lmh0dHAuZ2V0KHBhdGgsIHBhcmFtcykucGFyYW1zKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBjaGVja0ZldGNoZWQocGF0aCwgcGFyYW1zLCBmbikge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGZldGNoZWQocGF0aCwgcGFyYW1zKTtcclxuICAgICAgICBzaG91bGQodmFsdWVzKS5iZS5hbi5BcnJheSgpLndoaWNoLmhhcy5sZW5ndGgoMSk7XHJcbiAgICAgICAgY29uc3QgW1tlcnIsIHJlcywgZGF0ZV1dID0gdmFsdWVzO1xyXG4gICAgICAgIHNob3VsZChkYXRlKS5iZS5hbi5pbnN0YW5jZU9mKERhdGUpO1xyXG4gICAgICAgIHJldHVybiBmbihlcnIsIHJlcywgZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgICAgY2hlY2tGZXRjaGVkKCcvdXNlcnMnLCB7IHJlZnJlc2hFdmVyeTogNTAwMCB9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBzaG91bGQoZXJyKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgICAgc2hvdWxkKHJlcykuYmUuZXFsKHVzZXJzKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNoZWNrRmV0Y2hlZCgnL21lJywgeyBxdWVyeToge1xyXG4gICAgICAgIGF1dGhUb2tlbjogXy5maW5kKGF1dGhUb2tlbnMsICh7IHVzZXJJZCB9KSA9PlxyXG4gICAgICAgICAgdXNlcklkID09PSBfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykudXNlcklkKS5hdXRoVG9rZW4sXHJcbiAgICAgIH0gfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuZXhhY3RseSh2b2lkIDApO1xyXG4gICAgICAgIHNob3VsZChyZXMpLmJlLmVxbChfLmZpbmQodXNlcnMsICh7IHVzZXJOYW1lIH0pID0+IHVzZXJOYW1lID09PSAnRnJpZXJpY2ggTmlldHpzY2hlJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgY2hlY2tGZXRjaGVkKCcvZXJyb3InLCB7fSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgc2hvdWxkKGVycikuYmUuYS5TdHJpbmcoKS5jb250YWluRXFsKCdOb3QgRm91bmQnKTtcclxuICAgICAgICBzaG91bGQocmVzKS5iZS5leGFjdGx5KHZvaWQgMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCBodG1sID0gcmVuZGVyVG9TdGF0aWNNYXJrdXAodHJlZSk7XHJcbiAgICAgIHNob3VsZChodG1sKS5iZS5hLlN0cmluZygpO1xyXG4gICAgICBkb25lKG51bGwpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBkb25lKGVycikpO1xyXG4gIH0pO1xyXG4gIGFmdGVyKCgpID0+IHNlcnZlci5jbG9zZSgpKTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
