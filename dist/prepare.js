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

/**
 * Recursively flattens a React.Children hierarchy tree into a React.Element Array.
 * @param  {React.Children} children Hierarchy roots
 * @param  {Array<React.Element>} [acc=[]] Accumulator in which to push new elements
 * @return {Array<React.Element>} Flattened hierarchy
 */
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

/**
 * Given a React.Component class, its props, and a context, create a new React.Component
 * instance and apply its componentWillMount method, if present.
 * @param  {Function} Component Component class to instanciate
 * @param  {Object} [props={}] props for the instance
 * @param  {Object} [context={}] context for the instance
 * @return {React.Component} Instantiated component
 */
function create(Component) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var inst = new Component(props, context);
  if (inst.componentWillMount) {
    inst.componentWillMount();
  }
  return inst;
}

/**
 * Given a React.Component instance and a context, returns a pair containing:
 * - The React.Children resulting from rendering it,
 * - The child context to be passed to its descendants.
 * @param  {React.Component} inst Component instance
 * @param  {Object} context context
 * @return {Array} Pair containing the rendered children and the child context
 */
function render(inst) {
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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

    return _bluebird2['default'].all(_lodash2['default'].map(flattenChildren(childrenElements), function (descendantElement) {
      return(
        // There is a caveat here: an elements' context should be its parents', not its owners'.
        // See https://github.com/facebook/react/issues/2112
        prepare(descendantElement, childContext)
      );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXBhcmUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFBYyxRQUFROzs7O3dCQUNGLFVBQVU7Ozs7cUJBQ1osT0FBTzs7OztrQ0FFQyx1QkFBdUI7Ozs7a0NBQzVCLHVCQUF1Qjs7Ozt1Q0FDbEIsNEJBQTRCOzs7Ozs7Ozs7O0FBUXRELFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBWTtNQUFWLEdBQUcseURBQUcsRUFBRTs7QUFDekMscUJBQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxPQUFPLEVBQUs7QUFDNUMsT0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsQixRQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3pFLGFBQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEQ7R0FDRixDQUFDLENBQUM7QUFDSCxTQUFPLEdBQUcsQ0FBQztDQUNaOzs7Ozs7Ozs7O0FBVUQsU0FBUyxNQUFNLENBQUMsU0FBUyxFQUE0QjtNQUExQixLQUFLLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ2pELE1BQU0sSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMzQyxNQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUMxQixRQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztHQUMzQjtBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2I7Ozs7Ozs7Ozs7QUFVRCxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNoQyxTQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0NBQ2pGOztBQUVELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUNyQixNQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtBQUM1QixRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztHQUM3QjtBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3RCLFNBQU8sc0JBQVEsR0FBRyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFnQjtRQUFkLElBQUksR0FBTixJQUFnQixDQUFkLElBQUk7UUFBRSxNQUFNLEdBQWQsSUFBZ0IsQ0FBUixNQUFNO1dBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUMsQ0FBQztDQUM5RTs7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFlLEVBQUU7TUFBZixLQUFLLEdBQVAsS0FBZSxDQUFiLEtBQUs7TUFBRSxJQUFJLEdBQWIsS0FBZSxDQUFOLElBQUk7O0FBQzVCLE1BQUcsZ0NBQWMsSUFBSSxrQ0FBVyxFQUFFO0FBQ2hDLFdBQU8sUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUMxQjtBQUNELE1BQUcsZ0NBQWMsSUFBSSx1Q0FBZ0IsRUFBRTtBQUNyQyxXQUFPLFFBQVEsQ0FBQyxvQkFBRSxNQUFNLENBQUMscUNBQWMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztHQUMzRTtBQUNELFNBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ3JCOztBQUVELFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3BDLE1BQUcsT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQzlCLFdBQU8sc0JBQVEsT0FBTyxFQUFFLENBQUM7R0FDMUI7TUFDTyxJQUFJLEdBQVksT0FBTyxDQUF2QixJQUFJO01BQUUsS0FBSyxHQUFLLE9BQU8sQ0FBakIsS0FBSzs7QUFDbkIsTUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0IsV0FBTyxzQkFBUSxPQUFPLEVBQUUsQ0FBQztHQUMxQjs7QUFFRCxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FDdEIsSUFBSSxDQUFDLFlBQU07QUFDVixRQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7a0JBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7O1FBQXZELGdCQUFnQjtRQUFFLFlBQVk7O0FBQ3JDLFdBQU8sc0JBQVEsR0FBRyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxVQUFDLGlCQUFpQjs7OztBQUc1RSxlQUFPLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDOztLQUFBLENBQ3pDLENBQUMsU0FDSSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsWUFBTSxHQUFHLENBQUM7S0FDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLFlBQWE7d0NBQVQsSUFBSTtBQUFKLFlBQUk7OztBQUNaLGFBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDO0tBQ2IsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0o7O3FCQUVjLE9BQU8iLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmltcG9ydCBpc0V4dGVuc2lvbk9mIGZyb20gJy4vdXRpbHMvaXNFeHRlbnNpb25PZic7XHJcbmltcG9ydCBJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvSW5qZWN0b3InO1xyXG5pbXBvcnQgTXVsdGlJbmplY3RvciBmcm9tICcuL2NvbXBvbmVudHMvTXVsdGlJbmplY3Rvcic7XHJcblxyXG4vKipcclxuICogUmVjdXJzaXZlbHkgZmxhdHRlbnMgYSBSZWFjdC5DaGlsZHJlbiBoaWVyYXJjaHkgdHJlZSBpbnRvIGEgUmVhY3QuRWxlbWVudCBBcnJheS5cclxuICogQHBhcmFtICB7UmVhY3QuQ2hpbGRyZW59IGNoaWxkcmVuIEhpZXJhcmNoeSByb290c1xyXG4gKiBAcGFyYW0gIHtBcnJheTxSZWFjdC5FbGVtZW50Pn0gW2FjYz1bXV0gQWNjdW11bGF0b3IgaW4gd2hpY2ggdG8gcHVzaCBuZXcgZWxlbWVudHNcclxuICogQHJldHVybiB7QXJyYXk8UmVhY3QuRWxlbWVudD59IEZsYXR0ZW5lZCBoaWVyYXJjaHlcclxuICovXHJcbmZ1bmN0aW9uIGZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbiwgYWNjID0gW10pIHtcclxuICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCAoZWxlbWVudCkgPT4ge1xyXG4gICAgYWNjLnB1c2goZWxlbWVudCk7XHJcbiAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgZWxlbWVudC5wcm9wcyAmJiBlbGVtZW50LnByb3BzLmNoaWxkcmVuKSB7XHJcbiAgICAgIHJldHVybiBmbGF0dGVuQ2hpbGRyZW4oZWxlbWVudC5wcm9wcy5jaGlsZHJlbik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGFjYztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGEgUmVhY3QuQ29tcG9uZW50IGNsYXNzLCBpdHMgcHJvcHMsIGFuZCBhIGNvbnRleHQsIGNyZWF0ZSBhIG5ldyBSZWFjdC5Db21wb25lbnRcclxuICogaW5zdGFuY2UgYW5kIGFwcGx5IGl0cyBjb21wb25lbnRXaWxsTW91bnQgbWV0aG9kLCBpZiBwcmVzZW50LlxyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gQ29tcG9uZW50IENvbXBvbmVudCBjbGFzcyB0byBpbnN0YW5jaWF0ZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtwcm9wcz17fV0gcHJvcHMgZm9yIHRoZSBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb250ZXh0PXt9XSBjb250ZXh0IGZvciB0aGUgaW5zdGFuY2VcclxuICogQHJldHVybiB7UmVhY3QuQ29tcG9uZW50fSBJbnN0YW50aWF0ZWQgY29tcG9uZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGUoQ29tcG9uZW50LCBwcm9wcyA9IHt9LCBjb250ZXh0ID0ge30pIHtcclxuICBjb25zdCBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XHJcbiAgaWYoaW5zdC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgIGluc3QuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgfVxyXG4gIHJldHVybiBpbnN0O1xyXG59XHJcblxyXG4vKipcclxuICogR2l2ZW4gYSBSZWFjdC5Db21wb25lbnQgaW5zdGFuY2UgYW5kIGEgY29udGV4dCwgcmV0dXJucyBhIHBhaXIgY29udGFpbmluZzpcclxuICogLSBUaGUgUmVhY3QuQ2hpbGRyZW4gcmVzdWx0aW5nIGZyb20gcmVuZGVyaW5nIGl0LFxyXG4gKiAtIFRoZSBjaGlsZCBjb250ZXh0IHRvIGJlIHBhc3NlZCB0byBpdHMgZGVzY2VuZGFudHMuXHJcbiAqIEBwYXJhbSAge1JlYWN0LkNvbXBvbmVudH0gaW5zdCBDb21wb25lbnQgaW5zdGFuY2VcclxuICogQHBhcmFtICB7T2JqZWN0fSBjb250ZXh0IGNvbnRleHRcclxuICogQHJldHVybiB7QXJyYXl9IFBhaXIgY29udGFpbmluZyB0aGUgcmVuZGVyZWQgY2hpbGRyZW4gYW5kIHRoZSBjaGlsZCBjb250ZXh0XHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXIoaW5zdCwgY29udGV4dCA9IHt9KSB7XHJcbiAgcmV0dXJuIFtpbnN0LnJlbmRlcigpLCBpbnN0LmdldENoaWxkQ29udGV4dCA/IGluc3QuZ2V0Q2hpbGRDb250ZXh0KCkgOiBjb250ZXh0XTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcG9zZShpbnN0KSB7XHJcbiAgaWYoaW5zdC5jb21wb25lbnRXaWxsVW5tb3VudCkge1xyXG4gICAgaW5zdC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xyXG4gIH1cclxuICByZXR1cm4gaW5zdDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9wdWxhdGUoZGVwcykge1xyXG4gIHJldHVybiBQcm9taXNlLmFsbChfLm1hcChkZXBzLCAoeyBmbHV4LCBwYXJhbXMgfSkgPT4gZmx1eC5wb3B1bGF0ZShwYXJhbXMpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdGlzZnkoeyBwcm9wcywgdHlwZSB9KSB7XHJcbiAgaWYoaXNFeHRlbnNpb25PZih0eXBlLCBJbmplY3RvcikpIHtcclxuICAgIHJldHVybiBwb3B1bGF0ZShbcHJvcHNdKTtcclxuICB9XHJcbiAgaWYoaXNFeHRlbnNpb25PZih0eXBlLCBNdWx0aUluamVjdG9yKSkge1xyXG4gICAgcmV0dXJuIHBvcHVsYXRlKF8udmFsdWVzKE11bHRpSW5qZWN0b3IuZGVzdHJ1Y3R1cmVQcm9wcyhwcm9wcykuYmluZGluZ3MpKTtcclxuICB9XHJcbiAgcmV0dXJuIHBvcHVsYXRlKFtdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcGFyZShlbGVtZW50LCBjb250ZXh0ID0ge30pIHtcclxuICBpZih0eXBlb2YgZWxlbWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcbiAgY29uc3QgeyB0eXBlLCBwcm9wcyB9ID0gZWxlbWVudDtcclxuICBpZih0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzYXRpc2Z5KGVsZW1lbnQpXHJcbiAgLnRoZW4oKCkgPT4ge1xyXG4gICAgY29uc3QgaW5zdCA9IGNyZWF0ZSh0eXBlLCBwcm9wcywgY29udGV4dCk7XHJcbiAgICBjb25zdCBbY2hpbGRyZW5FbGVtZW50cywgY2hpbGRDb250ZXh0XSA9IHJlbmRlcihpbnN0LCBjb250ZXh0KTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChfLm1hcChmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW5FbGVtZW50cyksIChkZXNjZW5kYW50RWxlbWVudCkgPT5cclxuICAgICAgLy8gVGhlcmUgaXMgYSBjYXZlYXQgaGVyZTogYW4gZWxlbWVudHMnIGNvbnRleHQgc2hvdWxkIGJlIGl0cyBwYXJlbnRzJywgbm90IGl0cyBvd25lcnMnLlxyXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8yMTEyXHJcbiAgICAgIHByZXBhcmUoZGVzY2VuZGFudEVsZW1lbnQsIGNoaWxkQ29udGV4dClcclxuICAgICkpXHJcbiAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICBkaXNwb3NlKGVycik7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pXHJcbiAgICAudGhlbigoLi4uYXJncykgPT4ge1xyXG4gICAgICBkaXNwb3NlKGluc3QpO1xyXG4gICAgICByZXR1cm4gYXJncztcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcmVwYXJlO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
