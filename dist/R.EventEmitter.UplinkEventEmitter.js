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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixrQkFBa0IsY0FBUyxZQUFZO1FBQXZDLGtCQUFrQixHQUNYLFNBRFAsa0JBQWtCLE9BQ0U7VUFBVixNQUFNLFFBQU4sTUFBTTs7QUFDbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBRnRCLEFBRzdCLGtCQUh5QyxXQUdsQyxDQUFDO0FBQ1IsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7S0FDM0I7O2FBTkcsa0JBQWtCLEVBQVMsWUFBWTs7Z0JBQXZDLGtCQUFrQjtBQVF0QixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sb0JBQW9CLENBQUM7U0FDN0I7O0FBRUQsaUJBQVc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFOztzQkFaSSxBQWFJLFlBYlEsV0FhRixXQUFXLEtBQUEsT0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDOztjQUEzRCxRQUFRLFNBQVIsUUFBUTtjQUFFLFlBQVksU0FBWixZQUFZOztBQUM1QixjQUFHLFlBQVksRUFBRTtBQUNmLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sTUFBSyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTthQUFBLENBQUMsQ0FBQztBQUN6RCxnQkFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFNO3FCQUFLLE1BQUssS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7V0FDL0Y7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQUssZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNyRCxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxDQUFDO1NBQ25DOztBQUVELG9CQUFjOztlQUFBLFVBQUMsUUFBUSxFQUFFOztzQkF0Qk0sQUF1Qk4sWUF2QmtCLFdBdUJaLGNBQWMsS0FBQSxPQUFDLFFBQVEsQ0FBQzs7Y0FBL0MsWUFBWSxTQUFaLFlBQVk7O0FBQ2xCLGNBQUcsWUFBWSxFQUFFO0FBQ2YsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDckQsZ0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0QsbUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNuQztBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUN6RCxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxDQUFDO1NBQ25DOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBakNxQixBQWtDN0Isc0JBbEN5QyxXQWtDbkMsT0FBTyxLQUFBLE1BQUUsQ0FBQztBQUNoQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQzNFLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOzs7O1dBdENHLGtCQUFrQjtLQUFTLFlBQVk7Ozs7QUF5QzdDLEdBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0FBQ3JDLFVBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWUsRUFBRSxJQUFJLEVBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLGtCQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuVXBsaW5rRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIEV2ZW50RW1pdHRlcikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuaW5zdGFuY2VPZihSLlVwbGluaykpO1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnVXBsaW5rRXZlbnRFbWl0dGVyJztcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihyb29tLCBoYW5kbGVyKSB7XG4gICAgICBsZXQgeyBsaXN0ZW5lciwgY3JlYXRlZEV2ZW50IH0gPSBzdXBlci5hZGRMaXN0ZW5lcihyb29tLCBoYW5kbGVyKTtcbiAgICAgIGlmKGNyZWF0ZWRFdmVudCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tyb29tXS5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0gPSB0aGlzLnVwbGluay5saXN0ZW5Ubyhyb29tLCAocGFyYW1zKSA9PiB0aGlzLl9lbWl0KHJvb20sIHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0uc2hvdWxkLmJlLm9rKTtcbiAgICAgIHJldHVybiB7IGxpc3RlbmVyLCBjcmVhdGVkRXZlbnQgfTtcbiAgICB9XG5cbiAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgICAgbGV0IHsgZGVsZXRlZEV2ZW50IH0gPSBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICBpZihkZWxldGVkRXZlbnQpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmsudW5saXN0ZW5Gcm9tKHJvb20sIHRoaXMudXBsaW5rTGlzdGVuZXJzW3Jvb21dKTtcbiAgICAgICAgZGVsZXRlIHRoaXMudXBsaW5rTGlzdGVuZXJzW3Jvb21dO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbcm9vbV0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZEV2ZW50IH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICB1cGxpbms6IG51bGwsXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rRXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==