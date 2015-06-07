'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddons = require('react/addons');

var _Nexus = require('./Nexus');

var _Nexus2 = _interopRequireDefault(_Nexus);

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
var PureRenderMixin = _reactAddons.addons.PureRenderMixin;

function bindRoot(Component) {
  var createNexus = arguments[1] === undefined ? Component.prototype.createNexus : arguments[1];
  var defaultRender = arguments[2] === undefined ? Component.prototype.defaultRender || function () {
    return null;
  } : arguments[2];
  var displayName = arguments[3] === undefined ? 'NexusRoot' + Component.displayName : arguments[3];
  return (function () {

    if (__DEV__) {
      createNexus.should.be.a.Function;
      displayName.should.be.a.String;
    }

    return (function (_React$Component) {
      var _class = function (_ref) {
        var _ref$nexus = _ref.nexus;
        var nexus = _ref$nexus === undefined ? null : _ref$nexus;
        var _ref$lifespan = _ref.lifespan;
        var lifespan = _ref$lifespan === undefined ? null : _ref$lifespan;
        var _ref$data = _ref.data;
        var data = _ref$data === undefined ? null : _ref$data;

        var otherProps = _objectWithoutProperties(_ref, ['nexus', 'lifespan', 'data']);

        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, otherProps);
        this.isReactNexusRootInstance = true;
        if (nexus !== null) {
          _.each(nexus, function (flux, k) {
            return flux.startInjecting(data[k]);
          });
          _Object$assign(this, { nexus: nexus, lifespan: lifespan });
        } else {
          _Object$assign(this, createNexus.call(this, _extends({ data: data }, otherProps))); // eslint-disable-line object-shorthand
        }
      };

      _inherits(_class, _React$Component);

      _createClass(_class, [{
        key: 'getOtherProps',
        value: function getOtherProps() {
          return _.omit(this.props, ['nexus', 'data']);
        }
      }, {
        key: 'getNexus',
        value: function getNexus() {
          var nexus = this.nexus;
          var lifespan = this.lifespan;

          return { nexus: nexus, lifespan: lifespan, instance: this };
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var nexus = this.state.nexus;

          _.each(nexus, function (flux) {
            return flux.stopInjecting();
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.lifespan.release();
        }
      }, {
        key: 'render',
        value: function render() {
          _Nexus2['default'].currentNexus = this.nexus;
          return _react2['default'].createElement(Component, this.getOtherProps());
        }
      }], [{
        key: 'displayName',
        value: displayName,
        enumerable: true
      }, {
        key: 'propTypes',
        value: {
          data: _react2['default'].PropTypes.object,
          lifespan: _react2['default'].PropTypes.object,
          nexus: _react2['default'].PropTypes.object },
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  })();
}

exports['default'] = bindRoot;
module.exports = exports['default'];
// eslint-disable-line object-shorthand