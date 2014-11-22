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

    var _Window = (function (R) {
      var _Window = function _Window(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        var headers = _ref2.headers;
        // jshint unused:false
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments))); // Actually used in super(...arguments)
        this.store = flux.getStore(storeName);

        if (window) {
          (function () {
            var dispatcher = flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/Window/scrollTo", function (_ref3) {
              var top = _ref3.top;
              var left = _ref3.left;
              return Promise["try"](function () {
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

      _extends(_Window, R.App.Plugin);

      _classProps(_Window, null, {
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
              var _ref8 = Array.from(_ref7);

              height = _ref8[0];
              width = _ref8[1];
            }
            this.store.set("/Window/size", { height: height, width: width });
          }
        }
      });

      return _Window;
    })(R);

    _.extend(_Window.prototype, {
      store: null });

    return _Window;
  };
};
//# sourceMappingURL=data:application/json;base64,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QTNCLE9BQU07QUFvQlYsc0JBQWM7O2lCQUFBLFlBQUc7QUFDYixtQkFBTyxRQUFRLENBQUM7V0FDbkI7O0FBRUQsb0JBQVk7O2lCQUFBLGlCQUFhO2dCQUFWLE1BQU0sU0FBTixNQUFNO3dCQUNhLE1BQU0sSUFBSSxNQUFNO2dCQUExQyxTQUFTLFNBQVQsU0FBUztnQkFBRSxVQUFVLFNBQVYsVUFBVTtBQUMzQixnQkFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQyxDQUFDO1dBQzdEOztBQUVELGtCQUFVOztpQkFBQSxpQkFBYTtnQkFBVixNQUFNLFNBQU4sTUFBTTtnQkFDWCxNQUFNLEdBQVksTUFBTSxDQUF4QixNQUFNO2dCQUFFLEtBQUssR0FBSyxNQUFNLENBQWhCLEtBQUs7QUFDbkIsZ0JBQUcsTUFBTSxFQUFFO2tCQUNILFdBQVcsR0FBaUIsTUFBTSxDQUFsQyxXQUFXO2tCQUFFLFVBQVUsR0FBSyxNQUFNLENBQXJCLFVBQVU7MEJBQ1gsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDOzs7QUFBMUMsb0JBQU07QUFBRSxtQkFBSzthQUNmO0FBQ0QsZ0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQUM7V0FDbkQ7Ozs7YUFwQ0csT0FBTTtPQUFTLENBQUM7O0FBdUN0QixLQUFDLENBQUMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxTQUFTLEVBQUU7QUFDekIsV0FBSyxFQUFFLElBQUksRUFDWixDQUFDLENBQUM7O0FBRUgsV0FBTyxPQUFNLENBQUM7R0FDZixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLldpbmRvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XG4gICAgICB3aWR0aDogMTI4MCxcbiAgICAgIGhlaWdodDogNzIwLFxuICAgICAgc2Nyb2xsVG9wOiAwLFxuICAgICAgc2Nyb2xsTGVmdDogMCxcbiAgfTtcblxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgcGFyYW1zIH0pID0+IHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICk7XG4gICAgXy5kZWZhdWx0cyhwYXJhbXMsIGRlZmF1bHRQYXJhbXMpO1xuXG4gICAgY2xhc3MgV2luZG93IGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkgeyAvLyBqc2hpbnQgdW51c2VkOmZhbHNlXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWN0dWFsbHkgdXNlZCBpbiBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgICAgIHRoaXMuc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG5cbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL1dpbmRvdy9zY3JvbGxUbycsICh7IHRvcCwgbGVmdCB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiB0b3Auc2hvdWxkLmJlLmEuTnVtYmVyICYmIGxlZnQuc2hvdWxkLmJlLmEuTnVtYmVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh0b3AsIGxlZnQpO1xuICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB0aGlzLnVwZGF0ZVNjcm9sbCh7IHdpbmRvdyB9KSk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMudXBkYXRlU2l6ZSh7IHdpbmRvdyB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbCh7IHdpbmRvdyB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVTaXplKHsgd2luZG93IH0pO1xuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgICByZXR1cm4gJ1dpbmRvdyc7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVNjcm9sbCh7IHdpbmRvdyB9KSB7XG4gICAgICAgIGxldCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9ID0gd2luZG93IHx8IHBhcmFtcztcbiAgICAgICAgdGhpcy5zdG9yZS5zZXQoJy9XaW5kb3cvc2Nyb2xsJywgeyBzY3JvbGxUb3AsIHNjcm9sbExlZnQgfSk7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVNpemUoeyB3aW5kb3cgfSkge1xuICAgICAgICBsZXQgeyBoZWlnaHQsIHdpZHRoIH0gPSBwYXJhbXM7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIGxldCB7IGlubmVySGVpZ2h0LCBpbm5lcldpZHRoIH0gPSB3aW5kb3c7XG4gICAgICAgICAgW2hlaWdodCwgd2lkdGhdID0gW2lubmVySGVpZ2h0LCBpbm5lcldpZHRoXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JlLnNldCgnL1dpbmRvdy9zaXplJywgeyBoZWlnaHQsIHdpZHRoIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKFdpbmRvdy5wcm90b3R5cGUsIHtcbiAgICAgIHN0b3JlOiBudWxsLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFdpbmRvdztcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=