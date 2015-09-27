'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = inject;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _Injector = require('./Injector');

var _Injector2 = _interopRequireDefault(_Injector);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

var __DEV__ = process.env.NODE_ENV;

function inject(key, getBinding) {
  var customShouldComponentUpdate = arguments.length <= 2 || arguments[2] === undefined ? _pureShouldComponentUpdate2['default'] : arguments[2];

  if (__DEV__) {
    (0, _shouldAsFunction2['default'])(typeof key).be.oneOf('string', 'symbol');
    (0, _shouldAsFunction2['default'])(getBinding).be.a.Function();
  }
  return function (Component) {
    return (function (_React$Component) {
      _inherits(_class, _React$Component);

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

          return customShouldComponentUpdate.apply(this, args);
        }
      }, {
        key: 'render',
        value: function render() {
          var _this = this;

          var _getBinding = getBinding(this.props, this.context);

          var flux = _getBinding.flux;
          var params = _getBinding.params;

          if (__DEV__) {
            (0, _shouldAsFunction2['default'])(flux).be.an.instanceOf(_Flux2['default']);
          }
          return _react2['default'].createElement(
            _Injector2['default'],
            { flux: flux, params: params },
            function (values) {
              return _react2['default'].createElement(Component, _Object$assign2({}, _this.props, _defineProperty({}, key, _lodash2['default'].last(values))));
            }
          );
        }
      }], [{
        key: 'displayName',
        value: '@inject',
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluamVjdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFVd0IsTUFBTTs7c0JBVmhCLFFBQVE7Ozs7cUJBQ0osT0FBTzs7OztnQ0FDTixvQkFBb0I7Ozs7d0JBSWxCLFlBQVk7Ozs7b0JBQ2hCLFFBQVE7Ozs7eUNBQ2EsNkJBQTZCOzs7O0FBSm5FLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDOztBQU10QixTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQ3pFLE1BQUcsT0FBTyxFQUFFO0FBQ1YsdUNBQU8sT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRCx1Q0FBTyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ3BDO0FBQ0QsU0FBTyxVQUFDLFNBQVM7Ozs7Ozs7Ozs7OztlQUdNLGlDQUFVOzRDQUFOLElBQUk7QUFBSixnQkFBSTs7O0FBQzNCLGlCQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEQ7OztlQUVLLGtCQUFHOzs7NEJBQ2tCLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7O2NBQXJELElBQUksZUFBSixJQUFJO2NBQUUsTUFBTSxlQUFOLE1BQU07O0FBQ3BCLGNBQUcsT0FBTyxFQUFFO0FBQ1YsK0NBQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLG1CQUFNLENBQUM7V0FDckM7QUFDRCxpQkFBTzs7Y0FBVSxJQUFJLEVBQUUsSUFBSSxBQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sQUFBQztZQUFFLFVBQUMsTUFBTTtxQkFDbkQsaUNBQUMsU0FBUyxFQUFLLGdCQUFjLEVBQUUsRUFBRSxNQUFLLEtBQUssc0JBQUssR0FBRyxFQUFHLG9CQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUFJO2FBQUE7V0FDakUsQ0FBQztTQUNkOzs7Ozs7OztPQWZpQyxtQkFBTSxTQUFTO0dBZ0JsRCxDQUFDO0NBQ0giLCJmaWxlIjoiaW5qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xyXG5cclxuaW1wb3J0IEluamVjdG9yIGZyb20gJy4vSW5qZWN0b3InO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5qZWN0KGtleSwgZ2V0QmluZGluZywgY3VzdG9tU2hvdWxkQ29tcG9uZW50VXBkYXRlID0gcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSkge1xyXG4gIGlmKF9fREVWX18pIHtcclxuICAgIHNob3VsZCh0eXBlb2Yga2V5KS5iZS5vbmVPZignc3RyaW5nJywgJ3N5bWJvbCcpO1xyXG4gICAgc2hvdWxkKGdldEJpbmRpbmcpLmJlLmEuRnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIChDb21wb25lbnQpID0+IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAaW5qZWN0YDtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICByZXR1cm4gY3VzdG9tU2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgY29uc3QgeyBmbHV4LCBwYXJhbXMgfSA9IGdldEJpbmRpbmcodGhpcy5wcm9wcywgdGhpcy5jb250ZXh0KTtcclxuICAgICAgaWYoX19ERVZfXykge1xyXG4gICAgICAgIHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiA8SW5qZWN0b3IgZmx1eD17Zmx1eH0gcGFyYW1zPXtwYXJhbXN9PnsodmFsdWVzKSA9PlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLk9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHsgW2tleV06IF8ubGFzdCh2YWx1ZXMpIH0pfSAvPlxyXG4gICAgICB9PC9JbmplY3Rvcj47XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=