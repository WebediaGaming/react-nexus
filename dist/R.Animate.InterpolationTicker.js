"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuQW5pbWF0ZS5JbnRlcnBvbGF0aW9uVGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7TUFFckIsb0JBQW1CO1FBQW5CLG9CQUFtQixHQUNaLFNBRFAsb0JBQW1CLE9BQ2tEOztVQUEzRCxJQUFJLFFBQUosSUFBSTtVQUFFLEVBQUUsUUFBRixFQUFFO1VBQUUsUUFBUSxRQUFSLFFBQVE7VUFBRSxNQUFNLFFBQU4sTUFBTTtVQUFFLE1BQU0sUUFBTixNQUFNO1VBQUUsVUFBVSxRQUFWLFVBQVU7VUFBRSxPQUFPLFFBQVAsT0FBTztBQUNuRSxZQUFNLEdBQUcsTUFBTSxJQUFJLGNBQWMsQ0FBQztBQUNsQyxZQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDMUIsZ0JBQVUsR0FBRyxVQUFVLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsQyxhQUFPLEdBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRTVCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN4QixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN0QixRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUMzQixDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEs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QUNiLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0NBQTRCLEVBQUUsSUFBSTtBQUNsQyxVQUFNLEVBQUUsSUFBSTtBQUNaLFFBQUksRUFBRSxJQUFJO0FBQ1Ysa0JBQWMsRUFBRSxJQUFJLEVBQ3JCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLG9CQUFtQixDQUFDO0NBQzVCLENBQUMiLCJmaWxlIjoiUi5BbmltYXRlLkludGVycG9sYXRpb25UaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHJhZiA9IHJlcXVpcmUoJ3JhZicpO1xyXG5cclxuICBjbGFzcyBJbnRlcnBvbGF0aW9uVGlja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgZnJvbSwgdG8sIGR1cmF0aW9uLCBlYXNpbmcsIG9uVGljaywgb25Db21wbGV0ZSwgb25BYm9ydCB9KSB7XHJcbiAgICAgIGVhc2luZyA9IGVhc2luZyB8fCAnY3ViaWMtaW4tb3V0JztcclxuICAgICAgb25UaWNrID0gb25UaWNrIHx8IF8ubm9vcDtcclxuICAgICAgb25Db21wbGV0ZSA9IG9uQ29tcGxldGUgfHwgXy5ub29wO1xyXG4gICAgICBvbkFib3J0ID0gb25BYm9ydCB8fCBfLm5vb3A7XHJcblxyXG4gICAgICBfLmRldigoKSA9PlxyXG4gICAgICAgIGZyb20uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIHRvLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBkdXJhdGlvbi5zaG91bGQuYmUuYS5OdW1iZXIgJiZcclxuICAgICAgICAoXy5pc1BsYWluT2JqZWN0KGVhc2luZykgfHwgXy5pc1N0cmluZyhlYXNpbmcpKS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICBvblRpY2suc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICBvbkNvbXBsZXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgb25BYm9ydC5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5fZnJvbSA9IGZyb207XHJcbiAgICAgIHRoaXMuX3RvID0gdG87XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9mcm9tKVxyXG4gICAgICAuZm9yRWFjaCgoYXR0cikgPT4gXy5oYXModGhpcy5fdG8sIGF0dHIpID8gdGhpcy5fdG9bYXR0cl0gPSB0aGlzLl9mcm9tW2F0dHJdIDogdm9pZCAwKTtcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fdG8pXHJcbiAgICAgIC5mb3JFYWNoKChhdHRyKSA9PiBfLmhhcyh0aGlzLl9mcm9tLCBhdHRyKSA/IHRoaXMuX2Zyb21bYXR0cl0gPSB0aGlzLl90b1thdHRyXSA6IHZvaWQgMCk7XHJcblxyXG4gICAgICBpZihfLmlzUGxhaW5PYmplY3QoZWFzaW5nKSkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IGVhc2luZy50eXBlLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgZWFzaW5nLnBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLl9lYXNpbmcgPSBSLkFuaW1hdGUuY3JlYXRlRWFzaW5nKGVhc2luZy50eXBlLCBlYXNpbmcucGFyYW1zKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9lYXNpbmcgPSBSLkFuaW1hdGUuY3JlYXRlRWFzaW5nKGVhc2luZyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgdGhpcy5fb25UaWNrID0gb25UaWNrO1xyXG4gICAgICB0aGlzLl9vbkNvbXBsZXRlID0gb25Db21wbGV0ZTtcclxuICAgICAgdGhpcy5fb25BYm9ydCA9IG9uQWJvcnQ7XHJcbiAgICAgIHRoaXMuX2ludGVycG9sYXRvcnMgPSBfLm1hcFZhbHVlcyh0aGlzLl9mcm9tLCAoZnJvbVZhbCwgYXR0cikgPT4gUi5BbmltYXRlLmNyZWF0ZUludGVycG9sYXRvcihmcm9tVmFsLCB0aGlzLl90b1thdHRyXSkpO1xyXG4gICAgICB0aGlzLl90aWNrID0gUi5zY29wZSh0aGlzLl90aWNrLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gKHRoaXMuX2JlZ2luID09PSBudWxsKS5zaG91bGQuYmUub2spO1xyXG4gICAgICB0aGlzLl9iZWdpbiA9IERhdGUubm93KCk7XHJcbiAgICAgIHRoaXMuX2VuZCA9IHRoaXMuX2JlZ2luICsgdGhpcy5fZHVyYXRpb247XHJcbiAgICAgIHRoaXMuX3JlcXVlc3RBbmltYXRpb25GcmFtZUhhbmRsZSA9IHJhZih0aGlzLl90aWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBfdGljaygpIHtcclxuICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgIGlmKG5vdyA+IHRoaXMuX2VuZCkge1xyXG4gICAgICAgIHRoaXMuX29uVGljayh0aGlzLl90bywgMSk7XHJcbiAgICAgICAgdGhpcy5fb25Db21wbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCB0ID0gKG5vdyAtIHRoaXMuX2JlZ2luKS8odGhpcy5fZW5kIC0gdGhpcy5fYmVnaW4pO1xyXG4gICAgICAgIHRoaXMuX29uVGljayhfLm1hcFZhbHVlcyh0aGlzLl9pbnRlcnBvbGF0b3JzLCAoaW50ZXJwb2xhdG9yKSA9PiBpbnRlcnBvbGF0b3IodGhpcy5fZWFzaW5nKHQpKSwgdCkpO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3RBbmltYXRpb25GcmFtZUhhbmRsZSA9IHJhZih0aGlzLl90aWNrKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFib3J0KCkge1xyXG4gICAgICBpZih0aGlzLl9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVIYW5kbGUpIHtcclxuICAgICAgICByYWYuY2FuY2VsKHRoaXMuX3JlcXVlc3RBbmltYXRpb25GcmFtZUhhbmRsZSk7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdEFuaW1hdGlvbkZyYW1lSGFuZGxlID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoSW50ZXJwb2xhdGlvblRpY2tlci5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUi5BbmltYXRlLkludGVycG9sYXRpb25UaWNrZXIucHJvdG90eXBlICovIHtcclxuICAgIF9mcm9tOiBudWxsLFxyXG4gICAgX3RvOiBudWxsLFxyXG4gICAgX2Vhc2luZzogbnVsbCxcclxuICAgIF9kdXJhdGlvbjogbnVsbCxcclxuICAgIF9vblRpY2s6IG51bGwsXHJcbiAgICBfb25Db21wbGV0ZTogbnVsbCxcclxuICAgIF9vbkFib3J0OiBudWxsLFxyXG4gICAgX3JlcXVlc3RBbmltYXRpb25GcmFtZUhhbmRsZTogbnVsbCxcclxuICAgIF9iZWdpbjogbnVsbCxcclxuICAgIF9lbmQ6IG51bGwsXHJcbiAgICBfaW50ZXJwb2xhdG9yczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIEludGVycG9sYXRpb25UaWNrZXI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==