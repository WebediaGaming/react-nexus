"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
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