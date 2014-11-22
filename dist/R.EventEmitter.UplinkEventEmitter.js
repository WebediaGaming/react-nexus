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
      listenTo: {
        writable: true,
        value: function (room, handler) {
          var _this = this;
          var _ref2 = EventEmitter.prototype.listenTo.call(this, room, handler);

          var listener = _ref2.listener;
          var createdRoom = _ref2.createdRoom;

          if (createdRoom) {
            _.dev(function () {
              return _this.uplinkListeners.should.not.have.property(listener.id);
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
              return _this2.uplinkListeners.should.have.property(listener.id);
            });
            this.uplink.unlistenFrom(this.uplinkListeners[listener.id]);
            delete this.uplinkListeners[listener.id];
          }
          _.dev(function () {
            return _this2.uplinkListeners.should.not.have.property(listener.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsa0JBQWtCLGNBQVMsWUFBWTtRQUF2QyxrQkFBa0IsR0FDWCxTQURQLGtCQUFrQixPQUNFO1VBQVYsTUFBTSxRQUFOLE1BQU07OztBQUVsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7QUFMMkIsQUFNN0Isa0JBTnlDLFdBTWxDLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztLQUMzQjs7YUFURyxrQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsa0JBQWtCO0FBV3RCLGNBQVE7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFOztzQkFYTyxBQVlHLFlBWlMsV0FZSCxhQUFRLE9BQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7Y0FBdkQsUUFBUSxTQUFSLFFBQVE7Y0FBRSxXQUFXLFNBQVgsV0FBVzs7QUFDM0IsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE1BQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ3hFLGdCQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFNO3FCQUFLLE1BQUssS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7V0FDdEc7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDNUQsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUNsQzs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFFBQVEsRUFBRTs7c0JBckJRLEFBc0JQLFlBdEJtQixXQXNCYixpQkFBWSxPQUFDLFFBQVEsQ0FBQzs7Y0FBNUMsV0FBVyxTQUFYLFdBQVc7O0FBQ2pCLGNBQUcsV0FBVyxFQUFFO0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ3BFLGdCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVELG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN4RSxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBaENxQixBQWlDN0Isc0JBakN5QyxXQWlDbkMsWUFBTyxNQUFFLENBQUM7QUFDaEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUssZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUMzRSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7OztXQXJDRyxrQkFBa0I7S0FBUyxZQUFZOzs7O0FBd0M3QyxHQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRTtBQUNyQyxVQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFlLEVBQUUsSUFBSSxFQUN0QixDQUFDLENBQUM7O0FBRUgsU0FBTyxrQkFBa0IsQ0FBQztDQUMzQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLlVwbGlua0V2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBFdmVudEVtaXR0ZXIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsubGlzdGVuVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnVubGlzdGVuRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnVwbGluayA9IHVwbGluaztcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0ge307XG4gICAgfVxuXG4gICAgbGlzdGVuVG8ocm9vbSwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH0gPSBzdXBlci5saXN0ZW5Ubyhyb29tLCBoYW5kbGVyKTtcbiAgICAgIGlmKGNyZWF0ZWRSb29tKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShsaXN0ZW5lci5pZCkpO1xuICAgICAgICB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0gPSB0aGlzLnVwbGluay5saXN0ZW5Ubyhyb29tLCAocGFyYW1zKSA9PiB0aGlzLl9lbWl0KHJvb20sIHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgY3JlYXRlZFJvb20gfTtcbiAgICB9XG5cbiAgICB1bmxpc3RlbkZyb20obGlzdGVuZXIpIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xuICAgICAgaWYoZGVsZXRlZFJvb20pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnMuc2hvdWxkLmhhdmUucHJvcGVydHkobGlzdGVuZXIuaWQpKTtcbiAgICAgICAgdGhpcy51cGxpbmsudW5saXN0ZW5Gcm9tKHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF07XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVycy5zaG91bGQubm90LmhhdmUucHJvcGVydHkobGlzdGVuZXIuaWQpKTtcbiAgICAgIHJldHVybiB7IGxpc3RlbmVyLCBkZWxldGVkUm9vbSB9O1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICBfLmRldigoKSA9PiBPYmplY3Qua2V5cyh0aGlzLnVwbGlua0xpc3RlbmVycykubGVuZ3RoLnNob3VsZC5iZS5leGFjdGx5KDApKTtcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0gbnVsbDtcbiAgICAgIHRoaXMudXBsaW5rID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChVcGxpbmtFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gICAgdXBsaW5rOiBudWxsLFxuICAgIHVwbGlua0xpc3RlbmVyczogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIFVwbGlua0V2ZW50RW1pdHRlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=