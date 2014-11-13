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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFMUMsU0FBTyxnQkFBcUQ7UUFBbEQsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztRQUFFLGdCQUFnQixRQUFoQixnQkFBZ0I7O0FBQ25ELEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO0tBQUEsQ0FDcEMsQ0FBQzs7QUFFRixRQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztRQUU1QyxRQUFRLGNBQVMsQ0FBQztVQUFsQixRQUFRLEdBQ0QsU0FEUCxRQUFRLFFBQ2dDOztZQUE5QixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7WUFBRSxPQUFPLFNBQVAsT0FBTzs7QUFEbkIsQUFFbkIsU0FGb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxXQUV6QixLQUFLLEtBQUEsT0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTdCLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sTUFBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1NBQUEsQ0FBQyxDQUFDO0FBQ2hFLFlBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFekMsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FBQSxDQUFDLENBQUM7O0FBRTVDLFlBQUcsTUFBTSxFQUFFOztBQUNULGdCQUFJLFVBQVUsR0FBRyxNQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekQsc0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRTtrQkFBRyxNQUFNLFNBQU4sTUFBTTtxQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFJLFVBQVUsR0FBRyxNQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxxQkFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztlQUMzQyxDQUFDO2FBQUEsQ0FBQyxDQUFDOztTQUNMOztBQUVELFlBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7QUFDNUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5QztPQUNGOztlQXRCRyxRQUFRLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBN0IsUUFBUTtBQXdCWixrQkFBVTs7aUJBQUEsVUFBQyxRQUFRLEVBQUU7QUFDbkIsZ0JBQUksZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7V0FDNUM7O0FBRUQsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxVQUFVLENBQUM7V0FDbkI7Ozs7YUEvQkcsUUFBUTtPQUFTLENBQUM7R0FpQ3pCLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuTG9jYWxpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICBjb25zdCBMb2NhbGVzID0gcmVxdWlyZSgnbG9jYWxlJykuTG9jYWxlcztcblxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgc3VwcG9ydGVkTG9jYWxlcyB9KSA9PiB7XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBzdXBwb3J0ZWRMb2NhbGVzLnNob3VsZC5iZS5hbi5BcnJheVxuICAgICk7XG5cbiAgICBsZXQgcGFyc2VkTG9jYWxlcyA9IG5ldyBMb2NhbGVzKHN1cHBvcnRlZExvY2FsZXMpO1xuXG4gICAgY2xhc3MgTG9jYWxpemUgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XG4gICAgICAgIHN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5oZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICBsZXQgZGVmYXVsdExvY2FsZSA9IHRoaXMuZXh0cmFjdExvY2FsZSgpO1xuXG4gICAgICAgIGxldCBzdG9yZSA9IHRoaXMuZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuXG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIGxldCBkaXNwYXRjaGVyID0gdGhpcy5mbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0xvY2FsaXplL3NldExvY2FsZScsICh7IGxvY2FsZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBsb2NhbGUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgICAgIGxldCBiZXN0TG9jYWxlID0gdGhpcy5iZXN0TG9jYWxlKGxvY2FsZSk7XG4gICAgICAgICAgICBzdG9yZS5zZXQoJy9Mb2NhbGl6ZS9sb2NhbGUnLCBiZXN0TG9jYWxlKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgICAvLyBPbmx5IHNldCBpZiBub3RoaW5ncycgcHJldmlvdXNseSBmaWxsZWQgdGhpc1xuICAgICAgICBpZighc3RvcmUuaGFzQ2FjaGVkVmFsdWUoJy9Mb2NhbGl6ZS9sb2NhbGUnKSkge1xuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJlc3RMb2NhbGUoYWNjZXB0ZWQpIHtcbiAgICAgICAgbGV0IGFjY2VwdGVkTG9jYWxlcyA9IG5ldyBMb2NhbGVzKGFjY2VwdGVkKTtcbiAgICAgICAgcmV0dXJuIGFjY2VwdGVkTG9jYWxlcy5iZXN0KHBhcnNlZExvY2FsZXMpO1xuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdMb2NhbGl6ZSc7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==