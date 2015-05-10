'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _nexusFluxAdaptersLocal = require('nexus-flux/adapters/Local');

var _nexusFluxAdaptersLocal2 = _interopRequireDefault(_nexusFluxAdaptersLocal);

var _nexusFlux = require('nexus-flux');

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _testApp = require('./test/App');

var _testApp2 = _interopRequireDefault(_testApp);

require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

var stores = {
  '/route': new _nexusFlux.Remutable({
    path: '/home' }),
  '/bar': new _nexusFlux.Remutable({
    mood: 'happy' }),
  '/dev/null': new _nexusFlux.Remutable({
    'void': null }) };

var localFluxServer = new _nexusFluxAdaptersLocal2['default'].Server(stores);
var localFluxClient = new _nexusFluxAdaptersLocal2['default'].Client(localFluxServer);

var nexus = { local: localFluxClient };

_3['default'].prerenderAppToStaticMarkup(_react2['default'].createElement(_testApp2['default'], null), nexus).then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var html = _ref2[0];
  var data = _ref2[1];

  console.log(html, data);
  html.should.be.exactly('<div class="App">' + '<p>My route is /home and foo is <span>happy</span>.</p>' + '<p>The clicks counter is 0. <button>increase counter</button>' + '</p></div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': { path: '/home' },
      '/bar': { mood: 'happy' },
      '/notFound': void 0 } }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
})['catch'](function (err) {
  throw err;
});