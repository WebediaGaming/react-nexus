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
    var XWindow = (function (R) {
      var XWindow = function XWindow(_ref) {
        var flux = _ref.flux;
        var window = _ref.window;
        var req = _ref.req;
        var headers = _ref.headers;

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));
        if (window) {} else {}
      };

      _extends(XWindow, R.App.Plugin);

      _classProps(XWindow, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "XWindow";
          }
        }
      });

      return XWindow;
    })(R);

    return XWindow;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlhXaW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLE9BQU8sY0FBUyxDQUFDO1VBQWpCLE9BQU8sR0FDQSxTQURQLE9BQU8sT0FDaUM7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRHBCLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXJCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsTUFBTSxFQUFFLEVBRVYsTUFDSSxFQUVKO09BQ0Y7O2VBVEcsT0FBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLE9BQU87QUFXWCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQWJHLE9BQU87T0FBUyxDQUFDOzs7O0FBZ0J2QixXQUFPLE9BQU8sQ0FBQztHQUNoQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLlhXaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICByZXR1cm4gKHBhcmFtcykgPT4ge1xuICAgIGNsYXNzIFhXaW5kb3cgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnWFdpbmRvdyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFhXaW5kb3c7XG4gIH07XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9