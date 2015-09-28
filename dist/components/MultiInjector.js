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

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

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
        return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
      });
    }
    this.state = _lodash2['default'].mapValues(bindings, function (_ref2) {
      var flux = _ref2.flux;
      var params = _ref2.params;
      return flux.values(params);
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

    this.setState((_setState = {}, _setState[key] = flux.values(params), _setState));
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
        return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
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
      return flux.values(params);
    }));
  };

  return MultiInjector;
})(_react2['default'].Component);

exports['default'] = MultiInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTXVsdGlJbmplY3Rvci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3FCQUNoQixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7Ozs4Q0FJRCxvQ0FBb0M7Ozs7aUNBQ2pELHVCQUF1Qjs7OztvQkFDL0IsU0FBUzs7OztBQUoxQixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7O0FBTXZELFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDeEIsU0FBTyxDQUNMLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsb0JBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLEVBQ3pFLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsb0JBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLENBQzFFLENBQUM7Q0FDSDs7QUFFRCxTQUFTLHlCQUF5QixDQUFDLEtBQUssRUFBRTtBQUN4QyxTQUFPLG9CQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztDQUMvQzs7SUFFSyxhQUFhO1lBQWIsYUFBYTs7QUFBYixlQUFhLENBVVYsZ0JBQWdCLEdBQUEsMEJBQUMsS0FBSyxFQUFFO0FBQzdCLFdBQU87QUFDTCxjQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7QUFDeEIsMkJBQXFCLEVBQUUsS0FBSyxD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c0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi4vdXRpbHMvcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSc7XHJcbmltcG9ydCBvbWl0Q2hpbGRyZW4gZnJvbSAnLi4vdXRpbHMvb21pdENoaWxkcmVuJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi4vRmx1eCc7XHJcblxyXG5mdW5jdGlvbiBkaWZmKHByZXYsIG5leHQpIHtcclxuICByZXR1cm4gW1xyXG4gICAgXy5maWx0ZXIocHJldiwgKHYsIGspID0+ICFfLmhhcyhuZXh0LCBrKSB8fCAhZGVlcEVxdWFsKG5leHRba10sIHByZXZba10pKSxcclxuICAgIF8uZmlsdGVyKG5leHQsICh2LCBrKSA9PiAhXy5oYXMocHJldiwgaykgfHwgIWRlZXBFcXVhbChwcmV2W2tdLCBuZXh0W2tdKSksXHJcbiAgXTtcclxufVxyXG5cclxuZnVuY3Rpb24gb21pdFNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcykge1xyXG4gIHJldHVybiBfLm9taXQocHJvcHMsICdzaG91bGRDb21wb25lbnRVcGRhdGUnKTtcclxufVxyXG5cclxuY2xhc3MgTXVsdGlJbmplY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ05leHVzLk11bHRpSW5qZWN0b3InO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgfTtcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBkZXN0cnVjdHVyZVByb3BzKHByb3BzKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjaGlsZHJlbjogcHJvcHMuY2hpbGRyZW4sXHJcbiAgICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gICAgICBiaW5kaW5nczogb21pdENoaWxkcmVuKG9taXRTaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMpKSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xyXG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSkgPT5cclxuICAgICAgZmx1eC52YWx1ZXMocGFyYW1zKVxyXG4gICAgKTtcclxuICAgIHRoaXMudW5vYnNlcnZlID0ge307XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIGNvbnN0IHsgYmluZGluZ3MgfSA9IE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIF8uZWFjaChiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT5cclxuICAgICAgdGhpcy5zdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBba2V5XTogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW5zdWJzY3JpYmUoa2V5KSB7XHJcbiAgICBpZihfLmhhcyh0aGlzLnVub2JzZXJ2ZSwga2V5KSkge1xyXG4gICAgICB0aGlzLnVub2JzZXJ2ZVtrZXldKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIFtrZXldOiB2b2lkIDAsXHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGUgdGhpcy51bm9ic2VydmVba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoa2V5KTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZVtrZXldID0gZmx1eC5vYnNlcnZlKHBhcmFtcykubWFwKCgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogcHJldkJpbmRpbmdzIH0gPSBNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHModGhpcy5wcm9wcyk7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzOiBuZXh0QmluZGluZ3MgfSA9IE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBfLmVhY2gobmV4dEJpbmRpbmdzLCAoeyBmbHV4IH0pID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IFtyZW1vdmVkLCBhZGRlZF0gPSBkaWZmKHByZXZCaW5kaW5ncywgbmV4dEJpbmRpbmdzKTtcclxuICAgIF8uZWFjaChyZW1vdmVkLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PiB0aGlzLnVuc3Vic2NyaWJlKGtleSkpO1xyXG4gICAgXy5lYWNoKGFkZGVkLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PiB0aGlzLnN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgXy5lYWNoKE9iamVjdC5rZXlzKGJpbmRpbmdzKSwgKGtleSkgPT4gdGhpcy51bnN1YnNjcmliZShrZXkpKTtcclxuICB9XHJcblxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSguLi5hcmdzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgLi4uYXJncyk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBiaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuKF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSkgPT4gZmx1eC52YWx1ZXMocGFyYW1zKSkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXVsdGlJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
