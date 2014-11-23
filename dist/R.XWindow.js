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
    var _XWindow = (function (R) {
      var _XWindow = function _XWindow() {
        R.App.Plugin.apply(this, arguments);
      };

      _extends(_XWindow, R.App.Plugin);

      return _XWindow;
    })(R);

    return _XWindow;
  }

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuWFdpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixXQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQU87UUFBWCxJQUFJLGdCQUFKLElBQUksR0FBRyxFQUFFO1FBQ2pCLFFBQU8sY0FBUyxDQUFDO1VBQWpCLFFBQU8sWUFBUCxRQUFPO0FBQVMsU0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNOzs7ZUFBNUIsUUFBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7YUFBNUIsUUFBTztPQUFTLENBQUM7O0FBSXZCLFdBQU8sUUFBTyxDQUFDO0dBQ2hCOztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLlhXaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgZnVuY3Rpb24gUGx1Z2luKG9wdHMgPSB7fSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICBjbGFzcyBYV2luZG93IGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIC8vIFRPRE9cbiAgICB9XG5cbiAgICByZXR1cm4gWFdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBQbHVnaW47XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9