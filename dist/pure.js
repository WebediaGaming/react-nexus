'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = pure;

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

function pure() {
  return function (Component) {
    return (function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
      }

      _createClass(_class, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _pureShouldComponentUpdate2['default'].apply(this, args);
        }
      }]);

      return _class;
    })(Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1cmUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztxQkFDd0IsSUFBSTs7eUNBRFUsNkJBQTZCOzs7O0FBQ3BELFNBQVMsSUFBSSxHQUFHO0FBQzdCLFNBQU8sVUFBQyxTQUFTOzs7Ozs7Ozs7Ozs7ZUFDTSxpQ0FBVTs0Q0FBTixJQUFJO0FBQUosZ0JBQUk7OztBQUMzQixpQkFBTyx1Q0FBMEIsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwRDs7OztPQUhpQyxTQUFTO0dBSTVDLENBQUM7Q0FDSCIsImZpbGUiOiJwdXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHVyZSgpIHtcclxuICByZXR1cm4gKENvbXBvbmVudCkgPT4gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgcmV0dXJuIHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=