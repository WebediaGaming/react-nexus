"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

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
  var _MemoryEventEmitter = (function (EventEmitter) {
    var _MemoryEventEmitter = function _MemoryEventEmitter() {
      EventEmitter.call(this);
    };

    _extends(_MemoryEventEmitter, EventEmitter);

    _classProps(_MemoryEventEmitter, null, {
      emit: {
        writable: true,
        value: function (room, params) {
          var _this = this;
          if (params === undefined) params = {};
          if (this.listeners[room]) {
            Object.keys(this.listeners[room]).forEach(function (key) {
              return _this.listeners[room][key].emit(params);
            });
          }
        }
      }
    });

    return _MemoryEventEmitter;
  })(EventEmitter);

  return _MemoryEventEmitter;
};