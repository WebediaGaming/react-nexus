'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

var Injector = (function (_React$Component) {
  _inherits(Injector, _React$Component);

  _createClass(Injector, null, [{
    key: 'displayName',
    value: 'Nexus.Injector',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.func.isRequired,
      flux: _react2['default'].PropTypes.instanceOf(_Flux2['default']).isRequired,
      params: _react2['default'].PropTypes.any,
      shouldComponentUpdate: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      shouldComponentUpdate: _pureShouldComponentUpdate2['default']
    },
    enumerable: true
  }]);

  function Injector(props, context) {
    _classCallCheck(this, Injector);

    _React$Component.call(this, props, context);
    var _props = this.props;
    var flux = _props.flux;
    var params = _props.params;

    this.state = {
      values: flux.values(params)
    };
    this.unobserve = _lodash2['default'].noop;
  }

  Injector.prototype.componentDidMount = function componentDidMount() {
    this.subscribe(this.props);
  };

  Injector.prototype.refreshState = function refreshState(_ref) {
    var flux = _ref.flux;
    var params = _ref.params;

    this.setState({
      values: flux.values(params)
    });
  };

  Injector.prototype.unsubscribe = function unsubscribe() {
    this.unobserve();
    this.setState({ values: void 0 });
  };

  Injector.prototype.subscribe = function subscribe(_ref2) {
    var _this = this;

    var flux = _ref2.flux;
    var params = _ref2.params;

    this.unsubscribe();
    this.refreshState({ flux: flux, params: params });
    this.unobserve = flux.observe(params, function () {
      return _this.refreshState({ flux: flux, params: params });
    });
  };

  Injector.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (_lodash2['default'].any([!_deepEqual2['default'](this.props.flux, nextProps.flux), !_deepEqual2['default'](this.props.params, nextProps.params)])) {
      this.subscribe(nextProps);
    }
  };

  Injector.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unsubscribe();
  };

  Injector.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.props.shouldComponentUpdate.apply(this, args);
  };

  Injector.prototype.render = function render() {
    var values = this.state.values;

    return this.children(values);
  };

  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QixHQUFBLGdDQUFHO0FBQ3JCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjs7QUF2REcsVUFBUSxXQXlEWixxQkFBcUIsR0FBQSxpQ0FBVTtzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQzNCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzNEOztBQTNERyxVQUFRLFdBNkRaLE1BQU0sR0FBQSxrQkFBRztRQUNDLE1BQU0sR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFyQixNQUFNOztBQUNkLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM5Qjs7U0FoRUcsUUFBUTtHQUFTLG1CQUFNLFNBQVM7O3FCQW1FdkIsUUFBUSIsImZpbGUiOiJJbmplY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICcuL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuY2xhc3MgSW5qZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdOZXh1cy5JbmplY3Rvcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgZmx1eDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1eCkuaXNSZXF1aXJlZCxcclxuICAgIHBhcmFtczogUmVhY3QuUHJvcFR5cGVzLmFueSxcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgfTtcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCB7IGZsdXgsIHBhcmFtcyB9ID0gdGhpcy5wcm9wcztcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZhbHVlczogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH07XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IF8ubm9vcDtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmUodGhpcy5wcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZhbHVlczogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW5zdWJzY3JpYmUoKSB7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlczogdm9pZCAwIH0pO1xyXG4gIH1cclxuXHJcbiAgc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0pIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0pO1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSBmbHV4Lm9ic2VydmUocGFyYW1zLCAoKSA9PlxyXG4gICAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICBpZihfLmFueShbXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5mbHV4LCBuZXh0UHJvcHMuZmx1eCksXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5wYXJhbXMsIG5leHRQcm9wcy5wYXJhbXMpLFxyXG4gICAgXSkpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpYmUobmV4dFByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLnNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4odmFsdWVzKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEluamVjdG9yO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
