"use strict";

var _slice = Array.prototype.slice;
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
        var headers = _ref.headers;

        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));
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

    return Cordova;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvcmRvdmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sVUFBQyxNQUFNLEVBQUs7UUFDWCxPQUFPLGNBQVMsQ0FBQztVQUFqQixPQUFPLEdBQ0EsU0FEUCxPQUFPLE9BQ2lDO1lBQTlCLElBQUksUUFBSixJQUFJO1lBQUUsTUFBTSxRQUFOLE1BQU07WUFBRSxHQUFHLFFBQUgsR0FBRztZQUFFLE9BQU8sUUFBUCxPQUFPOztBQURwQixBQUVsQixTQUZtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLFlBQVosQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDRCQUVyQixTQUFTLEdBQUMsQ0FBQztBQUNwQixZQUFHLE1BQU0sRUFBRSxFQUVWLE1BQ0ksRUFFSjtPQUNGOztlQVRHLE9BQU8sRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE1QixPQUFPO0FBV1gsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxTQUFTLENBQUM7V0FDbEI7Ozs7YUFiRyxPQUFPO09BQVMsQ0FBQzs7OztBQWdCdkIsV0FBTyxPQUFPLENBQUM7R0FDaEIsQ0FBQztDQUNILENBQUMiLCJmaWxlIjoiUi5Db3Jkb3ZhLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgcmV0dXJuIChwYXJhbXMpID0+IHtcbiAgICBjbGFzcyBDb3Jkb3ZhIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICBpZih3aW5kb3cpIHtcbiAgICAgICAgICAvLyBDbGllbnQtb25seSBpbml0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLy8gU2VydmVyLW9ubHkgaW5pdFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0NvcmRvdmEnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDb3Jkb3ZhO1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==