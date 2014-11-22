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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkxvY2FsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUUxQyxXQUFTLFVBQVUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUU7QUFDckQsUUFBSSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsUUFBSSxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxXQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDakM7O0FBRUQsU0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFxRDtRQUFsRCxTQUFTLFFBQVQsU0FBUztRQUFFLGNBQWMsUUFBZCxjQUFjO1FBQUUsZ0JBQWdCLFFBQWhCLGdCQUFnQjs7QUFDNUQsS0FBQyxDQUFDLEdBQUcsQ0FBQzthQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUs7S0FBQSxDQUNwQyxDQUFDOztRQUVJLFFBQVEsY0FBUyxDQUFDO1VBQWxCLFFBQVEsR0FDRCxTQURQLFFBQVEsUUFDZ0M7O1lBQTlCLElBQUksU0FBSixJQUFJO1lBQUUsTUFBTSxTQUFOLE1BQU07WUFBRSxHQUFHLFNBQUgsR0FBRztZQUFFLE9BQU8sU0FBUCxPQUFPOztBQURuQixBQUVuQixTQUZvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFdBRXpCLFVBQUssT0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTdCLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUFBLENBQUMsQ0FBQztBQUMzRCxZQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFN0UsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUMsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FBQSxDQUFDLENBQUM7O0FBRTVDLFlBQUcsTUFBTSxFQUFFOztBQUNULGdCQUFJLFVBQVUsR0FBRyxNQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekQsc0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRTtrQkFBRyxNQUFNLFNBQU4sTUFBTTtxQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQU07QUFDbkYsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07aUJBQUEsQ0FBQyxDQUFDO0FBQ3ZDLHFCQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2VBQ3JFLENBQUM7YUFBQSxDQUFDLENBQUM7O1NBQ0w7O0FBRUQsWUFBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsRUFBRTtBQUM1QyxlQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQzlDO09BQ0Y7O2VBckJHLFFBQVEsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE3QixRQUFRO0FBdUJaLHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sVUFBVSxDQUFDO1dBQ25COzs7O2FBekJHLFFBQVE7T0FBUyxDQUFDOzs7O0FBNEJ4QixXQUFPLFFBQVEsQ0FBQztHQUNqQixFQUFFLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLkxvY2FsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IExvY2FsZXMgPSByZXF1aXJlKCdsb2NhbGUnKS5Mb2NhbGVzO1xyXG5cclxuICBmdW5jdGlvbiBiZXN0TG9jYWxlKGFjY2VwdGVkTG9jYWxlcywgc3VwcG9ydGVkTG9jYWxlcykge1xyXG4gICAgbGV0IGFjY2VwdGVkID0gbmV3IExvY2FsZXMoYWNjZXB0ZWRMb2NhbGVzKTtcclxuICAgIGxldCBzdXBwb3J0ZWQgPSBuZXcgTG9jYWxlcyhzdXBwb3J0ZWRMb2NhbGVzKTtcclxuICAgIHJldHVybiBhY2NlcHRlZC5iZXN0KHN1cHBvcnRlZCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gXy5leHRlbmQoKHsgc3RvcmVOYW1lLCBkaXNwYXRjaGVyTmFtZSwgc3VwcG9ydGVkTG9jYWxlcyB9KSA9PiB7XHJcbiAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICBzdXBwb3J0ZWRMb2NhbGVzLnNob3VsZC5iZS5hbi5BcnJheVxyXG4gICAgKTtcclxuXHJcbiAgICBjbGFzcyBMb2NhbGl6ZSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgICAgbGV0IGRlZmF1bHRMb2NhbGUgPSBiZXN0TG9jYWxlKGhlYWRlcnNbJ2FjY2VwdC1sYW5ndWFnZSddLCBzdXBwb3J0ZWRMb2NhbGVzKTtcclxuXHJcbiAgICAgICAgbGV0IHN0b3JlID0gdGhpcy5mbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2V0LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IHRoaXMuZmx1eC5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcclxuICAgICAgICAgIGRpc3BhdGNoZXIuYWRkQWN0aW9uSGFuZGxlcignL0xvY2FsaXplL3NldExvY2FsZScsICh7IGxvY2FsZSB9KSA9PiBQcm9taXNlLnRyeSgoKSA9PiB7XHJcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGxvY2FsZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICAgICAgICBzdG9yZS5zZXQoJy9Mb2NhbGl6ZS9sb2NhbGUnLCBiZXN0TG9jYWxlKGxvY2FsZSwgc3VwcG9ydGVkTG9jYWxlcykpO1xyXG4gICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgIC8vIE9ubHkgc2V0IGlmIG5vdGhpbmdzJyBwcmV2aW91c2x5IGZpbGxlZCB0aGlzXHJcbiAgICAgICAgaWYoIXN0b3JlLmhhc0NhY2hlZFZhbHVlKCcvTG9jYWxpemUvbG9jYWxlJykpIHtcclxuICAgICAgICAgIHN0b3JlLnNldCgnL0xvY2FsaXplL2xvY2FsZScsIGRlZmF1bHRMb2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdMb2NhbGl6ZSc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTG9jYWxpemU7XHJcbiAgfSwgeyBiZXN0TG9jYWxlIH0pO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=