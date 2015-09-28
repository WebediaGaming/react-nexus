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
    var _MultiInjector$destructureProps5 = MultiInjector.destructureProps(this.props);

    var children = _MultiInjector$destructureProps5.children;
    var bindings = _MultiInjector$destructureProps5.bindings;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTXVsdGlJbmplY3Rvci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7Ozt5QkFDQSxZQUFZOzs7O3FCQUNoQixPQUFPOzs7O2dDQUNOLG9CQUFvQjs7Ozs4Q0FJRCxvQ0FBb0M7Ozs7aUNBQ2pELHVCQUF1Qjs7OztvQkFDL0IsU0FBUzs7OztBQUoxQixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7O0FBTXZELFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDeEIsU0FBTyxDQUNMLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsb0JBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLEVBQ3pFLG9CQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsb0JBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLENBQzFFLENBQUM7Q0FDSDs7QUFFRCxTQUFTLHlCQUF5QixDQUFDLEtBQUssRUFBRTtBQUN4QyxTQUFPLG9CQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztDQUMvQzs7SUFFSyxhQUFhO1lBQWIsYUFBYTs7QUFBYixlQUFhLENBVVYsZ0JBQWdCLEdBQUEsMEJBQUMsS0FBSyxFQUFFO0FBQzdCLFdBQU87QUFDTCxjQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7QUFDeEIsMkJBQXFCLEVBQUUsS0FBSyxD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dGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSBmcm9tICcuLi91dGlscy9wdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlJztcclxuaW1wb3J0IG9taXRDaGlsZHJlbiBmcm9tICcuLi91dGlscy9vbWl0Q2hpbGRyZW4nO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9GbHV4JztcclxuXHJcbmZ1bmN0aW9uIGRpZmYocHJldiwgbmV4dCkge1xyXG4gIHJldHVybiBbXHJcbiAgICBfLmZpbHRlcihwcmV2LCAodiwgaykgPT4gIV8uaGFzKG5leHQsIGspIHx8ICFkZWVwRXF1YWwobmV4dFtrXSwgcHJldltrXSkpLFxyXG4gICAgXy5maWx0ZXIobmV4dCwgKHYsIGspID0+ICFfLmhhcyhwcmV2LCBrKSB8fCAhZGVlcEVxdWFsKHByZXZba10sIG5leHRba10pKSxcclxuICBdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbWl0U2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzKSB7XHJcbiAgcmV0dXJuIF8ub21pdChwcm9wcywgJ3Nob3VsZENvbXBvbmVudFVwZGF0ZScpO1xyXG59XHJcblxyXG5jbGFzcyBNdWx0aUluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuTXVsdGlJbmplY3Rvcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICB9O1xyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGRlc3RydWN0dXJlUHJvcHMocHJvcHMpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNoaWxkcmVuOiBwcm9wcy5jaGlsZHJlbixcclxuICAgICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwcm9wcy5zaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgICAgIGJpbmRpbmdzOiBvbWl0Q2hpbGRyZW4ob21pdFNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcykpLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XHJcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzIH0gPSBNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHModGhpcy5wcm9wcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIF8uZWFjaChiaW5kaW5ncywgKHsgZmx1eCB9KSA9PiBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gXy5tYXBWYWx1ZXMoYmluZGluZ3MsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+XHJcbiAgICAgIGZsdXgudmFsdWVzKGtleSlcclxuICAgICk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoKSA9PiBfLm5vb3ApO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzIH0gPSBNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHModGhpcy5wcm9wcyk7XHJcbiAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+XHJcbiAgICAgIHRoaXMuc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoU3RhdGUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgW2tleV06IGZsdXgudmFsdWVzKHBhcmFtcyksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVuc3Vic2NyaWJlKGtleSkge1xyXG4gICAgaWYoXy5oYXModGhpcy51bm9ic2VydmUsIGtleSkpIHtcclxuICAgICAgdGhpcy51bm9ic2VydmVba2V5XSgpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBba2V5XTogdm9pZCAwLFxyXG4gICAgICB9KTtcclxuICAgICAgZGVsZXRlIHRoaXMudW5vYnNlcnZlW2tleV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlKGtleSk7XHJcbiAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpO1xyXG4gICAgdGhpcy51bm9ic2VydmVba2V5XSA9IGZsdXgub2JzZXJ2ZShwYXJhbXMpLm1hcCgoKSA9PlxyXG4gICAgICB0aGlzLnJlZnJlc2hTdGF0ZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIGNvbnN0IHsgYmluZGluZ3M6IHByZXZCaW5kaW5ncyB9ID0gTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogbmV4dEJpbmRpbmdzIH0gPSBNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHMobmV4dFByb3BzKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgXy5lYWNoKG5leHRCaW5kaW5ncywgKHsgZmx1eCB9KSA9PiBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBbcmVtb3ZlZCwgYWRkZWRdID0gZGlmZihwcmV2QmluZGluZ3MsIG5leHRCaW5kaW5ncyk7XHJcbiAgICBfLmVhY2gocmVtb3ZlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy51bnN1YnNjcmliZShrZXkpKTtcclxuICAgIF8uZWFjaChhZGRlZCwgKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkgPT4gdGhpcy5zdWJzY3JpYmUoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIF8uZWFjaChPYmplY3Qua2V5cyh0aGlzLnVub2JzZXJ2ZSksIChrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgfVxyXG5cclxuICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc2hvdWxkQ29tcG9uZW50VXBkYXRlLmFwcGx5KHRoaXMsIC4uLmFyZ3MpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgeyBjaGlsZHJlbiwgYmluZGluZ3MgfSA9IE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyh0aGlzLnByb3BzKTtcclxuICAgIHJldHVybiBjaGlsZHJlbihfLm1hcFZhbHVlcyhiaW5kaW5ncywgKHsgZmx1eCwgcGFyYW1zIH0pID0+IGZsdXgudmFsdWVzKHBhcmFtcykpKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE11bHRpSW5qZWN0b3I7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
