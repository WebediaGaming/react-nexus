"use strict";

var _slice = Array.prototype.slice;
var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var requestAnimationFrame = require("raf");

  require("setimmediate");

  function clearAnimationFrame(handle) {
    requestAnimationFrame.cancel(handle);
  }

  var Async = {
    ifMounted: function (fn) {
      return function () {
        var _this = this;
        var args = _slice.call(arguments);

        _.dev(function () {
          return (_this._AsyncMixin !== void 0).should.be.ok && _this._AsyncMixin.should.be.ok;
        });
        if (!this._AsyncMixinHasUnmounted) {
          return fn.call.apply(fn, [this].concat(_toArray(args)));
        }
      };
    },

    _deferredImmediate: function (fn) {
      return function () {
        var _this2 = this;
        var args = _slice.call(arguments);

        var id = _.uniqueId("setImmediate");
        var q = setImmediate(function () {
          delete _this2._AsyncMixinQueuedImmediates[id];
          return fn.call.apply(fn, [_this2].concat(_toArray(args)));
        });
        this._AsyncMixinQueuedImmediates[id] = q;
        return id;
      };
    },

    _deferredAnimationFrame: function (fn) {
      return function () {
        var _this3 = this;
        var args = _slice.call(arguments);

        var id = _.uniqueId("setImmediate");
        var q = requestAnimationFrame(function () {
          delete _this3._AsyncMixinQueuedAnimationFrames[id];
          return fn.call.apply(fn, [_this3].concat(_toArray(args)));
        });
        this._AsyncMixinQueuedAnimationFrames[id] = q;
        return id;
      };
    },

    _deferredTimeout: function (delay) {
      return function (fn) {
        return function () {
          var _this4 = this;
          var args = _slice.call(arguments);

          var id = _.uniqueId("setTimeout");
          var q = setTimeout(function () {
            delete _this4._AsyncMixinQueuedTimeouts[id];
            return fn.call.apply(fn, [_this4].concat(_toArray(args)));
          }, delay);
          this._AsyncMixinQueuedTimeouts[id] = q;
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