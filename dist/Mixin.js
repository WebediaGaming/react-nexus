"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

require("6to5/polyfill");
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
var Lifespan = _interopRequire(require("lifespan"));

module.exports = function (Nexus) {
  return {

    _nexusBindingsLifespan: null,

    getNexus: function getNexus() {
      if (__DEV__) {
        (Nexus.currentNexus !== null).should.be["true"];
      }
      return Nexus.currentNexus;
    },

    getNexusBindingsLifespan: function getNexusBindingsLifespan() {
      return this._nexusBindingsLifespan;
    },

    getInitialState: function getInitialState() {
      if (__DEV__) {
        if (!_.isFunction(this.getNexusBindings)) {
          throw new TypeError("You MUST define getNexusBindings on React class " + this.displayName + ".");
        }
      }
      var bindings = this.getNexusBindings(this.props);
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
      var bindings = this.getNexusBindings(this.props);
      return Promise.all(_.map(bindings, function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var flux = _ref32[0];
        var path = _ref32[1];
        return flux.isPrefetching ? flux.prefetch(path) : Promise.resolve();
      })).then(function () {
        return _this;
      }); // return this to be chainable
    },

    applyNexusBindings: function applyNexusBindings(props) {
      var _this2 = this;
      var previousBindingsLifespan = this.getNexusBindingsLifespan();
      this._nexusBindingsLifespan = new Lifespan();
      var bindings = this.getNexusBindings(props);
      _.each(bindings, function (_ref4, stateKey) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var flux = _ref42[0];
        var path = _ref42[1];
        return _this2.setState(_defineProperty({}, stateKey, flux.Store(path, _this2._nexusBindingsLifespan).onUpdate(function (_ref5) {
          var head = _ref5.head;
          return _this2.setState(_defineProperty({}, stateKey, head));
        }).onDelete(function () {
          return _this2.setState(_defineProperty({}, stateKey, void 0));
        }).value));
      });
      if (previousBindingsLifespan) {
        previousBindingsLifespan.release();
      }
    },

    componentDidMount: function componentDidMount() {
      this.applyNexusBindings(this.props);
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this._nexusBindingsLifespan) {
        this._nexusBindingsLifespan.release();
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.applyNexusBindings(nextProps);
    } };
};

// will also return the immutable head