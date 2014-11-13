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

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkhpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTNCLFNBQU8sZ0JBQW1DO1FBQWhDLFNBQVMsUUFBVCxTQUFTO1FBQUUsY0FBYyxRQUFkLGNBQWM7O0FBQ2pDLEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtLQUFBLENBQ2xDLENBQUM7O1FBRUksT0FBTyxjQUFTLENBQUM7VUFBakIsT0FBTyxHQUNBLFNBRFAsT0FBTyxRQUNpQzs7WUFBOUIsSUFBSSxTQUFKLElBQUk7WUFBRSxNQUFNLFNBQU4sTUFBTTtZQUFFLEdBQUcsU0FBSCxHQUFHO1lBQUUsT0FBTyxTQUFQLE9BQU87O0FBRHBCLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXJCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsWUFBRyxNQUFNLEVBQUU7O0FBQ1QsZ0JBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEQsc0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRTtrQkFBRyxRQUFRLFNBQVIsUUFBUTtxQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3pDLG9CQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUMvRSxzQkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQyxzQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7ZUFDckIsQ0FBQzthQUFBLENBQUMsQ0FBQztBQUNKLGtCQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO3FCQUFNLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQy9FLGtCQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztTQUNyQyxNQUNJO0FBQ0gsY0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM1QztPQUNGOztlQWxCRyxPQUFPLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBNUIsT0FBTztBQW9CWCxnQkFBUTs7aUJBQUEsVUFBQyxJQUFJLEVBQUU7QUFDYixnQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7YUFBQSxDQUFDLENBQUM7QUFDNUMsbUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ2pFOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sU0FBUyxDQUFDO1dBQ2xCOzs7O2FBNUJHLE9BQU87T0FBUyxDQUFDOzs7O0FBK0J2QixXQUFPLE9BQU8sQ0FBQztHQUNoQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcblxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSB9KSA9PiB7XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nXG4gICAgKTtcblxuICAgIGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGxldCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBmbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0hpc3RvcnkvbmF2aWdhdGUnLCAoeyBwYXRobmFtZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBwYXRobmFtZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgbGV0IGhyZWYgPSB1cmwuZm9ybWF0KF8uZXh0ZW5kKHVybC5wYXJzZSh3aW5kb3cubG9jYXRpb24uaHJlZikpLCB7IHBhdGhuYW1lIH0pO1xuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGhyZWYpO1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShocmVmKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKCkgPT4gdGhpcy5uYXZpZ2F0ZSh3aW5kb3cubG9jYXRpb24uaHJlZikpO1xuICAgICAgICAgIHRoaXMubmF2aWdhdGUod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMubmF2aWdhdGUodXJsLnBhcnNlKHJlcS51cmwpLnBhdGhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuYXZpZ2F0ZShocmVmKSB7XG4gICAgICAgIGxldCBzdG9yZSA9IHRoaXMuZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgICByZXR1cm4gc3RvcmUuc2V0KCcvSGlzdG9yeS9wYXRobmFtZScsIHVybC5wYXJzZShocmVmKS5wYXRobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0hpc3RvcnknO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBIaXN0b3J5O1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==