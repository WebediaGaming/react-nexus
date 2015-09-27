'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _omitChildren = require('./omitChildren');

var _omitChildren2 = _interopRequireDefault(_omitChildren);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var __DEV__ = process.env.NODE_ENV === 'development';

var Context = (function (_React$Component) {
  _inherits(Context, _React$Component);

  _createClass(Context, null, [{
    key: 'displayName',
    value: 'Nexus.Context',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.node
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {},
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {},
    enumerable: true
  }]);

  function Context(props, context) {
    _classCallCheck(this, Context);

    _get(Object.getPrototypeOf(Context.prototype), 'constructor', this).call(this, props, context);
    if (__DEV__) {
      this.validateProps(props);
    }
  }

  _createClass(Context, [{
    key: 'validateProps',
    value: function validateProps(props) {
      var fluxes = (0, _omitChildren2['default'])(props);
      _lodash2['default'].each(fluxes, function (flux) {
        return (0, _shouldAsFunction2['default'])(flux).be.an.instanceOf(_Flux2['default']);
      });
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      var fluxes = (0, _omitChildren2['default'])(this.props);
      return _Object$assign({}, this.context, fluxes);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.validateProps(nextProps);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _deepEqual2['default'])(this.props, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return Context;
})(_react2['default'].Component);

exports['default'] = Context;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRleHQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3lCQUNBLFlBQVk7Ozs7cUJBQ2hCLE9BQU87Ozs7Z0NBQ04sb0JBQW9COzs7OzRCQUlkLGdCQUFnQjs7OztvQkFDeEIsUUFBUTs7OztBQUh6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7O0lBS2pELE9BQU87WUFBUCxPQUFPOztlQUFQLE9BQU87O1dBQ1UsZUFBZTs7OztXQUNqQjtBQUNqQixjQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7S0FDL0I7Ozs7V0FDcUIsRUFBRTs7OztXQUNHLEVBQUU7Ozs7QUFFbEIsV0FSUCxPQUFPLENBUUMsS0FBSyxFQUFFLE9BQU8sRUFBRTswQkFSeEIsT0FBTzs7QUFTVCwrQkFURSxPQUFPLDZDQVNILEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDdEIsUUFBRyxPQUFPLEVBQUU7QUFDVixVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCO0dBQ0Y7O2VBYkcsT0FBTzs7V0FlRSx1QkFBQyxLQUFLLEVBQUU7QUFDbkIsVUFBTSxNQUFNLEdBQUcsK0JBQWEsS0FBSyxDQUFDLENBQUM7QUFDbkMsMEJBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUk7ZUFBSyxtQ0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsbUJBQU07T0FBQSxDQUFDLENBQUM7S0FDL0Q7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQU0sTUFBTSxHQUFHLCtCQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxhQUFPLGVBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDaEQ7OztXQUV3QixtQ0FBQyxTQUFTLEVBQUU7QUFDbkMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMvQjs7O1dBRW9CLCtCQUFDLFNBQVMsRUFBRTtBQUMvQixhQUFPLENBQUMsNEJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztLQUMxQzs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0tBQzVCOzs7U0FuQ0csT0FBTztHQUFTLG1CQUFNLFNBQVM7O3FCQXNDdEIsT0FBTyIsImZpbGUiOiJDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuaW1wb3J0IG9taXRDaGlsZHJlbiBmcm9tICcuL29taXRDaGlsZHJlbic7XHJcbmltcG9ydCBGbHV4IGZyb20gJy4vRmx1eCc7XHJcblxyXG5jbGFzcyBDb250ZXh0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuQ29udGV4dCc7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcclxuICB9O1xyXG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7fTtcclxuICBzdGF0aWMgY2hpbGRDb250ZXh0VHlwZXMgPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgdGhpcy52YWxpZGF0ZVByb3BzKHByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhbGlkYXRlUHJvcHMocHJvcHMpIHtcclxuICAgIGNvbnN0IGZsdXhlcyA9IG9taXRDaGlsZHJlbihwcm9wcyk7XHJcbiAgICBfLmVhY2goZmx1eGVzLCAoZmx1eCkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xyXG4gICAgY29uc3QgZmx1eGVzID0gb21pdENoaWxkcmVuKHRoaXMucHJvcHMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29udGV4dCwgZmx1eGVzKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnZhbGlkYXRlUHJvcHMobmV4dFByb3BzKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgIHJldHVybiAhZGVlcEVxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbnRleHQ7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==