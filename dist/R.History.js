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
  var url = require("url");

  return function (_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;
    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String;
    });

    var _History = (function (R) {
      var _History = function _History(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));
        if (window) {
          (function () {
            var dispatcher = flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/History/navigate", function (_ref3) {
              var pathname = _ref3.pathname;
              return Promise["try"](function () {
                _.dev(function () {
                  return pathname.should.be.a.String;
                });
                var href = url.format(_.extend(url.parse(window.location.href)), { pathname: pathname });
                window.history.pushState(null, null, href);
                _this.navigate(href);
              });
            });
            window.addEventListener("popstate", function () {
              return _this.navigate(window.location.href);
            });
            _this.navigate(window.location.href);
          })();
        } else {
          this.navigate(url.parse(req.url).pathname);
        }
      };

      _extends(_History, R.App.Plugin);

      _classProps(_History, null, {
        navigate: {
          writable: true,
          value: function (href) {
            var store = this.flux.getStore(storeName);
            _.dev(function () {
              return store.set.should.be.a.Function;
            });
            return store.set("/History/pathname", url.parse(href).pathname);
          }
        },
        getDisplayName: {
          writable: true,
          value: function () {
            return "History";
          }
        }
      });

      return _History;
    })(R);

    return _History;
  };
};
//# sourceMappingURL=data:application/json;base64,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QyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ2pFOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sU0FBUyxDQUFDO1dBQ2xCOzs7O2FBM0JHLFFBQU87T0FBUyxDQUFDOztBQThCdkIsV0FBTyxRQUFPLENBQUM7R0FDaEIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5IaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcclxuXHJcbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUgfSkgPT4ge1xyXG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmdcclxuICAgICk7XHJcblxyXG4gICAgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEgfSkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XHJcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9IaXN0b3J5L25hdmlnYXRlJywgKHsgcGF0aG5hbWUgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBwYXRobmFtZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICAgICAgICBsZXQgaHJlZiA9IHVybC5mb3JtYXQoXy5leHRlbmQodXJsLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSksIHsgcGF0aG5hbWUgfSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBocmVmKTtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShocmVmKTtcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsICgpID0+IHRoaXMubmF2aWdhdGUod2luZG93LmxvY2F0aW9uLmhyZWYpKTtcclxuICAgICAgICAgIHRoaXMubmF2aWdhdGUod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubmF2aWdhdGUodXJsLnBhcnNlKHJlcS51cmwpLnBhdGhuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5hdmlnYXRlKGhyZWYpIHtcclxuICAgICAgICBsZXQgc3RvcmUgPSB0aGlzLmZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcclxuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBzdG9yZS5zZXQoJy9IaXN0b3J5L3BhdGhuYW1lJywgdXJsLnBhcnNlKGhyZWYpLnBhdGhuYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdIaXN0b3J5JztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBIaXN0b3J5O1xyXG4gIH07XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==