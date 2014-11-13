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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUUxQyxTQUFPLGdCQUFxRDtRQUFsRCxTQUFTLFFBQVQsU0FBUztRQUFFLGNBQWMsUUFBZCxjQUFjO1FBQUUsZ0JBQWdCLFFBQWhCLGdCQUFnQjtBQUNuRCxLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSztLQUFBLENBQ3BDLENBQUM7O0FBRUYsUUFBSSxhQUFhLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7UUFFNUMsUUFBUSxjQUFTLENBQUM7VUFBbEIsUUFBUSxHQUNELFNBRFAsUUFBUSxRQUNnQzs7WUFBOUIsSUFBSSxTQUFKLElBQUk7WUFBRSxNQUFNLFNBQU4sTUFBTTtZQUFFLEdBQUcsU0FBSCxHQUFHO1lBQUUsT0FBTyxTQUFQLE9BQU87QUFEbkIsQUFFbkIsU0FGb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxXQUV6QixLQUFLLEtBQUEsT0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTdCLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sTUFBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1NBQUEsQ0FBQyxDQUFDO0FBQ2hFLFlBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFekMsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FBQSxDQUFDLENBQUM7O0FBRTVDLFlBQUcsTUFBTSxFQUFFOztBQUNULGdCQUFJLFVBQVUsR0FBRyxNQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekQsc0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRTtrQkFBRyxNQUFNLFNBQU4sTUFBTTtxQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFJLFVBQVUsR0FBRyxNQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxxQkFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztlQUMzQyxDQUFDO2FBQUEsQ0FBQyxDQUFDOztTQUNMOztBQUVELFlBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7QUFDNUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5QztPQUNGOztlQXRCRyxRQUFRLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBN0IsUUFBUTtBQXdCWixrQkFBVTs7aUJBQUEsVUFBQyxRQUFRLEVBQUU7QUFDbkIsZ0JBQUksZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7V0FDNUM7O0FBRUQsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxVQUFVLENBQUM7V0FDbkI7Ozs7YUEvQkcsUUFBUTtPQUFTLENBQUM7R0FpQ3pCLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuTG9jYWxpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG4gIGNvbnN0IExvY2FsZXMgPSByZXF1aXJlKCdsb2NhbGUnKS5Mb2NhbGVzO1xyXG5cclxuICByZXR1cm4gKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgc3VwcG9ydGVkTG9jYWxlcyB9KSA9PiB7XHJcbiAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBzdXBwb3J0ZWRMb2NhbGVzLnNob3VsZC5iZS5hbi5BcnJheVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgcGFyc2VkTG9jYWxlcyA9IG5ldyBMb2NhbGVzKHN1cHBvcnRlZExvY2FsZXMpO1xyXG5cclxuICAgIGNsYXNzIExvY2FsaXplIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcclxuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XHJcbiAgICAgICAgc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5oZWFkZXJzWydhY2NlcHQtbGFuZ3VhZ2UnXS5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICAgIGxldCBkZWZhdWx0TG9jYWxlID0gdGhpcy5leHRyYWN0TG9jYWxlKCk7XHJcblxyXG4gICAgICAgIGxldCBzdG9yZSA9IHRoaXMuZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNldC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XHJcblxyXG4gICAgICAgIGlmKHdpbmRvdykge1xyXG4gICAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmZsdXguZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XHJcbiAgICAgICAgICBkaXNwYXRjaGVyLmFkZEFjdGlvbkhhbmRsZXIoJy9Mb2NhbGl6ZS9zZXRMb2NhbGUnLCAoeyBsb2NhbGUgfSkgPT4gUHJvbWlzZS50cnkoKCkgPT4ge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBsb2NhbGUuc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGJlc3RMb2NhbGUgPSB0aGlzLmJlc3RMb2NhbGUobG9jYWxlKTtcclxuICAgICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgYmVzdExvY2FsZSk7XHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAgLy8gT25seSBzZXQgaWYgbm90aGluZ3MnIHByZXZpb3VzbHkgZmlsbGVkIHRoaXNcclxuICAgICAgICBpZighc3RvcmUuaGFzQ2FjaGVkVmFsdWUoJy9Mb2NhbGl6ZS9sb2NhbGUnKSkge1xyXG4gICAgICAgICAgc3RvcmUuc2V0KCcvTG9jYWxpemUvbG9jYWxlJywgZGVmYXVsdExvY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBiZXN0TG9jYWxlKGFjY2VwdGVkKSB7XHJcbiAgICAgICAgbGV0IGFjY2VwdGVkTG9jYWxlcyA9IG5ldyBMb2NhbGVzKGFjY2VwdGVkKTtcclxuICAgICAgICByZXR1cm4gYWNjZXB0ZWRMb2NhbGVzLmJlc3QocGFyc2VkTG9jYWxlcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnTG9jYWxpemUnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9