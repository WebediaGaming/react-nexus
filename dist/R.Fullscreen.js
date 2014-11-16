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
  return function () {
    var Fullscreen = (function (R) {
      var Fullscreen = function Fullscreen(_ref) {
        var flux = _ref.flux;
        var window = _ref.window;
        var req = _ref.req;
        var headers = _ref.headers;
        // jshint ignore:line
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(Array.from(arguments)));
        if (window) {
          void 0;
          // Client-only init
        } else {
          void 0;
          // Server-only init
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkZ1bGxzY3JlZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixTQUFPLFlBQU07UUFDTCxVQUFVLGNBQVMsQ0FBQztVQUFwQixVQUFVLEdBQ0gsU0FEUCxVQUFVLE9BQzhCO1lBQTlCLElBQUksUUFBSixJQUFJO1lBQUUsTUFBTSxRQUFOLE1BQU07WUFBRSxHQUFHLFFBQUgsR0FBRztZQUFFLE9BQU8sUUFBUCxPQUFPOztBQURqQixBQUVyQixTQUZzQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDJCQUV4QixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRTtBQUNULGVBQUssQ0FBQyxDQUFDOztTQUVSLE1BQ0k7QUFDSCxlQUFLLENBQUMsQ0FBQzs7U0FFUjtPQUNGOztlQVhHLFVBQVUsRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUEvQixVQUFVO0FBYWQsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxZQUFZLENBQUM7V0FDckI7Ozs7YUFmRyxVQUFVO09BQVMsQ0FBQzs7QUFrQjFCLFdBQU8sVUFBVSxDQUFDO0dBQ25CLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuRnVsbHNjcmVlbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY2xhc3MgRnVsbHNjcmVlbiBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIHZvaWQgMDtcbiAgICAgICAgICAvLyBDbGllbnQtb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdm9pZCAwO1xuICAgICAgICAgIC8vIFNlcnZlci1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdGdWxsc2NyZWVuJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gRnVsbHNjcmVlbjtcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=