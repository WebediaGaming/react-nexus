'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var _utilsOmitChildren = require('../utils/omitChildren');

var _utilsOmitChildren2 = _interopRequireDefault(_utilsOmitChildren);

var _fluxesFlux = require('../fluxes/Flux');

var _fluxesFlux2 = _interopRequireDefault(_fluxesFlux);

var _decoratorsPreparable = require('../decorators/preparable');

var _decoratorsPreparable2 = _interopRequireDefault(_decoratorsPreparable);

var __DEV__ = process.env.NODE_ENV === 'development';

function diff(prev, next) {
  return [_lodash2['default'].filter(prev, function (v, k) {
    return !_lodash2['default'].has(next, k) || !_deepEqual2['default'](next[k], prev[k]);
  }), _lodash2['default'].filter(next, function (v, k) {
    return !_lodash2['default'].has(prev, k) || !_deepEqual2['default'](prev[k], next[k]);
  })];
}

function omitShouldComponentUpdate(props) {
  return _lodash2['default'].omit(props, 'shouldComponentUpdate');
}

function destructureProps(props) {
  return {
    children: props.children,
    shouldComponentUpdate: props.shouldComponentUpdate,
    bindings: _utilsOmitChildren2['default'](omitShouldComponentUpdate(props))
  };
}

var MultiInjector = (function (_React$Component) {
  _inherits(MultiInjector, _React$Component);

  _createClass(MultiInjector, null, [{
    key: 'displayName',
    value: 'Nexus.MultiInjector',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.func.isRequired,
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

  function MultiInjector(props, context) {
    _classCallCheck(this, _MultiInjector);

    _React$Component.call(this, props, context);

    var _destructureProps = destructureProps(this.props);

    var bindings = _destructureProps.bindings;

    if (__DEV__) {
      _lodash2['default'].each(bindings, function (_ref) {
        var flux = _ref.flux;
        return _shouldAsFunction2['default'](flux).be.an.instanceOf(_fluxesFlux2['default']);
      });
    }
    this.state = _lodash2['default'].mapValues(bindings, function (_ref2) {
      var flux = _ref2.flux;
      var params = _ref2.params;
      return flux.versions(params);
    });
    this.unobserve = {};
  }

  MultiInjector.prototype.componentDidMount = function componentDidMount() {
    var _this = this;

    var _destructureProps2 = destructureProps(this.props);

    var bindings = _destructureProps2.bindings;

    _lodash2['default'].each(bindings, function (_ref3, key) {
      var flux = _ref3.flux;
      var params = _ref3.params;
      return _this.subscribe({ flux: flux, params: params }, key);
    });
  };

  MultiInjector.prototype.refreshState = function refreshState(_ref4, key) {
    var flux = _ref4.flux;
    var params = _ref4.params;

    var _setState;

    this.setState((_setState = {}, _setState[key] = flux.versions(params), _setState));
  };

  MultiInjector.prototype.unsubscribe = function unsubscribe(key) {
    if (_lodash2['default'].has(this.unobserve, key)) {
      var _setState2;

      this.unobserve[key]();
      this.setState((_setState2 = {}, _setState2[key] = void 0, _setState2));
      delete this.unobserve[key];
    }
  };

  MultiInjector.prototype.subscribe = function subscribe(_ref5, key) {
    var _this2 = this;

    var flux = _ref5.flux;
    var params = _ref5.params;

    this.unsubscribe(key);
    this.refreshState({ flux: flux, params: params }, key);
    this.unobserve[key] = flux.observe(params).map(function () {
      return _this2.refreshState({ flux: flux, params: params }, key);
    });
  };

  MultiInjector.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    var _destructureProps3 = destructureProps(this.props);

    var prevBindings = _destructureProps3.bindings;

    var _destructureProps4 = destructureProps(nextProps);

    var nextBindings = _destructureProps4.bindings;

    if (__DEV__) {
      _lodash2['default'].each(nextBindings, function (_ref6) {
        var flux = _ref6.flux;
        return _shouldAsFunction2['default'](flux).be.an.instanceOf(_fluxesFlux2['default']);
      });
    }

    var _diff = diff(prevBindings, nextBindings);

    var removed = _diff[0];
    var added = _diff[1];

    _lodash2['default'].each(removed, function (_ref7, key) {
      var flux = _ref7.flux;
      var params = _ref7.params;
      return _this3.unsubscribe(key);
    });
    _lodash2['default'].each(added, function (_ref8, key) {
      var flux = _ref8.flux;
      var params = _ref8.params;
      return _this3.subscribe({ flux: flux, params: params }, key);
    });
  };

  MultiInjector.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this4 = this;

    var _destructureProps5 = destructureProps(this.props);

    var bindings = _destructureProps5.bindings;

    _lodash2['default'].each(_Object$keys(bindings), function (key) {
      return _this4.unsubscribe(key);
    });
  };

  MultiInjector.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    var _props$shouldComponentUpdate;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_props$shouldComponentUpdate = this.props.shouldComponentUpdate).apply.apply(_props$shouldComponentUpdate, [this].concat(args));
  };

  MultiInjector.prototype.render = function render() {
    var _destructureProps6 = destructureProps(this.props);

    var children = _destructureProps6.children;
    var bindings = _destructureProps6.bindings;

    return children(_lodash2['default'].mapValues(bindings, function (_ref9) {
      var flux = _ref9.flux;
      var params = _ref9.params;
      return flux.versions(params);
    }));
  };

  var _MultiInjector = MultiInjector;
  MultiInjector = _decoratorsPreparable2['default'](function (props) {
    var _destructureProps7 = destructureProps(props);

    var bindings = _destructureProps7.bindings;

    return _bluebird2['default'].all(_lodash2['default'].map(bindings, function (_ref10) {
      var flux = _ref10.flux;
      var params = _ref10.params;
      return flux.populate(params);
    }));
  })(MultiInjector) || MultiInjector;
  return MultiInjector;
})(_react2['default'].Component);

exports['default'] = MultiInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTXVsdGlJbmplY3Rvci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3dCQUNkLFVBQVU7Ozs7cUJBQ1osT0FBTzs7OztnQ0FDTixvQkFBb0I7Ozs7OENBSUQsb0NBQW9DOzs7O2lDQUNqRCx1QkFBdUI7Ozs7MEJBQy9CLGdCQUFnQjs7OztvQ0FDViwwQkFBMEI7Ozs7QUFMakQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOztBQU92RCxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLFNBQU8sQ0FDTCxvQkFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUM7V0FBSyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxFQUN6RSxvQkFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUM7V0FBSyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUMxRSxDQUFDO0NBQ0g7O0FBRUQsU0FBUyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUU7QUFDeEMsU0FBTyxvQkFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLHVCQUF1QixDQUFDLENBQUM7Q0FDL0M7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7QUFDL0IsU0FBTztBQUNMLFlBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN4Qix5QkFBcUIsRUFBRSxLQUFLLENB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QUMsUUFBUSxFQUFFLFVBQUMsTUFBZ0I7VUFBZCxJQUFJLEdBQU4sTUFBZ0IsQ0FBZCxJQUFJO1VBQUUsTUFBTSxHQUFkLE1BQWdCLENBQVIsTUFBTTthQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUM7R0FDbEYsQ0FBQyxDQUNJLGFBQWEsS0FBYixhQUFhO1NBQWIsYUFBYTtHQUFTLG1CQUFNLFNBQVM7O3FCQStFNUIsYUFBYSIsImZpbGUiOiJjb21wb25lbnRzL011bHRpSW5qZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlIGZyb20gJy4uL3V0aWxzL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5pbXBvcnQgb21pdENoaWxkcmVuIGZyb20gJy4uL3V0aWxzL29taXRDaGlsZHJlbic7XHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL2ZsdXhlcy9GbHV4JztcclxuaW1wb3J0IHByZXBhcmFibGUgZnJvbSAnLi4vZGVjb3JhdG9ycy9wcmVwYXJhYmxlJztcclxuXHJcbmZ1bmN0aW9uIGRpZmYocHJldiwgbmV4dCkge1xyXG4gIHJldHVybiBbXHJcbiAgICBfLmZpbHRlcihwcmV2LCAodiwgaykgPT4gIV8uaGFzKG5leHQsIGspIHx8ICFkZWVwRXF1YWwobmV4dFtrXSwgcHJldltrXSkpLFxyXG4gICAgXy5maWx0ZXIobmV4dCwgKHYsIGspID0+ICFfLmhhcyhwcmV2LCBrKSB8fCAhZGVlcEVxdWFsKHByZXZba10sIG5leHRba10pKSxcclxuICBdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbWl0U2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSB7XHJcbiAgcmV0dXJuIF8ub21pdChwcm9wcywgJ3Nob3VsZENvbXBvbmVudFVwZGF0ZScpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXN0cnVjdHVyZVByb3BzKHByb3BzKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGNoaWxkcmVuOiBwcm9wcy5jaGlsZHJlbixcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gICAgYmluZGluZ3M6IG9taXRDaGlsZHJlbihvbWl0U2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSksXHJcbiAgfTtcclxufVxyXG5cclxuQHByZXBhcmFibGUoKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyBiaW5kaW5ncyB9ID0gZGVzdHJ1Y3R1cmVQcm9wcyhwcm9wcyk7XHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSkgPT4gZmx1eC5wb3B1bGF0ZShwYXJhbXMpKSk7XHJcbn0pXHJcbmNsYXNzIE11bHRpSW5qZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdOZXh1cy5NdWx0aUluamVjdG9yJztcclxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xyXG4gICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxyXG4gIH07XHJcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSxcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4IH0pID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3RhdGUgPSBfLm1hcFZhbHVlcyhiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0pID0+XHJcbiAgICAgIGZsdXgudmVyc2lvbnMocGFyYW1zKVxyXG4gICAgKTtcclxuICAgIHRoaXMudW5vYnNlcnZlID0ge307XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIGNvbnN0IHsgYmluZGluZ3MgfSA9IGRlc3RydWN0dXJlUHJvcHModGhpcy5wcm9wcyk7XHJcbiAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+XHJcbiAgICAgIHRoaXMuc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgW2tleV06IGZsdXgudmVyc2lvbnMocGFyYW1zKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW5zdWJzY3JpYmUoa2V5KSB7XHJcbiAgICBpZihfLmhhcyh0aGlzLnVub2JzZXJ2ZSwga2V5KSkge1xyXG4gICAgICB0aGlzLnVub2JzZXJ2ZVtrZXldKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIFtrZXldOiB2b2lkIDAsXHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGUgdGhpcy51bm9ic2VydmVba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoa2V5KTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZVtrZXldID0gZmx1eC5vYnNlcnZlKHBhcmFtcykubWFwKCgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogcHJldkJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogbmV4dEJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIF8uZWFjaChuZXh0QmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgW3JlbW92ZWQsIGFkZGVkXSA9IGRpZmYocHJldkJpbmRpbmdzLCBuZXh0QmluZGluZ3MpO1xyXG4gICAgXy5lYWNoKHJlbW92ZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgICBfLmVhY2goYWRkZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMuc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgXy5lYWNoKE9iamVjdC5rZXlzKGJpbmRpbmdzKSwgKGtleSkgPT4gdGhpcy51bnN1YnNjcmliZShrZXkpKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBiaW5kaW5ncyB9ID0gZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIHJldHVybiBjaGlsZHJlbihfLm1hcFZhbHVlcyhiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0pID0+IGZsdXgudmVyc2lvbnMocGFyYW1zKSkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXVsdGlJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
