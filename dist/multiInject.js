'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = multiInject;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _MultiInjector = require('./MultiInjector');

var _MultiInjector2 = _interopRequireDefault(_MultiInjector);

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

var __DEV__ = process.env.NODE_ENV === 'development';

function multiInject(getBindings) {
  var customShouldComponentUpdate = arguments.length <= 1 || arguments[1] === undefined ? _pureShouldComponentUpdate2['default'] : arguments[1];

  if (__DEV__) {
    _shouldAsFunction2['default'](getBindings).be.a.Function();
  }
  return function (Component) {
    return (function (_React$Component) {
      _inherits(DecoratedMultiInjector, _React$Component);

      function DecoratedMultiInjector() {
        _classCallCheck(this, DecoratedMultiInjector);

        _React$Component.apply(this, arguments);
      }

      DecoratedMultiInjector.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return customShouldComponentUpdate.apply(this, args);
      };

      DecoratedMultiInjector.prototype.render = function render() {
        var _this = this;

        var bindings = getBindings(this.props, this.context);
        if (__DEV__) {
          _lodash2['default'].each(bindings, function (_ref) {
            var flux = _ref.flux;
            return flux.should.be.an.instanceOf(_Flux2['default']);
          });
        }
        return _react2['default'].createElement(
          _MultiInjector2['default'],
          bindings,
          function (multiValues) {
            return _react2['default'].createElement(Component, _Object$assign({}, _this.props, _lodash2['default'].mapValues(multiValues, function (value) {
              return _lodash2['default'].last(value);
            })));
          }
        );
      };

      _createClass(DecoratedMultiInjector, null, [{
        key: 'displayName',
        value: '@multiInject',
        enumerable: true
      }]);

      return DecoratedMultiInjector;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm11bHRpSW5qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3FCQVN3QixXQUFXOztzQkFUckIsUUFBUTs7OztxQkFDSixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztvQkFHdEIsUUFBUTs7Ozs2QkFDQyxpQkFBaUI7Ozs7eUNBQ0wsNkJBQTZCOzs7O0FBSm5FLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFNeEMsU0FBUyxXQUFXLENBQUMsV0FBVyxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQzFFLE1BQUcsT0FBTyxFQUFFO0FBQ1Ysa0NBQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNyQztBQUNELFNBQU8sVUFBQyxTQUFTOztnQkFBVyxzQkFBc0I7O2VBQXRCLHNCQUFzQjs4QkFBdEIsc0JBQXNCOzs7OztBQUF0Qiw0QkFBc0IsV0FHaEQscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEQ7O0FBTHlCLDRCQUFzQixXQU9oRCxNQUFNLEdBQUEsa0JBQUc7OztBQUNQLFlBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxZQUFHLE9BQU8sRUFBRTtBQUNWLDhCQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFRO2dCQUFOLElBQUksR0FBTixJQUFRLENBQU4sSUFBSTttQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtXQUFBLENBQUMsQ0FBQztTQUNwRTtBQUNELGVBQU87O1VBQW1CLFFBQVE7VUFBRyxVQUFDLFdBQVc7bUJBQy9DLGlDQUFDLFNBQVMsRUFBSyxlQUFjLEVBQUUsRUFBRSxNQUFLLEtBQUssRUFBRSxvQkFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSztxQkFBSyxvQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQUEsQ0FBQyxDQUFDLENBQUk7V0FBQTtTQUNyRixDQUFDO09BQ25COzttQkFmeUIsc0JBQXNCOzs7Ozs7YUFBdEIsc0JBQXNCO09BQVMsbUJBQU0sU0FBUztHQWdCekUsQ0FBQztDQUNIIiwiZmlsZSI6Im11bHRpSW5qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICcuL0ZsdXgnO1xyXG5pbXBvcnQgTXVsdGlJbmplY3RvciBmcm9tICcuL011bHRpSW5qZWN0b3InO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbXVsdGlJbmplY3QoZ2V0QmluZGluZ3MsIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUpIHtcclxuICBpZihfX0RFVl9fKSB7XHJcbiAgICBzaG91bGQoZ2V0QmluZGluZ3MpLmJlLmEuRnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIChDb21wb25lbnQpID0+IGNsYXNzIERlY29yYXRlZE11bHRpSW5qZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgc3RhdGljIGRpc3BsYXlOYW1lID0gYEBtdWx0aUluamVjdGA7XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgcmV0dXJuIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gZ2V0QmluZGluZ3ModGhpcy5wcm9wcywgdGhpcy5jb250ZXh0KTtcclxuICAgICAgaWYoX19ERVZfXykge1xyXG4gICAgICAgIF8uZWFjaChiaW5kaW5ncywgKHsgZmx1eCB9KSA9PiBmbHV4LnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gPE11bHRpSW5qZWN0b3Igey4uLmJpbmRpbmdzfT57KG11bHRpVmFsdWVzKSA9PlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLk9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIF8ubWFwVmFsdWVzKG11bHRpVmFsdWVzLCAodmFsdWUpID0+IF8ubGFzdCh2YWx1ZSkpKX0gLz5cclxuICAgICAgfTwvTXVsdGlJbmplY3Rvcj47XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
