"use strict";

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

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;

  var EventListener = (function () {
    var EventListener = function EventListener(event, handler) {
      _.dev(function () {
        return event.should.be.a.String && handler.should.be.a.Function;
      });
      this.event = event;
      this.handler = handler;
      this.id = _.uniqueId("EventListener");
    };

    _classProps(EventListener, null, {
      addTo: {
        writable: true,
        value: function (listeners) {
          var _this = this;

          _.dev(function () {
            return listeners.should.be.an.Object;
          });
          if (!listeners[this.action]) {
            listeners[this.action] = {};
          }
          _.dev(function () {
            return listeners[_this.action].should.be.an.Object && listeners[_this.action][_this.id].should.not.be.ok;
          });
          listeners[this.action][this.id] = this;
          return Object.keys(listeners[this.action]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (listeners) {
          var _this2 = this;

          _.dev(function () {
            return listeners.should.be.an.Object && listeners[_this2.action].should.be.an.Object && listeners[_this2.action][_this2.id].should.be.exactly(_this2);
          });
          delete listeners[this.action][this.id];
          if (Object.keys(listeners[this.action]).length === 0) {
            delete listeners[this.action];
            return true;
          }
          return false;
        }
      },
      emit: {
        writable: true,
        value: function (params) {
          if (params === undefined) params = {};

          _.dev(function () {
            return params.should.be.an.Object;
          });
          this.handler.call(null, params);
        }
      }
    });

    return EventListener;
  })();

  _.extend(EventListener.prototype, {
    event: null,
    id: null,
    handler: null });

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
        value: function (event, handler) {
          var listener = new EventListener(event, handler);
          return {
            listener: listener,
            createdEvent: listener.addTo(this.listeners) };
        }
      },
      removeListener: {
        writable: true,
        value: function (listener) {
          return {
            listener: listener,
            deletedEvent: listener.removeFrom(this.listeners) };
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this3 = this;

          Object.keys(this.listeners).forEach(function (i) {
            return Object.keys(_this3.listeners[i]).forEach(function (j) {
              return _this3.listeners[i][j].removeFrom(_this3.listeners);
            });
          });
        }
      }
    });

    return EventEmitter;
  })();

  _.extend(EventEmitter.prototype, {
    listeners: null,
    displayName: null });

  var MemoryEventEmitter = (function (EventEmitter) {
    var MemoryEventEmitter = function MemoryEventEmitter(params) {
      if (params === undefined) params = {};

      EventEmitter.call(this);
    };

    _extends(MemoryEventEmitter, EventEmitter);

    _classProps(MemoryEventEmitter, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "MemoryEventEmitter";
        }
      },
      emit: {
        writable: true,
        value: function (event, params) {
          var _this4 = this;

          if (params === undefined) params = {};

          if (this.listeners[event]) {
            Object.keys(this.listeners[event]).forEach(function (key) {
              return _this4.listeners[event][key].emit(params);
            });
          }
        }
      }
    });

    return MemoryEventEmitter;
  })(EventEmitter);

  var UplinkEventEmitter = (function (EventEmitter) {
    var UplinkEventEmitter = function UplinkEventEmitter(_ref) {
      var uplink = _ref.uplink;

      _.dev(function () {
        return uplink.should.be.instanceOf(R.Uplink);
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
        value: function (event, handler) {
          var _this5 = this;
          var _ref2 = EventEmitter.prototype.addListener.call(this, event, handler);

          var listener = _ref2.listener;
          var createdEvent = _ref2.createdEvent;

          if (createdEvent) {
            _.dev(function () {
              return _this5.uplinkListeners[event].should.not.be.ok;
            });
            this.uplinkListeners[event] = this.uplink.listenTo(event, function (params) {
              return _this5._emit(event, params);
            });
          }
          _.dev(function () {
            return _this5.uplinkListeners[event].should.be.ok;
          });
          return { listener: listener, createdEvent: createdEvent };
        }
      },
      removeListener: {
        writable: true,
        value: function (listener) {
          var _this6 = this;
          var _ref3 = EventEmitter.prototype.removeListener.call(this, listener);

          var deletedEvent = _ref3.deletedEvent;

          if (deletedEvent) {
            _.dev(function () {
              return _this6.uplinkListeners[event].should.be.ok;
            });
            this.uplink.unlistenFrom(event, this.uplinkListeners[event]);
            delete this.uplinkListeners[event];
          }
          _.dev(function () {
            return _this6.uplinkListeners[event].should.not.be.ok;
          });
          return { listener: listener, deletedEvent: deletedEvent };
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this7 = this;

          EventEmitter.prototype.destroy.call(this);
          _.dev(function () {
            return Object.keys(_this7.uplinkListeners).length.should.be.exactly(0);
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

  _.extend(EventEmitter, {
    MemoryEventEmitter: MemoryEventEmitter,
    UplinkEventEmitter: UplinkEventEmitter });

  return EventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsYUFBYTtRQUFiLGFBQWEsR0FDTixTQURQLGFBQWEsQ0FDTCxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzFCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDdkM7O2dCQVJHLGFBQWE7QUFVakIsV0FBSzs7ZUFBQSxVQUFDLFNBQVMsRUFBRTs7O0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUMzQyxjQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMxQixxQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxF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QyxPQUFLLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDM0UsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7Ozs7V0F0Q0csa0JBQWtCO0tBQVMsWUFBWTs7OztBQXlDN0MsR0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7QUFDckMsVUFBTSxFQUFFLElBQUk7QUFDWixtQkFBZSxFQUFFLElBQUksRUFDdEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO0FBQ3JCLHNCQUFrQixFQUFsQixrQkFBa0I7QUFDbEIsc0JBQWtCLEVBQWxCLGtCQUFrQixFQUNuQixDQUFDLENBQUM7O0FBRUgsU0FBTyxZQUFZLENBQUM7Q0FDckIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIEV2ZW50TGlzdGVuZXIge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgICB0aGlzLmlkID0gXy51bmlxdWVJZCgnRXZlbnRMaXN0ZW5lcicpO1xuICAgIH1cblxuICAgIGFkZFRvKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIWxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pIHtcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXSA9IHt9O1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMTtcbiAgICB9XG5cbiAgICByZW1vdmVGcm9tKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcbiAgICAgICk7XG4gICAgICBkZWxldGUgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZW1pdChwYXJhbXMgPSB7fSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChFdmVudExpc3RlbmVyLnByb3RvdHlwZSwge1xuICAgIGV2ZW50OiBudWxsLFxuICAgIGlkOiBudWxsLFxuICAgIGhhbmRsZXI6IG51bGwsXG4gIH0pO1xuXG4gIGNsYXNzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIGFkZExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBsZXQgbGlzdGVuZXIgPSBuZXcgRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgY3JlYXRlZEV2ZW50OiBsaXN0ZW5lci5hZGRUbyh0aGlzLmxpc3RlbmVycyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgZGVsZXRlZEV2ZW50OiBsaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKChpKSA9PlxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tpXSkuZm9yRWFjaCgoaikgPT5cbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpXVtqXS5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICBsaXN0ZW5lcnM6IG51bGwsXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXG4gIH0pO1xuXG4gIGNsYXNzIE1lbW9yeUV2ZW50RW1pdHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ01lbW9yeUV2ZW50RW1pdHRlcic7XG4gICAgfVxuXG4gICAgZW1pdChldmVudCwgcGFyYW1zID0ge30pIHtcbiAgICAgIGlmKHRoaXMubGlzdGVuZXJzW2V2ZW50XSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tldmVudF0pLmZvckVhY2goKGtleSkgPT5cbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudF1ba2V5XS5lbWl0KHBhcmFtcylcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuaW5zdGFuY2VPZihSLlVwbGluaykpO1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnVXBsaW5rRXZlbnRFbWl0dGVyJztcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihldmVudCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRFdmVudCB9ID0gc3VwZXIuYWRkTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgaWYoY3JlYXRlZEV2ZW50KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8oZXZlbnQsIChwYXJhbXMpID0+IHRoaXMuX2VtaXQoZXZlbnQsIHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgY3JlYXRlZEV2ZW50IH07XG4gICAgfVxuXG4gICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRFdmVudCB9ID0gc3VwZXIucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgaWYoZGVsZXRlZEV2ZW50KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLnVwbGluay51bmxpc3RlbkZyb20oZXZlbnQsIHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tldmVudF07XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tldmVudF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZEV2ZW50IH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICB1cGxpbms6IG51bGwsXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIsIHtcbiAgICBNZW1vcnlFdmVudEVtaXR0ZXIsXG4gICAgVXBsaW5rRXZlbnRFbWl0dGVyLFxuICB9KTtcblxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==