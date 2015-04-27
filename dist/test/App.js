'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Nexus = require('../');

var _Nexus2 = _interopRequireDefault(_Nexus);

var _React = require('react');

var _React2 = _interopRequireDefault(_React);

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
exports['default'] = _Nexus2['default'].Enhance((function (_React$Component) {
  function App(props) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);
    this.state = { foo: '/bar', clicks: 0 };
  }

  _inherits(App, _React$Component);

  _createClass(App, [{
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

      return _React2['default'].createElement(
        'div',
        { className: 'App' },
        _React2['default'].createElement(
          'p',
          null,
          'My route is ',
          route ? route.get('path') : null,
          ' and foo is ',
          _React2['default'].createElement(_Nested2['default'], { foo: foo }),
          '.'
        ),
        _React2['default'].createElement(
          'p',
          null,
          'The clicks counter is ',
          clicks,
          '. ',
          _React2['default'].createElement(
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
    key: 'displayName',
    value: 'App',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      route: _React2['default'].PropTypes.any },
    enumerable: true
  }]);

  return App;
})(_React2['default'].Component), function getNexusBindings() {
  return {
    route: ['local', '/route'] };
});
module.exports = exports['default'];