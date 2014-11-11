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
    var Cordova = (function (R) {
      var Cordova = function Cordova(_ref) {
        var flux = _ref.flux;
        var window = _ref.window;
        var req = _ref.req;

        R.App.Plugin.call(this);
        if (window) {} else {}
      };

      _extends(Cordova, R.App.Plugin);

      _classProps(Cordova, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Cordova";
          }
        }
      });

      return Cordova;
    })(R);

    _.extend(Cordova.prototype, {
      displayName: "Cordova" });

    return Cordova;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvcmRvdmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLE9BQU8sY0FBUyxDQUFDO1VBQWpCLE9BQU8sR0FDQSxTQURQLE9BQU8sT0FDd0I7WUFBckIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHOztBQURYLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sV0FFdkIsQ0FBQztBQUNSLFlBQUcsTUFBTSxFQUFFLEVBRVYsTUFDSSxFQUVKO09BQ0Y7O2VBVEcsT0FBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLE9BQU87QUFXWCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQWJHLE9BQU87T0FBUyxDQUFDOzs7O0FBZ0J2QixLQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7QUFDMUIsaUJBQVcsRUFBRSxTQUFTLEVBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxXQUFPLE9BQU8sQ0FBQztHQUNoQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLkNvcmRvdmEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICByZXR1cm4gKHBhcmFtcykgPT4ge1xuICAgIGNsYXNzIENvcmRvdmEgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQ29yZG92YSc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoQ29yZG92YS5wcm90b3R5cGUsIHtcbiAgICAgIGRpc3BsYXlOYW1lOiAnQ29yZG92YScsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gQ29yZG92YTtcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=