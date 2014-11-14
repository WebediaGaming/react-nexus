"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;
  var raf = require("raf");

  var InterpolationTicker = (function () {
    var InterpolationTicker = function InterpolationTicker() {
      var _this = this;
      _.dev(function () {
        return params.should.be.an.Object;
      });
      _.defaults(params, {
        easing: "cubic-in-out",
        onTick: _.noop,
        onComplete: _.noop,
        onAbort: _.noop });

      _.dev(function () {
        return params.from.should.be.an.Object && params.to.should.be.an.Object && params.duration.should.be.a.Number && (_.isPlainObject(params.easing) || _.isString(params.easing)).should.be.ok && params.onTick.should.be.a.Function && params.onComplete.should.be.a.Function && params.onAbort.should.be.a.Function;
      });

      this._from = params.from;
      this._to = params.to;

      Object.keys(this._from).forEach(function (attr) {
        return _.has(_this._to, attr) ? _this._to[attr] = _this._from[attr] : void 0;
      });
      Object.keys(this._to).forEach(function (attr) {
        return _.has(_this._from, attr) ? _this._from[attr] = _this._to[attr] : void 0;
      });

      if (_.isPlainObject(params.easing)) {
        _.dev(function () {
          return params.easing.type.should.be.a.String && params.easing.params.should.be.an.Object;
        });
        this._easing = R.Animate.createEasing(params.easing.type, params.easing.params);
      } else {
        this._easing = R.Animate.createEasing(params.easing);
      }
      this._duration = params.duration;
      this._onTick = params.onTick;
      this._onComplete = params.onComplete;
      this._onAbort = params.onAbort;
      this._interpolators = _.mapValues(this._from, function (fromVal, attr) {
        return R.Animate.createInterpolator(fromVal, _this._to[attr]);
      });
      this._tick = R.scope(this._tick, this);
    };

    _classProps(InterpolationTicker, null, {
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
            this._onTick(this._to, t);
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

    return InterpolationTicker;
  })();

  _.extend(InterpolationTicker.prototype, /** @lends R.Animate.InterpolationTicker.prototype */{
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

  return InterpolationTicker;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5BbmltYXRlLkludGVycG9sYXRpb25UaWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O01BRXJCLG1CQUFtQjtRQUFuQixtQkFBbUIsR0FDWixTQURQLG1CQUFtQixHQUNUOztBQUNaLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQUMsQ0FBQztBQUN4QyxPQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNqQixjQUFNLEVBQUUsY0FBYztBQUN0QixjQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUk7QUFDZCxrQkFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJO0FBQ2xCLGVBQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUNoQixDQUFDLENBQUM7O0FBRUgsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2xDLENBQUMsQ0FBQyxDQUFD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QUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUM7V0FDMUM7U0FDRjs7OztXQXRFRyxtQkFBbUI7OztBQXlFekIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLHVEQUF3RDtBQUM1RixTQUFLLEVBQUUsSUFBSTtBQUNYLE9BQUcsRUFBRSxJQUFJO0FBQ1QsV0FBTyxFQUFFLElBQUk7QUFDYixhQUFTLEVBQUUsSUFBSTtBQUNmLFdBQU8sRUFBRSxJQUFJO0FBQ2IsZUFBVyxFQUFFLElBQUk7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxnQ0FBNEIsRUFBRSxJQUFJO0FBQ2xDLFVBQU0sRUFBRSxJQUFJO0FBQ1osUUFBSSxFQUFFLElBQUk7QUFDVixrQkFBYyxFQUFFLElBQUksRUFDckIsQ0FBQyxDQUFDOztBQUVILFNBQU8sbUJBQW1CLENBQUM7Q0FDNUIsQ0FBQyIsImZpbGUiOiJSLkFuaW1hdGUuSW50ZXJwb2xhdGlvblRpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuICBjb25zdCByYWYgPSByZXF1aXJlKCdyYWYnKTtcclxuXHJcbiAgY2xhc3MgSW50ZXJwb2xhdGlvblRpY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICBfLmRlZmF1bHRzKHBhcmFtcywge1xyXG4gICAgICAgIGVhc2luZzogJ2N1YmljLWluLW91dCcsXHJcbiAgICAgICAgb25UaWNrOiBfLm5vb3AsXHJcbiAgICAgICAgb25Db21wbGV0ZTogXy5ub29wLFxyXG4gICAgICAgIG9uQWJvcnQ6IF8ubm9vcCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBfLmRldigoKSA9PlxyXG4gICAgICAgIHBhcmFtcy5mcm9tLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBwYXJhbXMudG8uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIHBhcmFtcy5kdXJhdGlvbi5zaG91bGQuYmUuYS5OdW1iZXIgJiZcclxuICAgICAgICAoXy5pc1BsYWluT2JqZWN0KHBhcmFtcy5lYXNpbmcpIHx8IF8uaXNTdHJpbmcocGFyYW1zLmVhc2luZykpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIHBhcmFtcy5vblRpY2suc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICBwYXJhbXMub25Db21wbGV0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHBhcmFtcy5vbkFib3J0LnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB0aGlzLl9mcm9tID0gcGFyYW1zLmZyb207XHJcbiAgICAgIHRoaXMuX3RvID0gcGFyYW1zLnRvO1xyXG5cclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fZnJvbSlcclxuICAgICAgLmZvckVhY2goKGF0dHIpID0+IF8uaGFzKHRoaXMuX3RvLCBhdHRyKSA/IHRoaXMuX3RvW2F0dHJdID0gdGhpcy5fZnJvbVthdHRyXSA6IHZvaWQgMCk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3RvKVxyXG4gICAgICAuZm9yRWFjaCgoYXR0cikgPT4gXy5oYXModGhpcy5fZnJvbSwgYXR0cikgPyB0aGlzLl9mcm9tW2F0dHJdID0gdGhpcy5fdG9bYXR0cl0gOiB2b2lkIDApO1xyXG5cclxuICAgICAgaWYoXy5pc1BsYWluT2JqZWN0KHBhcmFtcy5lYXNpbmcpKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLmVhc2luZy50eXBlLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgcGFyYW1zLmVhc2luZy5wYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5fZWFzaW5nID0gUi5BbmltYXRlLmNyZWF0ZUVhc2luZyhwYXJhbXMuZWFzaW5nLnR5cGUsIHBhcmFtcy5lYXNpbmcucGFyYW1zKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9lYXNpbmcgPSBSLkFuaW1hdGUuY3JlYXRlRWFzaW5nKHBhcmFtcy5lYXNpbmcpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyYW1zLmR1cmF0aW9uO1xyXG4gICAgICB0aGlzLl9vblRpY2sgPSBwYXJhbXMub25UaWNrO1xyXG4gICAgICB0aGlzLl9vbkNvbXBsZXRlID0gcGFyYW1zLm9uQ29tcGxldGU7XHJcbiAgICAgIHRoaXMuX29uQWJvcnQgPSBwYXJhbXMub25BYm9ydDtcclxuICAgICAgdGhpcy5faW50ZXJwb2xhdG9ycyA9IF8ubWFwVmFsdWVzKHRoaXMuX2Zyb20sIChmcm9tVmFsLCBhdHRyKSA9PiBSLkFuaW1hdGUuY3JlYXRlSW50ZXJwb2xhdG9yKGZyb21WYWwsIHRoaXMuX3RvW2F0dHJdKSk7XHJcbiAgICAgIHRoaXMuX3RpY2sgPSBSLnNjb3BlKHRoaXMuX3RpY2ssIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICBfLmRldigoKSA9PiAodGhpcy5fYmVnaW4gPT09IG51bGwpLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIHRoaXMuX2JlZ2luID0gRGF0ZS5ub3coKTtcclxuICAgICAgdGhpcy5fZW5kID0gdGhpcy5fYmVnaW4gKyB0aGlzLl9kdXJhdGlvbjtcclxuICAgICAgdGhpcy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lSGFuZGxlID0gcmFmKHRoaXMuX3RpY2spO1xyXG4gICAgfVxyXG5cclxuICAgIF90aWNrKCkge1xyXG4gICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgaWYobm93ID4gdGhpcy5fZW5kKSB7XHJcbiAgICAgICAgdGhpcy5fb25UaWNrKHRoaXMuX3RvLCB0KTtcclxuICAgICAgICB0aGlzLl9vbkNvbXBsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHQgPSAobm93IC0gdGhpcy5fYmVnaW4pLyh0aGlzLl9lbmQgLSB0aGlzLl9iZWdpbik7XHJcbiAgICAgICAgdGhpcy5fb25UaWNrKF8ubWFwVmFsdWVzKHRoaXMuX2ludGVycG9sYXRvcnMsIChpbnRlcnBvbGF0b3IpID0+IGludGVycG9sYXRvcih0aGlzLl9lYXNpbmcodCkpLCB0KSk7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lSGFuZGxlID0gcmFmKHRoaXMuX3RpY2spO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWJvcnQoKSB7XHJcbiAgICAgIGlmKHRoaXMuX3JlcXVlc3RBbmltYXRpb25GcmFtZUhhbmRsZSkge1xyXG4gICAgICAgIHJhZi5jYW5jZWwodGhpcy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lSGFuZGxlKTtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVIYW5kbGUgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChJbnRlcnBvbGF0aW9uVGlja2VyLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBSLkFuaW1hdGUuSW50ZXJwb2xhdGlvblRpY2tlci5wcm90b3R5cGUgKi8ge1xyXG4gICAgX2Zyb206IG51bGwsXHJcbiAgICBfdG86IG51bGwsXHJcbiAgICBfZWFzaW5nOiBudWxsLFxyXG4gICAgX2R1cmF0aW9uOiBudWxsLFxyXG4gICAgX29uVGljazogbnVsbCxcclxuICAgIF9vbkNvbXBsZXRlOiBudWxsLFxyXG4gICAgX29uQWJvcnQ6IG51bGwsXHJcbiAgICBfcmVxdWVzdEFuaW1hdGlvbkZyYW1lSGFuZGxlOiBudWxsLFxyXG4gICAgX2JlZ2luOiBudWxsLFxyXG4gICAgX2VuZDogbnVsbCxcclxuICAgIF9pbnRlcnBvbGF0b3JzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gSW50ZXJwb2xhdGlvblRpY2tlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9