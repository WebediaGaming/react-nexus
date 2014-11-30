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

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  function Plugin(opts) {
    if (opts === undefined) opts = {};
    // jshint ignore:line
    var _Fullscreen = (function (R) {
      var _Fullscreen = function _Fullscreen() {
        R.App.Plugin.apply(this, arguments);
      };

      _extends(_Fullscreen, R.App.Plugin);

      return _Fullscreen;
    })(R);

    return _Fullscreen;
  }

  return Plugin;
};