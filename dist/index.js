'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _createNexus = require('./createNexus');

var _createNexus2 = _interopRequireDefault(_createNexus);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var Nexus = _createNexus2['default'](_react2['default']);
exports['default'] = Nexus;
module.exports = exports['default'];