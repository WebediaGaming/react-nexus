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

    __getNexusBindings: function __getNexusBindings(props) {
      return this.getNexusBindings ? this.getNexusBindings(props) || {} : {};
    },

    getInitialState: function getInitialState() {
      var bindings = this.__getNexusBindings(this.props);
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

      var bindings = this.__getNexusBindings(this.props) || {};
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

      var previousBindingsLifespan = this.getNexusBindingsLifespan();
      this._nexusBindingsLifespan = [];
      var bindings = this.__getNexusBindings(props) || {};
      _.each(bindings, function (_ref, stateKey) {
        var _ref2 = _slicedToArray(_ref, 2);

        var flux = _ref2[0];
        var path = _ref2[1];

        var lifespan = new Lifespan();
        _this._nexusBindingsLifespan.push({ lifespan: lifespan, path: path });
        _this.setState(_defineProperty({}, stateKey, flux.getStore(path, lifespan).onUpdate(function (_ref3) {
          var head = _ref3.head;
          return _this.setState(_defineProperty({}, stateKey, head));
        }).onDelete(function () {
          return _this.setState(_defineProperty({}, stateKey, void 0));
        }).value));
      });

      if (previousBindingsLifespan) {
        previousBindingsLifespan.map(function (_ref) {
          var lifespan = _ref.lifespan;
          var path = _ref.path;

          if (_.find(_this._nexusBindingsLifespan, { path: path }) === void 0) {
            lifespan.release();
          }
        });
      }
    },

    componentDidMount: function componentDidMount() {
      this.applyNexusBindings(this.props);
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this._nexusBindingsLifespan) {
        this._nexusBindingsLifespan.map(function (_ref) {
          var lifespan = _ref.lifespan;

          lifespan.release();
        });
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.applyNexusBindings(nextProps);
    } };
};

// will also return the immutable head