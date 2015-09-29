'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = createContext;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _decoratorsPure = require('../decorators/pure');

var _decoratorsPure2 = _interopRequireDefault(_decoratorsPure);

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var __DEV__ = process.env.NODE_ENV === 'development';

function createContext(fluxes) {
  if (__DEV__) {
    _lodash2['default'].each(fluxes, function (flux) {
      return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
    });
  }

  var Context = (function (_React$Component) {
    _inherits(Context, _React$Component);

    function Context() {
      _classCallCheck(this, _Context);

      _React$Component.apply(this, arguments);
    }

    Context.prototype.getChildContext = function getChildContext() {
      return fluxes;
    };

    Context.prototype.render = function render() {
      return this.props.children();
    };

    _createClass(Context, null, [{
      key: 'displayName',
      value: 'Nexus.Context',
      enumerable: true
    }, {
      key: 'propTypes',
      value: {
        children: _react2['default'].PropTypes.func.isRequired
      },
      enumerable: true
    }, {
      key: 'childContextTypes',
      value: {},
      enumerable: true
    }]);

    var _Context = Context;
    Context = _decoratorsPure2['default']()(Context) || Context;
    return Context;
  })(_react2['default'].Component);

  Context.childContextTypes = _lodash2['default'].mapValues(fluxes, function (flux) {
    return _react2['default'].PropTypes.oneOf([flux]);
  });

  return Context;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY3JlYXRlQ29udGV4dC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7cUJBU3dCLGFBQWE7O3NCQVR2QixRQUFROzs7O3FCQUNKLE9BQU87Ozs7Z0NBQ04sb0JBQW9COzs7OzhCQUl0QixvQkFBb0I7Ozs7b0JBQ3BCLFNBQVM7Ozs7QUFIMUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOztBQUt4QyxTQUFTLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDNUMsTUFBRyxPQUFPLEVBQUU7QUFDVix3QkFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSTthQUFLLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtLQUFBLENBQUMsQ0FBQztHQUMvRDs7TUFHSyxPQUFPO2NBQVAsT0FBTzs7YUFBUCxPQUFPOzs7Ozs7QUFBUCxXQUFPLFdBT1gsZUFBZSxHQUFBLDJCQUFHO0FBQ2hCLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7O0FBVEcsV0FBTyxXQVdYLE1BQU0sR0FBQSxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUM5Qjs7aUJBYkcsT0FBTzs7YUFDVSxlQUFlOzs7O2FBQ2pCO0FBQ2pCLGdCQUFRLEVBQUUsbUJBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVO09BQzFDOzs7O2FBQzBCLEVBQUU7Ozs7bUJBTHpCLE9BQU87QUFBUCxXQUFPLEdBRFosNkJBQU0sQ0FDRCxPQUFPLEtBQVAsT0FBTztXQUFQLE9BQU87S0FBUyxtQkFBTSxTQUFTOztBQWdCckMsU0FBTyxDQUFDLGlCQUFpQixHQUFHLG9CQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJO1dBQUssbUJBQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDOztBQUV6RixTQUFPLE9BQU8sQ0FBQztDQUNoQiIsImZpbGUiOiJjb21wb25lbnRzL2NyZWF0ZUNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgcHVyZSBmcm9tICcuLi9kZWNvcmF0b3JzL3B1cmUnO1xyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9GbHV4JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNvbnRleHQoZmx1eGVzKSB7XHJcbiAgaWYoX19ERVZfXykge1xyXG4gICAgXy5lYWNoKGZsdXhlcywgKGZsdXgpID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICB9XHJcblxyXG4gIEBwdXJlKClcclxuICBjbGFzcyBDb250ZXh0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdOZXh1cy5Db250ZXh0JztcclxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XHJcbiAgICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxyXG4gICAgfTtcclxuICAgIHN0YXRpYyBjaGlsZENvbnRleHRUeXBlcyA9IHt9O1xyXG5cclxuICAgIGdldENoaWxkQ29udGV4dCgpIHtcclxuICAgICAgcmV0dXJuIGZsdXhlcztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBDb250ZXh0LmNoaWxkQ29udGV4dFR5cGVzID0gXy5tYXBWYWx1ZXMoZmx1eGVzLCAoZmx1eCkgPT4gUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFtmbHV4XSkpO1xyXG5cclxuICByZXR1cm4gQ29udGV4dDtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
