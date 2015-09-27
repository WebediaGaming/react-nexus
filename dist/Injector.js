'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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

    _get(Object.getPrototypeOf(Injector.prototype), 'constructor', this).call(this, props, context);
    var _props = this.props;
    var flux = _props.flux;
    var params = _props.params;

    this.state = {
      values: flux.values(params)
    };
    this.unobserve = _lodash2['default'].noop;
  }

  _createClass(Injector, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.subscribe(this.props);
    }
  }, {
    key: 'refreshState',
    value: function refreshState(_ref) {
      var flux = _ref.flux;
      var params = _ref.params;

      this.setState({
        values: flux.values(params)
      });
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe() {
      this.unobserve();
      this.setState({ values: void 0 });
    }
  }, {
    key: 'subscribe',
    value: function subscribe(_ref2) {
      var _this = this;

      var flux = _ref2.flux;
      var params = _ref2.params;

      this.unsubscribe();
      this.refreshState({ flux: flux, params: params });
      this.unobserve = flux.observe(params, function () {
        return _this.refreshState({ flux: flux, params: params });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (_lodash2['default'].any([!(0, _deepEqual2['default'])(this.props.flux, nextProps.flux), !(0, _deepEqual2['default'])(this.props.params, nextProps.params)])) {
        this.subscribe(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.props.shouldComponentUpdate.apply(this, args);
    }
  }, {
    key: 'render',
    value: function render() {
      var values = this.state.values;

      return this.children(values);
    }
  }]);

  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDM0Q7OztXQUVLLGtCQUFHO1VBQ0MsTUFBTSxHQUFLLElBQUksQ0FBQyxLQUFLLENBQXJCLE1BQU07O0FBQ2QsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCOzs7U0FoRUcsUUFBUTtHQUFTLG1CQUFNLFNBQVM7O3FCQW1FdkIsUUFBUSIsImZpbGUiOiJJbmplY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICcuL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5cclxuY2xhc3MgSW5qZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdOZXh1cy5JbmplY3Rvcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgZmx1eDogUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1eCkuaXNSZXF1aXJlZCxcclxuICAgIHBhcmFtczogUmVhY3QuUHJvcFR5cGVzLmFueSxcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgfTtcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCB7IGZsdXgsIHBhcmFtcyB9ID0gdGhpcy5wcm9wcztcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZhbHVlczogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH07XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IF8ubm9vcDtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmUodGhpcy5wcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZhbHVlczogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW5zdWJzY3JpYmUoKSB7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlczogdm9pZCAwIH0pO1xyXG4gIH1cclxuXHJcbiAgc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0pIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0pO1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSBmbHV4Lm9ic2VydmUocGFyYW1zLCAoKSA9PlxyXG4gICAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICBpZihfLmFueShbXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5mbHV4LCBuZXh0UHJvcHMuZmx1eCksXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5wYXJhbXMsIG5leHRQcm9wcy5wYXJhbXMpLFxyXG4gICAgXSkpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpYmUobmV4dFByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLnNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4odmFsdWVzKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEluamVjdG9yO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=