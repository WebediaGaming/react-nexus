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
      getDisplayName: {
        writable: true,
        value: function () {
          return "MemoryEventEmitter";
        }
      },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxZQUFZLEVBQUU7TUFFbkMsa0JBQWtCLGNBQVMsWUFBWTtRQUF2QyxrQkFBa0IsR0FDWCxTQURQLGtCQUFrQixHQUNSO0FBRGlCLEFBRTdCLGtCQUZ5QyxXQUVsQyxDQUFDO0tBQ1Q7O2FBSEcsa0JBQWtCLEVBQVMsWUFBWTs7Z0JBQXZDLGtCQUFrQjtBQUt0QixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sb0JBQW9CLENBQUM7U0FDN0I7O0FBRUQsVUFBSTs7ZUFBQSxVQUFDLElBQUksRUFBRSxNQUFNLEVBQU87O2NBQWIsTUFBTSxnQkFBTixNQUFNLEdBQUcsRUFBRTtBQUNwQixjQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsa0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7cUJBQzVDLE1BQUssU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFBQSxDQUN2QyxDQUFDO1dBQ0g7U0FDRjs7OztXQWZHLGtCQUFrQjtLQUFTLFlBQVk7O0FBa0I3QyxTQUFPLGtCQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIEV2ZW50RW1pdHRlcikge1xuXG4gIGNsYXNzIE1lbW9yeUV2ZW50RW1pdHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdNZW1vcnlFdmVudEVtaXR0ZXInO1xuICAgIH1cblxuICAgIGVtaXQocm9vbSwgcGFyYW1zID0ge30pIHtcbiAgICAgIGlmKHRoaXMubGlzdGVuZXJzW3Jvb21dKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW3Jvb21dKS5mb3JFYWNoKChrZXkpID0+XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbcm9vbV1ba2V5XS5lbWl0KHBhcmFtcylcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gTWVtb3J5RXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==