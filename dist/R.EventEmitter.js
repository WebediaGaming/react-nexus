"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var Listener = require("./R.EventEmitter.Listener")(R);

  var EventEmitter = (function () {
    var EventEmitter = function EventEmitter() {
      this.listeners = {};
    };

    EventEmitter.prototype.getDisplayName = function () {
      _.abstract();
    };

    EventEmitter.prototype.listenTo = function (room, handler) {
      _.dev(function () {
        return room.should.be.a.String && handler.should.be.a.Function;
      });
      var listener = new Listener({ room: room, handler: handler });
      return {
        listener: listener,
        createdRoom: listener.addTo(this.listeners) };
    };

    EventEmitter.prototype.unlistenFrom = function (listener) {
      _.dev(function () {
        return listener.should.be.an.instanceOf(Listener);
      });
      return {
        listener: listener,
        deletedRoom: listener.removeFrom(this.listeners) };
    };

    EventEmitter.prototype.destroy = function () {
      var _this = this;
      Object.keys(this.listeners).forEach(function (i) {
        return Object.keys(_this.listeners[i]).forEach(function (j) {
          return _this.listeners[i][j].removeFrom(_this.listeners);
        });
      });
      // Nullify references
      this.listeners = null;
    };

    return EventEmitter;
  })();

  _.extend(EventEmitter.prototype, {
    listeners: null });

  _.extend(EventEmitter, { Listener: Listener });

  var MemoryEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);
  var UplinkEventEmitter = require("./R.EventEmitter.MemoryEventEmitter")(R, EventEmitter);

  _.extend(EventEmitter, { MemoryEventEmitter: MemoryEventEmitter, UplinkEventEmitter: UplinkEventEmitter });

  return EventEmitter;
};