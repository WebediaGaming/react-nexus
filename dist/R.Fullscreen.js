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
  return function (params) {
    var Fullscreen = (function (R) {
      var Fullscreen = function Fullscreen(_ref) {
        var flux = _ref.flux;
        var window = _ref.window;
        var req = _ref.req;
        var headers = _ref.headers;

        R.App.Plugin.prototype.apply.call(this, this, arguments);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZ1bGxzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLFVBQVUsY0FBUyxDQUFDO1VBQXBCLFVBQVUsR0FDSCxTQURQLFVBQVUsT0FDOEI7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRGpCLEFBRXJCLFNBRnNCLENBQUMsR0FBRyxDQUFDLE1BQU0sV0FFM0IsVUFBSyxPQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM3QixZQUFHLE1BQU0sRUFBRSxFQUVWLE1BQ0ksRUFFSjtPQUNGOztlQVRHLFVBQVUsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUEvQixVQUFVO0FBV2Qsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxZQUFZLENBQUM7V0FDckI7Ozs7YUFiRyxVQUFVO09BQVMsQ0FBQzs7OztBQWdCMUIsV0FBTyxVQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5GdWxsc2NyZWVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICByZXR1cm4gKHBhcmFtcykgPT4ge1xyXG4gICAgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgaWYod2luZG93KSB7XHJcbiAgICAgICAgICAvLyBDbGllbnQtb25seSBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgLy8gU2VydmVyLW9ubHkgaW5pdFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdGdWxsc2NyZWVuJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBGdWxsc2NyZWVuO1xyXG4gIH07XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==