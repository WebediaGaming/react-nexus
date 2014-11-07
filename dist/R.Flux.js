module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");
    var Promise = require("bluebird");
    var React = R.React;

    var count = 0;

    var abstractLocationRegExp = /^(.*):\/(.*)$/;


    /**
     * @memberOf R
     * <p>R.Flux represents the data flowing from the backends (either local or remote).
     * To enable isomoprhic rendering, it should be computable either or in the server or in the client.
     * It represents the global state, including but not limited to:</p>
     * <ul>
     * <li>Routing information</li>
     * <li>Session information</li>
     * <li>Navigation information</li>
     * </ul>
     * <p>Inside an App, each components can interact with the Flux instance using Flux.Mixin (generally via Root.Mixin or Component.Mixin).</p>
     * @class R.Flux
     */
    var Flux = {
        /**
        * <p>Returns a Flux constructor</p>
        * @method createFlux
        * @param {object} specs The specifications of the flux
        */
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
        /**
        * <p>Check if the flux provided by props is an object and a flux instance</p>
        * @param {object} props The props to check
        * @return {Boolean} valid The result boolean of the checked flux 
        */
        PropType: function validateFlux(props, propName, componentName) {
            var flux = props.flux;
            var valid = null;
            R.Debug.dev(function() {
                try {
                    assert(_.isObject(flux) && flux._isFluxInstance_, "R.Root.createClass(...): expecting a R.Flux.FluxInstance.");
                }
                catch(err) {
                    valid = err;
                }
            });
            return valid;
        },
        FluxInstance: function FluxInstance() {
            this._stores = {};
            this._eventEmitters = {};
            this._dispatchers = {};
        },
        Mixin: {
            _FluxMixinSubscriptions: null,
            _FluxMixinListeners: null,
            /**
            * <p>The getInitialState of React mechanics will be call at:</p>
            *  - React.render() <br />
            *  - React.renderToString() <br />
            * <p>Never return a null object, by default: {}, otherwise return data stocked from the corresponding store</p>
            * @method getInitialState
            * @return {Object} object An object like: [stateKey, data]
            */
            getInitialState: function getInitialState() {
                var subscriptions = this.getFluxStoreSubscriptions(this.props);
                /* Return computed datas from Component's subscriptions */
                if(this.getFlux().shouldInjectFromStores()) {
                    return _.object(_.map(subscriptions, R.scope(function(stateKey, location) {
                        var r = abstractLocationRegExp.exec(location);
                        assert(r !== null, "R.Flux.getInitialState(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')");
                        var storeName = r[1];
                        var storeKey = r[2];
                        return [stateKey, this.getFluxStore(storeName).get(storeKey)];
                    }, this)));
                }
                /* Return stateKey:null values for each subscriptions */
                else {
                    return _.object(_.map(subscriptions, function(stateKey) {
                        return [stateKey, null];
                    }));
                }
            },
            /**
            * <p>The componentWillMount of React mechanics</p>
            * <p>Initialize flux functions for each components when componentWillMount is invoked by React</p>
            * @method componentWillMount
            */
            componentWillMount: function componentWillMount() {
                R.Debug.dev(R.scope(function() {
                    assert(this.getFlux && _.isFunction(this.getFlux), "R.Flux.Mixin.componentWillMount(...): requires getFlux(): R.Flux.FluxInstance.");
                    assert(this._AsyncMixinHasAsyncMixin, "R.Flux.Mixin.componentWillMount(...): requires R.Async.Mixin.");
                }, this));
                this._FluxMixinListeners = {};
                this._FluxMixinSubscriptions = {};
                this._FluxMixinResponses = {};
                if(!this.getFluxStoreSubscriptions) {
                    this.getFluxStoreSubscriptions = this._FluxMixinDefaultGetFluxStoreSubscriptions;
                }
                if(!this.getFluxEventEmittersListeners) {
                    this.getFluxEventEmittersListeners = this._FluxMixinDefaultGetFluxEventEmittersListeners;
                }
                if(!this.fluxStoreWillUpdate) {
                    this.fluxStoreWillUpdate = this._FluxMixinDefaultFluxStoreWillUpdate;
                }
                if(!this.fluxStoreDidUpdate) {
                    this.fluxStoreDidUpdate = this._FluxMixinDefaultFluxStoreDidUpdate;
                }
                if(!this.fluxEventEmitterWillEmit) {
                    this.fluxEventEmitterWillEmit = this._FluxMixinDefaultFluxEventEmitterWillEmit;
                }
                if(!this.fluxEventEmitterDidEmit) {
                    this.fluxEventEmitterDidEmit = this._FluxMixinDefaultFluxEventEmitterDidEmit;
                }
            },

            /**
            * <p>Call the manager subscriptions when componendDidMount is invoked by React (only client-side)</p>
            * @method componentDidMount
            */
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
            /**
            * <p>Fetch all components from a root component in order to initialize all data, fill the corresponding stores</p>
            * <p>Executed server-side<p>
            * @method prefetchFluxStores
            * @return {void}
            */
            prefetchFluxStores: regeneratorRuntime.mark(function prefetchFluxStores() {
                var subscriptions, curCount, state, surrogateComponent, renderedComponent, childContext;

                return regeneratorRuntime.wrap(function prefetchFluxStores$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        subscriptions = this.getFluxStoreSubscriptions(this.props);
                        curCount = count;
                        state = {};
                        context$2$0.next = 5;

                        return _.map(subscriptions, R.scope(function(stateKey, location) {
                            return new Promise(R.scope(function(resolve, reject) {
                                var r = abstractLocationRegExp.exec(location);
                                if(r === null) {
                                    return reject(new Error("R.Flux.prefetchFluxStores(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')"));
                                }
                                else {
                                    var storeName = r[1];
                                    var storeKey = r[2];
                                    co(regeneratorRuntime.mark(function callee$4$0() {
                                        return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                                            while (1) switch (context$5$0.prev = context$5$0.next) {
                                            case 0:
                                                context$5$0.next = 2;
                                                return this.getFluxStore(storeName).fetch(storeKey);
                                            case 2:
                                                state[stateKey] = context$5$0.sent;
                                            case 3:
                                            case "end":
                                                return context$5$0.stop();
                                            }
                                        }, callee$4$0, this);
                                    })).call(this, function(err) {
                                        if(err) {
                                            return reject(R.Debug.extendError(err, "Couldn't prefetch subscription ('" + stateKey + "', '" + location + "')"));
                                        }
                                        else {
                                            return resolve();
                                        }
                                    });
                                }
                            }, this));
                        }, this));
                    case 5:
                        this.getFlux().startInjectingFromStores();

                        surrogateComponent = new this.__ReactOnRailsSurrogate(this.context, this.props, state);
                        surrogateComponent.componentWillMount();
                        this.getFlux().stopInjectingFromStores();

                        renderedComponent = surrogateComponent.render();
                        childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : this.context;

                        surrogateComponent.componentWillUnmount();

                        context$2$0.next = 14;

                        return React.Children.mapTree(renderedComponent, function(childComponent) {
                            return new Promise(function(resolve, reject) {
                                if(!_.isObject(childComponent)) {
                                    return resolve();
                                }
                                var childType = childComponent.type;
                                if(!_.isObject(childType) || !childType.__ReactOnRailsSurrogate) {
                                    return resolve();
                                }
                                //Create the React instance of current child with props, but without computed state
                                var surrogateChildComponent = new childType.__ReactOnRailsSurrogate(childContext, childComponent.props);
                                if(!surrogateChildComponent.componentWillMount) {
                                    R.Debug.dev(function() {
                                        console.error("Component doesn't have componentWillMount. Maybe you forgot R.Component.Mixin? ('" + surrogateChildComponent.displayName + "')");
                                    });
                                }
                                surrogateChildComponent.componentWillMount();
                                co(regeneratorRuntime.mark(function callee$4$0() {
                                    return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                                        while (1) switch (context$5$0.prev = context$5$0.next) {
                                        case 0:
                                            context$5$0.next = 2;
                                            return surrogateChildComponent.prefetchFluxStores();
                                        case 2:
                                            surrogateChildComponent.componentWillUnmount();
                                        case 3:
                                        case "end":
                                            return context$5$0.stop();
                                        }
                                    }, callee$4$0, this);
                                })).call(this, function(err) {
                                    if(err) {
                                        return reject(R.Debug.extendError(err, "Couldn't prefetch child component"));
                                    }
                                    else {
                                        return resolve();
                                    }
                                });
                            });
                        });
                    case 14:
                    case "end":
                        return context$2$0.stop();
                    }
                }, prefetchFluxStores, this);
            }),
            /**
            * <p>Returns the FluxEventEmitter according the provided name</p>
            * @method getFluxEventEmitter
            * @param {string} name The name
            * @return {object} EventEmitter the EventEmitter
            */
            getFluxEventEmitter: function getFluxEventEmitter(name) {
                return this.getFlux().getEventEmitter(name);
            },
            /**
            * <p>Returns the FluxDispatcher according the provided name</p>
            * @method getFluxDispatcher
            * @param {string} name The name
            * @return {object} Dispatcher the Dispatcher
            */
            getFluxDispatcher: function getFluxDispatcher(name) {
                return this.getFlux().getDispatcher(name);
            },
            /**
            * <p>Get the corresponding dispatcher and dispatch the action submitted by a React component<br />
            * Trigged on event like "click"</p>
            * @param {string} location The url to go (eg. "//History/navigate")
            * @param {object} param The specific data for the action
            * @return {*} * the data that may be provided by the dispatcher
            */
            dispatch: regeneratorRuntime.mark(function dispatch(location, params) {
                var r, entry;

                return regeneratorRuntime.wrap(function dispatch$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        r = abstractLocationRegExp.exec(location);
                        assert(r !== null, "R.Flux.dispatch(...): incorrect location ('" + this.displayName + "')");

                        entry = {
                            dispatcherName: r[1],
                            action: r[2],
                        };

                        context$2$0.next = 5;
                        return this.getFluxDispatcher(entry.dispatcherName).dispatch(entry.action, params);
                    case 5:
                        return context$2$0.abrupt("return", context$2$0.sent);
                    case 6:
                    case "end":
                        return context$2$0.stop();
                    }
                }, dispatch, this);
            }),
            _FluxMixinDefaultGetFluxStoreSubscriptions: function getFluxStoreSubscriptions(props) {
                return {};
            },
            _FluxMixinDefaultGetFluxEventEmittersListeners: function getFluxEventEmittersListeners(props) {
                return {};
            },
            _FluxMixinDefaultFluxStoreWillUpdate: function fluxStoreWillUpdate(storeName, storeKey, newVal, oldVal) {
                return void 0;
            },
            _FluxMixinDefaultFluxStoreDidUpdate: function fluxStoreDidUpdate(storeName, storeKey, newVal, oldVal) {
                return void 0;
            },
            _FluxMixinDefaultFluxEventEmitterWillEmit: function fluxEventEmitterWillEmit(eventEmitterName, eventName, params) {
                return void 0;
            },
            _FluxMixinDefaultFluxEventEmitterDidEmit: function fluxEventEmitterDidEmit(eventEmitterName, eventName, params) {
                return void 0;
            },
            _FluxMixinClear: function _FluxMixinClear() {
                _.each(this._FluxMixinSubscriptions, this._FluxMixinUnsubscribe);
                _.each(this._FluxMixinListeners, this.FluxMixinRemoveListener);
            },
            /**
            * <p>Manage subscriptions, unsubscriptions and event emitters</p>
            * @method _FluxMixinUpdate
            * @param {Object} props The props of component
            * @private
            */
            _FluxMixinUpdate: function _FluxMixinUpdate(props) {
                var currentSubscriptions = _.object(_.map(this._FluxMixinSubscriptions, function(entry) {
                    return [entry.location, entry.stateKey];
                }));

                var nextSubscriptions = this.getFluxStoreSubscriptions(props);
                _.each(currentSubscriptions, R.scope(function(stateKey, location) {
                    if(!nextSubscriptions[location] || nextSubscriptions[location] !== currentSubscriptions[location]) {
                        this._FluxMixinUnsubscribe(stateKey, location);
                    }
                }, this));
                _.each(nextSubscriptions, R.scope(function(stateKey, location) {
                    if(!currentSubscriptions[location] || currentSubscriptions[location] !== stateKey) {
                        this._FluxMixinSubscribe(stateKey, location);
                    }
                }, this));

                var currentListeners = _.object(_.map(this._FluxMixinListeners, function(entry) {
                    return [entry.location, entry.fn];
                }));
                var nextListeners = this.getFluxEventEmittersListeners(props);
                _.each(currentListeners, R.scope(function(fn, location) {
                    if(!nextListeners[location] || nextListeners[location] !== currentListeners[location]) {
                        this._FluxMixinRemoveListener(fn, location);
                    }
                }, this));
                _.each(nextListeners, R.scope(function(fn, location) {
                    if(!currentListeners[location] || currentListeners[location] !== fn) {
                        this._FluxMixinAddListener(fn, location);
                    }
                }, this));
            },
            /**
            * @method _FluxMixinInject
            * @param {string} stateKey The stateKey
            * @param {string} location The location
            * @private
            */
            _FluxMixinInject: function _FluxMixinInject(stateKey, location) {
                var r = abstractLocationRegExp.exec(location);
                assert(r !== null, "R.Flux._FluxMixinInject(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')");
                var entry = {
                    storeName: r[1],
                    storeKey: r[2],
                };
                R.Debug.dev(R.scope(function() {
                    assert(this.getFlux().shouldInjectFromStores(), "R.Flux.Mixin._FluxMixinInject(...): should not inject from Stores.");
                    assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinInject(...).entry: expecting Object.");
                    assert(_.has(entry, "storeName") && _.isString(entry.storeName), "R.Flux.Mixin._FluxMixinInject(...).entry.storeName: expecting String.");
                    assert(_.has(entry, "storeKey") && _.isString(entry.storeKey), "R.Flux.Mixin._FluxMixinInject(...).entry.storeKey: expecting String.");
                }, this));
                this.setState(R.record(stateKey, this.getFluxStore(entry.storeName).get(entry.storeKey)));
            },
            /**
            * <p>Allow a React Component to subscribe at any data in order to fill state</p>
            * @method _FluxMixinSubscribe
            * @param {string} stateKey The key to be subscribed
            * @param {string} location The url that will be requested
            * @return {void}
            * @private
            */
            _FluxMixinSubscribe: function _FluxMixinSubscribe(stateKey, location) {
                var r = abstractLocationRegExp.exec(location);
                assert(r !== null, "R.Flux._FluxMixinSubscribe(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')");
                var entry = {
                    storeName: r[1],
                    storeKey: r[2],
                };
                R.Debug.dev(R.scope(function() {
                    assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinSubscribe(...).entry: expecting Object.");
                    assert(_.has(entry, "storeName") && _.isString(entry.storeName), "R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeName: expecting String.");
                    assert(_.has(entry, "storeKey") && _.isString(entry.storeKey), "R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeKey: expecting String.");
                }, this));
                var store = this.getFluxStore(entry.storeName);
                //Subscribe and request Store to get data
                //Call immediatly _FluxMixinStoreSignalUpdate with computed data in order to call setState
                var subscription = store.sub(entry.storeKey, this._FluxMixinStoreSignalUpdate(stateKey, location));

                //Save subscription
                this._FluxMixinSubscriptions[subscription.uniqueId] = {
                    location: location,
                    stateKey: stateKey,
                    storeName: entry.storeName,
                    subscription: subscription,
                };
            },
            /**
            * <p>Rerendering a component when data update occurs</p>
            * @method _FluxMixinStoreSignalUpdate
            * @param {String} stateKey The key to be subscribed
            * @param {String} location The url that will be requested
            * @return {Function}
            * @private
            */
            _FluxMixinStoreSignalUpdate: function _FluxMixinStoreSignalUpdate(stateKey, location) {
                return R.scope(function(val) {
                    if(!this.isMounted()) {
                        return;
                    }
                    var previousVal = this.state ? this.state[stateKey] : undefined;
                    if(_.isEqual(previousVal, val)) {
                        return;
                    }
                    this.fluxStoreWillUpdate(stateKey, location, val, previousVal);
                    //Call react API in order to Rerender component
                    this.setState(R.record(stateKey, val));
                    this.fluxStoreDidUpdate(stateKey, location, val, previousVal);
                }, this);
            },
            /**
            * @method _FluxMixinAddListener
            * @param {Fonction} fn The fn
            * @param {string} location The location
            * @private
            */
            _FluxMixinAddListener: function _FluxMixinAddListener(fn, location) {
                var r = abstractLocationRegExp.exec(location);
                assert(r !== null, "R.Flux._FluxMixinAddListener(...): incorrect location ('" + this.displayName + "', '" + location + "')");
                var entry = {
                    eventEmitterName: r[1],
                    eventName: r[2],
                };
                R.Debug.dev(R.scope(function() {
                    assert(_.isPlainObject(entry), "R.Flux.Mixin._FluxMixinAddListener(...).entry: expecting Object.");
                    assert(_.has(entry, "eventEmitterName") && _.isString(entry.eventEmitterName), "R.Flux.Mixin._FluxMixinAddListener(...).entry.eventEmitterName: expecting String.");
                    assert(_.has(entry, "eventName") && _.isString(entry.eventName), "R.Flux.Mixin._FluxMixinAddListener(...).entry.eventName: expecting String.");
                    assert(_.has(entry, "fn") && _.isFunction(fn), "R.Flux.Mixin._FluxMixinAddListener(...).entry.fn: expecting Function.");
                }, this));
                var eventEmitter = this.getFluxEventEmitter(entry.eventEmitterName);
                var listener = eventEmitter.addListener(entry.eventName, this._FluxMixinEventEmitterEmit(entry.eventEmitterName, entry.eventName, entry.fn));
                this._FluxMixinListeners[listener.uniqueId] = {
                    location: location,
                    fn: fn,
                    eventEmitterName: entry.eventEmitterName,
                    listener: listener,
                };
            },
            /**
            * @method _FluxMixinEventEmitterEmit
            * @param {string} eventEmitterName The eventEmitterName
            * @param {string} eventName The eventName
            * @param {Fonction} fn The fn
            * @private
            */
            _FluxMixinEventEmitterEmit: function _FluxMixinEventEmitterEmit(eventEmitterName, eventName, fn) {
                return R.scope(function(params) {
                    if(!this.isMounted()) {
                        return;
                    }
                    this.fluxEventEmitterWillEmit(eventEmitterName, eventName, params);
                    fn(params);
                    this.fluxEventEmitterDidEmit(eventEmitterName, eventName, params);
                }, this);
            },
            /**
            * @method _FluxMixinUnsubscribe
            * @param {object} entry The entry
            * @param {string} uniqueId The uniqueId
            * @private
            */
            _FluxMixinUnsubscribe: function _FluxMixinUnsubscribe(entry, uniqueId) {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this._FluxMixinSubscriptions, uniqueId), "R.Flux.Mixin._FluxMixinUnsubscribe(...): no such subscription.");
                }, this));
                var subscription = entry.subscription;
                var storeName = entry.storeName;
                this.getFluxStore(storeName).unsub(subscription);
                delete this._FluxMixinSubscriptions[uniqueId];
            },
            /**
            * @method _FluxMixinRemoveListener
            * @param {object} entry The entry
            * @param {string} uniqueId The uniqueId
            * @private
            */
            _FluxMixinRemoveListener: function _FluxMixinRemoveListener(entry, uniqueId) {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this._FluxMixinListeners, uniqueId), "R.Flux.Mixin._FluxMixinRemoveListener(...): no such listener.");
                }, this));
                var listener = entry.listener;
                var eventEmitterName = entry.eventEmitterName;
                this.getFluxEventEmitter(eventEmitterName).removeListener(listener);
                delete this._FluxMixinListeners[uniqueId];
            },
        },
    };

    _.extend(Flux.FluxInstance.prototype, /** @lends R.Flux.FluxInstance.prototype */{
        _isFluxInstance_: true,
        _stores: null,
        _eventEmitters: null,
        _dispatchers: null,
        _shouldInjectFromStores: false,
        bootstrapInClient: _.noop,
        bootstrapInServer: _.noop,
        destroyInClient: _.noop,
        destroyInServer: _.noop,
        shouldInjectFromStores: function shouldInjectFromStores() {
            return this._shouldInjectFromStores;
        },
        /**
        * <p>Sets the flag telling all the flux-mixed-in components to attempt to inject pre-fetched values from the cache. Used for pre-rendering magic.</p>
        * @method startInjectingFromStores
        */
        startInjectingFromStores: function startInjectingFromStores() {
            R.Debug.dev(R.scope(function() {
                assert(!this._shouldInjectFromStores, "R.Flux.FluxInstance.startInjectingFromStores(...): should not be injecting from Stores.");
            }, this));
            this._shouldInjectFromStores = true;
        },
        /**
        * <p>Unsets the flag telling all the flux-mixed-in components to attempt to inject pre-fetched values from the cache. Used for pre-rendering magic.</p>
        * @method startInjectingFromStores
        */
        stopInjectingFromStores: function stopInjectingFromStores() {
            R.Debug.dev(R.scope(function() {
                assert(this._shouldInjectFromStores, "R.Flux.FluxInstance.stopInjectingFromStores(...): should be injecting from Stores.");
            }, this));
            this._shouldInjectFromStores = false;
        },
        /**
        * <p>Serialize a serialized flux by the server in order to initialize flux into client</p>
        * @method serialize
        * @return {string} string The serialized string
        */
        serialize: function serialize() {
            return R.Base64.encode(JSON.stringify(_.mapValues(this._stores, function(store) {
                return store.serialize();
            })));
        },
        /**
        * Unserialize a serialized flux by the server in order to initialize flux into client
        * @method unserialize
        * @param {string} str The string to unserialize
        */
        unserialize: function unserialize(str) {
            _.each(JSON.parse(R.Base64.decode(str)), R.scope(function(serializedStore, name) {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this._stores, name), "R.Flux.FluxInstance.unserialize(...): no such Store. (" + name + ")");
                }, this));
                this._stores[name].unserialize(serializedStore);
            }, this));
        },
        /**
        * <p>Getter for the store</p>
        * @method getStore
        * @param {string} name The name of the store
        * @return {object} store The corresponding store
        */
        getStore: function getStore(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._stores, name), "R.Flux.FluxInstance.getStore(...): no such Store. (" + name + ")");
            }, this));
            return this._stores[name];
        },
        /**
        * <p>Register a store defined in the flux class of App <br />
        * Typically : Memory or Uplink</p>
        * @method registerStore
        * @param {string} name The name to register
        * @param {object} store The store to register
        */ 
        registerStore: function registerStore(name, store) {
            R.Debug.dev(R.scope(function() {
                assert(store._isStoreInstance_, "R.Flux.FluxInstance.registerStore(...): expecting a R.Store.StoreInstance. (" + name + ")");
                assert(!_.has(this._stores, name), "R.Flux.FluxInstance.registerStore(...): name already assigned. (" + name + ")");
            }, this));
            this._stores[name] = store;
        },
        /**
        * <p>Getter for the event emitter</p>
        * @method getEventEmitter
        * @param {string} name The name of the store
        * @return {object} eventEmitter The corresponding event emitter
        */
        getEventEmitter: function getEventEmitter(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._eventEmitters, name), "R.Flux.FluxInstance.getEventEmitter(...): no such EventEmitter. (" + name + ")");
            }, this));
            return this._eventEmitters[name];
        },

        /**
        * <p>Register an event emitter defined in the flux class of App</p>
        * @method registerEventEmitter
        * @param {string} name The name to register
        * @param {object} eventEmitter The event emitter to register
        */ 
        registerEventEmitter: function registerEventEmitter(name, eventEmitter) {
            assert(R.isClient(), "R.Flux.FluxInstance.registerEventEmitter(...): should not be called in the server.");
            R.Debug.dev(R.scope(function() {
                assert(eventEmitter._isEventEmitterInstance_, "R.Flux.FluxInstance.registerEventEmitter(...): expecting a R.EventEmitter.EventEmitterInstance. (" + name + ")");
                assert(!_.has(this._eventEmitters, name), "R.Flux.FluxInstance.registerEventEmitter(...): name already assigned. (" + name + ")");
            }, this));
            this._eventEmitters[name] = eventEmitter;
        },

        /**
        * <p>Getter for the dispatcher</p>
        * @method getDispatcher
        * @param {string} name The name of the store
        * @return {object} dispatcher The corresponding dispatcher
        */
        getDispatcher: function getDispatcher(name) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._dispatchers, name), "R.Flux.FluxInstance.getDispatcher(...): no such Dispatcher. (" + name + ")");
            }, this));
            return this._dispatchers[name];
        },
        /**
        * <p>Register a dispatcher defined in the flux class of App</p>
        * @method registerDispatcher
        * @param {string} name The name to register
        * @param {object} dispatcher The dispatcher to register
        */ 
        registerDispatcher: function registerDispatcher(name, dispatcher) {
            assert(R.isClient(), "R.Flux.FluxInstance.registerDispatcher(...): should not be called in the server. (" + name + ")");
            R.Debug.dev(R.scope(function() {
                assert(dispatcher._isDispatcherInstance_, "R.Flux.FluxInstance.registerDispatcher(...): expecting a R.Dispatcher.DispatcherInstance (" + name + ")");
                assert(!_.has(this._dispatchers, name), "R.Flux.FluxInstance.registerDispatcher(...): name already assigned. (" + name + ")");
            }, this));
            this._dispatchers[name] = dispatcher;
        },

        /**
        * <p>Clears the store by calling either this.destroyInServer or this.destroyInClient and recursively applying destroy on each store/event emittre/dispatcher.<br />
        * Used for pre-rendering magic.</p>
        * @method destroy
        */
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

    return Flux;
};
