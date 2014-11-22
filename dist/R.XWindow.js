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
    var _XWindow = (function (R) {
      var _XWindow = function _XWindow(_ref) {
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

      _extends(_XWindow, R.App.Plugin);

      _classProps(_XWindow, null, {
        destroy: {
          writable: true,
          value: function () {}
        },
        getDisplayName: {
          writable: true,
          value: function () {
            return "XWindow";
          }
        }
      });

      return _XWindow;
    })(R);

    return _XWindow;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuWFdpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sWUFBTTtRQUNMLFFBQU8sY0FBUyxDQUFDO1VBQWpCLFFBQU8sR0FDQSxTQURQLFFBQU8sT0FDaUM7WUFBOUIsSUFBSSxRQUFKLElBQUk7WUFBRSxNQUFNLFFBQU4sTUFBTTtZQUFFLEdBQUcsUUFBSCxHQUFHO1lBQUUsT0FBTyxRQUFQLE9BQU87O0FBRHBCLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sWUFBWixDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sMkJBRXJCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFlBQUcsTUFBTSxFQUFFO0FBQ1QsZUFBSyxDQUFDLENBQUM7O1NBRVIsTUFDSTtBQUNILGVBQUssQ0FBQyxDQUFDOztTQUVSO09BQ0Y7O2VBWEcsUUFBTyxFQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTs7a0JBQTVCLFFBQU87QUFhWCxlQUFPOztpQkFBQSxZQUFHLEVBRVQ7O0FBRUQsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxTQUFTLENBQUM7V0FDbEI7Ozs7YUFuQkcsUUFBTztPQUFTLENBQUM7O0FBc0J2QixXQUFPLFFBQU8sQ0FBQztHQUNoQixDQUFDO0NBQ0gsQ0FBQyIsImZpbGUiOiJSLlhXaW5kb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBjbGFzcyBYV2luZG93IGV4dGVuZHMgUi5BcHAuUGx1Z2luIHtcbiAgICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgd2luZG93LCByZXEsIGhlYWRlcnMgfSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgaWYod2luZG93KSB7XG4gICAgICAgICAgdm9pZCAwO1xuICAgICAgICAgIC8vIENsaWVudC1vbmx5IGluaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2b2lkIDA7XG4gICAgICAgICAgLy8gU2VydmVyLW9ubHkgaW5pdFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIE5vLW9wLlxuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdYV2luZG93JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWFdpbmRvdztcbiAgfTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=