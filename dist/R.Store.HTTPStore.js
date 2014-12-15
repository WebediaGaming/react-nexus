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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(fetch) {
      _.dev(function () {
        return fetch.should.be.a.Function;
      });
      Store.call(this);
      this._fetch = fetch;
      this._pending = {};
    };

    _extends(HTTPStore, Store);

    HTTPStore.prototype.getDisplayName = function () {
      return "HTTPStore";
    };

    HTTPStore.prototype.destroy = function () {
      var _this = this;
      Store.prototype.destroy.call(this);
      // Explicitly nullify pendings
      Object.keys(this._pending).forEach(function (path) {
        _this._pending[path].cancel(new Error("HTTPStore destroy"));
        _this._pending[path] = null;
      });
      // Nullify references
      this._pending = null;
      this._fetch = null;
    };

    HTTPStore.prototype.fetch = function (path) {
      var _this2 = this;
      this._shouldNotBeDestroyed();
      _.dev(function () {
        return path.should.be.a.String;
      });
      if (!this._pending[path]) {
        this._pending[path] = this._fetch.fetch(path).cancellable();
        _.dev(function () {
          return _this2._pending[path].then.should.be.a.Function;
        });
      }
      return this._pending[path];
    };

    return HTTPStore;
  })(Store);

  _.extend(HTTPStore.prototype, {
    _fetch: null,
    _pending: null });

  return HTTPStore;
};