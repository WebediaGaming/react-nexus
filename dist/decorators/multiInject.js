'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = multiInject;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _$nexus = require('../$nexus');

var _$nexus2 = _interopRequireDefault(_$nexus);

var _fluxesFlux = require('../fluxes/Flux');

var _fluxesFlux2 = _interopRequireDefault(_fluxesFlux);

var _componentsMultiInjector = require('../components/MultiInjector');

var _componentsMultiInjector2 = _interopRequireDefault(_componentsMultiInjector);

var _utilsPureShouldComponentUpdate = require('../utils/pureShouldComponentUpdate');

var _utilsPureShouldComponentUpdate2 = _interopRequireDefault(_utilsPureShouldComponentUpdate);

var _utilsValidateNexus = require('../utils/validateNexus');

var _utilsValidateNexus2 = _interopRequireDefault(_utilsValidateNexus);

var __DEV__ = process.env.NODE_ENV === 'development';

function multiInject(getBindings) {
  var customShouldComponentUpdate = arguments.length <= 1 || arguments[1] === undefined ? _utilsPureShouldComponentUpdate2['default'] : arguments[1];

  if (__DEV__) {
    _shouldAsFunction2['default'](getBindings).be.a.Function();
  }
  return function $multiInject(Component) {
    return (function (_React$Component) {
      var _value;

      _inherits(_class, _React$Component);

      function _class() {
        _classCallCheck(this, _class);

        _React$Component.apply(this, arguments);
      }

      _class.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return customShouldComponentUpdate.apply(this, args);
      };

      _class.prototype.render = function render() {
        var props = this.props;
        var context = this.context;

        var nexus = context[_$nexus2['default']];
        var bindings = getBindings(props, nexus);
        if (__DEV__) {
          _lodash2['default'].each(bindings, function (_ref) {
            var flux = _ref.flux;
            return _shouldAsFunction2['default'](flux).be.an.instanceOf(_fluxesFlux2['default']);
          });
        }
        return _react2['default'].createElement(
          _componentsMultiInjector2['default'],
          bindings,
          function (multiValues) {
            var _Object$assign;

            var childProps = _Object$assign2({}, props, _lodash2['default'].mapValues(multiValues, function (values) {
              return values;
            }), (_Object$assign = {}, _Object$assign[_$nexus2['default']] = nexus, _Object$assign));
            return _react2['default'].createElement(Component, childProps);
          }
        );
      };

      _createClass(_class, null, [{
        key: 'displayName',
        value: '@multiInject(' + Component.displayName + ')',
        enumerable: true
      }, {
        key: 'contextTypes',
        value: (_value = {}, _value[_$nexus2['default']] = _utilsValidateNexus2['default'], _value),
        enumerable: true
      }]);

      return _class;
    })(_react2['default'].Component);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY29yYXRvcnMvbXVsdGlJbmplY3QuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7cUJBV3dCLFdBQVc7O3NCQVhyQixRQUFROzs7O3FCQUNKLE9BQU87Ozs7Z0NBQ04sb0JBQW9COzs7O3NCQUdwQixXQUFXOzs7OzBCQUNiLGdCQUFnQjs7Ozt1Q0FDUCw2QkFBNkI7Ozs7OENBQ2pCLG9DQUFvQzs7OztrQ0FDaEQsd0JBQXdCOzs7O0FBTmxELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7QUFReEMsU0FBUyxXQUFXLENBQUMsV0FBVyxFQUEyRDtNQUF6RCwyQkFBMkI7O0FBQzFFLE1BQUcsT0FBTyxFQUFFO0FBQ1Ysa0NBQU8sV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztHQUNyQztBQUNELFNBQU8sU0FBUyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQ3RDOzs7Ozs7Ozs7Ozt1QkFNRSxxQkFBcUIsR0FBQSxpQ0FBVTswQ0FBTixJQUFJO0FBQUosY0FBSTs7O0FBQzNCLGVBQU8sMkJBQTJCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN0RDs7dUJBRUQsTUFBTSxHQUFBLGtCQUFHO1lBQ0MsS0FBSyxHQUFjLElBQUksQ0FBdkIsS0FBSztZQUFFLE9BQU8sR0FBSyxJQUFJLENBQWhCLE9BQU87O0FBQ3RCLFlBQU0sS0FBSyxHQUFHLE9BQU8scUJBQVEsQ0FBQztBQUM5QixZQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNDLFlBQUcsT0FBTyxFQUFFO0FBQ1YsOEJBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLElBQVE7Z0JBQU4sSUFBSSxHQUFOLElBQVEsQ0FBTixJQUFJO21CQUFPLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSx5QkFBTTtXQUFBLENBQUMsQ0FBQztTQUNyRTtBQUNELGVBQU87O1VBQW1CLFFBQVE7VUFBRyxVQUFDLFdBQVcsRUFBSzs7O0FBQ3BELGdCQUFNLFVBQVUsR0FBRyxnQkFBYyxFQUFFLEVBQ2pDLEtBQUssRUFDTCxvQkFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLFVBQUMsTUFBTTtxQkFBSyxNQUFNO2FBQUEsQ0FBQyw4REFDaEMsS0FBSyxrQkFDbEIsQ0FBQztBQUNGLG1CQUFPLGlDQUFDLFNBQVMsRUFBSyxVQUFVLENBQUksQ0FBQztXQUN0QztTQUFpQixDQUFDO09BQ3BCOzs7O2lDQXhCb0MsU0FBUyxDQUFDLFdBQVc7Ozs7Ozs7OztPQUR2QyxtQkFBTSxTQUFTLEVBMEJsQztHQUNILENBQUM7Q0FDSCIsImZpbGUiOiJkZWNvcmF0b3JzL211bHRpSW5qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5pbXBvcnQgJG5leHVzIGZyb20gJy4uLyRuZXh1cyc7XHJcbmltcG9ydCBGbHV4IGZyb20gJy4uL2ZsdXhlcy9GbHV4JztcclxuaW1wb3J0IE11bHRpSW5qZWN0b3IgZnJvbSAnLi4vY29tcG9uZW50cy9NdWx0aUluamVjdG9yJztcclxuaW1wb3J0IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUgZnJvbSAnLi4vdXRpbHMvcHVyZVNob3VsZENvbXBvbmVudFVwZGF0ZSc7XHJcbmltcG9ydCB2YWxpZGF0ZU5leHVzIGZyb20gJy4uL3V0aWxzL3ZhbGlkYXRlTmV4dXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbXVsdGlJbmplY3QoZ2V0QmluZGluZ3MsIGN1c3RvbVNob3VsZENvbXBvbmVudFVwZGF0ZSA9IHB1cmVTaG91bGRDb21wb25lbnRVcGRhdGUpIHtcclxuICBpZihfX0RFVl9fKSB7XHJcbiAgICBzaG91bGQoZ2V0QmluZGluZ3MpLmJlLmEuRnVuY3Rpb24oKTtcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICRtdWx0aUluamVjdChDb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9IGBAbXVsdGlJbmplY3QoJHtDb21wb25lbnQuZGlzcGxheU5hbWV9KWA7XHJcbiAgICAgIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XHJcbiAgICAgICAgWyRuZXh1c106IHZhbGlkYXRlTmV4dXMsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBzaG91bGRDb21wb25lbnRVcGRhdGUoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiBjdXN0b21TaG91bGRDb21wb25lbnRVcGRhdGUuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCB7IHByb3BzLCBjb250ZXh0IH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IG5leHVzID0gY29udGV4dFskbmV4dXNdO1xyXG4gICAgICAgIGNvbnN0IGJpbmRpbmdzID0gZ2V0QmluZGluZ3MocHJvcHMsIG5leHVzKTtcclxuICAgICAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgICAgICBfLmVhY2goYmluZGluZ3MsICh7IGZsdXggfSkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPE11bHRpSW5qZWN0b3Igey4uLmJpbmRpbmdzfT57KG11bHRpVmFsdWVzKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBjaGlsZFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSxcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIF8ubWFwVmFsdWVzKG11bHRpVmFsdWVzLCAodmFsdWVzKSA9PiB2YWx1ZXMpLFxyXG4gICAgICAgICAgICB7IFskbmV4dXNdOiBuZXh1cyB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLmNoaWxkUHJvcHN9IC8+O1xyXG4gICAgICAgIH19PC9NdWx0aUluamVjdG9yPjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
