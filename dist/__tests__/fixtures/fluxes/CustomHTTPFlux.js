'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _fluxesHTTPFlux = require('../../../fluxes/HTTPFlux');

var _fluxesHTTPFlux2 = _interopRequireDefault(_fluxesHTTPFlux);

var _utilsTypes = require('../../../utils/types');

var CustomHTTPFlux = (function (_HTTPFlux) {
  _inherits(CustomHTTPFlux, _HTTPFlux);

  function CustomHTTPFlux() {
    _classCallCheck(this, CustomHTTPFlux);

    _HTTPFlux.apply(this, arguments);
  }

  _createDecoratedClass(CustomHTTPFlux, [{
    key: 'dispatch',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_utilsTypes.action)],
    value: function dispatch(_ref) {
      var type = _ref.type;
      var payload = _ref.payload;

      if (type === 'follow user') {
        var authToken = payload.authToken;
        var userId = payload.userId;

        return this.post('/users/' + userId + '/follow', { query: { authToken: authToken } });
      }
      return _Promise.reject(new TypeError('Unknown action type \'' + type + '\' for \'' + this.constructor.displayName + '\'.'));
    }
  }], [{
    key: 'displayName',
    value: 'CustomHTTPFlux',
    enumerable: true
  }]);

  return CustomHTTPFlux;
})(_fluxesHTTPFlux2['default']);

exports['default'] = CustomHTTPFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvQ3VzdG9tSFRUUEZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2tDQUE0RCxxQkFBcUI7Ozs7OEJBRTVELDBCQUEwQjs7OzswQkFDVixzQkFBc0I7O0lBRXJELGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7Ozs7d0JBQWQsY0FBYzs7aUJBSWpCLDRCQUFXLGdDQUFFLE9BQU8sRUFBRSxDQUFDLEVBRHZCLDZDQUFvQjtXQUViLGtCQUFDLElBQWlCLEVBQUU7VUFBakIsSUFBSSxHQUFOLElBQWlCLENBQWYsSUFBSTtVQUFFLE9BQU8sR0FBZixJQUFpQixDQUFULE9BQU87O0FBQ3RCLFVBQUcsSUFBSSxLQUFLLGFBQWEsRUFBRTtZQUNqQixTQUFTLEdBQWEsT0FBTyxDQUE3QixTQUFTO1lBQUUsTUFBTSxHQUFLLE9BQU8sQ0FBbEIsTUFBTTs7QUFDekIsZUFBTyxJQUFJLENBQUMsSUFBSSxhQUFXLE1BQU0sY0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDdkU7QUFDRCxhQUFPLFNBQVEsTUFBTSxDQUFDLElBQUksU0FBUyw0QkFBeUIsSUFBSSxpQkFBVSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsU0FBSyxDQUFDLENBQUM7S0FDOUc7OztXQVZvQixnQkFBZ0I7Ozs7U0FEakMsY0FBYzs7O3FCQWNMLGNBQWMiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2ZsdXhlcy9DdXN0b21IVFRQRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBULCB7IHRha2VzIGFzIGRldlRha2VzLCByZXR1cm5zIGFzIGRldlJldHVybnMgfSBmcm9tICd0eXBlY2hlY2stZGVjb3JhdG9yJztcclxuXHJcbmltcG9ydCBIVFRQRmx1eCBmcm9tICcuLi8uLi8uLi9mbHV4ZXMvSFRUUEZsdXgnO1xyXG5pbXBvcnQgeyBhY3Rpb24gYXMgYWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3R5cGVzJztcclxuXHJcbmNsYXNzIEN1c3RvbUhUVFBGbHV4IGV4dGVuZHMgSFRUUEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdDdXN0b21IVFRQRmx1eCc7XHJcblxyXG4gIEBkZXZUYWtlcyhhY3Rpb25UeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIGRpc3BhdGNoKHsgdHlwZSwgcGF5bG9hZCB9KSB7XHJcbiAgICBpZih0eXBlID09PSAnZm9sbG93IHVzZXInKSB7XHJcbiAgICAgIGNvbnN0IHsgYXV0aFRva2VuLCB1c2VySWQgfSA9IHBheWxvYWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLnBvc3QoYC91c2Vycy8ke3VzZXJJZH0vZm9sbG93YCwgeyBxdWVyeTogeyBhdXRoVG9rZW4gfSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKGBVbmtub3duIGFjdGlvbiB0eXBlICcke3R5cGV9JyBmb3IgJyR7dGhpcy5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZX0nLmApKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEN1c3RvbUhUVFBGbHV4O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
