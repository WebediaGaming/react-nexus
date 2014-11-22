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
//# sourceMappingURL=data:application/json;base64,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QyxFQUFFO0FBQzVDLGVBQUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7T0FDRjs7ZUFyQkcsU0FBUSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTdCLFNBQVE7QUF1Qlosc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxVQUFVLENBQUM7V0FDbkI7Ozs7YUF6QkcsU0FBUTtPQUFTLENBQUM7O0FBNEJ4QixXQUFPLFNBQVEsQ0FBQztHQUNqQixFQUFFLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLkxvY2FsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IExvY2FsZXMgPSByZXF1aXJlKCdsb2NhbGUnKS5Mb2NhbGVzO1xuXG4gIGZ1bmN0aW9uIGJlc3RMb2NhbGUoYWNjZXB0ZWRMb2NhbGVzLCBzdXBwb3J0ZWRMb2NhbGVzKSB7XG4gICAgbGV0IGFjY2VwdGVkID0gbmV3IExvY2FsZXMoYWNjZXB0ZWRMb2NhbGVzKTtcbiAgICBsZXQgc3VwcG9ydGVkID0gbmV3IExvY2FsZXMoc3VwcG9ydGVkTG9jYWxlcyk7XG4gICAgcmV0dXJuIGFjY2VwdGVkLmJlc3Qoc3VwcG9ydGVkKTtcbiAgfVxuXG4gIHJldHVybiBfLmV4dGVuZCgoeyBzdG9yZU5hbWUsIGRpc3BhdGNoZXJOYW1lLCBzdXBwb3J0ZWRMb2NhbGVzIH0pID0+IHtcbiAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIHN1cHBvcnRlZExvY2FsZXMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgKTtcblxuICAgIGNsYXNzIExvY2FsaXplIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgIGxldCBkZWZhdWx0TG9jYWxlID0gYmVzdExvY2FsZShoZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXSwgc3VwcG9ydGVkTG9jYWxlcyk7XG5cbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNldC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG5cbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvTG9jYWxpemUvc2V0TG9jYWxlJywgKHsgbG9jYWxlIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGxvY2FsZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgYmVzdExvY2FsZShsb2NhbGUsIHN1cHBvcnRlZExvY2FsZXMpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgICAvLyBPbmx5IHNldCBpZiBub3RoaW5ncycgcHJldmlvdXNseSBmaWxsZWQgdGhpc1xuICAgICAgICBpZighc3RvcmUuaGFzQ2FjaGVkVmFsdWUoJy9Mb2NhbGl6ZS9sb2NhbGUnKSkge1xuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0xvY2FsaXplJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTG9jYWxpemU7XG4gIH0sIHsgYmVzdExvY2FsZSB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=