'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = shouldComponentUpdate;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function shouldComponentUpdate(nextProps, nextState) {
  return _lodash2['default'].any([!(0, _deepEqual2['default'])(this.props, nextProps), !(0, _deepEqual2['default'])(this.state, nextState)]);
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7cUJBR3dCLHFCQUFxQjs7c0JBSC9CLFFBQVE7Ozs7eUJBQ0EsWUFBWTs7OztBQUVuQixTQUFTLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFDbEUsU0FBTyxvQkFBRSxHQUFHLENBQUMsQ0FDWCxDQUFDLDRCQUFVLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQ2pDLENBQUMsNEJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FDbEMsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoicHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICByZXR1cm4gXy5hbnkoW1xyXG4gICAgIWRlZXBFcXVhbCh0aGlzLnByb3BzLCBuZXh0UHJvcHMpLFxyXG4gICAgIWRlZXBFcXVhbCh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpLFxyXG4gIF0pO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==