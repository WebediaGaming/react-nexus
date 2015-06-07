'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _pureRenderDecorator = require('pure-render-decorator');

var _pureRenderDecorator2 = _interopRequireDefault(_pureRenderDecorator);

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
var Lifespan = _Nexus2['default'].Lifespan;

var STATUS = {
  PREFETCH: 'PREFETCH',
  INJECT: 'INJECT',
  PENDING: 'PENDING',
  SYNCING: 'SYNCING',
  LIVE: 'LIVE' };

function normalizeGetBindings() {
  var getBindings = arguments[0] === undefined ? {} : arguments[0];

  if (!_.isFunction(getBindings)) {
    if (__DEV__) {
      getBindings.should.be.an.Object;
    }
    return function () {
      return getBindings;
    };
  }
  return getBindings;
}

function bindComponent(Component) {
  var getBindings = arguments[1] === undefined ? Component.prototype.getNexusBindings : arguments[1];
  var displayName = arguments[2] === undefined ? 'NexusComponent' + Component.displayName : arguments[2];
  return (function () {
    // getBindings can be a function or a static object
    var _getBindings = normalizeGetBindings(getBindings);

    if (__DEV__) {
      Component.should.be.a.Function;
      _getBindings.should.be.a.Function;
      displayName.should.be.a.String;
    }

    return (function (_React$Component) {
      var _class = function (props) {
        _classCallCheck(this, _class2);

        // eslint-disable-line object-shorthand
        _get(Object.getPrototypeOf(_class2.prototype), 'constructor', this).call(this, props);
        this.isReactNexusComponentInstance = true;
        this.state = null;
        this.bindings = null;
        this.lifespans = null;
        this.bindings = {};
        this.lifespans = {};
        this.state = _.mapValues(this.getBindings(props), function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3);

          var flux = _ref2[0];
          var path = _ref2[1];
          var defaultValue = _ref2[2];

          if (flux.isPrefetching) {
            return [STATUS.PREFETCH, flux.prefetch(path), defaultValue];
          }
          if (flux.isInjecting) {
            return [STATUS.INJECT, flux.getInjected(path), defaultValue];
          }
          return [STATUS.PENDING, defaultValue, defaultValue];
        });
      };

      _inherits(_class, _React$Component);

      var _class2 = _class;

      _createClass(_class2, [{
        key: 'getBindings',
        value: function getBindings(props) {
          var nexus = _Nexus2['default'].currentNexus;
          return _.mapValues(_getBindings(props), function (_ref3) {
            var _ref32 = _slicedToArray(_ref3, 2);

            var binding = _ref32[0];
            var defaultValue = _ref32[1];

            var _ref4 = _.isString(binding) ? binding.split(':/') : binding;

            var _ref42 = _slicedToArray(_ref4, 2);

            var key = _ref42[0];
            var path = _ref42[1];

            var flux = nexus[key];
            return [flux, path, _immutable2['default'].Map(defaultValue)];
          });
        }
      }, {
        key: 'getOtherProps',
        value: function getOtherProps(props) {
          return props;
        }
      }, {
        key: 'getStoreProps',
        value: function getStoreProps() {
          return _.mapValues(this.state, function (_ref5) {
            var _ref52 = _slicedToArray(_ref5, 3);

            var status = _ref52[0];
            var value = _ref52[1];
            var defaultValue = _ref52[2];

            if (status === STATUS.PREFETCH) {
              return value.head === null ? defaultValue : value.head;
            }
            return value;
          });
        }
      }, {
        key: 'getChildrenProps',
        value: function getChildrenProps() {
          return _Object$assign({ nexus: _Nexus2['default'].currentNexus }, this.getOtherProps(this.props), this.getStoreProps());
        }
      }, {
        key: 'updateBindings',
        value: function updateBindings() {
          var _this = this;

          var nextBindings = arguments[0] === undefined ? {} : arguments[0];

          var prevBindings = this.bindings;
          var lifespans = this.lifespans;
          _(prevBindings).pairs()
          // bindings to be replaced or removed altogether
          // shallow comparison of binding value ([flux, path, defaultValue])
          .filter(function (_ref6) {
            var _ref62 = _slicedToArray(_ref6, 2);

            var k = _ref62[0];
            var v = _ref62[1];
            return !_.isEqual(nextBindings[k], v);
          }).each(function (_ref7) {
            var _ref72 = _slicedToArray(_ref7, 1);

            var k = _ref72[0];

            lifespans[k].release();
            delete lifespans[k];
            _this.setState(_defineProperty({}, k, void 0));
          }).commit();

          _(nextBindings).pairs()
          // bindings replaced or inserted altogether
          // shallow comparison of binding value ([flux, path, defaultValue])
          .filter(function (_ref8) {
            var _ref82 = _slicedToArray(_ref8, 2);

            var k = _ref82[0];
            var v = _ref82[1];
            return !_.isEqual(prevBindings[k], v);
          }).each(function (_ref9) {
            var _ref92 = _slicedToArray(_ref9, 2);

            var k = _ref92[0];
            var v = _ref92[1];

            var _v = _slicedToArray(v, 3);

            var flux = _v[0];
            var path = _v[1];
            var defaultValue = _v[2];

            var store = flux.getStore(path, lifespans[k] = new Lifespan()).onUpdate(function (head) {
              return _this.setState(_defineProperty({}, k, [STATUS.LIVE, head, defaultValue]));
            }).onDelete(function () {
              return _this.setState(_defineProperty({}, k, [STATUS.LIVE, defaultValue, defaultValue]));
            });
            _this.setState(_defineProperty({}, k, [STATUS.SYNCING, store.value || defaultValue, defaultValue]));
          }).commit();

          this.bindings = nextBindings;
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this.updateBindings(this.getBindings(this.getOtherProps(nextProps)));
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.updateBindings(this.getBindings(this.getOtherProps(this.props)));
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.updateBindings({});
        }
      }, {
        key: 'waitForPrefetching',
        value: function waitForPrefetching() {
          var _this2 = this;

          return Promise.all(_.map(this.state, function (_ref10) {
            var _ref102 = _slicedToArray(_ref10, 2);

            var status = _ref102[0];
            var value = _ref102[1];
            return status === STATUS.PREFETCH ? value.promise : Promise.resolve();
          })).then(function () {
            return { instance: _this2 };
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2['default'].createElement(Component, this.getChildrenProps());
        }
      }], [{
        key: 'displayName',
        value: displayName,
        enumerable: true
      }]);

      _class = (0, _pureRenderDecorator2['default'])(_class) || _class;
      return _class;
    })(_react2['default'].Component);
  })();
}

exports['default'] = bindComponent;
module.exports = exports['default'];