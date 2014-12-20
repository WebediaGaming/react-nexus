"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R, Dispatcher) {
  var _ = R._;

  var UplinkDispatcher = (function (Dispatcher) {
    var UplinkDispatcher = function UplinkDispatcher(_ref) {
      var uplink = _ref.uplink;
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return (uplink !== void 0).should.be.ok && uplink.listenTo.should.be.a.Function && uplink.unlistenFrom.should.be.a.Function;
      });
      Dispatcher.call(this);
      _.extend(this, {
        _uplink: uplink });
    };

    _extends(UplinkDispatcher, Dispatcher);

    UplinkDispatcher.prototype.dispatch = function (action, params) {
      if (params === undefined) params = {};
      _.dev(function () {
        return action.should.be.a.String && (params === null || _.isObject(params)).should.be.ok;
      });
      return this._uplink.dispatch(action, params);
    };

    return UplinkDispatcher;
  })(Dispatcher);

  _.extend(UplinkDispatcher.prototype, {
    _uplink: null });

  return UplinkDispatcher;
};