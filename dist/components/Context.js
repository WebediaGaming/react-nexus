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

var _$nexus = require('../$nexus');

var _$nexus2 = _interopRequireDefault(_$nexus);

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _utilsOmitChildren = require('../utils/omitChildren');

var _utilsOmitChildren2 = _interopRequireDefault(_utilsOmitChildren);

var _utilsValidateNexus = require('../utils/validateNexus');

var _utilsValidateNexus2 = _interopRequireDefault(_utilsValidateNexus);

var __DEV__ = process.env.NODE_ENV === 'development';

var Context = (function (_React$Component) {
  var _value;

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
    key: 'childContextTypes',
    value: (_value = {}, _value[_$nexus2['default']] = _utilsValidateNexus2['default'], _value),
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
    var nexus = _utilsOmitChildren2['default'](props);
    _lodash2['default'].each(nexus, function (flux) {
      return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
    });
  };

  Context.prototype.getChildContext = function getChildContext() {
    var _ref;

    var props = this.props;
    var context = this.context;

    var nexus = _utilsOmitChildren2['default'](props);
    return (_ref = {}, _ref[_$nexus2['default']] = _Object$assign({}, nexus, context[_$nexus2['default']] || {}), _ref);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvQ29udGV4dC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3FCQUNoQixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7OztzQkFJcEIsV0FBVzs7OztvQkFDYixTQUFTOzs7O2lDQUNELHVCQUF1Qjs7OztrQ0FDdEIsd0JBQXdCOzs7O0FBTGxELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7SUFPakQsT0FBTzs7O1lBQVAsT0FBTzs7ZUFBUCxPQUFPOztXQUNVLGVBQWU7Ozs7V0FDakI7QUFDakIsY0FBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0tBQy9COzs7Ozs7OztBQUtVLFdBVFAsT0FBTyxDQVNDLEtBQUssRUFBRSxPQUFPLEVBQUU7MEJBVHhCLE9BQU87O0FBVVQsZ0NBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RCLFFBQUcsT0FBTyxFQUFFO0FBQ1YsVUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjtHQUNGOztBQWRHLFNBQU8sV0FnQlgsYUFBYSxHQUFBLHVCQUFDLEtBQUssRUFBRTtBQUNuQixRQUFNLEtBQUssR0FBRywrQkFBYSxLQUFLLENBQUMsQ0FBQztBQUNsQyx3QkFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBSTthQUFLLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtLQUFBLENBQUMsQ0FBQztHQUM5RDs7QUFuQkcsU0FBTyxXQXFCWCxlQUFlLEdBQUEsMkJBQUc7OztRQUNSLEtBQUssR0FBYyxJQUFJLENBQXZCLEtBQUs7UUFBRSxPQUFPLEdBQUssSUFBSSxDQUFoQixPQUFPOztBQUN0QixRQUFNLEtBQUssR0FBRywrQkFBYSxLQUFLLENBQUMsQ0FBQztBQUNsQyxtREFDWSxlQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxxQkFBUSxJQUFJLEVBQUUsQ0FBQyxRQUN6RDtHQUNIOztBQTNCRyxTQUFPLFdBNkJYLHlCQUF5QixHQUFBLG1DQUFDLFNBQVMsRUFBRTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQy9COztBQS9CRyxTQUFPLFdBaUNYLHFCQUFxQixHQUFBLCtCQUFDLFNBQVMsRUFBRTtBQUMvQixXQUFPLENBQUMsdUJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztHQUMxQzs7QUFuQ0csU0FBTyxXQXFDWCxNQUFNLEdBQUEsa0JBQUc7QUFDUCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0dBQzVCOztTQXZDRyxPQUFPO0dBQVMsbUJBQU0sU0FBUzs7cUJBMEN0QixPQUFPIiwiZmlsZSI6ImNvbXBvbmVudHMvQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCAkbmV4dXMgZnJvbSAnLi4vJG5leHVzJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vRmx1eCc7XHJcbmltcG9ydCBvbWl0Q2hpbGRyZW4gZnJvbSAnLi4vdXRpbHMvb21pdENoaWxkcmVuJztcclxuaW1wb3J0IHZhbGlkYXRlTmV4dXMgZnJvbSAnLi4vdXRpbHMvdmFsaWRhdGVOZXh1cyc7XHJcblxyXG5jbGFzcyBDb250ZXh0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuQ29udGV4dCc7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMubm9kZSxcclxuICB9O1xyXG4gIHN0YXRpYyBjaGlsZENvbnRleHRUeXBlcyA9IHtcclxuICAgIFskbmV4dXNdOiB2YWxpZGF0ZU5leHVzLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIHRoaXMudmFsaWRhdGVQcm9wcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZVByb3BzKHByb3BzKSB7XHJcbiAgICBjb25zdCBuZXh1cyA9IG9taXRDaGlsZHJlbihwcm9wcyk7XHJcbiAgICBfLmVhY2gobmV4dXMsIChmbHV4KSA9PiBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgfVxyXG5cclxuICBnZXRDaGlsZENvbnRleHQoKSB7XHJcbiAgICBjb25zdCB7IHByb3BzLCBjb250ZXh0IH0gPSB0aGlzO1xyXG4gICAgY29uc3QgbmV4dXMgPSBvbWl0Q2hpbGRyZW4ocHJvcHMpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgWyRuZXh1c106IE9iamVjdC5hc3NpZ24oe30sIG5leHVzLCBjb250ZXh0WyRuZXh1c10gfHwge30pLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnZhbGlkYXRlUHJvcHMobmV4dFByb3BzKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcclxuICAgIHJldHVybiAhZGVlcEVxdWFsKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbnRleHQ7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
