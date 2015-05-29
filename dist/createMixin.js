'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x2,
    property = _x3,
    receiver = _x4; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _nexusFlux = require('nexus-flux');

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
      var _ref2 = _slicedToArray(_ref, 2);

      var flux = _ref2[0];
      var path = _ref2[1];

      flux.should.be.a.String;
      path.should.be.a.String;
    });
  }
}

var STATUS = {
  PREFETCH: 'PREFETCH',
  INJECT: 'INJECT',
  PENDING: 'PENDING',
  LIVE: 'LIVE' };

exports['default'] = function (React, Nexus) {
  var prototype = {
    _nexusBindings: null,

    _nexusBindingsLifespans: null,

    getNexus: function getNexus() {
      if (__DEV__) {
        (Nexus.currentNexus !== null).should.be.ok;
      }
      return Nexus.currentNexus;
    },

    getNexusFlux: function getNexusFlux(flux) {
      if (__DEV__) {
        this.getNexus().should.have.property(flux);
      }
      return this.getNexus()[flux];
    },

    getNexusCurrentValue: function getNexusCurrentValue(key) {
      if (__DEV__) {
        key.should.be.a.String;
        this.state.should.have.property(key);
      }
    },

    getNexusState: function getNexusState() {
      return _.pick(this.state, _.values(this.getNexusBindings(this.props)));
    },

    getNexusDataMap: function getNexusDataMap() {
      return _.mapValues(this.getNexusState(), function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var status = _ref32[0];
        var value = _ref32[1];

        // in this case only, the value is wrapped
        if (status === STATUS.PREFETCH) {
          return value.value();
        }
        // in all other cases (INJECT, PENDING, LIVE) then the value is unwrapped
        return value;
      });
    },

    waitForNexusPrefetching: function waitForNexusPrefetching() {
      return Promise.all(_.map(this.getNexusState(), function (_ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var status = _ref42[0];
        var value = _ref42[1];
        return status === STATUS.PREFETCH ? value.promise : Promise.resolve();
      }));
    },

    applyNexusBindings: function applyNexusBindings(props) {
      var _this10 = this;

      var prevBindings = this._nexusBindings || {};
      var prevLifespans = this._nexusBindingsLifespans || {};
      var nextLifespans = {};
      var nextBindings = this.getNexusBindings(props);

      _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), function (stateKey) {
        var prev = prevBindings[stateKey];
        var next = nextBindings[stateKey];
        var addNextBinding = function addNextBinding() {
          var _next = _slicedToArray(next, 3);

          var flux = _next[0];
          var path = _next[1];
          var defaultValue = _next[2];

          var lifespan = nextLifespans[stateKey] = new _nexusFlux.Lifespan();
          _this10.getNexusFlux(flux).getStore(path, lifespan).onUpdate(function (_ref5) {
            var head = _ref5.head;
            return _this10.setState(_defineProperty({}, stateKey, [STATUS.LIVE, head]));
          }).onDelete(function () {
            return _this10.setState(_defineProperty({}, stateKey, void 0));
          });
          _this10.setState(_defineProperty({}, stateKey, [STATUS.PENDING, defaultValue]));
        };
        var removePrevBinding = function removePrevBinding() {
          _this10.setState(_defineProperty({}, stateKey, void 0));
          prevLifespans[stateKey].release();
        };
        // binding is added
        if (prev === void 0) {
          addNextBinding();
          return;
        }
        // binding is removed
        if (next === void 0) {
          removePrevBinding();
          return;
        }

        var _prev = _slicedToArray(prev, 2);

        var prevFlux = _prev[0];
        var prevPath = _prev[1];

        var _next2 = _slicedToArray(next, 2);

        var nextFlux = _next2[0];
        var nextPath = _next2[1];

        // binding is modified
        if (prevFlux !== nextFlux || prevPath !== nextPath) {
          removePrevBinding();
          addNextBinding();
        } else {
          nextLifespans[stateKey] = _this10._nexusBindingsLifespans[stateKey];
        }
      });

      this._nexusBindings = nextBindings;
      this._nexusBindingsLifespans = nextLifespans;
    },

    releaseNexusBindings: function releaseNexusBindings() {
      _.each(this._nexusBindingsLifespans || [], function (lifespan) {
        return lifespan.release();
      });
    } };

  function mixin(Component) {
    var getNexusBindings = arguments[1] === undefined ? Component.prototype.getNexusBindings : arguments[1];
    return (function () {
      if (__DEV__) {
        Component.should.be.a.Function;
        getNexusBindings.should.be.a.Function;
        // check that there are no key conflicts
        Object.keys(prototype).forEach(function (propertyName) {
          return Component.should.not.have.property(propertyName);
        });
      }

      var ReactNexusComponent = (function (_Component) {
        function ReactNexusComponent(props) {
          var _this11 = this;

          _classCallCheck(this, ReactNexusComponent);

          if (__DEV__) {
            getNexusBindings.should.be.a.Function;
          }
          _get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'constructor', this).call(this, props);
          this._nexusBindings = {};
          this._nexusBindingsLifespans = {};
          var bindings = getNexusBindings(props);
          checkBindings(bindings);
          this.state = this.state || {};
          Object.assign(this.state, _.mapValues(bindings, function (_ref6) {
            var _ref62 = _slicedToArray(_ref6, 3);

            var flux = _ref62[0];
            var path = _ref62[1];
            var defaultValue = _ref62[2];

            if (_this11.getNexusFlux(flux).isPrefetching) {
              return [STATUS.PREFETCH, _this11.getNexusFlux(flux).prefetch(path).promise];
            }
            if (_this11.getNexusFlux(flux).isInjecting) {
              return [STATUS.INJECT, _this11.getNexusFlux(flux).getInjected(path)];
            }
            return [STATUS.PENDING, defaultValue];
          }));
        }

        _inherits(ReactNexusComponent, _Component);

        _createClass(ReactNexusComponent, [{
          key: 'componentDidMount',
          value: function componentDidMount() {
            if (_get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentDidMount', this)) {
              _get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentDidMount', this).call(this);
            }
            this.applyNexusBindings(this.props);
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            if (_get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentWillUnmount', this)) {
              _get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentWillUnmount', this).call(this);
            }
            this.releaseNexusBindings();
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(props) {
            if (_get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentWillReceiveProps', this)) {
              _get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'componentWillReceiveProps', this).call(this, props);
            }
          }
        }, {
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState) {
            return (_get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'shouldComponentUpdate', this) ? _get(Object.getPrototypeOf(ReactNexusComponent.prototype), 'shouldComponentUpdate', this).call(this) : false) || !_.isEqual(this.state, nextState) || !_.isEqual(this.props, nextProps);
          }
        }]);

        return ReactNexusComponent;
      })(Component);

      Object.assign(ReactNexusComponent.prototype, prototype, { getNexusBindings: getNexusBindings });
      return ReactNexusComponent;
    })();
  }

  Object.assign(mixin, { React: React });

  return mixin;
};

module.exports = exports['default'];
/* defaultValue */