"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
  var _ = R._;
  var requestAnimationFrame = require("raf");

  require("setimmediate");

  function clearAnimationFrame(handle) {
    requestAnimationFrame.cancel(handle);
  }

  var Async = {
    ifMounted: function (fn) {
      var _this = this;
      var _arguments = arguments;
      return function () {
        _.dev(function () {
          return _this._AsyncMixin.should.be.ok;
        });
        if (!_this._AsyncMixinHasUnmounted) {
          return fn.apply(_this, _arguments);
        }
      };
    },

    _deferredImmediate: function (fn) {
      var _this2 = this;
      var _arguments2 = arguments;
      return function () {
        var args = _arguments2;
        var id = _.uniqueId("setImmediate");
        var q = setImmediate(function () {
          delete _this2._AsyncMixinQueuedImmediates[id];
          return fn.apply(_this2, args);
        });
        _this2._AsyncMixinQueuedImmediates[id] = q;
        return id;
      };
    },

    _deferredAnimationFrame: function (fn) {
      var _this3 = this;
      var _arguments3 = arguments;
      return function () {
        var args = _arguments3;
        var id = _.uniqueId("setImmediate");
        var q = requestAnimationFrame(function () {
          delete _this3._AsyncMixinQueuedAnimationFrames[id];
          return fn.apply(_this3, args);
        });
        _this3._AsyncMixinQueuedAnimationFrames[id] = q;
        return id;
      };
    },

    _deferredTimeout: function (delay) {
      var _this4 = this;
      var _arguments4 = arguments;
      return function (fn) {
        return function () {
          var args = _arguments4;
          var id = _.uniqueId("setTimeout");
          var q = setTimeout(function () {
            delete _this4._AsyncMixinQueuedTimeouts[id];
            return fn.apply(_this4, args);
          }, delay);
          _this4._AsyncMixinQueuedTimeouts[id] = q;
          return q;
        };
      };
    },

    deferred: function (fn, delay) {
      var ifn = R.Async.ifMounted(fn);
      if (!delay) {
        return R.Async._deferredImmediate(ifn);
      } else {
        return R.Async._deferredTimeout(ifn, delay);
      }
    },

    deferredAnimationFrame: function (fn) {
      var ifn = R.Async.ifMounted(fn);
      return R.Async._deferredAnimationFrame(ifn);
    } };

  Async.Mixin = {
    _AsyncMixin: true,
    _AsyncMixinHasUnmounted: false,
    _AsyncMixinQueuedTimeouts: null,
    _AsyncMixinQueuedImmediates: null,
    _AsyncMixinQueuedAnimationFrames: null,

    componentWillMountcomponentWillMount: function () {
      this._AsyncMixinQueuedTimeouts = {};
      this._AsyncMixinQueuedImmediates = {};
      this._AsyncMixinQueuedAnimationFrames = {};
    },

    componentWillUnmount: function () {
      _.each(this._AsyncMixinQueuedTimeouts, clearTimeout);
      _.each(this._AsyncMixinQueuedImmediates, clearImmediate);
      _.each(this._AsyncMixinQueuedAnimationFrames, clearAnimationFrame);
      this._AsyncMixinHasUnmounted = true;
    },

    setStateIfMounted: Async.ifMounted(function (state) {
      this.setState(state);
    }) };

  return Async;
};