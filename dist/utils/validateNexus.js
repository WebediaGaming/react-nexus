'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = validateNexus;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _Flux = require('../Flux');

var _Flux2 = _interopRequireDefault(_Flux);

function validateNexus(props, key) {
  try {
    var nexus = props[key];
    _shouldAsFunction2['default'](nexus).be.an.Object();
    _lodash2['default'].each(nexus, function (flux) {
      return _shouldAsFunction2['default'](flux).be.an.instanceOf(_Flux2['default']);
    });
  } catch (err) {
    return err;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3ZhbGlkYXRlTmV4dXMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUt3QixhQUFhOztzQkFMdkIsUUFBUTs7OztnQ0FDSCxvQkFBb0I7Ozs7b0JBRXRCLFNBQVM7Ozs7QUFFWCxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ2hELE1BQUk7QUFDRixRQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsa0NBQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3Qix3QkFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBSTthQUFLLDhCQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxtQkFBTTtLQUFBLENBQUMsQ0FBQztHQUM5RCxDQUNELE9BQU0sR0FBRyxFQUFFO0FBQ1QsV0FBTyxHQUFHLENBQUM7R0FDWjtDQUNGIiwiZmlsZSI6InV0aWxzL3ZhbGlkYXRlTmV4dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICcuLi9GbHV4JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZhbGlkYXRlTmV4dXMocHJvcHMsIGtleSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBuZXh1cyA9IHByb3BzW2tleV07XHJcbiAgICBzaG91bGQobmV4dXMpLmJlLmFuLk9iamVjdCgpO1xyXG4gICAgXy5lYWNoKG5leHVzLCAoZmx1eCkgPT4gc2hvdWxkKGZsdXgpLmJlLmFuLmluc3RhbmNlT2YoRmx1eCkpO1xyXG4gIH1cclxuICBjYXRjaChlcnIpIHtcclxuICAgIHJldHVybiBlcnI7XHJcbiAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
