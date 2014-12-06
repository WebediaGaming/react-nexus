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

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R, EventEmitter) {
  var MemoryEventEmitter = (function (EventEmitter) {
    var MemoryEventEmitter = function MemoryEventEmitter() {
      EventEmitter.call(this);
    };

    _extends(MemoryEventEmitter, EventEmitter);

    MemoryEventEmitter.prototype.emit = function (room, params) {
      var _this = this;
      if (params === undefined) params = {};
      if (this.listeners[room]) {
        Object.keys(this.listeners[room]).forEach(function (key) {
          return _this.listeners[room][key].emit(params);
        });
      }
    };

    return MemoryEventEmitter;
  })(EventEmitter);

  return MemoryEventEmitter;
};