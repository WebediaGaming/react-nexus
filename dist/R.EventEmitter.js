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
      listenTo: {
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
      unlistenFrom: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVuRCxZQUFZO1FBQVosWUFBWSxHQUNMLFNBRFAsWUFBWSxDQUNKLE1BQU0sRUFBTztVQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7QUFDckIsVUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDMUM7O2dCQUpHLFlBQVk7QUFNaEIsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxjQUFROztlQUFBLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUN0QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1dBQUEsQ0FDN0IsQ0FBQztBQUNGLGNBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMvQyxpQkFBTztBQUNMLG9CQUFRLEVBQVIsUUFBUTtBQUNSLHVCQUFXLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQzVDLENBQUM7U0FDSDs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLFFBQVEsRUFBRTtBQUNyQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQ3hELGlCQUFPO0FBQ0wsb0JBQVEsRUFBUixRQUFRO0FBQ1IsdUJBQVcsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDakQsQ0FBQztTQUNIOztBQUVELGFBQU87O2VBQUEsWUFBRzs7QUFDUixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQzttQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7cUJBQ3ZDLE1BQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFLLFNBQVMsQ0FBQzthQUFBLENBQ2hEO1dBQUEsQ0FDRixDQUFDOztBQUVGLGNBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCOzs7O1dBbkNHLFlBQVk7OztBQXNDbEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQy9CLGFBQVMsRUFBRSxJQUFJO0FBQ2YsZUFBVyxFQUFFLElBQUksRUFDbEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRXJDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNGLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUUzRixHQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLGtCQUFrQixFQUFsQixrQkFBa0IsRUFBRSxrQkFBa0IsRUFBbEIsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDOztBQUVuRSxTQUFPLFlBQVksQ0FBQztDQUNyQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IExpc3RlbmVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lcicpKFIpO1xyXG5cclxuICBjbGFzcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgbGlzdGVuVG8ocm9vbSwgaGFuZGxlcikge1xyXG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IExpc3RlbmVyKHsgcm9vbSwgaGFuZGxlciB9KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBjcmVhdGVkUm9vbTogbGlzdGVuZXIuYWRkVG8odGhpcy5saXN0ZW5lcnMpLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVubGlzdGVuRnJvbShsaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihMaXN0ZW5lcikpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgIGRlbGV0ZWRSb29tOiBsaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaCgoaSkgPT5cclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tpXSkuZm9yRWFjaCgoaikgPT5cclxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2ldW2pdLnJlbW92ZUZyb20odGhpcy5saXN0ZW5lcnMpXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgbGlzdGVuZXJzOiBudWxsLFxyXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlciwgeyBMaXN0ZW5lciB9KTtcclxuXHJcbiAgY29uc3QgTWVtb3J5RXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXInKShSLCBFdmVudEVtaXR0ZXIpO1xyXG4gIGNvbnN0IFVwbGlua0V2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyJykoUiwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLCB7IE1lbW9yeUV2ZW50RW1pdHRlciwgVXBsaW5rRXZlbnRFbWl0dGVyIH0pO1xyXG5cclxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=