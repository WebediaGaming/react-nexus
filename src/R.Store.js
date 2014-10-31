module.exports = function(R) {
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
                _isStoreInstance_: true,
            });
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

                /**
                * <p>Return data according to a key</p>
                * @method get
                * @param {string} key The key
                * @return {Function} fn the yielded fonction
                */
                var get = function get(key) {
                    R.Debug.dev(function() {
                        if(!_.has(data, key)) {
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
                    if(!_.has(subscribers, key)) {
                        return;
                    }
                    co(function*() {
                        var val = yield fetch(key);
                        _.each(subscribers[key], function(fn) {
                            if(fn) {
                                fn(val);
                            }
                        });
                    }).call(this, "R.Store.MemoryStore.signalUpdate(...)");
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
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.MemoryStore.sub(...): instance destroyed.");
                    });
                    var subscription = new R.Store.Subscription(key);
                    if(!_.has(subscribers, key)) {
                        subscribers[key] = {};
                    }
                    subscribers[key][subscription.uniqueId] = _signalUpdate;
                    co(function*() {
                        var val = yield fetch(key);
                        _.defer(function() {
                            _signalUpdate(val);
                        });
                    }).call(this, R.Debug.rethrow("R.Store.MemoryStore.sub.fetch(...): couldn't fetch current value"));
                    return subscription;
                };
                /**
                * <p>Unsubscribe</p>
                * @method unsub
                * @param {object} subscription The subscription that contains the key to unsuscribe
                */
                var unsub = function unsub(subscription) {
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.MemoryStore.unsub(...): instance destroyed.");
                        assert(subscription instanceof R.Store.Subscription, "R.Store.MemoryStore.unsub(...): type R.Store.Subscription expected.");
                        assert(_.has(subscribers, subscription.key), "R.Store.MemoryStore.unsub(...): no subscribers for this key.");
                        assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.MemoryStore.unsub(...): no such subscription.");
                    });
                    delete subscribers[subscription.key][subscription.uniqueId];
                    if(_.size(subscribers[subscription.key]) === 0) {
                        delete subscribers[subscription.key];
                    }
                };
                /**
                * <p> Clean UplinkStore store </p>
                * @method destroy
                */
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
                    unserialize: unserialize,
                }))();
            };

        },
        /**
         * <p> Implementation of R.Store using a remote, HTTP passive Store. The store is read-only from the components, <br />
         * as well as from the Client in general. However, its values may be updated across refreshes/reloads, but the remote <br />
         * backend should be wired-up with R.Dispatcher.HTTPDispatcher to implement a second-class over-the-wire Flux. </p>
         */
        createHTTPStore: function createHTTPStore() {
            return function HTTPStore(http) {
                R.Debug.dev(function() {
                    assert(http.fetch && _.isFunction(http.fetch), "R.Store.createHTTPStore(...).http.fetch: expecting Function.");
                });
                var _fetch = http.fetch;
                var _destroyed = false;
                var data = {};
                var subscribers = {};
                var fetch = function* fetch(key) {
                    var val = yield _fetch(key);
                    if(!_destroyed) {
                        data[key] = val;
                        return val;
                    }
                    else {
                        throw new Error("R.Store.HTTPStore.fetch(...): instance destroyed.");
                    }
                };

                var get = function get(key) {
                    if(!_.has(data, key)) {
                        console.warn("R.Store.MemoryStore.get(...): data not available. ('" + key + "')");
                    }
                    return data[key];
                };

                var sub = function sub(key) {
                    var subscription = new R.Store.Subscription(key);
                    if(!_.has(subscribers, key)) {
                        subscribers[key] = {};
                    }
                    subscribers[key][subscription.uniqueId] = subscription;
                    return subscription;
                };

                var unsub = function unsub(subscription) {
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.UplinkStore.unsub(...): instance destroyed.");
                        assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.");
                        assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsub(...): no subscribers for this key. ('" + subscription.key + "')");
                        assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsub(...): no such subscription. ('" + subscription.key + "', '" + subscription.uniqueId + "')");
                    });
                    delete subscribers[subscription.key][subscription.uniqueId];
                    if(_.size(subscribers[subscription.key]) === 0) {
                        delete subscribers[subscription.key];
                        if(_.has(data, subscription.key)) {
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
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.UplinkStore.destroy(...): instance destroyed.");
                    });
                    _.each(subscribers, function(keySubscribers, key) {
                        _.each(subscribers[key], unsub);
                    });
                    _.each(data, function(val, key) {
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
                    destroy: destroy,
                }))();
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
                R.Debug.dev(function() {
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
                var fetch = function* fetch(key) {
                    var val = yield _fetch(key);
                    if(!_destroyed) {
                        data[key] = val;
                        return val;
                    }
                    else {
                        throw new Error("R.Store.UplinkStore.fetch(...): instance destroyed.");
                    }
                };
                var get = function get(key) {
                    R.Debug.dev(function() {
                        if(!_.has(data, key)) {
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
                    if(!_.has(subscribers, key)) {
                        return;
                    }
                    _.each(subscribers[key], function(fn, uniqueId) {
                        if(fn) {
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
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.UplinkStore.sub(...): instance destroyed. ('" + key + "')");
                    });
                    var subscription = new R.Store.Subscription(key);
                    if(!_.has(subscribers, key)) {
                        subscribers[key] = {};
                        // call subscribeTo from R.Uplink => emit "subscribeTo" signal
                        updaters[key] = subscribeTo(key, signalUpdate);
                    }
                    subscribers[key][subscription.uniqueId] = _signalUpdate;
                    co(function*() {
                        var val = yield fetch(key);
                        _.defer(function() {
                            _signalUpdate(val);
                        });
                    }).call(this, R.Debug.rethrow("R.Store.sub.fetch(...): data not available. ('" + key + "')"));
                    return subscription;
                };
                /**
                * <p> Unsubscribe</p>
                * @method unsub
                * @param {object} subscription The subscription that contains the key to unsuscribe
                */
                var unsub = function unsub(subscription) {
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.UplinkStore.unsub(...): instance destroyed.");
                        assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.");
                        assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsub(...): no subscribers for this key. ('" + subscription.key + "')");
                        assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsub(...): no such subscription. ('" + subscription.key + "', '" + subscription.uniqueId + "')");
                    });
                    delete subscribers[subscription.key][subscription.uniqueId];
                    if(_.size(subscribers[subscription.key]) === 0) {
                        unsubscribeFrom(subscription.key, updaters[subscription.key]);
                        delete subscribers[subscription.key];
                        delete updaters[subscription.key];
                        if(_.has(data, subscription.key)) {
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
                    R.Debug.dev(function() {
                        assert(!_destroyed, "R.Store.UplinkStore.destroy(...): instance destroyed.");
                    });
                    _.each(subscribers, function(keySubscribers, key) {
                        _.each(subscribers[key], unsub);
                    });
                    _.each(data, function(val, key) {
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
                    destroy: destroy,
                }))();
            };
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

    return Store;
};
