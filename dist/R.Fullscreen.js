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
    var _Fullscreen = (function (R) {
      var _Fullscreen = function _Fullscreen() {
        R.App.Plugin.apply(this, arguments);
      };

      _extends(_Fullscreen, R.App.Plugin);

      return _Fullscreen;
    })(R);

    return _Fullscreen;
  }

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRnVsbHNjcmVlbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixXQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQU87UUFBWCxJQUFJLGdCQUFKLElBQUksR0FBRyxFQUFFO1FBQ2pCLFdBQVUsY0FBUyxDQUFDO1VBQXBCLFdBQVUsWUFBVixXQUFVO0FBQVMsU0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOzs7ZUFBL0IsV0FBVSxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7YUFBL0IsV0FBVTtPQUFTLENBQUM7O0FBSTFCLFdBQU8sV0FBVSxDQUFDO0dBQ25COztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkZ1bGxzY3JlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdHMgPSB7fSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICBjbGFzcyBGdWxsc2NyZWVuIGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIC8vIFRPRE9cbiAgICB9XG5cbiAgICByZXR1cm4gRnVsbHNjcmVlbjtcbiAgfVxuXG4gIHJldHVybiBQbHVnaW47XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9