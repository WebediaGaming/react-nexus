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
  var Locales = require("locale").Locales;

  function bestLocale(acceptedLocales, supportedLocales) {
    var accepted = new Locales(acceptedLocales);
    var supported = new Locales(supportedLocales);
    return accepted.best(supported);
  }

  return _.extend(function (_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;
    var supportedLocales = _ref.supportedLocales;
    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String && supportedLocales.should.be.an.Array;
    });

    var _Localize = (function (R) {
      var _Localize = function _Localize(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        var headers = _ref2.headers;
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));

        _.dev(function () {
          return headers["accept-language"].should.be.a.String;
        });
        var defaultLocale = bestLocale(headers["accept-language"], supportedLocales);

        var store = this.flux.getStore(storeName);
        _.dev(function () {
          return store.set.should.be.a.Function;
        });

        if (window) {
          (function () {
            var dispatcher = _this.flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/Localize/setLocale", function (_ref3) {
              var locale = _ref3.locale;
              return Promise["try"](function () {
                _.dev(function () {
                  return locale.should.be.a.String;
                });
                store.set("/Localize/locale", bestLocale(locale, supportedLocales));
              });
            });
          })();
        }
        // Only set if nothings' previously filled this
        if (!store.hasCachedValue("/Localize/locale")) {
          store.set("/Localize/locale", defaultLocale);
        }
      };

      _extends(_Localize, R.App.Plugin);

      _classProps(_Localize, null, {
        destroy: {
          writable: true,
          value: function () {}
        },
        getDisplayName: {
          writable: true,
          value: function () {
            return "Localize";
          }
        }
      });

      return _Localize;
    })(R);

    return _Localize;
  }, { bestLocale: bestLocale });
};
//# sourceMappingURL=data:application/json;base64,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QyxFQUFFO0FBQzVDLGVBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7T0FDRjs7ZUFyQkcsU0FBUSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTdCLFNBQVE7QUF1QlosZUFBTzs7aUJBQUEsWUFBRyxFQUdUOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBOUJHLFNBQVE7T0FBUyxDQUFDOztBQWlDeEIsV0FBTyxTQUFRLENBQUM7R0FDakIsRUFBRSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5Mb2NhbGl6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBMb2NhbGVzID0gcmVxdWlyZSgnbG9jYWxlJykuTG9jYWxlcztcblxuICBmdW5jdGlvbiBiZXN0TG9jYWxlKGFjY2VwdGVkTG9jYWxlcywgc3VwcG9ydGVkTG9jYWxlcykge1xuICAgIGxldCBhY2NlcHRlZCA9IG5ldyBMb2NhbGVzKGFjY2VwdGVkTG9jYWxlcyk7XG4gICAgbGV0IHN1cHBvcnRlZCA9IG5ldyBMb2NhbGVzKHN1cHBvcnRlZExvY2FsZXMpO1xuICAgIHJldHVybiBhY2NlcHRlZC5iZXN0KHN1cHBvcnRlZCk7XG4gIH1cblxuICByZXR1cm4gXy5leHRlbmQoKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgc3VwcG9ydGVkTG9jYWxlcyB9KSA9PiB7XG4gICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBzdXBwb3J0ZWRMb2NhbGVzLnNob3VsZC5iZS5hbi5BcnJheVxuICAgICk7XG5cbiAgICBjbGFzcyBMb2NhbGl6ZSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcblxuICAgICAgICBfLmRldigoKSA9PiBoZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICBsZXQgZGVmYXVsdExvY2FsZSA9IGJlc3RMb2NhbGUoaGVhZGVyc1snYWNjZXB0LWxhbmd1YWdlJ10sIHN1cHBvcnRlZExvY2FsZXMpO1xuXG4gICAgICAgIGxldCBzdG9yZSA9IHRoaXMuZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5zZXQuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuXG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIGxldCBkaXNwYXRjaGVyID0gdGhpcy5mbHV4LmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0xvY2FsaXplL3NldExvY2FsZScsICh7IGxvY2FsZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBsb2NhbGUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGJlc3RMb2NhbGUobG9jYWxlLCBzdXBwb3J0ZWRMb2NhbGVzKSk7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgICAgLy8gT25seSBzZXQgaWYgbm90aGluZ3MnIHByZXZpb3VzbHkgZmlsbGVkIHRoaXNcbiAgICAgICAgaWYoIXN0b3JlLmhhc0NhY2hlZFZhbHVlKCcvTG9jYWxpemUvbG9jYWxlJykpIHtcbiAgICAgICAgICBzdG9yZS5zZXQoJy9Mb2NhbGl6ZS9sb2NhbGUnLCBkZWZhdWx0TG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkZXN0cm95KCkge1xuICAgICAgICAvLyBOby1vcC5cbiAgICAgICAgLy8gVE9ETzogaW1wcm92ZSBpbiB0aGUgYnJvd3Nlci5cbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnTG9jYWxpemUnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBMb2NhbGl6ZTtcbiAgfSwgeyBiZXN0TG9jYWxlIH0pO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==