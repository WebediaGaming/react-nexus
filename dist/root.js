'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _bindRoot = require('./bindRoot');

var _bindRoot2 = _interopRequireDefault(_bindRoot);

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

function root(createNexus, defaultRender, displayName) {
  return function (Component) {
    return (0, _bindRoot2['default'])(Component, createNexus, defaultRender, displayName);
  };
}

exports['default'] = root;
module.exports = exports['default'];