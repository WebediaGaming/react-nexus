'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fixturesApp = require('./fixtures/app');

var _fixturesApp2 = _interopRequireDefault(_fixturesApp);

var _fixturesComponentsUser = require('./fixtures/components/User');

var _fixturesComponentsUser2 = _interopRequireDefault(_fixturesComponentsUser);

var _ = require('../');

var _2 = _interopRequireDefault(_);

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
    _2['default'].prepare(_react2['default'].createElement(
      _2['default'].Context,
      context,
      _react2['default'].createElement(_fixturesComponentsUser2['default'], { userId: 'CategoricalDude' })
    )).then(function (res) {
      console.warn(JSON.stringify(context.http.serialize(), null, 2));
      done(null, res);
    })['catch'](function (err) {
      return done(err);
    });
  });
  after(function () {
    return server.close();
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9pbmRleC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBa0IsT0FBTzs7OzsyQkFHVCxnQkFBZ0I7Ozs7c0NBQ2YsNEJBQTRCOzs7O2dCQUMzQixLQUFLOzs7O3NDQUNGLDRCQUE0Qjs7OztJQUx6QyxNQUFNLEdBQTBCLE1BQU0sQ0FBdEMsTUFBTTtJQUFFLEtBQUssR0FBbUIsTUFBTSxDQUE5QixLQUFLO0lBQUUsUUFBUSxHQUFTLE1BQU0sQ0FBdkIsUUFBUTtJQUFFLEVBQUUsR0FBSyxNQUFNLENBQWIsRUFBRTs7QUFPbkMsUUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUksTUFBTSxZQUFBLENBQUM7QUFDWCxRQUFNLENBQUM7V0FBTSxNQUFNLEdBQUcseUJBQUksTUFBTSxDQUFDLElBQUksQ0FBQztHQUFBLENBQUMsQ0FBQztBQUN4QyxJQUFFLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3ZCLFFBQU0sT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLHdDQUFhLHVCQUF1QixDQUFDLEVBQUUsQ0FBQztBQUNoRSxrQkFBTSxPQUFPLENBQUM7QUFBQyxvQkFBTSxPQUFPO01BQUssT0FBTztNQUN0Qyx3RUFBTSxNQUFNLEVBQUMsaUJBQWlCLEdBQUc7S0FDbkIsQ0FBQyxDQUNoQixJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDYixhQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRSxVQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2pCLENBQUMsU0FDSSxDQUFDLFVBQUMsR0FBRzthQUFLLElBQUksQ0FBQyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDNUIsQ0FBQyxDQUFDO0FBQ0gsT0FBSyxDQUFDO1dBQU0sTUFBTSxDQUFDLEtBQUssRUFBRTtHQUFBLENBQUMsQ0FBQztDQUM3QixDQUFDLENBQUMiLCJmaWxlIjoiX190ZXN0c19fL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuY29uc3QgeyBiZWZvcmUsIGFmdGVyLCBkZXNjcmliZSwgaXQgfSA9IGdsb2JhbDtcclxuXHJcbmltcG9ydCBhcHAgZnJvbSAnLi9maXh0dXJlcy9hcHAnO1xyXG5pbXBvcnQgVXNlciBmcm9tICcuL2ZpeHR1cmVzL2NvbXBvbmVudHMvVXNlcic7XHJcbmltcG9ydCBOZXh1cyBmcm9tICcuLi8nO1xyXG5pbXBvcnQgSFRUUEZsdXggZnJvbSAnLi9maXh0dXJlcy9mbHV4ZXMvSFRUUEZsdXgnO1xyXG5cclxuZGVzY3JpYmUoJ05leHVzJywgKCkgPT4ge1xyXG4gIGxldCBzZXJ2ZXI7XHJcbiAgYmVmb3JlKCgpID0+IHNlcnZlciA9IGFwcC5saXN0ZW4oODg4OCkpO1xyXG4gIGl0KCcucHJlcGFyZScsIChkb25lKSA9PiB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0geyBodHRwOiBuZXcgSFRUUEZsdXgoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OCcpIH07XHJcbiAgICBOZXh1cy5wcmVwYXJlKDxOZXh1cy5Db250ZXh0IHsuLi5jb250ZXh0fT5cclxuICAgICAgPFVzZXIgdXNlcklkPSdDYXRlZ29yaWNhbER1ZGUnIC8+XHJcbiAgICA8L05leHVzLkNvbnRleHQ+KVxyXG4gICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICBjb25zb2xlLndhcm4oSlNPTi5zdHJpbmdpZnkoY29udGV4dC5odHRwLnNlcmlhbGl6ZSgpLCBudWxsLCAyKSk7XHJcbiAgICAgIGRvbmUobnVsbCwgcmVzKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goKGVycikgPT4gZG9uZShlcnIpKTtcclxuICB9KTtcclxuICBhZnRlcigoKSA9PiBzZXJ2ZXIuY2xvc2UoKSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
