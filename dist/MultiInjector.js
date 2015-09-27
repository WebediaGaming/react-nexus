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

var _pureShouldComponentUpdate = require('./pureShouldComponentUpdate');

var _pureShouldComponentUpdate2 = _interopRequireDefault(_pureShouldComponentUpdate);

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

function omitShouldComponentUpdate(props) {
  return _lodash2['default'].omit(props, 'shouldComponentUpdate');
}

function destructureProps(props) {
  return {
    children: props.children,
    shouldComponentUpdate: props.shouldComponentUpdate,
    bindings: (0, _omitChildren2['default'])(omitShouldComponentUpdate(props))
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

    _get(Object.getPrototypeOf(MultiInjector.prototype), 'constructor', this).call(this, props, context);

    var _destructureProps = destructureProps(this.props);

    var bindings = _destructureProps.bindings;

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

  _createClass(MultiInjector, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      var _destructureProps2 = destructureProps(this.props);

      var bindings = _destructureProps2.bindings;

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

      var _destructureProps3 = destructureProps(this.props);

      var prevBindings = _destructureProps3.bindings;

      var _destructureProps4 = destructureProps(nextProps);

      var nextBindings = _destructureProps4.bindings;

      if (__DEV__) {
        _lodash2['default'].each(nextBindings, function (_ref6) {
          var flux = _ref6.flux;
          return (0, _shouldAsFunction2['default'])(flux).be.an.instanceOf(_Flux2['default']);
        });
      }

      var _diff = diff(prevBindings, nextBindings);

      var _diff2 = _slicedToArray(_diff, 2);

      var removed = _diff2[0];
      var added = _diff2[1];

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
    value: function shouldComponentUpdate() {
      var _props$shouldComponentUpdate;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_props$shouldComponentUpdate = this.props.shouldComponentUpdate).apply.apply(_props$shouldComponentUpdate, [this].concat(args));
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children(this.state);
    }
  }]);

  return MultiInjector;
})(_react2['default'].Component);

exports['default'] = MultiInjector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUcsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNqRjs7O1dBRW1CLGdDQUFHOzs7QUFDckIsMEJBQUUsSUFBSSxDQUFDLGFBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFVBQUMsR0FBRztlQUFLLE9BQUssV0FBVyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNyRTs7O1dBRW9CLGlDQUFVOzs7d0NBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUMzQixhQUFPLGdDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUMsS0FBSyxNQUFBLGdDQUFDLElBQUksU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUM5RDs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4Qzs7O1NBMUVHLGFBQWE7R0FBUyxtQkFBTSxTQUFTOztxQkE2RTVCLGFBQWEiLCJmaWxlIjoiTXVsdGlJbmplY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCBwdXJlU2hvdWxkQ29tcG9uZW50VXBkYXRlIGZyb20gJy4vcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSc7XHJcbmltcG9ydCBvbWl0Q2hpbGRyZW4gZnJvbSAnLi9vbWl0Q2hpbGRyZW4nO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuL0ZsdXgnO1xyXG5cclxuZnVuY3Rpb24gZGlmZihwcmV2LCBuZXh0KSB7XHJcbiAgcmV0dXJuIFtcclxuICAgIF8uZmlsdGVyKHByZXYsICh2LCBrKSA9PiAhXy5oYXMobmV4dCwgaykgfHwgIWRlZXBFcXVhbChuZXh0W2tdLCBwcmV2W2tdKSksXHJcbiAgICBfLmZpbHRlcihuZXh0LCAodiwgaykgPT4gIV8uaGFzKHByZXYsIGspIHx8ICFkZWVwRXF1YWwocHJldltrXSwgbmV4dFtrXSkpLFxyXG4gIF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9taXRTaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMpIHtcclxuICByZXR1cm4gXy5vbWl0KHByb3BzLCAnc2hvdWxkQ29tcG9uZW50VXBkYXRlJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlc3RydWN0dXJlUHJvcHMocHJvcHMpIHtcclxuICByZXR1cm4ge1xyXG4gICAgY2hpbGRyZW46IHByb3BzLmNoaWxkcmVuLFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBwcm9wcy5zaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgICBiaW5kaW5nczogb21pdENoaWxkcmVuKG9taXRTaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMpKSxcclxuICB9O1xyXG59XHJcblxyXG5jbGFzcyBNdWx0aUluamVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTmV4dXMuTXVsdGlJbmplY3Rvcic7XHJcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcclxuICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcclxuICB9O1xyXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XHJcbiAgICBzaG91bGRDb21wb25lbnRVcGRhdGU6IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUsXHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcclxuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgIGNvbnN0IHsgYmluZGluZ3MgfSA9IGRlc3RydWN0dXJlUHJvcHModGhpcy5wcm9wcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIF8uZWFjaChiaW5kaW5ncywgKHsgZmx1eCB9KSA9PiBzaG91bGQoZmx1eCkuYmUuYW4uaW5zdGFuY2VPZihGbHV4KSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gXy5tYXBWYWx1ZXMoYmluZGluZ3MsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+XHJcbiAgICAgIGZsdXgudmFsdWVzKGtleSlcclxuICAgICk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZSA9IF8ubWFwVmFsdWVzKGJpbmRpbmdzLCAoKSA9PiBfLm5vb3ApO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICBjb25zdCB7IGJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgXy5lYWNoKGJpbmRpbmdzLCAoeyBmbHV4LCBwYXJhbXMgfSwga2V5KSA9PlxyXG4gICAgICB0aGlzLnN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIFtrZXldOiBmbHV4LnZhbHVlcyhwYXJhbXMpLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1bnN1YnNjcmliZShrZXkpIHtcclxuICAgIGlmKF8uaGFzKHRoaXMudW5vYnNlcnZlLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMudW5vYnNlcnZlKGtleSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIFtrZXldOiB2b2lkIDAsXHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGUgdGhpcy51bm9ic2VydmVba2V5XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1YnNjcmliZSh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmUoa2V5KTtcclxuICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSk7XHJcbiAgICB0aGlzLnVub2JzZXJ2ZVtrZXldID0gZmx1eC5vYnNlcnZlKHBhcmFtcykubWFwKCgpID0+XHJcbiAgICAgIHRoaXMucmVmcmVzaFN0YXRlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogcHJldkJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKHRoaXMucHJvcHMpO1xyXG4gICAgY29uc3QgeyBiaW5kaW5nczogbmV4dEJpbmRpbmdzIH0gPSBkZXN0cnVjdHVyZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIF8uZWFjaChuZXh0QmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgW3JlbW92ZWQsIGFkZGVkXSA9IGRpZmYocHJldkJpbmRpbmdzLCBuZXh0QmluZGluZ3MpO1xyXG4gICAgXy5lYWNoKHJlbW92ZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMudW5zdWJzY3JpYmUoa2V5KSk7XHJcbiAgICBfLmVhY2goYWRkZWQsICh7IGZsdXgsIHBhcmFtcyB9LCBrZXkpID0+IHRoaXMuc3Vic2NyaWJlKHsgZmx1eCwgcGFyYW1zIH0sIGtleSkpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICBfLmVhY2goT2JqZWN0LmtleXModGhpcy51bm9ic2VydmUpLCAoa2V5KSA9PiB0aGlzLnVuc3Vic2NyaWJlKGtleSkpO1xyXG4gIH1cclxuXHJcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLnNob3VsZENvbXBvbmVudFVwZGF0ZS5hcHBseSh0aGlzLCAuLi5hcmdzKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKHRoaXMuc3RhdGUpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXVsdGlJbmplY3RvcjtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9