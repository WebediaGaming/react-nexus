'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

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

var _default = (function (_React$Component) {
  var _class = function _default() {
    _classCallCheck(this, _class);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  };

  _inherits(_class, _React$Component);

  _createClass(_class, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'NestedInjector' },
        'etc = foo: ',
        this.props.etc.get('foo')
      );
    }
  }], [{
    key: 'displayName',
    value: 'NestedInjector',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      etc: _3['default'].PropTypes.Immutable.Map },
    enumerable: true
  }]);

  return _class;
})(_react2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];