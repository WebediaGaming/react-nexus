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

var _Nexus = require('./Nexus');

var _Nexus2 = _interopRequireDefault(_Nexus);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

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
var checkBindings = _Nexus2['default'].checkBindings;
var STATUS = _Nexus2['default'].STATUS;

function bind(Component) {
  var getNexusBindings = arguments[1] === undefined ? Component.prototype.getNexusBindings : arguments[1];
  var displayName = arguments[2] === undefined ? 'Nexus' + Component.displayName : arguments[2];
  return (function () {
    if (__DEV__) {
      Component.should.be.a.Function;
      getNexusBindings.should.be.a.Function;
      displayName.should.be.a.String;
    }
    return (function (_React$Component) {
      var _class = function (props) {
        var _this = this;

        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
        this.isReactNexusComponentInstance = true;
        this._nexusBindings = null;
        this._nexusBindingsLifespans = null;
        this.state = null;
        this._nexusBindings = {};
        this._nexusBindingsLifespans = {};
        var bindings = getNexusBindings(props);
        checkBindings(bindings);
        this.state = _.mapValues(bindings, function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3);

          var flux = _ref2[0];
          var path = _ref2[1];
          var defaultValue = _ref2[2];

          if (_this.getFlux(flux).isPrefetching) {
            return [STATUS.PREFETCH, _this.getFlux(flux).prefetch(path).promise];
          }
          if (_this.getFlux(flux).isInjecting) {
            return [STATUS.INJECT, _this.getFlux(flux).getInjected(path)];
          }
          return [STATUS.PENDING, _immutable2['default'].Map(defaultValue)];
        });
      };

      _inherits(_class, _React$Component);

      _createClass(_class, [{
        key: 'getNexus',
        value: function getNexus() {
          if (__DEV__) {
            (_Nexus2['default'].currentNexus !== null).should.be.ok;
          }
          return _Nexus2['default'].currentNexus;
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
          return _.mapValues(this.state, function (_ref3) {
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
        }
      }, {
        key: 'waitForPrefetching',
        value: function waitForPrefetching() {
          return Promise.all(_.map(this.state, function (_ref4) {
            var _ref42 = _slicedToArray(_ref4, 2);

            var status = _ref42[0];
            var promise = _ref42[1];
            return status === STATUS.PREFETCH ? promise : Promise.resolve();
          }));
        }
      }, {
        key: 'applyNexusBindings',
        value: function applyNexusBindings(props) {
          var _this2 = this;

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

              var lifespan = nextLifespans[stateKey] = new Lifespan();
              _this2.setState(_defineProperty({}, stateKey, _this2.getFlux(flux).getStore(path, lifespan).onUpdate(function (_ref5) {
                var head = _ref5.head;
                return _this2.setState(_defineProperty({}, stateKey, [STATUS.LIVE, head]));
              }).onDelete(function () {
                return _this2.setState(_defineProperty({}, stateKey, void 0));
              }).value || defaultValue));
            };
            var removePrevBinding = function removePrevBinding() {
              _this2.setState(_defineProperty({}, stateKey, void 0));
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
              nextLifespans[stateKey] = _this2._nexusBindingsLifespans[stateKey];
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
          var nexusContext = { nexus: this.getNexus() };
          var dataMap = this.getDataMap();
          var props = this.props;

          var childProps = _Object$assign({}, nexusContext, props, dataMap);
          // if(__DEV__) {
          //   _.each(merges, (mergeA, indexA) =>
          //     _.each(merges, (mergeB, indexB) => {
          //       if(mergeA !== mergeB && _.intersection(_.keys(mergeA), _.keys(mergeB)).length !== 0) {
          //         console.warn('react-nexus:',
          //           this.constructor.displayName,
          //           'has conflicting keys:',
          //           { [indexA]: mergeA, [indexB]: mergeB }
          //         );
          //       }
          //     })
          //   );
          // }
          // Key conflicts priority: { nexus } > this.props > this.getDataMap()
          return _react2['default'].createElement(Component, childProps);
        }
      }], [{
        key: 'displayName',
        value: displayName,
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  })();
}

exports['default'] = bind;
module.exports = exports['default'];