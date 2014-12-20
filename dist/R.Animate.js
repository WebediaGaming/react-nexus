"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var d3 = require("tween-interpolate");
  var InterpolationTicker = require("./R.Animate.InterpolationTicker")(R);

  var Animate = {
    Mixin: {
      _AnimateMixin: true,
      _AnimateMixinInterpolationTickers: null,

      componentWillMount: function () {
        this._AnimateMixinInterpolationTickers = {};
      },

      componentWillUnmount: function () {
        var _this = this;
        Object.keys(this._AnimateMixinInterpolationTickers).forEach(function (name) {
          return _this._AnimateMixinInterpolationTickers[name].abort();
        });
        this._AnimateMixinInterpolationTickers = null;
      },

      isAnimating: function (name) {
        return this._AnimateMixinInterpolationTickers[name];
      },

      _AnimateMixinGetStateKey: function (name) {
        return "_AnimateMixinStyle-" + name;
      },

      getAnimatedStyle: function (name) {
        if (this.isAnimating(name)) {
          return this.state[this._AnimateMixinGetStateKey(name)];
        } else {
          _.dev(function () {
            return console.warn("R.Animate.Mixin.getAnimatedStyle(...): no such animation.");
          });
          return {};
        }
      },

      abortAnimation: function (name) {
        var _this2 = this;
        _.dev(function () {
          return _this2.isAnimating(name).should.be.ok;
        });
        if (this.isAnimating(name)) {
          this._AnimateMixinInterpolationTickers[name].abort();
        }
      },

      animate: function (name, params) {
        var _this3 = this;
        if (this.isAnimating(name)) {
          this.abortAnimation(name);
        }

        params = _.extend({}, params, {
          onTick: _.noop,
          onComplete: _.noop,
          onAbort: _.noop });

        var original = {
          onTick: params.onTick,
          onComplete: params.onComplete,
          onAbort: params.onAbort };

        params.onTick = function (animatedStyle, t) {
          original.onTick(animatedStyle, t);
          _this3.setStateIfMounted((function (_ref) {
            _ref[_this3._AnimateMixinGetStateKey(name)] = animatedStyle;
            return _ref;
          })({}));
        };

        params.onComplete = function (animatedStyle, t) {
          original.onComplete(animatedStyle, t);
          delete _this3._AnimateMixinInterpolationTickers[name];
          _this3.setStateIfMounted((function (_ref2) {
            _ref2[_this3._AnimateMixinGetStateKey(name)] = void 0;
            return _ref2;
          })({}));
        };

        params.onAbort = function () {
          original.onAbort();
          delete _this3._AnimateMixinInterpolationTickers[name];
          _this3.setStateIfMounted((function (_ref3) {
            _ref3[_this3._AnimateMixinGetStateKey(name)] = void 0;
            return _ref3;
          })({}));
        };

        var interpolationTicker = new R.Animate.InterpolationTicker(params);
        this._AnimateMixinInterpolationTickers[name] = interpolationTicker;
        interpolationTicker.start();
      } },

    createInterpolator: function (from, to) {
      return d3.interpolate(from, to);
    },

    createEasing: function (type, params) {
      if (params) {
        var args = _.clone(params);
        args.unshift(type);
        return d3.ease.apply(d3, args);
      } else {
        return d3.ease(type);
      }
    },

    InterpolationTicker: InterpolationTicker,

    shouldEnableHA: function () {
      if ((__BROWSER__)) {
        var userAgent = navigator.userAgent;
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        var isGingerbread = /Android 2\.3\.[3-7]/i.test(userAgent);
        return userAgent && isMobile && !isGingerbread;
      } else {
        return true;
      }
    } };

  return Animate;
};