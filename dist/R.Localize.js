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

  function bestLocale(acceptedLocales, supportedLocales) {
    var accepted = new Locales(accepted);
    var supported = new Locales(supported);
    return accepted.best(supported);
  }

  return _.extend(function (_ref) {
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
              return Promise.try(function () {
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

      _extends(Localize, R.App.Plugin);

      _classProps(Localize, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Localize";
          }
        }
      });

      return Localize;
    })(R);

    return Localize;
  }, { bestLocale: bestLocale });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUUxQyxXQUFTLFVBQVUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDckQsUUFBSSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsUUFBSSxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsV0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ2pDOztBQUVELFNBQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBcUQ7UUFBbEQsU0FBUyxRQUFULFNBQVM7UUFBRSxjQUFjLFFBQWQsY0FBYztRQUFFLGdCQUFnQixRQUFoQixnQkFBZ0I7QUFDNUQsS0FBQyxDQUFDLEdBQUcsQ0FBQzthQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUs7S0FBQSxDQUNwQyxDQUFDOztBQUVGLFFBQUksYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O1FBRTVDLFFBQVEsY0FBUyxDQUFDO1VBQWxCLFFBQVEsR0FDRCxTQURQLFFBQVEsUUFDZ0M7O1lBQTlCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztZQUFFLE9BQU8sU0FBUCxPQUFPO0FBRG5CLEFBRW5CLFNBRm9CLENBQUMsR0FBRyxDQUFDLE1BQU0sV0FFekIsS0FBSyxLQUFBLE9BQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUU3QixTQUFDLENBQUMsR0FBRyxDQUFDO2lCQUFNLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07U0FBQSxDQUFDLENBQUM7QUFDM0QsWUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBRTdFLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQUEsQ0FBQyxDQUFDOztBQUU1QyxZQUFHLE1BQU0sRUFBRTs7QUFDVCxnQkFBSSxVQUFVLEdBQUcsTUFBSyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pELHNCQUFVLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUU7a0JBQUcsTUFBTSxTQUFOLE1BQU07cUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ25GLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2lCQUFBLENBQUMsQ0FBQztBQUN2QyxxQkFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztlQUNyRSxDQUFDO2FBQUEsQ0FBQyxDQUFDOztTQUNMOztBQUVELFlBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7QUFDNUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5QztPQUNGOztlQXJCRyxRQUFRLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBN0IsUUFBUTtBQXVCWixzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFVBQVUsQ0FBQztXQUNuQjs7OzthQXpCRyxRQUFRO09BQVMsQ0FBQzs7QUE0QnhCLFdBQU8sUUFBUSxDQUFDO0dBQ2pCLEVBQUUsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFLENBQUMsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuTG9jYWxpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICBjb25zdCBMb2NhbGVzID0gcmVxdWlyZSgnbG9jYWxlJykuTG9jYWxlcztcblxuICBmdW5jdGlvbiBiZXN0TG9jYWxlKGFjY2VwdGVkTG9jYWxlcywgc3VwcG9ydGVkTG9jYWxlcykge1xuICAgIGxldCBhY2NlcHRlZCA9IG5ldyBMb2NhbGVzKGFjY2VwdGVkKTtcbiAgICBsZXQgc3VwcG9ydGVkID0gbmV3IExvY2FsZXMoc3VwcG9ydGVkKTtcbiAgICByZXR1cm4gYWNjZXB0ZWQuYmVzdChzdXBwb3J0ZWQpO1xuICB9XG5cbiAgcmV0dXJuIF8uZXh0ZW5kKCh7IHN0b3JlTmFtZSwgZGlzcGF0Y2hlck5hbWUsIHN1cHBvcnRlZExvY2FsZXMgfSkgPT4ge1xuICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgc3VwcG9ydGVkTG9jYWxlcy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICApO1xuXG4gICAgbGV0IHBhcnNlZExvY2FsZXMgPSBuZXcgTG9jYWxlcyhzdXBwb3J0ZWRMb2NhbGVzKTtcblxuICAgIGNsYXNzIExvY2FsaXplIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xuICAgICAgICBzdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgIGxldCBkZWZhdWx0TG9jYWxlID0gYmVzdExvY2FsZShoZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXSwgc3VwcG9ydGVkTG9jYWxlcyk7XG5cbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNldC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG5cbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvTG9jYWxpemUvc2V0TG9jYWxlJywgKHsgbG9jYWxlIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGxvY2FsZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgYmVzdExvY2FsZShsb2NhbGUsIHN1cHBvcnRlZExvY2FsZXMpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgICAvLyBPbmx5IHNldCBpZiBub3RoaW5ncycgcHJldmlvdXNseSBmaWxsZWQgdGhpc1xuICAgICAgICBpZighc3RvcmUuaGFzQ2FjaGVkVmFsdWUoJy9Mb2NhbGl6ZS9sb2NhbGUnKSkge1xuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0xvY2FsaXplJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTG9jYWxpemU7XG4gIH0sIHsgYmVzdExvY2FsZSB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=