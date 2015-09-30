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

var _fluxesFlux = require('../fluxes/Flux');

var _fluxesFlux2 = _interopRequireDefault(_fluxesFlux);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var _decoratorsPreparable = require('../decorators/preparable');

var _decoratorsPreparable2 = _interopRequireDefault(_decoratorsPreparable);

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
      flux: _react2['default'].PropTypes.instanceOf(_fluxesFlux2['default']).isRequired,
      params: _react2['default'].PropTypes.any,
      shouldComponentUpdate: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      shouldComponentUpdate: _utilsPureShouldComponentUpdate2['default']
    },
    enumerable: true
  }]);

  function Injector(props, context) {
    _classCallCheck(this, _Injector);

    _React$Component.call(this, props, context);
    var _props = this.props;
    var flux = _props.flux;
    var params = _props.params;

    this.state = {
      versions: flux.versions(params)
    };
    this.unobserve = null;
  }

  Injector.prototype.componentDidMount = function componentDidMount() {
    this.subscribe(this.props);
  };

  Injector.prototype.refreshState = function refreshState(_ref) {
    var flux = _ref.flux;
    var params = _ref.params;

    this.setState({
      versions: flux.versions(params)
    });
  };

  Injector.prototype.unsubscribe = function unsubscribe() {
    if (this.unobserve) {
      this.unobserve();
      this.setState({ versions: void 0 });
    }
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
    var _props2 = this.props;
    var children = _props2.children;
    var flux = _props2.flux;
    var params = _props2.params;

    return children(flux.versions(params));
  };

  var _Injector = Injector;
  Injector = _decoratorsPreparable2['default'](function (_ref3) {
    var flux = _ref3.flux;
    var params = _ref3.params;
    return flux.populate(params);
  })(Injector) || Injector;
  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSW5qZWN0b3IuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3lCQUNBLFlBQVk7Ozs7cUJBQ2hCLE9BQU87Ozs7MEJBRVIsZ0JBQWdCOzs7OzhDQUNLLG9DQUFvQzs7OztvQ0FDbkQsMEJBQTBCOzs7O0lBRzNDLFFBQVE7WUFBUixRQUFROztlQUFSLFFBQVE7O1dBQ1MsZ0JBQWdCOzs7O1dBQ2xCO0FBQ2pCLGNBQVEsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDekMsVUFBSSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxVQUFVLHlCQUFNLENBQUMsVUFBVTtBQUNqRCxZQUFNLEVBQUUsbUJBQU0sU0FBUyxDQUFDLEdBQUc7QUFDM0IsMkJBQXFCLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUk7S0FDNUM7Ozs7V0FDcUI7QUFDcEIsMkJBQXFCLDZDQUEyQjtLQUNqRDs7OztBQUVVLFdBWlAsUUFBUSxDQVlBLEtBQUssRUFBRSxPQUFPLEVBQUU7OztBQUMxQixnQ0FBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ0csSUFBSSxDQUFDLEtBQUs7UUFBM0IsSUFBSSxVQUFKLElBQUk7UUFBRSxNQUFNLFVBQU4sTUFBTTs7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGNBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUNoQyxDQUFDO0FBQ0YsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7R0FDdkI7O0FBbkJHLFVBQVEsV0FxQlosaUJBQWlCLEdBQUEsNkJBQUc7QUFDbEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDNUI7O0FBdkJHLFVBQVEsV0F5QlosWUFBWSxHQUFBLHNCQUFDLElBQWdCLEVBQUU7UUFBaEIsSUFBSSxHQUFOLElBQWdCLENBQWQsSUFBSTtRQUFFLE1BQU0sR0FBZCxJQUFnQixDQUFSLE1BQU07O0FBQ3pCLFFBQUksQ0FBQyxRQUFRLENBQUM7QUFDWixjQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0dBQ0o7O0FBN0JHLFVBQVEsV0ErQlosV0FBVyxHQUFBLHVCQUFHO0FBQ1osUUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQztHQUNGOztBQXBDRyxVQUFRLFdBc0NaLFNBQVMsR0FBQSxtQkFBQyxLQUFnQixFQUFFOzs7UUFBaEIsSUFBSSxHQUFOLEtBQWdCLENBQWQsSUFBSTtRQUFFLE1BQU0sR0FBZCxLQUFnQixDQUFSLE1BQU07O0FBQ3RCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNwQyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2FBQ3BDLE1BQUssWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7S0FBQSxDQUNwQyxDQUFDO0dBQ0g7O0FBNUNHLFVBQVEsV0E4Q1oseUJBQXlCLEdBQUEsbUNBQUMsU0FBUyxFQUFFO0FBQ25DLFFBQUcsb0JBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyx1QkFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQzNDLENBQUMsdUJBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUNoRCxDQUFDLEVBQUU7QUFDRixVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNCO0dBQ0Y7O0FBckRHLFVBQVEsV0F1RFosb0JBQW9CLEdBQUEsZ0NBQUc7QUFDckIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztBQXpERyxVQUFRLFdBMkRaLHFCQUFxQixHQUFBLGlDQUFVO3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0IsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDM0Q7O0FBN0RHLFVBQVEsV0ErRFosTUFBTSxHQUFBLGtCQUFHO2tCQUM0QixJQUFJLENBQUMsS0FBSztRQUFyQyxRQUFRLFdBQVIsUUFBUTtRQUFFLElBQUksV0FBSixJQUFJO1FBQUUsTUFBTSxXQUFOLE1BQU07O0FBQzlCLFdBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUN4Qzs7a0JBbEVHLFFBQVE7QUFBUixVQUFRLEdBRGIsa0NBQVcsVUFBQyxLQUFnQjtRQUFkLElBQUksR0FBTixLQUFnQixDQUFkLElBQUk7UUFBRSxNQUFNLEdBQWQsS0FBZ0IsQ0FBUixNQUFNO1dBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQ2xELFFBQVEsS0FBUixRQUFRO1NBQVIsUUFBUTtHQUFTLG1CQUFNLFNBQVM7O3FCQXFFdkIsUUFBUSIsImZpbGUiOiJjb21wb25lbnRzL0luamVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL2ZsdXhlcy9GbHV4JztcclxuaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi4vdXRpbHMvcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSc7XHJcbmltcG9ydCBwcmVwYXJhYmxlIGZyb20gJy4uL2RlY29yYXRvcnMvcHJlcGFyYWJsZSc7XHJcblxyXG5AcHJlcGFyYWJsZSgoeyBmbHV4LCBwYXJhbXMgfSkgPT4gZmx1eC5wb3B1bGF0ZShwYXJhbXMpKVxyXG5jbGFzcyBJbmplY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ05leHVzLkluamVjdG9yJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBmbHV4OiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihGbHV4KS5pc1JlcXVpcmVkLFxyXG4gICAgcGFyYW1zOiBSZWFjdC5Qcm9wVHlwZXMuYW55LFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICB9O1xyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgIGNvbnN0IHsgZmx1eCwgcGFyYW1zIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmVyc2lvbnM6IGZsdXgudmVyc2lvbnMocGFyYW1zKSxcclxuICAgIH07XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuc3Vic2NyaWJlKHRoaXMucHJvcHMpO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0pIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2ZXJzaW9uczogZmx1eC52ZXJzaW9ucyhwYXJhbXMpLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1bnN1YnNjcmliZSgpIHtcclxuICAgIGlmKHRoaXMudW5vYnNlcnZlKSB7XHJcbiAgICAgIHRoaXMudW5vYnNlcnZlKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2ZXJzaW9uczogdm9pZCAwIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0pIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0pO1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSBmbHV4Lm9ic2VydmUocGFyYW1zLCAoKSA9PlxyXG4gICAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICBpZihfLmFueShbXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5mbHV4LCBuZXh0UHJvcHMuZmx1eCksXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcy5wYXJhbXMsIG5leHRQcm9wcy5wYXJhbXMpLFxyXG4gICAgXSkpIHtcclxuICAgICAgdGhpcy5zdWJzY3JpYmUobmV4dFByb3BzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLnNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHsgY2hpbGRyZW4sIGZsdXgsIHBhcmFtcyB9ID0gdGhpcy5wcm9wcztcclxuICAgIHJldHVybiBjaGlsZHJlbihmbHV4LnZlcnNpb25zKHBhcmFtcykpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW5qZWN0b3I7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
