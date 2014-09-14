var R = require("./R");
var _ = require("lodash");
var assert = require("assert");
var co = require("co");

/**
 * @memberOf R
 * Flux represents the data flowing from the backends (either local or remote).
 * To enable isomoprhic rendering, it should be computable either or in the server or in the client.
 * It represents the global state, including but not limited to:
 * - Routing information
 * - Session information
 * - Navigation information
 * - etc
 */
var Flux = {
    createFlux: function createFlux(specs) {
        R.Debug.dev(function() {
            assert(_.isObject(specs), "R.createFlux(...): expecting an Object.");
            assert(_.has(specs, "bootstrapInClient") && _.isFunction(specs.bootstrapInClient), "R.createFlux(...): requires bootstrapInClient(Window): Function");
            assert(_.has(specs, "bootstrapInServer") && _.isFunction(specs.bootstrapInServer), "R.createFlux(...): requires bootstrapInServer(http.IncomingMessage): Function");
        });
        var FluxInstance = function() { R.Flux.FluxInstance.call(this); };
        _.extend(FluxInstance.prototype, R.FluxInstance.prototype, specs);
        return FluxInstance;
    },
    FluxInstance: function FluxInstance() {
        this._stores = {};
        this._eventEmitters = {};
        this._dispatchers = {};
        this._shouldInjectFromStores = true;
    },
    Mixin: {
        _FluxMixinSubscriptions: null,
        _FluxMixinListeners: null,
        componentWillMount: function componentWillMount() {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this, "getFlux") && _.isFunction(this.getFlux), "R.Flux.Mixin.componentWillMount(...): requires getFlux(): R.Flux.FluxInstance.");
                assert(_.has(this, "_AsyncMixinHasAsyncMixin") && this._AsyncMixinHasAsyncMixin, "R.Flux.Mixin.componentWillMount(...): requires R.Async.Mixin.");
            }, this));
            this._FluxMixinListeners = {};
            this._FluxMixinSubscriptions = {};
            this._FluxMixinResponses = {};
            if(!_.has(this, "getFluxStoreSubscriptions")) {
                this.getFluxStoreSubscriptions = this._FluxMixinDefaultGetFluxStoreSubscriptions;
            }
            if(!_.has(this, "getFluxEventEmittersListeners")) {
                this.getFluxEventEmittersListeners = this._FluxMixinDefaultGetFluxEventEmittersListeners;
            }
            if(!_.has(this, "fluxStoreWillUpdate")) {
                this.fluxStoreWillUpdate = this._FluxMixinDefaultFluxStoreWillUpdate;
            }
            if(!_.has(this, "fluxEventEmitterWillEmit")) {
                this.fluxEventEmitterWillEmit = this._FluxMixinDefaultFluxEventEmitterWillEmit;
            }
            if(this.getFlux().shouldInjectFromStores()) {
                var subscriptions = this.getFluxStoreSubscriptions(this.props);
                _.each(subscriptions, this._FluxMixinInject);
            }
        },
        componentDidMount: function componentDidMount() {
            this._FluxMixinUpdate(this.props);
        },
        componentWillReceiveProps: function componentWillReceiveProps(props) {
            this._FluxMixinUpdate(props);
        },
        componentWillUnmount: function componentWillUnmount() {
            this._FluxMixinClear();
        },
        getFluxStore: function getFluxStore(name) {
            return this.getFlux().getStore(name);
        },
        getFluxEventEmitter: function getFluxEventEmitter(name) {
            return this.getFlux().getEventEmitter(name);
        },
        getFluxDispatcher: function getFluxDispatcher(name) {
            return this.getFlux().getDispatcher(name);
        },
        triggerFluxAction: function triggerFluxAction(dispatcherName, action, params) {
            this.getFluxDispatcher(dispatcherName).trigger(action, params);
        },
        _FluxMixinDefaultGetFluxStoreSubscriptions: function getFluxStoreSubscriptions(props) {
            return {};
        },
        _FluxMixinDefaultGetFluxEventEmittersListeners: function getFluxEventEmittersListeners(props) {
            return {};
        },
        _FluxMixinDefaultFluxStoreWillUpdate: function fluxStoreWillUpdate(storeName, storeKey, val) {
            return void 0;
        },
        _FluxMixinDefaultFluxEventEmitterWillEmit: function fluxEventEmitterWillEmit(eventEmitterName, eventName, params) {
            return void 0;
        },
        _FluxMixinClear: function _FluxMixinClear() {
            _.each(this._FluxMixinSubscriptions, this._FluxMixinUnsubscribe);
            _.each(this._FluxMixinListeners, this.FluxMixinRemoveListener);
        },
        _FluxMixinUpdate: function _FluxMixinUpdate(props) {
            this._FluxMixinClear();
            var subscriptions = this.getFluxStoreSubscriptions(props);
            _.each(subscriptions, this._FluxMixinSubscribe);
            var listeners = this.getFluxEventEmittersListeners(props);
            _.each(listeners, this._FluxMixinAddListener);
        },
        _FluxMixinInject: function _FluxMixinInject(entry, key) {
            R.Debug.dev(R.scope(function() {
                assert(this.getFlux().shouldInjectFromStores(), "R.Flux.Mixin._FluxMixinInject(...): should not inject from Stores.");
                assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinInject(...).entry: expecting Object.");
                assert(_.has(entry, "storeName") && _.isString(entry.storeName), "R.Flux.Mixin._FluxMixinInject(...).entry.storeName: expecting String.");
                assert(_.has(entry, "storeKey") && _.isString(entry.storeKey), "R.Flux.Mixin._FluxMixinInject(...).entry.storeKey: expecting String.");
                assert(_.has(entry, "stateKey") && _.isString(entry.stateKey), "R.Flux.Mixin._FluxMixinInject(...).entry.stateKey: expecting String.");
            }, this));
            var store = this.getFluxStore(entry.storeName);
            var val = store.get(entry.storeKey);
            this.setState(R.record(entry.stateKey, val));
        },
        _FluxMixinSubscribe: function _FluxMixinSubscribe(entry, key) {
            R.Debug.dev(R.scope(function() {
                assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinSubscribe(...).entry: expecting Object.");
                assert(_.has(entry, "storeName") && _.isString(entry.storeName), "R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeName: expecting String.");
                assert(_.has(entry, "storeKey") && _.isString(entry.storeKey), "R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeKey: expecting String.");
                assert(_.has(entry, "stateKey") && _.isString(entry.stateKey), "R.Flux.Mixin._FluxMixinSubscribe(...).entry.stateKey: expecting String.");
            }, this));
            var store = this.getFluxStore(entry.storeName);
            var subscription = store.sub(entry.storeKey, this._FluxMixinStoreSignalUpdate(entry.storeName, entry.stateKey));
            this._FluxMixinSubscriptions[subscription.uniqueId] = {
                storeName: entry.storeName,
                subscription: subscription,
            };
        },
        _FluxMixinStoreSignalUpdate: function _FluxMixinStoreSignalUpdate(storeName, stateKey) {
            return R.Async.IfMounted(R.scope(function(err, val) {
                R.Debug.check(err === null, err);
                this.fluxStoreWillUpdate(storeName, storeKey, val);
                this.setState(R.record(stateKey, val));
            }, this));
        },
        _FluxMixinAddListener: function _FluxMixinAddListener(entry, key) {
            R.Debug.dev(R.scope(function() {
                assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinAddListener(...).entry: expecting Object.");
                assert(_.has(entry, "eventEmitterName") && _.isString(entry.eventEmitterName), "R.Flux.Mixin._FluxMixinAddListener(...).entry.eventEmitterName: expecting String.");
                assert(_.has(entry, "eventName") && _.isString(entry.eventName), "R.Flux.Mixin._FluxMixinAddListener(...).entry.eventName: expecting String.");
                assert(_.has(entry, "fn") && _.isFunction(entry.fn), "R.Flux.Mixin._FluxMixinAddListener(...).entry.fn: expecting Function.");
            }, this));
            var eventEmitter = this.getFluxEventEmitter(entry.eventEmitterName);
            var listener = eventEmitter.addListener(entry.eventName, this._FluxMixinEventEmitterEmit(entry.eventEmitterName, entry.eventName, entry.fn));
            this._FluxMixinListeners[listener.uniqueId] = {
                eventEmitterName: entry.eventEmitterName,
                listener: listener,
            };
        },
        _FluxMixinEventEmitterEmit: function _FluxMixinEventEmitterEmit(eventEmitterName, eventName, fn) {
            return R.Async.IfMounted(R.scope(function(params) {
                this.fluxEventEmitterWillEmit(eventEmitterName, eventName, params);
                fn(params);
            }, this));
        },
        _FluxMixinUnsubscribe: function _FluxMixinUnsubscribe(entry, key) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._FluxMixinSubscriptions, key), "R.Flux.Mixin._FluxMixinUnsubscribe(...): no such subscription.");
            }, this));
            var subscription = entry.subscription;
            var storeName = entry.storeName;
            this.getStore(storeName).unsub(subscription);
            delete this._FluxMixinSubscriptions[key];
        },
        _FluxMixinRemoveListener: function _FluxMixinRemoveListener(entry, key) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._FluxMixinListeners, key), "R.Flux.Mixin._FluxMixinRemoveListener(...): no such listener.");
            }, this));
            var listener = entry.listener;
            var eventEmitterName = entry.eventEmitterName;
            this.getFluxEventEmitter(eventEmitterName).removeListener(listener);
            delete this._FluxMixinListeners[key];
        },
    },
};

_.extend(Flux.FluxInstance.prototype, /** @lends R.Flux.FluxInstance.prototype */{
    _stores: null,
    _eventEmitters: null,
    _dispatchers: null,
    _shouldInjectFromStores: null,
    shouldInjectFromStores: function shouldInjectFromStores() {
        return this._shouldInjectFromStores;
    },
    stopInjectingFromStores: function stopInjectingFromStores() {
        R.Debug.dev(R.scope(function() {
            assert(this._shouldInjectFromStores, "R.Flux.FluxInstance.stopInjectingFromStores(...): should not inject from Stores.");
        }, this));
        this._shouldInjectFromStores = false;
    },
    serialize: co(function* serialize() {
        var map = _.mapValues(this._stores, function(store) {
            return store.serialize();
        });
        return yield map;
    }),
    unserialize: function unserialize(str) {
        var _this = this;
        return co(function*() {
            yield _.mapValues(JSON.parse(str), function(serializedStore, name) {
                return _this._stores[name].unserialize(serializedStore);
            });
        })();
    },
    getStore: function getStore(name) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._stores, name), "R.Flux.FluxInstance.getStore(...): no such Store.");
        }, this));
        return this._stores[name];
    },
    registerStore: function registerStore(name, store) {
        R.Debug.dev(R.scope(function() {
            assert(store._isStoreInstance_, "R.Flux.FluxInstance.registerStore(...): expecting a R.Store.StoreInstance.");
            assert(!_.has(this._stores, name), "R.Flux.FluxInstance.registerStore(...): name already assigned.");
        }, this));
        this._stores[name] = store;
    },
    getEventEmitter: function getEventEmitter(name) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._eventEmitters, name), "R.Flux.FluxInstance.getEventEmitter(...): no such EventEmitter.");
        }, this));
        return this._eventEmitters[name];
    },
    registerEventEmitter: function registerEventEmitter(name, eventEmitter) {
        assert(R.isClient(), "R.Flux.FluxInstance.registerEventEmitter(...): should not be called in the server.");
        R.Debug.dev(R.scope(function() {
            assert(eventEmitter._isEventEmitterInstance_, "R.Flux.FluxInstance.registerEventEmitter(...): expecting a R.EventEmitter.EventEmitterInstance.");
            assert(!_.has(this._eventEmitters, name), "R.Flux.FluxInstance.registerEventEmitter(...): name already assigned.");
        }, this));
        this._eventEmitters[name] = eventEmitter;
    },
    getDispatcher: function getDispatcher(name) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._dispatchers, name), "R.Flux.FluxInstance.getDispatcher(...): no such Dispatcher.");
        }, this));
    },
    registerDispatcher: function registerDispatcher(name, dispatcher) {
        assert(R.isClient(), "R.Flux.FluxInstance.registerDispatcher(...): should not be called in the server.");
        R.Debug.dev(R.scope(function() {
            assert(dispatcher instanceof R.Dispatcher, "R.Flux.FluxInstance.registerDispatcher(...): expecting a R.Dispatcher.");
            assert(!_.has(this._dispatchers, name), "R.Flux.FluxInstance.registerDispatcher(...): name already assigned.");
        }, this));
        this._dispatchers[name] = dispatcher;
    },
    destroy: function destroy() {
        _.each(this._stores, function(store) {
            store.destroy();
        });
        this._stores = null;
        _.each(this._eventEmitters, function(eventEmitter) {
            eventEmitter.destroy();
        });
        this._eventEmitters = null;
        _.each(this._dispatchers, function(dispatcher) {
            dispatcher.destroy();
        });
        this._dispatchers = null;
    },
});

module.exports = {
    Flux: Flux,
};
