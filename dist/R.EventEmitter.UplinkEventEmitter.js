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

  var UplinkEventEmitter = (function (EventEmitter) {
    var UplinkEventEmitter = function UplinkEventEmitter(_ref) {
      var uplink = _ref.uplink;

      _.dev(function () {
        return uplink.should.be.instanceOf(R.Uplink);
      });
      EventEmitter.call(this);
      this.uplink = uplink;
      this.uplinkListeners = {};
    };

    _extends(UplinkEventEmitter, EventEmitter);

    _classProps(UplinkEventEmitter, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "UplinkEventEmitter";
        }
      },
      addListener: {
        writable: true,
        value: function (room, handler) {
          var _this = this;
          var _ref2 = EventEmitter.prototype.addListener.call(this, room, handler);

          var listener = _ref2.listener;
          var createdEvent = _ref2.createdEvent;

          if (createdEvent) {
            _.dev(function () {
              return _this.uplinkListeners[room].should.not.be.ok;
            });
            this.uplinkListeners[room] = this.uplink.listenTo(room, function (params) {
              return _this._emit(room, params);
            });
          }
          _.dev(function () {
            return _this.uplinkListeners[room].should.be.ok;
          });
          return { listener: listener, createdEvent: createdEvent };
        }
      },
      removeListener: {
        writable: true,
        value: function (listener) {
          var _this2 = this;
          var _ref3 = EventEmitter.prototype.removeListener.call(this, listener);

          var deletedEvent = _ref3.deletedEvent;

          if (deletedEvent) {
            _.dev(function () {
              return _this2.uplinkListeners[room].should.be.ok;
            });
            this.uplink.unlistenFrom(room, this.uplinkListeners[room]);
            delete this.uplinkListeners[room];
          }
          _.dev(function () {
            return _this2.uplinkListeners[room].should.not.be.ok;
          });
          return { listener: listener, deletedEvent: deletedEvent };
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this3 = this;

          EventEmitter.prototype.destroy.call(this);
          _.dev(function () {
            return Object.keys(_this3.uplinkListeners).length.should.be.exactly(0);
          });
          this.uplinkListeners = null;
          this.uplink = null;
        }
      }
    });

    return UplinkEventEmitter;
  })(EventEmitter);

  _.extend(UplinkEventEmitter.prototype, {
    uplink: null,
    uplinkListeners: null });

  return UplinkEventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixrQkFBa0IsY0FBUyxZQUFZO1FBQXZDLGtCQUFrQixHQUNYLFNBRFAsa0JBQWtCLE9BQ0U7VUFBVixNQUFNLFFBQU4sTUFBTTs7QUFDbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBRnRCLEFBRzdCLGtCQUh5QyxXQUdsQyxDQUFDO0FBQ1IsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7S0FDM0I7O2FBTkcsa0JBQWtCLEVBQVMsWUFBWTs7Z0JBQXZDLGtCQUFrQjtBQVF0QixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sb0JBQW9CLENBQUM7U0FDN0I7O0FBRUQsaUJBQVc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFOztzQkFaSSxBQWFJLFlBYlEsV0FhRixnQkFBVyxPQUFDLElBQUksRUFBRSxPQUFPLENBQUM7O2NBQTNELFFBQVEsU0FBUixRQUFRO2NBQUUsWUFBWSxTQUFaLFlBQVk7O0FBQzVCLGNBQUcsWUFBWSxFQUFFO0FBQ2YsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxNQUFLLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ3pELGdCQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLE1BQU07cUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUFBLENBQUMsQ0FBQztXQUMvRjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBSyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3JELGlCQUFPLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLENBQUM7U0FDbkM7O0FBRUQsb0JBQWM7O2VBQUEsVUFBQyxRQUFRLEVBQUU7O3NCQXRCTSxBQXVCTixZQXZCa0IsV0F1QlosbUJBQWMsT0FBQyxRQUFRLENBQUM7O2NBQS9DLFlBQVksU0FBWixZQUFZOztBQUNsQixjQUFHLFlBQVksRUFBRTtBQUNmLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sT0FBSyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ3JELGdCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNELG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDbkM7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekQsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsQ0FBQztTQUNuQzs7QUFFRCxhQUFPOztlQUFBLFlBQUc7OztBQWpDcUIsQUFrQzdCLHNCQWxDeUMsV0FrQ25DLFlBQU8sTUFBRSxDQUFDO0FBQ2hCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFLLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDM0UsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7Ozs7V0F0Q0csa0JBQWtCO0tBQVMsWUFBWTs7OztBQXlDN0MsR0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7QUFDckMsVUFBTSxFQUFFLElBQUk7QUFDWixtQkFBZSxFQUFFLElBQUksRUFDdEIsQ0FBQyxDQUFDOztBQUVILFNBQU8sa0JBQWtCLENBQUM7Q0FDM0IsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgRXZlbnRFbWl0dGVyKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgVXBsaW5rRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnNob3VsZC5iZS5pbnN0YW5jZU9mKFIuVXBsaW5rKSk7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xyXG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICByZXR1cm4gJ1VwbGlua0V2ZW50RW1pdHRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIocm9vbSwgaGFuZGxlcikge1xyXG4gICAgICBsZXQgeyBsaXN0ZW5lciwgY3JlYXRlZEV2ZW50IH0gPSBzdXBlci5hZGRMaXN0ZW5lcihyb29tLCBoYW5kbGVyKTtcclxuICAgICAgaWYoY3JlYXRlZEV2ZW50KSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0gPSB0aGlzLnVwbGluay5saXN0ZW5Ubyhyb29tLCAocGFyYW1zKSA9PiB0aGlzLl9lbWl0KHJvb20sIHBhcmFtcykpO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW3Jvb21dLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIHJldHVybiB7IGxpc3RlbmVyLCBjcmVhdGVkRXZlbnQgfTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICBsZXQgeyBkZWxldGVkRXZlbnQgfSA9IHN1cGVyLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgICAgaWYoZGVsZXRlZEV2ZW50KSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICB0aGlzLnVwbGluay51bmxpc3RlbkZyb20ocm9vbSwgdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tyb29tXTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tyb29tXS5zaG91bGQubm90LmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGRlbGV0ZWRFdmVudCB9O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgXy5kZXYoKCkgPT4gT2JqZWN0LmtleXModGhpcy51cGxpbmtMaXN0ZW5lcnMpLmxlbmd0aC5zaG91bGQuYmUuZXhhY3RseSgwKSk7XHJcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0gbnVsbDtcclxuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoVXBsaW5rRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgdXBsaW5rOiBudWxsLFxyXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gVXBsaW5rRXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=