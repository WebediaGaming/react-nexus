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
          _componentsMultiInjector2['default'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvbXVsdGlJbmplY3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7cUJBU3dCLFdBQVc7O3NCQVRyQixRQUFROzs7O3FCQUNKLE9BQU87Ozs7Z0NBQ04sb0JBQW9COzs7O29CQUd0QixTQUFTOzs7O3VDQUNBLDZCQUE2Qjs7Ozs4Q0FDakIsb0NBQW9DOzs7O0FBSjFFLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFNeEMsU0FBUyxXQUFXLENBQUMsV0FBVyxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQzFFLE1BQUcsT0FBTyxFQUFFO0FBQ1Ysa0NBQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNyQztBQUNELFNBQU8sVUFBQyxTQUFTOztnQkFBVyxzQkFBc0I7O2VBQXRCLHNCQUFzQjs4QkFBdEIsc0JBQXNCOzs7OztBQUF0Qiw0QkFBc0IsV0FHaEQscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEQ7O0FBTHlCLDRCQUFzQixXQU9oRCxNQUFNLEdBQUEsa0JBQUc7OztBQUNQLFlBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxZQUFHLE9BQU8sRUFBRTtBQUNWLDhCQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFRO2dCQUFOLElBQUksR0FBTixJQUFRLENBQU4sSUFBSTttQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtXQUFBLENBQUMsQ0FBQztTQUNwRTtBQUNELGVBQU87O1VBQW1CLFFBQVE7VUFBRyxVQUFDLFdBQVc7bUJBQy9DLGlDQUFDLFNBQVMsRUFBSyxlQUFjLEVBQUUsRUFBRSxNQUFLLEtBQUssRUFBRSxvQkFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUMsS0FBSztxQkFBSyxvQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQUEsQ0FBQyxDQUFDLENBQUk7V0FBQTtTQUNyRixDQUFDO09BQ25COzttQkFmeUIsc0JBQXNCOzs7Ozs7YUFBdEIsc0JBQXNCO09BQVMsbUJBQU0sU0FBUztHQWdCekUsQ0FBQztDQUNIIiwiZmlsZSI6ImRlY29yYXRvcnMvbXVsdGlJbmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL0ZsdXgnO1xyXG5pbXBvcnQgTXVsdGlJbmplY3RvciBmcm9tICcuLi9jb21wb25lbnRzL011bHRpSW5qZWN0b3InO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG11bHRpSW5qZWN0KGdldEJpbmRpbmdzLCBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUgPSBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlKSB7XHJcbiAgaWYoX19ERVZfXykge1xyXG4gICAgc2hvdWxkKGdldEJpbmRpbmdzKS5iZS5hLkZ1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHJldHVybiAoQ29tcG9uZW50KSA9PiBjbGFzcyBEZWNvcmF0ZWRNdWx0aUluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAbXVsdGlJbmplY3RgO1xyXG5cclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZSguLi5hcmdzKSB7XHJcbiAgICAgIHJldHVybiBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICBjb25zdCBiaW5kaW5ncyA9IGdldEJpbmRpbmdzKHRoaXMucHJvcHMsIHRoaXMuY29udGV4dCk7XHJcbiAgICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXggfSkgPT4gZmx1eC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDxNdWx0aUluamVjdG9yIHsuLi5iaW5kaW5nc30+eyhtdWx0aVZhbHVlcykgPT5cclxuICAgICAgICA8Q29tcG9uZW50IHsuLi5PYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLCBfLm1hcFZhbHVlcyhtdWx0aVZhbHVlcywgKHZhbHVlKSA9PiBfLmxhc3QodmFsdWUpKSl9IC8+XHJcbiAgICAgIH08L011bHRpSW5qZWN0b3I+O1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
