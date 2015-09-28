'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

function pure(Component) {
  if (!Component) {
    return pure;
  }
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
}

pure.shouldComponentUpdate = _utilsPureShouldComponentUpdate2['default'];

exports['default'] = pure;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvcHVyZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4Q0FBc0Msb0NBQW9DOzs7O0FBRTFFLFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixNQUFHLENBQUMsU0FBUyxFQUFFO0FBQ2IsV0FBTyxJQUFJLENBQUM7R0FDYjtBQUNEOzs7Ozs7Ozs7cUJBQ0UscUJBQXFCLEdBQUEsaUNBQVU7d0NBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUMzQixhQUFPLDRDQUEwQixLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BEOzs7S0FIa0IsU0FBUyxFQUk1QjtDQUNIOztBQUVELElBQUksQ0FBQyxxQkFBcUIsOENBQTRCLENBQUM7O3FCQUV4QyxJQUFJIiwiZmlsZSI6ImRlY29yYXRvcnMvcHVyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlIGZyb20gJy4uL3V0aWxzL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuZnVuY3Rpb24gcHVyZShDb21wb25lbnQpIHtcclxuICBpZighQ29tcG9uZW50KSB7XHJcbiAgICByZXR1cm4gcHVyZTtcclxuICB9XHJcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZSguLi5hcmdzKSB7XHJcbiAgICAgIHJldHVybiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbnB1cmUuc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHB1cmU7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
