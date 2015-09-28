'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsIsExtensionOf = require('./utils/isExtensionOf');

var _utilsIsExtensionOf2 = _interopRequireDefault(_utilsIsExtensionOf);

var _componentsInjector = require('./components/Injector');

var _componentsInjector2 = _interopRequireDefault(_componentsInjector);

var _componentsMultiInjector = require('./components/MultiInjector');

var _componentsMultiInjector2 = _interopRequireDefault(_componentsMultiInjector);

function flattenChildren(children) {
  var acc = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  _react2['default'].Children.forEach(children, function (element) {
    acc.push(element);
    if (typeof element === 'object' && element.props && element.props.children) {
      return flattenChildren(element.props.children);
    }
  });
  return acc;
}

function create(Component, props, context) {
  var inst = new Component(props, context);
  if (inst.componentWillMount) {
    inst.componentWillMount();
  }
  return inst;
}

function render(inst, context) {
  return [inst.render(), inst.getChildContext ? inst.getChildContext() : context];
}

function dispose(inst) {
  if (inst.componentWillUnmount) {
    inst.componentWillUnmount();
  }
  return inst;
}

function populate(deps) {
  return _bluebird2['default'].all(_lodash2['default'].map(deps, function (_ref) {
    var flux = _ref.flux;
    var params = _ref.params;
    return flux.populate(params);
  }));
}

function satisfy(_ref2) {
  var props = _ref2.props;
  var type = _ref2.type;

  if (_utilsIsExtensionOf2['default'](type, _componentsInjector2['default'])) {
    return populate([props]);
  }
  if (_utilsIsExtensionOf2['default'](type, _componentsMultiInjector2['default'])) {
    return populate(_lodash2['default'].values(_componentsMultiInjector2['default'].destructureProps(props).bindings));
  }
  return populate([]);
}

function prepare(element) {
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (typeof element !== 'object') {
    return _bluebird2['default'].resolve();
  }
  var type = element.type;
  var props = element.props;

  if (typeof type === 'string') {
    return _bluebird2['default'].resolve();
  }

  return satisfy(element).then(function () {
    var inst = create(type, props, context);

    var _render = render(inst, context);

    var childrenElements = _render[0];
    var childContext = _render[1];

    // There is a caveat here: an elements' context should be its parents', not itw owners'.
    return _bluebird2['default'].all(_lodash2['default'].map(flattenChildren(childrenElements), function (descendantElement) {
      return prepare(descendantElement, childContext);
    }))['catch'](function (err) {
      dispose(err);
      throw err;
    }).then(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      dispose(inst);
      return args;
    });
  });
}

exports['default'] = prepare;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUUsQ0FBQztHQUMxQjs7QUFFRCxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FDdEIsSUFBSSxDQUFDLFlBQU07QUFDVixRQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7a0JBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7O1FBQXZELGdCQUFnQjtRQUFFLFlBQVk7OztBQUVyQyxXQUFPLHNCQUFRLEdBQUcsQ0FBQyxvQkFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsVUFBQyxpQkFBaUI7YUFDNUUsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQztLQUFBLENBQ3pDLENBQUMsU0FDSSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsWUFBTSxHQUFHLENBQUM7S0FDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLFlBQWE7d0NBQVQsSUFBSTtBQUFKLFlBQUk7OztBQUNaLGFBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDO0tBQ2IsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0o7O3FCQUVjLE9BQU8iLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBpc0V4dGVuc2lvbk9mIGZyb20gJy4vdXRpbHMvaXNFeHRlbnNpb25PZic7XHJcbmltcG9ydCBJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvSW5qZWN0b3InO1xyXG5pbXBvcnQgTXVsdGlJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvTXVsdGlJbmplY3Rvcic7XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW4sIGFjYyA9IFtdKSB7XHJcbiAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgKGVsZW1lbnQpID0+IHtcclxuICAgIGFjYy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIGVsZW1lbnQucHJvcHMgJiYgZWxlbWVudC5wcm9wcy5jaGlsZHJlbikge1xyXG4gICAgICByZXR1cm4gZmxhdHRlbkNoaWxkcmVuKGVsZW1lbnQucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBhY2M7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZShDb21wb25lbnQsIHByb3BzLCBjb250ZXh0KSB7XHJcbiAgY29uc3QgaW5zdCA9IG5ldyBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpO1xyXG4gIGlmKGluc3QuY29tcG9uZW50V2lsbE1vdW50KSB7XHJcbiAgICBpbnN0LmNvbXBvbmVudFdpbGxNb3VudCgpO1xyXG4gIH1cclxuICByZXR1cm4gaW5zdDtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyKGluc3QsIGNvbnRleHQpIHtcclxuICByZXR1cm4gW2luc3QucmVuZGVyKCksIGluc3QuZ2V0Q2hpbGRDb250ZXh0ID8gaW5zdC5nZXRDaGlsZENvbnRleHQoKSA6IGNvbnRleHRdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwb3NlKGluc3QpIHtcclxuICBpZihpbnN0LmNvbXBvbmVudFdpbGxVbm1vdW50KSB7XHJcbiAgICBpbnN0LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcbiAgfVxyXG4gIHJldHVybiBpbnN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3B1bGF0ZShkZXBzKSB7XHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKGRlcHMsICh7IGZsdXgsIHBhcmFtcyB9KSA9PiBmbHV4LnBvcHVsYXRlKHBhcmFtcykpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2F0aXNmeSh7IHByb3BzLCB0eXBlIH0pIHtcclxuICBpZihpc0V4dGVuc2lvbk9mKHR5cGUsIEluamVjdG9yKSkge1xyXG4gICAgcmV0dXJuIHBvcHVsYXRlKFtwcm9wc10pO1xyXG4gIH1cclxuICBpZihpc0V4dGVuc2lvbk9mKHR5cGUsIE11bHRpSW5qZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gcG9wdWxhdGUoXy52YWx1ZXMoTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHByb3BzKS5iaW5kaW5ncykpO1xyXG4gIH1cclxuICByZXR1cm4gcG9wdWxhdGUoW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlKGVsZW1lbnQsIGNvbnRleHQgPSB7fSkge1xyXG4gIGlmKHR5cGVvZiBlbGVtZW50ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuICBjb25zdCB7IHR5cGUsIHByb3BzIH0gPSBlbGVtZW50O1xyXG4gIGlmKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNhdGlzZnkoZWxlbWVudClcclxuICAudGhlbigoKSA9PiB7XHJcbiAgICBjb25zdCBpbnN0ID0gY3JlYXRlKHR5cGUsIHByb3BzLCBjb250ZXh0KTtcclxuICAgIGNvbnN0IFtjaGlsZHJlbkVsZW1lbnRzLCBjaGlsZENvbnRleHRdID0gcmVuZGVyKGluc3QsIGNvbnRleHQpO1xyXG4gICAgLy8gVGhlcmUgaXMgYSBjYXZlYXQgaGVyZTogYW4gZWxlbWVudHMnIGNvbnRleHQgc2hvdWxkIGJlIGl0cyBwYXJlbnRzJywgbm90IGl0dyBvd25lcnMnLlxyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKGZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbkVsZW1lbnRzKSwgKGRlc2NlbmRhbnRFbGVtZW50KSA9PlxyXG4gICAgICBwcmVwYXJlKGRlc2NlbmRhbnRFbGVtZW50LCBjaGlsZENvbnRleHQpXHJcbiAgICApKVxyXG4gICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgZGlzcG9zZShlcnIpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKC4uLmFyZ3MpID0+IHtcclxuICAgICAgZGlzcG9zZShpbnN0KTtcclxuICAgICAgcmV0dXJuIGFyZ3M7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJlcGFyZTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
