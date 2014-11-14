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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5GdWxsc2NyZWVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLFVBQVUsY0FBUyxDQUFDO1VBQXBCLFVBQVUsR0FDSCxTQURQLFVBQVUsT0FDOEI7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87QUFEakIsQUFFckIsU0FGc0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxZQUFaLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSwyQkFFeEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsWUFBRyxNQUFNLEVBQUUsRUFFVixNQUNJLEVBRUo7T0FDRjs7ZUFURyxVQUFVLEVBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOztrQkFBL0IsVUFBVTtBQVdkLHNCQUFjOztpQkFBQSxZQUFHO0FBQ2YsbUJBQU8sWUFBWSxDQUFDO1dBQ3JCOzs7O2FBYkcsVUFBVTtPQUFTLENBQUM7O0FBZ0IxQixXQUFPLFVBQVUsQ0FBQztHQUNuQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkZ1bGxzY3JlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIHJldHVybiAocGFyYW1zKSA9PiB7XHJcbiAgICBjbGFzcyBGdWxsc2NyZWVuIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcclxuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSwgaGVhZGVycyB9KSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICBpZih3aW5kb3cpIHtcclxuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gJ0Z1bGxzY3JlZW4nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIEZ1bGxzY3JlZW47XHJcbiAgfTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9