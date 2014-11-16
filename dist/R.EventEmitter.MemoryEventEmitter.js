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
  var MemoryEventEmitter = (function (EventEmitter) {
    var MemoryEventEmitter = function MemoryEventEmitter() {
      EventEmitter.call(this);
    };

    _extends(MemoryEventEmitter, EventEmitter);

    _classProps(MemoryEventEmitter, null, {
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

    return MemoryEventEmitter;
  })(EventEmitter);

  return MemoryEventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxZQUFZLEVBQUU7TUFFbkMsa0JBQWtCLGNBQVMsWUFBWTtRQUF2QyxrQkFBa0IsR0FDWCxTQURQLGtCQUFrQixHQUNSO0FBRGlCLEFBRTdCLGtCQUZ5QyxXQUVsQyxDQUFDO0tBQ1Q7O2FBSEcsa0JBQWtCLEVBQVMsWUFBWTs7Z0JBQXZDLGtCQUFrQjtBQUt0QixVQUFJOztlQUFBLFVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBTzs7Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFO0FBQ3BCLGNBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QixrQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztxQkFDNUMsTUFBSyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUFBLENBQ3ZDLENBQUM7V0FDSDtTQUNGOzs7O1dBWEcsa0JBQWtCO0tBQVMsWUFBWTs7QUFjN0MsU0FBTyxrQkFBa0IsQ0FBQztDQUMzQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLk1lbW9yeUV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBFdmVudEVtaXR0ZXIpIHtcblxuICBjbGFzcyBNZW1vcnlFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBlbWl0KHJvb20sIHBhcmFtcyA9IHt9KSB7XG4gICAgICBpZih0aGlzLmxpc3RlbmVyc1tyb29tXSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tyb29tXSkuZm9yRWFjaCgoa2V5KSA9PlxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3Jvb21dW2tleV0uZW1pdChwYXJhbXMpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1lbW9yeUV2ZW50RW1pdHRlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=