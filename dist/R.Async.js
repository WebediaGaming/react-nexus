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
      var _this = this;
      return function () {
        var args = _slice.call(arguments);

        _.dev(function () {
          return (_this._AsyncMixin !== void 0).should.be.ok && _this._AsyncMixin.should.be.ok;
        });
        if (!_this._AsyncMixinHasUnmounted) {
          return fn.call.apply(fn, [_this].concat(_toArray(args)));
        }
      };
    },

    _deferredImmediate: function (fn) {
      var _this2 = this;
      return function () {
        var args = _slice.call(arguments);

        var id = _.uniqueId("setImmediate");
        var q = setImmediate(function () {
          delete _this2._AsyncMixinQueuedImmediates[id];
          return fn.call.apply(fn, [_this2].concat(_toArray(args)));
        });
        _this2._AsyncMixinQueuedImmediates[id] = q;
        return id;
      };
    },

    _deferredAnimationFrame: function (fn) {
      var _this3 = this;
      return function () {
        var args = _slice.call(arguments);

        var id = _.uniqueId("setImmediate");
        var q = requestAnimationFrame(function () {
          delete _this3._AsyncMixinQueuedAnimationFrames[id];
          return fn.call.apply(fn, [_this3].concat(_toArray(args)));
        });
        _this3._AsyncMixinQueuedAnimationFrames[id] = q;
        return id;
      };
    },

    _deferredTimeout: function (delay) {
      var _this4 = this;
      return function (fn) {
        return function () {
          var args = _slice.call(arguments);

          var id = _.uniqueId("setTimeout");
          var q = setTimeout(function () {
            delete _this4._AsyncMixinQueuedTimeouts[id];
            return fn.call.apply(fn, [_this4].concat(_toArray(args)));
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