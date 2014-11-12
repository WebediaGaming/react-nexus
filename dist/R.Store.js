"use strict";

var _slice = Array.prototype.slice;
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
  var co = _.co;

  var Subscription = (function () {
    var Subscription = function Subscription(_ref) {
      var path = _ref.path;
      var handler = _ref.handler;

      _.dev(function () {
        return path.should.be.a.String && handler.should.be.a.Function;
      });
      var id = _.uniqueId(path);
      _.extend(this, { path: path, handler: handler, id: id });
    };

    _classProps(Subscription, null, {
      addTo: {
        writable: true,
        value: function (subscriptions) {
          var _this = this;

          _.dev(function () {
            return subscriptions.should.be.an.Object;
          });
          if (!subscriptions[this.path]) {
            subscriptions[this.path] = {};
          }
          _.dev(function () {
            return subscriptions[_this.path].should.be.an.Object && subscriptions[_this.path][_this.id].should.not.be.ok;
          });
          subscriptions[this.path][this.id] = this;
          return Object.keys(subscriptions[this.path]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (subscriptions) {
          var _this2 = this;

          _.dev(function () {
            return subscriptions.should.be.an.Object && subscriptions[_this2.path].shoulbe.be.an.Object && subscriptions[_this2.path][_this2.id].should.be.exactly(_this2);
          });
          delete subscriptions[this.path][this.id];
          if (Object.keys(subscriptions[this.path]).length === 0) {
            delete subscriptions[this.path];
            return true;
          }
          return false;
        }
      },
      update: {
        writable: true,
        value: function (value) {
          _.dev(function () {
            return (value === null || _.isObject(value)).should.be.ok;
          });
          this.handler.call(null, value);
        }
      }
    });

    return Subscription;
  })();

  _.extend(Subscription.prototype, {
    path: null,
    handler: null,
    id: null });

  var Store = (function () {
    var Store = function Store() {
      this._destroyed = false;
      this._cache = {};
      this.subscriptions = {};
    };

    _classProps(Store, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this3 = this;

          this._shouldNotBeDestroyed();
          // Explicitly nullify the cache
          Object.keys(this._cache).forEach(function (path) {
            return _this3._cache[path] = null;
          });
          // Nullify references
          this._cache = null;
          this._destroyed = true;
        }
      },
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
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
        value: function (path, handler) {
          this._shouldNotBeDestroyed();
          var subscription = new Subscription({ path: path, handler: handler });
          return {
            subscription: subscription,
            createdPath: subscription.addTo(this.subscriptions) };
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (_ref2) {
          var subscription = _ref2.subscription;

          this._shouldNotBeDestroyed();
          _.dev(function () {
            return subscription.should.be.an.instanceOf(Subscription);
          });
          return {
            subscriptions: subscriptions,
            deletedPath: subscriptions.removeFrom(this.subscriptions) };
        }
      },
      serialize: {
        writable: true,
        value: function (_ref3) {
          var preventEncoding = _ref3.preventEncoding;

          this._shouldNotBeDestroyed();
          var serializable = _.extend({}, this._cache);
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, _ref4) {
          var preventDecoding = _ref4.preventDecoding;

          this._shouldNotBeDestroyed();
          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          _.extend(this, { _cache: unserializable });
          return this;
        }
      },
      propagateUpdate: {
        writable: true,
        value: function (path, value) {
          var _this4 = this;

          this._shouldNotBeDestroyed();
          this._cache[path] = value;
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this4.subscriptions[path][key].update(value);
            });
          }
        }
      },
      getCachedValue: {
        writable: true,
        value: function (path) {
          var _this5 = this;

          this._shouldNotBeDestroyed();
          _.dev(function () {
            return _.has(_this5._cache, path).should.be.ok;
          });
          return this._cache[path];
        }
      },
      hasCachedValue: {
        writable: true,
        value: function (path) {
          this._shouldNotBeDestroyed();
          return _.has(this._cache, path);
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

    return Store;
  })();

  _.extend(Store.prototype, {
    _cache: null,
    _destroyed: null,
    subscriptions: null });

  var MemoryStore = (function (Store) {
    var MemoryStore = function MemoryStore() {
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
      this._data = {};
    };

    _extends(MemoryStore, Store);

    _classProps(MemoryStore, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this7 = this;

          Store.prototype.destroy.call(this);
          // Explicitly nullify data
          Object.keys(this._data).forEach(function (path) {
            return _this7._data[path] = null;
          });
          // Nullify references
          this._data = null;
        }
      },
      getDisplayName: {
        writable: true,
        value: function () {
          return "MemoryStore";
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          var _this8 = this;

          return Promise.try(function () {
            _.dev(function () {
              return _.has(_this8._data, path).should.be.ok;
            });
            return _this8._data[path];
          });
        }
      },
      set: {
        writable: true,
        value: function (path, value) {
          var _this9 = this;

          this._shouldNotBeDestroyed();
          this._data[path] = value;
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this9.subscriptions[path].update(value);
            });
          }
        }
      }
    });

    return MemoryStore;
  })(Store);

  _.extend(MemoryStore.prototype, {
    _data: null });

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(_ref5) {
      var http = _ref5.http;

      _.dev(function () {
        return http.shoud.be.an.Object && http.fetch.should.be.a.Function;
      });
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
      this._http = http;
    };

    _extends(HTTPStore, Store);

    _classProps(HTTPStore, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "HTTPStore";
        }
      }
    });

    return HTTPStore;
  })(Store);

  _.extend(HTTPStore.prototype, {
    _http: null });

  var UplinkStore = (function (Store) {
    var UplinkStore = function UplinkStore(_ref6) {
      var uplink = _ref6.uplink;

      _.dev(function () {
        return uplink.should.be.an.instanceOf(R.Uplink);
      });
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
      this._uplink = uplink;
    };

    _extends(UplinkStore, Store);

    _classProps(UplinkStore, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "UplinkStore";
        }
      }
    });

    return UplinkStore;
  })(Store);

  _.extend(UplinkStore.prototype, {
    _uplink: null });

  _.extend(Store, { MemoryStore: MemoryStore, HTTPStore: HTTPStore, UplinkStore: UplinkStore });

  return Store;
};

//  /**
//   * <p> Implementation of R.Store using a remote, HTTP passive Store. The store is read-only from the components, <br />
//   * as well as from the Client in general. However, its values may be updated across refreshes/reloads, but the remote <br />
//   * backend should be wired-up with R.Dispatcher.HTTPDispatcher to implement a second-class over-the-wire Flux. </p>
//   */
//   createHTTPStore: function createHTTPStore() {
//    return function HTTPStore(http) {
//      R.Debug.dev(function() {
//        assert(http.fetch && _.isFunction(http.fetch), 'R.Store.createHTTPStore(...).http.fetch: expecting Function.');
//      });
//      var _fetch = http.fetch;
//      var _destroyed = false;
//      var data = {};
//      var subscribers = {};
//      var fetch = function* fetch(key) {
//        var val = yield _fetch(key);
//        if(!_destroyed) {
//          data[key] = val;
//          return val;
//        }
//        else {
//          throw new Error('R.Store.HTTPStore.fetch(...): instance destroyed.');
//        }
//      };

//      var get = function get(key) {
//        if(!_.has(data, key)) {
//          console.warn('R.Store.MemoryStore.get(...): data not available. ('' + key + '')');
//        }
//        return data[key];
//      };

//      var sub = function sub(key) {
//        var subscription = new R.Store.Subscription(key);
//        if(!_.has(subscribers, key)) {
//          subscribers[key] = {};
//        }
//        subscribers[key][subscription.uniqueId] = subscription;
//        return subscription;
//      };

//      var unsub = function unsub(subscription) {
//        R.Debug.dev(function() {
//          assert(!_destroyed, 'R.Store.UplinkStore.unsub(...): instance destroyed.');
//          assert(subscription instanceof R.Store.Subscription, 'R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.');
//          assert(_.has(subscribers, subscription.key), 'R.Store.UplinkStore.unsub(...): no subscribers for this key. ('' + subscription.key + '')');
//          assert(_.has(subscribers[subscription.key], subscription.uniqueId), 'R.Store.UplinkStore.unsub(...): no such subscription. ('' + subscription.key + '', '' + subscription.uniqueId + '')');
//        });
//        delete subscribers[subscription.key][subscription.uniqueId];
//        if(_.size(subscribers[subscription.key]) === 0) {
//          delete subscribers[subscription.key];
//          if(_.has(data, subscription.key)) {
//            delete data[subscription.key];
//          }
//        }
//      };

//      var serialize = function serialize() {
//        return JSON.stringify(data);
//      };

//      var unserialize = function unserialize(str) {
//        _.extend(data, JSON.parse(str));
//      };

//      var destroy = function destroy() {
//        R.Debug.dev(function() {
//          assert(!_destroyed, 'R.Store.UplinkStore.destroy(...): instance destroyed.');
//        });
//        _.each(subscribers, function(keySubscribers, key) {
//          _.each(subscribers[key], unsub);
//        });
//        _.each(data, function(val, key) {
//          delete data[key];
//        });
//        data = null;
//        subscribers = null;
//        _destroyed = true;
//      };

//      return new (R.Store.createStore({
//        displayName: 'HTTPStore',
//        _data: data,
//        _subscribers: subscribers,
//        fetch: fetch,
//        get: get,
//        sub: sub,
//        unsub: unsub,
//        serialize: serialize,
//        unserialize: unserialize,
//        destroy: destroy,
//      }))();
//    };
//  },
//  /**
//   * <p>Implementation of R.Store using a remote, REST-like Store. The store is read-only from the components, <br />
//   * as well as from the Client in general, but the remote backend should be wired-up with R.Dispatcher.UplinkDispatcher to
//   * implement the over-the-wire Flux. </p>
//   * @class R.Store.UplinkStore
//   * @implements {R.Store}
//   */
//   createUplinkStore: function createUplinkStore() {
//    return function UplinkStore(uplink) {
//      R.Debug.dev(function() {
//        assert(uplink.fetch && _.isFunction(uplink.fetch), 'R.Store.createUplinkStore(...).uplink.fetch: expecting Function.');
//        assert(uplink.subscribeTo && _.isFunction(uplink.subscribeTo), 'R.Store.createUplinkStore(...).uplink.subscribeTo: expecting Function.');
//        assert(uplink.unsubscribeFrom && _.isFunction(uplink.unsubscribeFrom), 'R.Store.createUplinkStore(...).uplink.unsubscribeFrom: expecting Function.');
//      });
//      var _fetch = uplink.fetch;
//      var subscribeTo = uplink.subscribeTo;
//      var unsubscribeFrom = uplink.unsubscribeFrom;
//      _destroyed = false;
//      var data = {};
//      var subscribers = {};
//      var updaters = {};

//          /**
//          * <p>Fetch data according to a key</p>
//          * @method fetch
//          * @param {string} key The key
//          * @return {Function} fn the yielded fonction
//          */
//          var fetch = function* fetch(key) {
//            var val = yield _fetch(key);
//            if(!_destroyed) {
//              data[key] = val;
//              return val;
//            }
//            else {
//              throw new Error('R.Store.UplinkStore.fetch(...): instance destroyed.');
//            }
//          };
//          var get = function get(key) {
//            R.Debug.dev(function() {
//              if(!_.has(data, key)) {
//                console.warn('R.Store.UplinkStore.get(...): data not available. ('' + key + '')');
//              }
//            });
//            return data[key];
//          };
//          /**
//          * <p>Triggered by the socket.on('update') event in R.Uplink <br />
//          * Fetch data according to the given key <br />
//          * Call the saved function contained in subscribers </p>
//          * @method signalUpdate
//          * @param {string} key The key to fetch
//          */
//          var signalUpdate = function signalUpdate(key, val) {
//            if(!_.has(subscribers, key)) {
//              return;
//            }
//            _.each(subscribers[key], function(fn, uniqueId) {
//              if(fn) {
//                fn(val);
//              }
//            });
//          };
//         /**
//          * <p> Subscribe at a specific key </p>
//          * @method sub
//          * @param {string} key The specific key to subscribe
//          * @param {function} _signalUpdate the function that will be call when a data corresponding to a key will be updated
//          * @return {Object} subscription The saved subscription
//          */
//          var sub = function sub(key, _signalUpdate) {
//            R.Debug.dev(function() {
//              assert(!_destroyed, 'R.Store.UplinkStore.sub(...): instance destroyed. ('' + key + '')');
//            });
//            var subscription = new R.Store.Subscription(key);
//            if(!_.has(subscribers, key)) {
//              subscribers[key] = {};
//                  // call subscribeTo from R.Uplink => emit 'subscribeTo' signal
//                  updaters[key] = subscribeTo(key, signalUpdate);
//                }
//                subscribers[key][subscription.uniqueId] = _signalUpdate;
//                co(function*() {
//                  var val = yield fetch(key);
//                  _.defer(function() {
//                    _signalUpdate(val);
//                  });
//                }).call(this, R.Debug.rethrow('R.Store.sub.fetch(...): data not available. ('' + key + '')'));
//                return subscription;
//              };
//          /**
//          * <p> Unsubscribe</p>
//          * @method unsub
//          * @param {object} subscription The subscription that contains the key to unsuscribe
//          */
//          var unsub = function unsub(subscription) {
//            R.Debug.dev(function() {
//              assert(!_destroyed, 'R.Store.UplinkStore.unsub(...): instance destroyed.');
//              assert(subscription instanceof R.Store.Subscription, 'R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.');
//              assert(_.has(subscribers, subscription.key), 'R.Store.UplinkStore.unsub(...): no subscribers for this key. ('' + subscription.key + '')');
//              assert(_.has(subscribers[subscription.key], subscription.uniqueId), 'R.Store.UplinkStore.unsub(...): no such subscription. ('' + subscription.key + '', '' + subscription.uniqueId + '')');
//            });
//            delete subscribers[subscription.key][subscription.uniqueId];
//            if(_.size(subscribers[subscription.key]) === 0) {
//              unsubscribeFrom(subscription.key, updaters[subscription.key]);
//              delete subscribers[subscription.key];
//              delete updaters[subscription.key];
//              if(_.has(data, subscription.key)) {
//                delete data[subscription.key];
//              }
//            }
//          };

//          /**
//          * <p> Serialize the UplinkStore store </p>
//          * @method serialize
//          * @return {string} data The serialized UplinkStore store
//          */
//          var serialize = function serialize() {
//            return JSON.stringify(data);
//          };

//          /**
//          * <p> Unserialize the UplinkStore store </p>
//          * @method unserialize
//          * @param {string} str The string to unserialise
//          */
//          var unserialize = function unserialize(str) {
//            _.extend(data, JSON.parse(str));
//          };

//          /**
//          * <p> Clean UplinkStore store </p>
//          * @method destroy
//          */
//          var destroy = function destroy() {
//            R.Debug.dev(function() {
//              assert(!_destroyed, 'R.Store.UplinkStore.destroy(...): instance destroyed.');
//            });
//            _.each(subscribers, function(keySubscribers, key) {
//              _.each(subscribers[key], unsub);
//            });
//            _.each(data, function(val, key) {
//              delete data[key];
//            });
//            data = null;
//            subscribers = null;
//            updaters = null;
//            _destroyed = true;
//          };
//          return new (R.Store.createStore({
//            displayName: 'UplinkStore',
//            _data: data,
//            _subscribers: subscribers,
//            _updaters: updaters,
//            fetch: fetch,
//            get: get,
//            sub: sub,
//            unsub: unsub,
//            signalUpdate: signalUpdate,
//            serialize: serialize,
//            unserialize: unserialize,
//            destroy: destroy,
//          }))();
//        };
//      },
//    };

//    _.extend(Store.Subscription.prototype, /** @lends R.Store.Subscription */{
//  /**
//   * @public
//   * @readOnly
//   * @type {String}
//   */
//   uniqueId: null,
//  /**
//   * @public
//   * @readOnly
//   * @type {String}
//   */
//   key: null,
// });

//    return Store;
//  };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDOztNQUVWLFlBQVk7UUFBWixZQUFZLEdBQ0wsU0FEUCxZQUFZLE9BQ2U7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTzs7QUFDekIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDN0IsQ0FBQztBQUNGLFVBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsT0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxFQUFGLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDdkM7O2dCQVBHLFlBQVk7QUFTaEIsV0FBSzs7ZUFBQSxVQUFDLGFBQWEsRUFBRTs7O0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDL0MsY0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUIseUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQy9CO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxhQUFhLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3RELGFBQWEsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRix1QkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pDLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDM0Q7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxhQUFhLEVBQUU7OztBQUN4QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0MsYUFBYSxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQzFELENBQUM7QUFDRixpQkFBTyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckQsbUJBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGlCQUFPLEtBQUssQ0FBQztTQUNkOztBQUVELFlBQU07O2VBQUEsVUFBQyxLQUFLLEVBQUU7QUFDWixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ2hFLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoQzs7OztXQXJDRyxZQUFZOzs7OztBQXdDbEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQy9CLFFBQUksRUFBRSxJQUFJO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixNQUFFLEVBQUUsSUFBSSxFQUNULENBQUMsQ0FBQzs7TUFFRyxLQUFLO1FBQUwsS0FBSyxHQUNFLFNBRFAsS0FBSyxHQUNLO0FBQ1osVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDekI7O2dCQUxHLEtBQUs7QUFPVCxhQUFPOztlQUFBLFlBQUc7OztBQUNSLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztBQUU3QixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxPQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUVyRSxjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4Qjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWxDLFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFN0IsaUJBQVc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RCxpQkFBTztBQUNMLHdCQUFZLEVBQVosWUFBWTtBQUNaLHVCQUFXLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQ3BELENBQUM7U0FDSDs7QUFFRCxxQkFBZTs7ZUFBQSxpQkFBbUI7Y0FBaEIsWUFBWSxTQUFaLFlBQVk7O0FBQzVCLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDaEUsaUJBQU87QUFDTCx5QkFBYSxFQUFiLGFBQWE7QUFDYix1QkFBVyxFQUFFLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUMxRCxDQUFDO1NBQ0g7O0FBRUQsZUFBUzs7ZUFBQSxpQkFBc0I7Y0FBbkIsZUFBZSxTQUFmLGVBQWU7O0FBQ3pCLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxpQkFBTyxlQUFlLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ3RGOztBQUVELGlCQUFXOztlQUFBLFVBQUMsVUFBVSxTQUF1QjtjQUFuQixlQUFlLFNBQWYsZUFBZTs7QUFDdkMsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsY0FBSSxjQUFjLEdBQUcsZUFBZSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUMzRixXQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELHFCQUFlOztlQUFBLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTs7O0FBQzNCLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzFCLGNBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQixrQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3BDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7cUJBQUssT0FBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUFBLENBQUMsQ0FBQztXQUNoRTtTQUNGOztBQUVELG9CQUFjOztlQUFBLFVBQUMsSUFBSSxFQUFFOzs7QUFDbkIsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUssTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNuRCxpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCOztBQUVELG9CQUFjOztlQUFBLFVBQUMsSUFBSSxFQUFFO0FBQ25CLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGlCQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqQzs7QUFFRCwyQkFBcUI7O2VBQUEsWUFBRzs7O0FBQ3RCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztTQUMvQzs7OztXQXpFRyxLQUFLOzs7OztBQTRFWCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDeEIsVUFBTSxFQUFFLElBQUk7QUFDWixjQUFVLEVBQUUsSUFBSTtBQUNoQixpQkFBYSxFQUFFLElBQUksRUFDcEIsQ0FBQyxDQUFDOztNQUVHLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsR0FDRDtBQURVLEFBRXRCLFdBRjJCLFlBQUwsS0FBSyw0QkFFbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDakI7O2FBSkcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBTWYsYUFBTzs7ZUFBQSxZQUFHOzs7QUFOYyxBQU90QixlQVAyQixXQU9yQixZQUFPLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsVUFBQyxJQUFJO21CQUFLLE9BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7V0FBQSxDQUFDLENBQUM7O0FBRTVDLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25COztBQUVELG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxhQUFhLENBQUM7U0FDdEI7O0FBRUQsV0FBSzs7ZUFBQSxVQUFDLElBQUksRUFBRTs7O0FBQ1YsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3ZCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDbEQsbUJBQU8sT0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDekIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsU0FBRzs7ZUFBQSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7OztBQUNmLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLGNBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMzQixrQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3BDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7cUJBQUssT0FBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUFBLENBQUMsQ0FBQztXQUMzRDtTQUNGOzs7O1dBakNHLFdBQVc7S0FBUyxLQUFLOzs7O0FBb0MvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsU0FBSyxFQUFFLElBQUksRUFDWixDQUFDLENBQUM7O01BRUcsU0FBUyxjQUFTLEtBQUs7UUFBdkIsU0FBUyxHQUNGLFNBRFAsU0FBUyxRQUNTO1VBQVIsSUFBSSxTQUFKLElBQUk7O0FBQ2hCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUNoQyxDQUFDO0FBSmtCLEFBS3BCLFdBTHlCLFlBQUwsS0FBSyw0QkFLaEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDbkI7O2FBUEcsU0FBUyxFQUFTLEtBQUs7O2dCQUF2QixTQUFTO0FBU2Isb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLFdBQVcsQ0FBQztTQUNwQjs7OztXQVhHLFNBQVM7S0FBUyxLQUFLOzs7O0FBYzdCLEdBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtBQUM1QixTQUFLLEVBQUUsSUFBSSxFQUNaLENBQUMsQ0FBQzs7TUFFRyxXQUFXLGNBQVMsS0FBSztRQUF6QixXQUFXLEdBQ0osU0FEUCxXQUFXLFFBQ1M7VUFBVixNQUFNLFNBQU4sTUFBTTs7QUFDbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUZoQyxBQUd0QixXQUgyQixZQUFMLEtBQUssNEJBR2xCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQ3ZCOzthQUxHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQU9mLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxhQUFhLENBQUM7U0FDdEI7Ozs7V0FURyxXQUFXO0tBQVMsS0FBSzs7OztBQVkvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDLENBQUM7O0FBRXpELFNBQU8sS0FBSyxDQUFDO0NBRWQsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IGNvID0gXy5jbztcblxuICBjbGFzcyBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHsgcGF0aCwgaGFuZGxlciB9KSB7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IGlkID0gXy51bmlxdWVJZChwYXRoKTtcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgcGF0aCwgaGFuZGxlciwgaWQgfSk7XG4gICAgfVxuXG4gICAgYWRkVG8oc3Vic2NyaXB0aW9ucykge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKCFzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0pIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdID0ge307XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXSA9IHRoaXM7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdKS5sZW5ndGggPT09IDE7XG4gICAgfVxuXG4gICAgcmVtb3ZlRnJvbShzdWJzY3JpcHRpb25zKSB7XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsYmUuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXS5zaG91bGQuYmUuZXhhY3RseSh0aGlzKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB1cGRhdGUodmFsdWUpIHtcbiAgICAgIF8uZGV2KCgpID0+ICh2YWx1ZSA9PT0gbnVsbCB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rKTtcbiAgICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChTdWJzY3JpcHRpb24ucHJvdG90eXBlLCB7XG4gICAgcGF0aDogbnVsbCxcbiAgICBoYW5kbGVyOiBudWxsLFxuICAgIGlkOiBudWxsLFxuICB9KTtcblxuICBjbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB0aGUgY2FjaGVcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlKS5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9jYWNoZVtwYXRoXSA9IG51bGwpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9jYWNoZSA9IG51bGw7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIGZldGNoKHBhdGgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICBzdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oeyBwYXRoLCBoYW5kbGVyIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uLFxuICAgICAgICBjcmVhdGVkUGF0aDogc3Vic2NyaXB0aW9uLmFkZFRvKHRoaXMuc3Vic2NyaXB0aW9ucyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFN1YnNjcmlwdGlvbikpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucyxcbiAgICAgICAgZGVsZXRlZFBhdGg6IHN1YnNjcmlwdGlvbnMucmVtb3ZlRnJvbSh0aGlzLnN1YnNjcmlwdGlvbnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXJpYWxpemUoeyBwcmV2ZW50RW5jb2RpbmcgfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5fY2FjaGUpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IF9jYWNoZTogdW5zZXJpYWxpemFibGUgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICB0aGlzLl9jYWNoZVtwYXRoXSA9IHZhbHVlO1xuICAgICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSlcbiAgICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdW2tleV0udXBkYXRlKHZhbHVlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IF8uaGFzKHRoaXMuX2NhY2hlLCBwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW3BhdGhdO1xuICAgIH1cblxuICAgIGhhc0NhY2hlZFZhbHVlKHBhdGgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICByZXR1cm4gXy5oYXModGhpcy5fY2FjaGUsIHBhdGgpO1xuICAgIH1cblxuICAgIF9zaG91bGROb3RCZURlc3Ryb3llZCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2Rlc3Ryb3llZC5zaG91bGQubm90LmJlLm9rKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfY2FjaGU6IG51bGwsXG4gICAgX2Rlc3Ryb3llZDogbnVsbCxcbiAgICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICBjbGFzcyBNZW1vcnlTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBkYXRhXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHRoaXMuX2RhdGFbcGF0aF0gPSBudWxsKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ01lbW9yeVN0b3JlJztcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiBfLmhhcyh0aGlzLl9kYXRhLCBwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldChwYXRoLCB2YWx1ZSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIHRoaXMuX2RhdGFbcGF0aF0gPSB2YWx1ZTtcbiAgICAgIGlmKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pXG4gICAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXS51cGRhdGUodmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChNZW1vcnlTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfZGF0YTogbnVsbCxcbiAgfSk7XG5cbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgaHR0cCB9KSB7XG4gICAgICBfLmRldigoKSA9PiBodHRwLnNob3VkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBodHRwLmZldGNoLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuX2h0dHAgPSBodHRwO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdIVFRQU3RvcmUnO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEhUVFBTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfaHR0cDogbnVsbCxcbiAgfSk7XG5cbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rKSk7XG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgdGhpcy5fdXBsaW5rID0gdXBsaW5rO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XG4gICAgX3VwbGluazogbnVsbCxcbiAgfSk7XG5cbiAgXy5leHRlbmQoU3RvcmUsIHsgTWVtb3J5U3RvcmUsIEhUVFBTdG9yZSwgVXBsaW5rU3RvcmUgfSk7XG5cbiAgcmV0dXJuIFN0b3JlO1xuXG59O1xuXG5cbiAgICAgICAvLyAgLyoqXG4gICAgICAgLy8gICAqIDxwPiBJbXBsZW1lbnRhdGlvbiBvZiBSLlN0b3JlIHVzaW5nIGEgcmVtb3RlLCBIVFRQIHBhc3NpdmUgU3RvcmUuIFRoZSBzdG9yZSBpcyByZWFkLW9ubHkgZnJvbSB0aGUgY29tcG9uZW50cywgPGJyIC8+XG4gICAgICAgLy8gICAqIGFzIHdlbGwgYXMgZnJvbSB0aGUgQ2xpZW50IGluIGdlbmVyYWwuIEhvd2V2ZXIsIGl0cyB2YWx1ZXMgbWF5IGJlIHVwZGF0ZWQgYWNyb3NzIHJlZnJlc2hlcy9yZWxvYWRzLCBidXQgdGhlIHJlbW90ZSA8YnIgLz5cbiAgICAgICAvLyAgICogYmFja2VuZCBzaG91bGQgYmUgd2lyZWQtdXAgd2l0aCBSLkRpc3BhdGNoZXIuSFRUUERpc3BhdGNoZXIgdG8gaW1wbGVtZW50IGEgc2Vjb25kLWNsYXNzIG92ZXItdGhlLXdpcmUgRmx1eC4gPC9wPlxuICAgICAgIC8vICAgKi9cbiAgICAgICAvLyAgIGNyZWF0ZUhUVFBTdG9yZTogZnVuY3Rpb24gY3JlYXRlSFRUUFN0b3JlKCkge1xuICAgICAgIC8vICAgIHJldHVybiBmdW5jdGlvbiBIVFRQU3RvcmUoaHR0cCkge1xuICAgICAgIC8vICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgLy8gICAgICAgIGFzc2VydChodHRwLmZldGNoICYmIF8uaXNGdW5jdGlvbihodHRwLmZldGNoKSwgJ1IuU3RvcmUuY3JlYXRlSFRUUFN0b3JlKC4uLikuaHR0cC5mZXRjaDogZXhwZWN0aW5nIEZ1bmN0aW9uLicpO1xuICAgICAgIC8vICAgICAgfSk7XG4gICAgICAgLy8gICAgICB2YXIgX2ZldGNoID0gaHR0cC5mZXRjaDtcbiAgICAgICAvLyAgICAgIHZhciBfZGVzdHJveWVkID0gZmFsc2U7XG4gICAgICAgLy8gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgIC8vICAgICAgdmFyIHN1YnNjcmliZXJzID0ge307XG4gICAgICAgLy8gICAgICB2YXIgZmV0Y2ggPSBmdW5jdGlvbiogZmV0Y2goa2V5KSB7XG4gICAgICAgLy8gICAgICAgIHZhciB2YWwgPSB5aWVsZCBfZmV0Y2goa2V5KTtcbiAgICAgICAvLyAgICAgICAgaWYoIV9kZXN0cm95ZWQpIHtcbiAgICAgICAvLyAgICAgICAgICBkYXRhW2tleV0gPSB2YWw7XG4gICAgICAgLy8gICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAvLyAgICAgICAgfVxuICAgICAgIC8vICAgICAgICBlbHNlIHtcbiAgICAgICAvLyAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1IuU3RvcmUuSFRUUFN0b3JlLmZldGNoKC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC4nKTtcbiAgICAgICAvLyAgICAgICAgfVxuICAgICAgIC8vICAgICAgfTtcblxuICAgICAgIC8vICAgICAgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICAgICAvLyAgICAgICAgaWYoIV8uaGFzKGRhdGEsIGtleSkpIHtcbiAgICAgICAvLyAgICAgICAgICBjb25zb2xlLndhcm4oJ1IuU3RvcmUuTWVtb3J5U3RvcmUuZ2V0KC4uLik6IGRhdGEgbm90IGF2YWlsYWJsZS4gKCcnICsga2V5ICsgJycpJyk7XG4gICAgICAgLy8gICAgICAgIH1cbiAgICAgICAvLyAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgICAgICAvLyAgICAgIH07XG5cbiAgICAgICAvLyAgICAgIHZhciBzdWIgPSBmdW5jdGlvbiBzdWIoa2V5KSB7XG4gICAgICAgLy8gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgUi5TdG9yZS5TdWJzY3JpcHRpb24oa2V5KTtcbiAgICAgICAvLyAgICAgICAgaWYoIV8uaGFzKHN1YnNjcmliZXJzLCBrZXkpKSB7XG4gICAgICAgLy8gICAgICAgICAgc3Vic2NyaWJlcnNba2V5XSA9IHt9O1xuICAgICAgIC8vICAgICAgICB9XG4gICAgICAgLy8gICAgICAgIHN1YnNjcmliZXJzW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXSA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAvLyAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAvLyAgICAgIH07XG5cbiAgICAgICAvLyAgICAgIHZhciB1bnN1YiA9IGZ1bmN0aW9uIHVuc3ViKHN1YnNjcmlwdGlvbikge1xuICAgICAgIC8vICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAvLyAgICAgICAgICBhc3NlcnQoIV9kZXN0cm95ZWQsICdSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC4nKTtcbiAgICAgICAvLyAgICAgICAgICBhc3NlcnQoc3Vic2NyaXB0aW9uIGluc3RhbmNlb2YgUi5TdG9yZS5TdWJzY3JpcHRpb24sICdSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IHR5cGUgUi5TdG9yZS5TdWJzY3JpcHRpb24gZXhwZWN0ZWQuJyk7XG4gICAgICAgLy8gICAgICAgICAgYXNzZXJ0KF8uaGFzKHN1YnNjcmliZXJzLCBzdWJzY3JpcHRpb24ua2V5KSwgJ1IuU3RvcmUuVXBsaW5rU3RvcmUudW5zdWIoLi4uKTogbm8gc3Vic2NyaWJlcnMgZm9yIHRoaXMga2V5LiAoJycgKyBzdWJzY3JpcHRpb24ua2V5ICsgJycpJyk7XG4gICAgICAgLy8gICAgICAgICAgYXNzZXJ0KF8uaGFzKHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldLCBzdWJzY3JpcHRpb24udW5pcXVlSWQpLCAnUi5TdG9yZS5VcGxpbmtTdG9yZS51bnN1YiguLi4pOiBubyBzdWNoIHN1YnNjcmlwdGlvbi4gKCcnICsgc3Vic2NyaXB0aW9uLmtleSArICcnLCAnJyArIHN1YnNjcmlwdGlvbi51bmlxdWVJZCArICcnKScpO1xuICAgICAgIC8vICAgICAgICB9KTtcbiAgICAgICAvLyAgICAgICAgZGVsZXRlIHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF07XG4gICAgICAgLy8gICAgICAgIGlmKF8uc2l6ZShzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XSkgPT09IDApIHtcbiAgICAgICAvLyAgICAgICAgICBkZWxldGUgc3Vic2NyaWJlcnNbc3Vic2NyaXB0aW9uLmtleV07XG4gICAgICAgLy8gICAgICAgICAgaWYoXy5oYXMoZGF0YSwgc3Vic2NyaXB0aW9uLmtleSkpIHtcbiAgICAgICAvLyAgICAgICAgICAgIGRlbGV0ZSBkYXRhW3N1YnNjcmlwdGlvbi5rZXldO1xuICAgICAgIC8vICAgICAgICAgIH1cbiAgICAgICAvLyAgICAgICAgfVxuICAgICAgIC8vICAgICAgfTtcblxuICAgICAgIC8vICAgICAgdmFyIHNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAvLyAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgIC8vICAgICAgfTtcblxuICAgICAgIC8vICAgICAgdmFyIHVuc2VyaWFsaXplID0gZnVuY3Rpb24gdW5zZXJpYWxpemUoc3RyKSB7XG4gICAgICAgLy8gICAgICAgIF8uZXh0ZW5kKGRhdGEsIEpTT04ucGFyc2Uoc3RyKSk7XG4gICAgICAgLy8gICAgICB9O1xuXG4gICAgICAgLy8gICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgLy8gICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgIC8vICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgJ1IuU3RvcmUuVXBsaW5rU3RvcmUuZGVzdHJveSguLi4pOiBpbnN0YW5jZSBkZXN0cm95ZWQuJyk7XG4gICAgICAgLy8gICAgICAgIH0pO1xuICAgICAgIC8vICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnMsIGZ1bmN0aW9uKGtleVN1YnNjcmliZXJzLCBrZXkpIHtcbiAgICAgICAvLyAgICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnNba2V5XSwgdW5zdWIpO1xuICAgICAgIC8vICAgICAgICB9KTtcbiAgICAgICAvLyAgICAgICAgXy5lYWNoKGRhdGEsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgLy8gICAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcbiAgICAgICAvLyAgICAgICAgfSk7XG4gICAgICAgLy8gICAgICAgIGRhdGEgPSBudWxsO1xuICAgICAgIC8vICAgICAgICBzdWJzY3JpYmVycyA9IG51bGw7XG4gICAgICAgLy8gICAgICAgIF9kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgIC8vICAgICAgfTtcblxuICAgICAgIC8vICAgICAgcmV0dXJuIG5ldyAoUi5TdG9yZS5jcmVhdGVTdG9yZSh7XG4gICAgICAgLy8gICAgICAgIGRpc3BsYXlOYW1lOiAnSFRUUFN0b3JlJyxcbiAgICAgICAvLyAgICAgICAgX2RhdGE6IGRhdGEsXG4gICAgICAgLy8gICAgICAgIF9zdWJzY3JpYmVyczogc3Vic2NyaWJlcnMsXG4gICAgICAgLy8gICAgICAgIGZldGNoOiBmZXRjaCxcbiAgICAgICAvLyAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgLy8gICAgICAgIHN1Yjogc3ViLFxuICAgICAgIC8vICAgICAgICB1bnN1YjogdW5zdWIsXG4gICAgICAgLy8gICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxuICAgICAgIC8vICAgICAgICB1bnNlcmlhbGl6ZTogdW5zZXJpYWxpemUsXG4gICAgICAgLy8gICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgLy8gICAgICB9KSkoKTtcbiAgICAgICAvLyAgICB9O1xuICAgICAgIC8vICB9LFxuICAgICAgIC8vICAvKipcbiAgICAgICAvLyAgICogPHA+SW1wbGVtZW50YXRpb24gb2YgUi5TdG9yZSB1c2luZyBhIHJlbW90ZSwgUkVTVC1saWtlIFN0b3JlLiBUaGUgc3RvcmUgaXMgcmVhZC1vbmx5IGZyb20gdGhlIGNvbXBvbmVudHMsIDxiciAvPlxuICAgICAgIC8vICAgKiBhcyB3ZWxsIGFzIGZyb20gdGhlIENsaWVudCBpbiBnZW5lcmFsLCBidXQgdGhlIHJlbW90ZSBiYWNrZW5kIHNob3VsZCBiZSB3aXJlZC11cCB3aXRoIFIuRGlzcGF0Y2hlci5VcGxpbmtEaXNwYXRjaGVyIHRvXG4gICAgICAgLy8gICAqIGltcGxlbWVudCB0aGUgb3Zlci10aGUtd2lyZSBGbHV4LiA8L3A+XG4gICAgICAgLy8gICAqIEBjbGFzcyBSLlN0b3JlLlVwbGlua1N0b3JlXG4gICAgICAgLy8gICAqIEBpbXBsZW1lbnRzIHtSLlN0b3JlfVxuICAgICAgIC8vICAgKi9cbiAgICAgICAvLyAgIGNyZWF0ZVVwbGlua1N0b3JlOiBmdW5jdGlvbiBjcmVhdGVVcGxpbmtTdG9yZSgpIHtcbiAgICAgICAvLyAgICByZXR1cm4gZnVuY3Rpb24gVXBsaW5rU3RvcmUodXBsaW5rKSB7XG4gICAgICAgLy8gICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAvLyAgICAgICAgYXNzZXJ0KHVwbGluay5mZXRjaCAmJiBfLmlzRnVuY3Rpb24odXBsaW5rLmZldGNoKSwgJ1IuU3RvcmUuY3JlYXRlVXBsaW5rU3RvcmUoLi4uKS51cGxpbmsuZmV0Y2g6IGV4cGVjdGluZyBGdW5jdGlvbi4nKTtcbiAgICAgICAvLyAgICAgICAgYXNzZXJ0KHVwbGluay5zdWJzY3JpYmVUbyAmJiBfLmlzRnVuY3Rpb24odXBsaW5rLnN1YnNjcmliZVRvKSwgJ1IuU3RvcmUuY3JlYXRlVXBsaW5rU3RvcmUoLi4uKS51cGxpbmsuc3Vic2NyaWJlVG86IGV4cGVjdGluZyBGdW5jdGlvbi4nKTtcbiAgICAgICAvLyAgICAgICAgYXNzZXJ0KHVwbGluay51bnN1YnNjcmliZUZyb20gJiYgXy5pc0Z1bmN0aW9uKHVwbGluay51bnN1YnNjcmliZUZyb20pLCAnUi5TdG9yZS5jcmVhdGVVcGxpbmtTdG9yZSguLi4pLnVwbGluay51bnN1YnNjcmliZUZyb206IGV4cGVjdGluZyBGdW5jdGlvbi4nKTtcbiAgICAgICAvLyAgICAgIH0pO1xuICAgICAgIC8vICAgICAgdmFyIF9mZXRjaCA9IHVwbGluay5mZXRjaDtcbiAgICAgICAvLyAgICAgIHZhciBzdWJzY3JpYmVUbyA9IHVwbGluay5zdWJzY3JpYmVUbztcbiAgICAgICAvLyAgICAgIHZhciB1bnN1YnNjcmliZUZyb20gPSB1cGxpbmsudW5zdWJzY3JpYmVGcm9tO1xuICAgICAgIC8vICAgICAgX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgIC8vICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAvLyAgICAgIHZhciBzdWJzY3JpYmVycyA9IHt9O1xuICAgICAgIC8vICAgICAgdmFyIHVwZGF0ZXJzID0ge307XG5cbiAgICAgICAvLyAgICAgICAgICAvKipcbiAgICAgICAvLyAgICAgICAgICAqIDxwPkZldGNoIGRhdGEgYWNjb3JkaW5nIHRvIGEga2V5PC9wPlxuICAgICAgIC8vICAgICAgICAgICogQG1ldGhvZCBmZXRjaFxuICAgICAgIC8vICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5XG4gICAgICAgLy8gICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm4gdGhlIHlpZWxkZWQgZm9uY3Rpb25cbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciBmZXRjaCA9IGZ1bmN0aW9uKiBmZXRjaChrZXkpIHtcbiAgICAgICAvLyAgICAgICAgICAgIHZhciB2YWwgPSB5aWVsZCBfZmV0Y2goa2V5KTtcbiAgICAgICAvLyAgICAgICAgICAgIGlmKCFfZGVzdHJveWVkKSB7XG4gICAgICAgLy8gICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICAgICAvLyAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAvLyAgICAgICAgICAgIH1cbiAgICAgICAvLyAgICAgICAgICAgIGVsc2Uge1xuICAgICAgIC8vICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1IuU3RvcmUuVXBsaW5rU3RvcmUuZmV0Y2goLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLicpO1xuICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgIC8vICAgICAgICAgIH07XG4gICAgICAgLy8gICAgICAgICAgdmFyIGdldCA9IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICAgICAvLyAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgIC8vICAgICAgICAgICAgICBpZighXy5oYXMoZGF0YSwga2V5KSkge1xuICAgICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5TdG9yZS5VcGxpbmtTdG9yZS5nZXQoLi4uKTogZGF0YSBub3QgYXZhaWxhYmxlLiAoJycgKyBrZXkgKyAnJyknKTtcbiAgICAgICAvLyAgICAgICAgICAgICAgfVxuICAgICAgIC8vICAgICAgICAgICAgfSk7XG4gICAgICAgLy8gICAgICAgICAgICByZXR1cm4gZGF0YVtrZXldO1xuICAgICAgIC8vICAgICAgICAgIH07XG4gICAgICAgLy8gICAgICAgICAgLyoqXG4gICAgICAgLy8gICAgICAgICAgKiA8cD5UcmlnZ2VyZWQgYnkgdGhlIHNvY2tldC5vbigndXBkYXRlJykgZXZlbnQgaW4gUi5VcGxpbmsgPGJyIC8+XG4gICAgICAgLy8gICAgICAgICAgKiBGZXRjaCBkYXRhIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4ga2V5IDxiciAvPlxuICAgICAgIC8vICAgICAgICAgICogQ2FsbCB0aGUgc2F2ZWQgZnVuY3Rpb24gY29udGFpbmVkIGluIHN1YnNjcmliZXJzIDwvcD5cbiAgICAgICAvLyAgICAgICAgICAqIEBtZXRob2Qgc2lnbmFsVXBkYXRlXG4gICAgICAgLy8gICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gZmV0Y2hcbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciBzaWduYWxVcGRhdGUgPSBmdW5jdGlvbiBzaWduYWxVcGRhdGUoa2V5LCB2YWwpIHtcbiAgICAgICAvLyAgICAgICAgICAgIGlmKCFfLmhhcyhzdWJzY3JpYmVycywga2V5KSkge1xuICAgICAgIC8vICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgLy8gICAgICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnNba2V5XSwgZnVuY3Rpb24oZm4sIHVuaXF1ZUlkKSB7XG4gICAgICAgLy8gICAgICAgICAgICAgIGlmKGZuKSB7XG4gICAgICAgLy8gICAgICAgICAgICAgICAgZm4odmFsKTtcbiAgICAgICAvLyAgICAgICAgICAgICAgfVxuICAgICAgIC8vICAgICAgICAgICAgfSk7XG4gICAgICAgLy8gICAgICAgICAgfTtcbiAgICAgICAvLyAgICAgICAgIC8qKlxuICAgICAgIC8vICAgICAgICAgICogPHA+IFN1YnNjcmliZSBhdCBhIHNwZWNpZmljIGtleSA8L3A+XG4gICAgICAgLy8gICAgICAgICAgKiBAbWV0aG9kIHN1YlxuICAgICAgIC8vICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgc3BlY2lmaWMga2V5IHRvIHN1YnNjcmliZVxuICAgICAgIC8vICAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gX3NpZ25hbFVwZGF0ZSB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGwgd2hlbiBhIGRhdGEgY29ycmVzcG9uZGluZyB0byBhIGtleSB3aWxsIGJlIHVwZGF0ZWRcbiAgICAgICAvLyAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gc3Vic2NyaXB0aW9uIFRoZSBzYXZlZCBzdWJzY3JpcHRpb25cbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciBzdWIgPSBmdW5jdGlvbiBzdWIoa2V5LCBfc2lnbmFsVXBkYXRlKSB7XG4gICAgICAgLy8gICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAvLyAgICAgICAgICAgICAgYXNzZXJ0KCFfZGVzdHJveWVkLCAnUi5TdG9yZS5VcGxpbmtTdG9yZS5zdWIoLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLiAoJycgKyBrZXkgKyAnJyknKTtcbiAgICAgICAvLyAgICAgICAgICAgIH0pO1xuICAgICAgIC8vICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBSLlN0b3JlLlN1YnNjcmlwdGlvbihrZXkpO1xuICAgICAgIC8vICAgICAgICAgICAgaWYoIV8uaGFzKHN1YnNjcmliZXJzLCBrZXkpKSB7XG4gICAgICAgLy8gICAgICAgICAgICAgIHN1YnNjcmliZXJzW2tleV0gPSB7fTtcbiAgICAgICAvLyAgICAgICAgICAgICAgICAgIC8vIGNhbGwgc3Vic2NyaWJlVG8gZnJvbSBSLlVwbGluayA9PiBlbWl0ICdzdWJzY3JpYmVUbycgc2lnbmFsXG4gICAgICAgLy8gICAgICAgICAgICAgICAgICB1cGRhdGVyc1trZXldID0gc3Vic2NyaWJlVG8oa2V5LCBzaWduYWxVcGRhdGUpO1xuICAgICAgIC8vICAgICAgICAgICAgICAgIH1cbiAgICAgICAvLyAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSBfc2lnbmFsVXBkYXRlO1xuICAgICAgIC8vICAgICAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbiAgICAgICAvLyAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSB5aWVsZCBmZXRjaChrZXkpO1xuICAgICAgIC8vICAgICAgICAgICAgICAgICAgXy5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgX3NpZ25hbFVwZGF0ZSh2YWwpO1xuICAgICAgIC8vICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgLy8gICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBSLkRlYnVnLnJldGhyb3coJ1IuU3RvcmUuc3ViLmZldGNoKC4uLik6IGRhdGEgbm90IGF2YWlsYWJsZS4gKCcnICsga2V5ICsgJycpJykpO1xuICAgICAgIC8vICAgICAgICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgLy8gICAgICAgICAgICAgIH07XG4gICAgICAgLy8gICAgICAgICAgLyoqXG4gICAgICAgLy8gICAgICAgICAgKiA8cD4gVW5zdWJzY3JpYmU8L3A+XG4gICAgICAgLy8gICAgICAgICAgKiBAbWV0aG9kIHVuc3ViXG4gICAgICAgLy8gICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gdGhhdCBjb250YWlucyB0aGUga2V5IHRvIHVuc3VzY3JpYmVcbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciB1bnN1YiA9IGZ1bmN0aW9uIHVuc3ViKHN1YnNjcmlwdGlvbikge1xuICAgICAgIC8vICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgLy8gICAgICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgJ1IuU3RvcmUuVXBsaW5rU3RvcmUudW5zdWIoLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLicpO1xuICAgICAgIC8vICAgICAgICAgICAgICBhc3NlcnQoc3Vic2NyaXB0aW9uIGluc3RhbmNlb2YgUi5TdG9yZS5TdWJzY3JpcHRpb24sICdSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IHR5cGUgUi5TdG9yZS5TdWJzY3JpcHRpb24gZXhwZWN0ZWQuJyk7XG4gICAgICAgLy8gICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzdWJzY3JpYmVycywgc3Vic2NyaXB0aW9uLmtleSksICdSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IG5vIHN1YnNjcmliZXJzIGZvciB0aGlzIGtleS4gKCcnICsgc3Vic2NyaXB0aW9uLmtleSArICcnKScpO1xuICAgICAgIC8vICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3Vic2NyaWJlcnNbc3Vic2NyaXB0aW9uLmtleV0sIHN1YnNjcmlwdGlvbi51bmlxdWVJZCksICdSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IG5vIHN1Y2ggc3Vic2NyaXB0aW9uLiAoJycgKyBzdWJzY3JpcHRpb24ua2V5ICsgJycsICcnICsgc3Vic2NyaXB0aW9uLnVuaXF1ZUlkICsgJycpJyk7XG4gICAgICAgLy8gICAgICAgICAgICB9KTtcbiAgICAgICAvLyAgICAgICAgICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdO1xuICAgICAgIC8vICAgICAgICAgICAgaWYoXy5zaXplKHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldKSA9PT0gMCkge1xuICAgICAgIC8vICAgICAgICAgICAgICB1bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uLmtleSwgdXBkYXRlcnNbc3Vic2NyaXB0aW9uLmtleV0pO1xuICAgICAgIC8vICAgICAgICAgICAgICBkZWxldGUgc3Vic2NyaWJlcnNbc3Vic2NyaXB0aW9uLmtleV07XG4gICAgICAgLy8gICAgICAgICAgICAgIGRlbGV0ZSB1cGRhdGVyc1tzdWJzY3JpcHRpb24ua2V5XTtcbiAgICAgICAvLyAgICAgICAgICAgICAgaWYoXy5oYXMoZGF0YSwgc3Vic2NyaXB0aW9uLmtleSkpIHtcbiAgICAgICAvLyAgICAgICAgICAgICAgICBkZWxldGUgZGF0YVtzdWJzY3JpcHRpb24ua2V5XTtcbiAgICAgICAvLyAgICAgICAgICAgICAgfVxuICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgIC8vICAgICAgICAgIH07XG5cbiAgICAgICAvLyAgICAgICAgICAvKipcbiAgICAgICAvLyAgICAgICAgICAqIDxwPiBTZXJpYWxpemUgdGhlIFVwbGlua1N0b3JlIHN0b3JlIDwvcD5cbiAgICAgICAvLyAgICAgICAgICAqIEBtZXRob2Qgc2VyaWFsaXplXG4gICAgICAgLy8gICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGRhdGEgVGhlIHNlcmlhbGl6ZWQgVXBsaW5rU3RvcmUgc3RvcmVcbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciBzZXJpYWxpemUgPSBmdW5jdGlvbiBzZXJpYWxpemUoKSB7XG4gICAgICAgLy8gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgLy8gICAgICAgICAgfTtcblxuICAgICAgIC8vICAgICAgICAgIC8qKlxuICAgICAgIC8vICAgICAgICAgICogPHA+IFVuc2VyaWFsaXplIHRoZSBVcGxpbmtTdG9yZSBzdG9yZSA8L3A+XG4gICAgICAgLy8gICAgICAgICAgKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gICAgICAgLy8gICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gdW5zZXJpYWxpc2VcbiAgICAgICAvLyAgICAgICAgICAqL1xuICAgICAgIC8vICAgICAgICAgIHZhciB1bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHVuc2VyaWFsaXplKHN0cikge1xuICAgICAgIC8vICAgICAgICAgICAgXy5leHRlbmQoZGF0YSwgSlNPTi5wYXJzZShzdHIpKTtcbiAgICAgICAvLyAgICAgICAgICB9O1xuXG4gICAgICAgLy8gICAgICAgICAgLyoqXG4gICAgICAgLy8gICAgICAgICAgKiA8cD4gQ2xlYW4gVXBsaW5rU3RvcmUgc3RvcmUgPC9wPlxuICAgICAgIC8vICAgICAgICAgICogQG1ldGhvZCBkZXN0cm95XG4gICAgICAgLy8gICAgICAgICAgKi9cbiAgICAgICAvLyAgICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgLy8gICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAvLyAgICAgICAgICAgICAgYXNzZXJ0KCFfZGVzdHJveWVkLCAnUi5TdG9yZS5VcGxpbmtTdG9yZS5kZXN0cm95KC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC4nKTtcbiAgICAgICAvLyAgICAgICAgICAgIH0pO1xuICAgICAgIC8vICAgICAgICAgICAgXy5lYWNoKHN1YnNjcmliZXJzLCBmdW5jdGlvbihrZXlTdWJzY3JpYmVycywga2V5KSB7XG4gICAgICAgLy8gICAgICAgICAgICAgIF8uZWFjaChzdWJzY3JpYmVyc1trZXldLCB1bnN1Yik7XG4gICAgICAgLy8gICAgICAgICAgICB9KTtcbiAgICAgICAvLyAgICAgICAgICAgIF8uZWFjaChkYXRhLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgIC8vICAgICAgICAgICAgICBkZWxldGUgZGF0YVtrZXldO1xuICAgICAgIC8vICAgICAgICAgICAgfSk7XG4gICAgICAgLy8gICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAvLyAgICAgICAgICAgIHN1YnNjcmliZXJzID0gbnVsbDtcbiAgICAgICAvLyAgICAgICAgICAgIHVwZGF0ZXJzID0gbnVsbDtcbiAgICAgICAvLyAgICAgICAgICAgIF9kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgIC8vICAgICAgICAgIH07XG4gICAgICAgLy8gICAgICAgICAgcmV0dXJuIG5ldyAoUi5TdG9yZS5jcmVhdGVTdG9yZSh7XG4gICAgICAgLy8gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1VwbGlua1N0b3JlJyxcbiAgICAgICAvLyAgICAgICAgICAgIF9kYXRhOiBkYXRhLFxuICAgICAgIC8vICAgICAgICAgICAgX3N1YnNjcmliZXJzOiBzdWJzY3JpYmVycyxcbiAgICAgICAvLyAgICAgICAgICAgIF91cGRhdGVyczogdXBkYXRlcnMsXG4gICAgICAgLy8gICAgICAgICAgICBmZXRjaDogZmV0Y2gsXG4gICAgICAgLy8gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAvLyAgICAgICAgICAgIHN1Yjogc3ViLFxuICAgICAgIC8vICAgICAgICAgICAgdW5zdWI6IHVuc3ViLFxuICAgICAgIC8vICAgICAgICAgICAgc2lnbmFsVXBkYXRlOiBzaWduYWxVcGRhdGUsXG4gICAgICAgLy8gICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgICAgICAvLyAgICAgICAgICAgIHVuc2VyaWFsaXplOiB1bnNlcmlhbGl6ZSxcbiAgICAgICAvLyAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgLy8gICAgICAgICAgfSkpKCk7XG4gICAgICAgLy8gICAgICAgIH07XG4gICAgICAgLy8gICAgICB9LFxuICAgICAgIC8vICAgIH07XG5cbiAgICAgICAvLyAgICBfLmV4dGVuZChTdG9yZS5TdWJzY3JpcHRpb24ucHJvdG90eXBlLCAvKiogQGxlbmRzIFIuU3RvcmUuU3Vic2NyaXB0aW9uICove1xuICAgICAgIC8vICAvKipcbiAgICAgICAvLyAgICogQHB1YmxpY1xuICAgICAgIC8vICAgKiBAcmVhZE9ubHlcbiAgICAgICAvLyAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAvLyAgICovXG4gICAgICAgLy8gICB1bmlxdWVJZDogbnVsbCxcbiAgICAgICAvLyAgLyoqXG4gICAgICAgLy8gICAqIEBwdWJsaWNcbiAgICAgICAvLyAgICogQHJlYWRPbmx5XG4gICAgICAgLy8gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgLy8gICAqL1xuICAgICAgIC8vICAga2V5OiBudWxsLFxuICAgICAgIC8vIH0pO1xuXG4gICAgICAgLy8gICAgcmV0dXJuIFN0b3JlO1xuICAgICAgIC8vICB9O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9