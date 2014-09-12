var assert = require("assert");
var _ = require("_");
var R = require("../");

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
            assert(_.has(specs, "displayName") && _.isString(displayName), "R.Store.createStore(...): requires displayName(String).");
            assert(_.has(specs, "get") && _.isFunction("get"), "R.Store.createStore(...): requires get(Function(String): *).");
            assert(_.has(specs, "sub") && _.isFunction("sub"), "R.Store.createStore(...): requires sub(Function(String, Function): R.Store.Subscription).");
            assert(_.has(specs, "unsub") && _.isFunction("unsub"), "R.Store.createStore(...): requires unsub(Function(R.Store.Subscription).");
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
        this.uniqueId = _.uniqueId("Subscription");
        this.key = key;
    },
    /**
     * @class Implementation of R.Store using a traditionnal, Flux-like memory-based Store. The store is read-only from the components,
     * but is writable from the toplevel using "set". Wire up to a R.Dispatcher.MemoryDispatcher to implement the canonical Flux.
     * @implements {R.Store}
     */
    MemoryStore: function MemoryStore() {
        var data = {};
        var subscribers = {};
        var get = function get(key) {
            return function(fn) {
                _.defer(function() {
                    fn(data[key]);
                });
            };
        };
        var signalUpdate = function signalUpdate(key) {
            if(!_.has(subscribers, key)) {
                return;
            }
            get(key)(function(val) {
                if(!_.has(subscribers, key)) {
                    return;
                }
                _.each(subscribers[key], R.callWith(val));
            });
        };
        var set = function set(key, val) {
            data[key] = val;
            signalUpdate(key);
        };
        var sub = function sub(key, signalUpdate) {
            var subscription = new R.Store.Subscription(key);
            if(!_.has(subscribers, key)) {
                subscription[key] = {};
            }
            subscribers[subscription.uniqueId] = signalUpdate;
            get(key)(signalUpdate);
            return subscription;
        };
        var unsub = function unsub(subscription) {
            R.Debug.dev(function() {
                assert(subscription instanceof R.Store.Subscription, "R.Store.MemoryStore.unsubscribe(...): type R.Store.Subscription expected.");
                assert(_.has(subscribers, subscription.key), "R.Store.MemoryStore.unsubscribe(...): no subscribers for this key.");
                assert(_.has(subscribers[key], subscription.uniqueId), "R.Store.MemoryStore.unsubscribe(...): no such subscription.");
            });
            delete subscribers[subscription.key][subscription.uniqueId];
            if(_.size(subscribers[subscribers]) === 0) {
                delete subscribers[subscription.key];
            }
        };
        return new R.Store.createStore({
            displayName: "MemoryStore",
            get: get,
            sub: sub,
            unsub: unsub,
            set: set,
        });
    },
    /**
     * @class Implementation of R.Store using a remote, REST-like Store. The store is read-only from the components,
     * as well as from the Client in general, but the remote backend should be wired-up with R.Dispatcher.UplinkDispatcher to
     * implement the over-the-wire Flux.
     * @implements {R.Store}
     */
    UplinkStore: function UplinkStore(keyToUrl, upSub, upUnsub) {
        var data = {};
        var subscribers = {};
        var get = function(key) {
            return function(fn) {
                R.request(keyToUrl(key))(function(err, res, body) {
                    if(err) {
                        R.Debug.rethrow("R.Store.UplinkStore.get(`" + key + "`)~request")(err);
                    }
                    fn(JSON.parse(body));
                });
            });
        };
        var signalUpdate = function signalUpdate(key) {
            if(!_.has(subscribers, key)) {
                return;
            }
            get(key)(function(val) {
                if(!_.has(subscribers, key)) {
                    return;
                }
                _.each(subscribers[key], R.callWith(val));
            });
        };
        var sub = function sub(key, signalUpdate) {
            var subscription = new R.Store.Subscription();
            if(!_.has(subscribers, key)) {
                subscribers[key] = {};
                upSub(key);
            }
            subscribers[key][subscription.uniqueId] = signalUpdate;
            get(key)(signalUpdate);
        };
        var unsub = function unsub(subscription) {
            R.Debug.dev(function() {
                assert(subscription instanceof R.Store.Subscription, "R.Store.UplinkStore.unsubscribe(...): type R.Store.Subscription expected.");
                assert(_.has(subscribers, subscription.key), "R.Store.UplinkStore.unsubscribe(...): no subscribers for this key.");
                assert(_.has(subscribers[subscription.key], subscription.uniqueId), "R.Store.UplinkStore.unsubscribe(...): no such subscription.");
            });
            delete subscribers[subscription.key][subscription.uniqueId];
            if(_.size(subscribers[subscription.key]) === 0) {
                delete subscribers[subscription.key];
                upUnsub(key);
            }
        };
        return new R.Store.createStore({
            displayName: "UplinkStore",
            get: get,
            sub: sub,
            unsub: unsub,
            signalUpdate: signalUpdate,
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

module.exports = {
    Store: Store,
};
