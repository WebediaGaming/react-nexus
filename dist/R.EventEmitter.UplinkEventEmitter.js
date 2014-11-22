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

  var _UplinkEventEmitter = (function (EventEmitter) {
    var _UplinkEventEmitter = function _UplinkEventEmitter(_ref) {
      var uplink = _ref.uplink;
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.listenTo.should.be.a.Function && uplink.unlistenFrom.should.be.a.Function;
      });
      EventEmitter.call(this);
      this.uplink = uplink;
      this.uplinkListeners = {};
    };

    _extends(_UplinkEventEmitter, EventEmitter);

    _classProps(_UplinkEventEmitter, null, {
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

    return _UplinkEventEmitter;
  })(EventEmitter);

  _.extend(_UplinkEventEmitter.prototype, {
    uplink: null,
    uplinkListeners: null });

  return _UplinkEventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRXZlbnRFbWl0dGVyLlVwbGlua0V2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRTtBQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLG1CQUFrQixjQUFTLFlBQVk7UUFBdkMsbUJBQWtCLEdBQ1gsU0FEUCxtQkFBa0IsT0FDRTtVQUFWLE1BQU0sUUFBTixNQUFNOztBQUVsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7QUFMMkIsQUFNN0Isa0JBTnlDLFdBTWxDLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztLQUMzQjs7YUFURyxtQkFBa0IsRUFBUyxZQUFZOztnQkFBdkMsbUJBQWtCO0FBV3RCLGNBQVE7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFOztzQkFYTyxBQVlHLFlBWlMsV0FZSCxRQUFRLEtBQUEsT0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDOztjQUF2RCxRQUFRLFNBQVIsUUFBUTtjQUFFLFdBQVcsU0FBWCxXQUFXO0FBQzNCLGNBQUcsV0FBVyxFQUFFO0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxNQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUFBLENBQUMsQ0FBQztBQUN4RSxnQkFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQUMsTUFBTTtxQkFBSyxNQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQUEsQ0FBQyxDQUFDO1dBQ3RHO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQzVELGlCQUFPLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7U0FDbEM7O0FBRUQsa0JBQVk7O2VBQUEsVUFBQyxRQUFRLEVBQUU7O3NCQXJCUSxBQXNCUCxZQXRCbUIsV0FzQmIsWUFBWSxLQUFBLE9BQUMsUUFBUSxDQUFDOztjQUE1QyxXQUFXLFNBQVgsV0FBVztBQUNqQixjQUFHLFdBQVcsRUFBRTtBQUNkLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sT0FBSyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQzthQUFBLENBQUMsQ0FBQztBQUNwRSxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1RCxtQkFBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUMxQztBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDeEUsaUJBQU8sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUNsQzs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBaENxQixBQWlDN0Isc0JBakN5QyxXQWlDbkMsT0FBTyxLQUFBLE1BQUUsQ0FBQztBQUNoQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQzNFLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOzs7O1dBckNHLG1CQUFrQjtLQUFTLFlBQVk7O0FBd0M3QyxHQUFDLENBQUMsTUFBTSxDQUFDLG1CQUFrQixDQUFDLFNBQVMsRUFBRTtBQUNyQyxVQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFlLEVBQUUsSUFBSSxFQUN0QixDQUFDLENBQUM7O0FBRUgsU0FBTyxtQkFBa0IsQ0FBQztDQUMzQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLlVwbGlua0V2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgRXZlbnRFbWl0dGVyKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgVXBsaW5rRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHVwbGluayB9KSB7XG4gICAgICAvLyBEdWNrdHlwZS1jaGVjayB1cGxpbmsgKHNpbmNlIHdlIGRvbnQgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbnN0cnVjdG9yKVxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLmxpc3RlblRvLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHVwbGluay51bmxpc3RlbkZyb20uc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy51cGxpbmsgPSB1cGxpbms7XG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IHt9O1xuICAgIH1cblxuICAgIGxpc3RlblRvKHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIGxldCB7IGxpc3RlbmVyLCBjcmVhdGVkUm9vbSB9ID0gc3VwZXIubGlzdGVuVG8ocm9vbSwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUm9vbSkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVycy5zaG91bGQubm90LmhhdmUucHJvcGVydHkobGlzdGVuZXIuaWQpKTtcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8ocm9vbSwgKHBhcmFtcykgPT4gdGhpcy5fZW1pdChyb29tLCBwYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGNyZWF0ZWRSb29tIH07XG4gICAgfVxuXG4gICAgdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSB7XG4gICAgICBsZXQgeyBkZWxldGVkUm9vbSB9ID0gc3VwZXIudW5saXN0ZW5Gcm9tKGxpc3RlbmVyKTtcbiAgICAgIGlmKGRlbGV0ZWRSb29tKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGxpc3RlbmVyLmlkKSk7XG4gICAgICAgIHRoaXMudXBsaW5rLnVubGlzdGVuRnJvbSh0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0pO1xuICAgICAgICBkZWxldGUgdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KGxpc3RlbmVyLmlkKSk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZFJvb20gfTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgXy5kZXYoKCkgPT4gT2JqZWN0LmtleXModGhpcy51cGxpbmtMaXN0ZW5lcnMpLmxlbmd0aC5zaG91bGQuYmUuZXhhY3RseSgwKSk7XG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IG51bGw7XG4gICAgICB0aGlzLnVwbGluayA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICAgIHVwbGluazogbnVsbCxcbiAgICB1cGxpbmtMaXN0ZW5lcnM6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBVcGxpbmtFdmVudEVtaXR0ZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9