'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _nexusFluxAdaptersLocal = require('nexus-flux/adapters/Local');

var _nexusFluxAdaptersLocal2 = _interopRequireDefault(_nexusFluxAdaptersLocal);

var _nexusFlux = require('nexus-flux');

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _testApp = require('./test/App');

var _testApp2 = _interopRequireDefault(_testApp);

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
  '/etc': new _nexusFlux.Remutable({
    foo: 'bar' }),
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
  html.should.be.exactly('<div class="App">' + '<p>My route is /home and foo is <span class="NestedBind">happy</span>.</p>' + '<p>My route is /home and foo is <span class="NestedInject">happy</span>.</p>' + '<p>The clicks counter is 0. <button>increase counter</button></p>' + '<div class="NestedInjector">etc = foo: bar</div>' + '</div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': { path: '/home' },
      '/bar': { mood: 'happy' },
      '/etc': { foo: 'bar' },
      '/notFound': void 0 } }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
})['catch'](function (err) {
  throw err;
});