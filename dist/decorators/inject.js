'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = inject;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _componentsInjector = require('../components/Injector');

var _componentsInjector2 = _interopRequireDefault(_componentsInjector);

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var __DEV__ = process.env.NODE_ENV;

function inject(key, getBinding) {
  var customShouldComponentUpdate = arguments.length <= 2 || arguments[2] === undefined ? _utilsPureShouldComponentUpdate2['default'] : arguments[2];

  if (__DEV__) {
    _shouldAsFunction2['default'](typeof key).be.oneOf('string', 'symbol');
    _shouldAsFunction2['default'](getBinding).be.a.Function();
  }
  return function (Component) {
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

        var _getBinding = getBinding(this.props, this.context);

        var flux = _getBinding.flux;
        var params = _getBinding.params;

        if (__DEV__) {
          _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
        }
        return _react2['default'].createElement(
          _componentsInjector2['default'],
          { flux: flux, params: params },
          function (values) {
            var _Object$assign;

            return _react2['default'].createElement(Component, _Object$assign2({}, _this.props, (_Object$assign = {}, _Object$assign[key] = _lodash2['default'].last(values), _Object$assign)));
          }
        );
      };

      _createClass(_class, null, [{
        key: 'displayName',
        value: '@inject',
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvaW5qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3FCQVV3QixNQUFNOztzQkFWaEIsUUFBUTs7OztxQkFDSixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztrQ0FJbEIsd0JBQXdCOzs7O29CQUM1QixTQUFTOzs7OzhDQUNZLG9DQUFvQzs7OztBQUoxRSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFNdEIsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBMkQ7TUFBekQsMkJBQTJCOztBQUN6RSxNQUFHLE9BQU8sRUFBRTtBQUNWLGtDQUFPLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEQsa0NBQU8sVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNwQztBQUNELFNBQU8sVUFBQyxTQUFTOzs7Ozs7Ozs7O3VCQUdmLHFCQUFxQixHQUFBLGlDQUFVOzBDQUFOLElBQUk7QUFBSixjQUFJOzs7QUFDM0IsZUFBTywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3REOzt1QkFFRCxNQUFNLEdBQUEsa0JBQUc7OzswQkFDa0IsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7WUFBckQsSUFBSSxlQUFKLElBQUk7WUFBRSxNQUFNLGVBQU4sTUFBTTs7QUFDcEIsWUFBRyxPQUFPLEVBQUU7QUFDVix3Q0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsbUJBQU0sQ0FBQztTQUNyQztBQUNELGVBQU87O1lBQVUsSUFBSSxFQUFFLElBQUksQUFBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEFBQUM7VUFBRSxVQUFDLE1BQU07OzttQkFDbkQsaUNBQUMsU0FBUyxFQUFLLGdCQUFjLEVBQUUsRUFBRSxNQUFLLEtBQUssdUNBQUssR0FBRyxJQUFHLG9CQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQUcsQ0FBSTtXQUFBO1NBQ2pFLENBQUM7T0FDZDs7Ozs7Ozs7O09BZmlDLG1CQUFNLFNBQVM7R0FnQmxELENBQUM7Q0FDSCIsImZpbGUiOiJkZWNvcmF0b3JzL2luamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOVjtcclxuXHJcbmltcG9ydCBJbmplY3RvciBmcm9tICcuLi9jb21wb25lbnRzL0luamVjdG9yJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vRmx1eCc7XHJcbmltcG9ydCBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlIGZyb20gJy4uL3V0aWxzL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5qZWN0KGtleSwgZ2V0QmluZGluZywgY3VzdG9tU2hvdWxkQ29tcG9uZW50VXBkYXRlID0gcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSkge1xyXG4gIGlmKF9fREVWX18pIHtcclxuICAgIHNob3VsZCh0eXBlb2Yga2V5KS5iZS5vbmVPZignc3RyaW5nJywgJ3N5bWJvbCcpO1xyXG4gICAgc2hvdWxkKGdldEJpbmRpbmcpLmJlLmEuRnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIChDb21wb25lbnQpID0+IGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAaW5qZWN0YDtcclxuXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICByZXR1cm4gY3VzdG9tU2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgY29uc3QgeyBmbHV4LCBwYXJhbXMgfSA9IGdldEJpbmRpbmcodGhpcy5wcm9wcywgdGhpcy5jb250ZXh0KTtcclxuICAgICAgaWYoX19ERVZfXykge1xyXG4gICAgICAgIHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiA8SW5qZWN0b3IgZmx1eD17Zmx1eH0gcGFyYW1zPXtwYXJhbXN9PnsodmFsdWVzKSA9PlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLk9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHsgW2tleV06IF8ubGFzdCh2YWx1ZXMpIH0pfSAvPlxyXG4gICAgICB9PC9JbmplY3Rvcj47XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
