"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var Subscription = require("./R.Store.Subscription")(R);

  var _Store = (function () {
    var _Store = function _Store() {
      this._destroyed = false;
      this._cache = {};
      this._pending = {};
      this.subscriptions = {};
    };

    _classProps(_Store, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          this._shouldNotBeDestroyed();
          // Explicitly nullify the cache
          Object.keys(this._cache).forEach(function (path) {
            return _this._cache[path] = null;
          });
          Object.keys(this._pending).forEach(function (path) {
            _this._pending[path].cancel(new Error("R.Store destroy"));
            _this._pending[path] = null;
          });
          // Nullify references
          this._cache = null;
          this._pending = null;
          this._destroyed = true;
        }
      },
      pull: {
        writable: true,
        value: function (path, opts) {
          var _this2 = this;
          if (opts === undefined) opts = {};
          var bypassCache = opts.bypassCache;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String;
          });
          if (bypassCache || !this._pending[path]) {
            this._pending[path] = this.fetch(path).then(function (value) {
              _.dev(function () {
                return (value === null || _.isObject(value)).should.be.ok;
              });
              _this2._cache[path] = value;
              return value;
            }).cancellable();
          }
          return this._pending[path];
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          _.abstract();
        }
      },
      subscribeTo: {
        writable: true,
        // jshint ignore:line

        value: function (path, handler) {
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && handler.should.be.a.Function;
          });
          var subscription = new Subscription({ path: path, handler: handler });
          var createdPath = subscription.addTo(this.subscriptions);
          this.pull(path).then(handler);
          return { subscription: subscription, createdPath: createdPath };
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (_ref) {
          var subscription = _ref.subscription;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return subscription.should.be.an.instanceOf(Subscription);
          });
          return {
            subscription: subscription,
            deletedPath: subscription.removeFrom(this.subscriptions) };
        }
      },
      serialize: {
        writable: true,
        value: function (_ref2) {
          var preventEncoding = _ref2.preventEncoding;
          this._shouldNotBeDestroyed();
          var serializable = _.extend({}, this._cache);
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, _ref3) {
          var _this3 = this;
          var preventDecoding = _ref3.preventDecoding;
          this._shouldNotBeDestroyed();
          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          Object.keys(unserializable).forEach(function (path) {
            _.dev(function () {
              return path.should.be.a.String && (unserializable[path] === null || _.isObject(unserializable[path])).should.be.ok;
            });
            _this3._cache[path] = unserializable[path];
            _this3._pending[path] = Promise.resolve(unserializable[path]).cancellable();
          });
          return this;
        }
      },
      propagateUpdate: {
        writable: true,
        value: function (path, value) {
          var _this4 = this;
          this._shouldNotBeDestroyed();
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this4.subscriptions[path][key].update(value);
            });
          }
          return value;
        }
      },
      getCachedValue: {
        writable: true,
        value: function (path) {
          var _this5 = this;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && (_this5._cache[path] !== void 0).should.be.ok;
          });
          return this._cache[path];
        }
      },
      hasCachedValue: {
        writable: true,
        value: function (path) {
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String;
          });
          return (this._cache[path] !== void 0);
        }
      },
      _shouldNotBeDestroyed: {
        writable: true,
        value: function () {
          var _this6 = this;
          _.dev(function () {
            return _this6._destroyed.should.not.be.ok;
          });
        }
      }
    });

    return _Store;
  })();

  _.extend(_Store.prototype, {
    _cache: null,
    _pending: null,
    _destroyed: null,
    subscriptions: null });

  _.extend(_Store, { Subscription: Subscription });
  var MemoryStore = require("./R.Store.MemoryStore")(R, _Store);
  var HTTPStore = require("./R.Store.HTTPStore")(R, _Store);
  var UplinkStore = require("./R.Store.UplinkStore")(R, _Store);

  _.extend(_Store, { MemoryStore: MemoryStore, HTTPStore: HTTPStore, UplinkStore: UplinkStore });

  return _Store;
};