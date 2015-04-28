'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React = require('react');

var _React2 = _interopRequireDefault(_React);

var _Nexus = require('../');

var _Nexus2 = _interopRequireDefault(_Nexus);

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
  displayName: 'Nested',

  mixins: [_Nexus2['default'].Mixin],

  getNexusBindings: function getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo] };
  },

  render: function render() {
    var bar = this.state.bar;

    return _React2['default'].createElement(
      'span',
      null,
      bar ? bar.get('mood') : null
    );
  } });
module.exports = exports['default'];