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
  var Locales = require("locale").Locales;

  function bestLocale(acceptedLocales, supportedLocales) {
    var accepted = new Locales(acceptedLocales);
    var supported = new Locales(supportedLocales);
    return accepted.best(supported);
  }

  function Plugin(_ref) {
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
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));

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
  }

  Plugin.bestLocale = bestLocale;

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,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QUssQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDOUM7T0FDRjs7ZUFyQkcsU0FBUSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTdCLFNBQVE7QUF1QlosZUFBTzs7aUJBQUEsWUFBRyxFQUdUOztBQUVELHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBOUJHLFNBQVE7T0FBUyxDQUFDOztBQWlDeEIsV0FBTyxTQUFRLENBQUM7R0FDakI7O0FBRUQsUUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRS9CLFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkxvY2FsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IExvY2FsZXMgPSByZXF1aXJlKCdsb2NhbGUnKS5Mb2NhbGVzO1xuXG4gIGZ1bmN0aW9uIGJlc3RMb2NhbGUoYWNjZXB0ZWRMb2NhbGVzLCBzdXBwb3J0ZWRMb2NhbGVzKSB7XG4gICAgbGV0IGFjY2VwdGVkID0gbmV3IExvY2FsZXMoYWNjZXB0ZWRMb2NhbGVzKTtcbiAgICBsZXQgc3VwcG9ydGVkID0gbmV3IExvY2FsZXMoc3VwcG9ydGVkTG9jYWxlcyk7XG4gICAgcmV0dXJuIGFjY2VwdGVkLmJlc3Qoc3VwcG9ydGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFBsdWdpbih7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHN1cHBvcnRlZExvY2FsZXMgfSkge1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgc3VwcG9ydGVkTG9jYWxlcy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICApO1xuXG4gICAgY2xhc3MgTG9jYWxpemUgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gaGVhZGVyc1snYWNjZXB0LWxhbmd1YWdlJ10uc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgbGV0IGRlZmF1bHRMb2NhbGUgPSBiZXN0TG9jYWxlKGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLCBzdXBwb3J0ZWRMb2NhbGVzKTtcblxuICAgICAgICBsZXQgc3RvcmUgPSB0aGlzLmZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcblxuICAgICAgICBpZih3aW5kb3cpIHtcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IHRoaXMuZmx1eC5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9Mb2NhbGl6ZS9zZXRMb2NhbGUnLCAoeyBsb2NhbGUgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gbG9jYWxlLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgICAgICBzdG9yZS5zZXQoJy9Mb2NhbGl6ZS9sb2NhbGUnLCBiZXN0TG9jYWxlKGxvY2FsZSwgc3VwcG9ydGVkTG9jYWxlcykpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICAgIC8vIE9ubHkgc2V0IGlmIG5vdGhpbmdzJyBwcmV2aW91c2x5IGZpbGxlZCB0aGlzXG4gICAgICAgIGlmKCFzdG9yZS5oYXNDYWNoZWRWYWx1ZSgnL0xvY2FsaXplL2xvY2FsZScpKSB7XG4gICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgZGVmYXVsdExvY2FsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gTm8tb3AuXG4gICAgICAgIC8vIFRPRE86IGltcHJvdmUgaW4gdGhlIGJyb3dzZXIuXG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0xvY2FsaXplJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTG9jYWxpemU7XG4gIH1cblxuICBQbHVnaW4uYmVzdExvY2FsZSA9IGJlc3RMb2NhbGU7XG5cbiAgcmV0dXJuIFBsdWdpbjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=