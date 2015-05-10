'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Nested = require('./Nested');

var _Nested2 = _interopRequireDefault(_Nested);

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
exports['default'] = _3['default'].Enhance((function (_React$Component) {
  var _class = function (props) {
    _classCallCheck(this, _class);

    _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
    this.state = { foo: '/bar', clicks: 0 };
  };

  _inherits(_class, _React$Component);

  _createClass(_class, [{
    key: 'getNexusBindings',
    value: function getNexusBindings() {
      return {
        route: ['local', '/route'] };
    }
  }, {
    key: 'click',
    value: function click() {
      this.setState({ clicks: this.state.clicks + 1 });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state;
      var foo = _state.foo;
      var clicks = _state.clicks;
      var route = this.props.route;

      return _react2['default'].createElement(
        'div',
        { className: 'App' },
        _react2['default'].createElement(
          'p',
          null,
          'My route is ',
          route ? route.get('path') : null,
          ' and foo is ',
          _react2['default'].createElement(_Nested2['default'], { foo: foo }),
          '.'
        ),
        _react2['default'].createElement(
          'p',
          null,
          'The clicks counter is ',
          clicks,
          '. ',
          _react2['default'].createElement(
            'button',
            { onClick: function () {
                return _this2.click();
              } },
            'increase counter'
          )
        )
      );
    }
  }], [{
    key: 'displayName',
    value: 'App',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      route: _react2['default'].PropTypes.any },
    enumerable: true
  }]);

  return _class;
})(_react2['default'].Component));
module.exports = exports['default'];