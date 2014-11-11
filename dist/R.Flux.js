"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
// module.exports = function(R) {
//   const _ = R._;
//   const should = R.should;
//   const React = R.React;

//   const abstractLocationRegExp = /^(.*):\/(.*)$/;

//   class Flux {
//     constructor() {
//     }

//     bootstrap({ headers, guid, window, req }) { _.abstract(); }
//   }

//     /**
//      * @memberOf R
//      * <p>R.Flux represents the data flowing from the backends (either local or remote).
//      * To enable isomoprhic rendering, it should be computable either or in the server or in the client.
//      * It represents the global state, including but not limited to:</p>
//      * <ul>
//      * <li>Routing information</li>
//      * <li>Session information</li>
//      * <li>Navigation information</li>
//      * </ul>
//      * <p>Inside an App, each components can interact with the Flux instance using Flux.Mixin (generally via Root.Mixin or Component.Mixin).</p>
//      * @class R.Flux
//      */
//      var Flux = {
//         /**
//         * <p>Returns a Flux constructor</p>
//         * @method createFlux
//         * @param {object} specs The specifications of the flux
//         */
//         createFlux: function createFlux(specs) {
//           R.Debug.dev(function() {
//             assert(_.isObject(specs), 'R.createFlux(...): expecting an Object.');
//             assert(_.has(specs, 'bootstrapInClient') && _.isFunction(specs.bootstrapInClient), 'R.createFlux(...): requires bootstrapInClient(Window): Function');
//             assert(_.has(specs, 'bootstrapInServer') && _.isFunction(specs.bootstrapInServer), 'R.createFlux(...): requires bootstrapInServer(http.IncomingMessage): Function');
//           });
//           var FluxInstance = function() { R.Flux.FluxInstance.call(this); };
//           _.extend(FluxInstance.prototype, R.Flux.FluxInstance.prototype, specs);
//           return FluxInstance;
//         },
//         /**
//         * <p>Check if the flux provided by props is an object and a flux instance</p>
//         * @param {object} props The props to check
//         * @return {Boolean} valid The result boolean of the checked flux
//         */
//         PropType: function validateFlux(props, propName, componentName) {
//           var flux = props.flux;
//           var valid = null;
//           R.Debug.dev(function() {
//             try {
//               assert(_.isObject(flux) && flux._isFluxInstance_, 'R.Root.createClass(...): expecting a R.Flux.FluxInstance.');
//             }
//             catch(err) {
//               valid = err;
//             }
//           });
//           return valid;
//         },
//         FluxInstance: function FluxInstance() {
//           this._stores = {};
//           this._eventEmitters = {};
//           this._dispatchers = {};
//         },
//         Mixin: {
//           _FluxMixinSubscriptions: null,
//           _FluxMixinListeners: null,
//             /**
//             * <p>The getInitialState of React mechanics will be call at:</p>
//             *  - React.render() <br />
//             *  - React.renderToString() <br />
//             * <p>Never return a null object, by default: {}, otherwise return data stocked from the corresponding store</p>
//             * @method getInitialState
//             * @return {Object} object An object like: [stateKey, data]
//             */
//             getInitialState: function getInitialState() {
//               var subscriptions = this.getFluxStoreSubscriptions(this.props);
//               /* Return computed datas from Component's subscriptions */
//               if(this.getFlux().shouldInjectFromStores()) {
//                 return _.object(_.map(subscriptions, R.scope(function(stateKey, location) {
//                   var r = abstractLocationRegExp.exec(location);
//                   assert(r !== null, 'R.Flux.getInitialState(...): incorrect location ('' + this.displayName + '', '' + location + '', '' + stateKey + '')');
//                   var storeName = r[1];
//                   var storeKey = r[2];
//                   return [stateKey, this.getFluxStore(storeName).get(storeKey)];
//                 }, this)));
//               }
//               /* Return stateKey:null values for each subscriptions */
//               else {
//                 return _.object(_.map(subscriptions, function(stateKey) {
//                   return [stateKey, null];
//                 }));
//               }
//             },
//             /**
//             * <p>The componentWillMount of React mechanics</p>
//             * <p>Initialize flux functions for each components when componentWillMount is invoked by React</p>
//             * @method componentWillMount
//             */
//             componentWillMount: function componentWillMount() {
//               R.Debug.dev(R.scope(function() {
//                 assert(this.getFlux && _.isFunction(this.getFlux), 'R.Flux.Mixin.componentWillMount(...): requires getFlux(): R.Flux.FluxInstance.');
//                 assert(this._AsyncMixinHasAsyncMixin, 'R.Flux.Mixin.componentWillMount(...): requires R.Async.Mixin.');
//               }, this));
//               this._FluxMixinListeners = {};
//               this._FluxMixinSubscriptions = {};
//               this._FluxMixinResponses = {};
//               if(!this.getFluxStoreSubscriptions) {
//                 this.getFluxStoreSubscriptions = this._FluxMixinDefaultGetFluxStoreSubscriptions;
//               }
//               if(!this.getFluxEventEmittersListeners) {
//                 this.getFluxEventEmittersListeners = this._FluxMixinDefaultGetFluxEventEmittersListeners;
//               }
//               if(!this.fluxStoreWillUpdate) {
//                 this.fluxStoreWillUpdate = this._FluxMixinDefaultFluxStoreWillUpdate;
//               }
//               if(!this.fluxStoreDidUpdate) {
//                 this.fluxStoreDidUpdate = this._FluxMixinDefaultFluxStoreDidUpdate;
//               }
//               if(!this.fluxEventEmitterWillEmit) {
//                 this.fluxEventEmitterWillEmit = this._FluxMixinDefaultFluxEventEmitterWillEmit;
//               }
//               if(!this.fluxEventEmitterDidEmit) {
//                 this.fluxEventEmitterDidEmit = this._FluxMixinDefaultFluxEventEmitterDidEmit;
//               }
//             },

//             /**
//             * <p>Call the manager subscriptions when componendDidMount is invoked by React (only client-side)</p>
//             * @method componentDidMount
//             */
//             componentDidMount: function componentDidMount() {
//               this._FluxMixinUpdate(this.props);
//             },
//             componentWillReceiveProps: function componentWillReceiveProps(props) {
//               this._FluxMixinUpdate(props);
//             },
//             componentWillUnmount: function componentWillUnmount() {
//               this._FluxMixinClear();
//             },
//             getFluxStore: function getFluxStore(name) {
//               return this.getFlux().getStore(name);
//             },
//             /**
//             * <p>Fetch all components from a root component in order to initialize all data, fill the corresponding stores</p>
//             * <p>Executed server-side<p>
//             * @method prefetchFluxStores
//             * @return {void}
//             */
//             prefetchFluxStores: function* prefetchFluxStores() {
//                 //Get all subscriptions from current componant
//                 //eg.'storeName:/storeKey': 'storeKey',
//                 var subscriptions = this.getFluxStoreSubscriptions(this.props);
//                 var curCount = count;
//                 var state = {};

//                 //For each subscription, call the request to get data from the UplinkStore or MemoryStore
//                 //Saves the data in a variable 'state' which will then serve the current state of the component
//                 yield _.map(subscriptions, R.scope(function(stateKey, location) {
//                   return new Promise(R.scope(function(resolve, reject) {
//                     var r = abstractLocationRegExp.exec(location);
//                     if(r === null) {
//                       return reject(new Error('R.Flux.prefetchFluxStores(...): incorrect location ('' + this.displayName + '', '' + location + '', '' + stateKey + '')'));
//                     }
//                     else {
//                       var storeName = r[1];
//                       var storeKey = r[2];
//                       co(function*() {
//                                 //for Uplink, requested url is : /storeName/storeKey on the UplinkServer
//                                 //the response is stored in state[stateKey]
//                                 //for Memory, data comes from installed plugins like Window, History, etc.
//                                 //finally data is saved in this.getFluxStore(storeName) that will be used in getInitialState for currentComponent
//                                 state[stateKey] = yield this.getFluxStore(storeName).fetch(storeKey);
//                               }).call(this, function(err) {
//                                 if(err) {
//                                   return reject(R.Debug.extendError(err, 'Couldn't prefetch subscription ('' + stateKey + '', '' + location + '')'));
//                                 }
//                                 else {
//                                   return resolve();
//                                 }
//                               });
//                                 }
//                               }, this));
//                             }, this));
// this.getFlux().startInjectingFromStores();

//                 //Create the React instance of current component with computed state and props
//                 //If state or props are not computed, we will not be able to compute the next child
//                 var surrogateComponent = new this.__ReactOnRailsSurrogate(this.context, this.props, state);
//                 surrogateComponent.componentWillMount();
//                 this.getFlux().stopInjectingFromStores();

//                 //Render current component in order to get childs
//                 var renderedComponent = surrogateComponent.render();

//                 var childContext = (surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : this.context);

//                 surrogateComponent.componentWillUnmount();

//                 //Fetch children React component of current component in order to compute the next child
//                 yield React.Children.mapTree(renderedComponent, function(childComponent) {
//                   return new Promise(function(resolve, reject) {
//                     if(!_.isObject(childComponent)) {
//                       return resolve();
//                     }
//                     var childType = childComponent.type;
//                     if(!_.isObject(childType) || !childType.__ReactOnRailsSurrogate) {
//                       return resolve();
//                     }
//                         //Create the React instance of current child with props, but without computed state
//                         var surrogateChildComponent = new childType.__ReactOnRailsSurrogate(childContext, childComponent.props);
//                         if(!surrogateChildComponent.componentWillMount) {
//                           R.Debug.dev(function() {
//                             console.error('Component doesn't have componentWillMount. Maybe you forgot R.Component.Mixin? ('' + surrogateChildComponent.displayName + '')');
//                           });
//                           }
//                           surrogateChildComponent.componentWillMount();
//                           co(function*() {
//                             //Recursivly call *prefetchFluxStores* for this current child in order to compute his state
//                             yield surrogateChildComponent.prefetchFluxStores();
//                             surrogateChildComponent.componentWillUnmount();
//                           }).call(this, function(err) {
//                             if(err) {
//                               return reject(R.Debug.extendError(err, 'Couldn't prefetch child component'));
//                             }
//                             else {
//                               return resolve();
//                             }
//                           });
//                             });
//                             });
//                         },
//             /**
//             * <p>Returns the FluxEventEmitter according the provided name</p>
//             * @method getFluxEventEmitter
//             * @param {string} name The name
//             * @return {object} EventEmitter the EventEmitter
//             */
//             getFluxEventEmitter: function getFluxEventEmitter(name) {
//               return this.getFlux().getEventEmitter(name);
//             },
//             /**
//             * <p>Returns the FluxDispatcher according the provided name</p>
//             * @method getFluxDispatcher
//             * @param {string} name The name
//             * @return {object} Dispatcher the Dispatcher
//             */
//             getFluxDispatcher: function getFluxDispatcher(name) {
//               return this.getFlux().getDispatcher(name);
//             },
//             /**
//             * <p>Get the corresponding dispatcher and dispatch the action submitted by a React component<br />
//             * Trigged on event like 'click'</p>
//             * @param {string} location The url to go (eg. '//History/navigate')
//             * @param {object} param The specific data for the action
//             * @return {*} * the data that may be provided by the dispatcher
//             */
//             dispatch: function* dispatch(location, params) {
//               var r = abstractLocationRegExp.exec(location);
//               assert(r !== null, 'R.Flux.dispatch(...): incorrect location ('' + this.displayName + '')');
//               var entry = {
//                 dispatcherName: r[1],
//                 action: r[2],
//               };
//               return yield this.getFluxDispatcher(entry.dispatcherName).dispatch(entry.action, params);
//             },
//             _FluxMixinDefaultGetFluxStoreSubscriptions: function getFluxStoreSubscriptions(props) {
//               return {};
//             },
//             _FluxMixinDefaultGetFluxEventEmittersListeners: function getFluxEventEmittersListeners(props) {
//               return {};
//             },
//             _FluxMixinDefaultFluxStoreWillUpdate: function fluxStoreWillUpdate(storeName, storeKey, newVal, oldVal) {
//               return void 0;
//             },
//             _FluxMixinDefaultFluxStoreDidUpdate: function fluxStoreDidUpdate(storeName, storeKey, newVal, oldVal) {
//               return void 0;
//             },
//             _FluxMixinDefaultFluxEventEmitterWillEmit: function fluxEventEmitterWillEmit(eventEmitterName, eventName, params) {
//               return void 0;
//             },
//             _FluxMixinDefaultFluxEventEmitterDidEmit: function fluxEventEmitterDidEmit(eventEmitterName, eventName, params) {
//               return void 0;
//             },
//             _FluxMixinClear: function _FluxMixinClear() {
//               _.each(this._FluxMixinSubscriptions, this._FluxMixinUnsubscribe);
//               _.each(this._FluxMixinListeners, this.FluxMixinRemoveListener);
//             },
//             /**
//             * <p>Manage subscriptions, unsubscriptions and event emitters</p>
//             * @method _FluxMixinUpdate
//             * @param {Object} props The props of component
//             * @private
//             */
//             _FluxMixinUpdate: function _FluxMixinUpdate(props) {
//               var currentSubscriptions = _.object(_.map(this._FluxMixinSubscriptions, function(entry) {
//                 return [entry.location, entry.stateKey];
//               }));

//               var nextSubscriptions = this.getFluxStoreSubscriptions(props);
//               _.each(currentSubscriptions, R.scope(function(stateKey, location) {
//                 if(!nextSubscriptions[location] || nextSubscriptions[location] !== currentSubscriptions[location]) {
//                   this._FluxMixinUnsubscribe(stateKey, location);
//                 }
//               }, this));
//               _.each(nextSubscriptions, R.scope(function(stateKey, location) {
//                 if(!currentSubscriptions[location] || currentSubscriptions[location] !== stateKey) {
//                   this._FluxMixinSubscribe(stateKey, location);
//                 }
//               }, this));

//               var currentListeners = _.object(_.map(this._FluxMixinListeners, function(entry) {
//                 return [entry.location, entry.fn];
//               }));
//               var nextListeners = this.getFluxEventEmittersListeners(props);
//               _.each(currentListeners, R.scope(function(fn, location) {
//                 if(!nextListeners[location] || nextListeners[location] !== currentListeners[location]) {
//                   this._FluxMixinRemoveListener(fn, location);
//                 }
//               }, this));
//               _.each(nextListeners, R.scope(function(fn, location) {
//                 if(!currentListeners[location] || currentListeners[location] !== fn) {
//                   this._FluxMixinAddListener(fn, location);
//                 }
//               }, this));
//             },
//             /**
//             * @method _FluxMixinInject
//             * @param {string} stateKey The stateKey
//             * @param {string} location The location
//             * @private
//             */
//             _FluxMixinInject: function _FluxMixinInject(stateKey, location) {
//               var r = abstractLocationRegExp.exec(location);
//               assert(r !== null, 'R.Flux._FluxMixinInject(...): incorrect location ('' + this.displayName + '', '' + location + '', '' + stateKey + '')');
//               var entry = {
//                 storeName: r[1],
//                 storeKey: r[2],
//               };
//               R.Debug.dev(R.scope(function() {
//                 assert(this.getFlux().shouldInjectFromStores(), 'R.Flux.Mixin._FluxMixinInject(...): should not inject from Stores.');
//                 assert(_.isPlainObject(entry), 'R.Flux.Mixin._FluxMixinInject(...).entry: expecting Object.');
//                 assert(_.has(entry, 'storeName') && _.isString(entry.storeName), 'R.Flux.Mixin._FluxMixinInject(...).entry.storeName: expecting String.');
//                 assert(_.has(entry, 'storeKey') && _.isString(entry.storeKey), 'R.Flux.Mixin._FluxMixinInject(...).entry.storeKey: expecting String.');
//               }, this));
//               this.setState(R.record(stateKey, this.getFluxStore(entry.storeName).get(entry.storeKey)));
//             },
//             /**
//             * <p>Allow a React Component to subscribe at any data in order to fill state</p>
//             * @method _FluxMixinSubscribe
//             * @param {string} stateKey The key to be subscribed
//             * @param {string} location The url that will be requested
//             * @return {void}
//             * @private
//             */
//             _FluxMixinSubscribe: function _FluxMixinSubscribe(stateKey, location) {
//               var r = abstractLocationRegExp.exec(location);
//               assert(r !== null, 'R.Flux._FluxMixinSubscribe(...): incorrect location ('' + this.displayName + '', '' + location + '', '' + stateKey + '')');
//               var entry = {
//                 storeName: r[1],
//                 storeKey: r[2],
//               };
//               R.Debug.dev(R.scope(function() {
//                 assert(_.isPlainObject(entry), 'R.Flux.Mixin._FluxMixinSubscribe(...).entry: expecting Object.');
//                 assert(_.has(entry, 'storeName') && _.isString(entry.storeName), 'R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeName: expecting String.');
//                 assert(_.has(entry, 'storeKey') && _.isString(entry.storeKey), 'R.Flux.Mixin._FluxMixinSubscribe(...).entry.storeKey: expecting String.');
//               }, this));
//               var store = this.getFluxStore(entry.storeName);
//                 //Subscribe and request Store to get data
//                 //Call immediatly _FluxMixinStoreSignalUpdate with computed data in order to call setState
//                 var subscription = store.sub(entry.storeKey, this._FluxMixinStoreSignalUpdate(stateKey, location));

//                 //Save subscription
//                 this._FluxMixinSubscriptions[subscription.uniqueId] = {
//                   location: location,
//                   stateKey: stateKey,
//                   storeName: entry.storeName,
//                   subscription: subscription,
//                 };
//               },
//             /**
//             * <p>Rerendering a component when data update occurs</p>
//             * @method _FluxMixinStoreSignalUpdate
//             * @param {String} stateKey The key to be subscribed
//             * @param {String} location The url that will be requested
//             * @return {Function}
//             * @private
//             */
//             _FluxMixinStoreSignalUpdate: function _FluxMixinStoreSignalUpdate(stateKey, location) {
//               return R.scope(function(val) {
//                 if(!this.isMounted()) {
//                   return;
//                 }
//                 var previousVal = this.state ? this.state[stateKey] : undefined;
//                 if(_.isEqual(previousVal, val)) {
//                   return;
//                 }
//                 this.fluxStoreWillUpdate(stateKey, location, val, previousVal);
//                     //Call react API in order to Rerender component
//                     this.setState(R.record(stateKey, val));
//                     this.fluxStoreDidUpdate(stateKey, location, val, previousVal);
//                   }, this);
//             },
//             /**
//             * @method _FluxMixinAddListener
//             * @param {Fonction} fn The fn
//             * @param {string} location The location
//             * @private
//             */
//             _FluxMixinAddListener: function _FluxMixinAddListener(fn, location) {
//               var r = abstractLocationRegExp.exec(location);
//               assert(r !== null, 'R.Flux._FluxMixinAddListener(...): incorrect location ('' + this.displayName + '', '' + location + '')');
//               var entry = {
//                 eventEmitterName: r[1],
//                 eventName: r[2],
//               };
//               R.Debug.dev(R.scope(function() {
//                 assert(_.isPlainObject(entry), 'R.Flux.Mixin._FluxMixinAddListener(...).entry: expecting Object.');
//                 assert(_.has(entry, 'eventEmitterName') && _.isString(entry.eventEmitterName), 'R.Flux.Mixin._FluxMixinAddListener(...).entry.eventEmitterName: expecting String.');
//                 assert(_.has(entry, 'eventName') && _.isString(entry.eventName), 'R.Flux.Mixin._FluxMixinAddListener(...).entry.eventName: expecting String.');
//                 assert(_.has(entry, 'fn') && _.isFunction(fn), 'R.Flux.Mixin._FluxMixinAddListener(...).entry.fn: expecting Function.');
//               }, this));
//               var eventEmitter = this.getFluxEventEmitter(entry.eventEmitterName);
//               var listener = eventEmitter.addListener(entry.eventName, this._FluxMixinEventEmitterEmit(entry.eventEmitterName, entry.eventName, entry.fn));
//               this._FluxMixinListeners[listener.uniqueId] = {
//                 location: location,
//                 fn: fn,
//                 eventEmitterName: entry.eventEmitterName,
//                 listener: listener,
//               };
//             },
//             /**
//             * @method _FluxMixinEventEmitterEmit
//             * @param {string} eventEmitterName The eventEmitterName
//             * @param {string} eventName The eventName
//             * @param {Fonction} fn The fn
//             * @private
//             */
//             _FluxMixinEventEmitterEmit: function _FluxMixinEventEmitterEmit(eventEmitterName, eventName, fn) {
//               return R.scope(function(params) {
//                 if(!this.isMounted()) {
//                   return;
//                 }
//                 this.fluxEventEmitterWillEmit(eventEmitterName, eventName, params);
//                 fn(params);
//                 this.fluxEventEmitterDidEmit(eventEmitterName, eventName, params);
//               }, this);
//             },
//             /**
//             * @method _FluxMixinUnsubscribe
//             * @param {object} entry The entry
//             * @param {string} uniqueId The uniqueId
//             * @private
//             */
//             _FluxMixinUnsubscribe: function _FluxMixinUnsubscribe(entry, uniqueId) {
//               R.Debug.dev(R.scope(function() {
//                 assert(_.has(this._FluxMixinSubscriptions, uniqueId), 'R.Flux.Mixin._FluxMixinUnsubscribe(...): no such subscription.');
//               }, this));
//               var subscription = entry.subscription;
//               var storeName = entry.storeName;
//               this.getFluxStore(storeName).unsub(subscription);
//               delete this._FluxMixinSubscriptions[uniqueId];
//             },
//             /**
//             * @method _FluxMixinRemoveListener
//             * @param {object} entry The entry
//             * @param {string} uniqueId The uniqueId
//             * @private
//             */
//             _FluxMixinRemoveListener: function _FluxMixinRemoveListener(entry, uniqueId) {
//               R.Debug.dev(R.scope(function() {
//                 assert(_.has(this._FluxMixinListeners, uniqueId), 'R.Flux.Mixin._FluxMixinRemoveListener(...): no such listener.');
//               }, this));
//               var listener = entry.listener;
//               var eventEmitterName = entry.eventEmitterName;
//               this.getFluxEventEmitter(eventEmitterName).removeListener(listener);
//               delete this._FluxMixinListeners[uniqueId];
//             },
//           },
//         };

//         _.extend(Flux.FluxInstance.prototype, /** @lends R.Flux.FluxInstance.prototype */{
//           _isFluxInstance_: true,
//           _stores: null,
//           _eventEmitters: null,
//           _dispatchers: null,
//           _shouldInjectFromStores: false,
//           bootstrapInClient: _.noop,
//           bootstrapInServer: _.noop,
//           destroyInClient: _.noop,
//           destroyInServer: _.noop,
//           shouldInjectFromStores: function shouldInjectFromStores() {
//             return this._shouldInjectFromStores;
//           },
//         /**
//         * <p>Sets the flag telling all the flux-mixed-in components to attempt to inject pre-fetched values from the cache. Used for pre-rendering magic.</p>
//         * @method startInjectingFromStores
//         */
//         startInjectingFromStores: function startInjectingFromStores() {
//           R.Debug.dev(R.scope(function() {
//             assert(!this._shouldInjectFromStores, 'R.Flux.FluxInstance.startInjectingFromStores(...): should not be injecting from Stores.');
//           }, this));
//           this._shouldInjectFromStores = true;
//         },
//         /**
//         * <p>Unsets the flag telling all the flux-mixed-in components to attempt to inject pre-fetched values from the cache. Used for pre-rendering magic.</p>
//         * @method startInjectingFromStores
//         */
//         stopInjectingFromStores: function stopInjectingFromStores() {
//           R.Debug.dev(R.scope(function() {
//             assert(this._shouldInjectFromStores, 'R.Flux.FluxInstance.stopInjectingFromStores(...): should be injecting from Stores.');
//           }, this));
//           this._shouldInjectFromStores = false;
//         },
//         /**
//         * <p>Serialize a serialized flux by the server in order to initialize flux into client</p>
//         * @method serialize
//         * @return {string} string The serialized string
//         */
//         serialize: function serialize() {
//           return R.Base64.encode(JSON.stringify(_.mapValues(this._stores, function(store) {
//             return store.serialize();
//           })));
//         },
//         /**
//         * Unserialize a serialized flux by the server in order to initialize flux into client
//         * @method unserialize
//         * @param {string} str The string to unserialize
//         */
//         unserialize: function unserialize(str) {
//           _.each(JSON.parse(R.Base64.decode(str)), R.scope(function(serializedStore, name) {
//             R.Debug.dev(R.scope(function() {
//               assert(_.has(this._stores, name), 'R.Flux.FluxInstance.unserialize(...): no such Store. (' + name + ')');
//             }, this));
//             this._stores[name].unserialize(serializedStore);
//           }, this));
//         },
//         /**
//         * <p>Getter for the store</p>
//         * @method getStore
//         * @param {string} name The name of the store
//         * @return {object} store The corresponding store
//         */
//         getStore: function getStore(name) {
//           R.Debug.dev(R.scope(function() {
//             assert(_.has(this._stores, name), 'R.Flux.FluxInstance.getStore(...): no such Store. (' + name + ')');
//           }, this));
//           return this._stores[name];
//         },
//         /**
//         * <p>Register a store defined in the flux class of App <br />
//         * Typically : Memory or Uplink</p>
//         * @method registerStore
//         * @param {string} name The name to register
//         * @param {object} store The store to register
//         */
//         registerStore: function registerStore(name, store) {
//           R.Debug.dev(R.scope(function() {
//             assert(store._isStoreInstance_, 'R.Flux.FluxInstance.registerStore(...): expecting a R.Store.StoreInstance. (' + name + ')');
//             assert(!_.has(this._stores, name), 'R.Flux.FluxInstance.registerStore(...): name already assigned. (' + name + ')');
//           }, this));
//           this._stores[name] = store;
//         },
//         /**
//         * <p>Getter for the event emitter</p>
//         * @method getEventEmitter
//         * @param {string} name The name of the store
//         * @return {object} eventEmitter The corresponding event emitter
//         */
//         getEventEmitter: function getEventEmitter(name) {
//           R.Debug.dev(R.scope(function() {
//             assert(_.has(this._eventEmitters, name), 'R.Flux.FluxInstance.getEventEmitter(...): no such EventEmitter. (' + name + ')');
//           }, this));
//           return this._eventEmitters[name];
//         },

//         /**
//         * <p>Register an event emitter defined in the flux class of App</p>
//         * @method registerEventEmitter
//         * @param {string} name The name to register
//         * @param {object} eventEmitter The event emitter to register
//         */
//         registerEventEmitter: function registerEventEmitter(name, eventEmitter) {
//           assert(R.isClient(), 'R.Flux.FluxInstance.registerEventEmitter(...): should not be called in the server.');
//           R.Debug.dev(R.scope(function() {
//             assert(eventEmitter._isEventEmitterInstance_, 'R.Flux.FluxInstance.registerEventEmitter(...): expecting a R.EventEmitter.EventEmitterInstance. (' + name + ')');
//             assert(!_.has(this._eventEmitters, name), 'R.Flux.FluxInstance.registerEventEmitter(...): name already assigned. (' + name + ')');
//           }, this));
//           this._eventEmitters[name] = eventEmitter;
//         },

//         /**
//         * <p>Getter for the dispatcher</p>
//         * @method getDispatcher
//         * @param {string} name The name of the store
//         * @return {object} dispatcher The corresponding dispatcher
//         */
//         getDispatcher: function getDispatcher(name) {
//           R.Debug.dev(R.scope(function() {
//             assert(_.has(this._dispatchers, name), 'R.Flux.FluxInstance.getDispatcher(...): no such Dispatcher. (' + name + ')');
//           }, this));
//           return this._dispatchers[name];
//         },
//         /**
//         * <p>Register a dispatcher defined in the flux class of App</p>
//         * @method registerDispatcher
//         * @param {string} name The name to register
//         * @param {object} dispatcher The dispatcher to register
//         */
//         registerDispatcher: function registerDispatcher(name, dispatcher) {
//           assert(R.isClient(), 'R.Flux.FluxInstance.registerDispatcher(...): should not be called in the server. (' + name + ')');
//           R.Debug.dev(R.scope(function() {
//             assert(dispatcher._isDispatcherInstance_, 'R.Flux.FluxInstance.registerDispatcher(...): expecting a R.Dispatcher.DispatcherInstance (' + name + ')');
//             assert(!_.has(this._dispatchers, name), 'R.Flux.FluxInstance.registerDispatcher(...): name already assigned. (' + name + ')');
//           }, this));
//           this._dispatchers[name] = dispatcher;
//         },

//         /**
//         * <p>Clears the store by calling either this.destroyInServer or this.destroyInClient and recursively applying destroy on each store/event emittre/dispatcher.<br />
//         * Used for pre-rendering magic.</p>
//         * @method destroy
//         */
//         destroy: function destroy() {
//           if(R.isClient()) {
//             this.destroyInClient();
//           }
//           if(R.isServer()) {
//             this.destroyInServer();
//           }
//           _.each(this._stores, function(store) {
//             store.destroy();
//           });
//           this._stores = null;
//           _.each(this._eventEmitters, function(eventEmitter) {
//             eventEmitter.destroy();
//           });
//           this._eventEmitters = null;
//           _.each(this._dispatchers, function(dispatcher) {
//             dispatcher.destroy();
//           });
//           this._dispatchers = null;
//         },
//       });

// return Flux;
// };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDIiwiZmlsZSI6IlIuRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuLy8gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4vLyAgIGNvbnN0IF8gPSBSLl87XG4vLyAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuLy8gICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbi8vICAgY29uc3QgYWJzdHJhY3RMb2NhdGlvblJlZ0V4cCA9IC9eKC4qKTpcXC8oLiopJC87XG5cbi8vICAgY2xhc3MgRmx1eCB7XG4vLyAgICAgY29uc3RydWN0b3IoKSB7XG5cbi8vICAgICB9XG5cbi8vICAgICBib290c3RyYXAoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3csIHJlcSB9KSB7IF8uYWJzdHJhY3QoKTsgfVxuLy8gICB9XG5cblxuLy8gICAgIC8qKlxuLy8gICAgICAqIEBtZW1iZXJPZiBSXG4vLyAgICAgICogPHA+Ui5GbHV4IHJlcHJlc2VudHMgdGhlIGRhdGEgZmxvd2luZyBmcm9tIHRoZSBiYWNrZW5kcyAoZWl0aGVyIGxvY2FsIG9yIHJlbW90ZSkuXG4vLyAgICAgICogVG8gZW5hYmxlIGlzb21vcHJoaWMgcmVuZGVyaW5nLCBpdCBzaG91bGQgYmUgY29tcHV0YWJsZSBlaXRoZXIgb3IgaW4gdGhlIHNlcnZlciBvciBpbiB0aGUgY2xpZW50LlxuLy8gICAgICAqIEl0IHJlcHJlc2VudHMgdGhlIGdsb2JhbCBzdGF0ZSwgaW5jbHVkaW5nIGJ1dCBub3QgbGltaXRlZCB0bzo8L3A+XG4vLyAgICAgICogPHVsPlxuLy8gICAgICAqIDxsaT5Sb3V0aW5nIGluZm9ybWF0aW9uPC9saT5cbi8vICAgICAgKiA8bGk+U2Vzc2lvbiBpbmZvcm1hdGlvbjwvbGk+XG4vLyAgICAgICogPGxpPk5hdmlnYXRpb24gaW5mb3JtYXRpb248L2xpPlxuLy8gICAgICAqIDwvdWw+XG4vLyAgICAgICogPHA+SW5zaWRlIGFuIEFwcCwgZWFjaCBjb21wb25lbnRzIGNhbiBpbnRlcmFjdCB3aXRoIHRoZSBGbHV4IGluc3RhbmNlIHVzaW5nIEZsdXguTWl4aW4gKGdlbmVyYWxseSB2aWEgUm9vdC5NaXhpbiBvciBDb21wb25lbnQuTWl4aW4pLjwvcD5cbi8vICAgICAgKiBAY2xhc3MgUi5GbHV4XG4vLyAgICAgICovXG4vLyAgICAgIHZhciBGbHV4ID0ge1xuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5SZXR1cm5zIGEgRmx1eCBjb25zdHJ1Y3RvcjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUZsdXhcbi8vICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3BlY3MgVGhlIHNwZWNpZmljYXRpb25zIG9mIHRoZSBmbHV4XG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIGNyZWF0ZUZsdXg6IGZ1bmN0aW9uIGNyZWF0ZUZsdXgoc3BlY3MpIHtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChfLmlzT2JqZWN0KHNwZWNzKSwgJ1IuY3JlYXRlRmx1eCguLi4pOiBleHBlY3RpbmcgYW4gT2JqZWN0LicpO1xuLy8gICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHNwZWNzLCAnYm9vdHN0cmFwSW5DbGllbnQnKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MuYm9vdHN0cmFwSW5DbGllbnQpLCAnUi5jcmVhdGVGbHV4KC4uLik6IHJlcXVpcmVzIGJvb3RzdHJhcEluQ2xpZW50KFdpbmRvdyk6IEZ1bmN0aW9uJyk7XG4vLyAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoc3BlY3MsICdib290c3RyYXBJblNlcnZlcicpICYmIF8uaXNGdW5jdGlvbihzcGVjcy5ib290c3RyYXBJblNlcnZlciksICdSLmNyZWF0ZUZsdXgoLi4uKTogcmVxdWlyZXMgYm9vdHN0cmFwSW5TZXJ2ZXIoaHR0cC5JbmNvbWluZ01lc3NhZ2UpOiBGdW5jdGlvbicpO1xuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgIHZhciBGbHV4SW5zdGFuY2UgPSBmdW5jdGlvbigpIHsgUi5GbHV4LkZsdXhJbnN0YW5jZS5jYWxsKHRoaXMpOyB9O1xuLy8gICAgICAgICAgIF8uZXh0ZW5kKEZsdXhJbnN0YW5jZS5wcm90b3R5cGUsIFIuRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlLCBzcGVjcyk7XG4vLyAgICAgICAgICAgcmV0dXJuIEZsdXhJbnN0YW5jZTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+Q2hlY2sgaWYgdGhlIGZsdXggcHJvdmlkZWQgYnkgcHJvcHMgaXMgYW4gb2JqZWN0IGFuZCBhIGZsdXggaW5zdGFuY2U8L3A+XG4vLyAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzIFRoZSBwcm9wcyB0byBjaGVja1xuLy8gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHZhbGlkIFRoZSByZXN1bHQgYm9vbGVhbiBvZiB0aGUgY2hlY2tlZCBmbHV4XG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIFByb3BUeXBlOiBmdW5jdGlvbiB2YWxpZGF0ZUZsdXgocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4vLyAgICAgICAgICAgdmFyIGZsdXggPSBwcm9wcy5mbHV4O1xuLy8gICAgICAgICAgIHZhciB2YWxpZCA9IG51bGw7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgICBhc3NlcnQoXy5pc09iamVjdChmbHV4KSAmJiBmbHV4Ll9pc0ZsdXhJbnN0YW5jZV8sICdSLlJvb3QuY3JlYXRlQ2xhc3MoLi4uKTogZXhwZWN0aW5nIGEgUi5GbHV4LkZsdXhJbnN0YW5jZS4nKTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIGNhdGNoKGVycikge1xuLy8gICAgICAgICAgICAgICB2YWxpZCA9IGVycjtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIEZsdXhJbnN0YW5jZTogZnVuY3Rpb24gRmx1eEluc3RhbmNlKCkge1xuLy8gICAgICAgICAgIHRoaXMuX3N0b3JlcyA9IHt9O1xuLy8gICAgICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSB7fTtcbi8vICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IHt9O1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBNaXhpbjoge1xuLy8gICAgICAgICAgIF9GbHV4TWl4aW5TdWJzY3JpcHRpb25zOiBudWxsLFxuLy8gICAgICAgICAgIF9GbHV4TWl4aW5MaXN0ZW5lcnM6IG51bGwsXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+VGhlIGdldEluaXRpYWxTdGF0ZSBvZiBSZWFjdCBtZWNoYW5pY3Mgd2lsbCBiZSBjYWxsIGF0OjwvcD5cbi8vICAgICAgICAgICAgICogIC0gUmVhY3QucmVuZGVyKCkgPGJyIC8+XG4vLyAgICAgICAgICAgICAqICAtIFJlYWN0LnJlbmRlclRvU3RyaW5nKCkgPGJyIC8+XG4vLyAgICAgICAgICAgICAqIDxwPk5ldmVyIHJldHVybiBhIG51bGwgb2JqZWN0LCBieSBkZWZhdWx0OiB7fSwgb3RoZXJ3aXNlIHJldHVybiBkYXRhIHN0b2NrZWQgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBzdG9yZTwvcD5cbi8vICAgICAgICAgICAgICogQG1ldGhvZCBnZXRJbml0aWFsU3RhdGVcbi8vICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBvYmplY3QgQW4gb2JqZWN0IGxpa2U6IFtzdGF0ZUtleSwgZGF0YV1cbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4vLyAgICAgICAgICAgICAgIC8qIFJldHVybiBjb21wdXRlZCBkYXRhcyBmcm9tIENvbXBvbmVudCdzIHN1YnNjcmlwdGlvbnMgKi9cbi8vICAgICAgICAgICAgICAgaWYodGhpcy5nZXRGbHV4KCkuc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpKSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIF8ub2JqZWN0KF8ubWFwKHN1YnNjcmlwdGlvbnMsIFIuc2NvcGUoZnVuY3Rpb24oc3RhdGVLZXksIGxvY2F0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgJ1IuRmx1eC5nZXRJbml0aWFsU3RhdGUoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnJyArIHRoaXMuZGlzcGxheU5hbWUgKyAnJywgJycgKyBsb2NhdGlvbiArICcnLCAnJyArIHN0YXRlS2V5ICsgJycpJyk7XG4vLyAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVOYW1lID0gclsxXTtcbi8vICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZUtleSA9IHJbMl07XG4vLyAgICAgICAgICAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCB0aGlzLmdldEZsdXhTdG9yZShzdG9yZU5hbWUpLmdldChzdG9yZUtleSldO1xuLy8gICAgICAgICAgICAgICAgIH0sIHRoaXMpKSk7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgLyogUmV0dXJuIHN0YXRlS2V5Om51bGwgdmFsdWVzIGZvciBlYWNoIHN1YnNjcmlwdGlvbnMgKi9cbi8vICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIF8ub2JqZWN0KF8ubWFwKHN1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKHN0YXRlS2V5KSB7XG4vLyAgICAgICAgICAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCBudWxsXTtcbi8vICAgICAgICAgICAgICAgICB9KSk7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+VGhlIGNvbXBvbmVudFdpbGxNb3VudCBvZiBSZWFjdCBtZWNoYW5pY3M8L3A+XG4vLyAgICAgICAgICAgICAqIDxwPkluaXRpYWxpemUgZmx1eCBmdW5jdGlvbnMgZm9yIGVhY2ggY29tcG9uZW50cyB3aGVuIGNvbXBvbmVudFdpbGxNb3VudCBpcyBpbnZva2VkIGJ5IFJlYWN0PC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIGNvbXBvbmVudFdpbGxNb3VudFxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydCh0aGlzLmdldEZsdXggJiYgXy5pc0Z1bmN0aW9uKHRoaXMuZ2V0Rmx1eCksICdSLkZsdXguTWl4aW4uY29tcG9uZW50V2lsbE1vdW50KC4uLik6IHJlcXVpcmVzIGdldEZsdXgoKTogUi5GbHV4LkZsdXhJbnN0YW5jZS4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQodGhpcy5fQXN5bmNNaXhpbkhhc0FzeW5jTWl4aW4sICdSLkZsdXguTWl4aW4uY29tcG9uZW50V2lsbE1vdW50KC4uLik6IHJlcXVpcmVzIFIuQXN5bmMuTWl4aW4uJyk7XG4vLyAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzID0ge307XG4vLyAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMgPSB7fTtcbi8vICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluUmVzcG9uc2VzID0ge307XG4vLyAgICAgICAgICAgICAgIGlmKCF0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0R2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucztcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICBpZighdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycykge1xuLy8gICAgICAgICAgICAgICAgIHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0R2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnM7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgaWYoIXRoaXMuZmx1eFN0b3JlV2lsbFVwZGF0ZSkge1xuLy8gICAgICAgICAgICAgICAgIHRoaXMuZmx1eFN0b3JlV2lsbFVwZGF0ZSA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4U3RvcmVXaWxsVXBkYXRlO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZSkge1xuLy8gICAgICAgICAgICAgICAgIHRoaXMuZmx1eFN0b3JlRGlkVXBkYXRlID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEZsdXhTdG9yZURpZFVwZGF0ZTtcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICBpZighdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdCA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQ7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgaWYoIXRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0ID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0O1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9LFxuXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+Q2FsbCB0aGUgbWFuYWdlciBzdWJzY3JpcHRpb25zIHdoZW4gY29tcG9uZW5kRGlkTW91bnQgaXMgaW52b2tlZCBieSBSZWFjdCAob25seSBjbGllbnQtc2lkZSk8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgY29tcG9uZW50RGlkTW91bnRcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4vLyAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblVwZGF0ZSh0aGlzLnByb3BzKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4vLyAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblVwZGF0ZShwcm9wcyk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuLy8gICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5DbGVhcigpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIGdldEZsdXhTdG9yZTogZnVuY3Rpb24gZ2V0Rmx1eFN0b3JlKG5hbWUpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rmx1eCgpLmdldFN0b3JlKG5hbWUpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiA8cD5GZXRjaCBhbGwgY29tcG9uZW50cyBmcm9tIGEgcm9vdCBjb21wb25lbnQgaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSBhbGwgZGF0YSwgZmlsbCB0aGUgY29ycmVzcG9uZGluZyBzdG9yZXM8L3A+XG4vLyAgICAgICAgICAgICAqIDxwPkV4ZWN1dGVkIHNlcnZlci1zaWRlPHA+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgcHJlZmV0Y2hGbHV4U3RvcmVzXG4vLyAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgcHJlZmV0Y2hGbHV4U3RvcmVzOiBmdW5jdGlvbiogcHJlZmV0Y2hGbHV4U3RvcmVzKCkge1xuLy8gICAgICAgICAgICAgICAgIC8vR2V0IGFsbCBzdWJzY3JpcHRpb25zIGZyb20gY3VycmVudCBjb21wb25hbnRcbi8vICAgICAgICAgICAgICAgICAvL2VnLidzdG9yZU5hbWU6L3N0b3JlS2V5JzogJ3N0b3JlS2V5Jyxcbi8vICAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbi8vICAgICAgICAgICAgICAgICB2YXIgY3VyQ291bnQgPSBjb3VudDtcbi8vICAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSB7fTtcblxuLy8gICAgICAgICAgICAgICAgIC8vRm9yIGVhY2ggc3Vic2NyaXB0aW9uLCBjYWxsIHRoZSByZXF1ZXN0IHRvIGdldCBkYXRhIGZyb20gdGhlIFVwbGlua1N0b3JlIG9yIE1lbW9yeVN0b3JlXG4vLyAgICAgICAgICAgICAgICAgLy9TYXZlcyB0aGUgZGF0YSBpbiBhIHZhcmlhYmxlICdzdGF0ZScgd2hpY2ggd2lsbCB0aGVuIHNlcnZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjb21wb25lbnRcbi8vICAgICAgICAgICAgICAgICB5aWVsZCBfLm1hcChzdWJzY3JpcHRpb25zLCBSLnNjb3BlKGZ1bmN0aW9uKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKFIuc2NvcGUoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciByID0gYWJzdHJhY3RMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbi8vICAgICAgICAgICAgICAgICAgICAgaWYociA9PT0gbnVsbCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycsICcnICsgbG9jYXRpb24gKyAnJywgJycgKyBzdGF0ZUtleSArICcnKScpKTtcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVOYW1lID0gclsxXTtcbi8vICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVLZXkgPSByWzJdO1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgVXBsaW5rLCByZXF1ZXN0ZWQgdXJsIGlzIDogL3N0b3JlTmFtZS9zdG9yZUtleSBvbiB0aGUgVXBsaW5rU2VydmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlIHJlc3BvbnNlIGlzIHN0b3JlZCBpbiBzdGF0ZVtzdGF0ZUtleV1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mb3IgTWVtb3J5LCBkYXRhIGNvbWVzIGZyb20gaW5zdGFsbGVkIHBsdWdpbnMgbGlrZSBXaW5kb3csIEhpc3RvcnksIGV0Yy5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9maW5hbGx5IGRhdGEgaXMgc2F2ZWQgaW4gdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKSB0aGF0IHdpbGwgYmUgdXNlZCBpbiBnZXRJbml0aWFsU3RhdGUgZm9yIGN1cnJlbnRDb21wb25lbnRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbc3RhdGVLZXldID0geWllbGQgdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKS5mZXRjaChzdG9yZUtleSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVycikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlcnIpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KFIuRGVidWcuZXh0ZW5kRXJyb3IoZXJyLCAnQ291bGRuJ3QgcHJlZmV0Y2ggc3Vic2NyaXB0aW9uICgnJyArIHN0YXRlS2V5ICsgJycsICcnICsgbG9jYXRpb24gKyAnJyknKSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyB0aGlzLmdldEZsdXgoKS5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuLy8gICAgICAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiBjdXJyZW50IGNvbXBvbmVudCB3aXRoIGNvbXB1dGVkIHN0YXRlIGFuZCBwcm9wc1xuLy8gICAgICAgICAgICAgICAgIC8vSWYgc3RhdGUgb3IgcHJvcHMgYXJlIG5vdCBjb21wdXRlZCwgd2Ugd2lsbCBub3QgYmUgYWJsZSB0byBjb21wdXRlIHRoZSBuZXh0IGNoaWxkXG4vLyAgICAgICAgICAgICAgICAgdmFyIHN1cnJvZ2F0ZUNvbXBvbmVudCA9IG5ldyB0aGlzLl9fUmVhY3RPblJhaWxzU3Vycm9nYXRlKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgc3RhdGUpO1xuLy8gICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXgoKS5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuXG4vLyAgICAgICAgICAgICAgICAgLy9SZW5kZXIgY3VycmVudCBjb21wb25lbnQgaW4gb3JkZXIgdG8gZ2V0IGNoaWxkc1xuLy8gICAgICAgICAgICAgICAgIHZhciByZW5kZXJlZENvbXBvbmVudCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5yZW5kZXIoKTtcblxuLy8gICAgICAgICAgICAgICAgIHZhciBjaGlsZENvbnRleHQgPSAoc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCA/IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSA6IHRoaXMuY29udGV4dCk7XG5cbi8vICAgICAgICAgICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuLy8gICAgICAgICAgICAgICAgIC8vRmV0Y2ggY2hpbGRyZW4gUmVhY3QgY29tcG9uZW50IG9mIGN1cnJlbnQgY29tcG9uZW50IGluIG9yZGVyIHRvIGNvbXB1dGUgdGhlIG5leHQgY2hpbGRcbi8vICAgICAgICAgICAgICAgICB5aWVsZCBSZWFjdC5DaGlsZHJlbi5tYXBUcmVlKHJlbmRlcmVkQ29tcG9uZW50LCBmdW5jdGlvbihjaGlsZENvbXBvbmVudCkge1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuLy8gICAgICAgICAgICAgICAgICAgICBpZighXy5pc09iamVjdChjaGlsZENvbXBvbmVudCkpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFR5cGUgPSBjaGlsZENvbXBvbmVudC50eXBlO1xuLy8gICAgICAgICAgICAgICAgICAgICBpZighXy5pc09iamVjdChjaGlsZFR5cGUpIHx8ICFjaGlsZFR5cGUuX19SZWFjdE9uUmFpbHNTdXJyb2dhdGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2YgY3VycmVudCBjaGlsZCB3aXRoIHByb3BzLCBidXQgd2l0aG91dCBjb21wdXRlZCBzdGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50ID0gbmV3IGNoaWxkVHlwZS5fX1JlYWN0T25SYWlsc1N1cnJvZ2F0ZShjaGlsZENvbnRleHQsIGNoaWxkQ29tcG9uZW50LnByb3BzKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tcG9uZW50IGRvZXNuJ3QgaGF2ZSBjb21wb25lbnRXaWxsTW91bnQuIE1heWJlIHlvdSBmb3Jnb3QgUi5Db21wb25lbnQuTWl4aW4/ICgnJyArIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmRpc3BsYXlOYW1lICsgJycpJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9SZWN1cnNpdmx5IGNhbGwgKnByZWZldGNoRmx1eFN0b3JlcyogZm9yIHRoaXMgY3VycmVudCBjaGlsZCBpbiBvcmRlciB0byBjb21wdXRlIGhpcyBzdGF0ZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgZnVuY3Rpb24oZXJyKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KFIuRGVidWcuZXh0ZW5kRXJyb3IoZXJyLCAnQ291bGRuJ3QgcHJlZmV0Y2ggY2hpbGQgY29tcG9uZW50JykpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+UmV0dXJucyB0aGUgRmx1eEV2ZW50RW1pdHRlciBhY2NvcmRpbmcgdGhlIHByb3ZpZGVkIG5hbWU8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0Rmx1eEV2ZW50RW1pdHRlclxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZVxuLy8gICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IEV2ZW50RW1pdHRlciB0aGUgRXZlbnRFbWl0dGVyXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgZ2V0Rmx1eEV2ZW50RW1pdHRlcjogZnVuY3Rpb24gZ2V0Rmx1eEV2ZW50RW1pdHRlcihuYW1lKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZsdXgoKS5nZXRFdmVudEVtaXR0ZXIobmFtZSk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPlJldHVybnMgdGhlIEZsdXhEaXNwYXRjaGVyIGFjY29yZGluZyB0aGUgcHJvdmlkZWQgbmFtZTwvcD5cbi8vICAgICAgICAgICAgICogQG1ldGhvZCBnZXRGbHV4RGlzcGF0Y2hlclxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZVxuLy8gICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IERpc3BhdGNoZXIgdGhlIERpc3BhdGNoZXJcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBnZXRGbHV4RGlzcGF0Y2hlcjogZnVuY3Rpb24gZ2V0Rmx1eERpc3BhdGNoZXIobmFtZSkge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGbHV4KCkuZ2V0RGlzcGF0Y2hlcihuYW1lKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+R2V0IHRoZSBjb3JyZXNwb25kaW5nIGRpc3BhdGNoZXIgYW5kIGRpc3BhdGNoIHRoZSBhY3Rpb24gc3VibWl0dGVkIGJ5IGEgUmVhY3QgY29tcG9uZW50PGJyIC8+XG4vLyAgICAgICAgICAgICAqIFRyaWdnZWQgb24gZXZlbnQgbGlrZSAnY2xpY2snPC9wPlxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gVGhlIHVybCB0byBnbyAoZWcuICcvL0hpc3RvcnkvbmF2aWdhdGUnKVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW0gVGhlIHNwZWNpZmljIGRhdGEgZm9yIHRoZSBhY3Rpb25cbi8vICAgICAgICAgICAgICogQHJldHVybiB7Kn0gKiB0aGUgZGF0YSB0aGF0IG1heSBiZSBwcm92aWRlZCBieSB0aGUgZGlzcGF0Y2hlclxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiogZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuLy8gICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgIGFzc2VydChyICE9PSBudWxsLCAnUi5GbHV4LmRpc3BhdGNoKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycpJyk7XG4vLyAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHtcbi8vICAgICAgICAgICAgICAgICBkaXNwYXRjaGVyTmFtZTogclsxXSxcbi8vICAgICAgICAgICAgICAgICBhY3Rpb246IHJbMl0sXG4vLyAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLmdldEZsdXhEaXNwYXRjaGVyKGVudHJ5LmRpc3BhdGNoZXJOYW1lKS5kaXNwYXRjaChlbnRyeS5hY3Rpb24sIHBhcmFtcyk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkRlZmF1bHRHZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zOiBmdW5jdGlvbiBnZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiB7fTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluRGVmYXVsdEdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzOiBmdW5jdGlvbiBnZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcykge1xuLy8gICAgICAgICAgICAgICByZXR1cm4ge307XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkRlZmF1bHRGbHV4U3RvcmVXaWxsVXBkYXRlOiBmdW5jdGlvbiBmbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgc3RvcmVLZXksIG5ld1ZhbCwgb2xkVmFsKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkRlZmF1bHRGbHV4U3RvcmVEaWRVcGRhdGU6IGZ1bmN0aW9uIGZsdXhTdG9yZURpZFVwZGF0ZShzdG9yZU5hbWUsIHN0b3JlS2V5LCBuZXdWYWwsIG9sZFZhbCkge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0OiBmdW5jdGlvbiBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluRGVmYXVsdEZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0OiBmdW5jdGlvbiBmbHV4RXZlbnRFbWl0dGVyRGlkRW1pdChldmVudEVtaXR0ZXJOYW1lLCBldmVudE5hbWUsIHBhcmFtcykge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5DbGVhcjogZnVuY3Rpb24gX0ZsdXhNaXhpbkNsZWFyKCkge1xuLy8gICAgICAgICAgICAgICBfLmVhY2godGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucywgdGhpcy5fRmx1eE1peGluVW5zdWJzY3JpYmUpO1xuLy8gICAgICAgICAgICAgICBfLmVhY2godGhpcy5fRmx1eE1peGluTGlzdGVuZXJzLCB0aGlzLkZsdXhNaXhpblJlbW92ZUxpc3RlbmVyKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+TWFuYWdlIHN1YnNjcmlwdGlvbnMsIHVuc3Vic2NyaXB0aW9ucyBhbmQgZXZlbnQgZW1pdHRlcnM8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblVwZGF0ZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgVGhlIHByb3BzIG9mIGNvbXBvbmVudFxuLy8gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5VcGRhdGU6IGZ1bmN0aW9uIF9GbHV4TWl4aW5VcGRhdGUocHJvcHMpIHtcbi8vICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRTdWJzY3JpcHRpb25zID0gXy5vYmplY3QoXy5tYXAodGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucywgZnVuY3Rpb24oZW50cnkpIHtcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gW2VudHJ5LmxvY2F0aW9uLCBlbnRyeS5zdGF0ZUtleV07XG4vLyAgICAgICAgICAgICAgIH0pKTtcblxuLy8gICAgICAgICAgICAgICB2YXIgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuLy8gICAgICAgICAgICAgICBfLmVhY2goY3VycmVudFN1YnNjcmlwdGlvbnMsIFIuc2NvcGUoZnVuY3Rpb24oc3RhdGVLZXksIGxvY2F0aW9uKSB7XG4vLyAgICAgICAgICAgICAgICAgaWYoIW5leHRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXSB8fCBuZXh0U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0gIT09IGN1cnJlbnRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXSkge1xuLy8gICAgICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluVW5zdWJzY3JpYmUoc3RhdGVLZXksIGxvY2F0aW9uKTtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgXy5lYWNoKG5leHRTdWJzY3JpcHRpb25zLCBSLnNjb3BlKGZ1bmN0aW9uKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0gfHwgY3VycmVudFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dICE9PSBzdGF0ZUtleSkge1xuLy8gICAgICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaWJlKHN0YXRlS2V5LCBsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG5cbi8vICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRMaXN0ZW5lcnMgPSBfLm9iamVjdChfLm1hcCh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIFtlbnRyeS5sb2NhdGlvbiwgZW50cnkuZm5dO1xuLy8gICAgICAgICAgICAgICB9KSk7XG4vLyAgICAgICAgICAgICAgIHZhciBuZXh0TGlzdGVuZXJzID0gdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcyk7XG4vLyAgICAgICAgICAgICAgIF8uZWFjaChjdXJyZW50TGlzdGVuZXJzLCBSLnNjb3BlKGZ1bmN0aW9uKGZuLCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgIGlmKCFuZXh0TGlzdGVuZXJzW2xvY2F0aW9uXSB8fCBuZXh0TGlzdGVuZXJzW2xvY2F0aW9uXSAhPT0gY3VycmVudExpc3RlbmVyc1tsb2NhdGlvbl0pIHtcbi8vICAgICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblJlbW92ZUxpc3RlbmVyKGZuLCBsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIF8uZWFjaChuZXh0TGlzdGVuZXJzLCBSLnNjb3BlKGZ1bmN0aW9uKGZuLCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgIGlmKCFjdXJyZW50TGlzdGVuZXJzW2xvY2F0aW9uXSB8fCBjdXJyZW50TGlzdGVuZXJzW2xvY2F0aW9uXSAhPT0gZm4pIHtcbi8vICAgICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpbkFkZExpc3RlbmVyKGZuLCBsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpbkluamVjdFxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVLZXkgVGhlIHN0YXRlS2V5XG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBUaGUgbG9jYXRpb25cbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluSW5qZWN0OiBmdW5jdGlvbiBfRmx1eE1peGluSW5qZWN0KHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgIGFzc2VydChyICE9PSBudWxsLCAnUi5GbHV4Ll9GbHV4TWl4aW5JbmplY3QoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnJyArIHRoaXMuZGlzcGxheU5hbWUgKyAnJywgJycgKyBsb2NhdGlvbiArICcnLCAnJyArIHN0YXRlS2V5ICsgJycpJyk7XG4vLyAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHtcbi8vICAgICAgICAgICAgICAgICBzdG9yZU5hbWU6IHJbMV0sXG4vLyAgICAgICAgICAgICAgICAgc3RvcmVLZXk6IHJbMl0sXG4vLyAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluSW5qZWN0KC4uLik6IHNob3VsZCBub3QgaW5qZWN0IGZyb20gU3RvcmVzLicpO1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmlzUGxhaW5PYmplY3QoZW50cnkpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKS5lbnRyeTogZXhwZWN0aW5nIE9iamVjdC4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdzdG9yZU5hbWUnKSAmJiBfLmlzU3RyaW5nKGVudHJ5LnN0b3JlTmFtZSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkluamVjdCguLi4pLmVudHJ5LnN0b3JlTmFtZTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdzdG9yZUtleScpICYmIF8uaXNTdHJpbmcoZW50cnkuc3RvcmVLZXkpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKS5lbnRyeS5zdG9yZUtleTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKFIucmVjb3JkKHN0YXRlS2V5LCB0aGlzLmdldEZsdXhTdG9yZShlbnRyeS5zdG9yZU5hbWUpLmdldChlbnRyeS5zdG9yZUtleSkpKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+QWxsb3cgYSBSZWFjdCBDb21wb25lbnQgdG8gc3Vic2NyaWJlIGF0IGFueSBkYXRhIGluIG9yZGVyIHRvIGZpbGwgc3RhdGU8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblN1YnNjcmliZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVLZXkgVGhlIGtleSB0byBiZSBzdWJzY3JpYmVkXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBUaGUgdXJsIHRoYXQgd2lsbCBiZSByZXF1ZXN0ZWRcbi8vICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluU3Vic2NyaWJlOiBmdW5jdGlvbiBfRmx1eE1peGluU3Vic2NyaWJlKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgIGFzc2VydChyICE9PSBudWxsLCAnUi5GbHV4Ll9GbHV4TWl4aW5TdWJzY3JpYmUoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnJyArIHRoaXMuZGlzcGxheU5hbWUgKyAnJywgJycgKyBsb2NhdGlvbiArICcnLCAnJyArIHN0YXRlS2V5ICsgJycpJyk7XG4vLyAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHtcbi8vICAgICAgICAgICAgICAgICBzdG9yZU5hbWU6IHJbMV0sXG4vLyAgICAgICAgICAgICAgICAgc3RvcmVLZXk6IHJbMl0sXG4vLyAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNQbGFpbk9iamVjdChlbnRyeSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblN1YnNjcmliZSguLi4pLmVudHJ5OiBleHBlY3RpbmcgT2JqZWN0LicpO1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhlbnRyeSwgJ3N0b3JlTmFtZScpICYmIF8uaXNTdHJpbmcoZW50cnkuc3RvcmVOYW1lKSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluU3Vic2NyaWJlKC4uLikuZW50cnkuc3RvcmVOYW1lOiBleHBlY3RpbmcgU3RyaW5nLicpO1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhlbnRyeSwgJ3N0b3JlS2V5JykgJiYgXy5pc1N0cmluZyhlbnRyeS5zdG9yZUtleSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblN1YnNjcmliZSguLi4pLmVudHJ5LnN0b3JlS2V5OiBleHBlY3RpbmcgU3RyaW5nLicpO1xuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIHZhciBzdG9yZSA9IHRoaXMuZ2V0Rmx1eFN0b3JlKGVudHJ5LnN0b3JlTmFtZSk7XG4vLyAgICAgICAgICAgICAgICAgLy9TdWJzY3JpYmUgYW5kIHJlcXVlc3QgU3RvcmUgdG8gZ2V0IGRhdGFcbi8vICAgICAgICAgICAgICAgICAvL0NhbGwgaW1tZWRpYXRseSBfRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGUgd2l0aCBjb21wdXRlZCBkYXRhIGluIG9yZGVyIHRvIGNhbGwgc2V0U3RhdGVcbi8vICAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gc3RvcmUuc3ViKGVudHJ5LnN0b3JlS2V5LCB0aGlzLl9GbHV4TWl4aW5TdG9yZVNpZ25hbFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24pKTtcblxuLy8gICAgICAgICAgICAgICAgIC8vU2F2ZSBzdWJzY3JpcHRpb25cbi8vICAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSB7XG4vLyAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4vLyAgICAgICAgICAgICAgICAgICBzdGF0ZUtleTogc3RhdGVLZXksXG4vLyAgICAgICAgICAgICAgICAgICBzdG9yZU5hbWU6IGVudHJ5LnN0b3JlTmFtZSxcbi8vICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbjogc3Vic2NyaXB0aW9uLFxuLy8gICAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+UmVyZW5kZXJpbmcgYSBjb21wb25lbnQgd2hlbiBkYXRhIHVwZGF0ZSBvY2N1cnM8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblN0b3JlU2lnbmFsVXBkYXRlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZUtleSBUaGUga2V5IHRvIGJlIHN1YnNjcmliZWRcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2F0aW9uIFRoZSB1cmwgdGhhdCB3aWxsIGJlIHJlcXVlc3RlZFxuLy8gICAgICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGU6IGZ1bmN0aW9uIF9GbHV4TWl4aW5TdG9yZVNpZ25hbFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIFIuc2NvcGUoZnVuY3Rpb24odmFsKSB7XG4vLyAgICAgICAgICAgICAgICAgaWYoIXRoaXMuaXNNb3VudGVkKCkpIHtcbi8vICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzVmFsID0gdGhpcy5zdGF0ZSA/IHRoaXMuc3RhdGVbc3RhdGVLZXldIDogdW5kZWZpbmVkO1xuLy8gICAgICAgICAgICAgICAgIGlmKF8uaXNFcXVhbChwcmV2aW91c1ZhbCwgdmFsKSkge1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUoc3RhdGVLZXksIGxvY2F0aW9uLCB2YWwsIHByZXZpb3VzVmFsKTtcbi8vICAgICAgICAgICAgICAgICAgICAgLy9DYWxsIHJlYWN0IEFQSSBpbiBvcmRlciB0byBSZXJlbmRlciBjb21wb25lbnRcbi8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShSLnJlY29yZChzdGF0ZUtleSwgdmFsKSk7XG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmx1eFN0b3JlRGlkVXBkYXRlKHN0YXRlS2V5LCBsb2NhdGlvbiwgdmFsLCBwcmV2aW91c1ZhbCk7XG4vLyAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluQWRkTGlzdGVuZXJcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtGb25jdGlvbn0gZm4gVGhlIGZuXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBUaGUgbG9jYXRpb25cbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluQWRkTGlzdGVuZXI6IGZ1bmN0aW9uIF9GbHV4TWl4aW5BZGRMaXN0ZW5lcihmbiwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgJ1IuRmx1eC5fRmx1eE1peGluQWRkTGlzdGVuZXIoLi4uKTogaW5jb3JyZWN0IGxvY2F0aW9uICgnJyArIHRoaXMuZGlzcGxheU5hbWUgKyAnJywgJycgKyBsb2NhdGlvbiArICcnKScpO1xuLy8gICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4vLyAgICAgICAgICAgICAgICAgZXZlbnRFbWl0dGVyTmFtZTogclsxXSxcbi8vICAgICAgICAgICAgICAgICBldmVudE5hbWU6IHJbMl0sXG4vLyAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNQbGFpbk9iamVjdChlbnRyeSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLikuZW50cnk6IGV4cGVjdGluZyBPYmplY3QuJyk7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCAnZXZlbnRFbWl0dGVyTmFtZScpICYmIF8uaXNTdHJpbmcoZW50cnkuZXZlbnRFbWl0dGVyTmFtZSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLikuZW50cnkuZXZlbnRFbWl0dGVyTmFtZTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdldmVudE5hbWUnKSAmJiBfLmlzU3RyaW5nKGVudHJ5LmV2ZW50TmFtZSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLikuZW50cnkuZXZlbnROYW1lOiBleHBlY3RpbmcgU3RyaW5nLicpO1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhlbnRyeSwgJ2ZuJykgJiYgXy5pc0Z1bmN0aW9uKGZuKSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluQWRkTGlzdGVuZXIoLi4uKS5lbnRyeS5mbjogZXhwZWN0aW5nIEZ1bmN0aW9uLicpO1xuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIHZhciBldmVudEVtaXR0ZXIgPSB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXIoZW50cnkuZXZlbnRFbWl0dGVyTmFtZSk7XG4vLyAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGV2ZW50RW1pdHRlci5hZGRMaXN0ZW5lcihlbnRyeS5ldmVudE5hbWUsIHRoaXMuX0ZsdXhNaXhpbkV2ZW50RW1pdHRlckVtaXQoZW50cnkuZXZlbnRFbWl0dGVyTmFtZSwgZW50cnkuZXZlbnROYW1lLCBlbnRyeS5mbikpO1xuLy8gICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbbGlzdGVuZXIudW5pcXVlSWRdID0ge1xuLy8gICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbi8vICAgICAgICAgICAgICAgICBmbjogZm4sXG4vLyAgICAgICAgICAgICAgICAgZXZlbnRFbWl0dGVyTmFtZTogZW50cnkuZXZlbnRFbWl0dGVyTmFtZSxcbi8vICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4vLyAgICAgICAgICAgICAgIH07XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpbkV2ZW50RW1pdHRlckVtaXRcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50RW1pdHRlck5hbWUgVGhlIGV2ZW50RW1pdHRlck5hbWVcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnROYW1lXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7Rm9uY3Rpb259IGZuIFRoZSBmblxuLy8gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5FdmVudEVtaXR0ZXJFbWl0OiBmdW5jdGlvbiBfRmx1eE1peGluRXZlbnRFbWl0dGVyRW1pdChldmVudEVtaXR0ZXJOYW1lLCBldmVudE5hbWUsIGZuKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiBSLnNjb3BlKGZ1bmN0aW9uKHBhcmFtcykge1xuLy8gICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4vLyAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50TmFtZSwgcGFyYW1zKTtcbi8vICAgICAgICAgICAgICAgICBmbihwYXJhbXMpO1xuLy8gICAgICAgICAgICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpO1xuLy8gICAgICAgICAgICAgICB9LCB0aGlzKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogQG1ldGhvZCBfRmx1eE1peGluVW5zdWJzY3JpYmVcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5IFRoZSBlbnRyeVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pcXVlSWQgVGhlIHVuaXF1ZUlkXG4vLyAgICAgICAgICAgICAqIEBwcml2YXRlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpblVuc3Vic2NyaWJlOiBmdW5jdGlvbiBfRmx1eE1peGluVW5zdWJzY3JpYmUoZW50cnksIHVuaXF1ZUlkKSB7XG4vLyAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMsIHVuaXF1ZUlkKSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluVW5zdWJzY3JpYmUoLi4uKTogbm8gc3VjaCBzdWJzY3JpcHRpb24uJyk7XG4vLyAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IGVudHJ5LnN1YnNjcmlwdGlvbjtcbi8vICAgICAgICAgICAgICAgdmFyIHN0b3JlTmFtZSA9IGVudHJ5LnN0b3JlTmFtZTtcbi8vICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKS51bnN1YihzdWJzY3JpcHRpb24pO1xuLy8gICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1t1bmlxdWVJZF07XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblJlbW92ZUxpc3RlbmVyXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbnRyeSBUaGUgZW50cnlcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXF1ZUlkIFRoZSB1bmlxdWVJZFxuLy8gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lcjogZnVuY3Rpb24gX0ZsdXhNaXhpblJlbW92ZUxpc3RlbmVyKGVudHJ5LCB1bmlxdWVJZCkge1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMsIHVuaXF1ZUlkKSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluUmVtb3ZlTGlzdGVuZXIoLi4uKTogbm8gc3VjaCBsaXN0ZW5lci4nKTtcbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBlbnRyeS5saXN0ZW5lcjtcbi8vICAgICAgICAgICAgICAgdmFyIGV2ZW50RW1pdHRlck5hbWUgPSBlbnRyeS5ldmVudEVtaXR0ZXJOYW1lO1xuLy8gICAgICAgICAgICAgICB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuLy8gICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW3VuaXF1ZUlkXTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgfSxcbi8vICAgICAgICAgfTtcblxuLy8gICAgICAgICBfLmV4dGVuZChGbHV4LkZsdXhJbnN0YW5jZS5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUi5GbHV4LkZsdXhJbnN0YW5jZS5wcm90b3R5cGUgKi97XG4vLyAgICAgICAgICAgX2lzRmx1eEluc3RhbmNlXzogdHJ1ZSxcbi8vICAgICAgICAgICBfc3RvcmVzOiBudWxsLFxuLy8gICAgICAgICAgIF9ldmVudEVtaXR0ZXJzOiBudWxsLFxuLy8gICAgICAgICAgIF9kaXNwYXRjaGVyczogbnVsbCxcbi8vICAgICAgICAgICBfc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogZmFsc2UsXG4vLyAgICAgICAgICAgYm9vdHN0cmFwSW5DbGllbnQ6IF8ubm9vcCxcbi8vICAgICAgICAgICBib290c3RyYXBJblNlcnZlcjogXy5ub29wLFxuLy8gICAgICAgICAgIGRlc3Ryb3lJbkNsaWVudDogXy5ub29wLFxuLy8gICAgICAgICAgIGRlc3Ryb3lJblNlcnZlcjogXy5ub29wLFxuLy8gICAgICAgICAgIHNob3VsZEluamVjdEZyb21TdG9yZXM6IGZ1bmN0aW9uIHNob3VsZEluamVjdEZyb21TdG9yZXMoKSB7XG4vLyAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcztcbi8vICAgICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5TZXRzIHRoZSBmbGFnIHRlbGxpbmcgYWxsIHRoZSBmbHV4LW1peGVkLWluIGNvbXBvbmVudHMgdG8gYXR0ZW1wdCB0byBpbmplY3QgcHJlLWZldGNoZWQgdmFsdWVzIGZyb20gdGhlIGNhY2hlLiBVc2VkIGZvciBwcmUtcmVuZGVyaW5nIG1hZ2ljLjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIHN0YXJ0SW5qZWN0aW5nRnJvbVN0b3Jlc1xuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBzdGFydEluamVjdGluZ0Zyb21TdG9yZXM6IGZ1bmN0aW9uIHN0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgYXNzZXJ0KCF0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoLi4uKTogc2hvdWxkIG5vdCBiZSBpbmplY3RpbmcgZnJvbSBTdG9yZXMuJyk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5VbnNldHMgdGhlIGZsYWcgdGVsbGluZyBhbGwgdGhlIGZsdXgtbWl4ZWQtaW4gY29tcG9uZW50cyB0byBhdHRlbXB0IHRvIGluamVjdCBwcmUtZmV0Y2hlZCB2YWx1ZXMgZnJvbSB0aGUgY2FjaGUuIFVzZWQgZm9yIHByZS1yZW5kZXJpbmcgbWFnaWMuPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2Qgc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIHN0b3BJbmplY3RpbmdGcm9tU3RvcmVzOiBmdW5jdGlvbiBzdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgYXNzZXJ0KHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMsICdSLkZsdXguRmx1eEluc3RhbmNlLnN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKC4uLik6IHNob3VsZCBiZSBpbmplY3RpbmcgZnJvbSBTdG9yZXMuJyk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+U2VyaWFsaXplIGEgc2VyaWFsaXplZCBmbHV4IGJ5IHRoZSBzZXJ2ZXIgaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSBmbHV4IGludG8gY2xpZW50PC9wPlxuLy8gICAgICAgICAqIEBtZXRob2Qgc2VyaWFsaXplXG4vLyAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJpbmcgVGhlIHNlcmlhbGl6ZWQgc3RyaW5nXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gc2VyaWFsaXplKCkge1xuLy8gICAgICAgICAgIHJldHVybiBSLkJhc2U2NC5lbmNvZGUoSlNPTi5zdHJpbmdpZnkoXy5tYXBWYWx1ZXModGhpcy5fc3RvcmVzLCBmdW5jdGlvbihzdG9yZSkge1xuLy8gICAgICAgICAgICAgcmV0dXJuIHN0b3JlLnNlcmlhbGl6ZSgpO1xuLy8gICAgICAgICAgIH0pKSk7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIC8qKlxuLy8gICAgICAgICAqIFVuc2VyaWFsaXplIGEgc2VyaWFsaXplZCBmbHV4IGJ5IHRoZSBzZXJ2ZXIgaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSBmbHV4IGludG8gY2xpZW50XG4vLyAgICAgICAgICogQG1ldGhvZCB1bnNlcmlhbGl6ZVxuLy8gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB1bnNlcmlhbGl6ZVxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICB1bnNlcmlhbGl6ZTogZnVuY3Rpb24gdW5zZXJpYWxpemUoc3RyKSB7XG4vLyAgICAgICAgICAgXy5lYWNoKEpTT04ucGFyc2UoUi5CYXNlNjQuZGVjb2RlKHN0cikpLCBSLnNjb3BlKGZ1bmN0aW9uKHNlcmlhbGl6ZWRTdG9yZSwgbmFtZSkge1xuLy8gICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX3N0b3JlcywgbmFtZSksICdSLkZsdXguRmx1eEluc3RhbmNlLnVuc2VyaWFsaXplKC4uLik6IG5vIHN1Y2ggU3RvcmUuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICB0aGlzLl9zdG9yZXNbbmFtZV0udW5zZXJpYWxpemUoc2VyaWFsaXplZFN0b3JlKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIC8qKlxuLy8gICAgICAgICAqIDxwPkdldHRlciBmb3IgdGhlIHN0b3JlPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgZ2V0U3RvcmVcbi8vICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc3RvcmVcbi8vICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHN0b3JlIFRoZSBjb3JyZXNwb25kaW5nIHN0b3JlXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZShuYW1lKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9zdG9yZXMsIG5hbWUpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5nZXRTdG9yZSguLi4pOiBubyBzdWNoIFN0b3JlLiAoJyArIG5hbWUgKyAnKScpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmVzW25hbWVdO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5SZWdpc3RlciBhIHN0b3JlIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwIDxiciAvPlxuLy8gICAgICAgICAqIFR5cGljYWxseSA6IE1lbW9yeSBvciBVcGxpbms8L3A+XG4vLyAgICAgICAgICogQG1ldGhvZCByZWdpc3RlclN0b3JlXG4vLyAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gcmVnaXN0ZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RvcmUgVGhlIHN0b3JlIHRvIHJlZ2lzdGVyXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIHJlZ2lzdGVyU3RvcmU6IGZ1bmN0aW9uIHJlZ2lzdGVyU3RvcmUobmFtZSwgc3RvcmUpIHtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgYXNzZXJ0KHN0b3JlLl9pc1N0b3JlSW5zdGFuY2VfLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlclN0b3JlKC4uLik6IGV4cGVjdGluZyBhIFIuU3RvcmUuU3RvcmVJbnN0YW5jZS4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fc3RvcmVzLCBuYW1lKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJTdG9yZSguLi4pOiBuYW1lIGFscmVhZHkgYXNzaWduZWQuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgIHRoaXMuX3N0b3Jlc1tuYW1lXSA9IHN0b3JlO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5HZXR0ZXIgZm9yIHRoZSBldmVudCBlbWl0dGVyPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgZ2V0RXZlbnRFbWl0dGVyXG4vLyAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHN0b3JlXG4vLyAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBldmVudEVtaXR0ZXIgVGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQgZW1pdHRlclxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBnZXRFdmVudEVtaXR0ZXI6IGZ1bmN0aW9uIGdldEV2ZW50RW1pdHRlcihuYW1lKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9ldmVudEVtaXR0ZXJzLCBuYW1lKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UuZ2V0RXZlbnRFbWl0dGVyKC4uLik6IG5vIHN1Y2ggRXZlbnRFbWl0dGVyLiAoJyArIG5hbWUgKyAnKScpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRFbWl0dGVyc1tuYW1lXTtcbi8vICAgICAgICAgfSxcblxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5SZWdpc3RlciBhbiBldmVudCBlbWl0dGVyIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJFdmVudEVtaXR0ZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSB0byByZWdpc3RlclxuLy8gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudEVtaXR0ZXIgVGhlIGV2ZW50IGVtaXR0ZXIgdG8gcmVnaXN0ZXJcbi8vICAgICAgICAgKi9cbi8vICAgICAgICAgcmVnaXN0ZXJFdmVudEVtaXR0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRFbWl0dGVyKG5hbWUsIGV2ZW50RW1pdHRlcikge1xuLy8gICAgICAgICAgIGFzc2VydChSLmlzQ2xpZW50KCksICdSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyRXZlbnRFbWl0dGVyKC4uLik6IHNob3VsZCBub3QgYmUgY2FsbGVkIGluIHRoZSBzZXJ2ZXIuJyk7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChldmVudEVtaXR0ZXIuX2lzRXZlbnRFbWl0dGVySW5zdGFuY2VfLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckV2ZW50RW1pdHRlciguLi4pOiBleHBlY3RpbmcgYSBSLkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXJJbnN0YW5jZS4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fZXZlbnRFbWl0dGVycywgbmFtZSksICdSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyRXZlbnRFbWl0dGVyKC4uLik6IG5hbWUgYWxyZWFkeSBhc3NpZ25lZC4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tuYW1lXSA9IGV2ZW50RW1pdHRlcjtcbi8vICAgICAgICAgfSxcblxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5HZXR0ZXIgZm9yIHRoZSBkaXNwYXRjaGVyPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgZ2V0RGlzcGF0Y2hlclxuLy8gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzdG9yZVxuLy8gICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gZGlzcGF0Y2hlciBUaGUgY29ycmVzcG9uZGluZyBkaXNwYXRjaGVyXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIGdldERpc3BhdGNoZXI6IGZ1bmN0aW9uIGdldERpc3BhdGNoZXIobmFtZSkge1xuLy8gICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fZGlzcGF0Y2hlcnMsIG5hbWUpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5nZXREaXNwYXRjaGVyKC4uLik6IG5vIHN1Y2ggRGlzcGF0Y2hlci4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXJzW25hbWVdO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5SZWdpc3RlciBhIGRpc3BhdGNoZXIgZGVmaW5lZCBpbiB0aGUgZmx1eCBjbGFzcyBvZiBBcHA8L3A+XG4vLyAgICAgICAgICogQG1ldGhvZCByZWdpc3RlckRpc3BhdGNoZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSB0byByZWdpc3RlclxuLy8gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkaXNwYXRjaGVyIFRoZSBkaXNwYXRjaGVyIHRvIHJlZ2lzdGVyXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIHJlZ2lzdGVyRGlzcGF0Y2hlcjogZnVuY3Rpb24gcmVnaXN0ZXJEaXNwYXRjaGVyKG5hbWUsIGRpc3BhdGNoZXIpIHtcbi8vICAgICAgICAgICBhc3NlcnQoUi5pc0NsaWVudCgpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckRpc3BhdGNoZXIoLi4uKTogc2hvdWxkIG5vdCBiZSBjYWxsZWQgaW4gdGhlIHNlcnZlci4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgYXNzZXJ0KGRpc3BhdGNoZXIuX2lzRGlzcGF0Y2hlckluc3RhbmNlXywgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJEaXNwYXRjaGVyKC4uLik6IGV4cGVjdGluZyBhIFIuRGlzcGF0Y2hlci5EaXNwYXRjaGVySW5zdGFuY2UgKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fZGlzcGF0Y2hlcnMsIG5hbWUpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckRpc3BhdGNoZXIoLi4uKTogbmFtZSBhbHJlYWR5IGFzc2lnbmVkLiAoJyArIG5hbWUgKyAnKScpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tuYW1lXSA9IGRpc3BhdGNoZXI7XG4vLyAgICAgICAgIH0sXG5cbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+Q2xlYXJzIHRoZSBzdG9yZSBieSBjYWxsaW5nIGVpdGhlciB0aGlzLmRlc3Ryb3lJblNlcnZlciBvciB0aGlzLmRlc3Ryb3lJbkNsaWVudCBhbmQgcmVjdXJzaXZlbHkgYXBwbHlpbmcgZGVzdHJveSBvbiBlYWNoIHN0b3JlL2V2ZW50IGVtaXR0cmUvZGlzcGF0Y2hlci48YnIgLz5cbi8vICAgICAgICAgKiBVc2VkIGZvciBwcmUtcmVuZGVyaW5nIG1hZ2ljLjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcbi8vICAgICAgICAgKi9cbi8vICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbi8vICAgICAgICAgICBpZihSLmlzQ2xpZW50KCkpIHtcbi8vICAgICAgICAgICAgIHRoaXMuZGVzdHJveUluQ2xpZW50KCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGlmKFIuaXNTZXJ2ZXIoKSkge1xuLy8gICAgICAgICAgICAgdGhpcy5kZXN0cm95SW5TZXJ2ZXIoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgICAgXy5lYWNoKHRoaXMuX3N0b3JlcywgZnVuY3Rpb24oc3RvcmUpIHtcbi8vICAgICAgICAgICAgIHN0b3JlLmRlc3Ryb3koKTtcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICB0aGlzLl9zdG9yZXMgPSBudWxsO1xuLy8gICAgICAgICAgIF8uZWFjaCh0aGlzLl9ldmVudEVtaXR0ZXJzLCBmdW5jdGlvbihldmVudEVtaXR0ZXIpIHtcbi8vICAgICAgICAgICAgIGV2ZW50RW1pdHRlci5kZXN0cm95KCk7XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVycyA9IG51bGw7XG4vLyAgICAgICAgICAgXy5lYWNoKHRoaXMuX2Rpc3BhdGNoZXJzLCBmdW5jdGlvbihkaXNwYXRjaGVyKSB7XG4vLyAgICAgICAgICAgICBkaXNwYXRjaGVyLmRlc3Ryb3koKTtcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IG51bGw7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICB9KTtcblxuLy8gcmV0dXJuIEZsdXg7XG4vLyB9O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9