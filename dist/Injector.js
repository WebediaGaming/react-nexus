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

var _inject = require('./inject');

var _inject2 = _interopRequireDefault(_inject);

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

var Injector = (function (_React$Component) {
  function Injector() {
    _classCallCheck(this, _Injector);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Injector, _React$Component);

  var _Injector = Injector;

  _createClass(_Injector, [{
    key: 'render',
    value: function render() {
      return this.props.children(_.omit(this.props, 'children'));
    }
  }], [{
    key: 'displayName',
    value: 'Injector',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.func.isRequired },
    enumerable: true
  }]);

  Injector = (0, _inject2['default'])(function (props) {
    return _.omit(props, 'children');
  })(Injector) || Injector;
  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];