"use strict";

var _slice = Array.prototype.slice;
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
  var React = R.React;
  var url = require("url");

  return function (_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;

    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String;
    });

    var History = (function (R) {
      var History = function History(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        var headers = _ref2.headers;

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));
        var store = flux.getStore(storeName);
        if (window) {
          (function () {
            var dispatcher = flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/History/navigate", function (_ref3) {
              var pathname = _ref3.pathname;
              return Promise.try(function () {
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

      _extends(History, R.App.Plugin);

      _classProps(History, null, {
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

      return History;
    })(R);

    return History;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkhpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUzQixTQUFPLGdCQUFtQztRQUFoQyxTQUFTLFFBQVQsU0FBUztRQUFFLGNBQWMsUUFBZCxjQUFjOztBQUNqQyxLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07S0FBQSxDQUNsQyxDQUFDOztRQUVJLE9BQU8sY0FBUyxDQUFDO1VBQWpCLE9BQU8sR0FDQSxTQURQLE9BQU8sUUFDaUM7O1lBQTlCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztZQUFFLE9BQU8sU0FBUCxPQUFPOztBQURwQixBQUVsQixTQUZtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDRCQUVyQixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLFlBQUcsTUFBTSxFQUFFOztBQUNULGdCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUU7a0JBQUcsUUFBUSxTQUFSLFFBQVE7cUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ25GLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2lCQUFBLENBQUMsQ0FBQztBQUN6QyxvQkFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0Usc0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0Msc0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ3JCLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDSixrQkFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtxQkFBTSxNQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUFBLENBQUMsQ0FBQztBQUMvRSxrQkFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7U0FDckMsTUFDSTtBQUNILGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUM7T0FDRjs7ZUFsQkcsT0FBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLE9BQU87QUFvQlgsZ0JBQVE7O2lCQUFBLFVBQUMsSUFBSSxFQUFFO0FBQ2IsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO2FBQUEsQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUNqRTs7QUFFRCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQTVCRyxPQUFPO09BQVMsQ0FBQzs7OztBQStCdkIsV0FBTyxPQUFPLENBQUM7R0FDaEIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5IaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcclxuXHJcbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUgfSkgPT4ge1xyXG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmdcclxuICAgICk7XHJcblxyXG4gICAgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgbGV0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgIGlmKHdpbmRvdykge1xyXG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xyXG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvSGlzdG9yeS9uYXZpZ2F0ZScsICh7IHBhdGhuYW1lIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gcGF0aG5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGhyZWYgPSB1cmwuZm9ybWF0KF8uZXh0ZW5kKHVybC5wYXJzZSh3aW5kb3cubG9jYXRpb24uaHJlZikpLCB7IHBhdGhuYW1lIH0pO1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoaHJlZik7XHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PiB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XHJcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHVybC5wYXJzZShyZXEudXJsKS5wYXRobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBuYXZpZ2F0ZShocmVmKSB7XHJcbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcclxuICAgICAgICByZXR1cm4gc3RvcmUuc2V0KCcvSGlzdG9yeS9wYXRobmFtZScsIHVybC5wYXJzZShocmVmKS5wYXRobmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnSGlzdG9yeSc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gSGlzdG9yeTtcclxuICB9O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=