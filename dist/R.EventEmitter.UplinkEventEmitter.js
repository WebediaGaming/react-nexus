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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5VcGxpbmtFdmVudEVtaXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixrQkFBa0IsY0FBUyxZQUFZO1FBQXZDLGtCQUFrQixHQUNYLFNBRFAsa0JBQWtCLE9BQ0U7VUFBVixNQUFNLFFBQU4sTUFBTTs7O0FBRWxCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDOUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDekMsQ0FBQztBQUwyQixBQU03QixrQkFOeUMsV0FNbEMsQ0FBQztBQUNSLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0tBQzNCOzthQVRHLGtCQUFrQixFQUFTLFlBQVk7O2dCQUF2QyxrQkFBa0I7QUFXdEIsb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLG9CQUFvQixDQUFDO1NBQzdCOztBQUVELGlCQUFXOztlQUFBLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTs7c0JBZkksQUFnQkcsWUFoQlMsV0FnQkgsZ0JBQVcsT0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDOztjQUExRCxRQUFRLFNBQVIsUUFBUTtjQUFFLFdBQVcsU0FBWCxXQUFXOztBQUMzQixjQUFHLFdBQVcsRUFBRTtBQUNkLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sTUFBSyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDaEUsZ0JBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLE1BQU07cUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUFBLENBQUMsQ0FBQztXQUN0RztBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBSyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUM1RCxpQkFBTyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ2xDOztBQUVELG9CQUFjOztlQUFBLFVBQUMsUUFBUSxFQUFFOztzQkF6Qk0sQUEwQlAsWUExQm1CLFdBMEJiLG1CQUFjLE9BQUMsUUFBUSxDQUFDOztjQUE5QyxXQUFXLFNBQVgsV0FBVzs7QUFDakIsY0FBRyxXQUFXLEVBQUU7QUFDZCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE9BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDNUQsZ0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUQsbUJBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7V0FDMUM7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ2hFLGlCQUFPLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7U0FDbEM7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOzs7QUFwQ3FCLEFBcUM3QixzQkFyQ3lDLFdBcUNuQyxZQUFPLE1BQUUsQ0FBQztBQUNoQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQzNFLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOzs7O1dBekNHLGtCQUFrQjtLQUFTLFlBQVk7Ozs7QUE0QzdDLEdBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0FBQ3JDLFVBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWUsRUFBRSxJQUFJLEVBQ3RCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLGtCQUFrQixDQUFDO0NBQzNCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuVXBsaW5rRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIEV2ZW50RW1pdHRlcikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIFVwbGlua0V2ZW50RW1pdHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IHVwbGluayB9KSB7XHJcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXHJcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5saXN0ZW5Uby5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHVwbGluay51bmxpc3RlbkZyb20uc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy51cGxpbmsgPSB1cGxpbms7XHJcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgIHJldHVybiAnVXBsaW5rRXZlbnRFbWl0dGVyJztcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcihyb29tLCBoYW5kbGVyKSB7XHJcbiAgICAgIGxldCB7IGxpc3RlbmVyLCBjcmVhdGVkUm9vbSB9ID0gc3VwZXIuYWRkTGlzdGVuZXIocm9vbSwgaGFuZGxlcik7XHJcbiAgICAgIGlmKGNyZWF0ZWRSb29tKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5ub3QuYmUub2spO1xyXG4gICAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXSA9IHRoaXMudXBsaW5rLmxpc3RlblRvKHJvb20sIChwYXJhbXMpID0+IHRoaXMuX2VtaXQocm9vbSwgcGFyYW1zKSk7XHJcbiAgICAgIH1cclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIHJldHVybiB7IGxpc3RlbmVyLCBjcmVhdGVkUm9vbSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XHJcbiAgICAgIGxldCB7IGRlbGV0ZWRSb29tIH0gPSBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICAgIGlmKGRlbGV0ZWRSb29tKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbbGlzdGVuZXIuaWRdLnNob3VsZC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy51cGxpbmsudW5saXN0ZW5Gcm9tKHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMudXBsaW5rTGlzdGVuZXJzW2xpc3RlbmVyLmlkXTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tsaXN0ZW5lci5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgIHJldHVybiB7IGxpc3RlbmVyLCBkZWxldGVkUm9vbSB9O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgXy5kZXYoKCkgPT4gT2JqZWN0LmtleXModGhpcy51cGxpbmtMaXN0ZW5lcnMpLmxlbmd0aC5zaG91bGQuYmUuZXhhY3RseSgwKSk7XHJcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0gbnVsbDtcclxuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoVXBsaW5rRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgdXBsaW5rOiBudWxsLFxyXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gVXBsaW5rRXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=