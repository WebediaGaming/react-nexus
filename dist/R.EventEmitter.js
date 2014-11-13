"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;
  var Listener = require("./R.EventEmitter.Listener")(R);

  var EventEmitter = (function () {
    var EventEmitter = function EventEmitter(params) {
      if (params === undefined) params = {};
      this.listeners = {};
      this.displayName = this.getDisplayName();
    };

    _classProps(EventEmitter, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      addListener: {
        writable: true,
        value: function (room, handler) {
          _.dev(function () {
            return room.should.be.a.String && handler.should.be.a.Function;
          });
          var listener = new Listener({ room: room, handler: handler });
          return {
            listener: listener,
            createdRoom: listener.addTo(this.listeners) };
        }
      },
      removeListener: {
        writable: true,
        value: function (listener) {
          _.dev(function () {
            return listener.should.be.an.instanceOf(Listener);
          });
          return {
            listener: listener,
            deletedRoom: listener.removeFrom(this.listeners) };
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          Object.keys(this.listeners).forEach(function (i) {
            return Object.keys(_this.listeners[i]).forEach(function (j) {
              return _this.listeners[i][j].removeFrom(_this.listeners);
            });
          });
          // Nullify references
          this.listeners = null;
        }
      }
    });

    return EventEmitter;
  })();

  _.extend(EventEmitter.prototype, {
    listeners: null,
    displayName: null });

  _.extend(EventEmitter, { Listener: Listener });

  var MemoryEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);
  var UplinkEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);

  _.extend(EventEmitter, { MemoryEventEmitter: MemoryEventEmitter, UplinkEventEmitter: UplinkEventEmitter });

  return EventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVuRCxZQUFZO1FBQVosWUFBWSxHQUNMLFNBRFAsWUFBWSxDQUNKLE1BQU0sRUFBTztVQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7QUFDckIsVUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDMUM7O2dCQUpHLFlBQVk7QUFNaEIsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxpQkFBVzs7ZUFBQSxVQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDekIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtXQUFBLENBQzdCLENBQUM7QUFDRixjQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0MsaUJBQU87QUFDTCxvQkFBUSxFQUFSLFFBQVE7QUFDUix1QkFBVyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUM1QyxDQUFDO1NBQ0g7O0FBRUQsb0JBQWM7O2VBQUEsVUFBQyxRQUFRLEVBQUU7QUFDdkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN4RCxpQkFBTztBQUNMLG9CQUFRLEVBQVIsUUFBUTtBQUNSLHVCQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQ2pELENBQUM7U0FDSDs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7bUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO3FCQUN2QyxNQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBSyxTQUFTLENBQUM7YUFBQSxDQUNoRDtXQUFBLENBQ0YsQ0FBQzs7QUFFRixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2Qjs7OztXQW5DRyxZQUFZOzs7QUFzQ2xCLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMvQixhQUFTLEVBQUUsSUFBSTtBQUNmLGVBQVcsRUFBRSxJQUFJLEVBQ2xCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUVyQyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFM0YsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxrQkFBa0IsRUFBbEIsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQWxCLGtCQUFrQixFQUFFLENBQUMsQ0FBQzs7QUFFbkUsU0FBTyxZQUFZLENBQUM7Q0FDckIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuICBjb25zdCBMaXN0ZW5lciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXInKShSKTtcclxuXHJcbiAgY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XHJcbiAgICAgIHRoaXMuZGlzcGxheU5hbWUgPSB0aGlzLmdldERpc3BsYXlOYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgIGFkZExpc3RlbmVyKHJvb20sIGhhbmRsZXIpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBsaXN0ZW5lciA9IG5ldyBMaXN0ZW5lcih7IHJvb20sIGhhbmRsZXIgfSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGlzdGVuZXIsXHJcbiAgICAgICAgY3JlYXRlZFJvb206IGxpc3RlbmVyLmFkZFRvKHRoaXMubGlzdGVuZXJzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihMaXN0ZW5lcikpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgIGRlbGV0ZWRSb29tOiBsaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaCgoaSkgPT5cclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tpXSkuZm9yRWFjaCgoaikgPT5cclxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2ldW2pdLnJlbW92ZUZyb20odGhpcy5saXN0ZW5lcnMpXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgbGlzdGVuZXJzOiBudWxsLFxyXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlciwgeyBMaXN0ZW5lciB9KTtcclxuXHJcbiAgY29uc3QgTWVtb3J5RXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXInKShSLCBFdmVudEVtaXR0ZXIpO1xyXG4gIGNvbnN0IFVwbGlua0V2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyJykoUiwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLCB7IE1lbW9yeUV2ZW50RW1pdHRlciwgVXBsaW5rRXZlbnRFbWl0dGVyIH0pO1xyXG5cclxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=