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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLldpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVkLE1BQU0sYUFBYSxHQUFHO0FBQ2xCLFNBQUssRUFBRSxJQUFJO0FBQ1gsVUFBTSxFQUFFLEdBQUc7QUFDWCxhQUFTLEVBQUUsQ0FBQztBQUNaLGNBQVUsRUFBRSxDQUFDLEVBQ2hCLENBQUM7O0FBRUYsU0FBTyxnQkFBMkM7UUFBeEMsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztRQUFFLE1BQU0sUUFBTixNQUFNOztBQUN6QyxVQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUN0QixLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07S0FBQSxDQUMzQixDQUFDO0FBQ0YsS0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7O1FBRTVCLE1BQU0sY0FBUyxDQUFDO1VBQWhCLE1BQU0sR0FDQyxTQURQLE1BQU0sUUFDa0M7O1lBQTlCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztZQUFFLE9BQU8sU0FBUCxPQUFPOztBQURyQixBQUVq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IlIuV2luZG93LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICB3aWR0aDogMTI4MCxcclxuICAgICAgaGVpZ2h0OiA3MjAsXHJcbiAgICAgIHNjcm9sbFRvcDogMCxcclxuICAgICAgc2Nyb2xsTGVmdDogMCxcclxuICB9O1xyXG5cclxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgcGFyYW1zIH0pID0+IHtcclxuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICApO1xyXG4gICAgXy5kZWZhdWx0cyhwYXJhbXMsIGRlZmF1bHRQYXJhbXMpO1xyXG5cclxuICAgIGNsYXNzIFdpbmRvdyBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XHJcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9XaW5kb3cvc2Nyb2xsVG8nLCAoeyB0b3AsIGxlZnQgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiB0b3Auc2hvdWxkLmJlLmEuTnVtYmVyICYmIGxlZnQuc2hvdWxkLmJlLmEuTnVtYmVyKTtcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHRvcCwgbGVmdCk7XHJcbiAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pKTtcclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnVwZGF0ZVNpemUoeyB3aW5kb3cgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTY3JvbGwoeyB3aW5kb3cgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaXplKHsgd2luZG93IH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICAgIHJldHVybiAnV2luZG93JztcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pIHtcclxuICAgICAgICBsZXQgeyBzY3JvbGxUb3AsIHNjcm9sbExlZnQgfSA9IHdpbmRvdyB8fCBwYXJhbXM7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5zZXQoJy9XaW5kb3cvc2Nyb2xsJywgeyBzY3JvbGxUb3AsIHNjcm9sbExlZnQgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHVwZGF0ZVNpemUoeyB3aW5kb3cgfSkge1xyXG4gICAgICAgIGxldCB7IGhlaWdodCwgd2lkdGggfSA9IHBhcmFtcztcclxuICAgICAgICBpZih3aW5kb3cpIHtcclxuICAgICAgICAgIGxldCB7IGlubmVySGVpZ2h0LCBpbm5lcldpZHRoIH0gPSB3aW5kb3c7XHJcbiAgICAgICAgICBbaGVpZ2h0LCB3aWR0aF0gPSBbaW5uZXJIZWlnaHQsIGlubmVyV2lkdGhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0b3JlLnNldCgnL1dpbmRvdy9zaXplJywgeyBoZWlnaHQsIHdpZHRoIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXy5leHRlbmQoV2luZG93LnByb3RvdHlwZSwge1xyXG4gICAgICBzdG9yZTogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBXaW5kb3c7XHJcbiAgfTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9