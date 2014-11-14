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
  var _ = R._;
  var should = R.should;

  var MemoryEventEmitter = (function (EventEmitter) {
    var MemoryEventEmitter = function MemoryEventEmitter(params) {
      if (params === undefined) params = {};

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixrQkFBa0IsY0FBUyxZQUFZO1FBQXZDLGtCQUFrQixHQUNYLFNBRFAsa0JBQWtCLENBQ1YsTUFBTSxFQUFPO1VBQWIsTUFBTSxnQkFBTixNQUFNLEdBQUcsRUFBRTs7QUFEUSxBQUU3QixrQkFGeUMsV0FFbEMsQ0FBQztLQUNUOzthQUhHLGtCQUFrQixFQUFTLFlBQVk7O2dCQUF2QyxrQkFBa0I7QUFLdEIsb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLG9CQUFvQixDQUFDO1NBQzdCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFPOzs7Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFOztBQUNwQixjQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsa0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7cUJBQzVDLE1BQUssU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFBQSxDQUN2QyxDQUFDO1dBQ0g7U0FDRjs7OztXQWZHLGtCQUFrQjtLQUFTLFlBQVk7Ozs7QUFrQjdDLFNBQU8sa0JBQWtCLENBQUM7Q0FDM0IsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgRXZlbnRFbWl0dGVyKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgTWVtb3J5RXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgIHJldHVybiAnTWVtb3J5RXZlbnRFbWl0dGVyJztcclxuICAgIH1cclxuXHJcbiAgICBlbWl0KHJvb20sIHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIGlmKHRoaXMubGlzdGVuZXJzW3Jvb21dKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnNbcm9vbV0pLmZvckVhY2goKGtleSkgPT5cclxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW3Jvb21dW2tleV0uZW1pdChwYXJhbXMpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIE1lbW9yeUV2ZW50RW1pdHRlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9