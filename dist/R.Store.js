"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");
  var co = require("co");

  var count = 0;

  /**
   * @memberOf R
   * R.Store is a generic, abstract Store representation. A Store is defined by its capacity to provide components with data and updates.
   * `get` will be used at getInitialState time.
   * `sub` will be invoked at componentDidMount time.
   * `unsub` will be invoked at componentWillUnmount time.
   * `sub` will trigger a deferred call to the `signalUpdate` function it is passed, so make sure it is wrapped in R.Async.IfMounted if necessary.
   * Provided implementations:
   *     - MemoryStore (Flux-like, changes are pushed via `set`)
   *     - UplinkStore (REST + updates, changes are pushed via `signalUpdate`)
   * @public
   * @class R.Store
   */
  var Store = {
    /**
     * <p> Initializes the Store according to the specifications provided </p>
     * @method createStore
     * @param {Object} specs Options to create the store.
     * @public
     * @return {R.Store.StoreInstance} StoreInstance The instance of the created StoreInstance
     */
    createStore: function createStore(specs) {
      R.Debug.dev(function () {
        assert(_.isObject(specs), "createStore(...): expecting an Object as specs.");
        assert(_.has(specs, "displayName") && _.isString(specs.displayName), "R.Store.createStore(...): requires displayName(String).");
        assert(_.has(specs, "fetch") && _.isFunction(specs.fetch), "R.Store.createStore(...): requires fetch(Function(String): Function.");
        assert(_.has(specs, "get") && _.isFunction(specs.get), "R.Store.createStore(...): requires get(Function(String): *.");
        assert(_.has(specs, "sub") && _.isFunction(specs.sub), "R.Store.createStore(...): requires sub(Function(String, Function): R.Store.Subscription).");
        assert(_.has(specs, "unsub") && _.isFunction(specs.unsub), "R.Store.createStore(...): requires unsub(Function(R.Store.Subscription).");
        assert(_.has(specs, "serialize") && _.isFunction(specs.serialize), "R.Store.createStore(...): requires serialize(): String.");
        assert(_.has(specs, "unserialize") && _.isFunction(specs.unserialize), "R.Store.createStore(...): requires unserialize(String).");
        assert(_.has(specs, "destroy") && _.isFunction(specs.destroy), "R.Store.createStore(...): requires destroy().");
      });
      /**
       * @memberOf R.Store
       * @method StoreInstance
       * @public
       * @abstract
       */
      var StoreInstance = function StoreInstance() {};
      _.extend(StoreInstance.prototype, specs, {
        /**
         * Type dirty-checking
         * @type {Boolean}
         * @private
         * @readOnly
         */
        _isStoreInstance_: true });
      return StoreInstance;
    },
    /**
     * <p> Represents a single subscription into a Store to avoid the pain of passing Functions back and forth. <br />
     * An instance of R.Store.Subscription is returned by sub and should be passed to unsub. </p>
     * @method Subscription
     * @param {string} key 
     * @public
     */
    Subscription: function Subscription(key) {
      this.uniqueId = _.uniqueId("R.Store.Subscription");
      this.key = key;
    },
    /**
     * <p> Implementation of R.Store using a traditionnal, Flux-like memory-based Store. The store is read-only from the components,<br />
     * but is writable from the toplevel using "set". Wire up to a R.Dispatcher.MemoryDispatcher to implement the canonical Flux. </p>
     * @class R.Store.MemoryStore
     * @implements {R.Store}
     */
    createMemoryStore: function createMemoryStore() {
      return function MemoryStore() {
        var _destroyed = false;
        var data = {};
        var subscribers = {};

        /**
        * <p>Fetch data according to a key</p>
        * @method fetch
        * @param {string} key The key
        * @return {Function} fn the yielded fonction
        */
        var fetch = function fetch(key) {
          return function (fn) {
            if (!_destroyed) {
              _.defer(function () {
                if (!_destroyed) {
                  fn(null, data[key]);
                }
              });
            }
          };
        };

        /**
        * <p>Return data according to a key</p>
        * @method get
        * @param {string} key The key
        * @return {Function} fn the yielded fonction
        */
        var get = function get(key) {
          R.Debug.dev(function () {
            if (!_.has(data, key)) {
              console.warn("R.Store.MemoryStore.get(...): data not available. ('" + key + "')");
            }
          });
          return data[key];
        };

        /** 
        * <p>Triggered by the set function. <br />
        * Fetch data according to the given key. <br />
        * Call the saved function contained in subscribers. </p>
        * @method signalUpdate
        * @param {string} key The key to fetch
        */
        var signalUpdate = function signalUpdate(key) {
          if (!_.has(subscribers, key)) {
            return;
          }
          co(regeneratorRuntime.mark(function callee$4$0() {
            var val;
            return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
              while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                  context$5$0.next = 2;
                  return fetch(key);

                case 2:
                  val = context$5$0.sent;

                  _.each(subscribers[key], function (fn) {
                    if (fn) {
                      fn(val);
                    }
                  });

                case 4:
                case "end": return context$5$0.stop();
              }
            }, callee$4$0, this);
          })).call(this, "R.Store.MemoryStore.signalUpdate(...)");
        };

        /**
        * <p>Set data according to a key, then call signalUpdate in order to rerender matching React component</p>
        * @method set
        * @param {string} key The key
        * @param {object} val The val
        */
        var set = function set(key, val) {
          data[key] = val;
          signalUpdate(key);
        };

        /**
         * <p> Subscribe at a specific key </p>
         * @method sub
         * @param {string} key The specific key to subscribe
         * @param {function} _signalUpdate the function that will be call when a data corresponding to a key will be updated
         * @return {Object} subscription The saved subscription
         */
        var sub = function sub(key, _signalUpdate) {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.MemoryStore.sub(...): instance destroyed.");
          });
          var subscription = new R.Store.Subscription(key);
          if (!_.has(subscribers, key)) {
            subscribers[key] = {};
          }
          subscribers[key][subscription.uniqueId] = _signalUpdate;
          co(regeneratorRuntime.mark(function callee$4$0() {
            var val;
            return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
              while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                  context$5$0.next = 2;
                  return fetch(key);

                case 2:
                  val = context$5$0.sent;

                  _.defer(function () {
                    _signalUpdate(val);
                  });

                case 4:
                case "end": return context$5$0.stop();
              }
            }, callee$4$0, this);
          })).call(this, R.Debug.rethrow("R.Store.MemoryStore.sub.fetch(...): couldn't fetch current value"));
          return subscription;
        };
        /**
        * <p>Unsubscribe</p>
        * @method unsub
        * @param {object} subscription The subscription that contains the key to unsuscribe
        */
        var unsub = function unsub(subscription) {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.MemoryStore.unsub(...): instance destroyed.");
            assert(subscription instanceof R.Store.Subscription, "R.Store.MemoryStore.unsub(...): type R.Store.Subscription expected.");
            assert(_.has(subscribers, subscription.key), "R.Store.MemoryStore.unsub(...): no subscribers for this key.");
            assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.MemoryStore.unsub(...): no such subscription.");
          });
          delete subscribers[subscription.key][subscription.uniqueId];
          if (_.size(subscribers[subscription.key]) === 0) {
            delete subscribers[subscription.key];
          }
        };
        /**
        * <p> Clean UplinkStore store </p>
        * @method destroy
        */
        var destroy = function destroy() {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.MemoryStore.destroy(...): instance destroyed.");
          });
          _.each(subscribers, function (keySubscribers, key) {
            _.each(subscribers[key], function (fn, uniqueId) {
              delete subscribers[key][uniqueId];
            });
            delete subscribers[key];
          });
          subscribers = null;
          _.each(data, function (val, key) {
            delete data[key];
          });
          data = null;
          _destroyed = true;
        };
        /**
        * <p> Serialize the UplinkStore store </p>
        * @method serialize
        * @return {string} data The serialized UplinkStore store
        */
        var serialize = function serialize() {
          return JSON.stringify(data);
        };
        /**
        * <p> Unserialize the MemoryStore store </p>
        * @method unserialize
        * @param {string} str The string to unserialise
        */
        var unserialize = function unserialize(str) {
          _.extend(data, JSON.parse(str));
        };
        return new (R.Store.createStore({
          displayName: "MemoryStore",
          _data: data,
          _subscribers: subscribers,
          fetch: fetch,
          get: get,
          sub: sub,
          unsub: unsub,
          destroy: destroy,
          set: set,
          serialize: serialize,
          unserialize: unserialize }))();
      };
    },
    /**
     * <p> Implementation of R.Store using a remote, HTTP passive Store. The store is read-only from the components, <br />
     * as well as from the Client in general. However, its values may be updated across refreshes/reloads, but the remote <br />
     * backend should be wired-up with R.Dispatcher.HTTPDispatcher to implement a second-class over-the-wire Flux. </p>
     */
    createHTTPStore: function createHTTPStore() {
      return function HTTPStore(http) {
        R.Debug.dev(function () {
          assert(http.fetch && _.isFunction(http.fetch), "R.Store.createHTTPStore(...).http.fetch: expecting Function.");
        });
        var _fetch = http.fetch;
        var _destroyed = false;
        var data = {};
        var subscribers = {};
        var fetch = regeneratorRuntime.mark(function fetch(key) {
          var val;
          return regeneratorRuntime.wrap(function fetch$(context$4$0) {
            while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
                context$4$0.next = 2;
                return _fetch(key);

              case 2:
                val = context$4$0.sent;

                if (_destroyed) {
                  context$4$0.next = 8;
                  break;
                }

                data[key] = val;
                return context$4$0.abrupt("return", val);

              case 8: throw new Error("R.Store.HTTPStore.fetch(...): instance destroyed.");
              case 9:
              case "end": return context$4$0.stop();
            }
          }, fetch, this);
        });

        var get = function get(key) {
          if (!_.has(data, key)) {
            console.warn("R.Store.MemoryStore.get(...): data not available. ('" + key + "')");
          }
          return data[key];
        };

        var sub = function sub(key) {
          var subscription = new R.Store.Subscription(key);
          if (!_.has(subscribers, key)) {
            subscribers[key] = {};
          }
          subscribers[key][subscription.uniqueId] = subscription;
          return subscription;
        };

        var unsub = function unsub(subscription) {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.UplinkStore.unsub(...): instance destroyed.");
            assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.");
            assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsub(...): no subscribers for this key. ('" + subscription.key + "')");
            assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsub(...): no such subscription. ('" + subscription.key + "', '" + subscription.uniqueId + "')");
          });
          delete subscribers[subscription.key][subscription.uniqueId];
          if (_.size(subscribers[subscription.key]) === 0) {
            delete subscribers[subscription.key];
            if (_.has(data, subscription.key)) {
              delete data[subscription.key];
            }
          }
        };

        var serialize = function serialize() {
          return JSON.stringify(data);
        };

        var unserialize = function unserialize(str) {
          _.extend(data, JSON.parse(str));
        };

        var destroy = function destroy() {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.UplinkStore.destroy(...): instance destroyed.");
          });
          _.each(subscribers, function (keySubscribers, key) {
            _.each(subscribers[key], unsub);
          });
          _.each(data, function (val, key) {
            delete data[key];
          });
          data = null;
          subscribers = null;
          _destroyed = true;
        };

        return new (R.Store.createStore({
          displayName: "HTTPStore",
          _data: data,
          _subscribers: subscribers,
          fetch: fetch,
          get: get,
          sub: sub,
          unsub: unsub,
          serialize: serialize,
          unserialize: unserialize,
          destroy: destroy }))();
      };
    },
    /**
     * <p>Implementation of R.Store using a remote, REST-like Store. The store is read-only from the components, <br />
     * as well as from the Client in general, but the remote backend should be wired-up with R.Dispatcher.UplinkDispatcher to 
     * implement the over-the-wire Flux. </p>
     * @class R.Store.UplinkStore
     * @implements {R.Store}
     */
    createUplinkStore: function createUplinkStore() {
      return function UplinkStore(uplink) {
        R.Debug.dev(function () {
          assert(uplink.fetch && _.isFunction(uplink.fetch), "R.Store.createUplinkStore(...).uplink.fetch: expecting Function.");
          assert(uplink.subscribeTo && _.isFunction(uplink.subscribeTo), "R.Store.createUplinkStore(...).uplink.subscribeTo: expecting Function.");
          assert(uplink.unsubscribeFrom && _.isFunction(uplink.unsubscribeFrom), "R.Store.createUplinkStore(...).uplink.unsubscribeFrom: expecting Function.");
        });
        var _fetch = uplink.fetch;
        var subscribeTo = uplink.subscribeTo;
        var unsubscribeFrom = uplink.unsubscribeFrom;
        _destroyed = false;
        var data = {};
        var subscribers = {};
        var updaters = {};

        /**
        * <p>Fetch data according to a key</p>
        * @method fetch
        * @param {string} key The key
        * @return {Function} fn the yielded fonction
        */
        var fetch = regeneratorRuntime.mark(function fetch(key) {
          var val;
          return regeneratorRuntime.wrap(function fetch$(context$4$0) {
            while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
                context$4$0.next = 2;
                return _fetch(key);

              case 2:
                val = context$4$0.sent;

                if (_destroyed) {
                  context$4$0.next = 8;
                  break;
                }

                data[key] = val;
                return context$4$0.abrupt("return", val);

              case 8: throw new Error("R.Store.UplinkStore.fetch(...): instance destroyed.");
              case 9:
              case "end": return context$4$0.stop();
            }
          }, fetch, this);
        });
        var get = function get(key) {
          R.Debug.dev(function () {
            if (!_.has(data, key)) {
              console.warn("R.Store.UplinkStore.get(...): data not available. ('" + key + "')");
            }
          });
          return data[key];
        };
        /** 
        * <p>Triggered by the socket.on("update") event in R.Uplink <br />
        * Fetch data according to the given key <br />
        * Call the saved function contained in subscribers </p>
        * @method signalUpdate
        * @param {string} key The key to fetch
        */
        var signalUpdate = function signalUpdate(key, val) {
          if (!_.has(subscribers, key)) {
            return;
          }
          _.each(subscribers[key], function (fn, uniqueId) {
            if (fn) {
              fn(val);
            }
          });
        };
        /**
         * <p> Subscribe at a specific key </p>
         * @method sub
         * @param {string} key The specific key to subscribe
         * @param {function} _signalUpdate the function that will be call when a data corresponding to a key will be updated
         * @return {Object} subscription The saved subscription
         */
        var sub = function sub(key, _signalUpdate) {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.UplinkStore.sub(...): instance destroyed. ('" + key + "')");
          });
          var subscription = new R.Store.Subscription(key);
          if (!_.has(subscribers, key)) {
            subscribers[key] = {};
            // call subscribeTo from R.Uplink => emit "subscribeTo" signal
            updaters[key] = subscribeTo(key, signalUpdate);
          }
          subscribers[key][subscription.uniqueId] = _signalUpdate;
          co(regeneratorRuntime.mark(function callee$4$0() {
            var val;
            return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
              while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                  context$5$0.next = 2;
                  return fetch(key);

                case 2:
                  val = context$5$0.sent;

                  _.defer(function () {
                    _signalUpdate(val);
                  });

                case 4:
                case "end": return context$5$0.stop();
              }
            }, callee$4$0, this);
          })).call(this, R.Debug.rethrow("R.Store.sub.fetch(...): data not available. ('" + key + "')"));
          return subscription;
        };
        /**
        * <p> Unsubscribe</p>
        * @method unsub
        * @param {object} subscription The subscription that contains the key to unsuscribe
        */
        var unsub = function unsub(subscription) {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.UplinkStore.unsub(...): instance destroyed.");
            assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.");
            assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsub(...): no subscribers for this key. ('" + subscription.key + "')");
            assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsub(...): no such subscription. ('" + subscription.key + "', '" + subscription.uniqueId + "')");
          });
          delete subscribers[subscription.key][subscription.uniqueId];
          if (_.size(subscribers[subscription.key]) === 0) {
            unsubscribeFrom(subscription.key, updaters[subscription.key]);
            delete subscribers[subscription.key];
            delete updaters[subscription.key];
            if (_.has(data, subscription.key)) {
              delete data[subscription.key];
            }
          }
        };

        /**
        * <p> Serialize the UplinkStore store </p>
        * @method serialize
        * @return {string} data The serialized UplinkStore store
        */
        var serialize = function serialize() {
          return JSON.stringify(data);
        };

        /**
        * <p> Unserialize the UplinkStore store </p>
        * @method unserialize
        * @param {string} str The string to unserialise
        */
        var unserialize = function unserialize(str) {
          _.extend(data, JSON.parse(str));
        };

        /**
        * <p> Clean UplinkStore store </p>
        * @method destroy
        */
        var destroy = function destroy() {
          R.Debug.dev(function () {
            assert(!_destroyed, "R.Store.UplinkStore.destroy(...): instance destroyed.");
          });
          _.each(subscribers, function (keySubscribers, key) {
            _.each(subscribers[key], unsub);
          });
          _.each(data, function (val, key) {
            delete data[key];
          });
          data = null;
          subscribers = null;
          updaters = null;
          _destroyed = true;
        };
        return new (R.Store.createStore({
          displayName: "UplinkStore",
          _data: data,
          _subscribers: subscribers,
          _updaters: updaters,
          fetch: fetch,
          get: get,
          sub: sub,
          unsub: unsub,
          signalUpdate: signalUpdate,
          serialize: serialize,
          unserialize: unserialize,
          destroy: destroy }))();
      };
    } };

  _.extend(Store.Subscription.prototype, /** @lends R.Store.Subscription */{
    /**
     * @public
     * @readOnly
     * @type {String}
     */
    uniqueId: null,
    /**
     * @public
     * @readOnly
     * @type {String}
     */
    key: null });

  return Store;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixNQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsTUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV2QixNQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWVkLE1BQUksS0FBSyxHQUFHOzs7Ozs7OztBQVFSLGVBQVcsRUFBRSxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDckMsT0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixjQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxpREFBaUQsQ0FBQyxDQUFDO0FBQzdFLGNBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSx5REFBeUQsQ0FBQyxDQUFDO0FBQ2hJLGNBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxzRUFBc0UsQ0FBQyxDQUFDO0FBQ25JLGNBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsVUFB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SSxDQUFDO0FBQ1oscUJBQVcsR0FBRyxJQUFJLENBQUM7QUFDbkIsa0JBQVEsR0FBRyxJQUFJLENBQUM7QUFDaEIsb0JBQVUsR0FBRyxJQUFJLENBQUM7U0FDckIsQ0FBQztBQUNGLGVBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQzVCLHFCQUFXLEVBQUUsYUFBYTtBQUMxQixlQUFLLEVBQUUsSUFBSTtBQUNYLHNCQUFZLEVBQUUsV0FBVztBQUN6QixtQkFBUyxFQUFFLFFBQVE7QUFDbkIsZUFBSyxFQUFFLEtBQUs7QUFDWixhQUFHLEVBQUUsR0FBRztBQUNSLGFBQUcsRUFBRSxHQUFHO0FBQ1IsZUFBSyxFQUFFLEtBQUs7QUFDWixzQkFBWSxFQUFFLFlBQVk7QUFDMUIsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLHFCQUFXLEVBQUUsV0FBVztBQUN4QixpQkFBTyxFQUFFLE9BQU8sRUFDbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztPQUNULENBQUM7S0FDTCxFQUNKLENBQUM7O0FBRUYsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsb0NBQW9DOzs7Ozs7QUFNckUsWUFBUSxFQUFFLElBQUk7Ozs7OztBQU1kLE9BQUcsRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sS0FBSyxDQUFDO0NBQ2hCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuICAgIHZhciBjbyA9IHJlcXVpcmUoXCJjb1wiKTtcclxuXHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlck9mIFJcclxuICAgICAqIFIuU3RvcmUgaXMgYSBnZW5lcmljLCBhYnN0cmFjdCBTdG9yZSByZXByZXNlbnRhdGlvbi4gQSBTdG9yZSBpcyBkZWZpbmVkIGJ5IGl0cyBjYXBhY2l0eSB0byBwcm92aWRlIGNvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCB1cGRhdGVzLlxyXG4gICAgICogYGdldGAgd2lsbCBiZSB1c2VkIGF0IGdldEluaXRpYWxTdGF0ZSB0aW1lLlxyXG4gICAgICogYHN1YmAgd2lsbCBiZSBpbnZva2VkIGF0IGNvbXBvbmVudERpZE1vdW50IHRpbWUuXHJcbiAgICAgKiBgdW5zdWJgIHdpbGwgYmUgaW52b2tlZCBhdCBjb21wb25lbnRXaWxsVW5tb3VudCB0aW1lLlxyXG4gICAgICogYHN1YmAgd2lsbCB0cmlnZ2VyIGEgZGVmZXJyZWQgY2FsbCB0byB0aGUgYHNpZ25hbFVwZGF0ZWAgZnVuY3Rpb24gaXQgaXMgcGFzc2VkLCBzbyBtYWtlIHN1cmUgaXQgaXMgd3JhcHBlZCBpbiBSLkFzeW5jLklmTW91bnRlZCBpZiBuZWNlc3NhcnkuXHJcbiAgICAgKiBQcm92aWRlZCBpbXBsZW1lbnRhdGlvbnM6XHJcbiAgICAgKiAgICAgLSBNZW1vcnlTdG9yZSAoRmx1eC1saWtlLCBjaGFuZ2VzIGFyZSBwdXNoZWQgdmlhIGBzZXRgKVxyXG4gICAgICogICAgIC0gVXBsaW5rU3RvcmUgKFJFU1QgKyB1cGRhdGVzLCBjaGFuZ2VzIGFyZSBwdXNoZWQgdmlhIGBzaWduYWxVcGRhdGVgKVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICogQGNsYXNzIFIuU3RvcmVcclxuICAgICAqL1xyXG4gICAgdmFyIFN0b3JlID0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIDxwPiBJbml0aWFsaXplcyB0aGUgU3RvcmUgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L3A+XHJcbiAgICAgICAgICogQG1ldGhvZCBjcmVhdGVTdG9yZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjcyBPcHRpb25zIHRvIGNyZWF0ZSB0aGUgc3RvcmUuXHJcbiAgICAgICAgICogQHB1YmxpY1xyXG4gICAgICAgICAqIEByZXR1cm4ge1IuU3RvcmUuU3RvcmVJbnN0YW5jZX0gU3RvcmVJbnN0YW5jZSBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNyZWF0ZWQgU3RvcmVJbnN0YW5jZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZShzcGVjcykge1xyXG4gICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGFzc2VydChfLmlzT2JqZWN0KHNwZWNzKSwgXCJjcmVhdGVTdG9yZSguLi4pOiBleHBlY3RpbmcgYW4gT2JqZWN0IGFzIHNwZWNzLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgXCJkaXNwbGF5TmFtZVwiKSAmJiBfLmlzU3RyaW5nKHNwZWNzLmRpc3BsYXlOYW1lKSwgXCJSLlN0b3JlLmNyZWF0ZVN0b3JlKC4uLik6IHJlcXVpcmVzIGRpc3BsYXlOYW1lKFN0cmluZykuXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHNwZWNzLCBcImZldGNoXCIpICYmIF8uaXNGdW5jdGlvbihzcGVjcy5mZXRjaCksIFwiUi5TdG9yZS5jcmVhdGVTdG9yZSguLi4pOiByZXF1aXJlcyBmZXRjaChGdW5jdGlvbihTdHJpbmcpOiBGdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3BlY3MsIFwiZ2V0XCIpICYmIF8uaXNGdW5jdGlvbihzcGVjcy5nZXQpLCBcIlIuU3RvcmUuY3JlYXRlU3RvcmUoLi4uKTogcmVxdWlyZXMgZ2V0KEZ1bmN0aW9uKFN0cmluZyk6ICouXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHNwZWNzLCBcInN1YlwiKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3Muc3ViKSwgXCJSLlN0b3JlLmNyZWF0ZVN0b3JlKC4uLik6IHJlcXVpcmVzIHN1YihGdW5jdGlvbihTdHJpbmcsIEZ1bmN0aW9uKTogUi5TdG9yZS5TdWJzY3JpcHRpb24pLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgXCJ1bnN1YlwiKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MudW5zdWIpLCBcIlIuU3RvcmUuY3JlYXRlU3RvcmUoLi4uKTogcmVxdWlyZXMgdW5zdWIoRnVuY3Rpb24oUi5TdG9yZS5TdWJzY3JpcHRpb24pLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgXCJzZXJpYWxpemVcIikgJiYgXy5pc0Z1bmN0aW9uKHNwZWNzLnNlcmlhbGl6ZSksIFwiUi5TdG9yZS5jcmVhdGVTdG9yZSguLi4pOiByZXF1aXJlcyBzZXJpYWxpemUoKTogU3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgXCJ1bnNlcmlhbGl6ZVwiKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MudW5zZXJpYWxpemUpLCBcIlIuU3RvcmUuY3JlYXRlU3RvcmUoLi4uKTogcmVxdWlyZXMgdW5zZXJpYWxpemUoU3RyaW5nKS5cIik7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3BlY3MsIFwiZGVzdHJveVwiKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MuZGVzdHJveSksIFwiUi5TdG9yZS5jcmVhdGVTdG9yZSguLi4pOiByZXF1aXJlcyBkZXN0cm95KCkuXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBtZW1iZXJPZiBSLlN0b3JlXHJcbiAgICAgICAgICAgICAqIEBtZXRob2QgU3RvcmVJbnN0YW5jZVxyXG4gICAgICAgICAgICAgKiBAcHVibGljXHJcbiAgICAgICAgICAgICAqIEBhYnN0cmFjdFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIFN0b3JlSW5zdGFuY2UgPSBmdW5jdGlvbiBTdG9yZUluc3RhbmNlKCkge307XHJcbiAgICAgICAgICAgIF8uZXh0ZW5kKFN0b3JlSW5zdGFuY2UucHJvdG90eXBlLCBzcGVjcywge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBUeXBlIGRpcnR5LWNoZWNraW5nXHJcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICAgICAgICAgKiBAcmVhZE9ubHlcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgX2lzU3RvcmVJbnN0YW5jZV86IHRydWUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gU3RvcmVJbnN0YW5jZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIDxwPiBSZXByZXNlbnRzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiBpbnRvIGEgU3RvcmUgdG8gYXZvaWQgdGhlIHBhaW4gb2YgcGFzc2luZyBGdW5jdGlvbnMgYmFjayBhbmQgZm9ydGguIDxiciAvPlxyXG4gICAgICAgICAqIEFuIGluc3RhbmNlIG9mIFIuU3RvcmUuU3Vic2NyaXB0aW9uIGlzIHJldHVybmVkIGJ5IHN1YiBhbmQgc2hvdWxkIGJlIHBhc3NlZCB0byB1bnN1Yi4gPC9wPlxyXG4gICAgICAgICAqIEBtZXRob2QgU3Vic2NyaXB0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBcclxuICAgICAgICAgKiBAcHVibGljXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU3Vic2NyaXB0aW9uOiBmdW5jdGlvbiBTdWJzY3JpcHRpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKFwiUi5TdG9yZS5TdWJzY3JpcHRpb25cIik7XHJcbiAgICAgICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogPHA+IEltcGxlbWVudGF0aW9uIG9mIFIuU3RvcmUgdXNpbmcgYSB0cmFkaXRpb25uYWwsIEZsdXgtbGlrZSBtZW1vcnktYmFzZWQgU3RvcmUuIFRoZSBzdG9yZSBpcyByZWFkLW9ubHkgZnJvbSB0aGUgY29tcG9uZW50cyw8YnIgLz5cclxuICAgICAgICAgKiBidXQgaXMgd3JpdGFibGUgZnJvbSB0aGUgdG9wbGV2ZWwgdXNpbmcgXCJzZXRcIi4gV2lyZSB1cCB0byBhIFIuRGlzcGF0Y2hlci5NZW1vcnlEaXNwYXRjaGVyIHRvIGltcGxlbWVudCB0aGUgY2Fub25pY2FsIEZsdXguIDwvcD5cclxuICAgICAgICAgKiBAY2xhc3MgUi5TdG9yZS5NZW1vcnlTdG9yZVxyXG4gICAgICAgICAqIEBpbXBsZW1lbnRzIHtSLlN0b3JlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZU1lbW9yeVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVNZW1vcnlTdG9yZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIE1lbW9yeVN0b3JlKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9kZXN0cm95ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+RmV0Y2ggZGF0YSBhY2NvcmRpbmcgdG8gYSBrZXk8L3A+XHJcbiAgICAgICAgICAgICAgICAqIEBtZXRob2QgZmV0Y2hcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5XHJcbiAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmbiB0aGUgeWllbGRlZCBmb25jdGlvblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBmZXRjaCA9IGZ1bmN0aW9uIGZldGNoKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihmbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighX2Rlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWZlcihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighX2Rlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihudWxsLCBkYXRhW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIDxwPlJldHVybiBkYXRhIGFjY29yZGluZyB0byBhIGtleTwvcD5cclxuICAgICAgICAgICAgICAgICogQG1ldGhvZCBnZXRcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5XHJcbiAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmbiB0aGUgeWllbGRlZCBmb25jdGlvblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBnZXQgPSBmdW5jdGlvbiBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFfLmhhcyhkYXRhLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSLlN0b3JlLk1lbW9yeVN0b3JlLmdldCguLi4pOiBkYXRhIG5vdCBhdmFpbGFibGUuICgnXCIgKyBrZXkgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqIFxyXG4gICAgICAgICAgICAgICAgKiA8cD5UcmlnZ2VyZWQgYnkgdGhlIHNldCBmdW5jdGlvbi4gPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAqIEZldGNoIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBrZXkuIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgKiBDYWxsIHRoZSBzYXZlZCBmdW5jdGlvbiBjb250YWluZWQgaW4gc3Vic2NyaWJlcnMuIDwvcD5cclxuICAgICAgICAgICAgICAgICogQG1ldGhvZCBzaWduYWxVcGRhdGVcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGZldGNoXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHNpZ25hbFVwZGF0ZSA9IGZ1bmN0aW9uIHNpZ25hbFVwZGF0ZShrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZighXy5oYXMoc3Vic2NyaWJlcnMsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSB5aWVsZCBmZXRjaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnNba2V5XSwgZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBcIlIuU3RvcmUuTWVtb3J5U3RvcmUuc2lnbmFsVXBkYXRlKC4uLilcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiA8cD5TZXQgZGF0YSBhY2NvcmRpbmcgdG8gYSBrZXksIHRoZW4gY2FsbCBzaWduYWxVcGRhdGUgaW4gb3JkZXIgdG8gcmVyZW5kZXIgbWF0Y2hpbmcgUmVhY3QgY29tcG9uZW50PC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHNldFxyXG4gICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXlcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHZhbCBUaGUgdmFsXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHNldCA9IGZ1bmN0aW9uIHNldChrZXksIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICBzaWduYWxVcGRhdGUoa2V5KTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IFN1YnNjcmliZSBhdCBhIHNwZWNpZmljIGtleSA8L3A+XHJcbiAgICAgICAgICAgICAgICAqIEBtZXRob2Qgc3ViXHJcbiAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHNwZWNpZmljIGtleSB0byBzdWJzY3JpYmVcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gX3NpZ25hbFVwZGF0ZSB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGwgd2hlbiBhIGRhdGEgY29ycmVzcG9uZGluZyB0byBhIGtleSB3aWxsIGJlIHVwZGF0ZWRcclxuICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBzdWJzY3JpcHRpb24gVGhlIHNhdmVkIHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBzdWIgPSBmdW5jdGlvbiBzdWIoa2V5LCBfc2lnbmFsVXBkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgXCJSLlN0b3JlLk1lbW9yeVN0b3JlLnN1YiguLi4pOiBpbnN0YW5jZSBkZXN0cm95ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgUi5TdG9yZS5TdWJzY3JpcHRpb24oa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpZighXy5oYXMoc3Vic2NyaWJlcnMsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNba2V5XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSBfc2lnbmFsVXBkYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHlpZWxkIGZldGNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVmZXIoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2lnbmFsVXBkYXRlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KFwiUi5TdG9yZS5NZW1vcnlTdG9yZS5zdWIuZmV0Y2goLi4uKTogY291bGRuJ3QgZmV0Y2ggY3VycmVudCB2YWx1ZVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+VW5zdWJzY3JpYmU8L3A+XHJcbiAgICAgICAgICAgICAgICAqIEBtZXRob2QgdW5zdWJcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRoYXQgY29udGFpbnMgdGhlIGtleSB0byB1bnN1c2NyaWJlXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHVuc3ViID0gZnVuY3Rpb24gdW5zdWIoc3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgXCJSLlN0b3JlLk1lbW9yeVN0b3JlLnVuc3ViKC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydChzdWJzY3JpcHRpb24gaW5zdGFuY2VvZiBSLlN0b3JlLlN1YnNjcmlwdGlvbiwgXCJSLlN0b3JlLk1lbW9yeVN0b3JlLnVuc3ViKC4uLik6IHR5cGUgUi5TdG9yZS5TdWJzY3JpcHRpb24gZXhwZWN0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3Vic2NyaWJlcnMsIHN1YnNjcmlwdGlvbi5rZXkpLCBcIlIuU3RvcmUuTWVtb3J5U3RvcmUudW5zdWIoLi4uKTogbm8gc3Vic2NyaWJlcnMgZm9yIHRoaXMga2V5LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldLCBzdWJzY3JpcHRpb24udW5pcXVlSWQpLCBcIlIuU3RvcmUuTWVtb3J5U3RvcmUudW5zdWIoLi4uKTogbm8gc3VjaCBzdWJzY3JpcHRpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF8uc2l6ZShzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IENsZWFuIFVwbGlua1N0b3JlIHN0b3JlIDwvcD5cclxuICAgICAgICAgICAgICAgICogQG1ldGhvZCBkZXN0cm95XHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoIV9kZXN0cm95ZWQsIFwiUi5TdG9yZS5NZW1vcnlTdG9yZS5kZXN0cm95KC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN1YnNjcmliZXJzLCBmdW5jdGlvbihrZXlTdWJzY3JpYmVycywga2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChzdWJzY3JpYmVyc1trZXldLCBmdW5jdGlvbihmbiwgdW5pcXVlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1trZXldW3VuaXF1ZUlkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1trZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBfZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IFNlcmlhbGl6ZSB0aGUgVXBsaW5rU3RvcmUgc3RvcmUgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxyXG4gICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGRhdGEgVGhlIHNlcmlhbGl6ZWQgVXBsaW5rU3RvcmUgc3RvcmVcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IFVuc2VyaWFsaXplIHRoZSBNZW1vcnlTdG9yZSBzdG9yZSA8L3A+XHJcbiAgICAgICAgICAgICAgICAqIEBtZXRob2QgdW5zZXJpYWxpemVcclxuICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHVuc2VyaWFsaXNlXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHVuc2VyaWFsaXplID0gZnVuY3Rpb24gdW5zZXJpYWxpemUoc3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQoZGF0YSwgSlNPTi5wYXJzZShzdHIpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IChSLlN0b3JlLmNyZWF0ZVN0b3JlKHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJNZW1vcnlTdG9yZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIF9kYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIF9zdWJzY3JpYmVyczogc3Vic2NyaWJlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2g6IGZldGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Yjogc3ViLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViOiB1bnN1YixcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuc2VyaWFsaXplOiB1bnNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgICAgIH0pKSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIDxwPiBJbXBsZW1lbnRhdGlvbiBvZiBSLlN0b3JlIHVzaW5nIGEgcmVtb3RlLCBIVFRQIHBhc3NpdmUgU3RvcmUuIFRoZSBzdG9yZSBpcyByZWFkLW9ubHkgZnJvbSB0aGUgY29tcG9uZW50cywgPGJyIC8+XHJcbiAgICAgICAgICogYXMgd2VsbCBhcyBmcm9tIHRoZSBDbGllbnQgaW4gZ2VuZXJhbC4gSG93ZXZlciwgaXRzIHZhbHVlcyBtYXkgYmUgdXBkYXRlZCBhY3Jvc3MgcmVmcmVzaGVzL3JlbG9hZHMsIGJ1dCB0aGUgcmVtb3RlIDxiciAvPlxyXG4gICAgICAgICAqIGJhY2tlbmQgc2hvdWxkIGJlIHdpcmVkLXVwIHdpdGggUi5EaXNwYXRjaGVyLkhUVFBEaXNwYXRjaGVyIHRvIGltcGxlbWVudCBhIHNlY29uZC1jbGFzcyBvdmVyLXRoZS13aXJlIEZsdXguIDwvcD5cclxuICAgICAgICAgKi9cclxuICAgICAgICBjcmVhdGVIVFRQU3RvcmU6IGZ1bmN0aW9uIGNyZWF0ZUhUVFBTdG9yZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIEhUVFBTdG9yZShodHRwKSB7XHJcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoaHR0cC5mZXRjaCAmJiBfLmlzRnVuY3Rpb24oaHR0cC5mZXRjaCksIFwiUi5TdG9yZS5jcmVhdGVIVFRQU3RvcmUoLi4uKS5odHRwLmZldGNoOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2ZldGNoID0gaHR0cC5mZXRjaDtcclxuICAgICAgICAgICAgICAgIHZhciBfZGVzdHJveWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1YnNjcmliZXJzID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgZmV0Y2ggPSBmdW5jdGlvbiogZmV0Y2goa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHlpZWxkIF9mZXRjaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFfZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlIuU3RvcmUuSFRUUFN0b3JlLmZldGNoKC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFfLmhhcyhkYXRhLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlIuU3RvcmUuTWVtb3J5U3RvcmUuZ2V0KC4uLik6IGRhdGEgbm90IGF2YWlsYWJsZS4gKCdcIiArIGtleSArIFwiJylcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzdWIgPSBmdW5jdGlvbiBzdWIoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBSLlN0b3JlLlN1YnNjcmlwdGlvbihrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFfLmhhcyhzdWJzY3JpYmVycywga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1trZXldID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXSA9IHN1YnNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdW5zdWIgPSBmdW5jdGlvbiB1bnN1YihzdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KCFfZGVzdHJveWVkLCBcIlIuU3RvcmUuVXBsaW5rU3RvcmUudW5zdWIoLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KHN1YnNjcmlwdGlvbiBpbnN0YW5jZW9mIFIuU3RvcmUuU3Vic2NyaXB0aW9uLCBcIlIuU3RvcmUuVXBsaW5rU3RvcmUudW5zdWIoLi4uKTogdHlwZSBSLlN0b3JlLlN1YnNjcmlwdGlvbiBleHBlY3RlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzdWJzY3JpYmVycywgc3Vic2NyaXB0aW9uLmtleSksIFwiUi5TdG9yZS5VcGxpbmtTdG9yZS51bnN1YiguLi4pOiBubyBzdWJzY3JpYmVycyBmb3IgdGhpcyBrZXkuICgnXCIgKyBzdWJzY3JpcHRpb24ua2V5ICsgXCInKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldLCBzdWJzY3JpcHRpb24udW5pcXVlSWQpLCBcIlIuU3RvcmUuVXBsaW5rU3RvcmUudW5zdWIoLi4uKTogbm8gc3VjaCBzdWJzY3JpcHRpb24uICgnXCIgKyBzdWJzY3JpcHRpb24ua2V5ICsgXCInLCAnXCIgKyBzdWJzY3JpcHRpb24udW5pcXVlSWQgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF8uc2l6ZShzdWJzY3JpYmVyc1tzdWJzY3JpcHRpb24ua2V5XSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfLmhhcyhkYXRhLCBzdWJzY3JpcHRpb24ua2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFbc3Vic2NyaXB0aW9uLmtleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZXJpYWxpemUgPSBmdW5jdGlvbiBzZXJpYWxpemUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdW5zZXJpYWxpemUgPSBmdW5jdGlvbiB1bnNlcmlhbGl6ZShzdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChkYXRhLCBKU09OLnBhcnNlKHN0cikpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgXCJSLlN0b3JlLlVwbGlua1N0b3JlLmRlc3Ryb3koLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnMsIGZ1bmN0aW9uKGtleVN1YnNjcmliZXJzLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN1YnNjcmliZXJzW2tleV0sIHVuc3ViKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgKFIuU3RvcmUuY3JlYXRlU3RvcmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkhUVFBTdG9yZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIF9kYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIF9zdWJzY3JpYmVyczogc3Vic2NyaWJlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2g6IGZldGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Yjogc3ViLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuc3ViOiB1bnN1YixcclxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgICAgICAgICB1bnNlcmlhbGl6ZTogdW5zZXJpYWxpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveSxcclxuICAgICAgICAgICAgICAgIH0pKSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogPHA+SW1wbGVtZW50YXRpb24gb2YgUi5TdG9yZSB1c2luZyBhIHJlbW90ZSwgUkVTVC1saWtlIFN0b3JlLiBUaGUgc3RvcmUgaXMgcmVhZC1vbmx5IGZyb20gdGhlIGNvbXBvbmVudHMsIDxiciAvPlxyXG4gICAgICAgICAqIGFzIHdlbGwgYXMgZnJvbSB0aGUgQ2xpZW50IGluIGdlbmVyYWwsIGJ1dCB0aGUgcmVtb3RlIGJhY2tlbmQgc2hvdWxkIGJlIHdpcmVkLXVwIHdpdGggUi5EaXNwYXRjaGVyLlVwbGlua0Rpc3BhdGNoZXIgdG8gXHJcbiAgICAgICAgICogaW1wbGVtZW50IHRoZSBvdmVyLXRoZS13aXJlIEZsdXguIDwvcD5cclxuICAgICAgICAgKiBAY2xhc3MgUi5TdG9yZS5VcGxpbmtTdG9yZVxyXG4gICAgICAgICAqIEBpbXBsZW1lbnRzIHtSLlN0b3JlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZVVwbGlua1N0b3JlOiBmdW5jdGlvbiBjcmVhdGVVcGxpbmtTdG9yZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIFVwbGlua1N0b3JlKHVwbGluaykge1xyXG4gICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KHVwbGluay5mZXRjaCAmJiBfLmlzRnVuY3Rpb24odXBsaW5rLmZldGNoKSwgXCJSLlN0b3JlLmNyZWF0ZVVwbGlua1N0b3JlKC4uLikudXBsaW5rLmZldGNoOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCh1cGxpbmsuc3Vic2NyaWJlVG8gJiYgXy5pc0Z1bmN0aW9uKHVwbGluay5zdWJzY3JpYmVUbyksIFwiUi5TdG9yZS5jcmVhdGVVcGxpbmtTdG9yZSguLi4pLnVwbGluay5zdWJzY3JpYmVUbzogZXhwZWN0aW5nIEZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQodXBsaW5rLnVuc3Vic2NyaWJlRnJvbSAmJiBfLmlzRnVuY3Rpb24odXBsaW5rLnVuc3Vic2NyaWJlRnJvbSksIFwiUi5TdG9yZS5jcmVhdGVVcGxpbmtTdG9yZSguLi4pLnVwbGluay51bnN1YnNjcmliZUZyb206IGV4cGVjdGluZyBGdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBfZmV0Y2ggPSB1cGxpbmsuZmV0Y2g7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaWJlVG8gPSB1cGxpbmsuc3Vic2NyaWJlVG87XHJcbiAgICAgICAgICAgICAgICB2YXIgdW5zdWJzY3JpYmVGcm9tID0gdXBsaW5rLnVuc3Vic2NyaWJlRnJvbTtcclxuICAgICAgICAgICAgICAgIF9kZXN0cm95ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaWJlcnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVycyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiA8cD5GZXRjaCBkYXRhIGFjY29yZGluZyB0byBhIGtleTwvcD5cclxuICAgICAgICAgICAgICAgICogQG1ldGhvZCBmZXRjaFxyXG4gICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXlcclxuICAgICAgICAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IGZuIHRoZSB5aWVsZGVkIGZvbmN0aW9uXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGZldGNoID0gZnVuY3Rpb24qIGZldGNoKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSB5aWVsZCBfZmV0Y2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpZighX2Rlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSLlN0b3JlLlVwbGlua1N0b3JlLmZldGNoKC4uLik6IGluc3RhbmNlIGRlc3Ryb3llZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBnZXQgPSBmdW5jdGlvbiBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFfLmhhcyhkYXRhLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSLlN0b3JlLlVwbGlua1N0b3JlLmdldCguLi4pOiBkYXRhIG5vdCBhdmFpbGFibGUuICgnXCIgKyBrZXkgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKiogXHJcbiAgICAgICAgICAgICAgICAqIDxwPlRyaWdnZXJlZCBieSB0aGUgc29ja2V0Lm9uKFwidXBkYXRlXCIpIGV2ZW50IGluIFIuVXBsaW5rIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgKiBGZXRjaCBkYXRhIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4ga2V5IDxiciAvPlxyXG4gICAgICAgICAgICAgICAgKiBDYWxsIHRoZSBzYXZlZCBmdW5jdGlvbiBjb250YWluZWQgaW4gc3Vic2NyaWJlcnMgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHNpZ25hbFVwZGF0ZVxyXG4gICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gZmV0Y2hcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgc2lnbmFsVXBkYXRlID0gZnVuY3Rpb24gc2lnbmFsVXBkYXRlKGtleSwgdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIV8uaGFzKHN1YnNjcmliZXJzLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN1YnNjcmliZXJzW2tleV0sIGZ1bmN0aW9uKGZuLCB1bmlxdWVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihmbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm4odmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIDxwPiBTdWJzY3JpYmUgYXQgYSBzcGVjaWZpYyBrZXkgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHN1YlxyXG4gICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBzcGVjaWZpYyBrZXkgdG8gc3Vic2NyaWJlXHJcbiAgICAgICAgICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IF9zaWduYWxVcGRhdGUgdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsIHdoZW4gYSBkYXRhIGNvcnJlc3BvbmRpbmcgdG8gYSBrZXkgd2lsbCBiZSB1cGRhdGVkXHJcbiAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gc3Vic2NyaXB0aW9uIFRoZSBzYXZlZCBzdWJzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgc3ViID0gZnVuY3Rpb24gc3ViKGtleSwgX3NpZ25hbFVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoIV9kZXN0cm95ZWQsIFwiUi5TdG9yZS5VcGxpbmtTdG9yZS5zdWIoLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLiAoJ1wiICsga2V5ICsgXCInKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IFIuU3RvcmUuU3Vic2NyaXB0aW9uKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIV8uaGFzKHN1YnNjcmliZXJzLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2tleV0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBzdWJzY3JpYmVUbyBmcm9tIFIuVXBsaW5rID0+IGVtaXQgXCJzdWJzY3JpYmVUb1wiIHNpZ25hbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVyc1trZXldID0gc3Vic2NyaWJlVG8oa2V5LCBzaWduYWxVcGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSBfc2lnbmFsVXBkYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHlpZWxkIGZldGNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVmZXIoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2lnbmFsVXBkYXRlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KFwiUi5TdG9yZS5zdWIuZmV0Y2goLi4uKTogZGF0YSBub3QgYXZhaWxhYmxlLiAoJ1wiICsga2V5ICsgXCInKVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IFVuc3Vic2NyaWJlPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHVuc3ViXHJcbiAgICAgICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBrZXkgdG8gdW5zdXNjcmliZVxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciB1bnN1YiA9IGZ1bmN0aW9uIHVuc3ViKHN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoIV9kZXN0cm95ZWQsIFwiUi5TdG9yZS5VcGxpbmtTdG9yZS51bnN1YiguLi4pOiBpbnN0YW5jZSBkZXN0cm95ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoc3Vic2NyaXB0aW9uIGluc3RhbmNlb2YgUi5TdG9yZS5TdWJzY3JpcHRpb24sIFwiUi5TdG9yZS5VcGxpbmtTdG9yZS51bnN1YiguLi4pOiB0eXBlIFIuU3RvcmUuU3Vic2NyaXB0aW9uIGV4cGVjdGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHN1YnNjcmliZXJzLCBzdWJzY3JpcHRpb24ua2V5KSwgXCJSLlN0b3JlLlVwbGlua1N0b3JlLnVuc3ViKC4uLik6IG5vIHN1YnNjcmliZXJzIGZvciB0aGlzIGtleS4gKCdcIiArIHN1YnNjcmlwdGlvbi5rZXkgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3Vic2NyaWJlcnNbc3Vic2NyaXB0aW9uLmtleV0sIHN1YnNjcmlwdGlvbi51bmlxdWVJZCksIFwiUi5TdG9yZS5VcGxpbmtTdG9yZS51bnN1YiguLi4pOiBubyBzdWNoIHN1YnNjcmlwdGlvbi4gKCdcIiArIHN1YnNjcmlwdGlvbi5rZXkgKyBcIicsICdcIiArIHN1YnNjcmlwdGlvbi51bmlxdWVJZCArIFwiJylcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5zaXplKHN1YnNjcmliZXJzW3N1YnNjcmlwdGlvbi5rZXldKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uLmtleSwgdXBkYXRlcnNbc3Vic2NyaXB0aW9uLmtleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc3Vic2NyaWJlcnNbc3Vic2NyaXB0aW9uLmtleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1cGRhdGVyc1tzdWJzY3JpcHRpb24ua2V5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoXy5oYXMoZGF0YSwgc3Vic2NyaXB0aW9uLmtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhW3N1YnNjcmlwdGlvbi5rZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICogPHA+IFNlcmlhbGl6ZSB0aGUgVXBsaW5rU3RvcmUgc3RvcmUgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxyXG4gICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGRhdGEgVGhlIHNlcmlhbGl6ZWQgVXBsaW5rU3RvcmUgc3RvcmVcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAqIDxwPiBVbnNlcmlhbGl6ZSB0aGUgVXBsaW5rU3RvcmUgc3RvcmUgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIHVuc2VyaWFsaXplXHJcbiAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB1bnNlcmlhbGlzZVxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciB1bnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHVuc2VyaWFsaXplKHN0cikge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKGRhdGEsIEpTT04ucGFyc2Uoc3RyKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgKiA8cD4gQ2xlYW4gVXBsaW5rU3RvcmUgc3RvcmUgPC9wPlxyXG4gICAgICAgICAgICAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydCghX2Rlc3Ryb3llZCwgXCJSLlN0b3JlLlVwbGlua1N0b3JlLmRlc3Ryb3koLi4uKTogaW5zdGFuY2UgZGVzdHJveWVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goc3Vic2NyaWJlcnMsIGZ1bmN0aW9uKGtleVN1YnNjcmliZXJzLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHN1YnNjcmliZXJzW2tleV0sIHVuc3ViKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlcnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIF9kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgKFIuU3RvcmUuY3JlYXRlU3RvcmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlVwbGlua1N0b3JlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgX2RhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmliZXJzOiBzdWJzY3JpYmVycyxcclxuICAgICAgICAgICAgICAgICAgICBfdXBkYXRlcnM6IHVwZGF0ZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoOiBmZXRjaCxcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGdldCxcclxuICAgICAgICAgICAgICAgICAgICBzdWI6IHN1YixcclxuICAgICAgICAgICAgICAgICAgICB1bnN1YjogdW5zdWIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2lnbmFsVXBkYXRlOiBzaWduYWxVcGRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgdW5zZXJpYWxpemU6IHVuc2VyaWFsaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXHJcbiAgICAgICAgICAgICAgICB9KSkoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBfLmV4dGVuZChTdG9yZS5TdWJzY3JpcHRpb24ucHJvdG90eXBlLCAvKiogQGxlbmRzIFIuU3RvcmUuU3Vic2NyaXB0aW9uICove1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICAgKiBAcmVhZE9ubHlcclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVuaXF1ZUlkOiBudWxsLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICAgKiBAcmVhZE9ubHlcclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGtleTogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBTdG9yZTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9