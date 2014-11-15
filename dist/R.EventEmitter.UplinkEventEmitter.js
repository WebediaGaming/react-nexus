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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxZQUFZLEVBQUU7QUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLGtCQUFrQixjQUFTLFlBQVk7UUFBdkMsa0JBQWtCLEdBQ1gsU0FEUCxrQkFBa0IsT0FDRTtVQUFWLE1BQU0sUUFBTixNQUFNOztBQUVsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7QUFMMkIsQUFNN0Isa0JBTnlDLFdBTWxDLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztLQUMzQjs7YUFURyxrQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsa0JBQWtCO0FBV3RCLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxvQkFBb0IsQ0FBQztTQUM3Qjs7QUFFRCxjQUFROztlQUFBLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTs7c0JBZk8sQUFnQkcsWUFoQlMsV0FnQkgsUUFBUSxLQUFBLE9BQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7Y0FBdkQsUUFBUSxTQUFSLFFBQVE7Y0FBRSxXQUFXLFNBQVgsV0FBVztBQUMzQixjQUFHLFdBQVcsRUFBRTtBQUNkLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sTUFBSyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDaEUsZ0JBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLE1BQU07cUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUFBLENBQUMsQ0FBQztXQUN0RztBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBSyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUM1RCxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELGtCQUFZOztlQUFBLFVBQUMsUUFBUSxFQUFFOztzQkF6QlEsQUEwQlAsWUExQm1CLFdBMEJiLFlBQVksS0FBQSxPQUFDLFFBQVEsQ0FBQzs7Y0FBNUMsV0FBVyxTQUFYLFdBQVc7QUFDakIsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE9BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDNUQsZ0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUQsbUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7V0FDMUM7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ2hFLGlCQUFPLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7U0FDbEM7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOztBQXBDcUIsQUFxQzdCLHNCQXJDeUMsV0FxQ25DLE9BQU8sS0FBQSxNQUFFLENBQUM7QUFDaEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUssZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUMzRSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7OztXQXpDRyxrQkFBa0I7S0FBUyxZQUFZOztBQTRDN0MsR0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7QUFDckMsVUFBTSxFQUFFLElBQUk7QUFDWixtQkFBZSxFQUFFLElBQUksRUFDdEIsQ0FBQyxDQUFDOztBQUVILFNBQU8sa0JBQWtCLENBQUM7Q0FDM0IsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgRXZlbnRFbWl0dGVyKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgVXBsaW5rRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcclxuICAgICAgLy8gRHVja3R5cGUtY2hlY2sgdXBsaW5rIChzaW5jZSB3ZSBkb250IGhhdmUgYWNjZXNzIHRvIHRoZSBjb25zdHJ1Y3RvcilcclxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLmxpc3RlblRvLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgdXBsaW5rLnVubGlzdGVuRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLnVwbGluayA9IHVwbGluaztcclxuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdVcGxpbmtFdmVudEVtaXR0ZXInO1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlblRvKHJvb20sIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH0gPSBzdXBlci5saXN0ZW5Ubyhyb29tLCBoYW5kbGVyKTtcclxuICAgICAgaWYoY3JlYXRlZFJvb20pIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8ocm9vbSwgKHBhcmFtcykgPT4gdGhpcy5fZW1pdChyb29tLCBwYXJhbXMpKTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH07XHJcbiAgICB9XHJcblxyXG4gICAgdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSB7XHJcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xyXG4gICAgICBpZihkZWxldGVkUm9vbSkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgIHRoaXMudXBsaW5rLnVubGlzdGVuRnJvbSh0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF07XHJcbiAgICAgIH1cclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5ub3QuYmUub2spO1xyXG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZFJvb20gfTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xyXG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBsaW5rID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcclxuICAgIHVwbGluazogbnVsbCxcclxuICAgIHVwbGlua0xpc3RlbmVyczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFVwbGlua0V2ZW50RW1pdHRlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9