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

        R.App.Plugin.prototype.apply.call(this, this, arguments);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkhpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTNCLFNBQU8sZ0JBQW1DO1FBQWhDLFNBQVMsUUFBVCxTQUFTO1FBQUUsY0FBYyxRQUFkLGNBQWM7O0FBQ2pDLEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtLQUFBLENBQ2xDLENBQUM7O1FBRUksT0FBTyxjQUFTLENBQUM7VUFBakIsT0FBTyxHQUNBLFNBRFAsT0FBTyxRQUNpQzs7WUFBOUIsSUFBSSxTQUFKLElBQUk7WUFBRSxNQUFNLFNBQU4sTUFBTTtZQUFFLEdBQUcsU0FBSCxHQUFHO1lBQUUsT0FBTyxTQUFQLE9BQU87O0FBRHBCLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sV0FFeEIsVUFBSyxPQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3QixZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLFlBQUcsTUFBTSxFQUFFOztBQUNULGdCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUU7a0JBQUcsUUFBUSxTQUFSLFFBQVE7cUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ25GLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2lCQUFBLENBQUMsQ0FBQztBQUN6QyxvQkFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0Usc0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0Msc0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQ3JCLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDSixrQkFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtxQkFBTSxNQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUFBLENBQUMsQ0FBQztBQUMvRSxrQkFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7U0FDckMsTUFDSTtBQUNILGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUM7T0FDRjs7ZUFsQkcsT0FBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLE9BQU87QUFvQlgsZ0JBQVE7O2lCQUFBLFVBQUMsSUFBSSxFQUFFO0FBQ2IsZ0JBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO2FBQUEsQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUNqRTs7QUFFRCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQTVCRyxPQUFPO09BQVMsQ0FBQzs7OztBQStCdkIsV0FBTyxPQUFPLENBQUM7R0FDaEIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5IaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcclxuXHJcbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUgfSkgPT4ge1xyXG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmdcclxuICAgICk7XHJcblxyXG4gICAgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgbGV0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgIGlmKHdpbmRvdykge1xyXG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xyXG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvSGlzdG9yeS9uYXZpZ2F0ZScsICh7IHBhdGhuYW1lIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gcGF0aG5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGhyZWYgPSB1cmwuZm9ybWF0KF8uZXh0ZW5kKHVybC5wYXJzZSh3aW5kb3cubG9jYXRpb24uaHJlZikpLCB7IHBhdGhuYW1lIH0pO1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgaHJlZik7XHJcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUoaHJlZik7XHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PiB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XHJcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHVybC5wYXJzZShyZXEudXJsKS5wYXRobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBuYXZpZ2F0ZShocmVmKSB7XHJcbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcclxuICAgICAgICByZXR1cm4gc3RvcmUuc2V0KCcvSGlzdG9yeS9wYXRobmFtZScsIHVybC5wYXJzZShocmVmKS5wYXRobmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnSGlzdG9yeSc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gSGlzdG9yeTtcclxuICB9O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=