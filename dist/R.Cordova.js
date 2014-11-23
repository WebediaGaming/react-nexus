"use strict";

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
  function Plugin(opts) {
    if (opts === undefined) opts = {};
    var _Cordova = (function (R) {
      var _Cordova = function _Cordova() {
        R.App.Plugin.apply(this, arguments);
      };

      _extends(_Cordova, R.App.Plugin);

      return _Cordova;
    })(R);

    return _Cordova;
  }

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuQ29yZG92YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixXQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQU87UUFBWCxJQUFJLGdCQUFKLElBQUksR0FBRyxFQUFFO1FBQ2pCLFFBQU8sY0FBUyxDQUFDO1VBQWpCLFFBQU8sWUFBUCxRQUFPO0FBQVMsU0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOzs7ZUFBNUIsUUFBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7YUFBNUIsUUFBTztPQUFTLENBQUM7O0FBSXZCLFdBQU8sUUFBTyxDQUFDO0dBQ2hCOztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkNvcmRvdmEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdHMgPSB7fSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICBjbGFzcyBDb3Jkb3ZhIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIC8vIFRPRE9cbiAgICB9XG5cbiAgICByZXR1cm4gQ29yZG92YTtcbiAgfVxuXG4gIHJldHVybiBQbHVnaW47XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9