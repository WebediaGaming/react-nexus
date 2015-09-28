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

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

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
      flux: _react2['default'].PropTypes.instanceOf(_Flux2['default']).isRequired,
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
      values: flux.values(params)
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
      values: flux.values(params)
    });
  };

  Injector.prototype.unsubscribe = function unsubscribe() {
    if (this.unobserve) {
      this.unobserve();
      this.setState({ values: void 0 });
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

    return children(flux.values(params));
  };

  return Injector;
})(_react2['default'].Component);

exports['default'] = Injector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSW5qZWN0b3IuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O3lCQUNBLFlBQVk7Ozs7cUJBQ2hCLE9BQU87Ozs7b0JBRVIsU0FBUzs7Ozs4Q0FDWSxvQ0FBb0M7Ozs7SUFFcEUsUUFBUTtZQUFSLFFBQVE7O2VBQVIsUUFBUTs7V0FDUyxnQkFBZ0I7Ozs7V0FDbEI7QUFDakIsY0FBUSxFQUFFLG1CQUFNLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtBQUN6QyxVQUFJLEVBQUUsbUJBQU0sU0FBUyxDQUFDLFVBQVUsbUJBQU0sQ0FBQyxVQUFVO0FBQ2pELFlBQU0sRUFBRSxtQkFBTSxTQUFTLENBQUMsR0FBRztBQUMzQiwyQkFBcUIsRUFBRSxtQkFBTSxTQUFTLENBQUMsSUFBSTtLQUM1Qzs7OztXQUNxQjtBQUNwQiwyQkFBcUIsNkNBQTJCO0tBQ2pEOzs7O0FBRVUsV0FaUCxRQUFRLENBWUEsS0FBSyxFQUFFLE9BQU8sRUFBRTswQkFaeEIsUUFBUTs7QUFhVixnQ0FBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ0csSUFBSSxDQUFDLEtBQUs7UUFBM0IsSUFBSSxVQUFKLElBQUk7UUFBRSxNQUFNLFVBQU4sTUFBTTs7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLFlBQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUM1QixDQUFDO0FBQ0YsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7R0FDdkI7O0FBbkJHLFVBQVEsV0FxQlosaUJBQWlCLEdBQUEsNkJBQUc7QUFDbEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDNUI7O0FBdkJHLFVBQVEsV0F5QlosWUFBWSxHQUFBLHNCQUFDLElBQWdCLEVBQUU7UUFBaEIsSUFBSSxHQUFOLElBQWdCLENBQWQsSUFBSTtRQUFFLE1BQU0sR0FBZCxJQUFnQixDQUFSLE1BQU07O0FBQ3pCLFFBQUksQ0FBQyxRQUFRLENBQUM7QUFDWixZQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDNUIsQ0FBQyxDQUFDO0dBQ0o7O0FBN0JHLFVBQVEsV0ErQlosV0FBVyxHQUFBLHVCQUFHO0FBQ1osUUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNuQztHQUNGOztBQXBDRyxVQUFRLFdBc0NaLFNBQVMsR0FBQSxtQkFBQyxLQUFnQixFQUFFOzs7UUFBaEIsSUFBSSxHQUFOLEtBQWdCLENBQWQsSUFBSTtRQUFFLE1BQU0sR0FBZCxLQUFnQixDQUFSLE1BQU07O0FBQ3RCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNwQyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2FBQ3BDLE1BQUssWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7S0FBQSxDQUNwQyxDQUFDO0dBQ0g7O0FBNUNHLFVBQVEsV0E4Q1oseUJBQXlCLEdBQUEsbUNBQUMsU0FBUyxFQUFFO0FBQ25DLFFBQUcsb0JBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyx1QkFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQzNDLENBQUMsdUJBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUNoRCxDQUFDLEVBQUU7QUFDRixVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNCO0dBQ0Y7O0FBckRHLFVBQVEsV0F1RFosb0JBQW9CLEdBQUEsZ0NBQUc7QUFDckIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztBQXpERyxVQUFRLFdBMkRaLHFCQUFxQixHQUFBLGlDQUFVO3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0IsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDM0Q7O0FBN0RHLFVBQVEsV0ErRFosTUFBTSxHQUFBLGtCQUFHO2tCQUM0QixJQUFJLENBQUMsS0FBSztRQUFyQyxRQUFRLFdBQVIsUUFBUTtRQUFFLElBQUksV0FBSixJQUFJO1FBQUUsTUFBTSxXQUFOLE1BQU07O0FBQzlCLFdBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUN0Qzs7U0FsRUcsUUFBUTtHQUFTLG1CQUFNLFNBQVM7O3FCQXFFdkIsUUFBUSIsImZpbGUiOiJjb21wb25lbnRzL0luamVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL0ZsdXgnO1xyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuXHJcbmNsYXNzIEluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuSW5qZWN0b3InO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIGZsdXg6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdXgpLmlzUmVxdWlyZWQsXHJcbiAgICBwYXJhbXM6IFJlYWN0LlByb3BUeXBlcy5hbnksXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gIH07XHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgeyBmbHV4LCBwYXJhbXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2YWx1ZXM6IGZsdXgudmFsdWVzKHBhcmFtcyksXHJcbiAgICB9O1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLnN1YnNjcmliZSh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmFsdWVzOiBmbHV4LnZhbHVlcyhwYXJhbXMpLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1bnN1YnNjcmliZSgpIHtcclxuICAgIGlmKHRoaXMudW5vYnNlcnZlKSB7XHJcbiAgICAgIHRoaXMudW5vYnNlcnZlKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZXM6IHZvaWQgMCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9KTtcclxuICAgIHRoaXMudW5vYnNlcnZlID0gZmx1eC5vYnNlcnZlKHBhcmFtcywgKCkgPT5cclxuICAgICAgdGhpcy5yZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgaWYoXy5hbnkoW1xyXG4gICAgICAhZGVlcEVxdWFsKHRoaXMucHJvcHMuZmx1eCwgbmV4dFByb3BzLmZsdXgpLFxyXG4gICAgICAhZGVlcEVxdWFsKHRoaXMucHJvcHMucGFyYW1zLCBuZXh0UHJvcHMucGFyYW1zKSxcclxuICAgIF0pKSB7XHJcbiAgICAgIHRoaXMuc3Vic2NyaWJlKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBmbHV4LCBwYXJhbXMgfSA9IHRoaXMucHJvcHM7XHJcbiAgICByZXR1cm4gY2hpbGRyZW4oZmx1eC52YWx1ZXMocGFyYW1zKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
