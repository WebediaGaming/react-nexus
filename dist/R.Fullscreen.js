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

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZ1bGxzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLFVBQVUsY0FBUyxDQUFDO1VBQXBCLFVBQVUsR0FDSCxTQURQLFVBQVUsT0FDOEI7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRGpCLEFBRXJCLFNBRnNCLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXhCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsTUFBTSxFQUFFLEVBRVYsTUFDSSxFQUVKO09BQ0Y7O2VBVEcsVUFBVSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQS9CLFVBQVU7QUFXZCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFlBQVksQ0FBQztXQUNyQjs7OzthQWJHLFVBQVU7T0FBUyxDQUFDOzs7O0FBZ0IxQixXQUFPLFVBQVUsQ0FBQztHQUNuQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkZ1bGxzY3JlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICByZXR1cm4gKHBhcmFtcykgPT4ge1xuICAgIGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnRnVsbHNjcmVlbic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEZ1bGxzY3JlZW47XG4gIH07XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9