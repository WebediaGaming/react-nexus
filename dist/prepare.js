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

  return _react2['default'].Children.map(function (element) {
    acc.push(element);
    if (typeof element === 'object' && element.children) {
      return flattenChildren(element.children);
    }
    return acc;
  });
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

function prepare(element, context) {
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
    return _react2['default'].Children.map(flattenChildren(childrenElements), function (descendantElement) {
      return prepare(descendantElement, childContext);
    })['catch'](function (err) {
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
//# sourceMappingURL=data:application/json;base64,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QUMsWUFBTTtBQUNWLFFBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztrQkFDRCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7UUFBdkQsZ0JBQWdCO1FBQUUsWUFBWTs7O0FBRXJDLFdBQU8sbUJBQU0sUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxVQUFDLGlCQUFpQjthQUM3RSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDO0tBQUEsQ0FDekMsU0FDSyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsWUFBTSxHQUFHLENBQUM7S0FDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLFlBQWE7d0NBQVQsSUFBSTtBQUFKLFlBQUk7OztBQUNaLGFBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDO0tBQ2IsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0o7O3FCQUVjLE9BQU8iLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBpc0V4dGVuc2lvbk9mIGZyb20gJy4vdXRpbHMvaXNFeHRlbnNpb25PZic7XHJcbmltcG9ydCBJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvSW5qZWN0b3InO1xyXG5pbXBvcnQgTXVsdGlJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvTXVsdGlJbmplY3Rvcic7XHJcblxyXG5mdW5jdGlvbiBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW4sIGFjYyA9IFtdKSB7XHJcbiAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcCgoZWxlbWVudCkgPT4ge1xyXG4gICAgYWNjLnB1c2goZWxlbWVudCk7XHJcbiAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgZWxlbWVudC5jaGlsZHJlbikge1xyXG4gICAgICByZXR1cm4gZmxhdHRlbkNoaWxkcmVuKGVsZW1lbnQuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlKENvbXBvbmVudCwgcHJvcHMsIGNvbnRleHQpIHtcclxuICBjb25zdCBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XHJcbiAgaWYoaW5zdC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgIGluc3QuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgfVxyXG4gIHJldHVybiBpbnN0O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXIoaW5zdCwgY29udGV4dCkge1xyXG4gIHJldHVybiBbaW5zdC5yZW5kZXIoKSwgaW5zdC5nZXRDaGlsZENvbnRleHQgPyBpbnN0LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3Bvc2UoaW5zdCkge1xyXG4gIGlmKGluc3QuY29tcG9uZW50V2lsbFVubW91bnQpIHtcclxuICAgIGluc3QuY29tcG9uZW50V2lsbFVubW91bnQoKTtcclxuICB9XHJcbiAgcmV0dXJuIGluc3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlKGRlcHMpIHtcclxuICByZXR1cm4gUHJvbWlzZS5hbGwoXy5tYXAoZGVwcywgKHsgZmx1eCwgcGFyYW1zIH0pID0+IGZsdXgucG9wdWxhdGUocGFyYW1zKSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzYXRpc2Z5KHsgcHJvcHMsIHR5cGUgfSkge1xyXG4gIGlmKGlzRXh0ZW5zaW9uT2YodHlwZSwgSW5qZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gcG9wdWxhdGUoW3Byb3BzXSk7XHJcbiAgfVxyXG4gIGlmKGlzRXh0ZW5zaW9uT2YodHlwZSwgTXVsdGlJbmplY3RvcikpIHtcclxuICAgIHJldHVybiBwb3B1bGF0ZShfLnZhbHVlcyhNdWx0aUluamVjdG9yLmRlc3RydWN0dXJlUHJvcHMocHJvcHMpLmJpbmRpbmdzKSk7XHJcbiAgfVxyXG4gIHJldHVybiBwb3B1bGF0ZShbXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmUoZWxlbWVudCwgY29udGV4dCkge1xyXG4gIGlmKHR5cGVvZiBlbGVtZW50ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuICBjb25zdCB7IHR5cGUsIHByb3BzIH0gPSBlbGVtZW50O1xyXG4gIGlmKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNhdGlzZnkoZWxlbWVudClcclxuICAudGhlbigoKSA9PiB7XHJcbiAgICBjb25zdCBpbnN0ID0gY3JlYXRlKHR5cGUsIHByb3BzLCBjb250ZXh0KTtcclxuICAgIGNvbnN0IFtjaGlsZHJlbkVsZW1lbnRzLCBjaGlsZENvbnRleHRdID0gcmVuZGVyKGluc3QsIGNvbnRleHQpO1xyXG4gICAgLy8gVGhlcmUgaXMgYSBjYXZlYXQgaGVyZTogYW4gZWxlbWVudHMnIGNvbnRleHQgc2hvdWxkIGJlIGl0cyBwYXJlbnRzJywgbm90IGl0dyBvd25lcnMnLlxyXG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcChmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW5FbGVtZW50cyksIChkZXNjZW5kYW50RWxlbWVudCkgPT5cclxuICAgICAgcHJlcGFyZShkZXNjZW5kYW50RWxlbWVudCwgY2hpbGRDb250ZXh0KVxyXG4gICAgKVxyXG4gICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgZGlzcG9zZShlcnIpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKC4uLmFyZ3MpID0+IHtcclxuICAgICAgZGlzcG9zZShpbnN0KTtcclxuICAgICAgcmV0dXJuIGFyZ3M7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJlcGFyZTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
