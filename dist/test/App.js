'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

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

var _Nested = require('./Nested');

var _Nested2 = _interopRequireDefault(_Nested);

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
exports['default'] = _3['default'].bind((function (_React$Component) {
  function App(props) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
    this.state = { foo: '/bar', clicks: 0 };
  }

  _inherits(App, _React$Component);

  _createClass(App, [{
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
      var _this = this;

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
                return _this.click();
              } },
            'increase counter'
          )
        )
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      route: _react2['default'].PropTypes.any },
    enumerable: true
  }]);

  return App;
})(_react2['default'].Component));
module.exports = exports['default'];