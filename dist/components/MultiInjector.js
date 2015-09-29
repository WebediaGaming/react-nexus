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

var MultiInjector = (function (_React$Component) {
  _inherits(MultiInjector, _React$Component);

  MultiInjector.destructureProps = function destructureProps(props) {
    return {
      children: props.children,
      shouldComponentUpdate: props.shouldComponentUpdate,
      bindings: _utilsOmitChildren2['default'](omitShouldComponentUpdate(props))
    };
  };

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
    _classCallCheck(this, MultiInjector);

    _React$Component.call(this, props, context);

    var _MultiInjector$destructureProps = MultiInjector.destructureProps(this.props);

    var bindings = _MultiInjector$destructureProps.bindings;

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

    var _MultiInjector$destructureProps2 = MultiInjector.destructureProps(this.props);

    var bindings = _MultiInjector$destructureProps2.bindings;

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

    var _MultiInjector$destructureProps3 = MultiInjector.destructureProps(this.props);

    var prevBindings = _MultiInjector$destructureProps3.bindings;

    var _MultiInjector$destructureProps4 = MultiInjector.destructureProps(nextProps);

    var nextBindings = _MultiInjector$destructureProps4.bindings;

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

    var _MultiInjector$destructureProps5 = MultiInjector.destructureProps(this.props);

    var bindings = _MultiInjector$destructureProps5.bindings;

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
    var _MultiInjector$destructureProps6 = MultiInjector.destructureProps(this.props);

    var children = _MultiInjector$destructureProps6.children;
    var bindings = _MultiInjector$destructureProps6.bindings;

    return children(_lodash2['default'].mapValues(bindings, function (_ref9) {
      var flux = _ref9.flux;
      var params = _ref9.params;
      return flux.versions(params);
    }));
  };

  return MultiInjector;
})(_react2['default'].Component);

exports['default'] = MultiInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTXVsdGlJbmplY3Rvci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3FCQUNoQixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7Ozs4Q0FJRCxvQ0FBb0M7Ozs7aUNBQ2pELHVCQUF1Qjs7OzswQkFDL0IsZ0JBQWdCOzs7O0FBSmpDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFNdkQsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN4QixTQUFPLENBQ0wsb0JBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO1dBQUssQ0FBQyxvQkFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUFBLENBQUMsRUFDekUsb0JBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLENBQUMsRUFBRSxDQUFDO1dBQUssQ0FBQyxvQkFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUFBLENBQUMsQ0FDMUUsQ0FBQztDQUNIOztBQUVELFNBQVMseUJBQXlCLENBQUMsS0FBSyxFQUFFO0FBQ3hDLFNBQU8sb0JBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0NBQy9DOztJQUVLLGFBQWE7WUFBYixhQUFhOztBQUFiLGVBQWEsQ0FVVixnQkFBZ0IsR0FBQSwwQkFBQyxLQUFLLEVBQUU7QUFDN0IsV0FBTztBQUNMLGNBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN4QiwyQkFBcUIsRUFBRSxLQUFL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Y2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuaW1wb3J0IG9taXRDaGlsZHJlbiBmcm9tICcuLi91dGlscy9vbWl0Q2hpbGRyZW4nO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9mbHV4ZXMvRmx1eCc7XHJcblxyXG5mdW5jdGlvbiBkaWZmKHByZXYsIG5leHQpIHtcclxuICByZXR1cm4gW1xyXG4gICAgXy5maWx0ZXIocHJldiwgKHYsIGspID0+ICFfLmhhcyhuZXh0LCBrKSB8fCAhZGVlcEVxdWFsKG5leHRba10sIHByZXZba10pKSxcclxuICAgIF8uZmlsdGVyKG5leHQsICh2LCBrKSA9PiAhXy5oYXMocHJldiwgaykgfHwgIWRlZXBFcXVhbChwcmV2W2tdLCBuZXh0W2tdKSksXHJcbiAgXTtcclxufVxyXG5cclxuZnVuY3Rpb24gb21pdFNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcykge1xyXG4gIHJldHVybiBfLm9taXQocHJvcHMsICdzaG91bGRDb21wb25lbnRVcGRhdGUnKTtcclxufVxyXG5cclxuY2xhc3MgTXVsdGlJbmplY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ05leHVzLk11bHRpSW5qZWN0b3InO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgfTtcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBkZXN0cnVjdHVyZVByb3BzKHByb3BzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjaGlsZHJlbjogcHJvcHMuY2hpbGRyZW4sXHJcbiAgICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gICAgICBiaW5kaW5nczogb21pdENoaWxkcmVuKG9taXRTaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMpKSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSkgPT5cclxuICAgICAgZmx1eC52ZXJzaW9ucyhwYXJhbXMpXHJcbiAgICApO1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSB7fTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PlxyXG4gICAgICB0aGlzLnN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIFtrZXldOiBmbHV4LnZlcnNpb25zKHBhcmFtcyksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVuc3Vic2NyaWJlKGtleSkge1xyXG4gICAgaWYoXy5oYXModGhpcy51bm9ic2VydmUsIGtleSkpIHtcclxuICAgICAgdGhpcy51bm9ic2VydmVba2V5XSgpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBba2V5XTogdm9pZCAwLFxyXG4gICAgICB9KTtcclxuICAgICAgZGVsZXRlIHRoaXMudW5vYnNlcnZlW2tleV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlKGtleSk7XHJcbiAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpO1xyXG4gICAgdGhpcy51bm9ic2VydmVba2V5XSA9IGZsdXgub2JzZXJ2ZShwYXJhbXMpLm1hcCgoKSA9PlxyXG4gICAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIGNvbnN0IHsgYmluZGluZ3M6IHByZXZCaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogbmV4dEJpbmRpbmdzIH0gPSBNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHMobmV4dFByb3BzKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgXy5lYWNoKG5leHRCaW5kaW5ncywgKHsgZmx1eCB9KSA9PiBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBbcmVtb3ZlZCwgYWRkZWRdID0gZGlmZihwcmV2QmluZGluZ3MsIG5leHRCaW5kaW5ncyk7XHJcbiAgICBfLmVhY2gocmVtb3ZlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy51bnN1YnNjcmliZShrZXkpKTtcclxuICAgIF8uZWFjaChhZGRlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy5zdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIGNvbnN0IHsgYmluZGluZ3MgfSA9IE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIF8uZWFjaChPYmplY3Qua2V5cyhiaW5kaW5ncyksIChrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgfVxyXG5cclxuICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiwgYmluZGluZ3MgfSA9IE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIHJldHVybiBjaGlsZHJlbihfLm1hcFZhbHVlcyhiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0pID0+IGZsdXgudmVyc2lvbnMocGFyYW1zKSkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXVsdGlJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
