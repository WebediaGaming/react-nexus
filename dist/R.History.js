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
  };
};
//# sourceMappingURL=data:application/json;base64,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QUMsQ0FBQyxRQUFRLElBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO2FBQUEsQ0FDM0IsQ0FBQztBQUNGLG1CQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7V0FDL0M7O0FBRUQsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxTQUFTLENBQUM7V0FDbEI7Ozs7YUFsQ0csUUFBTztPQUFTLENBQUM7O0FBcUN2QixXQUFPLFFBQU8sQ0FBQztHQUNoQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3QgdXJsID0gcmVxdWlyZSgndXJsJyk7XG5cbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUgfSkgPT4ge1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZ1xuICAgICk7XG5cbiAgICBjbGFzcyBIaXN0b3J5IGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEgfSkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICBpZihfLmlzQ2xpZW50KCkpIHtcbiAgICAgICAgICBjb25zdCBkaXNwYXRjaGVyID0gZmx1eC5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9IaXN0b3J5L25hdmlnYXRlJywgKHsgcGF0aG5hbWUgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gcGF0aG5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IHVybE9iaiA9IF8uZXh0ZW5kKHVybC5wYXJzZSh3aW5kb3cubG9jYXRpb24uaHJlZiksIHsgcGF0aG5hbWUgfSk7XG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgdXJsLmZvcm1hdCh1cmxPYmopKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGUodXJsT2JqKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKCkgPT4gdGhpcy5uYXZpZ2F0ZSh3aW5kb3cubG9jYXRpb24uaHJlZikpO1xuICAgICAgICAgIHRoaXMubmF2aWdhdGUodXJsLnBhcnNlKHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5uYXZpZ2F0ZSh1cmwucGFyc2UocmVxLnVybCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIE5vLW9wLlxuICAgICAgICAvLyBUT0RPOiBJbXByb3ZlIGluIHRoZSBicm93c2VyLlxuICAgICAgfVxuXG4gICAgICBuYXZpZ2F0ZSh1cmxPYmopIHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLmZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdXJsT2JqLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHN0b3JlLnNldCgnL0hpc3RvcnkvbG9jYXRpb24nLCB1cmxPYmopO1xuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdIaXN0b3J5JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gSGlzdG9yeTtcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=