module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");

    var count = 0;

    /**
     * @memberOf R
     * @class R.Store is a generic, abstract Store representation. A Store is defined by its capacity to provide components with data and updates.
     * `get` will be used at getInitialState time.
     * `sub` will be invoked at componentDidMount time.
     * `unsub` will be invoked at componentWillUnmount time.
     * `sub` will trigger a deferred call to the `signalUpdate` function it is passed, so make sure it is wrapped in R.Async.IfMounted if necessary.
     * Provided implementations:
     *     - MemoryStore (Flux-like, changes are pushed via `set`)
     *     - UplinkStore (REST + updates, changes are pushed via `signalUpdate`)
     * @public
     */
    var Store = {
        /**
         * @param {Object} specs Options to create the store.
         * @public
         * @return {R.Store.StoreInstance}
         */
        createStore: function createStore(specs) {
            R.Debug.dev(function() {
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
             * @class
             * @memberOf R.Store
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
                _isStoreInstance_: true,
            });
            return StoreInstance;
        },
        /**
         * @class Represents a single subscription into a Store to avoid the pain of passing Functions back and forth.
         * An instance of R.Store.Subscription is returned by sub and should be passed to unsub.
         * @public
         */
        Subscription: function Subscription(key) {
            this.uniqueId = _.uniqueId("R.Store.Subscription");
            this.key = key;
        },
        /**
         * @class Implementation of R.Store using a traditionnal, Flux-like memory-based Store. The store is read-only from the components,
         * but is writable from the toplevel using "set". Wire up to a R.Dispatcher.MemoryDispatcher to implement the canonical Flux.
         * @implements {R.Store}
         */
        createMemoryStore: function createMemoryStore() {
            var _destroyed = false;
            var data = {};
            var subscribers = {};
            var fetch = function fetch(key) {
                return function(fn) {
                    if(!_destroyed) {
                        _.defer(function() {
                            if(!_destroyed) {
                                fn(null, data[key]);
                            }
                        });
                    }
                };
            };
            var get = function get(key) {
                R.Debug.dev(function() {
                    assert(_.has(data, key), "R.Store.MemoryStore.get(...): data not available. ('" + key + "')");
                });
                return data[key];
            };
            var signalUpdate = function signalUpdate(key) {
                if(!_.has(subscribers, key)) {
                    return;
                }
                co(regeneratorRuntime.mark(function callee$3$0() {
                    var val;

                    return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            context$4$0.next = 2;
                            return fetch(key);
                        case 2:
                            val = context$4$0.sent;
                            _.each(subscribers[key], R.callWith(val));
                        case 4:
                        case "end":
                            return context$4$0.stop();
                        }
                    }, callee$3$0, this);
                })).call(this, "R.Store.MemoryStore.signalUpdate(...)");
            };
            var set = function set(key, val) {
                data[key] = val;
                signalUpdate(key);
            };
            var sub = function sub(key, _signalUpdate) {
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.MemoryStore.sub(...): instance destroyed.");
                });
                var subscription = new R.Store.Subscription(key);
                if(!_.has(subscribers, key)) {
                    subscribers[key] = {};
                }
                subscribers[key][subscription.uniqueId] = _signalUpdate;
                console.warn("sub", key, subscription.uniqueId);
                co(regeneratorRuntime.mark(function callee$3$0() {
                    var val;

                    return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            context$4$0.next = 2;
                            return fetch(key);
                        case 2:
                            val = context$4$0.sent;
                            _signalUpdate(val);
                        case 4:
                        case "end":
                            return context$4$0.stop();
                        }
                    }, callee$3$0, this);
                })).call(this, R.Debug.rethrow("R.Store.MemoryStore.sub.fetch(...): couldn't fetch current value"));
                return subscription;
            };
            var unsub = function unsub(subscription) {
                console.warn("unsub", subscription.key, subscription.uniqueId);
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.MemoryStore.unsub(...): instance destroyed.");
                    assert(subscription instanceof R.Store.Subscription, "R.Store.MemoryStore.unsub(...): type R.Store.Subscription expected.");
                    assert(_.has(subscribers, subscription.key), "R.Store.MemoryStore.unsub(...): no subscribers for this key.");
                    assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.MemoryStore.unsub(...): no such subscription.");
                });
                console.warn("ok");
                delete subscribers[subscription.key][subscription.uniqueId];
                if(_.size(subscribers[subscription.key]) === 0) {
                    delete subscribers[subscription.key];
                }
            };
            var destroy = function destroy() {
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.MemoryStore.destroy(...): instance destroyed.");
                });
                _.each(subscribers, function(keySubscribers, key) {
                    _.each(subscribers[key], function(fn, uniqueId) {
                        delete subscribers[key][uniqueId];
                    });
                    delete subscribers[key];
                });
                subscribers = null;
                _.each(data, function(val, key) {
                    delete data[key];
                });
                data = null;
                _destroyed = true;
            };
            var serialize = function serialize() {
                return JSON.stringify(data);
            };
            var unserialize = function unserialize(str) {
                _.extend(data, JSON.parse(str));
            };
            return R.Store.createStore({
                displayName: "MemoryStore",
                _data: data,
                fetch: fetch,
                get: get,
                sub: sub,
                unsub: unsub,
                destroy: destroy,
                set: set,
                serialize: serialize,
                unserialize: unserialize,
            });
        },
        /**
         * @class Implementation of R.Store using a remote, REST-like Store. The store is read-only from the components,
         * as well as from the Client in general, but the remote backend should be wired-up with R.Dispatcher.UplinkDispatcher to
         * implement the over-the-wire Flux.
         * @implements {R.Store}
         */
        createUplinkStore: function createUplinkStore(_fetch, subscribe, unsubscribe) {
            _destroyed = false;
            var data = {};
            var subscribers = {};
            var updaters = {};
            var fetch = regeneratorRuntime.mark(function fetch(key) {
                var val;

                return regeneratorRuntime.wrap(function fetch$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return _fetch(key);
                    case 2:
                        val = context$3$0.sent;

                        if (_destroyed) {
                            context$3$0.next = 8;
                            break;
                        }

                        data[key] = val;
                        return context$3$0.abrupt("return", val);
                    case 8:
                        throw new Error("R.Store.UplinkStore.fetch(...): instance destroyed.");
                    case 9:
                    case "end":
                        return context$3$0.stop();
                    }
                }, fetch, this);
            });
            var get = function get(key) {
                R.Debug.dev(function() {
                    assert(_.has(data, key), "R.Store.UplinkStore.get(...): data not available. ('" + key + "')");
                });
                return data[key];
            };
            var signalUpdate = function signalUpdate(key) {
                if(!_.has(subscribers, key)) {
                    return;
                }
                co(regeneratorRuntime.mark(function callee$3$0() {
                    var val;

                    return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            context$4$0.next = 2;
                            return fetch(key);
                        case 2:
                            val = context$4$0.sent;
                            if(_.has(subscribers, key)) {
                                console.warn("subscribers of", key);
                                _.each(subscribers[key], function(fn) {
                                    console.warn({fn: fn});
                                });
                                _.each(subscribers[key], R.callWith(val));
                            }
                        case 4:
                        case "end":
                            return context$4$0.stop();
                        }
                    }, callee$3$0, this);
                })).call(this, R.Debug.rethrow("R.Store.UplinkStore.signalUpdate(...) ('" + key + "')"));
            };
            var sub = function sub(key, _signalUpdate) {
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.UplinkStore.sub(...): instance destroyed. ('" + key + "')");
                });
                var subscription = new R.Store.Subscription(key);
                if(!_.has(subscribers, key)) {
                    subscribers[key] = {};
                    updaters[key] = subscribe(key, _.partial(signalUpdate, key));
                }
                subscribers[key][subscription.uniqueId] = _signalUpdate;
                co(regeneratorRuntime.mark(function callee$3$0() {
                    var val;

                    return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                        while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            context$4$0.next = 2;
                            return fetch(key);
                        case 2:
                            val = context$4$0.sent;
                            _signalUpdate(val);
                        case 4:
                        case "end":
                            return context$4$0.stop();
                        }
                    }, callee$3$0, this);
                })).call(this, R.Debug.rethrow("R.Store.sub.fetch(...): data not available. ('" + key + "')"));
                return subscription;
            };
            var unsub = function unsub(subscription) {
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.UplinkStore.unsub(...): instance destroyed.");
                    assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsubscribe(...): type R.Store.Subscription expected.");
                    assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsubscribe(...): no subscribers for this key. ('" + subscription.key + "')");
                    assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsubscribe(...): no such subscription. ('" + subscription.key + "', '" + subscription.uniqueId + "')");
                });
                delete subscribers[subscription.key][subscription.uniqueId];
                if(_.size(subscribers[subscription.key]) === 0) {
                    unsubscribe(subscription.key, updaters[subscription.key]);
                    delete subscribers[subscription.key];
                    delete updaters[subscription.key];
                }
            };

            var serialize = function serialize() {
                return JSON.stringify(data);
            };
            var unserialize = function unserialize(str) {
                _.extend(data, JSON.parse(str));
            };
            var destroy = function destroy() {
                R.Debug.dev(function() {
                    assert(!_destroyed, "R.Store.UplinkStore.destroy(...): instance destroyed.");
                });
                _.each(subscribers, function(keySubscribers, key) {
                    _.each(subscribers[key], function(fn, uniqueId) {
                        delete subscribers[key][uniqueId];
                    });
                    delete subscribers[key];
                });
                _.each(updaters, function(updater, key) {
                    unsubscribe(key, updater);
                    delete updaters[key];
                });
                _.each(data, function(val, key) {
                    delete data[key];
                });
                data = null;
                subscribers = null;
                updaters = null;
                _destroyed = true;
            };
            return R.Store.createStore({
                displayName: "UplinkStore",
                _data: data,
                fetch: fetch,
                get: get,
                sub: sub,
                unsub: unsub,
                signalUpdate: signalUpdate,
                serialize: serialize,
                unserialize: unserialize,
                destroy: destroy,
            });
        },
    };

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
        key: null,
    });

    R.Store = Store;
    return R;
};
