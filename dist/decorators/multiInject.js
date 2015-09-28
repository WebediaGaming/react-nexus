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

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _componentsMultiInjector = require('../components/MultiInjector');

var _componentsMultiInjector2 = _interopRequireDefault(_componentsMultiInjector);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var __DEV__ = process.env.NODE_ENV === 'development';

function multiInject(getBindings) {
  var customShouldComponentUpdate = arguments.length <= 1 || arguments[1] === undefined ? _utilsPureShouldComponentUpdate2['default'] : arguments[1];

  if (__DEV__) {
    _shouldAsFunction2['default'](getBindings).be.a.Function();
  }
  return function $multiInject(Component) {
    return (function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class() {
        _classCallCheck(this, _class);

        _React$Component.apply(this, arguments);
      }

      _class.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return customShouldComponentUpdate.apply(this, args);
      };

      _class.prototype.render = function render() {
        var _this = this;

        var bindings = getBindings(this.props, this.context);
        if (__DEV__) {
          _lodash2['default'].each(bindings, function (_ref) {
            var flux = _ref.flux;
            return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
          });
        }
        return _react2['default'].createElement(
          _componentsMultiInjector2['default'],
          bindings,
          function (multiValues) {
            return _react2['default'].createElement(Component, _Object$assign({}, _this.props, _lodash2['default'].mapValues(multiValues, function (value) {
              return _lodash2['default'].last(value);
            })));
          }
        );
      };

      _createClass(_class, null, [{
        key: 'displayName',
        value: '@multiInject(' + Component.displayName + ')',
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvbXVsdGlJbmplY3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7cUJBU3dCLFdBQVc7O3NCQVRyQixRQUFROzs7O3FCQUNKLE9BQU87Ozs7Z0NBQ04sb0JBQW9COzs7O29CQUd0QixTQUFTOzs7O3VDQUNBLDZCQUE2Qjs7Ozs4Q0FDakIsb0NBQW9DOzs7O0FBSjFFLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFNeEMsU0FBUyxXQUFXLENBQUMsV0FBVyxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQzFFLE1BQUcsT0FBTyxFQUFFO0FBQ1Ysa0NBQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNyQztBQUNELFNBQU8sU0FBUyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQ3RDOzs7Ozs7Ozs7dUJBR0UscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEQ7O3VCQUVELE1BQU0sR0FBQSxrQkFBRzs7O0FBQ1AsWUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELFlBQUcsT0FBTyxFQUFFO0FBQ1YsOEJBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQVE7Z0JBQU4sSUFBSSxHQUFOLElBQVEsQ0FBTixJQUFJO21CQUFPLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtXQUFBLENBQUMsQ0FBQztTQUNyRTtBQUNELGVBQU87O1VBQW1CLFFBQVE7VUFBRyxVQUFDLFdBQVc7bUJBQy9DLGlDQUFDLFNBQVMsRUFBSyxlQUFjLEVBQUUsRUFBRSxNQUFLLEtBQUssRUFBRSxvQkFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSztxQkFBSyxvQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQUEsQ0FBQyxDQUFDLENBQUk7V0FBQTtTQUNyRixDQUFDO09BQ25COzs7O2lDQWRvQyxTQUFTLENBQUMsV0FBVzs7Ozs7T0FEdkMsbUJBQU0sU0FBUyxFQWdCbEM7R0FDSCxDQUFDO0NBQ0giLCJmaWxlIjoiZGVjb3JhdG9ycy9tdWx0aUluamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vRmx1eCc7XHJcbmltcG9ydCBNdWx0aUluamVjdG9yIGZyb20gJy4uL2NvbXBvbmVudHMvTXVsdGlJbmplY3Rvcic7XHJcbmltcG9ydCBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlIGZyb20gJy4uL3V0aWxzL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbXVsdGlJbmplY3QoZ2V0QmluZGluZ3MsIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUpIHtcclxuICBpZihfX0RFVl9fKSB7XHJcbiAgICBzaG91bGQoZ2V0QmluZGluZ3MpLmJlLmEuRnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICRtdWx0aUluamVjdChDb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAbXVsdGlJbmplY3QoJHtDb21wb25lbnQuZGlzcGxheU5hbWV9KWA7XHJcblxyXG4gICAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBiaW5kaW5ncyA9IGdldEJpbmRpbmdzKHRoaXMucHJvcHMsIHRoaXMuY29udGV4dCk7XHJcbiAgICAgICAgaWYoX19ERVZfXykge1xyXG4gICAgICAgICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4IH0pID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDxNdWx0aUluamVjdG9yIHsuLi5iaW5kaW5nc30+eyhtdWx0aVZhbHVlcykgPT5cclxuICAgICAgICAgIDxDb21wb25lbnQgey4uLk9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIF8ubWFwVmFsdWVzKG11bHRpVmFsdWVzLCAodmFsdWUpID0+IF8ubGFzdCh2YWx1ZSkpKX0gLz5cclxuICAgICAgICB9PC9NdWx0aUluamVjdG9yPjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
