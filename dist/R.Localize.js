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
  var Locales = require("locale").Locales;

  return function (_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;
    var supportedLocales = _ref.supportedLocales;

    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String && supportedLocales.should.be.an.Array;
    });

    var parsedLocales = new Locales(supportedLocales);

    var Localize = (function (R) {
      var Localize = function Localize(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        var headers = _ref2.headers;

        R.App.Plugin.prototype.apply.call(this, this, arguments);

        _.dev(function () {
          return _this.headers["accept-language"].should.be.a.String;
        });
        var defaultLocale = this.extractLocale();

        var store = this.flux.getStore(storeName);
        _.dev(function () {
          return store.set.should.be.a.Function;
        });

        if (window) {
          (function () {
            var dispatcher = _this.flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/Localize/setLocale", function (_ref3) {
              var locale = _ref3.locale;
              return Promise.try(function () {
                _.dev(function () {
                  return locale.should.be.a.String;
                });
                var bestLocale = _this.bestLocale(locale);
                store.set("/Localize/locale", bestLocale);
              });
            });
          })();
        }
        // Only set if nothings' previously filled this
        if (!store.hasCachedValue("/Localize/locale")) {
          store.set("/Localize/locale", defaultLocale);
        }
      };

      _extends(Localize, R.App.Plugin);

      _classProps(Localize, null, {
        bestLocale: {
          writable: true,
          value: function (accepted) {
            var acceptedLocales = new Locales(accepted);
            return acceptedLocales.best(parsedLocales);
          }
        },
        getDisplayName: {
          writable: true,
          value: function () {
            return "Localize";
          }
        }
      });

      return Localize;
    })(R);
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFMUMsU0FBTyxnQkFBcUQ7UUFBbEQsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztRQUFFLGdCQUFnQixRQUFoQixnQkFBZ0I7O0FBQ25ELEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO0tBQUEsQ0FDcEMsQ0FBQzs7QUFFRixRQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztRQUU1QyxRQUFRLGNBQVMsQ0FBQztVQUFsQixRQUFRLEdBQ0QsU0FEUCxRQUFRLFFBQ2dDOztZQUE5QixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7WUFBRSxPQUFPLFNBQVAsT0FBTzs7QUFEbkIsQUFFbkIsU0FGb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxXQUV6QixVQUFLLE9BQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUU3QixTQUFDLENBQUMsR0FBRyxDQUFDO2lCQUFNLE1BQUssT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUFBLENBQUMsQ0FBQztBQUNoRSxZQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXpDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQUEsQ0FBQyxDQUFDOztBQUU1QyxZQUFHLE1BQU0sRUFBRTs7QUFDVCxnQkFBSSxVQUFVLEdBQUcsTUFBSyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUU7a0JBQUcsTUFBTSxTQUFOLE1BQU07cUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ25GLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2lCQUFBLENBQUMsQ0FBQztBQUN2QyxvQkFBSSxVQUFVLEdBQUcsTUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMscUJBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7ZUFDM0MsQ0FBQzthQUFBLENBQUMsQ0FBQzs7U0FDTDs7QUFFRCxZQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO0FBQzVDLGVBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7T0FDRjs7ZUF0QkcsUUFBUSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTdCLFFBQVE7QUF3Qlosa0JBQVU7O2lCQUFBLFVBQUMsUUFBUSxFQUFFO0FBQ25CLGdCQUFJLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1dBQzVDOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBL0JHLFFBQVE7T0FBUyxDQUFDO0dBaUN6QixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkxvY2FsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgY29uc3QgTG9jYWxlcyA9IHJlcXVpcmUoJ2xvY2FsZScpLkxvY2FsZXM7XG5cbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHN1cHBvcnRlZExvY2FsZXMgfSkgPT4ge1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgc3VwcG9ydGVkTG9jYWxlcy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICApO1xuXG4gICAgbGV0IHBhcnNlZExvY2FsZXMgPSBuZXcgTG9jYWxlcyhzdXBwb3J0ZWRMb2NhbGVzKTtcblxuICAgIGNsYXNzIExvY2FsaXplIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xuICAgICAgICBzdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuaGVhZGVyc1snYWNjZXB0LWxhbmd1YWdlJ10uc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgbGV0IGRlZmF1bHRMb2NhbGUgPSB0aGlzLmV4dHJhY3RMb2NhbGUoKTtcblxuICAgICAgICBsZXQgc3RvcmUgPSB0aGlzLmZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcblxuICAgICAgICBpZih3aW5kb3cpIHtcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IHRoaXMuZmx1eC5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9Mb2NhbGl6ZS9zZXRMb2NhbGUnLCAoeyBsb2NhbGUgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gbG9jYWxlLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgICAgICBsZXQgYmVzdExvY2FsZSA9IHRoaXMuYmVzdExvY2FsZShsb2NhbGUpO1xuICAgICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgYmVzdExvY2FsZSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgICAgLy8gT25seSBzZXQgaWYgbm90aGluZ3MnIHByZXZpb3VzbHkgZmlsbGVkIHRoaXNcbiAgICAgICAgaWYoIXN0b3JlLmhhc0NhY2hlZFZhbHVlKCcvTG9jYWxpemUvbG9jYWxlJykpIHtcbiAgICAgICAgICBzdG9yZS5zZXQoJy9Mb2NhbGl6ZS9sb2NhbGUnLCBkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBiZXN0TG9jYWxlKGFjY2VwdGVkKSB7XG4gICAgICAgIGxldCBhY2NlcHRlZExvY2FsZXMgPSBuZXcgTG9jYWxlcyhhY2NlcHRlZCk7XG4gICAgICAgIHJldHVybiBhY2NlcHRlZExvY2FsZXMuYmVzdChwYXJzZWRMb2NhbGVzKTtcbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnTG9jYWxpemUnO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=