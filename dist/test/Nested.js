'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
exports['default'] = _3['default'].Enhance((function (_React$Component) {
  var _class = function () {
    _classCallCheck(this, _class);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  };

  _inherits(_class, _React$Component);

  _createClass(_class, [{
    key: 'getNexusBindings',
    value: function getNexusBindings(_ref) {
      var foo = _ref.foo;

      return {
        bar: ['local', foo] };
    }
  }, {
    key: 'render',
    value: function render() {
      var bar = this.props.bar;

      return _react2['default'].createElement(
        'span',
        null,
        bar ? bar.get('mood') : null
      );
    }
  }], [{
    key: 'displayName',
    value: 'Nested',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      bar: _react2['default'].PropTypes.any },
    enumerable: true
  }]);

  return _class;
})(_react2['default'].Component));
module.exports = exports['default'];