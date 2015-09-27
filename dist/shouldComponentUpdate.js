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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3VsZENvbXBvbmVudFVwZGF0ZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztxQkFHd0IscUJBQXFCOztzQkFIL0IsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O0FBRW5CLFNBQVMscUJBQXFCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUNsRSxTQUFPLG9CQUFFLEdBQUcsQ0FBQyxDQUNYLENBQUMsNEJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFDakMsQ0FBQyw0QkFBVSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUNsQyxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJzaG91bGRDb21wb25lbnRVcGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XHJcbiAgcmV0dXJuIF8uYW55KFtcclxuICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcywgbmV4dFByb3BzKSxcclxuICAgICFkZWVwRXF1YWwodGhpcy5zdGF0ZSwgbmV4dFN0YXRlKSxcclxuICBdKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=