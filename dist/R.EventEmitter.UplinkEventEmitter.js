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
      addListener: {
        writable: true,
        value: function (room, handler) {
          var _this = this;
          var _ref2 = EventEmitter.prototype.addListener.call(this, room, handler);

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
      removeListener: {
        writable: true,
        value: function (listener) {
          var _this2 = this;
          var _ref3 = EventEmitter.prototype.removeListener.call(this, listener);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxZQUFZLEVBQUU7QUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLGtCQUFrQixjQUFTLFlBQVk7UUFBdkMsa0JBQWtCLEdBQ1gsU0FEUCxrQkFBa0IsT0FDRTtVQUFWLE1BQU0sUUFBTixNQUFNOztBQUVsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7QUFMMkIsQUFNN0Isa0JBTnlDLFdBTWxDLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztLQUMzQjs7YUFURyxrQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsa0JBQWtCO0FBV3RCLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxvQkFBb0IsQ0FBQztTQUM3Qjs7QUFFRCxpQkFBVzs7ZUFBQSxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7O3NCQWZJLEFBZ0JHLFlBaEJTLFdBZ0JILFdBQVcsS0FBQSxPQUFDLElBQUksRUFBRSxPQUFPLENBQUM7O2NBQTFELFFBQVEsU0FBUixRQUFRO2NBQUUsV0FBVyxTQUFYLFdBQVc7QUFDM0IsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFNO3FCQUFLLE1BQUssS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7V0FDdEc7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDNUQsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUNsQzs7QUFFRCxvQkFBYzs7ZUFBQSxVQUFDLFFBQVEsRUFBRTs7c0JBekJNLEFBMEJQLFlBMUJtQixXQTBCYixjQUFjLEtBQUEsT0FBQyxRQUFRLENBQUM7O2NBQTlDLFdBQVcsU0FBWCxXQUFXO0FBQ2pCLGNBQUcsV0FBVyxFQUFFO0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVELG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNoRSxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELGFBQU87O2VBQUEsWUFBRzs7QUFwQ3FCLEFBcUM3QixzQkFyQ3lDLFdBcUNuQyxPQUFPLEtBQUEsTUFBRSxDQUFDO0FBQ2hCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFLLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDM0UsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7Ozs7V0F6Q0csa0JBQWtCO0tBQVMsWUFBWTs7QUE0QzdDLEdBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0FBQ3JDLFVBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWUsRUFBRSxJQUFJLEVBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLGtCQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuVXBsaW5rRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIEV2ZW50RW1pdHRlcikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsubGlzdGVuVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnVubGlzdGVuRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnVwbGluayA9IHVwbGluaztcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0ge307XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ1VwbGlua0V2ZW50RW1pdHRlcic7XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIocm9vbSwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH0gPSBzdXBlci5hZGRMaXN0ZW5lcihyb29tLCBoYW5kbGVyKTtcbiAgICAgIGlmKGNyZWF0ZWRSb29tKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXS5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8ocm9vbSwgKHBhcmFtcykgPT4gdGhpcy5fZW1pdChyb29tLCBwYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH07XG4gICAgfVxuXG4gICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICBpZihkZWxldGVkUm9vbSkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmsudW5saXN0ZW5Gcm9tKHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF07XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZFJvb20gfTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgXy5kZXYoKCkgPT4gT2JqZWN0LmtleXModGhpcy51cGxpbmtMaXN0ZW5lcnMpLmxlbmd0aC5zaG91bGQuYmUuZXhhY3RseSgwKSk7XG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IG51bGw7XG4gICAgICB0aGlzLnVwbGluayA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICAgIHVwbGluazogbnVsbCxcbiAgICB1cGxpbmtMaXN0ZW5lcnM6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBVcGxpbmtFdmVudEVtaXR0ZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9