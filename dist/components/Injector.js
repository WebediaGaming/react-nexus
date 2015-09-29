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
    _classCallCheck(this, Injector);

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

  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSW5qZWN0b3IuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3lCQUNBLFlBQVk7Ozs7cUJBQ2hCLE9BQU87Ozs7MEJBRVIsZ0JBQWdCOzs7OzhDQUNLLG9DQUFvQzs7OztJQUVwRSxRQUFRO1lBQVIsUUFBUTs7ZUFBUixRQUFROztXQUNTLGdCQUFnQjs7OztXQUNsQjtBQUNqQixjQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVO0FBQ3pDLFVBQUksRUFBRSxtQkFBTSxTQUFTLENBQUMsVUFBVSx5QkFBTSxDQUFDLFVBQVU7QUFDakQsWUFBTSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxHQUFHO0FBQzNCLDJCQUFxQixFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJO0tBQzVDOzs7O1dBQ3FCO0FBQ3BCLDJCQUFxQiw2Q0FBMkI7S0FDakQ7Ozs7QUFFVSxXQVpQLFFBQVEsQ0FZQSxLQUFLLEVBQUUsT0FBTyxFQUFFOzBCQVp4QixRQUFROztBQWFWLGdDQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDRyxJQUFJLENBQUMsS0FBSztRQUEzQixJQUFJLFVBQUosSUFBSTtRQUFFLE1BQU0sVUFBTixNQUFNOztBQUNwQixRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsY0FBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQ2hDLENBQUM7QUFDRixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7QUFuQkcsVUFBUSxXQXFCWixpQkFBaUIsR0FBQSw2QkFBRztBQUNsQixRQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUM1Qjs7QUF2QkcsVUFBUSxXQXlCWixZQUFZLEdBQUEsc0JBQUMsSUFBZ0IsRUFBRTtRQUFoQixJQUFJLEdBQU4sSUFBZ0IsQ0FBZCxJQUFJO1FBQUUsTUFBTSxHQUFkLElBQWdCLENBQVIsTUFBTTs7QUFDekIsUUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNaLGNBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUNoQyxDQUFDLENBQUM7R0FDSjs7QUE3QkcsVUFBUSxXQStCWixXQUFXLEdBQUEsdUJBQUc7QUFDWixRQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDakIsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0dBQ0Y7O0FBcENHLFVBQVEsV0FzQ1osU0FBUyxHQUFBLG1CQUFDLEtBQWdCLEVBQUU7OztRQUFoQixJQUFJLEdBQU4sS0FBZ0IsQ0FBZCxJQUFJO1FBQUUsTUFBTSxHQUFkLEtBQWdCLENBQVIsTUFBTTs7QUFDdEIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7YUFDcEMsTUFBSyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQztLQUFBLENBQ3BDLENBQUM7R0FDSDs7QUE1Q0csVUFBUSxXQThDWix5QkFBeUIsR0FBQSxtQ0FBQyxTQUFTLEVBQUU7QUFDbkMsUUFBRyxvQkFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLHVCQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDM0MsQ0FBQyx1QkFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQ2hELENBQUMsRUFBRTtBQUNGLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDM0I7R0FDRjs7QUFyREcsVUFBUSxXQXVEWixvQkFBb0IsR0FBQSxnQ0FBRztBQUNyQixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O0FBekRHLFVBQVEsV0EyRFoscUJBQXFCLEdBQUEsaUNBQVU7c0NBQU4sSUFBSTtBQUFKLFVBQUk7OztBQUMzQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUMzRDs7QUE3REcsVUFBUSxXQStEWixNQUFNLEdBQUEsa0JBQUc7a0JBQzRCLElBQUksQ0FBQyxLQUFLO1FBQXJDLFFBQVEsV0FBUixRQUFRO1FBQUUsSUFBSSxXQUFKLElBQUk7UUFBRSxNQUFNLFdBQU4sTUFBTTs7QUFDOUIsV0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQ3hDOztTQWxFRyxRQUFRO0dBQVMsbUJBQU0sU0FBUzs7cUJBcUV2QixRQUFRIiwiZmlsZSI6ImNvbXBvbmVudHMvSW5qZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vZmx1eGVzL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuXHJcbmNsYXNzIEluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuSW5qZWN0b3InO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIGZsdXg6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdXgpLmlzUmVxdWlyZWQsXHJcbiAgICBwYXJhbXM6IFJlYWN0LlByb3BUeXBlcy5hbnksXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gIH07XHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgeyBmbHV4LCBwYXJhbXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2ZXJzaW9uczogZmx1eC52ZXJzaW9ucyhwYXJhbXMpLFxyXG4gICAgfTtcclxuICAgIHRoaXMudW5vYnNlcnZlID0gbnVsbDtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpYmUodGhpcy5wcm9wcyk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZlcnNpb25zOiBmbHV4LnZlcnNpb25zKHBhcmFtcyksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVuc3Vic2NyaWJlKCkge1xyXG4gICAgaWYodGhpcy51bm9ic2VydmUpIHtcclxuICAgICAgdGhpcy51bm9ic2VydmUoKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZlcnNpb25zOiB2b2lkIDAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSkge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5yZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IGZsdXgub2JzZXJ2ZShwYXJhbXMsICgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIGlmKF8uYW55KFtcclxuICAgICAgIWRlZXBFcXVhbCh0aGlzLnByb3BzLmZsdXgsIG5leHRQcm9wcy5mbHV4KSxcclxuICAgICAgIWRlZXBFcXVhbCh0aGlzLnByb3BzLnBhcmFtcywgbmV4dFByb3BzLnBhcmFtcyksXHJcbiAgICBdKSkge1xyXG4gICAgICB0aGlzLnN1YnNjcmliZShuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiwgZmx1eCwgcGFyYW1zIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuKGZsdXgudmVyc2lvbnMocGFyYW1zKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
