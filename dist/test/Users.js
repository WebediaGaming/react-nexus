'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('../');

var _reactTransformProps = require('react-transform-props');

var _reactTransformProps2 = _interopRequireDefault(_reactTransformProps);

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

var Users = (function (_React$Component) {
  function Users() {
    _classCallCheck(this, _Users);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Users, _React$Component);

  var _Users = Users;

  _createClass(_Users, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'ul',
        null,
        _.map(this.props, function (user, key) {
          return _react2['default'].createElement(
            'li',
            { key: key },
            user.get('firstName'),
            ' ',
            user.get('lastName')
          );
        })
      );
    }
  }], [{
    key: 'displayName',
    value: 'Users',
    enumerable: true
  }]);

  Users = (0, _reactTransformProps2['default'])(function (props) {
    return _(props).pairs().filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1);

      var k = _ref2[0];
      return k.substring(0, 'user:'.length) === 'user:';
    }).map(function (_ref3) {
      var _ref32 = _slicedToArray(_ref3, 2);

      var k = _ref32[0];
      var v = _ref32[1];
      return [k.substring('user:'.length), v];
    }).object().value();
  })(Users) || Users;
  Users = (0, _2.component)(function (_ref4) {
    var users = _ref4.users;
    return users.mapEntries(function (_ref5) {
      var _ref52 = _slicedToArray(_ref5, 1);

      var userId = _ref52[0];
      return ['user:' + userId, ['local://users/' + userId, { firstName: 'John', lastName: 'Doe' }]];
    }).toObject();
  })(Users) || Users;
  Users = (0, _2.component)(function () {
    return {
      users: ['local://users', {}] };
  })(Users) || Users;
  return Users;
})(_react2['default'].Component);

exports['default'] = Users;
module.exports = exports['default'];