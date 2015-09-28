'use strict';

exports.__esModule = true;
exports['default'] = isExtensionOf;

function isExtensionOf(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var A = _x,
        B = _x2;
    prototypeOfA = undefined;
    _again = false;

    if (A === B) {
      return true;
    }
    if (typeof A !== 'function') {
      return false;
    }
    var prototypeOfA = Object.getPrototypeOf(A);
    if (typeof B !== 'function') {
      return prototypeOfA === B;
    }
    _x = prototypeOfA;
    _x2 = B;
    _again = true;
    continue _function;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL2lzRXh0ZW5zaW9uT2YuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFBd0IsYUFBYTs7QUFBdEIsU0FBUyxhQUFhOzs7NEJBQU87UUFBTixDQUFDO1FBQUUsQ0FBQztBQU9sQyxnQkFBWTs7O0FBTmxCLFFBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNWLGFBQU8sSUFBSSxDQUFDO0tBQ2I7QUFDRCxRQUFHLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUMxQixhQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0QsUUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxRQUFHLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUMxQixhQUFPLFlBQVksS0FBSyxDQUFDLENBQUM7S0FDM0I7U0FDb0IsWUFBWTtVQUFFLENBQUM7OztHQUNyQztDQUFBIiwiZmlsZSI6InV0aWxzL2lzRXh0ZW5zaW9uT2YuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0V4dGVuc2lvbk9mKEEsIEIpIHtcclxuICBpZihBID09PSBCKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgaWYodHlwZW9mIEEgIT09ICdmdW5jdGlvbicpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgY29uc3QgcHJvdG90eXBlT2ZBID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKEEpO1xyXG4gIGlmKHR5cGVvZiBCICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gcHJvdG90eXBlT2ZBID09PSBCO1xyXG4gIH1cclxuICByZXR1cm4gaXNFeHRlbnNpb25PZihwcm90b3R5cGVPZkEsIEIpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
