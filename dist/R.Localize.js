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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFMUMsU0FBTyxnQkFBcUQ7UUFBbEQsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztRQUFFLGdCQUFnQixRQUFoQixnQkFBZ0I7O0FBQ25ELEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO0tBQUEsQ0FDcEMsQ0FBQzs7QUFFRixRQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztRQUU1QyxRQUFRLGNBQVMsQ0FBQztVQUFsQixRQUFRLEdBQ0QsU0FEUCxRQUFRLFFBQ2dDOztZQUE5QixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7WUFBRSxPQUFPLFNBQVAsT0FBTzs7QUFEbkIsQUFFbkIsU0FGb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxXQUV6QixVQUFLLE9BQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUU3QixTQUFDLENBQUMsR0FBRyxDQUFDO2lCQUFNLE1BQUssT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUFBLENBQUMsQ0FBQztBQUNoRSxZQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXpDLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQUEsQ0FBQyxDQUFDOztBQUU1QyxZQUFHLE1BQU0sRUFBRTs7QUFDVCxnQkFBSSxVQUFVLEdBQUcsTUFBSyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUU7a0JBQUcsTUFBTSxTQUFOLE1BQU07cUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ25GLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2lCQUFBLENBQUMsQ0FBQztBQUN2QyxvQkFBSSxVQUFVLEdBQUcsTUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMscUJBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7ZUFDM0MsQ0FBQzthQUFBLENBQUMsQ0FBQzs7U0FDTDs7QUFFRCxZQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO0FBQzVDLGVBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7T0FDRjs7ZUF0QkcsUUFBUSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTdCLFFBQVE7QUF3Qlosa0JBQVU7O2lCQUFBLFVBQUMsUUFBUSxFQUFFO0FBQ25CLGdCQUFJLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1dBQzVDOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBL0JHLFFBQVE7T0FBUyxDQUFDO0dBaUN6QixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkxvY2FsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuICBjb25zdCBMb2NhbGVzID0gcmVxdWlyZSgnbG9jYWxlJykuTG9jYWxlcztcclxuXHJcbiAgcmV0dXJuICh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHN1cHBvcnRlZExvY2FsZXMgfSkgPT4ge1xyXG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgc3VwcG9ydGVkTG9jYWxlcy5zaG91bGQuYmUuYW4uQXJyYXlcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHBhcnNlZExvY2FsZXMgPSBuZXcgTG9jYWxlcyhzdXBwb3J0ZWRMb2NhbGVzKTtcclxuXHJcbiAgICBjbGFzcyBMb2NhbGl6ZSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuaGVhZGVyc1snYWNjZXB0LWxhbmd1YWdlJ10uc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICBsZXQgZGVmYXVsdExvY2FsZSA9IHRoaXMuZXh0cmFjdExvY2FsZSgpO1xyXG5cclxuICAgICAgICBsZXQgc3RvcmUgPSB0aGlzLmZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcclxuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xyXG5cclxuICAgICAgICBpZih3aW5kb3cpIHtcclxuICAgICAgICAgIGxldCBkaXNwYXRjaGVyID0gdGhpcy5mbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xyXG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvTG9jYWxpemUvc2V0TG9jYWxlJywgKHsgbG9jYWxlIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gbG9jYWxlLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgICAgICAgIGxldCBiZXN0TG9jYWxlID0gdGhpcy5iZXN0TG9jYWxlKGxvY2FsZSk7XHJcbiAgICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGJlc3RMb2NhbGUpO1xyXG4gICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgIC8vIE9ubHkgc2V0IGlmIG5vdGhpbmdzJyBwcmV2aW91c2x5IGZpbGxlZCB0aGlzXHJcbiAgICAgICAgaWYoIXN0b3JlLmhhc0NhY2hlZFZhbHVlKCcvTG9jYWxpemUvbG9jYWxlJykpIHtcclxuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYmVzdExvY2FsZShhY2NlcHRlZCkge1xyXG4gICAgICAgIGxldCBhY2NlcHRlZExvY2FsZXMgPSBuZXcgTG9jYWxlcyhhY2NlcHRlZCk7XHJcbiAgICAgICAgcmV0dXJuIGFjY2VwdGVkTG9jYWxlcy5iZXN0KHBhcnNlZExvY2FsZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gJ0xvY2FsaXplJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==