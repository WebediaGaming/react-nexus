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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLldpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWQsTUFBTSxhQUFhLEdBQUc7QUFDbEIsU0FBSyxFQUFFLElBQUk7QUFDWCxVQUFNLEVBQUUsR0FBRztBQUNYLGFBQVMsRUFBRSxDQUFDO0FBQ1osY0FBVSxFQUFFLENBQUMsRUFDaEIsQ0FBQzs7QUFFRixTQUFPLGdCQUEyQztRQUF4QyxTQUFTLFFBQVQsU0FBUztRQUFFLGNBQWMsUUFBZCxjQUFjO1FBQUUsTUFBTSxRQUFOLE1BQU07QUFDekMsVUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDdEIsS0FBQyxDQUFDLEdBQUcsQ0FBQzthQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO0tBQUEsQ0FDM0IsQ0FBQztBQUNGLEtBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztRQUU1QixNQUFNLGNBQVMsQ0FBQztVQUFoQixNQUFNLEdBQ0MsU0FEUCxNQUFNLFFBQ2tDOztZQUE5QixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7WUFBRSxPQUFPLFNBQVAsT0FBTztBQURyQixBQUVqQixTQUZrQixDQUFD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c0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgICAgd2lkdGg6IDEyODAsXG4gICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgIHNjcm9sbFRvcDogMCxcbiAgICAgIHNjcm9sbExlZnQ6IDAsXG4gIH07XG5cbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHBhcmFtcyB9KSA9PiB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICApO1xuICAgIF8uZGVmYXVsdHMocGFyYW1zLCBkZWZhdWx0UGFyYW1zKTtcblxuICAgIGNsYXNzIFdpbmRvdyBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHtcbiAgICAgICAgc3VwZXIoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcblxuICAgICAgICBpZih3aW5kb3cpIHtcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvV2luZG93L3Njcm9sbFRvJywgKHsgdG9wLCBsZWZ0IH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IHRvcC5zaG91bGQuYmUuYS5OdW1iZXIgJiYgbGVmdC5zaG91bGQuYmUuYS5OdW1iZXIpO1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHRvcCwgbGVmdCk7XG4gICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy51cGRhdGVTaXplKHsgd2luZG93IH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVNpemUoeyB3aW5kb3cgfSk7XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICAgIHJldHVybiAnV2luZG93JztcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pIHtcbiAgICAgICAgbGV0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB3aW5kb3cgfHwgcGFyYW1zO1xuICAgICAgICB0aGlzLnN0b3JlLnNldCgnL1dpbmRvdy9zY3JvbGwnLCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9KTtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2l6ZSh7IHdpbmRvdyB9KSB7XG4gICAgICAgIGxldCB7IGhlaWdodCwgd2lkdGggfSA9IHBhcmFtcztcbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IHsgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGggfSA9IHdpbmRvdztcbiAgICAgICAgICBbaGVpZ2h0LCB3aWR0aF0gPSBbaW5uZXJIZWlnaHQsIGlubmVyV2lkdGhdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmUuc2V0KCcvV2luZG93L3NpemUnLCB7IGhlaWdodCwgd2lkdGggfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoV2luZG93LnByb3RvdHlwZSwge1xuICAgICAgc3RvcmU6IG51bGwsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gV2luZG93O1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==