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
  return function $inject(Component) {
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
        value: '@inject(' + Component.displayName + ')',
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvaW5qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3FCQVV3QixNQUFNOztzQkFWaEIsUUFBUTs7OztxQkFDSixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztrQ0FJbEIsd0JBQXdCOzs7O29CQUM1QixTQUFTOzs7OzhDQUNZLG9DQUFvQzs7OztBQUoxRSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFNdEIsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBMkQ7TUFBekQsMkJBQTJCOztBQUN6RSxNQUFHLE9BQU8sRUFBRTtBQUNWLGtDQUFPLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEQsa0NBQU8sVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNwQztBQUNELFNBQU8sU0FBUyxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQ2pDOzs7Ozs7Ozs7dUJBR0UscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEQ7O3VCQUVELE1BQU0sR0FBQSxrQkFBRzs7OzBCQUNrQixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDOztZQUFyRCxJQUFJLGVBQUosSUFBSTtZQUFFLE1BQU0sZUFBTixNQUFNOztBQUNwQixZQUFHLE9BQU8sRUFBRTtBQUNWLHdDQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTSxDQUFDO1NBQ3JDO0FBQ0QsZUFBTzs7WUFBVSxJQUFJLEVBQUUsSUFBSSxBQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sQUFBQztVQUFFLFVBQUMsTUFBTTs7O21CQUNuRCxpQ0FBQyxTQUFTLEVBQUssZ0JBQWMsRUFBRSxFQUFFLE1BQUssS0FBSyx1Q0FBSyxHQUFHLElBQUcsb0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBRyxDQUFJO1dBQUE7U0FDakUsQ0FBQztPQUNkOzs7OzRCQWQrQixTQUFTLENBQUMsV0FBVzs7Ozs7T0FEbEMsbUJBQU0sU0FBUyxFQWdCbEM7R0FDSCxDQUFDO0NBQ0giLCJmaWxlIjoiZGVjb3JhdG9ycy9pbmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlY7XHJcblxyXG5pbXBvcnQgSW5qZWN0b3IgZnJvbSAnLi4vY29tcG9uZW50cy9JbmplY3Rvcic7XHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluamVjdChrZXksIGdldEJpbmRpbmcsIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUpIHtcclxuICBpZihfX0RFVl9fKSB7XHJcbiAgICBzaG91bGQodHlwZW9mIGtleSkuYmUub25lT2YoJ3N0cmluZycsICdzeW1ib2wnKTtcclxuICAgIHNob3VsZChnZXRCaW5kaW5nKS5iZS5hLkZ1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbiAkaW5qZWN0KENvbXBvbmVudCkge1xyXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgICAgc3RhdGljIGRpc3BsYXlOYW1lID0gYEBpbmplY3QoJHtDb21wb25lbnQuZGlzcGxheU5hbWV9KWA7XHJcblxyXG4gICAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IGZsdXgsIHBhcmFtcyB9ID0gZ2V0QmluZGluZyh0aGlzLnByb3BzLCB0aGlzLmNvbnRleHQpO1xyXG4gICAgICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgICAgIHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPEluamVjdG9yIGZsdXg9e2ZsdXh9IHBhcmFtcz17cGFyYW1zfT57KHZhbHVlcykgPT5cclxuICAgICAgICAgIDxDb21wb25lbnQgey4uLk9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHsgW2tleV06IF8ubGFzdCh2YWx1ZXMpIH0pfSAvPlxyXG4gICAgICAgIH08L0luamVjdG9yPjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
