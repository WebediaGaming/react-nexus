'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Lifespan = require('nexus-flux');

var _React = require('react');

var _React2 = _interopRequireDefault(_React);

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

function checkBindings(bindings) {
  if (__DEV__) {
    bindings.should.be.an.Object;
    _.each(bindings, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3);

      var flux = _ref2[0];
      var path = _ref2[1];
      var defaultValue = _ref2[2];

      flux.should.be.a.String;
      path.should.be.a.String;
      void defaultValue;
    });
  }
}

exports['default'] = function (Nexus) {
  return function (Component, getNexusBindings) {
    return (function (_React$Component) {
      function NexusElement(props) {
        var _this = this;

        _classCallCheck(this, NexusElement);

        if (__DEV__) {
          getNexusBindings.should.be.a.Function;
        }
        _get(Object.getPrototypeOf(NexusElement.prototype), 'constructor', this).call(this, props);
        this._nexusBindings = {};
        this._nexusBindingsLifespans = {};
        var bindings = getNexusBindings(props);
        checkBindings(bindings);
        this.state = _.mapValues(bindings, function (_ref3) {
          var _ref32 = _slicedToArray(_ref3, 3);

          var flux = _ref32[0];
          var path = _ref32[1];
          var defaultValue = _ref32[2];

          if (_this.getFlux(flux).isPrefetching) {
            return _this.getFlux(flux).prefetch(path);
          }
          if (_this.getFlux(flux).isInjecting) {
            return _this.getFlux(flux).getInjected(path);
          }
          return defaultValue;
        });
      }

      _inherits(NexusElement, _React$Component);

      _createClass(NexusElement, [{
        key: 'getNexus',
        value: function getNexus() {
          if (__DEV__) {
            (Nexus.currentNexus !== null).should.be.ok;
          }
          return Nexus.currentNexus;
        }
      }, {
        key: 'getFlux',
        value: function getFlux(flux) {
          if (__DEV__) {
            this.getNexus().should.have.property(flux);
          }
          return this.getNexus()[flux];
        }
      }, {
        key: 'prefetchNexusBindings',
        value: function prefetchNexusBindings() {
          var _this2 = this;

          var bindings = getNexusBindings(this.props);
          return Promise.all(_.map(bindings, function (_ref4) {
            var _ref42 = _slicedToArray(_ref4, 2);

            var flux = _ref42[0];
            var path = _ref42[1];
            return _this2.getFlux(flux).isPrefetching ? _this2.getFlux(flux).prefetch(path) : Promise.resolve();
          })).then(function () {
            return _this2;
          });
        }
      }, {
        key: 'applyNexusBindings',
        value: function applyNexusBindings(props) {
          var _this3 = this;

          var prevBindings = this._nexusBindings || {};
          var prevLifespans = this._nexusBindingsLifespans || {};
          var nextLifespans = {};
          var nextBindings = getNexusBindings(props);

          _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), function (stateKey) {
            var prev = prevBindings[stateKey];
            var next = nextBindings[stateKey];
            var addNextBinding = function addNextBinding() {
              var _next = _slicedToArray(next, 3);

              var flux = _next[0];
              var path = _next[1];
              var defaultValue = _next[2];

              var lifespan = nextLifespans[stateKey] = new _Lifespan.Lifespan();
              _this3.setState(_defineProperty({}, stateKey, _this3.getFlux(flux).getStore(path, lifespan).onUpdate(function (_ref5) {
                var head = _ref5.head;
                return _this3.setState(_defineProperty({}, stateKey, head));
              }).onDelete(function () {
                return _this3.setState(_defineProperty({}, stateKey, void 0));
              }).value || defaultValue));
            };
            var removePrevBinding = function removePrevBinding() {
              _this3.setState(_defineProperty({}, stateKey, void 0));
              prevLifespans[stateKey].release();
            };
            if (prev === void 0) {
              // binding is added
              addNextBinding();
              return;
            }
            if (next === void 0) {
              // binding is removed
              removePrevBinding();
              return;
            }

            var _prev = _slicedToArray(prev, 2);

            var prevFlux = _prev[0];
            var prevPath = _prev[1];

            var _next2 = _slicedToArray(next, 2);

            var nextFlux = _next2[0];
            var nextPath = _next2[1];

            if (prevFlux !== nextFlux || prevPath !== nextPath) {
              // binding is modified
              removePrevBinding();
              addNextBinding();
            } else {
              nextLifespans[stateKey] = _this3._nexusBindingsLifespans[stateKey];
            }
          });

          this._nexusBindings = nextBindings;
          this._nexusBindingsLifespans = nextLifespans;
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.applyNexusBindings(this.props);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          _.each(this._nexusBindingsLifespans || [], function (lifespan) {
            return lifespan.release();
          });
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this.applyNexusBindings(nextProps);
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !_.isEqual(nextProps, nextState);
        }
      }, {
        key: 'render',
        value: function render() {
          var props = Object.assign({}, this.props, this.state);
          return _React2['default'].createElement(Component, props);
        }
      }]);

      return NexusElement;
    })(_React2['default'].Component);
  };
};

module.exports = exports['default'];