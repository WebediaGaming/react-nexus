'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Nexus = require('../');

var _Nexus2 = _interopRequireWildcard(_Nexus);

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _Nested = require('./Nested');

var _Nested2 = _interopRequireWildcard(_Nested);

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
exports['default'] = _React2['default'].createClass({
  displayName: 'App',
  mixins: [_Nexus2['default'].Mixin],

  getNexusBindings: function getNexusBindings() {
    return {
      route: [this.getNexus().local, '/route'],
      notFound: [this.getNexus().local, '/notFound'] };
  },

  getInitialState: function getInitialState() {
    return {
      foo: '/bar',
      clicks: 0 };
  },

  click: function click() {
    this.setState({ clicks: this.state.clicks + 1 });
  },

  render: function render() {
    var _state = this.state;
    var route = _state.route;
    var foo = _state.foo;
    var clicks = _state.clicks;

    return _React2['default'].createElement(
      'div',
      { className: 'App' },
      _React2['default'].createElement(
        'p',
        null,
        'My route is ',
        route ? route.get('path') : null,
        ' and foo is ',
        _React2['default'].createElement(_Nested2['default'], { foo: foo }),
        '.'
      ),
      _React2['default'].createElement(
        'p',
        null,
        'The clicks counter is ',
        clicks,
        '. ',
        _React2['default'].createElement(
          'button',
          { onClick: this.click },
          'increase counter'
        )
      )
    );
  } });
module.exports = exports['default'];