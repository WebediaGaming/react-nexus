'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

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

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _omitChildren = require('./omitChildren');

var _omitChildren2 = _interopRequireDefault(_omitChildren);

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var __DEV__ = process.env.NODE_ENV === 'development';

function diff(prev, next) {
  return [_lodash2['default'].filter(prev, function (v, k) {
    return !_lodash2['default'].has(next, k) || !(0, _deepEqual2['default'])(next[k], prev[k]);
  }), _lodash2['default'].filter(next, function (v, k) {
    return !_lodash2['default'].has(prev, k) || !(0, _deepEqual2['default'])(prev[k], next[k]);
  })];
}

var MultipleInjector = (function (_React$Component) {
  _inherits(MultipleInjector, _React$Component);

  _createClass(MultipleInjector, null, [{
    key: 'displayName',
    value: 'Nexus.MultipleInjector',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      children: _react2['default'].PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  function MultipleInjector(props, context) {
    _classCallCheck(this, MultipleInjector);

    _get(Object.getPrototypeOf(MultipleInjector.prototype), 'constructor', this).call(this, props, context);
    var bindings = (0, _omitChildren2['default'])(this.props);
    if (__DEV__) {
      _lodash2['default'].each(bindings, function (_ref) {
        var flux = _ref.flux;
        return (0, _shouldAsFunction2['default'])(flux).be.an.instanceOf(_Flux2['default']);
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

  _createClass(MultipleInjector, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      var bindings = (0, _omitChildren2['default'])(this.props);
      _lodash2['default'].each(bindings, function (_ref3, key) {
        var flux = _ref3.flux;
        var params = _ref3.params;
        return _this.subscribe({ flux: flux, params: params }, key);
      });
    }
  }, {
    key: 'refreshState',
    value: function refreshState(_ref4, key) {
      var flux = _ref4.flux;
      var params = _ref4.params;

      this.setState(_defineProperty({}, key, flux.values(params)));
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(key) {
      if (_lodash2['default'].has(this.unobserve, key)) {
        this.unobserve(key);
        this.setState(_defineProperty({}, key, void 0));
        delete this.unobserve[key];
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(_ref5, key) {
      var _this2 = this;

      var flux = _ref5.flux;
      var params = _ref5.params;

      this.unsubscribe(key);
      this.refreshState({ flux: flux, params: params }, key);
      this.unobserve[key] = flux.observe(params).map(function () {
        return _this2.refreshState({ flux: flux, params: params }, key);
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var prevBindings = (0, _omitChildren2['default'])(this.props);
      var nextBindings = (0, _omitChildren2['default'])(nextProps);

      var _diff = diff(prevBindings, nextBindings);

      var _diff2 = _slicedToArray(_diff, 2);

      var removed = _diff2[0];
      var added = _diff2[1];

      _lodash2['default'].each(removed, function (_ref6, key) {
        var flux = _ref6.flux;
        var params = _ref6.params;
        return _this3.unsubscribe(key);
      });
      _lodash2['default'].each(added, function (_ref7, key) {
        var flux = _ref7.flux;
        var params = _ref7.params;
        return _this3.subscribe({ flux: flux, params: params }, key);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this4 = this;

      _lodash2['default'].each(_Object$keys(this.unobserve), function (key) {
        return _this4.unsubscribe(key);
      });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return _lodash2['default'].any([!(0, _deepEqual2['default'])(this.props, nextProps), !(0, _deepEqual2['default'])(this.state, nextState)]);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children(this.state);
    }
  }]);

  return MultipleInjector;
})(_react2['default'].Component);

exports['default'] = MultipleInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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Q3JCLDBCQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFnQixFQUFFLEdBQUc7WUFBbkIsSUFBSSxHQUFOLEtBQWdCLENBQWQsSUFBSTtZQUFFLE1BQU0sR0FBZCxLQUFnQixDQUFSLE1BQU07ZUFBWSxPQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDbEUsMEJBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQWdCLEVBQUUsR0FBRztZQUFuQixJQUFJLEdBQU4sS0FBZ0IsQ0FBZCxJQUFJO1lBQUUsTUFBTSxHQUFkLEtBQWdCLENBQVIsTUFBTTtlQUFZLE9BQUssU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ2pGOzs7V0FFbUIsZ0NBQUc7OztBQUNyQiwwQkFBRSxJQUFJLENBQUMsYUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBQyxHQUFHO2VBQUssT0FBSyxXQUFXLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3JFOzs7V0FFb0IsK0JBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUMxQyxhQUFPLG9CQUFFLEdBQUcsQ0FBQyxDQUNYLENBQUMsNEJBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFDakMsQ0FBQyw0QkFBVSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUNsQyxDQUFDLENBQUM7S0FDSjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4Qzs7O1NBdEVHLGdCQUFnQjtHQUFTLG1CQUFNLFNBQVM7O3FCQXlFL0IsZ0JBQWdCIiwiZmlsZSI6Ik11bHRpcGxlSW5qZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgb21pdENoaWxkcmVuIGZyb20gJy4vb21pdENoaWxkcmVuJztcclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuXHJcbmZ1bmN0aW9uIGRpZmYocHJldiwgbmV4dCkge1xyXG4gIHJldHVybiBbXHJcbiAgICBfLmZpbHRlcihwcmV2LCAodiwgaykgPT4gIV8uaGFzKG5leHQsIGspIHx8ICFkZWVwRXF1YWwobmV4dFtrXSwgcHJldltrXSkpLFxyXG4gICAgXy5maWx0ZXIobmV4dCwgKHYsIGspID0+ICFfLmhhcyhwcmV2LCBrKSB8fCAhZGVlcEVxdWFsKHByZXZba10sIG5leHRba10pKSxcclxuICBdO1xyXG59XHJcblxyXG5jbGFzcyBNdWx0aXBsZUluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuTXVsdGlwbGVJbmplY3Rvcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCBiaW5kaW5ncyA9IG9taXRDaGlsZHJlbih0aGlzLnByb3BzKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4IH0pID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3RhdGUgPSBfLm1hcFZhbHVlcyhiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT5cclxuICAgICAgZmx1eC52YWx1ZXMoa2V5KVxyXG4gICAgKTtcclxuICAgIHRoaXMudW5vYnNlcnZlID0gXy5tYXBWYWx1ZXMoYmluZGluZ3MsICgpID0+IF8ubm9vcCk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIGNvbnN0IGJpbmRpbmdzID0gb21pdENoaWxkcmVuKHRoaXMucHJvcHMpO1xyXG4gICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PlxyXG4gICAgICB0aGlzLnN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIFtrZXldOiBmbHV4LnZhbHVlcyhwYXJhbXMpLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1bnN1YnNjcmliZShrZXkpIHtcclxuICAgIGlmKF8uaGFzKHRoaXMudW5vYnNlcnZlLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMudW5vYnNlcnZlKGtleSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIFtrZXldOiB2b2lkIDAsXHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGUgdGhpcy51bm9ic2VydmVba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoa2V5KTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZVtrZXldID0gZmx1eC5vYnNlcnZlKHBhcmFtcykubWFwKCgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgY29uc3QgcHJldkJpbmRpbmdzID0gb21pdENoaWxkcmVuKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgbmV4dEJpbmRpbmdzID0gb21pdENoaWxkcmVuKG5leHRQcm9wcyk7XHJcbiAgICBjb25zdCBbcmVtb3ZlZCwgYWRkZWRdID0gZGlmZihwcmV2QmluZGluZ3MsIG5leHRCaW5kaW5ncyk7XHJcbiAgICBfLmVhY2gocmVtb3ZlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy51bnN1YnNjcmliZShrZXkpKTtcclxuICAgIF8uZWFjaChhZGRlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy5zdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIF8uZWFjaChPYmplY3Qua2V5cyh0aGlzLnVub2JzZXJ2ZSksIChrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgfVxyXG5cclxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcclxuICAgIHJldHVybiBfLmFueShbXHJcbiAgICAgICFkZWVwRXF1YWwodGhpcy5wcm9wcywgbmV4dFByb3BzKSxcclxuICAgICAgIWRlZXBFcXVhbCh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpLFxyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jaGlsZHJlbih0aGlzLnN0YXRlKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE11bHRpcGxlSW5qZWN0b3I7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==