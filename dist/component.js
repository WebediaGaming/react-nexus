'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _bindComponent = require('./bindComponent');

var _bindComponent2 = _interopRequireDefault(_bindComponent);

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

function component(getNexusBindings, displayName) {
  return function (Component) {
    return (0, _bindComponent2['default'])(Component, getNexusBindings, displayName);
  };
}

exports['default'] = component;
module.exports = exports['default'];