"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var Listener = require("./R.EventEmitter.Listener")(R);

  var _EventEmitter = (function () {
    var _EventEmitter = function _EventEmitter() {
      this.listeners = {};
    };

    _classProps(_EventEmitter, null, {
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

    return _EventEmitter;
  })();

  _.extend(_EventEmitter.prototype, {
    listeners: null });

  _.extend(_EventEmitter, { Listener: Listener });

  var MemoryEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, _EventEmitter);
  var UplinkEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, _EventEmitter);

  _.extend(_EventEmitter, { MemoryEventEmitter: MemoryEventEmitter, UplinkEventEmitter: UplinkEventEmitter });

  return _EventEmitter;
};
//# sourceMappingURL=data:application/json;base64,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QUFrQixFQUFFLENBQUMsQ0FBQzs7QUFFbkUsU0FBTyxhQUFZLENBQUM7Q0FDckIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3QgTGlzdGVuZXIgPSByZXF1aXJlKCcuL1IuRXZlbnRFbWl0dGVyLkxpc3RlbmVyJykoUik7XHJcblxyXG4gIGNsYXNzIEV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgbGlzdGVuVG8ocm9vbSwgaGFuZGxlcikge1xyXG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IExpc3RlbmVyKHsgcm9vbSwgaGFuZGxlciB9KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBjcmVhdGVkUm9vbTogbGlzdGVuZXIuYWRkVG8odGhpcy5saXN0ZW5lcnMpLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVubGlzdGVuRnJvbShsaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihMaXN0ZW5lcikpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgIGRlbGV0ZWRSb29tOiBsaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaCgoaSkgPT5cclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tpXSkuZm9yRWFjaCgoaikgPT5cclxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2ldW2pdLnJlbW92ZUZyb20odGhpcy5saXN0ZW5lcnMpXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgbGlzdGVuZXJzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIsIHsgTGlzdGVuZXIgfSk7XHJcblxyXG4gIGNvbnN0IE1lbW9yeUV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vUi5FdmVudEVtaXR0ZXIuTWVtb3J5RXZlbnRFbWl0dGVyJykoUiwgRXZlbnRFbWl0dGVyKTtcclxuICBjb25zdCBVcGxpbmtFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL1IuRXZlbnRFbWl0dGVyLk1lbW9yeUV2ZW50RW1pdHRlcicpKFIsIEV2ZW50RW1pdHRlcik7XHJcblxyXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlciwgeyBNZW1vcnlFdmVudEVtaXR0ZXIsIFVwbGlua0V2ZW50RW1pdHRlciB9KTtcclxuXHJcbiAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9