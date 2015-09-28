'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _utilsOmitChildren = require('../utils/omitChildren');

var _utilsOmitChildren2 = _interopRequireDefault(_utilsOmitChildren);

var _Flux = require('../Flux');

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

    _React$Component.call(this, props, context);
    if (__DEV__) {
      this.validateProps(props);
    }
  }

  Context.prototype.validateProps = function validateProps(props) {
    var fluxes = _utilsOmitChildren2['default'](props);
    _lodash2['default'].each(fluxes, function (flux) {
      return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
    });
  };

  Context.prototype.getChildContext = function getChildContext() {
    var fluxes = _utilsOmitChildren2['default'](this.props);
    return _Object$assign({}, this.context, fluxes);
  };

  Context.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.validateProps(nextProps);
  };

  Context.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return !_deepEqual2['default'](this.props, nextProps);
  };

  Context.prototype.render = function render() {
    return this.props.children;
  };

  return Context;
})(_react2['default'].Component);

exports['default'] = Context;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGV4dC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3FCQUNoQixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztpQ0FJZCx1QkFBdUI7Ozs7b0JBQy9CLFNBQVM7Ozs7QUFIMUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOztJQUtqRCxPQUFPO1lBQVAsT0FBTzs7ZUFBUCxPQUFPOztXQUNVLGVBQWU7Ozs7V0FDakI7QUFDakIsY0FBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0tBQy9COzs7O1dBQ3FCLEVBQUU7Ozs7V0FDRyxFQUFFOzs7O0FBRWxCLFdBUlAsT0FBTyxDQVFDLEtBQUssRUFBRSxPQUFPLEVBQUU7MEJBUnhCLE9BQU87O0FBU1QsZ0NBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RCLFFBQUcsT0FBTyxFQUFFO0FBQ1YsVUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjtHQUNGOztBQWJHLFNBQU8sV0FlWCxhQUFhLEdBQUEsdUJBQUMsS0FBSyxFQUFFO0FBQ25CLFFBQU0sTUFBTSxHQUFHLCtCQUFhLEtBQUssQ0FBQyxDQUFDO0FBQ25DLHdCQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJO2FBQUssOEJBQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLG1CQUFNO0tBQUEsQ0FBQyxDQUFDO0dBQy9EOztBQWxCRyxTQUFPLFdBb0JYLGVBQWUsR0FBQSwyQkFBRztBQUNoQixRQUFNLE1BQU0sR0FBRywrQkFBYSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsV0FBTyxlQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ2hEOztBQXZCRyxTQUFPLFdBeUJYLHlCQUF5QixHQUFBLG1DQUFDLFNBQVMsRUFBRTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQy9COztBQTNCRyxTQUFPLFdBNkJYLHFCQUFxQixHQUFBLCtCQUFDLFNBQVMsRUFBRTtBQUMvQixXQUFPLENBQUMsdUJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztHQUMxQzs7QUEvQkcsU0FBTyxXQWlDWCxNQUFNLEdBQUEsa0JBQUc7QUFDUCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0dBQzVCOztTQW5DRyxPQUFPO0dBQVMsbUJBQU0sU0FBUzs7cUJBc0N0QixPQUFPIiwiZmlsZSI6ImNvbXBvbmVudHMvQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCBvbWl0Q2hpbGRyZW4gZnJvbSAnLi4vdXRpbHMvb21pdENoaWxkcmVuJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vRmx1eCc7XHJcblxyXG5jbGFzcyBDb250ZXh0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuQ29udGV4dCc7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcclxuICB9O1xyXG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7fTtcclxuICBzdGF0aWMgY2hpbGRDb250ZXh0VHlwZXMgPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgdGhpcy52YWxpZGF0ZVByb3BzKHByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhbGlkYXRlUHJvcHMocHJvcHMpIHtcclxuICAgIGNvbnN0IGZsdXhlcyA9IG9taXRDaGlsZHJlbihwcm9wcyk7XHJcbiAgICBfLmVhY2goZmx1eGVzLCAoZmx1eCkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xyXG4gICAgY29uc3QgZmx1eGVzID0gb21pdENoaWxkcmVuKHRoaXMucHJvcHMpO1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29udGV4dCwgZmx1eGVzKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnZhbGlkYXRlUHJvcHMobmV4dFByb3BzKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgIHJldHVybiAhZGVlcEVxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbnRleHQ7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
