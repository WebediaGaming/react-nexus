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
        destroy: {
          writable: true,
          value: function () {}
        },
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
//# sourceMappingURL=data:application/json;base64,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QTNCLE9BQU07QUFvQlYsZUFBTzs7aUJBQUEsWUFBRyxFQUdUOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2IsbUJBQU8sUUFBUSxDQUFDO1dBQ25COztBQUVELG9CQUFZOztpQkFBQSxpQkFBYTtnQkFBVixNQUFNLFNBQU4sTUFBTTt3QkFDYSxNQUFNLElBQUksTUFBTTtnQkFBMUMsU0FBUyxTQUFULFNBQVM7Z0JBQUUsVUFBVSxTQUFWLFVBQVU7QUFDM0IsZ0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFLENBQUMsQ0FBQztXQUM3RDs7QUFFRCxrQkFBVTs7aUJBQUEsaUJBQWE7Z0JBQVYsTUFBTSxTQUFOLE1BQU07Z0JBQ1gsTUFBTSxHQUFZLE1BQU0sQ0FBeEIsTUFBTTtnQkFBRSxLQUFLLEdBQUssTUFBTSxDQUFoQixLQUFLO0FBQ25CLGdCQUFHLE1BQU0sRUFBRTtrQkFDSCxXQUFXLEdBQWlCLE1BQU0sQ0FBbEMsV0FBVztrQkFBRSxVQUFVLEdBQUssTUFBTSxDQUFyQixVQUFVOzBCQUNYLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQzs7O0FBQTFDLG9CQUFNO0FBQUUsbUJBQUs7YUFDZjtBQUNELGdCQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUFDO1dBQ25EOzs7O2FBekNHLE9BQU07T0FBUyxDQUFDOztBQTRDdEIsS0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3pCLFdBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFdBQU8sT0FBTSxDQUFDO0dBQ2YsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5XaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjb25zdCBkZWZhdWx0UGFyYW1zID0ge1xuICAgICAgd2lkdGg6IDEyODAsXG4gICAgICBoZWlnaHQ6IDcyMCxcbiAgICAgIHNjcm9sbFRvcDogMCxcbiAgICAgIHNjcm9sbExlZnQ6IDAsXG4gIH07XG5cbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHBhcmFtcyB9KSA9PiB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICApO1xuICAgIF8uZGVmYXVsdHMocGFyYW1zLCBkZWZhdWx0UGFyYW1zKTtcblxuICAgIGNsYXNzIFdpbmRvdyBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHsgLy8ganNoaW50IHVudXNlZDpmYWxzZVxuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFjdHVhbGx5IHVzZWQgaW4gc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgICAgICB0aGlzLnN0b3JlID0gZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuXG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIGxldCBkaXNwYXRjaGVyID0gZmx1eC5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9XaW5kb3cvc2Nyb2xsVG8nLCAoeyB0b3AsIGxlZnQgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gdG9wLnNob3VsZC5iZS5hLk51bWJlciAmJiBsZWZ0LnNob3VsZC5iZS5hLk51bWJlcik7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8odG9wLCBsZWZ0KTtcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4gdGhpcy51cGRhdGVTY3JvbGwoeyB3aW5kb3cgfSkpO1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnVwZGF0ZVNpemUoeyB3aW5kb3cgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY3JvbGwoeyB3aW5kb3cgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2l6ZSh7IHdpbmRvdyB9KTtcbiAgICAgIH1cblxuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gTm8tb3AuXG4gICAgICAgIC8vIFRPRE86IGltcHJvdmUgaW4gdGhlIGJyb3dzZXIuXG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICAgIHJldHVybiAnV2luZG93JztcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2Nyb2xsKHsgd2luZG93IH0pIHtcbiAgICAgICAgbGV0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB3aW5kb3cgfHwgcGFyYW1zO1xuICAgICAgICB0aGlzLnN0b3JlLnNldCgnL1dpbmRvdy9zY3JvbGwnLCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9KTtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlU2l6ZSh7IHdpbmRvdyB9KSB7XG4gICAgICAgIGxldCB7IGhlaWdodCwgd2lkdGggfSA9IHBhcmFtcztcbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IHsgaW5uZXJIZWlnaHQsIGlubmVyV2lkdGggfSA9IHdpbmRvdztcbiAgICAgICAgICBbaGVpZ2h0LCB3aWR0aF0gPSBbaW5uZXJIZWlnaHQsIGlubmVyV2lkdGhdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmUuc2V0KCcvV2luZG93L3NpemUnLCB7IGhlaWdodCwgd2lkdGggfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoV2luZG93LnByb3RvdHlwZSwge1xuICAgICAgc3RvcmU6IG51bGwsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gV2luZG93O1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==