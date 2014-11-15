"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

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

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;

  var defaultParams = {
    width: 1280,
    height: 720,
    scrollTop: 0,
    scrollLeft: 0 };

  return function (_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;
    var params = _ref.params;
    params = params || {};
    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String && params.should.be.an.Object;
    });
    _.defaults(params, defaultParams);

    var Window = (function (R) {
      var Window = function Window(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        var headers = _ref2.headers;
        R.App.Plugin.call(this, { flux: flux, window: window, req: req, headers: headers });
        this.store = flux.getStore(storeName);

        if (window) {
          (function () {
            var dispatcher = flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/Window/scrollTo", function (_ref3) {
              var top = _ref3.top;
              var left = _ref3.left;
              return Promise.try(function () {
                _.dev(function () {
                  return top.should.be.a.Number && left.should.be.a.Number;
                });
                window.scrollTo(top, left);
              });
            });

            window.addEventListener("scroll", function () {
              return _this.updateScroll({ window: window });
            });
            window.addEventListener("resize", function () {
              return _this.updateSize({ window: window });
            });
          })();
        }

        this.updateScroll({ window: window });
        this.updateSize({ window: window });
      };

      _extends(Window, R.App.Plugin);

      _classProps(Window, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Window";
          }
        },
        updateScroll: {
          writable: true,
          value: function (_ref4) {
            var window = _ref4.window;
            var _ref5 = window || params;
            var scrollTop = _ref5.scrollTop;
            var scrollLeft = _ref5.scrollLeft;
            this.store.set("/Window/scroll", { scrollTop: scrollTop, scrollLeft: scrollLeft });
          }
        },
        updateSize: {
          writable: true,
          value: function (_ref6) {
            var window = _ref6.window;
            var height = params.height;
            var width = params.width;
            if (window) {
              var innerHeight = window.innerHeight;
              var innerWidth = window.innerWidth;
              var _ref7 = [innerHeight, innerWidth];
              height = _ref7[0];
              width = _ref7[1];
            }
            this.store.set("/Window/size", { height: height, width: width });
          }
        }
      });

      return Window;
    })(R);

    _.extend(Window.prototype, {
      store: null });

    return Window;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLldpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztBQUV4QixNQUFNLGFBQWEsR0FBRztBQUNsQixTQUFLLEVBQUUsSUFBSTtBQUNYLFVBQU0sRUFBRSxHQUFHO0FBQ1gsYUFBUyxFQUFFLENBQUM7QUFDWixjQUFVLEVBQUUsQ0FBQyxFQUNoQixDQUFDOztBQUVGLFNBQU8sZ0JBQTJDO1FBQXhDLFNBQVMsUUFBVCxTQUFTO1FBQUUsY0FBYyxRQUFkLGNBQWM7UUFBRSxNQUFNLFFBQU4sTUFBTTtBQUN6QyxVQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUN0QixLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07S0FBQSxDQUMzQixDQUFDO0FBQ0YsS0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7O1FBRTVCLE1BQU0sY0FBUyxDQUFDO1VBQWhCLE1BQU0sR0FDQyxTQURQLE1BQU0sUUFDa0M7O1lBQTlCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztZ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ZixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLldpbmRvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcclxuICAgICAgd2lkdGg6IDEyODAsXHJcbiAgICAgIGhlaWdodDogNzIwLFxyXG4gICAgICBzY3JvbGxUb3A6IDAsXHJcbiAgICAgIHNjcm9sbExlZnQ6IDAsXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHBhcmFtcyB9KSA9PiB7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxyXG4gICAgKTtcclxuICAgIF8uZGVmYXVsdHMocGFyYW1zLCBkZWZhdWx0UGFyYW1zKTtcclxuXHJcbiAgICBjbGFzcyBXaW5kb3cgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xyXG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHtcclxuICAgICAgICBzdXBlcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pO1xyXG4gICAgICAgIHRoaXMuc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmKHdpbmRvdykge1xyXG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xyXG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvV2luZG93L3Njcm9sbFRvJywgKHsgdG9wLCBsZWZ0IH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gdG9wLnNob3VsZC5iZS5hLk51bWJlciAmJiBsZWZ0LnNob3VsZC5iZS5hLk51bWJlcik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0b3AsIGxlZnQpO1xyXG4gICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB0aGlzLnVwZGF0ZVNjcm9sbCh7IHdpbmRvdyB9KSk7XHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy51cGRhdGVTaXplKHsgd2luZG93IH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2l6ZSh7IHdpbmRvdyB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ1dpbmRvdyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHVwZGF0ZVNjcm9sbCh7IHdpbmRvdyB9KSB7XHJcbiAgICAgICAgbGV0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB3aW5kb3cgfHwgcGFyYW1zO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuc2V0KCcvV2luZG93L3Njcm9sbCcsIHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB1cGRhdGVTaXplKHsgd2luZG93IH0pIHtcclxuICAgICAgICBsZXQgeyBoZWlnaHQsIHdpZHRoIH0gPSBwYXJhbXM7XHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICBsZXQgeyBpbm5lckhlaWdodCwgaW5uZXJXaWR0aCB9ID0gd2luZG93O1xyXG4gICAgICAgICAgW2hlaWdodCwgd2lkdGhdID0gW2lubmVySGVpZ2h0LCBpbm5lcldpZHRoXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdG9yZS5zZXQoJy9XaW5kb3cvc2l6ZScsIHsgaGVpZ2h0LCB3aWR0aCB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF8uZXh0ZW5kKFdpbmRvdy5wcm90b3R5cGUsIHtcclxuICAgICAgc3RvcmU6IG51bGwsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gV2luZG93O1xyXG4gIH07XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==