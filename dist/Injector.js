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

var _bind = require('./bind');

var _bind2 = _interopRequireDefault(_bind);

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
exports['default'] = (0, _bind2['default'])((function (_React$Component) {
  function Injector() {
    _classCallCheck(this, Injector);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Injector, _React$Component);

  _createClass(Injector, [{
    key: 'render',
    value: function render() {
      return this.props.children(_.omit(this.props, 'children'));
    }
  }], [{
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.func.isRequired },
    enumerable: true
  }]);

  return Injector;
})(_react2['default'].Component), function (props) {
  return _.omit(props, 'children');
});
module.exports = exports['default'];