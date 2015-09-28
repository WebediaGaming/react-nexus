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
          _Injector2['default'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluamVjdC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztxQkFVd0IsTUFBTTs7c0JBVmhCLFFBQVE7Ozs7cUJBQ0osT0FBTzs7OztnQ0FDTixvQkFBb0I7Ozs7d0JBSWxCLFlBQVk7Ozs7b0JBQ2hCLFFBQVE7Ozs7eUNBQ2EsNkJBQTZCOzs7O0FBSm5FLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDOztBQU10QixTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQ3pFLE1BQUcsT0FBTyxFQUFFO0FBQ1Ysa0NBQU8sT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRCxrQ0FBTyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ3BDO0FBQ0QsU0FBTyxVQUFDLFNBQVM7Ozs7Ozs7Ozs7dUJBR2YscUJBQXFCLEdBQUEsaUNBQVU7MENBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMzQixlQUFPLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEQ7O3VCQUVELE1BQU0sR0FBQSxrQkFBRzs7OzBCQUNrQixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDOztZQUFyRCxJQUFJLGVBQUosSUFBSTtZQUFFLE1BQU0sZUFBTixNQUFNOztBQUNwQixZQUFHLE9BQU8sRUFBRTtBQUNWLHdDQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTSxDQUFDO1NBQ3JDO0FBQ0QsZUFBTzs7WUFBVSxJQUFJLEVBQUUsSUFBSSxBQUFDLEVBQUMsTUFBTSxFQUFFLE1BQU0sQUFBQztVQUFFLFVBQUMsTUFBTTs7O21CQUNuRCxpQ0FBQyxTQUFTLEVBQUssZ0JBQWMsRUFBRSxFQUFFLE1BQUssS0FBSyx1Q0FBSyxHQUFHLElBQUcsb0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBRyxDQUFJO1dBQUE7U0FDakUsQ0FBQztPQUNkOzs7Ozs7Ozs7T0FmaUMsbUJBQU0sU0FBUztHQWdCbEQsQ0FBQztDQUNIIiwiZmlsZSI6ImluamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOVjtcclxuXHJcbmltcG9ydCBJbmplY3RvciBmcm9tICcuL0luamVjdG9yJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluamVjdChrZXksIGdldEJpbmRpbmcsIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUpIHtcclxuICBpZihfX0RFVl9fKSB7XHJcbiAgICBzaG91bGQodHlwZW9mIGtleSkuYmUub25lT2YoJ3N0cmluZycsICdzeW1ib2wnKTtcclxuICAgIHNob3VsZChnZXRCaW5kaW5nKS5iZS5hLkZ1bmN0aW9uKCk7XHJcbiAgfVxyXG4gIHJldHVybiAoQ29tcG9uZW50KSA9PiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICBzdGF0aWMgZGlzcGxheU5hbWUgPSBgQGluamVjdGA7XHJcblxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgcmV0dXJuIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIGNvbnN0IHsgZmx1eCwgcGFyYW1zIH0gPSBnZXRCaW5kaW5nKHRoaXMucHJvcHMsIHRoaXMuY29udGV4dCk7XHJcbiAgICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgICBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gPEluamVjdG9yIGZsdXg9e2ZsdXh9IHBhcmFtcz17cGFyYW1zfT57KHZhbHVlcykgPT5cclxuICAgICAgICA8Q29tcG9uZW50IHsuLi5PYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLCB7IFtrZXldOiBfLmxhc3QodmFsdWVzKSB9KX0gLz5cclxuICAgICAgfTwvSW5qZWN0b3I+O1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
