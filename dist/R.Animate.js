"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var d3 = require("d3");
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
      if (_.isClient()) {
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
//# sourceMappingURL=data:application/json;base64,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LElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQzs7QUFFRCxnQkFBWSxFQUFBLFVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN6QixVQUFHLE1BQU0sRUFBRTtBQUNULFlBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQixlQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNoQyxNQUNJO0FBQ0gsZUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RCO0tBQ0Y7O0FBRUQsdUJBQW1CLEVBQW5CLG1CQUFtQjs7QUFFbkIsa0JBQWMsRUFBQSxZQUFHO0FBQ2YsVUFBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDZixZQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO0FBQ3BDLFlBQUksUUFBUSxHQUFHLGdFQUFnRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRyxZQUFJLGFBQWEsR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0QsZUFBTyxTQUFTLElBQUksUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDO09BQ2hELE1BQ0k7QUFDSCxlQUFPLElBQUksQ0FBQztPQUNiO0tBQ0YsRUFDRixDQUFDOztBQUVGLFNBQU8sT0FBTyxDQUFDO0NBQ2hCLENBQUMiLCJmaWxlIjoiUi5BbmltYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XHJcbiAgY29uc3QgSW50ZXJwb2xhdGlvblRpY2tlciA9IHJlcXVpcmUoJy4vUi5BbmltYXRlLkludGVycG9sYXRpb25UaWNrZXInKShSKTtcclxuXHJcbiAgY29uc3QgQW5pbWF0ZSA9IHtcclxuICAgIE1peGluOiB7XHJcbiAgICAgIF9BbmltYXRlTWl4aW46IHRydWUsXHJcbiAgICAgIF9BbmltYXRlTWl4aW5JbnRlcnBvbGF0aW9uVGlja2VyczogbnVsbCxcclxuXHJcbiAgICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICB0aGlzLl9BbmltYXRlTWl4aW5JbnRlcnBvbGF0aW9uVGlja2VycyA9IHt9O1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fQW5pbWF0ZU1peGluSW50ZXJwb2xhdGlvblRpY2tlcnMpXHJcbiAgICAgICAgLmZvckVhY2goKG5hbWUpID0+IHRoaXMuX0FuaW1hdGVNaXhpbkludGVycG9sYXRpb25UaWNrZXJzW25hbWVdLmFib3J0KCkpO1xyXG4gICAgICAgIHRoaXMuX0FuaW1hdGVNaXhpbkludGVycG9sYXRpb25UaWNrZXJzID0gbnVsbDtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGlzQW5pbWF0aW5nKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fQW5pbWF0ZU1peGluSW50ZXJwb2xhdGlvblRpY2tlcnNbbmFtZV07XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfQW5pbWF0ZU1peGluR2V0U3RhdGVLZXkobmFtZSkge1xyXG4gICAgICAgIHJldHVybiAnX0FuaW1hdGVNaXhpblN0eWxlLScgKyBuYW1lO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0QW5pbWF0ZWRTdHlsZShuYW1lKSB7XHJcbiAgICAgICAgaWYodGhpcy5pc0FuaW1hdGluZyhuYW1lKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVbdGhpcy5fQW5pbWF0ZU1peGluR2V0U3RhdGVLZXkobmFtZSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IGNvbnNvbGUud2FybignUi5BbmltYXRlLk1peGluLmdldEFuaW1hdGVkU3R5bGUoLi4uKTogbm8gc3VjaCBhbmltYXRpb24uJykpO1xyXG4gICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFib3J0QW5pbWF0aW9uKG5hbWUpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLmlzQW5pbWF0aW5nKG5hbWUpLnNob3VsZC5iZS5vayk7XHJcbiAgICAgICAgaWYodGhpcy5pc0FuaW1hdGluZyhuYW1lKSkge1xyXG4gICAgICAgICAgdGhpcy5fQW5pbWF0ZU1peGluSW50ZXJwb2xhdGlvblRpY2tlcnNbbmFtZV0uYWJvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhbmltYXRlKG5hbWUsIHBhcmFtcykge1xyXG4gICAgICAgIGlmKHRoaXMuaXNBbmltYXRpbmcobmFtZSkpIHtcclxuICAgICAgICAgIHRoaXMuYWJvcnRBbmltYXRpb24obmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwYXJhbXMgPSBfLmV4dGVuZCh7fSwgcGFyYW1zLCB7XHJcbiAgICAgICAgICBvblRpY2s6IF8ubm9vcCxcclxuICAgICAgICAgIG9uQ29tcGxldGU6IF8ubm9vcCxcclxuICAgICAgICAgIG9uQWJvcnQ6IF8ubm9vcCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IG9yaWdpbmFsID0ge1xyXG4gICAgICAgICAgb25UaWNrOiBwYXJhbXMub25UaWNrLFxyXG4gICAgICAgICAgb25Db21wbGV0ZTogcGFyYW1zLm9uQ29tcGxldGUsXHJcbiAgICAgICAgICBvbkFib3J0OiBwYXJhbXMub25BYm9ydCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwYXJhbXMub25UaWNrID0gKGFuaW1hdGVkU3R5bGUsIHQpID0+IHtcclxuICAgICAgICAgIG9yaWdpbmFsLm9uVGljayhhbmltYXRlZFN0eWxlLCB0KTtcclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGVJZk1vdW50ZWQoeyBbdGhpcy5fQW5pbWF0ZU1peGluR2V0U3RhdGVLZXkobmFtZSldOiBhbmltYXRlZFN0eWxlIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHBhcmFtcy5vbkNvbXBsZXRlID0gKGFuaW1hdGVkU3R5bGUsIHQpID0+IHtcclxuICAgICAgICAgIG9yaWdpbmFsLm9uQ29tcGxldGUoYW5pbWF0ZWRTdHlsZSwgdCk7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fQW5pbWF0ZU1peGluSW50ZXJwb2xhdGlvblRpY2tlcnNbbmFtZV07XHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlSWZNb3VudGVkKHsgW3RoaXMuX0FuaW1hdGVNaXhpbkdldFN0YXRlS2V5KG5hbWUpXTogdm9pZCAwIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHBhcmFtcy5vbkFib3J0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgb3JpZ2luYWwub25BYm9ydCgpO1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX0FuaW1hdGVNaXhpbkludGVycG9sYXRpb25UaWNrZXJzW25hbWVdO1xyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZUlmTW91bnRlZCh7IFt0aGlzLl9BbmltYXRlTWl4aW5HZXRTdGF0ZUtleShuYW1lKV06IHZvaWQgMCB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgaW50ZXJwb2xhdGlvblRpY2tlciA9IG5ldyBSLkFuaW1hdGUuSW50ZXJwb2xhdGlvblRpY2tlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMuX0FuaW1hdGVNaXhpbkludGVycG9sYXRpb25UaWNrZXJzW25hbWVdID0gaW50ZXJwb2xhdGlvblRpY2tlcjtcclxuICAgICAgICBpbnRlcnBvbGF0aW9uVGlja2VyLnN0YXJ0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGNyZWF0ZUludGVycG9sYXRvcihmcm9tLCB0bykge1xyXG4gICAgICByZXR1cm4gZDMuaW50ZXJwb2xhdGUoZnJvbSwgdG8pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVFYXNpbmcodHlwZSwgcGFyYW1zKSB7XHJcbiAgICAgIGlmKHBhcmFtcykge1xyXG4gICAgICAgIGxldCBhcmdzID0gXy5jbG9uZShwYXJhbXMpO1xyXG4gICAgICAgIGFyZ3MudW5zaGlmdCh0eXBlKTtcclxuICAgICAgICByZXR1cm4gZDMuZWFzZS5hcHBseShkMywgYXJncyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLmVhc2UodHlwZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgSW50ZXJwb2xhdGlvblRpY2tlcixcclxuXHJcbiAgICBzaG91bGRFbmFibGVIQSgpIHtcclxuICAgICAgaWYoXy5pc0NsaWVudCgpKSB7XHJcbiAgICAgICAgbGV0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XHJcbiAgICAgICAgbGV0IGlzTW9iaWxlID0gL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KHVzZXJBZ2VudCk7XHJcbiAgICAgICAgbGV0IGlzR2luZ2VyYnJlYWQgPSAvQW5kcm9pZCAyXFwuM1xcLlszLTddL2kudGVzdCh1c2VyQWdlbnQpO1xyXG4gICAgICAgIHJldHVybiB1c2VyQWdlbnQgJiYgaXNNb2JpbGUgJiYgIWlzR2luZ2VyYnJlYWQ7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEFuaW1hdGU7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==