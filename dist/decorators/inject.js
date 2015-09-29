'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign3 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = inject;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _$nexus = require('../$nexus');

var _$nexus2 = _interopRequireDefault(_$nexus);

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _componentsInjector = require('../components/Injector');

var _componentsInjector2 = _interopRequireDefault(_componentsInjector);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var _utilsValidateNexus = require('../utils/validateNexus');

var _utilsValidateNexus2 = _interopRequireDefault(_utilsValidateNexus);

var __DEV__ = process.env.NODE_ENV;

function inject(key, getBinding) {
  var customShouldComponentUpdate = arguments.length <= 2 || arguments[2] === undefined ? _utilsPureShouldComponentUpdate2['default'] : arguments[2];

  if (__DEV__) {
    _shouldAsFunction2['default'](typeof key).be.oneOf('string', 'symbol');
    _shouldAsFunction2['default'](getBinding).be.a.Function();
  }
  return function $inject(Component) {
    return (function (_React$Component) {
      var _value;

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
        var props = this.props;
        var context = this.context;

        var nexus = context[_$nexus2['default']];

        var _getBinding = getBinding(props, nexus);

        var flux = _getBinding.flux;
        var params = _getBinding.params;

        if (__DEV__) {
          _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
        }
        return _react2['default'].createElement(
          _componentsInjector2['default'],
          { flux: flux, params: params },
          function (values) {
            var _Object$assign, _Object$assign2;

            var childProps = _Object$assign3({}, props, (_Object$assign = {}, _Object$assign[key] = values, _Object$assign), (_Object$assign2 = {}, _Object$assign2[_$nexus2['default']] = nexus, _Object$assign2));
            return _react2['default'].createElement(Component, childProps);
          }
        );
      };

      _createClass(_class, null, [{
        key: 'displayName',
        value: '@inject(' + Component.displayName + ')',
        enumerable: true
      }, {
        key: 'contextTypes',
        value: (_value = {}, _value[_$nexus2['default']] = _utilsValidateNexus2['default'], _value),
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvaW5qZWN0LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3FCQVd3QixNQUFNOztxQkFYWixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztzQkFJcEIsV0FBVzs7OztvQkFDYixTQUFTOzs7O2tDQUNMLHdCQUF3Qjs7Ozs4Q0FDUCxvQ0FBb0M7Ozs7a0NBQ2hELHdCQUF3Qjs7OztBQU5sRCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFRdEIsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBMkQ7TUFBekQsMkJBQTJCOztBQUN6RSxNQUFHLE9BQU8sRUFBRTtBQUNWLGtDQUFPLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEQsa0NBQU8sVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNwQztBQUNELFNBQU8sU0FBUyxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQ2pDOzs7Ozs7Ozs7Ozt1QkFNRSxxQkFBcUIsR0FBQSxpQ0FBVTswQ0FBTixJQUFJO0FBQUosY0FBSTs7O0FBQzNCLGVBQU8sMkJBQTJCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN0RDs7dUJBRUQsTUFBTSxHQUFBLGtCQUFHO1lBQ0MsS0FBSyxHQUFjLElBQUksQ0FBdkIsS0FBSztZQUFFLE9BQU8sR0FBSyxJQUFJLENBQWhCLE9BQU87O0FBQ3RCLFlBQU0sS0FBSyxHQUFHLE9BQU8scUJBQVEsQ0FBQzs7MEJBQ0wsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7O1lBQXpDLElBQUksZUFBSixJQUFJO1lBQUUsTUFBTSxlQUFOLE1BQU07O0FBQ3BCLFlBQUcsT0FBTyxFQUFFO0FBQ1Ysd0NBQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLG1CQUFNLENBQUM7U0FDckM7QUFDRCxlQUFPOztZQUFVLElBQUksRUFBRSxJQUFJLEFBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxBQUFDO1VBQUUsVUFBQyxNQUFNLEVBQUs7OztBQUN4RCxnQkFBTSxVQUFVLEdBQUcsZ0JBQWMsRUFBRSxFQUNqQyxLQUFLLHVDQUNGLEdBQUcsSUFBRyxNQUFNLGlGQUNILEtBQUssbUJBQ2xCLENBQUM7QUFDRixtQkFBTyxpQ0FBQyxTQUFTLEVBQUssVUFBVSxDQUFJLENBQUM7V0FDdEM7U0FBWSxDQUFDO09BQ2Y7Ozs7NEJBeEIrQixTQUFTLENBQUMsV0FBVzs7Ozs7Ozs7O09BRGxDLG1CQUFNLFNBQVMsRUEwQmxDO0dBQ0gsQ0FBQztDQUNIIiwiZmlsZSI6ImRlY29yYXRvcnMvaW5qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xyXG5cclxuaW1wb3J0ICRuZXh1cyBmcm9tICcuLi8kbmV4dXMnO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9GbHV4JztcclxuaW1wb3J0IEluamVjdG9yIGZyb20gJy4uL2NvbXBvbmVudHMvSW5qZWN0b3InO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuaW1wb3J0IHZhbGlkYXRlTmV4dXMgZnJvbSAnLi4vdXRpbHMvdmFsaWRhdGVOZXh1cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmplY3Qoa2V5LCBnZXRCaW5kaW5nLCBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUgPSBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlKSB7XHJcbiAgaWYoX19ERVZfXykge1xyXG4gICAgc2hvdWxkKHR5cGVvZiBrZXkpLmJlLm9uZU9mKCdzdHJpbmcnLCAnc3ltYm9sJyk7XHJcbiAgICBzaG91bGQoZ2V0QmluZGluZykuYmUuYS5GdW5jdGlvbigpO1xyXG4gIH1cclxuICByZXR1cm4gZnVuY3Rpb24gJGluamVjdChDb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAaW5qZWN0KCR7Q29tcG9uZW50LmRpc3BsYXlOYW1lfSlgO1xyXG4gICAgICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xyXG4gICAgICAgIFskbmV4dXNdOiB2YWxpZGF0ZU5leHVzLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gY3VzdG9tU2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgeyBwcm9wcywgY29udGV4dCB9ID0gdGhpcztcclxuICAgICAgICBjb25zdCBuZXh1cyA9IGNvbnRleHRbJG5leHVzXTtcclxuICAgICAgICBjb25zdCB7IGZsdXgsIHBhcmFtcyB9ID0gZ2V0QmluZGluZyhwcm9wcywgbmV4dXMpO1xyXG4gICAgICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgICAgIHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPEluamVjdG9yIGZsdXg9e2ZsdXh9IHBhcmFtcz17cGFyYW1zfT57KHZhbHVlcykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY2hpbGRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sXHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICB7IFtrZXldOiB2YWx1ZXMgfSxcclxuICAgICAgICAgICAgeyBbJG5leHVzXTogbmV4dXMgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5jaGlsZFByb3BzfSAvPjtcclxuICAgICAgICB9fTwvSW5qZWN0b3I+O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH07XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
