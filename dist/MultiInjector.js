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

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

var _omitChildren = require('./omitChildren');

var _omitChildren2 = _interopRequireDefault(_omitChildren);

var _Flux = require('./Flux');

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

function destructureProps(props) {
  return {
    children: props.children,
    shouldComponentUpdate: props.shouldComponentUpdate,
    bindings: _omitChildren2['default'](omitShouldComponentUpdate(props))
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
      shouldComponentUpdate: _pureShouldComponentUpdate2['default']
    },
    enumerable: true
  }]);

  function MultiInjector(props, context) {
    _classCallCheck(this, MultiInjector);

    _React$Component.call(this, props, context);

    var _destructureProps = destructureProps(this.props);

    var bindings = _destructureProps.bindings;

    if (__DEV__) {
      _lodash2['default'].each(bindings, function (_ref) {
        var flux = _ref.flux;
        return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
      });
    }
    this.state = _lodash2['default'].mapValues(bindings, function (_ref2, key) {
      var flux = _ref2.flux;
      var params = _ref2.params;
      return flux.values(key);
    });
    this.unobserve = _lodash2['default'].mapValues(bindings, function () {
      return _lodash2['default'].noop;
    });
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

    var _destructureProps3 = destructureProps(this.props);

    var prevBindings = _destructureProps3.bindings;

    var _destructureProps4 = destructureProps(nextProps);

    var nextBindings = _destructureProps4.bindings;

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

    _lodash2['default'].each(_Object$keys(this.unobserve), function (key) {
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
    return this.props.children(this.state);
  };

  return MultiInjector;
})(_react2['default'].Component);

exports['default'] = MultiInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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R0FBZCxLQUFnQixDQUFSLE1BQU07YUFBWSxPQUFLLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxFQUFFLEdBQUcsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUNqRjs7QUE5REcsZUFBYSxXQWdFakIsb0JBQW9CLEdBQUEsZ0NBQUc7OztBQUNyQix3QkFBRSxJQUFJLENBQUMsYUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBQyxHQUFHO2FBQUssT0FBSyxXQUFXLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0dBQ3JFOztBQWxFRyxlQUFhLFdBb0VqQixxQkFBcUIsR0FBQSxpQ0FBVTs7O3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0IsV0FBTyxnQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFDLEtBQUssTUFBQSxnQ0FBQyxJQUFJLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDOUQ7O0FBdEVHLGVBQWEsV0F3RWpCLE1BQU0sR0FBQSxrQkFBRztBQUNQLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hDOztTQTFFRyxhQUFhO0dBQVMsbUJBQU0sU0FBUzs7cUJBNkU1QixhQUFhIiwiZmlsZSI6Ik11bHRpSW5qZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuL3B1cmVTaG91bGRDb21wb25lbnRVcGRhdGUnO1xyXG5pbXBvcnQgb21pdENoaWxkcmVuIGZyb20gJy4vb21pdENoaWxkcmVuJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuXHJcbmZ1bmN0aW9uIGRpZmYocHJldiwgbmV4dCkge1xyXG4gIHJldHVybiBbXHJcbiAgICBfLmZpbHRlcihwcmV2LCAodiwgaykgPT4gIV8uaGFzKG5leHQsIGspIHx8ICFkZWVwRXF1YWwobmV4dFtrXSwgcHJldltrXSkpLFxyXG4gICAgXy5maWx0ZXIobmV4dCwgKHYsIGspID0+ICFfLmhhcyhwcmV2LCBrKSB8fCAhZGVlcEVxdWFsKHByZXZba10sIG5leHRba10pKSxcclxuICBdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbWl0U2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSB7XHJcbiAgcmV0dXJuIF8ub21pdChwcm9wcywgJ3Nob3VsZENvbXBvbmVudFVwZGF0ZScpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXN0cnVjdHVyZVByb3BzKHByb3BzKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGNoaWxkcmVuOiBwcm9wcy5jaGlsZHJlbixcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogcHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gICAgYmluZGluZ3M6IG9taXRDaGlsZHJlbihvbWl0U2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSksXHJcbiAgfTtcclxufVxyXG5cclxuY2xhc3MgTXVsdGlJbmplY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ05leHVzLk11bHRpSW5qZWN0b3InO1xyXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICBjaGlsZHJlbjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICAgIHNob3VsZENvbXBvbmVudFVwZGF0ZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXHJcbiAgfTtcclxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZSA9IF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PlxyXG4gICAgICBmbHV4LnZhbHVlcyhrZXkpXHJcbiAgICApO1xyXG4gICAgdGhpcy51bm9ic2VydmUgPSBfLm1hcFZhbHVlcyhiaW5kaW5ncywgKCkgPT4gXy5ub29wKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgY29uc3QgeyBiaW5kaW5ncyB9ID0gZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIF8uZWFjaChiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT5cclxuICAgICAgdGhpcy5zdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBba2V5XTogZmx1eC52YWx1ZXMocGFyYW1zKSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW5zdWJzY3JpYmUoa2V5KSB7XHJcbiAgICBpZihfLmhhcyh0aGlzLnVub2JzZXJ2ZSwga2V5KSkge1xyXG4gICAgICB0aGlzLnVub2JzZXJ2ZVtrZXldKCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIFtrZXldOiB2b2lkIDAsXHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGUgdGhpcy51bm9ic2VydmVba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoa2V5KTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZVtrZXldID0gZmx1eC5vYnNlcnZlKHBhcmFtcykubWFwKCgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogcHJldkJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogbmV4dEJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIF8uZWFjaChuZXh0QmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgW3JlbW92ZWQsIGFkZGVkXSA9IGRpZmYocHJldkJpbmRpbmdzLCBuZXh0QmluZGluZ3MpO1xyXG4gICAgXy5lYWNoKHJlbW92ZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgICBfLmVhY2goYWRkZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMuc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICBfLmVhY2goT2JqZWN0LmtleXModGhpcy51bm9ic2VydmUpLCAoa2V5KSA9PiB0aGlzLnVuc3Vic2NyaWJlKGtleSkpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLnNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCAuLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXVsdGlJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
