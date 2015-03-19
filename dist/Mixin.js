"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

require("babel/polyfill");
var _ = require("lodash");
var should = require("should");
var Promise = (global || window).Promise = require("bluebird");
var __DEV__ = process.env.NODE_ENV !== "production";
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === "object";
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

var Lifespan = require("nexus-flux").Lifespan;

module.exports = function (Nexus) {
  return {

    _nexusBindings: null,
    _nexusBindingsLifespans: null,

    getNexus: function getNexus() {
      if (__DEV__) {
        (Nexus.currentNexus !== null).should.be["true"];
      }
      return Nexus.currentNexus;
    },

    _getNexusBindings: function _getNexusBindings(props) {
      return this.getNexusBindings ? this.getNexusBindings(props) || {} : {};
    },

    getInitialState: function getInitialState() {
      var bindings = this._getNexusBindings(this.props);
      var state = {};
      _.each(bindings, function (_ref, stateKey) {
        var _ref2 = _slicedToArray(_ref, 2);

        var flux = _ref2[0];
        var path = _ref2[1];

        if (flux.isPrefetching) {
          state[stateKey] = flux.getPrefetched(path); // will return the immutable head
        } else if (flux.isInjecting) {
          state[stateKey] = flux.getInjected(path); // will return the immutable head
        } else {
          state[stateKey] = null;
        }
      });
      return state;
    },

    prefetchNexusBindings: function prefetchNexusBindings() {
      var _this = this;

      var bindings = this._getNexusBindings(this.props) || {};
      return Promise.all(_.map(bindings, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var flux = _ref2[0];
        var path = _ref2[1];
        return flux.isPrefetching ? flux.prefetch(path) : Promise.resolve();
      })).then(function () {
        return _this;
      }); // return this to be chainable
    },

    applyNexusBindings: function applyNexusBindings(props) {
      var _this = this;

      var prevBindings = this._nexusBindings || {};
      var prevLifespans = this._nexusBindingsLifespans || {};
      var nextBindings = this._getNexusBindings(props) || {};
      var nextLifespans = {};

      _.each(_.union(_.keys(prevBindings), _.keys(nextBindings)), function (stateKey) {
        var prev = prevBindings[stateKey];
        var next = nextBindings[stateKey];
        var addNextBinding = function () {
          var _next = _slicedToArray(next, 2);

          var flux = _next[0];
          var path = _next[1];

          var lifespan = nextLifespans[stateKey] = new Lifespan();
          _this.setState(_defineProperty({}, stateKey, flux.getStore(path, lifespan).onUpdate(function (_ref) {
            var head = _ref.head;
            return _this.setState(_defineProperty({}, stateKey, head));
          }).onDelete(function () {
            return _this.setState(_defineProperty({}, stateKey, void 0));
          }).value));
        };
        var removePrevBinding = function () {
          _this.setState(_defineProperty({}, stateKey, void 0));
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

        var _next = _slicedToArray(next, 2);

        var nextFlux = _next[0];
        var nextPath = _next[1];

        if (prevFlux !== nextFlux || prevPath !== nextPath) {
          // binding is modified
          removePrevBinding();
          addNextBinding();
        }
      });

      this._nexusBindings = nextBindings;
      this._nexusBindingsLifespans = nextLifespans;
    },

    componentDidMount: function componentDidMount() {
      this.applyNexusBindings(this.props);
    },

    componentWillUnmount: function componentWillUnmount() {
      _.each(this._nexusBindingsLifespans || [], function (lifespan) {
        return lifespan.release();
      });
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.applyNexusBindings(nextProps);
    } };
};