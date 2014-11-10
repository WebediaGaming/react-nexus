"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");
  var co = require("co");
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
      R.Debug.dev(function () {
        assert(_.isObject(specs), "R.createFlux(...): expecting an Object.");
        assert(_.has(specs, "bootstrapInClient") && _.isFunction(specs.bootstrapInClient), "R.createFlux(...): requires bootstrapInClient(Window): Function");
        assert(_.has(specs, "bootstrapInServer") && _.isFunction(specs.bootstrapInServer), "R.createFlux(...): requires bootstrapInServer(http.IncomingMessage): Function");
      });
      var FluxInstance = function () {
        R.Flux.FluxInstance.call(this);
      };
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
      R.Debug.dev(function () {
        try {
          assert(_.isObject(flux) && flux._isFluxInstance_, "R.Root.createClass(...): expecting a R.Flux.FluxInstance.");
        } catch (err) {
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
        if (this.getFlux().shouldInjectFromStores()) {
          return _.object(_.map(subscriptions, R.scope(function (stateKey, location) {
            var r = abstractLocationRegExp.exec(location);
            assert(r !== null, "R.Flux.getInitialState(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')");
            var storeName = r[1];
            var storeKey = r[2];
            return [stateKey, this.getFluxStore(storeName).get(storeKey)];
          }, this)));
        }
        /* Return stateKey:null values for each subscriptions */
        else {
          return _.object(_.map(subscriptions, function (stateKey) {
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
        R.Debug.dev(R.scope(function () {
          assert(this.getFlux && _.isFunction(this.getFlux), "R.Flux.Mixin.componentWillMount(...): requires getFlux(): R.Flux.FluxInstance.");
          assert(this._AsyncMixinHasAsyncMixin, "R.Flux.Mixin.componentWillMount(...): requires R.Async.Mixin.");
        }, this));
        this._FluxMixinListeners = {};
        this._FluxMixinSubscriptions = {};
        this._FluxMixinResponses = {};
        if (!this.getFluxStoreSubscriptions) {
          this.getFluxStoreSubscriptions = this._FluxMixinDefaultGetFluxStoreSubscriptions;
        }
        if (!this.getFluxEventEmittersListeners) {
          this.getFluxEventEmittersListeners = this._FluxMixinDefaultGetFluxEventEmittersListeners;
        }
        if (!this.fluxStoreWillUpdate) {
          this.fluxStoreWillUpdate = this._FluxMixinDefaultFluxStoreWillUpdate;
        }
        if (!this.fluxStoreDidUpdate) {
          this.fluxStoreDidUpdate = this._FluxMixinDefaultFluxStoreDidUpdate;
        }
        if (!this.fluxEventEmitterWillEmit) {
          this.fluxEventEmitterWillEmit = this._FluxMixinDefaultFluxEventEmitterWillEmit;
        }
        if (!this.fluxEventEmitterDidEmit) {
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
          while (1) switch (context$2$0.prev = context$2$0.next) {case 0:
              subscriptions = this.getFluxStoreSubscriptions(this.props);
              curCount = count;
              state = {};
              context$2$0.next = 5;
              return _.map(subscriptions, R.scope(function (stateKey, location) {
                return new Promise(R.scope(function (resolve, reject) {
                  var r = abstractLocationRegExp.exec(location);
                  if (r === null) {
                    return reject(new Error("R.Flux.prefetchFluxStores(...): incorrect location ('" + this.displayName + "', '" + location + "', '" + stateKey + "')"));
                  } else {
                    var storeName = r[1];
                    var storeKey = r[2];
                    co(regeneratorRuntime.mark(function callee$4$0() {
                      return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                        while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                            context$5$0.next = 2;
                            return this.getFluxStore(storeName).fetch(storeKey);

                          case 2: state[stateKey] = context$5$0.sent;
                          case 3:
                          case "end": return context$5$0.stop();
                        }
                      }, callee$4$0, this);
                    })).call(this, function (err) {
                      if (err) {
                        return reject(R.Debug.extendError(err, "Couldn't prefetch subscription ('" + stateKey + "', '" + location + "')"));
                      } else {
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
              childContext = (surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : this.context);

              surrogateComponent.componentWillUnmount();

              context$2$0.next = 14;
              return React.Children.mapTree(renderedComponent, function (childComponent) {
                return new Promise(function (resolve, reject) {
                  if (!_.isObject(childComponent)) {
                    return resolve();
                  }
                  var childType = childComponent.type;
                  if (!_.isObject(childType) || !childType.__ReactOnRailsSurrogate) {
                    return resolve();
                  }
                  //Create the React instance of current child with props, but without computed state
                  var surrogateChildComponent = new childType.__ReactOnRailsSurrogate(childContext, childComponent.props);
                  if (!surrogateChildComponent.componentWillMount) {
                    R.Debug.dev(function () {
                      console.error("Component doesn't have componentWillMount. Maybe you forgot R.Component.Mixin? ('" + surrogateChildComponent.displayName + "')");
                    });
                  }
                  surrogateChildComponent.componentWillMount();
                  co(regeneratorRuntime.mark(function callee$4$0() {
                    return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                          context$5$0.next = 2;
                          return surrogateChildComponent.prefetchFluxStores();

                        case 2: surrogateChildComponent.componentWillUnmount();
                        case 3:
                        case "end": return context$5$0.stop();
                      }
                    }, callee$4$0, this);
                  })).call(this, function (err) {
                    if (err) {
                      return reject(R.Debug.extendError(err, "Couldn't prefetch child component"));
                    } else {
                      return resolve();
                    }
                  });
                });
              });

            case 14:
            case "end": return context$2$0.stop();
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
          while (1) switch (context$2$0.prev = context$2$0.next) {case 0:
              r = abstractLocationRegExp.exec(location);

              assert(r !== null, "R.Flux.dispatch(...): incorrect location ('" + this.displayName + "')");
              entry = {
                dispatcherName: r[1],
                action: r[2] };
              context$2$0.next = 5;
              return this.getFluxDispatcher(entry.dispatcherName).dispatch(entry.action, params);

            case 5: return context$2$0.abrupt("return", context$2$0.sent);
            case 6:
            case "end": return context$2$0.stop();
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
        var currentSubscriptions = _.object(_.map(this._FluxMixinSubscriptions, function (entry) {
          return [entry.location, entry.stateKey];
        }));

        var nextSubscriptions = this.getFluxStoreSubscriptions(props);
        _.each(currentSubscriptions, R.scope(function (stateKey, location) {
          if (!nextSubscriptions[location] || nextSubscriptions[location] !== currentSubscriptions[location]) {
            this._FluxMixinUnsubscribe(stateKey, location);
          }
        }, this));
        _.each(nextSubscriptions, R.scope(function (stateKey, location) {
          if (!currentSubscriptions[location] || currentSubscriptions[location] !== stateKey) {
            this._FluxMixinSubscribe(stateKey, location);
          }
        }, this));

        var currentListeners = _.object(_.map(this._FluxMixinListeners, function (entry) {
          return [entry.location, entry.fn];
        }));
        var nextListeners = this.getFluxEventEmittersListeners(props);
        _.each(currentListeners, R.scope(function (fn, location) {
          if (!nextListeners[location] || nextListeners[location] !== currentListeners[location]) {
            this._FluxMixinRemoveListener(fn, location);
          }
        }, this));
        _.each(nextListeners, R.scope(function (fn, location) {
          if (!currentListeners[location] || currentListeners[location] !== fn) {
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
          storeKey: r[2] };
        R.Debug.dev(R.scope(function () {
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
          storeKey: r[2] };
        R.Debug.dev(R.scope(function () {
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
          subscription: subscription };
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
        return R.scope(function (val) {
          if (!this.isMounted()) {
            return;
          }
          var previousVal = this.state ? this.state[stateKey] : undefined;
          if (_.isEqual(previousVal, val)) {
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
          eventName: r[2] };
        R.Debug.dev(R.scope(function () {
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
          listener: listener };
      },
      /**
      * @method _FluxMixinEventEmitterEmit
      * @param {string} eventEmitterName The eventEmitterName
      * @param {string} eventName The eventName
      * @param {Fonction} fn The fn
      * @private
      */
      _FluxMixinEventEmitterEmit: function _FluxMixinEventEmitterEmit(eventEmitterName, eventName, fn) {
        return R.scope(function (params) {
          if (!this.isMounted()) {
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
        R.Debug.dev(R.scope(function () {
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
        R.Debug.dev(R.scope(function () {
          assert(_.has(this._FluxMixinListeners, uniqueId), "R.Flux.Mixin._FluxMixinRemoveListener(...): no such listener.");
        }, this));
        var listener = entry.listener;
        var eventEmitterName = entry.eventEmitterName;
        this.getFluxEventEmitter(eventEmitterName).removeListener(listener);
        delete this._FluxMixinListeners[uniqueId];
      } } };

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
      R.Debug.dev(R.scope(function () {
        assert(!this._shouldInjectFromStores, "R.Flux.FluxInstance.startInjectingFromStores(...): should not be injecting from Stores.");
      }, this));
      this._shouldInjectFromStores = true;
    },
    /**
    * <p>Unsets the flag telling all the flux-mixed-in components to attempt to inject pre-fetched values from the cache. Used for pre-rendering magic.</p>
    * @method startInjectingFromStores
    */
    stopInjectingFromStores: function stopInjectingFromStores() {
      R.Debug.dev(R.scope(function () {
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
      return R.Base64.encode(JSON.stringify(_.mapValues(this._stores, function (store) {
        return store.serialize();
      })));
    },
    /**
    * Unserialize a serialized flux by the server in order to initialize flux into client
    * @method unserialize
    * @param {string} str The string to unserialize
    */
    unserialize: function unserialize(str) {
      _.each(JSON.parse(R.Base64.decode(str)), R.scope(function (serializedStore, name) {
        R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      R.Debug.dev(R.scope(function () {
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
      if (R.isClient()) {
        this.destroyInClient();
      }
      if (R.isServer()) {
        this.destroyInServer();
      }
      _.each(this._stores, function (store) {
        store.destroy();
      });
      this._stores = null;
      _.each(this._eventEmitters, function (eventEmitter) {
        eventEmitter.destroy();
      });
      this._eventEmitters = null;
      _.each(this._dispatchers, function (dispatcher) {
        dispatcher.destroy();
      });
      this._dispatchers = null;
    } });

  return Flux;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixNQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFcEIsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztBQUVkLE1BQUksc0JBQXNCLEdBQUcsZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0I3QyxNQUFJLElBQUksR0FBRzs7Ozs7O0FBTVAsY0FBVSxFQUFFLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUNuQyxPQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ25CLGNBQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFDckUsY0FBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxpRUFBaUUsQ0FBQyxDQUFDO0FBQ3RKLGNBQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsK0VBQStFLENB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LEVBQUUsQ0FBQztPQUN4QixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUM1QixFQUNKLENBQUMsQ0FBQzs7QUFFSCxTQUFPLElBQUksQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5GbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG4gICAgdmFyIGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIik7XG4gICAgdmFyIGNvID0gcmVxdWlyZShcImNvXCIpO1xuICAgIHZhciBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgdmFyIGFic3RyYWN0TG9jYXRpb25SZWdFeHAgPSAvXiguKik6XFwvKC4qKSQvO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIDxwPlIuRmx1eCByZXByZXNlbnRzIHRoZSBkYXRhIGZsb3dpbmcgZnJvbSB0aGUgYmFja2VuZHMgKGVpdGhlciBsb2NhbCBvciByZW1vdGUpLlxuICAgICAqIFRvIGVuYWJsZSBpc29tb3ByaGljIHJlbmRlcmluZywgaXQgc2hvdWxkIGJlIGNvbXB1dGFibGUgZWl0aGVyIG9yIGluIHRoZSBzZXJ2ZXIgb3IgaW4gdGhlIGNsaWVudC5cbiAgICAgKiBJdCByZXByZXNlbnRzIHRoZSBnbG9iYWwgc3RhdGUsIGluY2x1ZGluZyBidXQgbm90IGxpbWl0ZWQgdG86PC9wPlxuICAgICAqIDx1bD5cbiAgICAgKiA8bGk+Um91dGluZyBpbmZvcm1hdGlvbjwvbGk+XG4gICAgICogPGxpPlNlc3Npb24gaW5mb3JtYXRpb248L2xpPlxuICAgICAqIDxsaT5OYXZpZ2F0aW9uIGluZm9ybWF0aW9uPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIDxwPkluc2lkZSBhbiBBcHAsIGVhY2ggY29tcG9uZW50cyBjYW4gaW50ZXJhY3Qgd2l0aCB0aGUgRmx1eCBpbnN0YW5jZSB1c2luZyBGbHV4Lk1peGluIChnZW5lcmFsbHkgdmlhIFJvb3QuTWl4aW4gb3IgQ29tcG9uZW50Lk1peGluKS48L3A+XG4gICAgICogQGNsYXNzIFIuRmx1eFxuICAgICAqL1xuICAgIHZhciBGbHV4ID0ge1xuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZXR1cm5zIGEgRmx1eCBjb25zdHJ1Y3RvcjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUZsdXhcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3BlY3MgVGhlIHNwZWNpZmljYXRpb25zIG9mIHRoZSBmbHV4XG4gICAgICAgICovXG4gICAgICAgIGNyZWF0ZUZsdXg6IGZ1bmN0aW9uIGNyZWF0ZUZsdXgoc3BlY3MpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFzc2VydChfLmlzT2JqZWN0KHNwZWNzKSwgXCJSLmNyZWF0ZUZsdXgoLi4uKTogZXhwZWN0aW5nIGFuIE9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHNwZWNzLCBcImJvb3RzdHJhcEluQ2xpZW50XCIpICYmIF8uaXNGdW5jdGlvbihzcGVjcy5ib290c3RyYXBJbkNsaWVudCksIFwiUi5jcmVhdGVGbHV4KC4uLik6IHJlcXVpcmVzIGJvb3RzdHJhcEluQ2xpZW50KFdpbmRvdyk6IEZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgXCJib290c3RyYXBJblNlcnZlclwiKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MuYm9vdHN0cmFwSW5TZXJ2ZXIpLCBcIlIuY3JlYXRlRmx1eCguLi4pOiByZXF1aXJlcyBib290c3RyYXBJblNlcnZlcihodHRwLkluY29taW5nTWVzc2FnZSk6IEZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgRmx1eEluc3RhbmNlID0gZnVuY3Rpb24oKSB7IFIuRmx1eC5GbHV4SW5zdGFuY2UuY2FsbCh0aGlzKTsgfTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKEZsdXhJbnN0YW5jZS5wcm90b3R5cGUsIFIuRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlLCBzcGVjcyk7XG4gICAgICAgICAgICByZXR1cm4gRmx1eEluc3RhbmNlO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5DaGVjayBpZiB0aGUgZmx1eCBwcm92aWRlZCBieSBwcm9wcyBpcyBhbiBvYmplY3QgYW5kIGEgZmx1eCBpbnN0YW5jZTwvcD5cbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgVGhlIHByb3BzIHRvIGNoZWNrXG4gICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdmFsaWQgVGhlIHJlc3VsdCBib29sZWFuIG9mIHRoZSBjaGVja2VkIGZsdXhcbiAgICAgICAgKi9cbiAgICAgICAgUHJvcFR5cGU6IGZ1bmN0aW9uIHZhbGlkYXRlRmx1eChwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBmbHV4ID0gcHJvcHMuZmx1eDtcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IG51bGw7XG4gICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc09iamVjdChmbHV4KSAmJiBmbHV4Ll9pc0ZsdXhJbnN0YW5jZV8sIFwiUi5Sb290LmNyZWF0ZUNsYXNzKC4uLik6IGV4cGVjdGluZyBhIFIuRmx1eC5GbHV4SW5zdGFuY2UuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIEZsdXhJbnN0YW5jZTogZnVuY3Rpb24gRmx1eEluc3RhbmNlKCkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVzID0ge307XG4gICAgICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzID0ge307XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IHt9O1xuICAgICAgICB9LFxuICAgICAgICBNaXhpbjoge1xuICAgICAgICAgICAgX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnM6IG51bGwsXG4gICAgICAgICAgICBfRmx1eE1peGluTGlzdGVuZXJzOiBudWxsLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPlRoZSBnZXRJbml0aWFsU3RhdGUgb2YgUmVhY3QgbWVjaGFuaWNzIHdpbGwgYmUgY2FsbCBhdDo8L3A+XG4gICAgICAgICAgICAqICAtIFJlYWN0LnJlbmRlcigpIDxiciAvPlxuICAgICAgICAgICAgKiAgLSBSZWFjdC5yZW5kZXJUb1N0cmluZygpIDxiciAvPlxuICAgICAgICAgICAgKiA8cD5OZXZlciByZXR1cm4gYSBudWxsIG9iamVjdCwgYnkgZGVmYXVsdDoge30sIG90aGVyd2lzZSByZXR1cm4gZGF0YSBzdG9ja2VkIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgc3RvcmU8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgZ2V0SW5pdGlhbFN0YXRlXG4gICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gb2JqZWN0IEFuIG9iamVjdCBsaWtlOiBbc3RhdGVLZXksIGRhdGFdXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4gICAgICAgICAgICAgICAgLyogUmV0dXJuIGNvbXB1dGVkIGRhdGFzIGZyb20gQ29tcG9uZW50J3Mgc3Vic2NyaXB0aW9ucyAqL1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5vYmplY3QoXy5tYXAoc3Vic2NyaXB0aW9ucywgUi5zY29wZShmdW5jdGlvbihzdGF0ZUtleSwgbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gYWJzdHJhY3RMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2VydChyICE9PSBudWxsLCBcIlIuRmx1eC5nZXRJbml0aWFsU3RhdGUoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnXCIgKyB0aGlzLmRpc3BsYXlOYW1lICsgXCInLCAnXCIgKyBsb2NhdGlvbiArIFwiJywgJ1wiICsgc3RhdGVLZXkgKyBcIicpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlTmFtZSA9IHJbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVLZXkgPSByWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKS5nZXQoc3RvcmVLZXkpXTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcykpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogUmV0dXJuIHN0YXRlS2V5Om51bGwgdmFsdWVzIGZvciBlYWNoIHN1YnNjcmlwdGlvbnMgKi9cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ub2JqZWN0KF8ubWFwKHN1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKHN0YXRlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCBudWxsXTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogPHA+VGhlIGNvbXBvbmVudFdpbGxNb3VudCBvZiBSZWFjdCBtZWNoYW5pY3M8L3A+XG4gICAgICAgICAgICAqIDxwPkluaXRpYWxpemUgZmx1eCBmdW5jdGlvbnMgZm9yIGVhY2ggY29tcG9uZW50cyB3aGVuIGNvbXBvbmVudFdpbGxNb3VudCBpcyBpbnZva2VkIGJ5IFJlYWN0PC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGNvbXBvbmVudFdpbGxNb3VudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCh0aGlzLmdldEZsdXggJiYgXy5pc0Z1bmN0aW9uKHRoaXMuZ2V0Rmx1eCksIFwiUi5GbHV4Lk1peGluLmNvbXBvbmVudFdpbGxNb3VudCguLi4pOiByZXF1aXJlcyBnZXRGbHV4KCk6IFIuRmx1eC5GbHV4SW5zdGFuY2UuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQodGhpcy5fQXN5bmNNaXhpbkhhc0FzeW5jTWl4aW4sIFwiUi5GbHV4Lk1peGluLmNvbXBvbmVudFdpbGxNb3VudCguLi4pOiByZXF1aXJlcyBSLkFzeW5jLk1peGluLlwiKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblJlc3BvbnNlcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0R2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHV4U3RvcmVXaWxsVXBkYXRlID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEZsdXhTdG9yZVdpbGxVcGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZSA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4U3RvcmVEaWRVcGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdCA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0Rmx1eEV2ZW50RW1pdHRlckRpZEVtaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPkNhbGwgdGhlIG1hbmFnZXIgc3Vic2NyaXB0aW9ucyB3aGVuIGNvbXBvbmVuZERpZE1vdW50IGlzIGludm9rZWQgYnkgUmVhY3QgKG9ubHkgY2xpZW50LXNpZGUpPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGNvbXBvbmVudERpZE1vdW50XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblVwZGF0ZSh0aGlzLnByb3BzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluVXBkYXRlKHByb3BzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluQ2xlYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRGbHV4U3RvcmU6IGZ1bmN0aW9uIGdldEZsdXhTdG9yZShuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rmx1eCgpLmdldFN0b3JlKG5hbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD5GZXRjaCBhbGwgY29tcG9uZW50cyBmcm9tIGEgcm9vdCBjb21wb25lbnQgaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSBhbGwgZGF0YSwgZmlsbCB0aGUgY29ycmVzcG9uZGluZyBzdG9yZXM8L3A+XG4gICAgICAgICAgICAqIDxwPkV4ZWN1dGVkIHNlcnZlci1zaWRlPHA+XG4gICAgICAgICAgICAqIEBtZXRob2QgcHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHJlZmV0Y2hGbHV4U3RvcmVzOiBmdW5jdGlvbiogcHJlZmV0Y2hGbHV4U3RvcmVzKCkge1xuICAgICAgICAgICAgICAgIC8vR2V0IGFsbCBzdWJzY3JpcHRpb25zIGZyb20gY3VycmVudCBjb21wb25hbnRcbiAgICAgICAgICAgICAgICAvL2VnLlwic3RvcmVOYW1lOi9zdG9yZUtleVwiOiBcInN0b3JlS2V5XCIsXG4gICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4gICAgICAgICAgICAgICAgdmFyIGN1ckNvdW50ID0gY291bnQ7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0ge307XG5cbiAgICAgICAgICAgICAgICAvL0ZvciBlYWNoIHN1YnNjcmlwdGlvbiwgY2FsbCB0aGUgcmVxdWVzdCB0byBnZXQgZGF0YSBmcm9tIHRoZSBVcGxpbmtTdG9yZSBvciBNZW1vcnlTdG9yZVxuICAgICAgICAgICAgICAgIC8vU2F2ZXMgdGhlIGRhdGEgaW4gYSB2YXJpYWJsZSBcInN0YXRlXCIgd2hpY2ggd2lsbCB0aGVuIHNlcnZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICB5aWVsZCBfLm1hcChzdWJzY3JpcHRpb25zLCBSLnNjb3BlKGZ1bmN0aW9uKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoUi5zY29wZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gYWJzdHJhY3RMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIlIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXMoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnXCIgKyB0aGlzLmRpc3BsYXlOYW1lICsgXCInLCAnXCIgKyBsb2NhdGlvbiArIFwiJywgJ1wiICsgc3RhdGVLZXkgKyBcIicpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZU5hbWUgPSByWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZUtleSA9IHJbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciBVcGxpbmssIHJlcXVlc3RlZCB1cmwgaXMgOiAvc3RvcmVOYW1lL3N0b3JlS2V5IG9uIHRoZSBVcGxpbmtTZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGUgcmVzcG9uc2UgaXMgc3RvcmVkIGluIHN0YXRlW3N0YXRlS2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciBNZW1vcnksIGRhdGEgY29tZXMgZnJvbSBpbnN0YWxsZWQgcGx1Z2lucyBsaWtlIFdpbmRvdywgSGlzdG9yeSwgZXRjLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2ZpbmFsbHkgZGF0YSBpcyBzYXZlZCBpbiB0aGlzLmdldEZsdXhTdG9yZShzdG9yZU5hbWUpIHRoYXQgd2lsbCBiZSB1c2VkIGluIGdldEluaXRpYWxTdGF0ZSBmb3IgY3VycmVudENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVtzdGF0ZUtleV0gPSB5aWVsZCB0aGlzLmdldEZsdXhTdG9yZShzdG9yZU5hbWUpLmZldGNoKHN0b3JlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoUi5EZWJ1Zy5leHRlbmRFcnJvcihlcnIsIFwiQ291bGRuJ3QgcHJlZmV0Y2ggc3Vic2NyaXB0aW9uICgnXCIgKyBzdGF0ZUtleSArIFwiJywgJ1wiICsgbG9jYXRpb24gKyBcIicpXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXgoKS5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuICAgICAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiBjdXJyZW50IGNvbXBvbmVudCB3aXRoIGNvbXB1dGVkIHN0YXRlIGFuZCBwcm9wc1xuICAgICAgICAgICAgICAgIC8vSWYgc3RhdGUgb3IgcHJvcHMgYXJlIG5vdCBjb21wdXRlZCwgd2Ugd2lsbCBub3QgYmUgYWJsZSB0byBjb21wdXRlIHRoZSBuZXh0IGNoaWxkXG4gICAgICAgICAgICAgICAgdmFyIHN1cnJvZ2F0ZUNvbXBvbmVudCA9IG5ldyB0aGlzLl9fUmVhY3RPblJhaWxzU3Vycm9nYXRlKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXgoKS5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuXG4gICAgICAgICAgICAgICAgLy9SZW5kZXIgY3VycmVudCBjb21wb25lbnQgaW4gb3JkZXIgdG8gZ2V0IGNoaWxkc1xuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZENvbXBvbmVudCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5yZW5kZXIoKTtcblxuICAgICAgICAgICAgICAgIHZhciBjaGlsZENvbnRleHQgPSAoc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCA/IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSA6IHRoaXMuY29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAgICAgICAgIC8vRmV0Y2ggY2hpbGRyZW4gUmVhY3QgY29tcG9uZW50IG9mIGN1cnJlbnQgY29tcG9uZW50IGluIG9yZGVyIHRvIGNvbXB1dGUgdGhlIG5leHQgY2hpbGRcbiAgICAgICAgICAgICAgICB5aWVsZCBSZWFjdC5DaGlsZHJlbi5tYXBUcmVlKHJlbmRlcmVkQ29tcG9uZW50LCBmdW5jdGlvbihjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighXy5pc09iamVjdChjaGlsZENvbXBvbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkVHlwZSA9IGNoaWxkQ29tcG9uZW50LnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighXy5pc09iamVjdChjaGlsZFR5cGUpIHx8ICFjaGlsZFR5cGUuX19SZWFjdE9uUmFpbHNTdXJyb2dhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIGN1cnJlbnQgY2hpbGQgd2l0aCBwcm9wcywgYnV0IHdpdGhvdXQgY29tcHV0ZWQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdXJyb2dhdGVDaGlsZENvbXBvbmVudCA9IG5ldyBjaGlsZFR5cGUuX19SZWFjdE9uUmFpbHNTdXJyb2dhdGUoY2hpbGRDb250ZXh0LCBjaGlsZENvbXBvbmVudC5wcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb21wb25lbnQgZG9lc24ndCBoYXZlIGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLkNvbXBvbmVudC5NaXhpbj8gKCdcIiArIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmRpc3BsYXlOYW1lICsgXCInKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVjdXJzaXZseSBjYWxsICpwcmVmZXRjaEZsdXhTdG9yZXMqIGZvciB0aGlzIGN1cnJlbnQgY2hpbGQgaW4gb3JkZXIgdG8gY29tcHV0ZSBoaXMgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgXCJDb3VsZG4ndCBwcmVmZXRjaCBjaGlsZCBjb21wb25lbnRcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPlJldHVybnMgdGhlIEZsdXhFdmVudEVtaXR0ZXIgYWNjb3JkaW5nIHRoZSBwcm92aWRlZCBuYW1lPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGdldEZsdXhFdmVudEVtaXR0ZXJcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWVcbiAgICAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBFdmVudEVtaXR0ZXIgdGhlIEV2ZW50RW1pdHRlclxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEZsdXhFdmVudEVtaXR0ZXI6IGZ1bmN0aW9uIGdldEZsdXhFdmVudEVtaXR0ZXIobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZsdXgoKS5nZXRFdmVudEVtaXR0ZXIobmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPlJldHVybnMgdGhlIEZsdXhEaXNwYXRjaGVyIGFjY29yZGluZyB0aGUgcHJvdmlkZWQgbmFtZTwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBnZXRGbHV4RGlzcGF0Y2hlclxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZVxuICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IERpc3BhdGNoZXIgdGhlIERpc3BhdGNoZXJcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRGbHV4RGlzcGF0Y2hlcjogZnVuY3Rpb24gZ2V0Rmx1eERpc3BhdGNoZXIobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZsdXgoKS5nZXREaXNwYXRjaGVyKG5hbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD5HZXQgdGhlIGNvcnJlc3BvbmRpbmcgZGlzcGF0Y2hlciBhbmQgZGlzcGF0Y2ggdGhlIGFjdGlvbiBzdWJtaXR0ZWQgYnkgYSBSZWFjdCBjb21wb25lbnQ8YnIgLz5cbiAgICAgICAgICAgICogVHJpZ2dlZCBvbiBldmVudCBsaWtlIFwiY2xpY2tcIjwvcD5cbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIFRoZSB1cmwgdG8gZ28gKGVnLiBcIi8vSGlzdG9yeS9uYXZpZ2F0ZVwiKVxuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW0gVGhlIHNwZWNpZmljIGRhdGEgZm9yIHRoZSBhY3Rpb25cbiAgICAgICAgICAgICogQHJldHVybiB7Kn0gKiB0aGUgZGF0YSB0aGF0IG1heSBiZSBwcm92aWRlZCBieSB0aGUgZGlzcGF0Y2hlclxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiogZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHZhciByID0gYWJzdHJhY3RMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgXCJSLkZsdXguZGlzcGF0Y2goLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnXCIgKyB0aGlzLmRpc3BsYXlOYW1lICsgXCInKVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoZXJOYW1lOiByWzFdLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IHJbMl0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5nZXRGbHV4RGlzcGF0Y2hlcihlbnRyeS5kaXNwYXRjaGVyTmFtZSkuZGlzcGF0Y2goZW50cnkuYWN0aW9uLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0R2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9uczogZnVuY3Rpb24gZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfRmx1eE1peGluRGVmYXVsdEdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzOiBmdW5jdGlvbiBnZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfRmx1eE1peGluRGVmYXVsdEZsdXhTdG9yZVdpbGxVcGRhdGU6IGZ1bmN0aW9uIGZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBzdG9yZUtleSwgbmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eFN0b3JlRGlkVXBkYXRlOiBmdW5jdGlvbiBmbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBzdG9yZUtleSwgbmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0OiBmdW5jdGlvbiBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eEV2ZW50RW1pdHRlckRpZEVtaXQ6IGZ1bmN0aW9uIGZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBfRmx1eE1peGluQ2xlYXI6IGZ1bmN0aW9uIF9GbHV4TWl4aW5DbGVhcigpIHtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucywgdGhpcy5fRmx1eE1peGluVW5zdWJzY3JpYmUpO1xuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMsIHRoaXMuRmx1eE1peGluUmVtb3ZlTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD5NYW5hZ2Ugc3Vic2NyaXB0aW9ucywgdW5zdWJzY3JpcHRpb25zIGFuZCBldmVudCBlbWl0dGVyczwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluVXBkYXRlXG4gICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgcHJvcHMgb2YgY29tcG9uZW50XG4gICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX0ZsdXhNaXhpblVwZGF0ZTogZnVuY3Rpb24gX0ZsdXhNaXhpblVwZGF0ZShwcm9wcykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IF8ub2JqZWN0KF8ubWFwKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbZW50cnkubG9jYXRpb24sIGVudHJ5LnN0YXRlS2V5XTtcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgICAgICAgICAgIF8uZWFjaChjdXJyZW50U3Vic2NyaXB0aW9ucywgUi5zY29wZShmdW5jdGlvbihzdGF0ZUtleSwgbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIW5leHRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXSB8fCBuZXh0U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0gIT09IGN1cnJlbnRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluVW5zdWJzY3JpYmUoc3RhdGVLZXksIGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBfLmVhY2gobmV4dFN1YnNjcmlwdGlvbnMsIFIuc2NvcGUoZnVuY3Rpb24oc3RhdGVLZXksIGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0gfHwgY3VycmVudFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dICE9PSBzdGF0ZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaWJlKHN0YXRlS2V5LCBsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudExpc3RlbmVycyA9IF8ub2JqZWN0KF8ubWFwKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycywgZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtlbnRyeS5sb2NhdGlvbiwgZW50cnkuZm5dO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dExpc3RlbmVycyA9IHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpO1xuICAgICAgICAgICAgICAgIF8uZWFjaChjdXJyZW50TGlzdGVuZXJzLCBSLnNjb3BlKGZ1bmN0aW9uKGZuLCBsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZighbmV4dExpc3RlbmVyc1tsb2NhdGlvbl0gfHwgbmV4dExpc3RlbmVyc1tsb2NhdGlvbl0gIT09IGN1cnJlbnRMaXN0ZW5lcnNbbG9jYXRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lcihmbiwgbG9jYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIF8uZWFjaChuZXh0TGlzdGVuZXJzLCBSLnNjb3BlKGZ1bmN0aW9uKGZuLCBsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZighY3VycmVudExpc3RlbmVyc1tsb2NhdGlvbl0gfHwgY3VycmVudExpc3RlbmVyc1tsb2NhdGlvbl0gIT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5BZGRMaXN0ZW5lcihmbiwgbG9jYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5JbmplY3RcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlS2V5IFRoZSBzdGF0ZUtleVxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gVGhlIGxvY2F0aW9uXG4gICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX0ZsdXhNaXhpbkluamVjdDogZnVuY3Rpb24gX0ZsdXhNaXhpbkluamVjdChzdGF0ZUtleSwgbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHIgIT09IG51bGwsIFwiUi5GbHV4Ll9GbHV4TWl4aW5JbmplY3QoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnXCIgKyB0aGlzLmRpc3BsYXlOYW1lICsgXCInLCAnXCIgKyBsb2NhdGlvbiArIFwiJywgJ1wiICsgc3RhdGVLZXkgKyBcIicpXCIpO1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVOYW1lOiByWzFdLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZUtleTogclsyXSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCh0aGlzLmdldEZsdXgoKS5zaG91bGRJbmplY3RGcm9tU3RvcmVzKCksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKTogc2hvdWxkIG5vdCBpbmplY3QgZnJvbSBTdG9yZXMuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc1BsYWluT2JqZWN0KGVudHJ5KSwgXCJSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkluamVjdCguLi4pLmVudHJ5OiBleHBlY3RpbmcgT2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCBcInN0b3JlTmFtZVwiKSAmJiBfLmlzU3RyaW5nKGVudHJ5LnN0b3JlTmFtZSksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKS5lbnRyeS5zdG9yZU5hbWU6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksIFwic3RvcmVLZXlcIikgJiYgXy5pc1N0cmluZyhlbnRyeS5zdG9yZUtleSksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKS5lbnRyeS5zdG9yZUtleTogZXhwZWN0aW5nIFN0cmluZy5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoUi5yZWNvcmQoc3RhdGVLZXksIHRoaXMuZ2V0Rmx1eFN0b3JlKGVudHJ5LnN0b3JlTmFtZSkuZ2V0KGVudHJ5LnN0b3JlS2V5KSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD5BbGxvdyBhIFJlYWN0IENvbXBvbmVudCB0byBzdWJzY3JpYmUgYXQgYW55IGRhdGEgaW4gb3JkZXIgdG8gZmlsbCBzdGF0ZTwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluU3Vic2NyaWJlXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZUtleSBUaGUga2V5IHRvIGJlIHN1YnNjcmliZWRcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIFRoZSB1cmwgdGhhdCB3aWxsIGJlIHJlcXVlc3RlZFxuICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9GbHV4TWl4aW5TdWJzY3JpYmU6IGZ1bmN0aW9uIF9GbHV4TWl4aW5TdWJzY3JpYmUoc3RhdGVLZXksIGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuICAgICAgICAgICAgICAgIGFzc2VydChyICE9PSBudWxsLCBcIlIuRmx1eC5fRmx1eE1peGluU3Vic2NyaWJlKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJ1wiICsgdGhpcy5kaXNwbGF5TmFtZSArIFwiJywgJ1wiICsgbG9jYXRpb24gKyBcIicsICdcIiArIHN0YXRlS2V5ICsgXCInKVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlTmFtZTogclsxXSxcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVLZXk6IHJbMl0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc1BsYWluT2JqZWN0KGVudHJ5KSwgXCJSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblN1YnNjcmliZSguLi4pLmVudHJ5OiBleHBlY3RpbmcgT2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCBcInN0b3JlTmFtZVwiKSAmJiBfLmlzU3RyaW5nKGVudHJ5LnN0b3JlTmFtZSksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5TdWJzY3JpYmUoLi4uKS5lbnRyeS5zdG9yZU5hbWU6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksIFwic3RvcmVLZXlcIikgJiYgXy5pc1N0cmluZyhlbnRyeS5zdG9yZUtleSksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5TdWJzY3JpYmUoLi4uKS5lbnRyeS5zdG9yZUtleTogZXhwZWN0aW5nIFN0cmluZy5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHZhciBzdG9yZSA9IHRoaXMuZ2V0Rmx1eFN0b3JlKGVudHJ5LnN0b3JlTmFtZSk7XG4gICAgICAgICAgICAgICAgLy9TdWJzY3JpYmUgYW5kIHJlcXVlc3QgU3RvcmUgdG8gZ2V0IGRhdGFcbiAgICAgICAgICAgICAgICAvL0NhbGwgaW1tZWRpYXRseSBfRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGUgd2l0aCBjb21wdXRlZCBkYXRhIGluIG9yZGVyIHRvIGNhbGwgc2V0U3RhdGVcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gc3RvcmUuc3ViKGVudHJ5LnN0b3JlS2V5LCB0aGlzLl9GbHV4TWl4aW5TdG9yZVNpZ25hbFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24pKTtcblxuICAgICAgICAgICAgICAgIC8vU2F2ZSBzdWJzY3JpcHRpb25cbiAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVLZXk6IHN0YXRlS2V5LFxuICAgICAgICAgICAgICAgICAgICBzdG9yZU5hbWU6IGVudHJ5LnN0b3JlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uOiBzdWJzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogPHA+UmVyZW5kZXJpbmcgYSBjb21wb25lbnQgd2hlbiBkYXRhIHVwZGF0ZSBvY2N1cnM8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblN0b3JlU2lnbmFsVXBkYXRlXG4gICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZUtleSBUaGUga2V5IHRvIGJlIHN1YnNjcmliZWRcbiAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2F0aW9uIFRoZSB1cmwgdGhhdCB3aWxsIGJlIHJlcXVlc3RlZFxuICAgICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGU6IGZ1bmN0aW9uIF9GbHV4TWl4aW5TdG9yZVNpZ25hbFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUi5zY29wZShmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNWYWwgPSB0aGlzLnN0YXRlID8gdGhpcy5zdGF0ZVtzdGF0ZUtleV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKF8uaXNFcXVhbChwcmV2aW91c1ZhbCwgdmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1eFN0b3JlV2lsbFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24sIHZhbCwgcHJldmlvdXNWYWwpO1xuICAgICAgICAgICAgICAgICAgICAvL0NhbGwgcmVhY3QgQVBJIGluIG9yZGVyIHRvIFJlcmVuZGVyIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFIucmVjb3JkKHN0YXRlS2V5LCB2YWwpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbHV4U3RvcmVEaWRVcGRhdGUoc3RhdGVLZXksIGxvY2F0aW9uLCB2YWwsIHByZXZpb3VzVmFsKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluQWRkTGlzdGVuZXJcbiAgICAgICAgICAgICogQHBhcmFtIHtGb25jdGlvbn0gZm4gVGhlIGZuXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBUaGUgbG9jYXRpb25cbiAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfRmx1eE1peGluQWRkTGlzdGVuZXI6IGZ1bmN0aW9uIF9GbHV4TWl4aW5BZGRMaXN0ZW5lcihmbiwgbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHIgIT09IG51bGwsIFwiUi5GbHV4Ll9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pOiBpbmNvcnJlY3QgbG9jYXRpb24gKCdcIiArIHRoaXMuZGlzcGxheU5hbWUgKyBcIicsICdcIiArIGxvY2F0aW9uICsgXCInKVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlck5hbWU6IHJbMV0sXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogclsyXSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChfLmlzUGxhaW5PYmplY3QoZW50cnkpLCBcIlIuRmx1eC5NaXhpbi5fRmx1eE1peGluQWRkTGlzdGVuZXIoLi4uKS5lbnRyeTogZXhwZWN0aW5nIE9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhlbnRyeSwgXCJldmVudEVtaXR0ZXJOYW1lXCIpICYmIF8uaXNTdHJpbmcoZW50cnkuZXZlbnRFbWl0dGVyTmFtZSksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pLmVudHJ5LmV2ZW50RW1pdHRlck5hbWU6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksIFwiZXZlbnROYW1lXCIpICYmIF8uaXNTdHJpbmcoZW50cnkuZXZlbnROYW1lKSwgXCJSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLikuZW50cnkuZXZlbnROYW1lOiBleHBlY3RpbmcgU3RyaW5nLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCBcImZuXCIpICYmIF8uaXNGdW5jdGlvbihmbiksIFwiUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pLmVudHJ5LmZuOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyKGVudHJ5LmV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGV2ZW50RW1pdHRlci5hZGRMaXN0ZW5lcihlbnRyeS5ldmVudE5hbWUsIHRoaXMuX0ZsdXhNaXhpbkV2ZW50RW1pdHRlckVtaXQoZW50cnkuZXZlbnRFbWl0dGVyTmFtZSwgZW50cnkuZXZlbnROYW1lLCBlbnRyeS5mbikpO1xuICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tsaXN0ZW5lci51bmlxdWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZm46IGZuLFxuICAgICAgICAgICAgICAgICAgICBldmVudEVtaXR0ZXJOYW1lOiBlbnRyeS5ldmVudEVtaXR0ZXJOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluRXZlbnRFbWl0dGVyRW1pdFxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRFbWl0dGVyTmFtZSBUaGUgZXZlbnRFbWl0dGVyTmFtZVxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWVcbiAgICAgICAgICAgICogQHBhcmFtIHtGb25jdGlvbn0gZm4gVGhlIGZuXG4gICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX0ZsdXhNaXhpbkV2ZW50RW1pdHRlckVtaXQ6IGZ1bmN0aW9uIF9GbHV4TWl4aW5FdmVudEVtaXR0ZXJFbWl0KGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUi5zY29wZShmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdChldmVudEVtaXR0ZXJOYW1lLCBldmVudE5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGZuKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5VbnN1YnNjcmliZVxuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW50cnkgVGhlIGVudHJ5XG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1bmlxdWVJZCBUaGUgdW5pcXVlSWRcbiAgICAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfRmx1eE1peGluVW5zdWJzY3JpYmU6IGZ1bmN0aW9uIF9GbHV4TWl4aW5VbnN1YnNjcmliZShlbnRyeSwgdW5pcXVlSWQpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucywgdW5pcXVlSWQpLCBcIlIuRmx1eC5NaXhpbi5fRmx1eE1peGluVW5zdWJzY3JpYmUoLi4uKTogbm8gc3VjaCBzdWJzY3JpcHRpb24uXCIpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gZW50cnkuc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBzdG9yZU5hbWUgPSBlbnRyeS5zdG9yZU5hbWU7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKS51bnN1YihzdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW3VuaXF1ZUlkXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluUmVtb3ZlTGlzdGVuZXJcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5IFRoZSBlbnRyeVxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pcXVlSWQgVGhlIHVuaXF1ZUlkXG4gICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX0ZsdXhNaXhpblJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbiBfRmx1eE1peGluUmVtb3ZlTGlzdGVuZXIoZW50cnksIHVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycywgdW5pcXVlSWQpLCBcIlIuRmx1eC5NaXhpbi5fRmx1eE1peGluUmVtb3ZlTGlzdGVuZXIoLi4uKTogbm8gc3VjaCBsaXN0ZW5lci5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGVudHJ5Lmxpc3RlbmVyO1xuICAgICAgICAgICAgICAgIHZhciBldmVudEVtaXR0ZXJOYW1lID0gZW50cnkuZXZlbnRFbWl0dGVyTmFtZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbdW5pcXVlSWRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgXy5leHRlbmQoRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlLCAvKiogQGxlbmRzIFIuRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlICove1xuICAgICAgICBfaXNGbHV4SW5zdGFuY2VfOiB0cnVlLFxuICAgICAgICBfc3RvcmVzOiBudWxsLFxuICAgICAgICBfZXZlbnRFbWl0dGVyczogbnVsbCxcbiAgICAgICAgX2Rpc3BhdGNoZXJzOiBudWxsLFxuICAgICAgICBfc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogZmFsc2UsXG4gICAgICAgIGJvb3RzdHJhcEluQ2xpZW50OiBfLm5vb3AsXG4gICAgICAgIGJvb3RzdHJhcEluU2VydmVyOiBfLm5vb3AsXG4gICAgICAgIGRlc3Ryb3lJbkNsaWVudDogXy5ub29wLFxuICAgICAgICBkZXN0cm95SW5TZXJ2ZXI6IF8ubm9vcCxcbiAgICAgICAgc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogZnVuY3Rpb24gc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5TZXRzIHRoZSBmbGFnIHRlbGxpbmcgYWxsIHRoZSBmbHV4LW1peGVkLWluIGNvbXBvbmVudHMgdG8gYXR0ZW1wdCB0byBpbmplY3QgcHJlLWZldGNoZWQgdmFsdWVzIGZyb20gdGhlIGNhY2hlLiBVc2VkIGZvciBwcmUtcmVuZGVyaW5nIG1hZ2ljLjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIHN0YXJ0SW5qZWN0aW5nRnJvbVN0b3Jlc1xuICAgICAgICAqL1xuICAgICAgICBzdGFydEluamVjdGluZ0Zyb21TdG9yZXM6IGZ1bmN0aW9uIHN0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KCF0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLCBcIlIuRmx1eC5GbHV4SW5zdGFuY2Uuc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKC4uLik6IHNob3VsZCBub3QgYmUgaW5qZWN0aW5nIGZyb20gU3RvcmVzLlwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5VbnNldHMgdGhlIGZsYWcgdGVsbGluZyBhbGwgdGhlIGZsdXgtbWl4ZWQtaW4gY29tcG9uZW50cyB0byBhdHRlbXB0IHRvIGluamVjdCBwcmUtZmV0Y2hlZCB2YWx1ZXMgZnJvbSB0aGUgY2FjaGUuIFVzZWQgZm9yIHByZS1yZW5kZXJpbmcgbWFnaWMuPC9wPlxuICAgICAgICAqIEBtZXRob2Qgc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzXG4gICAgICAgICovXG4gICAgICAgIHN0b3BJbmplY3RpbmdGcm9tU3RvcmVzOiBmdW5jdGlvbiBzdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMsIFwiUi5GbHV4LkZsdXhJbnN0YW5jZS5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcyguLi4pOiBzaG91bGQgYmUgaW5qZWN0aW5nIGZyb20gU3RvcmVzLlwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+U2VyaWFsaXplIGEgc2VyaWFsaXplZCBmbHV4IGJ5IHRoZSBzZXJ2ZXIgaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSBmbHV4IGludG8gY2xpZW50PC9wPlxuICAgICAgICAqIEBtZXRob2Qgc2VyaWFsaXplXG4gICAgICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgVGhlIHNlcmlhbGl6ZWQgc3RyaW5nXG4gICAgICAgICovXG4gICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gc2VyaWFsaXplKCkge1xuICAgICAgICAgICAgcmV0dXJuIFIuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeShfLm1hcFZhbHVlcyh0aGlzLl9zdG9yZXMsIGZ1bmN0aW9uKHN0b3JlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnNlcmlhbGl6ZSgpO1xuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogVW5zZXJpYWxpemUgYSBzZXJpYWxpemVkIGZsdXggYnkgdGhlIHNlcnZlciBpbiBvcmRlciB0byBpbml0aWFsaXplIGZsdXggaW50byBjbGllbnRcbiAgICAgICAgKiBAbWV0aG9kIHVuc2VyaWFsaXplXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHVuc2VyaWFsaXplXG4gICAgICAgICovXG4gICAgICAgIHVuc2VyaWFsaXplOiBmdW5jdGlvbiB1bnNlcmlhbGl6ZShzdHIpIHtcbiAgICAgICAgICAgIF8uZWFjaChKU09OLnBhcnNlKFIuQmFzZTY0LmRlY29kZShzdHIpKSwgUi5zY29wZShmdW5jdGlvbihzZXJpYWxpemVkU3RvcmUsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc3RvcmVzLCBuYW1lKSwgXCJSLkZsdXguRmx1eEluc3RhbmNlLnVuc2VyaWFsaXplKC4uLik6IG5vIHN1Y2ggU3RvcmUuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3Jlc1tuYW1lXS51bnNlcmlhbGl6ZShzZXJpYWxpemVkU3RvcmUpO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5HZXR0ZXIgZm9yIHRoZSBzdG9yZTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGdldFN0b3JlXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHN0b3JlXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBzdG9yZSBUaGUgY29ycmVzcG9uZGluZyBzdG9yZVxuICAgICAgICAqL1xuICAgICAgICBnZXRTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmUobmFtZSkge1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc3RvcmVzLCBuYW1lKSwgXCJSLkZsdXguRmx1eEluc3RhbmNlLmdldFN0b3JlKC4uLik6IG5vIHN1Y2ggU3RvcmUuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmVzW25hbWVdO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZWdpc3RlciBhIHN0b3JlIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwIDxiciAvPlxuICAgICAgICAqIFR5cGljYWxseSA6IE1lbW9yeSBvciBVcGxpbms8L3A+XG4gICAgICAgICogQG1ldGhvZCByZWdpc3RlclN0b3JlXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gcmVnaXN0ZXJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RvcmUgVGhlIHN0b3JlIHRvIHJlZ2lzdGVyXG4gICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVyU3RvcmU6IGZ1bmN0aW9uIHJlZ2lzdGVyU3RvcmUobmFtZSwgc3RvcmUpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHN0b3JlLl9pc1N0b3JlSW5zdGFuY2VfLCBcIlIuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJTdG9yZSguLi4pOiBleHBlY3RpbmcgYSBSLlN0b3JlLlN0b3JlSW5zdGFuY2UuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KCFfLmhhcyh0aGlzLl9zdG9yZXMsIG5hbWUpLCBcIlIuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJTdG9yZSguLi4pOiBuYW1lIGFscmVhZHkgYXNzaWduZWQuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZXNbbmFtZV0gPSBzdG9yZTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+R2V0dGVyIGZvciB0aGUgZXZlbnQgZW1pdHRlcjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50RW1pdHRlclxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzdG9yZVxuICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gZXZlbnRFbWl0dGVyIFRoZSBjb3JyZXNwb25kaW5nIGV2ZW50IGVtaXR0ZXJcbiAgICAgICAgKi9cbiAgICAgICAgZ2V0RXZlbnRFbWl0dGVyOiBmdW5jdGlvbiBnZXRFdmVudEVtaXR0ZXIobmFtZSkge1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fZXZlbnRFbWl0dGVycywgbmFtZSksIFwiUi5GbHV4LkZsdXhJbnN0YW5jZS5nZXRFdmVudEVtaXR0ZXIoLi4uKTogbm8gc3VjaCBFdmVudEVtaXR0ZXIuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRFbWl0dGVyc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZWdpc3RlciBhbiBldmVudCBlbWl0dGVyIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwPC9wPlxuICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJFdmVudEVtaXR0ZXJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSB0byByZWdpc3RlclxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudEVtaXR0ZXIgVGhlIGV2ZW50IGVtaXR0ZXIgdG8gcmVnaXN0ZXJcbiAgICAgICAgKi9cbiAgICAgICAgcmVnaXN0ZXJFdmVudEVtaXR0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRFbWl0dGVyKG5hbWUsIGV2ZW50RW1pdHRlcikge1xuICAgICAgICAgICAgYXNzZXJ0KFIuaXNDbGllbnQoKSwgXCJSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyRXZlbnRFbWl0dGVyKC4uLik6IHNob3VsZCBub3QgYmUgY2FsbGVkIGluIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQoZXZlbnRFbWl0dGVyLl9pc0V2ZW50RW1pdHRlckluc3RhbmNlXywgXCJSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyRXZlbnRFbWl0dGVyKC4uLik6IGV4cGVjdGluZyBhIFIuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlckluc3RhbmNlLiAoXCIgKyBuYW1lICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fZXZlbnRFbWl0dGVycywgbmFtZSksIFwiUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckV2ZW50RW1pdHRlciguLi4pOiBuYW1lIGFscmVhZHkgYXNzaWduZWQuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW25hbWVdID0gZXZlbnRFbWl0dGVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkdldHRlciBmb3IgdGhlIGRpc3BhdGNoZXI8L3A+XG4gICAgICAgICogQG1ldGhvZCBnZXREaXNwYXRjaGVyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHN0b3JlXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBkaXNwYXRjaGVyIFRoZSBjb3JyZXNwb25kaW5nIGRpc3BhdGNoZXJcbiAgICAgICAgKi9cbiAgICAgICAgZ2V0RGlzcGF0Y2hlcjogZnVuY3Rpb24gZ2V0RGlzcGF0Y2hlcihuYW1lKSB7XG4gICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9kaXNwYXRjaGVycywgbmFtZSksIFwiUi5GbHV4LkZsdXhJbnN0YW5jZS5nZXREaXNwYXRjaGVyKC4uLik6IG5vIHN1Y2ggRGlzcGF0Y2hlci4gKFwiICsgbmFtZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyc1tuYW1lXTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+UmVnaXN0ZXIgYSBkaXNwYXRjaGVyIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwPC9wPlxuICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJEaXNwYXRjaGVyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gcmVnaXN0ZXJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZGlzcGF0Y2hlciBUaGUgZGlzcGF0Y2hlciB0byByZWdpc3RlclxuICAgICAgICAqL1xuICAgICAgICByZWdpc3RlckRpc3BhdGNoZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzcGF0Y2hlcihuYW1lLCBkaXNwYXRjaGVyKSB7XG4gICAgICAgICAgICBhc3NlcnQoUi5pc0NsaWVudCgpLCBcIlIuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJEaXNwYXRjaGVyKC4uLik6IHNob3VsZCBub3QgYmUgY2FsbGVkIGluIHRoZSBzZXJ2ZXIuIChcIiArIG5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFzc2VydChkaXNwYXRjaGVyLl9pc0Rpc3BhdGNoZXJJbnN0YW5jZV8sIFwiUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckRpc3BhdGNoZXIoLi4uKTogZXhwZWN0aW5nIGEgUi5EaXNwYXRjaGVyLkRpc3BhdGNoZXJJbnN0YW5jZSAoXCIgKyBuYW1lICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fZGlzcGF0Y2hlcnMsIG5hbWUpLCBcIlIuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJEaXNwYXRjaGVyKC4uLik6IG5hbWUgYWxyZWFkeSBhc3NpZ25lZC4gKFwiICsgbmFtZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW25hbWVdID0gZGlzcGF0Y2hlcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5DbGVhcnMgdGhlIHN0b3JlIGJ5IGNhbGxpbmcgZWl0aGVyIHRoaXMuZGVzdHJveUluU2VydmVyIG9yIHRoaXMuZGVzdHJveUluQ2xpZW50IGFuZCByZWN1cnNpdmVseSBhcHBseWluZyBkZXN0cm95IG9uIGVhY2ggc3RvcmUvZXZlbnQgZW1pdHRyZS9kaXNwYXRjaGVyLjxiciAvPlxuICAgICAgICAqIFVzZWQgZm9yIHByZS1yZW5kZXJpbmcgbWFnaWMuPC9wPlxuICAgICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95SW5DbGllbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKFIuaXNTZXJ2ZXIoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveUluU2VydmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLmVhY2godGhpcy5fc3RvcmVzLCBmdW5jdGlvbihzdG9yZSkge1xuICAgICAgICAgICAgICAgIHN0b3JlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVzID0gbnVsbDtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9ldmVudEVtaXR0ZXJzLCBmdW5jdGlvbihldmVudEVtaXR0ZXIpIHtcbiAgICAgICAgICAgICAgICBldmVudEVtaXR0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzID0gbnVsbDtcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9kaXNwYXRjaGVycywgZnVuY3Rpb24oZGlzcGF0Y2hlcikge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IG51bGw7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gRmx1eDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=