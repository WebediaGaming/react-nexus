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

var User = (function (_React$Component) {
  function User() {
    _classCallCheck(this, _User);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(User, _React$Component);

  var _User = User;

  _createClass(_User, [{
    key: 'render',
    value: function render() {
      var user = this.props.user;

      var firstName = user.get('firstName');
      var lastName = user.get('lastName');
      return _react2['default'].createElement(
        'span',
        null,
        lastName,
        '. ',
        firstName,
        ' ',
        lastName
      );
    }
  }], [{
    key: 'displayName',
    value: 'User',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      user: _3['default'].PropTypes.Immutable.Map },
    enumerable: true
  }]);

  User = _3['default'].component(function (_ref) {
    var userId = _ref.userId;
    return {
      user: ['local://users/' + userId, { firstName: 'John', lastName: 'Doe' }] };
  })(User) || User;
  return User;
})(_react2['default'].Component);

exports['default'] = User;
module.exports = exports['default'];