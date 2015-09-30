'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

exports.__esModule = true;
var $prepare = _Symbol('preparable');

function preparable(prepare) {
  return function $preparable(Component) {
    return (function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        _classCallCheck(this, _class);

        _Component.apply(this, arguments);
      }

      _class[$prepare] = function (props) {
        if (Component[$prepare]) {
          return _Promise.all(Component[$prepare](props), prepare(props));
        }
        return prepare(props);
      };

      return _class;
    })(Component);
  };
}

preparable.$prepare = $prepare;

exports['default'] = preparable;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvcHJlcGFyYWJsZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFFBQVEsR0FBRyxRQUFPLFlBQVksQ0FBQyxDQUFDOztBQUV0QyxTQUFTLFVBQVUsQ0FBQyxPQUFPLEVBQUU7QUFDM0IsU0FBTyxTQUFTLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDckM7Ozs7Ozs7OzthQUNVLFFBQVEsSUFBQyxVQUFDLEtBQUssRUFBRTtBQUN2QixZQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN0QixpQkFBTyxTQUFRLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDaEU7QUFDRCxlQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN2Qjs7O09BTmtCLFNBQVMsRUFPNUI7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsVUFBVSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O3FCQUVoQixVQUFVIiwiZmlsZSI6ImRlY29yYXRvcnMvcHJlcGFyYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0ICRwcmVwYXJlID0gU3ltYm9sKCdwcmVwYXJhYmxlJyk7XHJcblxyXG5mdW5jdGlvbiBwcmVwYXJhYmxlKHByZXBhcmUpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gJHByZXBhcmFibGUoQ29tcG9uZW50KSB7XHJcbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgICBzdGF0aWMgWyRwcmVwYXJlXShwcm9wcykge1xyXG4gICAgICAgIGlmKENvbXBvbmVudFskcHJlcGFyZV0pIHtcclxuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChDb21wb25lbnRbJHByZXBhcmVdKHByb3BzKSwgcHJlcGFyZShwcm9wcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlcGFyZShwcm9wcyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxufVxyXG5cclxucHJlcGFyYWJsZS4kcHJlcGFyZSA9ICRwcmVwYXJlO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJlcGFyYWJsZTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
