var R = require("../R");
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
    },
};

_.extend(Flux.FluxInstance.prototype, /** @lends R.Flux.FluxInstance.prototype */{
    _stores: null,
    _eventEmitters: null,
    _dispatchers: null,
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
    registerStore: function registerStore(name, store) {
        R.Debug.dev(R.scope(function() {
            assert(store._isStoreInstance_, "R.Flux.FluxInstance.registerStore(...): expecting a R.Store.StoreInstance.");
            assert(!_.has(this._stores, name), "R.Flux.FluxInstance.registerStore(...): name already assigned.");
        }, this));
        this._stores[name] = store;
    },
    registerEventEmitter: function registerEventEmitter(name, eventEmitter) {
        assert(R.isClient(), "R.Flux.FluxInstance.registerEventEmitter(...): should not be called in the server.");
        R.Debug.dev(R.scope(function() {
            assert(eventEmitter._isEventEmitterInstance_, "R.Flux.FluxInstance.registerEventEmitter(...): expecting a R.EventEmitter.EventEmitterInstance.");
            assert(!_.has(this._eventEmitters, name), "R.Flux.FluxInstance.registerEventEmitter(...): name already assigned.");
        }, this));
        this._eventEmitters[name] = eventEmitter;
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
        _.each(this._eventEmitters, function(eventEmitter) {
            eventEmitter.destroy();
        });
        _.each(this._dispatchers, function(dispatcher) {
            dispatcher.destroy();
        });
    },
});

module.exports = {
    Flux: Flux,
};
