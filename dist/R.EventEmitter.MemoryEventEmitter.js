"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R, EventEmitter) {
  var _MemoryEventEmitter = (function (EventEmitter) {
    var _MemoryEventEmitter = function _MemoryEventEmitter() {
      EventEmitter.call(this);
    };

    _extends(_MemoryEventEmitter, EventEmitter);

    _classProps(_MemoryEventEmitter, null, {
      emit: {
        writable: true,
        value: function (room, params) {
          var _this = this;
          if (params === undefined) params = {};
          if (this.listeners[room]) {
            Object.keys(this.listeners[room]).forEach(function (key) {
              return _this.listeners[room][key].emit(params);
            });
          }
        }
      }
    });

    return _MemoryEventEmitter;
  })(EventEmitter);

  return _MemoryEventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRXZlbnRFbWl0dGVyLk1lbW9yeUV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRTtNQUVuQyxtQkFBa0IsY0FBUyxZQUFZO1FBQXZDLG1CQUFrQixHQUNYLFNBRFAsbUJBQWtCLEdBQ1I7QUFEaUIsQUFFN0Isa0JBRnlDLFdBRWxDLENBQUM7S0FDVDs7YUFIRyxtQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsbUJBQWtCO0FBS3RCLFVBQUk7O2VBQUEsVUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFPOztjQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7QUFDcEIsY0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGtCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO3FCQUM1QyxNQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQUEsQ0FDdkMsQ0FBQztXQUNIO1NBQ0Y7Ozs7V0FYRyxtQkFBa0I7S0FBUyxZQUFZOztBQWM3QyxTQUFPLG1CQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBFdmVudEVtaXR0ZXIpIHtcclxuXHJcbiAgY2xhc3MgTWVtb3J5RXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGVtaXQocm9vbSwgcGFyYW1zID0ge30pIHtcclxuICAgICAgaWYodGhpcy5saXN0ZW5lcnNbcm9vbV0pIHtcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tyb29tXSkuZm9yRWFjaCgoa2V5KSA9PlxyXG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbcm9vbV1ba2V5XS5lbWl0KHBhcmFtcylcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gTWVtb3J5RXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=