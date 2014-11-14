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
  return function (params) {
    var Fullscreen = (function (R) {
      var Fullscreen = function Fullscreen(_ref) {
        var flux = _ref.flux;
        var window = _ref.window;
        var req = _ref.req;
        var headers = _ref.headers;

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));
        if (window) {} else {}
      };

      _extends(Fullscreen, R.App.Plugin);

      _classProps(Fullscreen, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Fullscreen";
          }
        }
      });

      return Fullscreen;
    })(R);

    return Fullscreen;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZ1bGxzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sVUFBQyxNQUFNLEVBQUs7UUFDWCxVQUFVLGNBQVMsQ0FBQztVQUFwQixVQUFVLEdBQ0gsU0FEUCxVQUFVLE9BQzhCO1lBQTlCLElBQUksUUFBSixJQUFJO1lBQUUsTUFBTSxRQUFOLE1BQU07WUFBRSxHQUFHLFFBQUgsR0FBRztZQUFFLE9BQU8sUUFBUCxPQUFPOztBQURqQixBQUVyQixTQUZzQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDRCQUV4QixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRSxFQUVWLE1BQ0ksRUFFSjtPQUNGOztlQVRHLFVBQVUsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUEvQixVQUFVO0FBV2Qsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxZQUFZLENBQUM7V0FDckI7Ozs7YUFiRyxVQUFVO09BQVMsQ0FBQzs7OztBQWdCMUIsV0FBTyxVQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5GdWxsc2NyZWVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICByZXR1cm4gKHBhcmFtcykgPT4ge1xyXG4gICAgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICAvLyBDbGllbnQtb25seSBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgLy8gU2VydmVyLW9ubHkgaW5pdFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdGdWxsc2NyZWVuJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBGdWxsc2NyZWVuO1xyXG4gIH07XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==