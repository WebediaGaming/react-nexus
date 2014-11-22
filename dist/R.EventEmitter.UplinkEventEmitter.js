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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsa0JBQWtCLGNBQVMsWUFBWTtRQUF2QyxrQkFBa0IsR0FDWCxTQURQLGtCQUFrQixPQUNFO1VBQVYsTUFBTSxRQUFOLE1BQU07OztBQUVsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7QUFMMkIsQUFNN0Isa0JBTnlDLFdBTWxDLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztLQUMzQjs7YUFURyxrQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsa0JBQWtCO0FBV3RCLGNBQVE7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFOztzQkFYTyxBQVlHLFlBWlMsV0FZSCxhQUFRLE9BQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzs7Y0FBdkQsUUFBUSxTQUFSLFFBQVE7Y0FBRSxXQUFXLFNBQVgsV0FBVzs7QUFDM0IsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxNQUFNO3FCQUFLLE1BQUssS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFBQSxDQUFDLENBQUM7V0FDdEc7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDNUQsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUNsQzs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFFBQVEsRUFBRTs7c0JBckJRLEFBc0JQLFlBdEJtQixXQXNCYixpQkFBWSxPQUFDLFFBQVEsQ0FBQzs7Y0FBNUMsV0FBVyxTQUFYLFdBQVc7O0FBQ2pCLGNBQUcsV0FBVyxFQUFFO0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVELG1CQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNoRSxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBaENxQixBQWlDN0Isc0JBakN5QyxXQWlDbkMsWUFBTyxNQUFFLENBQUM7QUFDaEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUssZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUMzRSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7OztXQXJDRyxrQkFBa0I7S0FBUyxZQUFZOzs7O0FBd0M3QyxHQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRTtBQUNyQyxVQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFlLEVBQUUsSUFBSSxFQUN0QixDQUFDLENBQUM7O0FBRUgsU0FBTyxrQkFBa0IsQ0FBQztDQUMzQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLlVwbGlua0V2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBFdmVudEVtaXR0ZXIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xyXG4gICAgICAvLyBEdWNrdHlwZS1jaGVjayB1cGxpbmsgKHNpbmNlIHdlIGRvbnQgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbnN0cnVjdG9yKVxyXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsubGlzdGVuVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICB1cGxpbmsudW5saXN0ZW5Gcm9tLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xyXG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlblRvKHJvb20sIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH0gPSBzdXBlci5saXN0ZW5Ubyhyb29tLCBoYW5kbGVyKTtcclxuICAgICAgaWYoY3JlYXRlZFJvb20pIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8ocm9vbSwgKHBhcmFtcykgPT4gdGhpcy5fZW1pdChyb29tLCBwYXJhbXMpKTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH07XHJcbiAgICB9XHJcblxyXG4gICAgdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSB7XHJcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xyXG4gICAgICBpZihkZWxldGVkUm9vbSkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgIHRoaXMudXBsaW5rLnVubGlzdGVuRnJvbSh0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF07XHJcbiAgICAgIH1cclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5ub3QuYmUub2spO1xyXG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZFJvb20gfTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xyXG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IG51bGw7XHJcbiAgICAgIHRoaXMudXBsaW5rID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcclxuICAgIHVwbGluazogbnVsbCxcclxuICAgIHVwbGlua0xpc3RlbmVyczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFVwbGlua0V2ZW50RW1pdHRlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9