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
    var _Fullscreen = (function (R) {
      var _Fullscreen = function _Fullscreen(_ref) {
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

      _extends(_Fullscreen, R.App.Plugin);

      _classProps(_Fullscreen, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Fullscreen";
          }
        }
      });

      return _Fullscreen;
    })(R);

    return _Fullscreen;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRnVsbHNjcmVlbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sWUFBTTtRQUNMLFdBQVUsY0FBUyxDQUFDO1VBQXBCLFdBQVUsR0FDSCxTQURQLFdBQVUsT0FDOEI7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRGpCLEFBRXJCLFNBRnNCLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXhCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsTUFBTSxFQUFFO0FBQ1QsZUFBSyxDQUFDLENBQUM7O1NBRVIsTUFDSTtBQUNILGVBQUssQ0FBQyxDQUFDOztTQUVSO09BQ0Y7O2VBWEcsV0FBVSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQS9CLFdBQVU7QUFhZCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFlBQVksQ0FBQztXQUNyQjs7OzthQWZHLFdBQVU7T0FBUyxDQUFDOztBQWtCMUIsV0FBTyxXQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5GdWxsc2NyZWVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgcmV0dXJuICgpID0+IHtcclxuICAgIGNsYXNzIEZ1bGxzY3JlZW4gZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xyXG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICBpZih3aW5kb3cpIHtcclxuICAgICAgICAgIHZvaWQgMDtcclxuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2b2lkIDA7XHJcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gJ0Z1bGxzY3JlZW4nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIEZ1bGxzY3JlZW47XHJcbiAgfTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9