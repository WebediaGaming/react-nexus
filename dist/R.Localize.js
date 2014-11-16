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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7O0FBRTFDLFdBQVMsVUFBVSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRTtBQUNyRCxRQUFJLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM1QyxRQUFJLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlDLFdBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNqQzs7QUFFRCxTQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQXFEO1FBQWxELFNBQVMsUUFBVCxTQUFTO1FBQUUsY0FBYyxRQUFkLGNBQWM7UUFBRSxnQkFBZ0IsUUFBaEIsZ0JBQWdCO0FBQzVELEtBQUMsQ0FBQyxHQUFHLENBQUM7YUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO0tBQUEsQ0FDcEMsQ0FBQzs7UUFFSSxRQUFRLGNBQVMsQ0FBQztVQUFsQixRQUFRLEdBQ0QsU0FEUCxRQUFRLFFBQ2dDOztZQUE5QixJQUFJLFNBQUosSUFBSTtZQUFFLE1BQU0sU0FBTixNQUFNO1lBQUUsR0FBRyxTQUFILEdBQUc7WUFBRSxPQUFPLFNBQVAsT0FBTztBQURuQixBQUVuQixTQUZvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFdBRXpCLEtBQUssS0FBQSxPQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFN0IsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1NBQUEsQ0FBQyxDQUFDO0FBQzNELFlBQUksYUFBYSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU3RSxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQyxTQUFDLENBQUMsR0FBRyxDQUFDO2lCQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUFBLENBQUMsQ0FBQzs7QUFFNUMsWUFBRyxNQUFNLEVBQUU7O0FBQ1QsZ0JBQUksVUFBVSxHQUFHLE1BQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6RCxzQkFBVSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFO2tCQUFHLE1BQU0sU0FBTixNQUFNO3FCQUFPLE9BQU8sT0FBSSxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3ZDLHFCQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2VBQ3JFLENBQUM7YUFBQSxDQUFDLENBQUM7O1NBQ0w7O0FBRUQsWUFBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsRUFBRTtBQUM1QyxlQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQzlDO09BQ0Y7O2VBckJHLFFBQVEsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE3QixRQUFRO0FBdUJaLHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBekJHLFFBQVE7T0FBUyxDQUFDOztBQTRCeEIsV0FBTyxRQUFRLENBQUM7R0FDakIsRUFBRSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5Mb2NhbGl6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IExvY2FsZXMgPSByZXF1aXJlKCdsb2NhbGUnKS5Mb2NhbGVzO1xuXG4gIGZ1bmN0aW9uIGJlc3RMb2NhbGUoYWNjZXB0ZWRMb2NhbGVzLCBzdXBwb3J0ZWRMb2NhbGVzKSB7XG4gICAgbGV0IGFjY2VwdGVkID0gbmV3IExvY2FsZXMoYWNjZXB0ZWRMb2NhbGVzKTtcbiAgICBsZXQgc3VwcG9ydGVkID0gbmV3IExvY2FsZXMoc3VwcG9ydGVkTG9jYWxlcyk7XG4gICAgcmV0dXJuIGFjY2VwdGVkLmJlc3Qoc3VwcG9ydGVkKTtcbiAgfVxuXG4gIHJldHVybiBfLmV4dGVuZCgoeyBzdG9yZU5hbWUsIGRpc3BhdGNoZXJOYW1lLCBzdXBwb3J0ZWRMb2NhbGVzIH0pID0+IHtcbiAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIHN1cHBvcnRlZExvY2FsZXMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgKTtcblxuICAgIGNsYXNzIExvY2FsaXplIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xuICAgICAgICBzdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgIGxldCBkZWZhdWx0TG9jYWxlID0gYmVzdExvY2FsZShoZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXSwgc3VwcG9ydGVkTG9jYWxlcyk7XG5cbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNldC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG5cbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICAgICAgZGlzcGF0Y2hlci5hZGRBY3Rpb25IYW5kbGVyKCcvTG9jYWxpemUvc2V0TG9jYWxlJywgKHsgbG9jYWxlIH0pID0+IFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGxvY2FsZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgYmVzdExvY2FsZShsb2NhbGUsIHN1cHBvcnRlZExvY2FsZXMpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgICAvLyBPbmx5IHNldCBpZiBub3RoaW5ncycgcHJldmlvdXNseSBmaWxsZWQgdGhpc1xuICAgICAgICBpZighc3RvcmUuaGFzQ2FjaGVkVmFsdWUoJy9Mb2NhbGl6ZS9sb2NhbGUnKSkge1xuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0xvY2FsaXplJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTG9jYWxpemU7XG4gIH0sIHsgYmVzdExvY2FsZSB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=