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
                var urlObj = _.extend(url.parse(window.location.href), { pathname: pathname });
                window.history.pushState(null, null, url.format(urlObj));
                _this.navigate(urlObj);
              });
            });
            window.addEventListener("popstate", function () {
              return _this.navigate(window.location.href);
            });
            _this.navigate(url.parse(window.location.href));
          })();
        } else {
          this.navigate(url.parse(req.url));
        }
      };

      _extends(_History, R.App.Plugin);

      _classProps(_History, null, {
        navigate: {
          writable: true,
          value: function (urlObj) {
            var store = this.flux.getStore(storeName);
            _.dev(function () {
              return store.set.should.be.a.Function && urlObj.should.be.an.Object;
            });
            return store.set("/History/location", urlObj);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuSGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTNCLFNBQU8sZ0JBQW1DO1FBQWhDLFNBQVMsUUFBVCxTQUFTO1FBQUUsY0FBYyxRQUFkLGNBQWM7QUFDakMsS0FBQyxDQUFDLEdBQUcsQ0FBQzthQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO0tBQUEsQ0FDbEMsQ0FBQzs7UUFFSSxRQUFPLGNBQVMsQ0FBQztVQUFqQixRQUFPLEdBQ0EsU0FEUCxRQUFPLFFBQ3dCOztZQUFyQixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7QUFEWCxBQUVsQixTQUZtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDJCQUVyQixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRTs7QUFDVCxnQkFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RCxzQkFBVSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFO2tCQUFHLFFBQVEsU0FBUixRQUFRO3FCQUFPLE9BQU8sT0FBSSxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3pDLG9CQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLHNCQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxzQkFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7ZUFDdkIsQ0FBQzthQUFBLENBQUMsQ0FBQztBQUNKLGtCQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO3FCQUFNLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQy9FLGtCQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7U0FDaEQsTUFDSTtBQUNILGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNuQztPQUNGOztlQWpCRyxRQUFPLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBNUIsUUFBTztBQW1CWCxnQkFBUTs7aUJBQUEsVUFBQyxNQUFNLEVBQUU7QUFDZixnQkFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07YUFBQSxDQUMzQixDQUFDO0FBQ0YsbUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztXQUMvQzs7QUFFRCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQTdCRyxRQUFPO09BQVMsQ0FBQzs7QUFnQ3ZCLFdBQU8sUUFBTyxDQUFDO0dBQ2hCLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuSGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcblxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSB9KSA9PiB7XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nXG4gICAgKTtcblxuICAgIGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0hpc3RvcnkvbmF2aWdhdGUnLCAoeyBwYXRobmFtZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBwYXRobmFtZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgY29uc3QgdXJsT2JqID0gXy5leHRlbmQodXJsLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSwgeyBwYXRobmFtZSB9KTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCB1cmwuZm9ybWF0KHVybE9iaikpO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmxPYmopO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PiB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XG4gICAgICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmwucGFyc2Uod2luZG93LmxvY2F0aW9uLmhyZWYpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHVybC5wYXJzZShyZXEudXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmF2aWdhdGUodXJsT2JqKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNldC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHVybE9iai5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBzdG9yZS5zZXQoJy9IaXN0b3J5L2xvY2F0aW9uJywgdXJsT2JqKTtcbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnSGlzdG9yeSc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEhpc3Rvcnk7XG4gIH07XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9