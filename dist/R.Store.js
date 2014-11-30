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
          // Nullify references
          this._cache = null;
          this._destroyed = true;
        }
      },
      pull: {
        writable: true,
        value: function (path, opts) {
          if (opts === undefined) opts = {};
          var bypassCache = opts.bypassCache;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.an.Object;
          });
          if (bypassCache || !this._cache[path]) {
            this._cache[path] = this.fetch(path);
          }
          return this._cache[path];
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
          var preventDecoding = _ref3.preventDecoding;
          this._shouldNotBeDestroyed();
          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          _.extend(this, { _cache: unserializable });
          return this;
        }
      },
      propagateUpdate: {
        writable: true,
        value: function (path, value) {
          var _this2 = this;
          this._shouldNotBeDestroyed();
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this2.subscriptions[path][key].update(value);
            });
          }
          return value;
        }
      },
      getCachedValue: {
        writable: true,
        value: function (path) {
          var _this3 = this;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && _.has(_this3._cache, path).should.be.ok && _this3._cache[path].isFulfilled().should.be.ok;
          });
          return this._cache[path].value();
        }
      },
      hasCachedValue: {
        writable: true,
        value: function (path) {
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String;
          });
          return _.has(this._cache, path);
        }
      },
      _shouldNotBeDestroyed: {
        writable: true,
        value: function () {
          var _this4 = this;
          _.dev(function () {
            return _this4._destroyed.should.not.be.ok;
          });
        }
      }
    });

    return _Store;
  })();

  _.extend(_Store.prototype, {
    _cache: null,
    _destroyed: null,
    subscriptions: null });

  _.extend(_Store, { Subscription: Subscription });
  var MemoryStore = require("./R.Store.MemoryStore")(R, _Store);
  var HTTPStore = require("./R.Store.HTTPStore")(R, _Store);
  var UplinkStore = require("./R.Store.UplinkStore")(R, _Store);

  _.extend(_Store, { MemoryStore: MemoryStore, HTTPStore: HTTPStore, UplinkStore: UplinkStore });

  return _Store;
};