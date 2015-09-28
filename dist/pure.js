'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = pure;

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

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

        return _pureShouldComponentUpdate2['default'].apply(this, args);
      };

      return _class;
    })(Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1cmUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztxQkFDd0IsSUFBSTs7eUNBRFUsNkJBQTZCOzs7O0FBQ3BELFNBQVMsSUFBSSxHQUFHO0FBQzdCLFNBQU8sVUFBQyxTQUFTOzs7Ozs7Ozs7O3VCQUNmLHFCQUFxQixHQUFBLGlDQUFVOzBDQUFOLElBQUk7QUFBSixjQUFJOzs7QUFDM0IsZUFBTyx1Q0FBMEIsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNwRDs7O09BSGlDLFNBQVM7R0FJNUMsQ0FBQztDQUNIIiwiZmlsZSI6InB1cmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwdXJlKCkge1xyXG4gIHJldHVybiAoQ29tcG9uZW50KSA9PiBjbGFzcyBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICByZXR1cm4gcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
