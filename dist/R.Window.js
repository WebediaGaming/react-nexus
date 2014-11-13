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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLldpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFeEIsTUFBTSxhQUFhLEdBQUc7QUFDbEIsU0FBSyxFQUFFLElBQUk7QUFDWCxVQUFNLEVBQUUsR0FBRztBQUNYLGFBQVMsRUFBRSxDQUFDO0FBQ1osY0FBVSxFQUFFLENBQUMsRUFDaEIsQ0FBQzs7QUFFRixTQUFPLGdCQUEyQztRQUF4QyxTQUFTLFFBQVQsU0FBUztRQUFFLGNBQWMsUUFBZCxjQUFjO1FBQUUsTUFBTSxRQUFOLE1BQU07O0FBQ3pDLFVBQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3RCLEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtLQUFBLENBQzNCLENBQUM7QUFDRixLQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQzs7UUFFNUIsTUFBTSxjQUFTLENBQUM7VUFBaEIsTUFBTSxHQUNDLFNBRFAsTUFBTSxRQUNrQzs7WUFBOUIsSUFBSSxTQUFKLElBQUk7WUFBRSxNQUFNLFNBQU4sTUFBTTtZQUFFLEdBQUcs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QU8sTUFBTSxDQUFDO0dBQ2YsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5XaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgICAgd2lkdGg6IDEyODAsXG4gICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgIHNjcm9sbFRvcDogMCxcbiAgICAgIHNjcm9sbExlZnQ6IDAsXG4gIH07XG5cbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHBhcmFtcyB9KSA9PiB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICApO1xuICAgIF8uZGVmYXVsdHMocGFyYW1zLCBkZWZhdWx0UGFyYW1zKTtcblxuICAgIGNsYXNzIFdpbmRvdyBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHtcbiAgICAgICAgc3VwZXIoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcblxuICAgICAgICBpZih3aW5kb3cpIHtcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvV2luZG93L3Njcm9sbFRvJywgKHsgdG9wLCBsZWZ0IH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IHRvcC5zaG91bGQuYmUuYS5OdW1iZXIgJiYgbGVmdC5zaG91bGQuYmUuYS5OdW1iZXIpO1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHRvcCwgbGVmdCk7XG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy51cGRhdGVTaXplKHsgd2luZG93IH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVNpemUoeyB3aW5kb3cgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICAgIHJldHVybiAnV2luZG93JztcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pIHtcbiAgICAgICAgbGV0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB3aW5kb3cgfHwgcGFyYW1zO1xuICAgICAgICB0aGlzLnN0b3JlLnNldCgnL1dpbmRvdy9zY3JvbGwnLCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9KTtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2l6ZSh7IHdpbmRvdyB9KSB7XG4gICAgICAgIGxldCB7IGhlaWdodCwgd2lkdGggfSA9IHBhcmFtcztcbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IHsgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGggfSA9IHdpbmRvdztcbiAgICAgICAgICBbaGVpZ2h0LCB3aWR0aF0gPSBbaW5uZXJIZWlnaHQsIGlubmVyV2lkdGhdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmUuc2V0KCcvV2luZG93L3NpemUnLCB7IGhlaWdodCwgd2lkdGggfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoV2luZG93LnByb3RvdHlwZSwge1xuICAgICAgc3RvcmU6IG51bGwsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gV2luZG93O1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==