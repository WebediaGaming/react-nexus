module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");
    var Promise = require("bluebird");
    var React = require("react");

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
            _.extend(FluxInstance.prototype, R.Flux.FluxInstance.prototype, specs);
            return FluxInstance;
        },
        FluxInstance: function FluxInstance() {
            this._stores = {};
            this._eventEmitters = {};
            this._dispatchers = {};
            this._stylesheets = {};
            this._shouldInjectFromStores = true;
        },
        Mixin: {
            _FluxMixinSubscriptions: null,
            _FluxMixinListeners: null,
            componentWillMount: function componentWillMount() {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this, "getFlux") && _.isFunction(this.getFlux), "R.Flux.Mixin.componentWillMount(...): requires getFlux(): R.Flux.FluxInstance.");
                    assert(this._AsyncMixinHasAsyncMixin, "R.Flux.Mixin.componentWillMount(...): requires R.Async.Mixin.");
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
                var flux = this.getFlux();
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
            prefetchFluxStores: regeneratorRuntime.mark(function prefetchFluxStores() {
                var subscriptions, yieldState, state, surrogateComponent, renderedComponent, childContext;

                return regeneratorRuntime.wrap(function prefetchFluxStores$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        subscriptions = this.getFluxStoreSubscriptions(this.props);
                        yieldState = {};
                        _.each(subscriptions, R.scope(function(entry) {
                            yieldState[entry.stateKey] = this.getFluxStore(entry.storeName).fetch(entry.storeKey);
                        }, this));
                        context$2$0.next = 5;
                        return yieldState;
                    case 5:
                        state = context$2$0.sent;
                        surrogateComponent = new this.__ReactOnRailsSurrogate(this.context, this.props, state);
                        surrogateComponent.componentWillMount();
                        renderedComponent = surrogateComponent.render();
                        childContext = surrogateComponent.getChildContext();
                        surrogateComponent.componentWillUnmount();
                        context$2$0.next = 13;

                        return React.Children.mapDescendants(renderedComponent, function(childComponent) {
                            return new Promise(function(resolve, reject) {
                                if(!childComponent.__ReactOnRailsSurrogate) {
                                    resolve();
                                }
                                else {
                                    var surrogateChildComponent = new childComponent.__ReactOnRailsSurrogate(childContext, childComponent.props);
                                    surrogateChildComponent.componentWillMount();
                                    surrogateChildComponent.prefetchFluxStores()(function(err) {
                                        if(err) {
                                            reject(R.Debug.extendError(err, "R.Flux.Mixin.prefetchFluxStores(...): couldn't prefetch child component."));
                                        }
                                        else {
                                            surrogateChildComponent.componentWillUnmount();
                                            resolve();
                                        }
                                    });
                                }
                            });
                        });
                    case 13:
                    case "end":
                        return context$2$0.stop();
                    }
                }, prefetchFluxStores, this);
            }),
            getFluxEventEmitter: function getFluxEventEmitter(name) {
                return this.getFlux().getEventEmitter(name);
            },
            getFluxDispatcher: function getFluxDispatcher(name) {
                return this.getFlux().getDispatcher(name);
            },
            getFluxStylesheet: function getFluxStylesheet(name) {
                return this.getFlux().getStylesheet(name);
            },
            triggerFluxAction: regeneratorRuntime.mark(function triggerFluxAction(dispatcherName, action, params) {
                return regeneratorRuntime.wrap(function triggerFluxAction$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return this.getFluxDispatcher(dispatcherName).trigger(action, params);
                    case 2:
                        return context$2$0.abrupt("return", context$2$0.sent);
                    case 3:
                    case "end":
                        return context$2$0.stop();
                    }
                }, triggerFluxAction, this);
            }),
            _FluxMixinDefaultGetStyleClasses: function getStyleClasses() {
                return {};
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
        _isFluxInstance_: true,
        _stores: null,
        _eventEmitters: null,
        _dispatchers: null,
        _stylesheets: null,
        _shouldInjectFromStores: null,
        bootstrapInClient: _.noop,
        bootstrapInServer: _.noop,
        destroyInClient: _.noop,
        destroyInServer: _.noop,
        shouldInjectFromStores: function shouldInjectFromStores() {
            return this._shouldInjectFromStores;
        },
        stopInjectingFromStores: function stopInjectingFromStores() {
            R.Debug.dev(R.scope(function() {
                assert(this._shouldInjectFromStores, "R.Flux.FluxInstance.stopInjectingFromStores(...): should not inject from Stores.");
            }, this));
            this._shouldInjectFromStores = false;
        },
        serialize: function serialize() {
            return R.Base64.encode(JSON.stringify(_.mapValues(this._stores, function(store) {
                return store.serialize();
            })));
        },
        unserialize: function unserialize(str) {
            _.each(JSON.parse(R.Base64.decode(str)), R.scope(function(serializedStore, name) {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this._stores, name), "R.Flux.FluxInstance.unserialize(...): no such Store. (" + name + ")");
                }, this));
                this._stores[name].unserialize(serializedStore);
            }, this));
        },
        getStore: function getStore(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._stores, name), "R.Flux.FluxInstance.getStore(...): no such Store. (" + name + ")");
            }, this));
            return this._stores[name];
        },
        registerStore: function registerStore(name, store) {
            R.Debug.dev(R.scope(function() {
                assert(store._isStoreInstance_, "R.Flux.FluxInstance.registerStore(...): expecting a R.Store.StoreInstance. (" + name + ")");
                assert(!_.has(this._stores, name), "R.Flux.FluxInstance.registerStore(...): name already assigned. (" + name + ")");
            }, this));
            this._stores[name] = store;
        },
        getEventEmitter: function getEventEmitter(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._eventEmitters, name), "R.Flux.FluxInstance.getEventEmitter(...): no such EventEmitter. (" + name + ")");
            }, this));
            return this._eventEmitters[name];
        },
        registerEventEmitter: function registerEventEmitter(name, eventEmitter) {
            assert(R.isClient(), "R.Flux.FluxInstance.registerEventEmitter(...): should not be called in the server.");
            R.Debug.dev(R.scope(function() {
                assert(eventEmitter._isEventEmitterInstance_, "R.Flux.FluxInstance.registerEventEmitter(...): expecting a R.EventEmitter.EventEmitterInstance. (" + name + ")");
                assert(!_.has(this._eventEmitters, name), "R.Flux.FluxInstance.registerEventEmitter(...): name already assigned. (" + name + ")");
            }, this));
            this._eventEmitters[name] = eventEmitter;
        },
        getDispatcher: function getDispatcher(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._dispatchers, name), "R.Flux.FluxInstance.getDispatcher(...): no such Dispatcher. (" + name + ")");
            }, this));
            return this._dispatchers[name];
        },
        registerDispatcher: function registerDispatcher(name, dispatcher) {
            assert(R.isClient(), "R.Flux.FluxInstance.registerDispatcher(...): should not be called in the server. (" + name + ")");
            R.Debug.dev(R.scope(function() {
                assert(dispatcher._isDispatcher_, "R.Flux.FluxInstance.registerDispatcher(...): expecting a R.Dispatcher. (" + name + ")");
                assert(!_.has(this._dispatchers, name), "R.Flux.FluxInstance.registerDispatcher(...): name already assigned. (" + name + ")");
            }, this));
            this._dispatchers[name] = dispatcher;
        },
        getStylesheet: function getStylesheet(name) {
            R.Debug.dev(R.scope(function() {
                assert(stylesheet._isStylesheet_, "R.Flux.FluxInstance.registerStylesheet(...): expecting a R.Stylesheet. (" + name + ")");
                assert(_.has(this._stylesheets, name), "R.Flux.FluxInstance.registerStylesheet(...): no such Stylesheet. (" + name + ")");
            }, this));
            return this._stylesheets[name];
        },
        getAllStylesheets: function getAllStylesheets() {
            return this._stylesheets;
        },
        registerStylesheet: function registerStylesheet(name, stylesheet) {
            R.Debug.dev(R.scope(function() {
                assert(stylesheet._isStylesheetInstance_, "R.Flux.FluxInstance.registerStylesheet(...): expecting a R.Stylesheet.StylesheetInstance. (" + name + ")");
                assert(!_.has(this._stylesheets, name), "R.Flux.FluxInstance.registerStylesheet(...): name already assigned. (" + name + ")");
            }, this));
            this._stylesheets[name] = stylesheet;
        },
        registerAllComponentsStylesheetRules: function registerComponentsStylesheetRules(componentClasses) {
            _.each(componentClasses, R.scope(function(componentClass) {
                if(_.has(componentClass, "getStylesheetRules")) {
                    var rules = componentClass.getStylesheetRules();
                    _.each(rules, R.scope(function(rule, stylesheetName) {
                        var stylesheet = this.getStylesheet(stylesheetName);
                        R.Debug.dev(function() {
                            assert(_.isPlainObject(rule), "R.Flux.FluxInstance.registerComponentsStylesheetRules(...).rule: expecting Object. (" + name + ")");
                            assert(_.has(rule, "selector") && _.isString(rule.selector), "R.Flux.FluxInstance.registerComponentsStylesheetRules(...).rule.selector: expecting String. (" + name + ")");
                            assert(_.has(rule, "style") && _.isObject(rule.style), "R.Flux.FluxInstance.registerComponentsStylesheetRules(...).rule.style: expecting Object. (" + name + ")");
                        });
                        stylesheet.registerRule(rule.selector, rule.style);
                    }, this));
                }
            }, this));
        },
        destroy: function destroy() {
            if(R.isClient()) {
                this.destroyInClient();
            }
            if(R.isServer()) {
                this.destroyInServer();
            }
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

    R.Flux = Flux;
    return R;
};
