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

var _nexusFluxAdaptersLocal = require('nexus-flux/adapters/local');

var _nexusFluxAdaptersLocal2 = _interopRequireDefault(_nexusFluxAdaptersLocal);

var _2 = require('../');

var _3 = _interopRequireDefault(_2);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

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
var Lifespan = _3['default'].Lifespan;
var Remutable = _3['default'].Remutable;

var Root = (function (_React$Component) {
  function Root() {
    _classCallCheck(this, _Root);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Root, _React$Component);

  var _Root = Root;

  _createClass(_Root, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var route = _props.route;
      var session = _props.session;

      var path = route.get('path');
      var userId = session.get('userId');
      return _react2['default'].createElement(
        'div',
        { className: 'Root' },
        _react2['default'].createElement(
          'p',
          null,
          'Route is ',
          path || null,
          '. User is ',
          userId ? _react2['default'].createElement(_User2['default'], { userId: userId }) : null,
          '.'
        )
      );
    }
  }], [{
    key: 'displayName',
    value: 'Root',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      route: _3['default'].PropTypes.Immutable.Map,
      session: _3['default'].PropTypes.Immutable.Map },
    enumerable: true
  }]);

  Root = _3['default'].component(function () {
    return {
      route: ['local://route', { path: 'default' }],
      session: ['local://session', {}] };
  })(Root) || Root;
  Root = _3['default'].root(function (_ref) {
    var data = _ref.data;
    var path = _ref.path;

    var lifespan = new Lifespan();
    var recover = function recover(key, defaultValue) {
      return data && data[key] || defaultValue;
    };
    var localStores = {
      '/session': new Remutable(recover('/session', { userId: 1 })),
      '/route': new Remutable({ path: path }),
      '/users/1': new Remutable(recover('/users/1', { firstName: 'Immanuel', lastName: 'Kant' })),
      '/users/2': new Remutable(recover('/users/2', { firstName: 'Friedrich', lastName: 'Nietzsche' })) };

    var localServer = new _nexusFluxAdaptersLocal2['default'].Server(localStores);
    var localClient = new _nexusFluxAdaptersLocal2['default'].Client(localServer);
    lifespan.onRelease(function () {
      localServer.lifespan.release();
      localClient.lifespan.release();
    });

    var nexus = { local: localClient };
    return { lifespan: lifespan, nexus: nexus };
  })(Root) || Root;
  return Root;
})(_react2['default'].Component);

exports['default'] = Root;
module.exports = exports['default'];