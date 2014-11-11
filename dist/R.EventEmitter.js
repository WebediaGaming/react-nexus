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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsYUFBYTtRQUFiLGFBQWEsR0FDTixTQURQLGFBQWEsQ0FDTCxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzFCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDdkM7O2dCQVJHLGFBQWE7QUFVakIsV0FBSzs7ZUFBQSxVQUFDLFNBQVMsRUFBRTs7O0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUMzQyxjQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMxQixxQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxF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QUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBSyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQzNFLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzVCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOzs7O1dBdENHLGtCQUFrQjtLQUFTLFlBQVk7Ozs7QUF5QzdDLEdBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0FBQ3JDLFVBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWUsRUFBRSxJQUFJLEVBQ3RCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtBQUNyQixzQkFBa0IsRUFBbEIsa0JBQWtCO0FBQ2xCLHNCQUFrQixFQUFsQixrQkFBa0IsRUFDbkIsQ0FBQyxDQUFDOztBQUVILFNBQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBFdmVudExpc3RlbmVyIHtcbiAgICBjb25zdHJ1Y3RvcihldmVudCwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICB0aGlzLmV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgdGhpcy5pZCA9IF8udW5pcXVlSWQoJ0V2ZW50TGlzdGVuZXInKTtcbiAgICB9XG5cbiAgICBhZGRUbyhsaXN0ZW5lcnMpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKCFsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKSB7XG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdID0gdGhpcztcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDE7XG4gICAgfVxuXG4gICAgcmVtb3ZlRnJvbShsaXN0ZW5lcnMpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXG4gICAgICApO1xuICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGVtaXQocGFyYW1zID0ge30pIHtcbiAgICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRXZlbnRMaXN0ZW5lci5wcm90b3R5cGUsIHtcbiAgICBldmVudDogbnVsbCxcbiAgICBpZDogbnVsbCxcbiAgICBoYW5kbGVyOiBudWxsLFxuICB9KTtcblxuICBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICBhZGRMaXN0ZW5lcihldmVudCwgaGFuZGxlcikge1xuICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGNyZWF0ZWRFdmVudDogbGlzdGVuZXIuYWRkVG8odGhpcy5saXN0ZW5lcnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGRlbGV0ZWRFdmVudDogbGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLmxpc3RlbmVycyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaCgoaSkgPT5cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnNbaV0pLmZvckVhY2goKGopID0+XG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbaV1bal0ucmVtb3ZlRnJvbSh0aGlzLmxpc3RlbmVycylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5saXN0ZW5lcnMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICBsaXN0ZW5lcnM6IG51bGwsXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXG4gIH0pO1xuXG4gIGNsYXNzIE1lbW9yeUV2ZW50RW1pdHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ01lbW9yeUV2ZW50RW1pdHRlcic7XG4gICAgfVxuXG4gICAgZW1pdChldmVudCwgcGFyYW1zID0ge30pIHtcbiAgICAgIGlmKHRoaXMubGlzdGVuZXJzW2V2ZW50XSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVyc1tldmVudF0pLmZvckVhY2goKGtleSkgPT5cbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudF1ba2V5XS5lbWl0KHBhcmFtcylcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGFzcyBVcGxpbmtFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuaW5zdGFuY2VPZihSLlVwbGluaykpO1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnVXBsaW5rRXZlbnRFbWl0dGVyJztcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihldmVudCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRFdmVudCB9ID0gc3VwZXIuYWRkTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgaWYoY3JlYXRlZEV2ZW50KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8oZXZlbnQsIChwYXJhbXMpID0+IHRoaXMuX2VtaXQoZXZlbnQsIHBhcmFtcykpO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgY3JlYXRlZEV2ZW50IH07XG4gICAgfVxuXG4gICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRFdmVudCB9ID0gc3VwZXIucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgaWYoZGVsZXRlZEV2ZW50KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLnVwbGluay51bmxpc3RlbkZyb20oZXZlbnQsIHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnVwbGlua0xpc3RlbmVyc1tldmVudF07XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tldmVudF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgZGVsZXRlZEV2ZW50IH07XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIF8uZGV2KCgpID0+IE9iamVjdC5rZXlzKHRoaXMudXBsaW5rTGlzdGVuZXJzKS5sZW5ndGguc2hvdWxkLmJlLmV4YWN0bHkoMCkpO1xuICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua0V2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgICB1cGxpbms6IG51bGwsXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIsIHtcbiAgICBNZW1vcnlFdmVudEVtaXR0ZXIsXG4gICAgVXBsaW5rRXZlbnRFbWl0dGVyLFxuICB9KTtcblxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==