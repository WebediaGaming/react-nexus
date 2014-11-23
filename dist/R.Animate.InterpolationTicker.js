"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var raf = require("raf");

  var _InterpolationTicker = (function () {
    var _InterpolationTicker = function _InterpolationTicker(_ref) {
      var _this = this;
      var from = _ref.from;
      var to = _ref.to;
      var duration = _ref.duration;
      var easing = _ref.easing;
      var onTick = _ref.onTick;
      var onComplete = _ref.onComplete;
      var onAbort = _ref.onAbort;
      easing = easing || "cubic-in-out";
      onTick = onTick || _.noop;
      onComplete = onComplete || _.noop;
      onAbort = onAbort || _.noop;

      _.dev(function () {
        return from.should.be.an.Object && to.should.be.an.Object && duration.should.be.a.Number && (_.isPlainObject(easing) || _.isString(easing)).should.be.ok && onTick.should.be.a.Function && onComplete.should.be.a.Function && onAbort.should.be.a.Function;
      });

      this._from = from;
      this._to = to;

      Object.keys(this._from).forEach(function (attr) {
        return _.has(_this._to, attr) ? _this._to[attr] = _this._from[attr] : void 0;
      });
      Object.keys(this._to).forEach(function (attr) {
        return _.has(_this._from, attr) ? _this._from[attr] = _this._to[attr] : void 0;
      });

      if (_.isPlainObject(easing)) {
        _.dev(function () {
          return easing.type.should.be.a.String && easing.params.should.be.an.Object;
        });
        this._easing = R.Animate.createEasing(easing.type, easing.params);
      } else {
        this._easing = R.Animate.createEasing(easing);
      }
      this._duration = duration;
      this._onTick = onTick;
      this._onComplete = onComplete;
      this._onAbort = onAbort;
      this._interpolators = _.mapValues(this._from, function (fromVal, attr) {
        return R.Animate.createInterpolator(fromVal, _this._to[attr]);
      });
      this._tick = R.scope(this._tick, this);
    };

    _classProps(_InterpolationTicker, null, {
      start: {
        writable: true,
        value: function () {
          var _this2 = this;
          _.dev(function () {
            return (_this2._begin === null).should.be.ok;
          });
          this._begin = Date.now();
          this._end = this._begin + this._duration;
          this._requestAnimationFrameHandle = raf(this._tick);
        }
      },
      _tick: {
        writable: true,
        value: function () {
          var _this3 = this;
          var now = Date.now();
          if (now > this._end) {
            this._onTick(this._to, 1);
            this._onComplete();
          } else {
            (function () {
              var t = (now - _this3._begin) / (_this3._end - _this3._begin);
              _this3._onTick(_.mapValues(_this3._interpolators, function (interpolator) {
                return interpolator(_this3._easing(t));
              }, t));
              _this3._requestAnimationFrameHandle = raf(_this3._tick);
            })();
          }
        }
      },
      abort: {
        writable: true,
        value: function () {
          if (this._requestAnimationFrameHandle) {
            raf.cancel(this._requestAnimationFrameHandle);
            this._requestAnimationFrameHandle = null;
          }
        }
      }
    });

    return _InterpolationTicker;
  })();

  _.extend(_InterpolationTicker.prototype, /** @lends R.Animate.InterpolationTicker.prototype */{
    _from: null,
    _to: null,
    _easing: null,
    _duration: null,
    _onTick: null,
    _onComplete: null,
    _onAbort: null,
    _requestAnimationFrameHandle: null,
    _begin: null,
    _end: null,
    _interpolators: null });

  return _InterpolationTicker;
};