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

  var UplinkEventEmitter = (function (EventEmitter) {
    var UplinkEventEmitter = function UplinkEventEmitter(_ref) {
      var uplink = _ref.uplink;
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.listenTo.should.be.a.Function && uplink.unlistenFrom.should.be.a.Function;
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
      listenTo: {
        writable: true,
        value: function (room, handler) {
          var _this = this;
          var _ref2 = EventEmitter.prototype.listenTo.call(this, room, handler);

          var listener = _ref2.listener;
          var createdRoom = _ref2.createdRoom;
          if (createdRoom) {
            _.dev(function () {
              return _this.uplinkListeners[listener.id].should.not.be.ok;
            });
            this.uplinkListeners[listener.id] = this.uplink.listenTo(room, function (params) {
              return _this._emit(room, params);
            });
          }
          _.dev(function () {
            return _this.uplinkListeners[listener.id].should.be.ok;
          });
          return { listener: listener, createdRoom: createdRoom };
        }
      },
      unlistenFrom: {
        writable: true,
        value: function (listener) {
          var _this2 = this;
          var _ref3 = EventEmitter.prototype.unlistenFrom.call(this, listener);

          var deletedRoom = _ref3.deletedRoom;
          if (deletedRoom) {
            _.dev(function () {
              return _this2.uplinkListeners[listener.id].should.be.ok;
            });
            this.uplink.unlistenFrom(this.uplinkListeners[listener.id]);
            delete this.uplinkListeners[listener.id];
          }
          _.dev(function () {
            return _this2.uplinkListeners[listener.id].should.not.be.ok;
          });
          return { listener: listener, deletedRoom: deletedRoom };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxZQUFZLEVBQUU7QUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixrQkFBa0IsY0FBUyxZQUFZO1FBQXZDLGtCQUFrQixHQUNYLFNBRFAsa0JBQWtCLE9BQ0U7VUFBVixNQUFNLFFBQU4sTUFBTTs7QUFFbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUN6QyxDQUFDO0FBTDJCLEFBTTdCLGtCQU55QyxXQU1sQyxDQUFDO0FBQ1IsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7S0FDM0I7O2FBVEcsa0JBQWtCLEVBQVMsWUFBWTs7Z0JBQXZDLGtCQUFrQjtBQVd0QixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sb0JBQW9CLENBQUM7U0FDN0I7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7O3NCQWZPLEFBZ0JHLFlBaEJTLFdBZ0JILFFBQVEsS0FBQSxPQUFDLElBQUksRUFBRSxPQUFPLENBQUM7O2NBQXZELFFBQVEsU0FBUixRQUFRO2NBQUUsV0FBVyxTQUFYLFdBQVc7QUFDM0IsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFNO3FCQUFLLE1BQUssS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7V0FDdEc7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDNUQsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUNsQzs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFFBQVEsRUFBRTs7c0JBekJRLEFBMEJQLFlBMUJtQixXQTBCYixZQUFZLEtBQUEsT0FBQyxRQUFRLENBQUM7O2NBQTVDLFdBQVcsU0FBWCxXQUFXO0FBQ2pCLGNBQUcsV0FBVyxFQUFFO0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVELG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNoRSxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELGFBQU87O2VBQUEsWUFBRzs7QUFwQ3FCLEFBcUM3QixzQkFyQ3lDLFdBcUNuQyxPQUFPLEtBQUEsTUFBRSxDQUFDO0FBQ2hCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFLLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDM0UsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7Ozs7V0F6Q0csa0JBQWtCO0tBQVMsWUFBWTs7QUE0QzdDLEdBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0FBQ3JDLFVBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWUsRUFBRSxJQUFJLEVBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLGtCQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuVXBsaW5rRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIEV2ZW50RW1pdHRlcikge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNsYXNzIFVwbGlua0V2ZW50RW1pdHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xuICAgICAgLy8gRHVja3R5cGUtY2hlY2sgdXBsaW5rIChzaW5jZSB3ZSBkb250IGhhdmUgYWNjZXNzIHRvIHRoZSBjb25zdHJ1Y3RvcilcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5saXN0ZW5Uby5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB1cGxpbmsudW5saXN0ZW5Gcm9tLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnVXBsaW5rRXZlbnRFbWl0dGVyJztcbiAgICB9XG5cbiAgICBsaXN0ZW5Ubyhyb29tLCBoYW5kbGVyKSB7XG4gICAgICBsZXQgeyBsaXN0ZW5lciwgY3JlYXRlZFJvb20gfSA9IHN1cGVyLmxpc3RlblRvKHJvb20sIGhhbmRsZXIpO1xuICAgICAgaWYoY3JlYXRlZFJvb20pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgICB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0gPSB0aGlzLnVwbGluay5saXN0ZW5Ubyhyb29tLCAocGFyYW1zKSA9PiB0aGlzLl9lbWl0KHJvb20sIHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgY3JlYXRlZFJvb20gfTtcbiAgICB9XG5cbiAgICB1bmxpc3RlbkZyb20obGlzdGVuZXIpIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xuICAgICAgaWYoZGVsZXRlZFJvb20pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHRoaXMudXBsaW5rLnVubGlzdGVuRnJvbSh0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0pO1xuICAgICAgICBkZWxldGUgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGRlbGV0ZWRSb29tIH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICB1cGxpbms6IG51bGwsXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rRXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==