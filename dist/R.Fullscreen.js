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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkZ1bGxzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixTQUFPLFVBQUMsTUFBTSxFQUFLO1FBQ1gsVUFBVSxjQUFTLENBQUM7VUFBcEIsVUFBVSxHQUNILFNBRFAsVUFBVSxPQUM4QjtZQUE5QixJQUFJLFFBQUosSUFBSTtZQUFFLE1BQU0sUUFBTixNQUFNO1lBQUUsR0FBRyxRQUFILEdBQUc7WUFBRSxPQUFPLFFBQVAsT0FBTztBQURqQixBQUVyQixTQUZzQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDJCQUV4QixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRSxFQUVWLE1BQ0ksRUFFSjtPQUNGOztlQVRHLFVBQVUsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUEvQixVQUFVO0FBV2Qsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxZQUFZLENBQUM7V0FDckI7Ozs7YUFiRyxVQUFVO09BQVMsQ0FBQzs7QUFnQjFCLFdBQU8sVUFBVSxDQUFDO0dBQ25CLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuRnVsbHNjcmVlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgcmV0dXJuIChwYXJhbXMpID0+IHtcclxuICAgIGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xyXG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHtcclxuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICAgIGlmKHdpbmRvdykge1xyXG4gICAgICAgICAgLy8gQ2xpZW50LW9ubHkgaW5pdFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIC8vIFNlcnZlci1vbmx5IGluaXRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICAgIHJldHVybiAnRnVsbHNjcmVlbic7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRnVsbHNjcmVlbjtcclxuICB9O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=