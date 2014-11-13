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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFbkQsWUFBWTtRQUFaLFlBQVksR0FDTCxTQURQLFlBQVksQ0FDSixNQUFNLEVBQU87VUFBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFOztBQUNyQixVQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUMxQzs7Z0JBSkcsWUFBWTtBQU1oQixvQkFBYzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWxDLGlCQUFXOztlQUFBLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUN6QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1dBQUEsQ0FDN0IsQ0FBQztBQUNGLGNBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMvQyxpQkFBTztBQUNMLG9CQUFRLEVBQVIsUUFBUTtBQUNSLHVCQUFXLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQzVDLENBQUM7U0FDSDs7QUFFRCxvQkFBYzs7ZUFBQSxVQUFDLFFBQVEsRUFBRTtBQUN2QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQ3hELGlCQUFPO0FBQ0wsb0JBQVEsRUFBUixRQUFRO0FBQ1IsdUJBQVcsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDakQsQ0FBQztTQUNIOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7bUJBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO3FCQUN2QyxNQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBSyxTQUFTLENBQUM7YUFBQSxDQUNoRDtXQUFBLENBQ0YsQ0FBQzs7QUFFRixjQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2Qjs7OztXQW5DRyxZQUFZOzs7OztBQXNDbEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQy9CLGFBQVMsRUFBRSxJQUFJO0FBQ2YsZUFBVyxFQUFFLElBQUksRUFDbEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRXJDLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNGLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUUzRixHQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLGtCQUFrQixFQUFsQixrQkFBa0IsRUFBRSxrQkFBa0IsRUFBbEIsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDOztBQUVuRSxTQUFPLFlBQVksQ0FBQztDQUNyQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IExpc3RlbmVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lcicpKFIpO1xuXG4gIGNsYXNzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIGFkZExpc3RlbmVyKHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIoeyByb29tLCBoYW5kbGVyIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGNyZWF0ZWRSb29tOiBsaXN0ZW5lci5hZGRUbyh0aGlzLmxpc3RlbmVycyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihMaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGRlbGV0ZWRSb29tOiBsaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKChpKSA9PlxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tpXSkuZm9yRWFjaCgoaikgPT5cbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpXVtqXS5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICAgIGxpc3RlbmVyczogbnVsbCxcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgfSk7XG5cbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLCB7IExpc3RlbmVyIH0pO1xuXG4gIGNvbnN0IE1lbW9yeUV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyJykoUiwgRXZlbnRFbWl0dGVyKTtcbiAgY29uc3QgVXBsaW5rRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9SLkV2ZW50RW1pdHRlci5NZW1vcnlFdmVudEVtaXR0ZXInKShSLCBFdmVudEVtaXR0ZXIpO1xuXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlciwgeyBNZW1vcnlFdmVudEVtaXR0ZXIsIFVwbGlua0V2ZW50RW1pdHRlciB9KTtcblxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==