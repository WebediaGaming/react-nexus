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
 * Recursively flattens a React.Children hierarchy tree into a `React.Element` array.
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
 * Create a new `React.Component` instance on which {render} can then be called.
 * Should be disposed of using {dispose}.
 * It will apply the instances' `componentWillMount` lifecycle  method, if present.
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
 * Renders a given `React.Component` instance previously created by `create`, computes its child context,
 * and returns both.
 * @param  {React.Component} inst Component instance
 * @param  {Object} context Default context
 * @return {Array} Pair containing the rendered children and the child context
 */
function render(inst) {
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return [inst.render(), inst.getChildContext ? inst.getChildContext() : context];
}

/**
 * Dispose of a given `React.Component` instance created using `create`.
 * It will call its `componentWillUnmount` lifecycle method, if present.
 * @param  {React.Component} inst Instance to dipose of
 * @returns {undefined}
 */
function dispose(inst) {
  if (inst.componentWillUnmount) {
    inst.componentWillUnmount();
  }
}

/**
 * Asynchronously settles multiple Flux dependencies.
 * @param {Collection<Object>} deps Collection of dependencies in the form of `{ flux, params }`
 * @return {Promise} Promise for the settlement of all the dependencies
 */
function populate(deps) {
  return _bluebird2['default'].all(_lodash2['default'].map(deps, function (_ref) {
    var flux = _ref.flux;
    var params = _ref.params;
    return flux.populate(params);
  }));
}

/**
 * Asynchronously satisfy the dependencies of a React.Element: if it an instance of
 * `Nexus.Injector` or `Nexus.MultiInjector` or a derived class of these, it populates
 * all their deps. Otherwise it does nothing.
 * @param {React.Element} element Element whose deps must be satisfied
 * @return {Promise} Promise for the settlement of the elements' dependencies.
 */
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

/**
 * Asynchronously and recursively prepare a context for rendering element.
 * Namely, it will recursively satisfy the deps of the element (which can induce
 * side-effects on the context, eg. populate Flux instances), then render its children.
 * One the returned promise resolves, React `render*` can safely be called and won't need
 * additional data.
 * @param {React.Element} element Element whose rendering will be prepared
 * @param {Object} context = {} Context in which to render/apply side effects
 * @return {Promise} Promise for the settlement of the preparation
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXBhcmUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFBYyxRQUFROzs7O3dCQUNGLFVBQVU7Ozs7cUJBQ1osT0FBTzs7OztrQ0FFQyx1QkFBdUI7Ozs7a0NBQzVCLHVCQUF1Qjs7Ozt1Q0FDbEIsNEJBQTRCOzs7Ozs7Ozs7O0FBUXRELFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBWTtNQUFWLEdBQUcseURBQUcsRUFBRTs7QUFDekMscUJBQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQyxPQUFPLEVBQUs7QUFDNUMsT0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsQixRQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3pFLGFBQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEQ7R0FDRixDQUFDLENBQUM7QUFDSCxTQUFPLEdBQUcsQ0FBQztDQUNaOzs7Ozs7Ozs7OztBQVdELFNBQVMsTUFBTSxDQUFDLFNBQVMsRUFBNEI7TUFBMUIsS0FBSyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUNqRCxNQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0MsTUFBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDMUIsUUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7R0FDM0I7QUFDRCxTQUFPLElBQUksQ0FBQztDQUNiOzs7Ozs7Ozs7QUFTRCxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNoQyxTQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0NBQ2pGOzs7Ozs7OztBQVFELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUNyQixNQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtBQUM1QixRQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztHQUM3QjtDQUNGOzs7Ozs7O0FBT0QsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3RCLFNBQU8sc0JBQVEsR0FBRyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFnQjtRQUFkLElBQUksR0FBTixJQUFnQixDQUFkLElBQUk7UUFBRSxNQUFNLEdBQWQsSUFBZ0IsQ0FBUixNQUFNO1dBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7R0FBQSxDQUFDLENBQUMsQ0FBQztDQUM5RTs7Ozs7Ozs7O0FBU0QsU0FBUyxPQUFPLENBQUMsS0FBZSxFQUFFO01BQWYsS0FBSyxHQUFQLEtBQWUsQ0FBYixLQUFLO01BQUUsSUFBSSxHQUFiLEtBQWUsQ0FBTixJQUFJOztBQUM1QixNQUFHLGdDQUFjLElBQUksa0NBQVcsRUFBRTtBQUNoQyxXQUFPLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDMUI7QUFDRCxNQUFHLGdDQUFjLElBQUksdUNBQWdCLEVBQUU7QUFDckMsV0FBTyxRQUFRLENBQUMsb0JBQUUsTUFBTSxDQUFDLHFDQUFjLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7R0FDM0U7QUFDRCxTQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNyQjs7Ozs7Ozs7Ozs7O0FBWUQsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDcEMsTUFBRyxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7QUFDOUIsV0FBTyxzQkFBUSxPQUFPLEVBQUUsQ0FBQztHQUMxQjtNQUNPLElBQUksR0FBWSxPQUFPLENBQXZCLElBQUk7TUFBRSxLQUFLLEdBQUssT0FBTyxDQUFqQixLQUFLOztBQUNuQixNQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzQixXQUFPLHNCQUFRLE9BQU8sRUFBRSxDQUFDO0dBQzFCOztBQUVELFNBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUN0QixJQUFJLENBQUMsWUFBTTtBQUNWLFFBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztrQkFDRCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7UUFBdkQsZ0JBQWdCO1FBQUUsWUFBWTs7QUFDckMsV0FBTyxzQkFBUSxHQUFHLENBQUMsb0JBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFVBQUMsaUJBQWlCOzs7O0FBRzVFLGVBQU8sQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUM7O0tBQUEsQ0FDekMsQ0FBQyxTQUNJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDYixZQUFNLEdBQUcsQ0FBQztLQUNYLENBQUMsQ0FDRCxJQUFJLENBQUMsWUFBYTt3Q0FBVCxJQUFJO0FBQUosWUFBSTs7O0FBQ1osYUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2QsYUFBTyxJQUFJLENBQUM7S0FDYixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSjs7cUJBRWMsT0FBTyIsImZpbGUiOiJwcmVwYXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5cclxuaW1wb3J0IGlzRXh0ZW5zaW9uT2YgZnJvbSAnLi91dGlscy9pc0V4dGVuc2lvbk9mJztcclxuaW1wb3J0IEluamVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9JbmplY3Rvcic7XHJcbmltcG9ydCBNdWx0aUluamVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9NdWx0aUluamVjdG9yJztcclxuXHJcbi8qKlxyXG4gKiBSZWN1cnNpdmVseSBmbGF0dGVucyBhIFJlYWN0LkNoaWxkcmVuIGhpZXJhcmNoeSB0cmVlIGludG8gYSBgUmVhY3QuRWxlbWVudGAgYXJyYXkuXHJcbiAqIEBwYXJhbSAge1JlYWN0LkNoaWxkcmVufSBjaGlsZHJlbiBIaWVyYXJjaHkgcm9vdHNcclxuICogQHBhcmFtICB7QXJyYXk8UmVhY3QuRWxlbWVudD59IFthY2M9W11dIEFjY3VtdWxhdG9yIGluIHdoaWNoIHRvIHB1c2ggbmV3IGVsZW1lbnRzXHJcbiAqIEByZXR1cm4ge0FycmF5PFJlYWN0LkVsZW1lbnQ+fSBGbGF0dGVuZWQgaGllcmFyY2h5XHJcbiAqL1xyXG5mdW5jdGlvbiBmbGF0dGVuQ2hpbGRyZW4oY2hpbGRyZW4sIGFjYyA9IFtdKSB7XHJcbiAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgKGVsZW1lbnQpID0+IHtcclxuICAgIGFjYy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIGVsZW1lbnQucHJvcHMgJiYgZWxlbWVudC5wcm9wcy5jaGlsZHJlbikge1xyXG4gICAgICByZXR1cm4gZmxhdHRlbkNoaWxkcmVuKGVsZW1lbnQucHJvcHMuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBhY2M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgYFJlYWN0LkNvbXBvbmVudGAgaW5zdGFuY2Ugb24gd2hpY2gge3JlbmRlcn0gY2FuIHRoZW4gYmUgY2FsbGVkLlxyXG4gKiBTaG91bGQgYmUgZGlzcG9zZWQgb2YgdXNpbmcge2Rpc3Bvc2V9LlxyXG4gKiBJdCB3aWxsIGFwcGx5IHRoZSBpbnN0YW5jZXMnIGBjb21wb25lbnRXaWxsTW91bnRgIGxpZmVjeWNsZSAgbWV0aG9kLCBpZiBwcmVzZW50LlxyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gQ29tcG9uZW50IENvbXBvbmVudCBjbGFzcyB0byBpbnN0YW5jaWF0ZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtwcm9wcz17fV0gcHJvcHMgZm9yIHRoZSBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb250ZXh0PXt9XSBjb250ZXh0IGZvciB0aGUgaW5zdGFuY2VcclxuICogQHJldHVybiB7UmVhY3QuQ29tcG9uZW50fSBJbnN0YW50aWF0ZWQgY29tcG9uZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGUoQ29tcG9uZW50LCBwcm9wcyA9IHt9LCBjb250ZXh0ID0ge30pIHtcclxuICBjb25zdCBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XHJcbiAgaWYoaW5zdC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgIGluc3QuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgfVxyXG4gIHJldHVybiBpbnN0O1xyXG59XHJcblxyXG4vKipcclxuICogUmVuZGVycyBhIGdpdmVuIGBSZWFjdC5Db21wb25lbnRgIGluc3RhbmNlIHByZXZpb3VzbHkgY3JlYXRlZCBieSBgY3JlYXRlYCwgY29tcHV0ZXMgaXRzIGNoaWxkIGNvbnRleHQsXHJcbiAqIGFuZCByZXR1cm5zIGJvdGguXHJcbiAqIEBwYXJhbSAge1JlYWN0LkNvbXBvbmVudH0gaW5zdCBDb21wb25lbnQgaW5zdGFuY2VcclxuICogQHBhcmFtICB7T2JqZWN0fSBjb250ZXh0IERlZmF1bHQgY29udGV4dFxyXG4gKiBAcmV0dXJuIHtBcnJheX0gUGFpciBjb250YWluaW5nIHRoZSByZW5kZXJlZCBjaGlsZHJlbiBhbmQgdGhlIGNoaWxkIGNvbnRleHRcclxuICovXHJcbmZ1bmN0aW9uIHJlbmRlcihpbnN0LCBjb250ZXh0ID0ge30pIHtcclxuICByZXR1cm4gW2luc3QucmVuZGVyKCksIGluc3QuZ2V0Q2hpbGRDb250ZXh0ID8gaW5zdC5nZXRDaGlsZENvbnRleHQoKSA6IGNvbnRleHRdO1xyXG59XHJcblxyXG4vKipcclxuICogRGlzcG9zZSBvZiBhIGdpdmVuIGBSZWFjdC5Db21wb25lbnRgIGluc3RhbmNlIGNyZWF0ZWQgdXNpbmcgYGNyZWF0ZWAuXHJcbiAqIEl0IHdpbGwgY2FsbCBpdHMgYGNvbXBvbmVudFdpbGxVbm1vdW50YCBsaWZlY3ljbGUgbWV0aG9kLCBpZiBwcmVzZW50LlxyXG4gKiBAcGFyYW0gIHtSZWFjdC5Db21wb25lbnR9IGluc3QgSW5zdGFuY2UgdG8gZGlwb3NlIG9mXHJcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBkaXNwb3NlKGluc3QpIHtcclxuICBpZihpbnN0LmNvbXBvbmVudFdpbGxVbm1vdW50KSB7XHJcbiAgICBpbnN0LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXN5bmNocm9ub3VzbHkgc2V0dGxlcyBtdWx0aXBsZSBGbHV4IGRlcGVuZGVuY2llcy5cclxuICogQHBhcmFtIHtDb2xsZWN0aW9uPE9iamVjdD59IGRlcHMgQ29sbGVjdGlvbiBvZiBkZXBlbmRlbmNpZXMgaW4gdGhlIGZvcm0gb2YgYHsgZmx1eCwgcGFyYW1zIH1gXHJcbiAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSBzZXR0bGVtZW50IG9mIGFsbCB0aGUgZGVwZW5kZW5jaWVzXHJcbiAqL1xyXG5mdW5jdGlvbiBwb3B1bGF0ZShkZXBzKSB7XHJcbiAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKGRlcHMsICh7IGZsdXgsIHBhcmFtcyB9KSA9PiBmbHV4LnBvcHVsYXRlKHBhcmFtcykpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFzeW5jaHJvbm91c2x5IHNhdGlzZnkgdGhlIGRlcGVuZGVuY2llcyBvZiBhIFJlYWN0LkVsZW1lbnQ6IGlmIGl0IGFuIGluc3RhbmNlIG9mXHJcbiAqIGBOZXh1cy5JbmplY3RvcmAgb3IgYE5leHVzLk11bHRpSW5qZWN0b3JgIG9yIGEgZGVyaXZlZCBjbGFzcyBvZiB0aGVzZSwgaXQgcG9wdWxhdGVzXHJcbiAqIGFsbCB0aGVpciBkZXBzLiBPdGhlcndpc2UgaXQgZG9lcyBub3RoaW5nLlxyXG4gKiBAcGFyYW0ge1JlYWN0LkVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aG9zZSBkZXBzIG11c3QgYmUgc2F0aXNmaWVkXHJcbiAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSBzZXR0bGVtZW50IG9mIHRoZSBlbGVtZW50cycgZGVwZW5kZW5jaWVzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2F0aXNmeSh7IHByb3BzLCB0eXBlIH0pIHtcclxuICBpZihpc0V4dGVuc2lvbk9mKHR5cGUsIEluamVjdG9yKSkge1xyXG4gICAgcmV0dXJuIHBvcHVsYXRlKFtwcm9wc10pO1xyXG4gIH1cclxuICBpZihpc0V4dGVuc2lvbk9mKHR5cGUsIE11bHRpSW5qZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gcG9wdWxhdGUoXy52YWx1ZXMoTXVsdGlJbmplY3Rvci5kZXN0cnVjdHVyZVByb3BzKHByb3BzKS5iaW5kaW5ncykpO1xyXG4gIH1cclxuICByZXR1cm4gcG9wdWxhdGUoW10pO1xyXG59XHJcblxyXG4vKipcclxuICogQXN5bmNocm9ub3VzbHkgYW5kIHJlY3Vyc2l2ZWx5IHByZXBhcmUgYSBjb250ZXh0IGZvciByZW5kZXJpbmcgZWxlbWVudC5cclxuICogTmFtZWx5LCBpdCB3aWxsIHJlY3Vyc2l2ZWx5IHNhdGlzZnkgdGhlIGRlcHMgb2YgdGhlIGVsZW1lbnQgKHdoaWNoIGNhbiBpbmR1Y2VcclxuICogc2lkZS1lZmZlY3RzIG9uIHRoZSBjb250ZXh0LCBlZy4gcG9wdWxhdGUgRmx1eCBpbnN0YW5jZXMpLCB0aGVuIHJlbmRlciBpdHMgY2hpbGRyZW4uXHJcbiAqIE9uZSB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZXNvbHZlcywgUmVhY3QgYHJlbmRlcipgIGNhbiBzYWZlbHkgYmUgY2FsbGVkIGFuZCB3b24ndCBuZWVkXHJcbiAqIGFkZGl0aW9uYWwgZGF0YS5cclxuICogQHBhcmFtIHtSZWFjdC5FbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hvc2UgcmVuZGVyaW5nIHdpbGwgYmUgcHJlcGFyZWRcclxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgPSB7fSBDb250ZXh0IGluIHdoaWNoIHRvIHJlbmRlci9hcHBseSBzaWRlIGVmZmVjdHNcclxuICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSBmb3IgdGhlIHNldHRsZW1lbnQgb2YgdGhlIHByZXBhcmF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBwcmVwYXJlKGVsZW1lbnQsIGNvbnRleHQgPSB7fSkge1xyXG4gIGlmKHR5cGVvZiBlbGVtZW50ICE9PSAnb2JqZWN0Jykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuICBjb25zdCB7IHR5cGUsIHByb3BzIH0gPSBlbGVtZW50O1xyXG4gIGlmKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNhdGlzZnkoZWxlbWVudClcclxuICAudGhlbigoKSA9PiB7XHJcbiAgICBjb25zdCBpbnN0ID0gY3JlYXRlKHR5cGUsIHByb3BzLCBjb250ZXh0KTtcclxuICAgIGNvbnN0IFtjaGlsZHJlbkVsZW1lbnRzLCBjaGlsZENvbnRleHRdID0gcmVuZGVyKGluc3QsIGNvbnRleHQpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKF8ubWFwKGZsYXR0ZW5DaGlsZHJlbihjaGlsZHJlbkVsZW1lbnRzKSwgKGRlc2NlbmRhbnRFbGVtZW50KSA9PlxyXG4gICAgICAvLyBUaGVyZSBpcyBhIGNhdmVhdCBoZXJlOiBhbiBlbGVtZW50cycgY29udGV4dCBzaG91bGQgYmUgaXRzIHBhcmVudHMnLCBub3QgaXRzIG93bmVycycuXHJcbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzIxMTJcclxuICAgICAgcHJlcGFyZShkZXNjZW5kYW50RWxlbWVudCwgY2hpbGRDb250ZXh0KVxyXG4gICAgKSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgIGRpc3Bvc2UoZXJyKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSlcclxuICAgIC50aGVuKCguLi5hcmdzKSA9PiB7XHJcbiAgICAgIGRpc3Bvc2UoaW5zdCk7XHJcbiAgICAgIHJldHVybiBhcmdzO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByZXBhcmU7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
