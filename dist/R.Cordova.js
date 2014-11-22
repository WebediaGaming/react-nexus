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
    var _Cordova = (function (R) {
      var _Cordova = function _Cordova(_ref) {
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

      _extends(_Cordova, R.App.Plugin);

      _classProps(_Cordova, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Cordova";
          }
        }
      });

      return _Cordova;
    })(R);

    return _Cordova;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuQ29yZG92YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sWUFBTTtRQUNMLFFBQU8sY0FBUyxDQUFDO1VBQWpCLFFBQU8sR0FDQSxTQURQLFFBQU8sT0FDaUM7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRHBCLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXJCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsTUFBTSxFQUFFO0FBQ1QsZUFBSyxDQUFDLENBQUM7O1NBRVIsTUFDSTtBQUNILGVBQUssQ0FBQyxDQUFDOztTQUVSO09BQ0Y7O2VBWEcsUUFBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLFFBQU87QUFhWCxzQkFBYzs7aUJBQUEsWUFBRztBQUNmLG1CQUFPLFNBQVMsQ0FBQztXQUNsQjs7OzthQWZHLFFBQU87T0FBUyxDQUFDOztBQWtCdkIsV0FBTyxRQUFPLENBQUM7R0FDaEIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5Db3Jkb3ZhLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgcmV0dXJuICgpID0+IHtcclxuICAgIGNsYXNzIENvcmRvdmEgZXh0ZW5kcyBSLkFwcC5QbHVnaW4ge1xyXG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHdpbmRvdywgcmVxLCBoZWFkZXJzIH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICBpZih3aW5kb3cpIHtcclxuICAgICAgICAgIHZvaWQgMDtcclxuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2b2lkIDA7XHJcbiAgICAgICAgICAvLyBTZXJ2ZXItb25seSBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gJ0NvcmRvdmEnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIENvcmRvdmE7XHJcbiAgfTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9