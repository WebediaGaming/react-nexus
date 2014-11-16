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
    var Cordova = (function (R) {
      var Cordova = function Cordova(_ref) {
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

    return Cordova;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkNvcmRvdmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixTQUFPLFlBQU07UUFDTCxPQUFPLGNBQVMsQ0FBQztVQUFqQixPQUFPLEdBQ0EsU0FEUCxPQUFPLE9BQ2lDO1lBQTlCLElBQUksUUFBSixJQUFJO1lBQUUsTUFBTSxRQUFOLE1BQU07WUFBRSxHQUFHLFFBQUgsR0FBRztZQUFFLE9BQU8sUUFBUCxPQUFPOztBQURwQixBQUVsQixTQUZtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDJCQUVyQixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRTtBQUNULGVBQUssQ0FBQyxDQUFDOztTQUVSLE1BQ0k7QUFDSCxlQUFLLENBQUMsQ0FBQzs7U0FFUjtPQUNGOztlQVhHLE9BQU8sRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE1QixPQUFPO0FBYVgsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxTQUFTLENBQUM7V0FDbEI7Ozs7YUFmRyxPQUFPO09BQVMsQ0FBQzs7QUFrQnZCLFdBQU8sT0FBTyxDQUFDO0dBQ2hCLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuQ29yZG92YS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY2xhc3MgQ29yZG92YSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIGlmKHdpbmRvdykge1xuICAgICAgICAgIHZvaWQgMDtcbiAgICAgICAgICAvLyBDbGllbnQtb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdm9pZCAwO1xuICAgICAgICAgIC8vIFNlcnZlci1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdDb3Jkb3ZhJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ29yZG92YTtcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=