'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x2,
    property = _x3,
    receiver = _x4; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
  return function (Component) {
    var getNexusBindings = arguments[1] === undefined ? Component.prototype.getNexusBindings : arguments[1];
    return (function () {
      return (function (_React$Component) {
        var _class = function (props) {
          var _this2 = this;

          _classCallCheck(this, _class);

          if (__DEV__) {
            getNexusBindings.should.be.a.Function;
          }
          _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
          this._nexusBindings = {};
          this._nexusBindingsLifespans = {};
          var bindings = getNexusBindings(props);
          checkBindings(bindings);
          this.state = _.mapValues(bindings, function (_ref3) {
            var _ref32 = _slicedToArray(_ref3, 3);

            var flux = _ref32[0];
            var path = _ref32[1];
            var defaultValue = _ref32[2];

            if (_this2.getFlux(flux).isPrefetching) {
              return [STATUS.PREFETCH, _this2.getFlux(flux).prefetch(path).promise];
            }
            if (_this2.getFlux(flux).isInjecting) {
              return [STATUS.INJECT, _this2.getFlux(flux).getInjected(path)];
            }
            return [STATUS.PENDING, defaultValue];
          });
        };

        _inherits(_class, _React$Component);

        _createClass(_class, [{
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
          key: 'getCurrentValue',
          value: function getCurrentValue(key) {
            if (__DEV__) {
              key.should.be.a.String;
              this.state.should.have.property(key);
            }
          }
        }, {
          key: 'getDataMap',
          value: function getDataMap() {
            return _.mapValues(this.state, function (_ref4) {
              var _ref42 = _slicedToArray(_ref4, 2);

              var status = _ref42[0];
              var value = _ref42[1];

              // in this case only, the value is wrapped
              if (status === STATUS.PREFETCH) {
                return value.value();
              }
              // in all other cases (INJECT, PENDING, LIVE) then the value is unwrapped
              return value;
            });
          }
        }, {
          key: 'waitForPrefetching',
          value: function waitForPrefetching() {
            return Promise.all(_.map(this.state, function (_ref5) {
              var _ref52 = _slicedToArray(_ref5, 2);

              var status = _ref52[0];
              var value = _ref52[1];
              return status === STATUS.PREFETCH ? value.promise : Promise.resolve();
            }));
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

                var lifespan = nextLifespans[stateKey] = new _nexusFlux.Lifespan();
                _this3.getFlux(flux).getStore(path, lifespan).onUpdate(function (_ref6) {
                  var head = _ref6.head;
                  return _this3.setState(_defineProperty({}, stateKey, [STATUS.LIVE, head]));
                }).onDelete(function () {
                  return _this3.setState(_defineProperty({}, stateKey, void 0));
                });
                _this3.setState(_defineProperty({}, stateKey, [STATUS.PENDING, defaultValue]));
              };
              var removePrevBinding = function removePrevBinding() {
                _this3.setState(_defineProperty({}, stateKey, void 0));
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
            var _this4 = this;

            var nexusContext = { nexus: this.getNexus() };
            var dataMap = this.getDataMap();
            var props = this.props;

            var merges = { nexusContext: nexusContext, props: props, dataMap: dataMap };
            var childProps = Object.assign.apply(Object, [{}].concat(_toConsumableArray(_.values(merges))));
            if (__DEV__) {
              _.each(merges, function (mergeA, indexA) {
                return _.each(merges, function (mergeB, indexB) {
                  if (mergeA !== mergeB && _.intersection(_.keys(mergeA), _.keys(mergeB)).length !== 0) {
                    var _console$warn;

                    console.warn('react-nexus:', _this4.constructor.displayName, 'has conflicting keys:', (_console$warn = {}, _defineProperty(_console$warn, indexA, mergeA), _defineProperty(_console$warn, indexB, mergeB), _console$warn));
                  }
                });
              });
            }
            // Key conflicts priority: { nexus } > this.props > this.getDataMap()
            return React.createElement(Component, childProps);
          }
        }], [{
          key: 'displayName',
          value: 'Nexus' + Component.displayName,
          enumerable: true
        }]);

        return _class;
      })(React.Component);
    })();
  };
};

module.exports = exports['default'];
/* defaultValue */