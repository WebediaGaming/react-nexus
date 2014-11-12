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

  var Listener = (function () {
    var Listener = function Listener(event, handler) {
      _.dev(function () {
        return event.should.be.a.String && handler.should.be.a.Function;
      });
      this.event = event;
      this.handler = handler;
      this.id = _.uniqueId("Listener");
    };

    _classProps(Listener, null, {
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

    return Listener;
  })();

  _.extend(Listener.prototype, {
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
          var listener = new Listener(event, handler);
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
    Listener: Listener,
    MemoryEventEmitter: MemoryEventEmitter,
    UplinkEventEmitter: UplinkEventEmitter });

  return EventEmitter;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsUUFBUTtRQUFSLFFBQVEsR0FDRCxTQURQLFFBQVEsQ0FDQSxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQzFCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDbEM7O2dCQVJHLFFBQVE7QUFVWixXQUFLOztlQUFBLFVBQUMsU0FBUyxFQUFFOzs7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzNDLGNBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLHFCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVB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LEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUssZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUMzRSxjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7OztXQXRDRyxrQkFBa0I7S0FBUyxZQUFZOzs7O0FBeUM3QyxHQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRTtBQUNyQyxVQUFNLEVBQUUsSUFBSTtBQUNaLG1CQUFlLEVBQUUsSUFBSSxFQUN0QixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7QUFDckIsWUFBUSxFQUFSLFFBQVE7QUFDUixzQkFBa0IsRUFBbEIsa0JBQWtCO0FBQ2xCLHNCQUFrQixFQUFsQixrQkFBa0IsRUFDbkIsQ0FBQyxDQUFDOztBQUVILFNBQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIExpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50LCBoYW5kbGVyKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50LnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xyXG4gICAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xyXG4gICAgICB0aGlzLmlkID0gXy51bmlxdWVJZCgnTGlzdGVuZXInKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUbyhsaXN0ZW5lcnMpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICBpZighbGlzdGVuZXJzW3RoaXMuYWN0aW9uXSkge1xyXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSA9IHRoaXM7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRnJvbShsaXN0ZW5lcnMpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdO1xyXG4gICAgICBpZihPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkZWxldGUgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZW1pdChwYXJhbXMgPSB7fSkge1xyXG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChMaXN0ZW5lci5wcm90b3R5cGUsIHtcclxuICAgIGV2ZW50OiBudWxsLFxyXG4gICAgaWQ6IG51bGwsXHJcbiAgICBoYW5kbGVyOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBjbGFzcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IGxpc3RlbmVyID0gbmV3IExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsaXN0ZW5lcixcclxuICAgICAgICBjcmVhdGVkRXZlbnQ6IGxpc3RlbmVyLmFkZFRvKHRoaXMubGlzdGVuZXJzKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxpc3RlbmVyLFxyXG4gICAgICAgIGRlbGV0ZWRFdmVudDogbGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLmxpc3RlbmVycyksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goKGkpID0+XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnNbaV0pLmZvckVhY2goKGopID0+XHJcbiAgICAgICAgICB0aGlzLmxpc3RlbmVyc1tpXVtqXS5yZW1vdmVGcm9tKHRoaXMubGlzdGVuZXJzKVxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcclxuICAgIGxpc3RlbmVyczogbnVsbCxcclxuICAgIGRpc3BsYXlOYW1lOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBjbGFzcyBNZW1vcnlFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdNZW1vcnlFdmVudEVtaXR0ZXInO1xyXG4gICAgfVxyXG5cclxuICAgIGVtaXQoZXZlbnQsIHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIGlmKHRoaXMubGlzdGVuZXJzW2V2ZW50XSkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW2V2ZW50XSkuZm9yRWFjaCgoa2V5KSA9PlxyXG4gICAgICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdW2tleV0uZW1pdChwYXJhbXMpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgVXBsaW5rRXZlbnRFbWl0dGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnNob3VsZC5iZS5pbnN0YW5jZU9mKFIuVXBsaW5rKSk7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMudXBsaW5rID0gdXBsaW5rO1xyXG4gICAgICB0aGlzLnVwbGlua0xpc3RlbmVycyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICByZXR1cm4gJ1VwbGlua0V2ZW50RW1pdHRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IHsgbGlzdGVuZXIsIGNyZWF0ZWRFdmVudCB9ID0gc3VwZXIuYWRkTGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xyXG4gICAgICBpZihjcmVhdGVkRXZlbnQpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnVwbGlua0xpc3RlbmVyc1tldmVudF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdID0gdGhpcy51cGxpbmsubGlzdGVuVG8oZXZlbnQsIChwYXJhbXMpID0+IHRoaXMuX2VtaXQoZXZlbnQsIHBhcmFtcykpO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQuYmUub2spO1xyXG4gICAgICByZXR1cm4geyBsaXN0ZW5lciwgY3JlYXRlZEV2ZW50IH07XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpIHtcclxuICAgICAgbGV0IHsgZGVsZXRlZEV2ZW50IH0gPSBzdXBlci5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICAgIGlmKGRlbGV0ZWRFdmVudCkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgIHRoaXMudXBsaW5rLnVubGlzdGVuRnJvbShldmVudCwgdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdKTtcclxuICAgICAgICBkZWxldGUgdGhpcy51cGxpbmtMaXN0ZW5lcnNbZXZlbnRdO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMudXBsaW5rTGlzdGVuZXJzW2V2ZW50XS5zaG91bGQubm90LmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHsgbGlzdGVuZXIsIGRlbGV0ZWRFdmVudCB9O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgXy5kZXYoKCkgPT4gT2JqZWN0LmtleXModGhpcy51cGxpbmtMaXN0ZW5lcnMpLmxlbmd0aC5zaG91bGQuYmUuZXhhY3RseSgwKSk7XHJcbiAgICAgIHRoaXMudXBsaW5rTGlzdGVuZXJzID0gbnVsbDtcclxuICAgICAgdGhpcy51cGxpbmsgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoVXBsaW5rRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG4gICAgdXBsaW5rOiBudWxsLFxyXG4gICAgdXBsaW5rTGlzdGVuZXJzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBfLmV4dGVuZChFdmVudEVtaXR0ZXIsIHtcclxuICAgIExpc3RlbmVyLFxyXG4gICAgTWVtb3J5RXZlbnRFbWl0dGVyLFxyXG4gICAgVXBsaW5rRXZlbnRFbWl0dGVyLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=