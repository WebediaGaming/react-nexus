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
  var url = require("url");

  function Plugin(_ref) {
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
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));
        if (_.isClient()) {
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
        destroy: {
          writable: true,
          value: function () {}
        },
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
  }

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuSGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUzQixXQUFTLE1BQU0sT0FBZ0M7UUFBN0IsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztBQUN6QyxLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07S0FBQSxDQUNsQyxDQUFDOztRQUVJLFFBQU8sY0FBUyxDQUFDO1VBQWpCLFFBQU8sR0FDQSxTQURQLFFBQU8sUUFDd0I7O1lBQXJCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztBQURYLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sNEJBRXJCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFOztBQUNmLGdCQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUU7a0JBQUcsUUFBUSxTQUFSLFFBQVE7cUJBQU8sT0FBTyxPQUFJLENBQUMsWUFBTTtBQUNuRixpQkFBQyxDQUFDLEdBQUcsQ0FBQzt5QkFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtpQkFBQSxDQUFDLENBQUM7QUFDekMsb0JBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDdkUsc0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELHNCQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztlQUN2QixDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ0osa0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7cUJBQU0sTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDL0Usa0JBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztTQUNoRCxNQUNJO0FBQ0gsY0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25DO09BQ0Y7O2VBakJHLFFBQU8sRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE1QixRQUFPO0FBbUJYLGVBQU87O2lCQUFBLFlBQUcsRUFHVDs7QUFFRCxnQkFBUTs7aUJBQUEsVUFBQyxNQUFNLEVBQUU7QUFDZixnQkFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUMsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07YUFBQSxDQUMzQixDQUFDO0FBQ0YsbUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztXQUMvQzs7QUFFRCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQWxDRyxRQUFPO09BQVMsQ0FBQzs7QUFxQ3ZCLFdBQU8sUUFBTyxDQUFDO0dBQ2hCOztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbiAgZnVuY3Rpb24gUGx1Z2luKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSB9KSB7XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nXG4gICAgKTtcblxuICAgIGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKF8uaXNDbGllbnQoKSkge1xuICAgICAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0hpc3RvcnkvbmF2aWdhdGUnLCAoeyBwYXRobmFtZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBwYXRobmFtZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgY29uc3QgdXJsT2JqID0gXy5leHRlbmQodXJsLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSwgeyBwYXRobmFtZSB9KTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCB1cmwuZm9ybWF0KHVybE9iaikpO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmxPYmopO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoKSA9PiB0aGlzLm5hdmlnYXRlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XG4gICAgICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmwucGFyc2Uod2luZG93LmxvY2F0aW9uLmhyZWYpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5hdmlnYXRlKHVybC5wYXJzZShyZXEudXJsKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gTm8tb3AuXG4gICAgICAgIC8vIFRPRE86IEltcHJvdmUgaW4gdGhlIGJyb3dzZXIuXG4gICAgICB9XG5cbiAgICAgIG5hdmlnYXRlKHVybE9iaikge1xuICAgICAgICBjb25zdCBzdG9yZSA9IHRoaXMuZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB1cmxPYmouc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gc3RvcmUuc2V0KCcvSGlzdG9yeS9sb2NhdGlvbicsIHVybE9iaik7XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0hpc3RvcnknO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBIaXN0b3J5O1xuICB9XG5cbiAgcmV0dXJuIFBsdWdpbjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=