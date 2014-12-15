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

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R, Store) {
  var _ = R._;

  var MemoryStore = (function (Store) {
    var MemoryStore = function MemoryStore() {
      Store.call(this);
      this._data = {};
    };

    _extends(MemoryStore, Store);

    MemoryStore.prototype.destroy = function () {
      var _this = this;
      Store.prototype.destroy.call(this);
      // Explicitly nullify data
      Object.keys(this._data).forEach(function (path) {
        return _this._data[path] = null;
      });
      // Nullify references
      this._data = null;
    };

    MemoryStore.prototype.fetch = function (path) {
      var _this2 = this;
      return Promise["try"](function () {
        _.dev(function () {
          return path.should.be.a.String;
        });
        _this2._shouldNotBeDestroyed();
        _.dev(function () {
          return _.has(_this2._data, path).should.be.ok;
        });
        return _this2._data[path];
      });
    };

    MemoryStore.prototype.set = function (path, value) {
      _.dev(function () {
        return path.should.be.a.String && (null === value || _.isObject(value)).should.be.ok;
      });
      this._shouldNotBeDestroyed();
      this._data[path] = value;
      this.propagateUpdate(path, value);
    };

    return MemoryStore;
  })(Store);

  _.extend(MemoryStore.prototype, {
    _data: null });

  return MemoryStore;
};