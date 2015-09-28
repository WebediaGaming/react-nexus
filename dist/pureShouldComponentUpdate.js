'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = shouldComponentUpdate;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function shouldComponentUpdate(nextProps, nextState) {
  return _lodash2['default'].any([!_deepEqual2['default'](this.props, nextProps), !_deepEqual2['default'](this.state, nextState)]);
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUd3QixxQkFBcUI7O3NCQUgvQixRQUFROzs7O3lCQUNBLFlBQVk7Ozs7QUFFbkIsU0FBUyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQ2xFLFNBQU8sb0JBQUUsR0FBRyxDQUFDLENBQ1gsQ0FBQyx1QkFBVSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUNqQyxDQUFDLHVCQUFVLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQ2xDLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6InB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgcmV0dXJuIF8uYW55KFtcclxuICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcywgbmV4dFByb3BzKSxcclxuICAgICFkZWVwRXF1YWwodGhpcy5zdGF0ZSwgbmV4dFN0YXRlKSxcclxuICBdKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
