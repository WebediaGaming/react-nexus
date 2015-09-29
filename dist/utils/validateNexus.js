'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = validateNexus;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _fluxesFlux = require('../fluxes/Flux');

var _fluxesFlux2 = _interopRequireDefault(_fluxesFlux);

function validateNexus(props, key) {
  try {
    var nexus = props[key];
    _shouldAsFunction2['default'](nexus).be.an.Object();
    _lodash2['default'].each(nexus, function (flux) {
      return _shouldAsFunction2['default'](flux).be.an.instanceOf(_fluxesFlux2['default']);
    });
  } catch (err) {
    return err;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3ZhbGlkYXRlTmV4dXMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUt3QixhQUFhOztzQkFMdkIsUUFBUTs7OztnQ0FDSCxvQkFBb0I7Ozs7MEJBRXRCLGdCQUFnQjs7OztBQUVsQixTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ2hELE1BQUk7QUFDRixRQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsa0NBQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3Qix3QkFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBSTthQUFLLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSx5QkFBTTtLQUFBLENBQUMsQ0FBQztHQUM5RCxDQUNELE9BQU0sR0FBRyxFQUFFO0FBQ1QsV0FBTyxHQUFHLENBQUM7R0FDWjtDQUNGIiwiZmlsZSI6InV0aWxzL3ZhbGlkYXRlTmV4dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9mbHV4ZXMvRmx1eCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZU5leHVzKHByb3BzLCBrZXkpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgbmV4dXMgPSBwcm9wc1trZXldO1xyXG4gICAgc2hvdWxkKG5leHVzKS5iZS5hbi5PYmplY3QoKTtcclxuICAgIF8uZWFjaChuZXh1cywgKGZsdXgpID0+IHNob3VsZChmbHV4KS5iZS5hbi5pbnN0YW5jZU9mKEZsdXgpKTtcclxuICB9XHJcbiAgY2F0Y2goZXJyKSB7XHJcbiAgICByZXR1cm4gZXJyO1xyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
