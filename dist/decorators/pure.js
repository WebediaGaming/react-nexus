'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

function pure() {
  return function (Component) {
    return (function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        _classCallCheck(this, _class);

        _Component.apply(this, arguments);
      }

      _class.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _utilsPureShouldComponentUpdate2['default'].apply(this, args);
      };

      return _class;
    })(Component);
  };
}

pure.shouldComponentUpdate = _utilsPureShouldComponentUpdate2['default'];

exports['default'] = pure;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvcHVyZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4Q0FBc0Msb0NBQW9DOzs7O0FBRTFFLFNBQVMsSUFBSSxHQUFHO0FBQ2QsU0FBTyxVQUFDLFNBQVM7Ozs7Ozs7Ozs7dUJBQ2YscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDRDQUEwQixLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3BEOzs7T0FIaUMsU0FBUztHQUk1QyxDQUFDO0NBQ0g7O0FBRUQsSUFBSSxDQUFDLHFCQUFxQiw4Q0FBNEIsQ0FBQzs7cUJBRXhDLElBQUkiLCJmaWxlIjoiZGVjb3JhdG9ycy9wdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi4vdXRpbHMvcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSc7XHJcblxyXG5mdW5jdGlvbiBwdXJlKCkge1xyXG4gIHJldHVybiAoQ29tcG9uZW50KSA9PiBjbGFzcyBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICByZXR1cm4gcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5wdXJlLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwdXJlO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
