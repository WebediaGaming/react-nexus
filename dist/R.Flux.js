"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;
  var React = R.React;

  var abstractLocationRegExp = /^(.*):\/(.*)$/;

  var Flux = (function () {
    var Flux = function Flux(_ref) {
      var headers = _ref.headers;
      var guid = _ref.guid;
      var window = _ref.window;
      var req = _ref.req;

      _.dev(function () {
        return headers.should.be.an.Object && guid.should.be.a.String && _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this._headers = headers;
      this._guid = guid;
      this._window = window;
      this._req = req;
      this._stores = {};
      this._eventEmitters = {};
      this._dispatchers = {};
      this._shouldInjectFromStores = false;
    };

    _classProps(Flux, null, {
      bootstrap: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this = this;

          Object.keys(this._stores, function (storeName) {
            return _this.unregisterStore(storeName);
          });
          Object.keys(this._eventEmitters, function (eventEmitterName) {
            return _this.unregisterEventEmitter(eventEmitterName);
          });
          Object.keys(this._dispatchers, function (dispatcherName) {
            return _this.unregisterDispatcher(dispatcherName);
          });
          // Nullify references
          this._headers = null;
          this._window = null;
          this._req = null;
          this._stores = null;
          this._eventEmitters = null;
          this._dispatchers = null;
        }
      },
      startInjectingFromStores: {
        writable: true,
        value: function () {
          var _this2 = this;

          _.dev(function () {
            return _this2._shouldInjectFromStores.should.not.be.ok;
          });
          this._shouldInjectFromStores = true;
        }
      },
      stopInjectingFromStores: {
        writable: true,
        value: function () {
          var _this3 = this;

          _.dev(function () {
            return _this3._shouldInjectFromStores.should.be.ok;
          });
          this._shouldInjectFromStores = false;
        }
      },
      shouldInjectFromStores: {
        writable: true,
        value: function () {
          return this._shouldInjectFromStores;
        }
      },
      serialize: {
        writable: true,
        value: function (_ref2) {
          var preventEncoding = _ref2.preventEncoding;

          var serializable = _.mapValues(this._stores, function (store) {
            return store.serialize({ preventEncoding: true });
          });
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, _ref3) {
          var _this4 = this;
          var preventDecoding = _ref3.preventDecoding;

          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          Object.keys(unserializable).forEach(function (storeName) {
            _.dev(function () {
              return _this4._stores[storeName].should.be.ok;
            });
            _this4._stores[storeName].unserialize(unserializable[storeName], { preventDecoding: true });
          });
        }
      }
    });

    return Flux;
  })();

  _.extend(Flux.prototype, {
    _headers: null,
    _guid: null,
    _window: null,
    _req: null,
    _stores: null,
    _eventEmitters: null,
    _dispatchers: null,
    _shouldInjectFromStores: null });

  var Mixin = {};

  function PropType(props, propName, componentName) {
    return props.flux && props.flux instanceof Flux;
  }

  _.extend(Flux, { Mixin: Mixin, PropType: PropType });

  return Flux;
};

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxzQkFBc0IsR0FBRyxlQUFlLENBQUM7O01BRXpDLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLE9BQ29DO1VBQTlCLE9BQU8sUUFBUCxPQUFPO1VBQUUsSUFBSSxRQUFKLElBQUk7VUFBRSxNQUFNLFFBQU4sTUFBTTtVQUFFLEdBQUcsUUFBSCxHQUFHOztBQUN0QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdkIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUNwRSxDQUFDO0FBQ0YsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDekIsVUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQztLQUN0Qzs7Z0JBZEcsSUFBSTtBQWdCUixlQUFTOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFN0IsYUFBTzs7ZUFBQSxZQUFHOzs7QUFDUixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsU0FBUzttQkFBSyxNQUFLLGVBQWUsQ0FBQyxTQUFTLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDMUUsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFDLGdCQUFnQjttQkFBSyxNQUFLLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQ3RHLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBQyxjQUFjO21CQUFLLE1BQUssb0JBQW9CLENBQUMsY0FBYyxDQUFDO1dBQUEsQ0FBQyxDQUFDOztBQUU5RixjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixjQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUMxQjs7QUFFRCw4QkFBd0I7O2VBQUEsWUFBRzs7O0FBQ3pCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQzNELGNBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7U0FDckM7O0FBRUQsNkJBQXVCOztlQUFBLFlBQUc7OztBQUN4QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssdUJBQXVCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7U0FDdEM7O0FBRUQsNEJBQXNCOztlQUFBLFlBQUc7QUFDdkIsaUJBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDO1NBQ3JDOztBQUVELGVBQVM7O2VBQUEsaUJBQXNCO2NBQW5CLGVBQWUsU0FBZixlQUFlOztBQUN6QixjQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLO21CQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDcEcsaUJBQU8sZUFBZSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUN0Rjs7QUFFRCxpQkFBVzs7ZUFBQSxVQUFDLFVBQVUsU0FBdUI7O2NBQW5CLGVBQWUsU0FBZixlQUFlOztBQUN2QyxjQUFJLGNBQWMsR0FBRyxlQUFlLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzNGLGdCQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVMsRUFBSztBQUNqRCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE9BQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTthQUFBLENBQUMsQ0FBQztBQUNsRCxtQkFBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1dBQzNGLENBQUMsQ0FBQztTQUNKOzs7O1dBeERHLElBQUk7Ozs7O0FBMkRWLEdBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixZQUFRLEVBQUUsSUFBSTtBQUNkLFNBQUssRUFBRSxJQUFJO0FBQ1gsV0FBTyxFQUFFLElBQUk7QUFDYixRQUFJLEVBQUUsSUFBSTtBQUNWLFdBQU8sRUFBRSxJQUFJO0FBQ2Isa0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGdCQUFZLEVBQUUsSUFBSTtBQUNsQiwyQkFBdUIsRUFBRSxJQUFJLEVBQzlCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLEtBQUssR0FBRyxFQUViLENBQUM7O0FBRUYsV0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUU7QUFDaEQsV0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLFlBQVksSUFBSSxDQUFDO0dBQ2pEOztBQUVELEdBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFcEMsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDIiwiZmlsZSI6IlIuRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgY29uc3QgYWJzdHJhY3RMb2NhdGlvblJlZ0V4cCA9IC9eKC4qKTpcXC8oLiopJC87XG5cbiAgY2xhc3MgRmx1eCB7XG4gICAgY29uc3RydWN0b3IoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgdGhpcy5fZ3VpZCA9IGd1aWQ7XG4gICAgICB0aGlzLl93aW5kb3cgPSB3aW5kb3c7XG4gICAgICB0aGlzLl9yZXEgPSByZXE7XG4gICAgICB0aGlzLl9zdG9yZXMgPSB7fTtcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSB7fTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzID0ge307XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYm9vdHN0cmFwKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9zdG9yZXMsIChzdG9yZU5hbWUpID0+IHRoaXMudW5yZWdpc3RlclN0b3JlKHN0b3JlTmFtZSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRFbWl0dGVycywgKGV2ZW50RW1pdHRlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9kaXNwYXRjaGVycywgKGRpc3BhdGNoZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSBudWxsO1xuICAgICAgdGhpcy5fd2luZG93ID0gbnVsbDtcbiAgICAgIHRoaXMuX3JlcSA9IG51bGw7XG4gICAgICB0aGlzLl9zdG9yZXMgPSBudWxsO1xuICAgICAgdGhpcy5fZXZlbnRFbWl0dGVycyA9IG51bGw7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IG51bGw7XG4gICAgfVxuXG4gICAgc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuICAgIH1cblxuICAgIHN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNob3VsZEluamVjdEZyb21TdG9yZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcztcbiAgICB9XG5cbiAgICBzZXJpYWxpemUoeyBwcmV2ZW50RW5jb2RpbmcgfSkge1xuICAgICAgbGV0IHNlcmlhbGl6YWJsZSA9IF8ubWFwVmFsdWVzKHRoaXMuX3N0b3JlcywgKHN0b3JlKSA9PiBzdG9yZS5zZXJpYWxpemUoeyBwcmV2ZW50RW5jb2Rpbmc6IHRydWUgfSkpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIGxldCB1bnNlcmlhbGl6YWJsZSA9IHByZXZlbnREZWNvZGluZyA/IHNlcmlhbGl6ZWQgOiBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHNlcmlhbGl6ZWQpKTtcbiAgICAgIE9iamVjdC5rZXlzKHVuc2VyaWFsaXphYmxlKS5mb3JFYWNoKChzdG9yZU5hbWUpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0udW5zZXJpYWxpemUodW5zZXJpYWxpemFibGVbc3RvcmVOYW1lXSwgeyBwcmV2ZW50RGVjb2Rpbmc6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChGbHV4LnByb3RvdHlwZSwge1xuICAgIF9oZWFkZXJzOiBudWxsLFxuICAgIF9ndWlkOiBudWxsLFxuICAgIF93aW5kb3c6IG51bGwsXG4gICAgX3JlcTogbnVsbCxcbiAgICBfc3RvcmVzOiBudWxsLFxuICAgIF9ldmVudEVtaXR0ZXJzOiBudWxsLFxuICAgIF9kaXNwYXRjaGVyczogbnVsbCxcbiAgICBfc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogbnVsbCxcbiAgfSk7XG5cbiAgY29uc3QgTWl4aW4gPSB7XG5cbiAgfTtcblxuICBmdW5jdGlvbiBQcm9wVHlwZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICByZXR1cm4gcHJvcHMuZmx1eCAmJiBwcm9wcy5mbHV4IGluc3RhbmNlb2YgRmx1eDtcbiAgfVxuXG4gIF8uZXh0ZW5kKEZsdXgsIHsgTWl4aW4sIFByb3BUeXBlIH0pO1xuXG4gIHJldHVybiBGbHV4O1xufTtcblxuXG5cbi8vICAgICAvKipcbi8vICAgICAgKiBAbWVtYmVyT2YgUlxuLy8gICAgICAqIDxwPlIuRmx1eCByZXByZXNlbnRzIHRoZSBkYXRhIGZsb3dpbmcgZnJvbSB0aGUgYmFja2VuZHMgKGVpdGhlciBsb2NhbCBvciByZW1vdGUpLlxuLy8gICAgICAqIFRvIGVuYWJsZSBpc29tb3ByaGljIHJlbmRlcmluZywgaXQgc2hvdWxkIGJlIGNvbXB1dGFibGUgZWl0aGVyIG9yIGluIHRoZSBzZXJ2ZXIgb3IgaW4gdGhlIGNsaWVudC5cbi8vICAgICAgKiBJdCByZXByZXNlbnRzIHRoZSBnbG9iYWwgc3RhdGUsIGluY2x1ZGluZyBidXQgbm90IGxpbWl0ZWQgdG86PC9wPlxuLy8gICAgICAqIDx1bD5cbi8vICAgICAgKiA8bGk+Um91dGluZyBpbmZvcm1hdGlvbjwvbGk+XG4vLyAgICAgICogPGxpPlNlc3Npb24gaW5mb3JtYXRpb248L2xpPlxuLy8gICAgICAqIDxsaT5OYXZpZ2F0aW9uIGluZm9ybWF0aW9uPC9saT5cbi8vICAgICAgKiA8L3VsPlxuLy8gICAgICAqIDxwPkluc2lkZSBhbiBBcHAsIGVhY2ggY29tcG9uZW50cyBjYW4gaW50ZXJhY3Qgd2l0aCB0aGUgRmx1eCBpbnN0YW5jZSB1c2luZyBGbHV4Lk1peGluIChnZW5lcmFsbHkgdmlhIFJvb3QuTWl4aW4gb3IgQ29tcG9uZW50Lk1peGluKS48L3A+XG4vLyAgICAgICogQGNsYXNzIFIuRmx1eFxuLy8gICAgICAqL1xuLy8gICAgICB2YXIgRmx1eCA9IHtcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+UmV0dXJucyBhIEZsdXggY29uc3RydWN0b3I8L3A+XG4vLyAgICAgICAgICogQG1ldGhvZCBjcmVhdGVGbHV4XG4vLyAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNwZWNzIFRoZSBzcGVjaWZpY2F0aW9ucyBvZiB0aGUgZmx1eFxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBjcmVhdGVGbHV4OiBmdW5jdGlvbiBjcmVhdGVGbHV4KHNwZWNzKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICBhc3NlcnQoXy5pc09iamVjdChzcGVjcyksICdSLmNyZWF0ZUZsdXgoLi4uKTogZXhwZWN0aW5nIGFuIE9iamVjdC4nKTtcbi8vICAgICAgICAgICAgIGFzc2VydChfLmhhcyhzcGVjcywgJ2Jvb3RzdHJhcEluQ2xpZW50JykgJiYgXy5pc0Z1bmN0aW9uKHNwZWNzLmJvb3RzdHJhcEluQ2xpZW50KSwgJ1IuY3JlYXRlRmx1eCguLi4pOiByZXF1aXJlcyBib290c3RyYXBJbkNsaWVudChXaW5kb3cpOiBGdW5jdGlvbicpO1xuLy8gICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHNwZWNzLCAnYm9vdHN0cmFwSW5TZXJ2ZXInKSAmJiBfLmlzRnVuY3Rpb24oc3BlY3MuYm9vdHN0cmFwSW5TZXJ2ZXIpLCAnUi5jcmVhdGVGbHV4KC4uLik6IHJlcXVpcmVzIGJvb3RzdHJhcEluU2VydmVyKGh0dHAuSW5jb21pbmdNZXNzYWdlKTogRnVuY3Rpb24nKTtcbi8vICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICB2YXIgRmx1eEluc3RhbmNlID0gZnVuY3Rpb24oKSB7IFIuRmx1eC5GbHV4SW5zdGFuY2UuY2FsbCh0aGlzKTsgfTtcbi8vICAgICAgICAgICBfLmV4dGVuZChGbHV4SW5zdGFuY2UucHJvdG90eXBlLCBSLkZsdXguRmx1eEluc3RhbmNlLnByb3RvdHlwZSwgc3BlY3MpO1xuLy8gICAgICAgICAgIHJldHVybiBGbHV4SW5zdGFuY2U7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIC8qKlxuLy8gICAgICAgICAqIDxwPkNoZWNrIGlmIHRoZSBmbHV4IHByb3ZpZGVkIGJ5IHByb3BzIGlzIGFuIG9iamVjdCBhbmQgYSBmbHV4IGluc3RhbmNlPC9wPlxuLy8gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wcyBUaGUgcHJvcHMgdG8gY2hlY2tcbi8vICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB2YWxpZCBUaGUgcmVzdWx0IGJvb2xlYW4gb2YgdGhlIGNoZWNrZWQgZmx1eFxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBQcm9wVHlwZTogZnVuY3Rpb24gdmFsaWRhdGVGbHV4KHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuLy8gICAgICAgICAgIHZhciBmbHV4ID0gcHJvcHMuZmx1eDtcbi8vICAgICAgICAgICB2YXIgdmFsaWQgPSBudWxsO1xuLy8gICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgdHJ5IHtcbi8vICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNPYmplY3QoZmx1eCkgJiYgZmx1eC5faXNGbHV4SW5zdGFuY2VfLCAnUi5Sb290LmNyZWF0ZUNsYXNzKC4uLik6IGV4cGVjdGluZyBhIFIuRmx1eC5GbHV4SW5zdGFuY2UuJyk7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBjYXRjaChlcnIpIHtcbi8vICAgICAgICAgICAgICAgdmFsaWQgPSBlcnI7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBGbHV4SW5zdGFuY2U6IGZ1bmN0aW9uIEZsdXhJbnN0YW5jZSgpIHtcbi8vICAgICAgICAgICB0aGlzLl9zdG9yZXMgPSB7fTtcbi8vICAgICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzID0ge307XG4vLyAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnMgPSB7fTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgTWl4aW46IHtcbi8vICAgICAgICAgICBfRmx1eE1peGluU3Vic2NyaXB0aW9uczogbnVsbCxcbi8vICAgICAgICAgICBfRmx1eE1peGluTGlzdGVuZXJzOiBudWxsLFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPlRoZSBnZXRJbml0aWFsU3RhdGUgb2YgUmVhY3QgbWVjaGFuaWNzIHdpbGwgYmUgY2FsbCBhdDo8L3A+XG4vLyAgICAgICAgICAgICAqICAtIFJlYWN0LnJlbmRlcigpIDxiciAvPlxuLy8gICAgICAgICAgICAgKiAgLSBSZWFjdC5yZW5kZXJUb1N0cmluZygpIDxiciAvPlxuLy8gICAgICAgICAgICAgKiA8cD5OZXZlciByZXR1cm4gYSBudWxsIG9iamVjdCwgYnkgZGVmYXVsdDoge30sIG90aGVyd2lzZSByZXR1cm4gZGF0YSBzdG9ja2VkIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgc3RvcmU8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0SW5pdGlhbFN0YXRlXG4vLyAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gb2JqZWN0IEFuIG9iamVjdCBsaWtlOiBbc3RhdGVLZXksIGRhdGFdXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4vLyAgICAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuLy8gICAgICAgICAgICAgICAvKiBSZXR1cm4gY29tcHV0ZWQgZGF0YXMgZnJvbSBDb21wb25lbnQncyBzdWJzY3JpcHRpb25zICovXG4vLyAgICAgICAgICAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBfLm9iamVjdChfLm1hcChzdWJzY3JpcHRpb25zLCBSLnNjb3BlKGZ1bmN0aW9uKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICAgICAgYXNzZXJ0KHIgIT09IG51bGwsICdSLkZsdXguZ2V0SW5pdGlhbFN0YXRlKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycsICcnICsgbG9jYXRpb24gKyAnJywgJycgKyBzdGF0ZUtleSArICcnKScpO1xuLy8gICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlTmFtZSA9IHJbMV07XG4vLyAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVLZXkgPSByWzJdO1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgdGhpcy5nZXRGbHV4U3RvcmUoc3RvcmVOYW1lKS5nZXQoc3RvcmVLZXkpXTtcbi8vICAgICAgICAgICAgICAgICB9LCB0aGlzKSkpO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgIC8qIFJldHVybiBzdGF0ZUtleTpudWxsIHZhbHVlcyBmb3IgZWFjaCBzdWJzY3JpcHRpb25zICovXG4vLyAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBfLm9iamVjdChfLm1hcChzdWJzY3JpcHRpb25zLCBmdW5jdGlvbihzdGF0ZUtleSkge1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgbnVsbF07XG4vLyAgICAgICAgICAgICAgICAgfSkpO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPlRoZSBjb21wb25lbnRXaWxsTW91bnQgb2YgUmVhY3QgbWVjaGFuaWNzPC9wPlxuLy8gICAgICAgICAgICAgKiA8cD5Jbml0aWFsaXplIGZsdXggZnVuY3Rpb25zIGZvciBlYWNoIGNvbXBvbmVudHMgd2hlbiBjb21wb25lbnRXaWxsTW91bnQgaXMgaW52b2tlZCBieSBSZWFjdDwvcD5cbi8vICAgICAgICAgICAgICogQG1ldGhvZCBjb21wb25lbnRXaWxsTW91bnRcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbi8vICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQodGhpcy5nZXRGbHV4ICYmIF8uaXNGdW5jdGlvbih0aGlzLmdldEZsdXgpLCAnUi5GbHV4Lk1peGluLmNvbXBvbmVudFdpbGxNb3VudCguLi4pOiByZXF1aXJlcyBnZXRGbHV4KCk6IFIuRmx1eC5GbHV4SW5zdGFuY2UuJyk7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMuX0FzeW5jTWl4aW5IYXNBc3luY01peGluLCAnUi5GbHV4Lk1peGluLmNvbXBvbmVudFdpbGxNb3VudCguLi4pOiByZXF1aXJlcyBSLkFzeW5jLk1peGluLicpO1xuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycyA9IHt9O1xuLy8gICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zID0ge307XG4vLyAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblJlc3BvbnNlcyA9IHt9O1xuLy8gICAgICAgICAgICAgICBpZighdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKSB7XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnM7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgaWYoIXRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzID0gdGhpcy5fRmx1eE1peGluRGVmYXVsdEdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzO1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0Rmx1eFN0b3JlV2lsbFVwZGF0ZTtcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICBpZighdGhpcy5mbHV4U3RvcmVEaWRVcGRhdGUpIHtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZSA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4U3RvcmVEaWRVcGRhdGU7XG4vLyAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgaWYoIXRoaXMuZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KSB7XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQgPSB0aGlzLl9GbHV4TWl4aW5EZWZhdWx0Rmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0O1xuLy8gICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KSB7XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyRGlkRW1pdCA9IHRoaXMuX0ZsdXhNaXhpbkRlZmF1bHRGbHV4RXZlbnRFbWl0dGVyRGlkRW1pdDtcbi8vICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfSxcblxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPkNhbGwgdGhlIG1hbmFnZXIgc3Vic2NyaXB0aW9ucyB3aGVuIGNvbXBvbmVuZERpZE1vdW50IGlzIGludm9rZWQgYnkgUmVhY3QgKG9ubHkgY2xpZW50LXNpZGUpPC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIGNvbXBvbmVudERpZE1vdW50XG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuLy8gICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5VcGRhdGUodGhpcy5wcm9wcyk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuLy8gICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5VcGRhdGUocHJvcHMpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbi8vICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluQ2xlYXIoKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBnZXRGbHV4U3RvcmU6IGZ1bmN0aW9uIGdldEZsdXhTdG9yZShuYW1lKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZsdXgoKS5nZXRTdG9yZShuYW1lKTtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAvKipcbi8vICAgICAgICAgICAgICogPHA+RmV0Y2ggYWxsIGNvbXBvbmVudHMgZnJvbSBhIHJvb3QgY29tcG9uZW50IGluIG9yZGVyIHRvIGluaXRpYWxpemUgYWxsIGRhdGEsIGZpbGwgdGhlIGNvcnJlc3BvbmRpbmcgc3RvcmVzPC9wPlxuLy8gICAgICAgICAgICAgKiA8cD5FeGVjdXRlZCBzZXJ2ZXItc2lkZTxwPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIHByZWZldGNoRmx1eFN0b3Jlc1xuLy8gICAgICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIHByZWZldGNoRmx1eFN0b3JlczogZnVuY3Rpb24qIHByZWZldGNoRmx1eFN0b3JlcygpIHtcbi8vICAgICAgICAgICAgICAgICAvL0dldCBhbGwgc3Vic2NyaXB0aW9ucyBmcm9tIGN1cnJlbnQgY29tcG9uYW50XG4vLyAgICAgICAgICAgICAgICAgLy9lZy4nc3RvcmVOYW1lOi9zdG9yZUtleSc6ICdzdG9yZUtleScsXG4vLyAgICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4vLyAgICAgICAgICAgICAgICAgdmFyIGN1ckNvdW50ID0gY291bnQ7XG4vLyAgICAgICAgICAgICAgICAgdmFyIHN0YXRlID0ge307XG5cbi8vICAgICAgICAgICAgICAgICAvL0ZvciBlYWNoIHN1YnNjcmlwdGlvbiwgY2FsbCB0aGUgcmVxdWVzdCB0byBnZXQgZGF0YSBmcm9tIHRoZSBVcGxpbmtTdG9yZSBvciBNZW1vcnlTdG9yZVxuLy8gICAgICAgICAgICAgICAgIC8vU2F2ZXMgdGhlIGRhdGEgaW4gYSB2YXJpYWJsZSAnc3RhdGUnIHdoaWNoIHdpbGwgdGhlbiBzZXJ2ZSB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgY29tcG9uZW50XG4vLyAgICAgICAgICAgICAgICAgeWllbGQgXy5tYXAoc3Vic2NyaXB0aW9ucywgUi5zY29wZShmdW5jdGlvbihzdGF0ZUtleSwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShSLnNjb3BlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuLy8gICAgICAgICAgICAgICAgICAgICB2YXIgciA9IGFic3RyYWN0TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgICAgIGlmKHIgPT09IG51bGwpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcignUi5GbHV4LnByZWZldGNoRmx1eFN0b3JlcyguLi4pOiBpbmNvcnJlY3QgbG9jYXRpb24gKCcnICsgdGhpcy5kaXNwbGF5TmFtZSArICcnLCAnJyArIGxvY2F0aW9uICsgJycsICcnICsgc3RhdGVLZXkgKyAnJyknKSk7XG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlTmFtZSA9IHJbMV07XG4vLyAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlS2V5ID0gclsyXTtcbi8vICAgICAgICAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yIFVwbGluaywgcmVxdWVzdGVkIHVybCBpcyA6IC9zdG9yZU5hbWUvc3RvcmVLZXkgb24gdGhlIFVwbGlua1NlcnZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZSByZXNwb25zZSBpcyBzdG9yZWQgaW4gc3RhdGVbc3RhdGVLZXldXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yIE1lbW9yeSwgZGF0YSBjb21lcyBmcm9tIGluc3RhbGxlZCBwbHVnaW5zIGxpa2UgV2luZG93LCBIaXN0b3J5LCBldGMuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZmluYWxseSBkYXRhIGlzIHNhdmVkIGluIHRoaXMuZ2V0Rmx1eFN0b3JlKHN0b3JlTmFtZSkgdGhhdCB3aWxsIGJlIHVzZWQgaW4gZ2V0SW5pdGlhbFN0YXRlIGZvciBjdXJyZW50Q29tcG9uZW50XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlW3N0YXRlS2V5XSA9IHlpZWxkIHRoaXMuZ2V0Rmx1eFN0b3JlKHN0b3JlTmFtZSkuZmV0Y2goc3RvcmVLZXkpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBmdW5jdGlvbihlcnIpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgJ0NvdWxkbid0IHByZWZldGNoIHN1YnNjcmlwdGlvbiAoJycgKyBzdGF0ZUtleSArICcnLCAnJyArIGxvY2F0aW9uICsgJycpJykpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gdGhpcy5nZXRGbHV4KCkuc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG5cbi8vICAgICAgICAgICAgICAgICAvL0NyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2YgY3VycmVudCBjb21wb25lbnQgd2l0aCBjb21wdXRlZCBzdGF0ZSBhbmQgcHJvcHNcbi8vICAgICAgICAgICAgICAgICAvL0lmIHN0YXRlIG9yIHByb3BzIGFyZSBub3QgY29tcHV0ZWQsIHdlIHdpbGwgbm90IGJlIGFibGUgdG8gY29tcHV0ZSB0aGUgbmV4dCBjaGlsZFxuLy8gICAgICAgICAgICAgICAgIHZhciBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdGhpcy5fX1JlYWN0T25SYWlsc1N1cnJvZ2F0ZSh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMsIHN0YXRlKTtcbi8vICAgICAgICAgICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4KCkuc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuLy8gICAgICAgICAgICAgICAgIC8vUmVuZGVyIGN1cnJlbnQgY29tcG9uZW50IGluIG9yZGVyIHRvIGdldCBjaGlsZHNcbi8vICAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XG5cbi8vICAgICAgICAgICAgICAgICB2YXIgY2hpbGRDb250ZXh0ID0gKHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQgPyBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkgOiB0aGlzLmNvbnRleHQpO1xuXG4vLyAgICAgICAgICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbi8vICAgICAgICAgICAgICAgICAvL0ZldGNoIGNoaWxkcmVuIFJlYWN0IGNvbXBvbmVudCBvZiBjdXJyZW50IGNvbXBvbmVudCBpbiBvcmRlciB0byBjb21wdXRlIHRoZSBuZXh0IGNoaWxkXG4vLyAgICAgICAgICAgICAgICAgeWllbGQgUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZShyZW5kZXJlZENvbXBvbmVudCwgZnVuY3Rpb24oY2hpbGRDb21wb25lbnQpIHtcbi8vICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgaWYoIV8uaXNPYmplY3QoY2hpbGRDb21wb25lbnQpKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRUeXBlID0gY2hpbGRDb21wb25lbnQudHlwZTtcbi8vICAgICAgICAgICAgICAgICAgICAgaWYoIV8uaXNPYmplY3QoY2hpbGRUeXBlKSB8fCAhY2hpbGRUeXBlLl9fUmVhY3RPblJhaWxzU3Vycm9nYXRlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIGN1cnJlbnQgY2hpbGQgd2l0aCBwcm9wcywgYnV0IHdpdGhvdXQgY29tcHV0ZWQgc3RhdGVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdXJyb2dhdGVDaGlsZENvbXBvbmVudCA9IG5ldyBjaGlsZFR5cGUuX19SZWFjdE9uUmFpbHNTdXJyb2dhdGUoY2hpbGRDb250ZXh0LCBjaGlsZENvbXBvbmVudC5wcm9wcyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBpZighc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbXBvbmVudCBkb2Vzbid0IGhhdmUgY29tcG9uZW50V2lsbE1vdW50LiBNYXliZSB5b3UgZm9yZ290IFIuQ29tcG9uZW50Lk1peGluPyAoJycgKyBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5kaXNwbGF5TmFtZSArICcnKScpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vUmVjdXJzaXZseSBjYWxsICpwcmVmZXRjaEZsdXhTdG9yZXMqIGZvciB0aGlzIGN1cnJlbnQgY2hpbGQgaW4gb3JkZXIgdG8gY29tcHV0ZSBoaXMgc3RhdGVcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVycikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgJ0NvdWxkbid0IHByZWZldGNoIGNoaWxkIGNvbXBvbmVudCcpKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPlJldHVybnMgdGhlIEZsdXhFdmVudEVtaXR0ZXIgYWNjb3JkaW5nIHRoZSBwcm92aWRlZCBuYW1lPC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEZsdXhFdmVudEVtaXR0ZXJcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWVcbi8vICAgICAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBFdmVudEVtaXR0ZXIgdGhlIEV2ZW50RW1pdHRlclxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIGdldEZsdXhFdmVudEVtaXR0ZXI6IGZ1bmN0aW9uIGdldEZsdXhFdmVudEVtaXR0ZXIobmFtZSkge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGbHV4KCkuZ2V0RXZlbnRFbWl0dGVyKG5hbWUpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiA8cD5SZXR1cm5zIHRoZSBGbHV4RGlzcGF0Y2hlciBhY2NvcmRpbmcgdGhlIHByb3ZpZGVkIG5hbWU8L3A+XG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgZ2V0Rmx1eERpc3BhdGNoZXJcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWVcbi8vICAgICAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBEaXNwYXRjaGVyIHRoZSBEaXNwYXRjaGVyXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgZ2V0Rmx1eERpc3BhdGNoZXI6IGZ1bmN0aW9uIGdldEZsdXhEaXNwYXRjaGVyKG5hbWUpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rmx1eCgpLmdldERpc3BhdGNoZXIobmFtZSk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPkdldCB0aGUgY29ycmVzcG9uZGluZyBkaXNwYXRjaGVyIGFuZCBkaXNwYXRjaCB0aGUgYWN0aW9uIHN1Ym1pdHRlZCBieSBhIFJlYWN0IGNvbXBvbmVudDxiciAvPlxuLy8gICAgICAgICAgICAgKiBUcmlnZ2VkIG9uIGV2ZW50IGxpa2UgJ2NsaWNrJzwvcD5cbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIFRoZSB1cmwgdG8gZ28gKGVnLiAnLy9IaXN0b3J5L25hdmlnYXRlJylcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtIFRoZSBzcGVjaWZpYyBkYXRhIGZvciB0aGUgYWN0aW9uXG4vLyAgICAgICAgICAgICAqIEByZXR1cm4geyp9ICogdGhlIGRhdGEgdGhhdCBtYXkgYmUgcHJvdmlkZWQgYnkgdGhlIGRpc3BhdGNoZXJcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24qIGRpc3BhdGNoKGxvY2F0aW9uLCBwYXJhbXMpIHtcbi8vICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgJ1IuRmx1eC5kaXNwYXRjaCguLi4pOiBpbmNvcnJlY3QgbG9jYXRpb24gKCcnICsgdGhpcy5kaXNwbGF5TmFtZSArICcnKScpO1xuLy8gICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4vLyAgICAgICAgICAgICAgICAgZGlzcGF0Y2hlck5hbWU6IHJbMV0sXG4vLyAgICAgICAgICAgICAgICAgYWN0aW9uOiByWzJdLFxuLy8gICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5nZXRGbHV4RGlzcGF0Y2hlcihlbnRyeS5kaXNwYXRjaGVyTmFtZSkuZGlzcGF0Y2goZW50cnkuYWN0aW9uLCBwYXJhbXMpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0R2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9uczogZnVuY3Rpb24gZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykge1xuLy8gICAgICAgICAgICAgICByZXR1cm4ge307XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkRlZmF1bHRHZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVyczogZnVuY3Rpb24gZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eFN0b3JlV2lsbFVwZGF0ZTogZnVuY3Rpb24gZmx1eFN0b3JlV2lsbFVwZGF0ZShzdG9yZU5hbWUsIHN0b3JlS2V5LCBuZXdWYWwsIG9sZFZhbCkge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5EZWZhdWx0Rmx1eFN0b3JlRGlkVXBkYXRlOiBmdW5jdGlvbiBmbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBzdG9yZUtleSwgbmV3VmFsLCBvbGRWYWwpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluRGVmYXVsdEZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdDogZnVuY3Rpb24gZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50TmFtZSwgcGFyYW1zKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkRlZmF1bHRGbHV4RXZlbnRFbWl0dGVyRGlkRW1pdDogZnVuY3Rpb24gZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBwYXJhbXMpIHtcbi8vICAgICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbi8vICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluQ2xlYXI6IGZ1bmN0aW9uIF9GbHV4TWl4aW5DbGVhcigpIHtcbi8vICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMsIHRoaXMuX0ZsdXhNaXhpblVuc3Vic2NyaWJlKTtcbi8vICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycywgdGhpcy5GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lcik7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPk1hbmFnZSBzdWJzY3JpcHRpb25zLCB1bnN1YnNjcmlwdGlvbnMgYW5kIGV2ZW50IGVtaXR0ZXJzPC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5VcGRhdGVcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBwcm9wcyBvZiBjb21wb25lbnRcbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluVXBkYXRlOiBmdW5jdGlvbiBfRmx1eE1peGluVXBkYXRlKHByb3BzKSB7XG4vLyAgICAgICAgICAgICAgIHZhciBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IF8ub2JqZWN0KF8ubWFwKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKGVudHJ5KSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIFtlbnRyeS5sb2NhdGlvbiwgZW50cnkuc3RhdGVLZXldO1xuLy8gICAgICAgICAgICAgICB9KSk7XG5cbi8vICAgICAgICAgICAgICAgdmFyIG5leHRTdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKTtcbi8vICAgICAgICAgICAgICAgXy5lYWNoKGN1cnJlbnRTdWJzY3JpcHRpb25zLCBSLnNjb3BlKGZ1bmN0aW9uKHN0YXRlS2V5LCBsb2NhdGlvbikge1xuLy8gICAgICAgICAgICAgICAgIGlmKCFuZXh0U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0gfHwgbmV4dFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dICE9PSBjdXJyZW50U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl0pIHtcbi8vICAgICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblVuc3Vic2NyaWJlKHN0YXRlS2V5LCBsb2NhdGlvbik7XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIF8uZWFjaChuZXh0U3Vic2NyaXB0aW9ucywgUi5zY29wZShmdW5jdGlvbihzdGF0ZUtleSwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICBpZighY3VycmVudFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dIHx8IGN1cnJlbnRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXSAhPT0gc3RhdGVLZXkpIHtcbi8vICAgICAgICAgICAgICAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmliZShzdGF0ZUtleSwgbG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuXG4vLyAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGlzdGVuZXJzID0gXy5vYmplY3QoXy5tYXAodGhpcy5fRmx1eE1peGluTGlzdGVuZXJzLCBmdW5jdGlvbihlbnRyeSkge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBbZW50cnkubG9jYXRpb24sIGVudHJ5LmZuXTtcbi8vICAgICAgICAgICAgICAgfSkpO1xuLy8gICAgICAgICAgICAgICB2YXIgbmV4dExpc3RlbmVycyA9IHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpO1xuLy8gICAgICAgICAgICAgICBfLmVhY2goY3VycmVudExpc3RlbmVycywgUi5zY29wZShmdW5jdGlvbihmbiwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICBpZighbmV4dExpc3RlbmVyc1tsb2NhdGlvbl0gfHwgbmV4dExpc3RlbmVyc1tsb2NhdGlvbl0gIT09IGN1cnJlbnRMaXN0ZW5lcnNbbG9jYXRpb25dKSB7XG4vLyAgICAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lcihmbiwgbG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgICBfLmVhY2gobmV4dExpc3RlbmVycywgUi5zY29wZShmdW5jdGlvbihmbiwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgICBpZighY3VycmVudExpc3RlbmVyc1tsb2NhdGlvbl0gfHwgY3VycmVudExpc3RlbmVyc1tsb2NhdGlvbl0gIT09IGZuKSB7XG4vLyAgICAgICAgICAgICAgICAgICB0aGlzLl9GbHV4TWl4aW5BZGRMaXN0ZW5lcihmbiwgbG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5JbmplY3Rcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlS2V5IFRoZSBzdGF0ZUtleVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gVGhlIGxvY2F0aW9uXG4vLyAgICAgICAgICAgICAqIEBwcml2YXRlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkluamVjdDogZnVuY3Rpb24gX0ZsdXhNaXhpbkluamVjdChzdGF0ZUtleSwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgJ1IuRmx1eC5fRmx1eE1peGluSW5qZWN0KC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycsICcnICsgbG9jYXRpb24gKyAnJywgJycgKyBzdGF0ZUtleSArICcnKScpO1xuLy8gICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4vLyAgICAgICAgICAgICAgICAgc3RvcmVOYW1lOiByWzFdLFxuLy8gICAgICAgICAgICAgICAgIHN0b3JlS2V5OiByWzJdLFxuLy8gICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydCh0aGlzLmdldEZsdXgoKS5zaG91bGRJbmplY3RGcm9tU3RvcmVzKCksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkluamVjdCguLi4pOiBzaG91bGQgbm90IGluamVjdCBmcm9tIFN0b3Jlcy4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc1BsYWluT2JqZWN0KGVudHJ5KSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluSW5qZWN0KC4uLikuZW50cnk6IGV4cGVjdGluZyBPYmplY3QuJyk7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCAnc3RvcmVOYW1lJykgJiYgXy5pc1N0cmluZyhlbnRyeS5zdG9yZU5hbWUpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5JbmplY3QoLi4uKS5lbnRyeS5zdG9yZU5hbWU6IGV4cGVjdGluZyBTdHJpbmcuJyk7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCAnc3RvcmVLZXknKSAmJiBfLmlzU3RyaW5nKGVudHJ5LnN0b3JlS2V5KSwgJ1IuRmx1eC5NaXhpbi5fRmx1eE1peGluSW5qZWN0KC4uLikuZW50cnkuc3RvcmVLZXk6IGV4cGVjdGluZyBTdHJpbmcuJyk7XG4vLyAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShSLnJlY29yZChzdGF0ZUtleSwgdGhpcy5nZXRGbHV4U3RvcmUoZW50cnkuc3RvcmVOYW1lKS5nZXQoZW50cnkuc3RvcmVLZXkpKSk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPkFsbG93IGEgUmVhY3QgQ29tcG9uZW50IHRvIHN1YnNjcmliZSBhdCBhbnkgZGF0YSBpbiBvcmRlciB0byBmaWxsIHN0YXRlPC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5TdWJzY3JpYmVcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlS2V5IFRoZSBrZXkgdG8gYmUgc3Vic2NyaWJlZFxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gVGhlIHVybCB0aGF0IHdpbGwgYmUgcmVxdWVzdGVkXG4vLyAgICAgICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4vLyAgICAgICAgICAgICAqIEBwcml2YXRlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpblN1YnNjcmliZTogZnVuY3Rpb24gX0ZsdXhNaXhpblN1YnNjcmliZShzdGF0ZUtleSwgbG9jYXRpb24pIHtcbi8vICAgICAgICAgICAgICAgdmFyIHIgPSBhYnN0cmFjdExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuLy8gICAgICAgICAgICAgICBhc3NlcnQociAhPT0gbnVsbCwgJ1IuRmx1eC5fRmx1eE1peGluU3Vic2NyaWJlKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycsICcnICsgbG9jYXRpb24gKyAnJywgJycgKyBzdGF0ZUtleSArICcnKScpO1xuLy8gICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XG4vLyAgICAgICAgICAgICAgICAgc3RvcmVOYW1lOiByWzFdLFxuLy8gICAgICAgICAgICAgICAgIHN0b3JlS2V5OiByWzJdLFxuLy8gICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmlzUGxhaW5PYmplY3QoZW50cnkpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5TdWJzY3JpYmUoLi4uKS5lbnRyeTogZXhwZWN0aW5nIE9iamVjdC4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdzdG9yZU5hbWUnKSAmJiBfLmlzU3RyaW5nKGVudHJ5LnN0b3JlTmFtZSksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblN1YnNjcmliZSguLi4pLmVudHJ5LnN0b3JlTmFtZTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdzdG9yZUtleScpICYmIF8uaXNTdHJpbmcoZW50cnkuc3RvcmVLZXkpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5TdWJzY3JpYmUoLi4uKS5lbnRyeS5zdG9yZUtleTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLmdldEZsdXhTdG9yZShlbnRyeS5zdG9yZU5hbWUpO1xuLy8gICAgICAgICAgICAgICAgIC8vU3Vic2NyaWJlIGFuZCByZXF1ZXN0IFN0b3JlIHRvIGdldCBkYXRhXG4vLyAgICAgICAgICAgICAgICAgLy9DYWxsIGltbWVkaWF0bHkgX0ZsdXhNaXhpblN0b3JlU2lnbmFsVXBkYXRlIHdpdGggY29tcHV0ZWQgZGF0YSBpbiBvcmRlciB0byBjYWxsIHNldFN0YXRlXG4vLyAgICAgICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IHN0b3JlLnN1YihlbnRyeS5zdG9yZUtleSwgdGhpcy5fRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGUoc3RhdGVLZXksIGxvY2F0aW9uKSk7XG5cbi8vICAgICAgICAgICAgICAgICAvL1NhdmUgc3Vic2NyaXB0aW9uXG4vLyAgICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24udW5pcXVlSWRdID0ge1xuLy8gICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuLy8gICAgICAgICAgICAgICAgICAgc3RhdGVLZXk6IHN0YXRlS2V5LFxuLy8gICAgICAgICAgICAgICAgICAgc3RvcmVOYW1lOiBlbnRyeS5zdG9yZU5hbWUsXG4vLyAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb246IHN1YnNjcmlwdGlvbixcbi8vICAgICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIDxwPlJlcmVuZGVyaW5nIGEgY29tcG9uZW50IHdoZW4gZGF0YSB1cGRhdGUgb2NjdXJzPC9wPlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5TdG9yZVNpZ25hbFVwZGF0ZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdGVLZXkgVGhlIGtleSB0byBiZSBzdWJzY3JpYmVkXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhdGlvbiBUaGUgdXJsIHRoYXQgd2lsbCBiZSByZXF1ZXN0ZWRcbi8vICAgICAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259XG4vLyAgICAgICAgICAgICAqIEBwcml2YXRlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpblN0b3JlU2lnbmFsVXBkYXRlOiBmdW5jdGlvbiBfRmx1eE1peGluU3RvcmVTaWduYWxVcGRhdGUoc3RhdGVLZXksIGxvY2F0aW9uKSB7XG4vLyAgICAgICAgICAgICAgIHJldHVybiBSLnNjb3BlKGZ1bmN0aW9uKHZhbCkge1xuLy8gICAgICAgICAgICAgICAgIGlmKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4vLyAgICAgICAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1ZhbCA9IHRoaXMuc3RhdGUgPyB0aGlzLnN0YXRlW3N0YXRlS2V5XSA6IHVuZGVmaW5lZDtcbi8vICAgICAgICAgICAgICAgICBpZihfLmlzRXF1YWwocHJldmlvdXNWYWwsIHZhbCkpIHtcbi8vICAgICAgICAgICAgICAgICAgIHJldHVybjtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5mbHV4U3RvcmVXaWxsVXBkYXRlKHN0YXRlS2V5LCBsb2NhdGlvbiwgdmFsLCBwcmV2aW91c1ZhbCk7XG4vLyAgICAgICAgICAgICAgICAgICAgIC8vQ2FsbCByZWFjdCBBUEkgaW4gb3JkZXIgdG8gUmVyZW5kZXIgY29tcG9uZW50XG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoUi5yZWNvcmQoc3RhdGVLZXksIHZhbCkpO1xuLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZShzdGF0ZUtleSwgbG9jYXRpb24sIHZhbCwgcHJldmlvdXNWYWwpO1xuLy8gICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpbkFkZExpc3RlbmVyXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7Rm9uY3Rpb259IGZuIFRoZSBmblxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gVGhlIGxvY2F0aW9uXG4vLyAgICAgICAgICAgICAqIEBwcml2YXRlXG4vLyAgICAgICAgICAgICAqL1xuLy8gICAgICAgICAgICAgX0ZsdXhNaXhpbkFkZExpc3RlbmVyOiBmdW5jdGlvbiBfRmx1eE1peGluQWRkTGlzdGVuZXIoZm4sIGxvY2F0aW9uKSB7XG4vLyAgICAgICAgICAgICAgIHZhciByID0gYWJzdHJhY3RMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbi8vICAgICAgICAgICAgICAgYXNzZXJ0KHIgIT09IG51bGwsICdSLkZsdXguX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLik6IGluY29ycmVjdCBsb2NhdGlvbiAoJycgKyB0aGlzLmRpc3BsYXlOYW1lICsgJycsICcnICsgbG9jYXRpb24gKyAnJyknKTtcbi8vICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0ge1xuLy8gICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlck5hbWU6IHJbMV0sXG4vLyAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiByWzJdLFxuLy8gICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmlzUGxhaW5PYmplY3QoZW50cnkpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pLmVudHJ5OiBleHBlY3RpbmcgT2JqZWN0LicpO1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhlbnRyeSwgJ2V2ZW50RW1pdHRlck5hbWUnKSAmJiBfLmlzU3RyaW5nKGVudHJ5LmV2ZW50RW1pdHRlck5hbWUpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pLmVudHJ5LmV2ZW50RW1pdHRlck5hbWU6IGV4cGVjdGluZyBTdHJpbmcuJyk7XG4vLyAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKGVudHJ5LCAnZXZlbnROYW1lJykgJiYgXy5pc1N0cmluZyhlbnRyeS5ldmVudE5hbWUpLCAnUi5GbHV4Lk1peGluLl9GbHV4TWl4aW5BZGRMaXN0ZW5lciguLi4pLmVudHJ5LmV2ZW50TmFtZTogZXhwZWN0aW5nIFN0cmluZy4nKTtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMoZW50cnksICdmbicpICYmIF8uaXNGdW5jdGlvbihmbiksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpbkFkZExpc3RlbmVyKC4uLikuZW50cnkuZm46IGV4cGVjdGluZyBGdW5jdGlvbi4nKTtcbi8vICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgICB2YXIgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyKGVudHJ5LmV2ZW50RW1pdHRlck5hbWUpO1xuLy8gICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBldmVudEVtaXR0ZXIuYWRkTGlzdGVuZXIoZW50cnkuZXZlbnROYW1lLCB0aGlzLl9GbHV4TWl4aW5FdmVudEVtaXR0ZXJFbWl0KGVudHJ5LmV2ZW50RW1pdHRlck5hbWUsIGVudHJ5LmV2ZW50TmFtZSwgZW50cnkuZm4pKTtcbi8vICAgICAgICAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2xpc3RlbmVyLnVuaXF1ZUlkXSA9IHtcbi8vICAgICAgICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4vLyAgICAgICAgICAgICAgICAgZm46IGZuLFxuLy8gICAgICAgICAgICAgICAgIGV2ZW50RW1pdHRlck5hbWU6IGVudHJ5LmV2ZW50RW1pdHRlck5hbWUsXG4vLyAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuLy8gICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5FdmVudEVtaXR0ZXJFbWl0XG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudEVtaXR0ZXJOYW1lIFRoZSBldmVudEVtaXR0ZXJOYW1lXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZVxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge0ZvbmN0aW9ufSBmbiBUaGUgZm5cbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluRXZlbnRFbWl0dGVyRW1pdDogZnVuY3Rpb24gX0ZsdXhNaXhpbkV2ZW50RW1pdHRlckVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnROYW1lLCBmbikge1xuLy8gICAgICAgICAgICAgICByZXR1cm4gUi5zY29wZShmdW5jdGlvbihwYXJhbXMpIHtcbi8vICAgICAgICAgICAgICAgICBpZighdGhpcy5pc01vdW50ZWQoKSkge1xuLy8gICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdChldmVudEVtaXR0ZXJOYW1lLCBldmVudE5hbWUsIHBhcmFtcyk7XG4vLyAgICAgICAgICAgICAgICAgZm4ocGFyYW1zKTtcbi8vICAgICAgICAgICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50TmFtZSwgcGFyYW1zKTtcbi8vICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgLyoqXG4vLyAgICAgICAgICAgICAqIEBtZXRob2QgX0ZsdXhNaXhpblVuc3Vic2NyaWJlXG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbnRyeSBUaGUgZW50cnlcbi8vICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHVuaXF1ZUlkIFRoZSB1bmlxdWVJZFxuLy8gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICAgICAgICAgKi9cbi8vICAgICAgICAgICAgIF9GbHV4TWl4aW5VbnN1YnNjcmliZTogZnVuY3Rpb24gX0ZsdXhNaXhpblVuc3Vic2NyaWJlKGVudHJ5LCB1bmlxdWVJZCkge1xuLy8gICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zLCB1bmlxdWVJZCksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblVuc3Vic2NyaWJlKC4uLik6IG5vIHN1Y2ggc3Vic2NyaXB0aW9uLicpO1xuLy8gICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBlbnRyeS5zdWJzY3JpcHRpb247XG4vLyAgICAgICAgICAgICAgIHZhciBzdG9yZU5hbWUgPSBlbnRyeS5zdG9yZU5hbWU7XG4vLyAgICAgICAgICAgICAgIHRoaXMuZ2V0Rmx1eFN0b3JlKHN0b3JlTmFtZSkudW5zdWIoc3Vic2NyaXB0aW9uKTtcbi8vICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbdW5pcXVlSWRdO1xuLy8gICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgIC8qKlxuLy8gICAgICAgICAgICAgKiBAbWV0aG9kIF9GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lclxuLy8gICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW50cnkgVGhlIGVudHJ5XG4vLyAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1bmlxdWVJZCBUaGUgdW5pcXVlSWRcbi8vICAgICAgICAgICAgICogQHByaXZhdGVcbi8vICAgICAgICAgICAgICovXG4vLyAgICAgICAgICAgICBfRmx1eE1peGluUmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uIF9GbHV4TWl4aW5SZW1vdmVMaXN0ZW5lcihlbnRyeSwgdW5pcXVlSWQpIHtcbi8vICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fRmx1eE1peGluTGlzdGVuZXJzLCB1bmlxdWVJZCksICdSLkZsdXguTWl4aW4uX0ZsdXhNaXhpblJlbW92ZUxpc3RlbmVyKC4uLik6IG5vIHN1Y2ggbGlzdGVuZXIuJyk7XG4vLyAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZW50cnkubGlzdGVuZXI7XG4vLyAgICAgICAgICAgICAgIHZhciBldmVudEVtaXR0ZXJOYW1lID0gZW50cnkuZXZlbnRFbWl0dGVyTmFtZTtcbi8vICAgICAgICAgICAgICAgdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbi8vICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1t1bmlxdWVJZF07XG4vLyAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgIH0sXG4vLyAgICAgICAgIH07XG5cbi8vICAgICAgICAgXy5leHRlbmQoRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlLCAvKiogQGxlbmRzIFIuRmx1eC5GbHV4SW5zdGFuY2UucHJvdG90eXBlICove1xuLy8gICAgICAgICAgIF9pc0ZsdXhJbnN0YW5jZV86IHRydWUsXG4vLyAgICAgICAgICAgX3N0b3JlczogbnVsbCxcbi8vICAgICAgICAgICBfZXZlbnRFbWl0dGVyczogbnVsbCxcbi8vICAgICAgICAgICBfZGlzcGF0Y2hlcnM6IG51bGwsXG4vLyAgICAgICAgICAgX3Nob3VsZEluamVjdEZyb21TdG9yZXM6IGZhbHNlLFxuLy8gICAgICAgICAgIGJvb3RzdHJhcEluQ2xpZW50OiBfLm5vb3AsXG4vLyAgICAgICAgICAgYm9vdHN0cmFwSW5TZXJ2ZXI6IF8ubm9vcCxcbi8vICAgICAgICAgICBkZXN0cm95SW5DbGllbnQ6IF8ubm9vcCxcbi8vICAgICAgICAgICBkZXN0cm95SW5TZXJ2ZXI6IF8ubm9vcCxcbi8vICAgICAgICAgICBzaG91bGRJbmplY3RGcm9tU3RvcmVzOiBmdW5jdGlvbiBzaG91bGRJbmplY3RGcm9tU3RvcmVzKCkge1xuLy8gICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXM7XG4vLyAgICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+U2V0cyB0aGUgZmxhZyB0ZWxsaW5nIGFsbCB0aGUgZmx1eC1taXhlZC1pbiBjb21wb25lbnRzIHRvIGF0dGVtcHQgdG8gaW5qZWN0IHByZS1mZXRjaGVkIHZhbHVlcyBmcm9tIHRoZSBjYWNoZS4gVXNlZCBmb3IgcHJlLXJlbmRlcmluZyBtYWdpYy48L3A+XG4vLyAgICAgICAgICogQG1ldGhvZCBzdGFydEluamVjdGluZ0Zyb21TdG9yZXNcbi8vICAgICAgICAgKi9cbi8vICAgICAgICAgc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzOiBmdW5jdGlvbiBzdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydCghdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcywgJ1IuRmx1eC5GbHV4SW5zdGFuY2Uuc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKC4uLik6IHNob3VsZCBub3QgYmUgaW5qZWN0aW5nIGZyb20gU3RvcmVzLicpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gdHJ1ZTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+VW5zZXRzIHRoZSBmbGFnIHRlbGxpbmcgYWxsIHRoZSBmbHV4LW1peGVkLWluIGNvbXBvbmVudHMgdG8gYXR0ZW1wdCB0byBpbmplY3QgcHJlLWZldGNoZWQgdmFsdWVzIGZyb20gdGhlIGNhY2hlLiBVc2VkIGZvciBwcmUtcmVuZGVyaW5nIG1hZ2ljLjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIHN0YXJ0SW5qZWN0aW5nRnJvbVN0b3Jlc1xuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBzdG9wSW5qZWN0aW5nRnJvbVN0b3JlczogZnVuY3Rpb24gc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydCh0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcyguLi4pOiBzaG91bGQgYmUgaW5qZWN0aW5nIGZyb20gU3RvcmVzLicpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIC8qKlxuLy8gICAgICAgICAqIDxwPlNlcmlhbGl6ZSBhIHNlcmlhbGl6ZWQgZmx1eCBieSB0aGUgc2VydmVyIGluIG9yZGVyIHRvIGluaXRpYWxpemUgZmx1eCBpbnRvIGNsaWVudDwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIHNlcmlhbGl6ZVxuLy8gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5nIFRoZSBzZXJpYWxpemVkIHN0cmluZ1xuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uIHNlcmlhbGl6ZSgpIHtcbi8vICAgICAgICAgICByZXR1cm4gUi5CYXNlNjQuZW5jb2RlKEpTT04uc3RyaW5naWZ5KF8ubWFwVmFsdWVzKHRoaXMuX3N0b3JlcywgZnVuY3Rpb24oc3RvcmUpIHtcbi8vICAgICAgICAgICAgIHJldHVybiBzdG9yZS5zZXJpYWxpemUoKTtcbi8vICAgICAgICAgICB9KSkpO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiBVbnNlcmlhbGl6ZSBhIHNlcmlhbGl6ZWQgZmx1eCBieSB0aGUgc2VydmVyIGluIG9yZGVyIHRvIGluaXRpYWxpemUgZmx1eCBpbnRvIGNsaWVudFxuLy8gICAgICAgICAqIEBtZXRob2QgdW5zZXJpYWxpemVcbi8vICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gdW5zZXJpYWxpemVcbi8vICAgICAgICAgKi9cbi8vICAgICAgICAgdW5zZXJpYWxpemU6IGZ1bmN0aW9uIHVuc2VyaWFsaXplKHN0cikge1xuLy8gICAgICAgICAgIF8uZWFjaChKU09OLnBhcnNlKFIuQmFzZTY0LmRlY29kZShzdHIpKSwgUi5zY29wZShmdW5jdGlvbihzZXJpYWxpemVkU3RvcmUsIG5hbWUpIHtcbi8vICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9zdG9yZXMsIG5hbWUpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS51bnNlcmlhbGl6ZSguLi4pOiBubyBzdWNoIFN0b3JlLiAoJyArIG5hbWUgKyAnKScpO1xuLy8gICAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgICAgdGhpcy5fc3RvcmVzW25hbWVdLnVuc2VyaWFsaXplKHNlcmlhbGl6ZWRTdG9yZSk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAvKipcbi8vICAgICAgICAgKiA8cD5HZXR0ZXIgZm9yIHRoZSBzdG9yZTwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIGdldFN0b3JlXG4vLyAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHN0b3JlXG4vLyAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSBzdG9yZSBUaGUgY29ycmVzcG9uZGluZyBzdG9yZVxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBnZXRTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmUobmFtZSkge1xuLy8gICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc3RvcmVzLCBuYW1lKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UuZ2V0U3RvcmUoLi4uKTogbm8gc3VjaCBTdG9yZS4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3Jlc1tuYW1lXTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+UmVnaXN0ZXIgYSBzdG9yZSBkZWZpbmVkIGluIHRoZSBmbHV4IGNsYXNzIG9mIEFwcCA8YnIgLz5cbi8vICAgICAgICAgKiBUeXBpY2FsbHkgOiBNZW1vcnkgb3IgVXBsaW5rPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJTdG9yZVxuLy8gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIHRvIHJlZ2lzdGVyXG4vLyAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHN0b3JlIFRoZSBzdG9yZSB0byByZWdpc3RlclxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICByZWdpc3RlclN0b3JlOiBmdW5jdGlvbiByZWdpc3RlclN0b3JlKG5hbWUsIHN0b3JlKSB7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChzdG9yZS5faXNTdG9yZUluc3RhbmNlXywgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJTdG9yZSguLi4pOiBleHBlY3RpbmcgYSBSLlN0b3JlLlN0b3JlSW5zdGFuY2UuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgICBhc3NlcnQoIV8uaGFzKHRoaXMuX3N0b3JlcywgbmFtZSksICdSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyU3RvcmUoLi4uKTogbmFtZSBhbHJlYWR5IGFzc2lnbmVkLiAoJyArIG5hbWUgKyAnKScpO1xuLy8gICAgICAgICAgIH0sIHRoaXMpKTtcbi8vICAgICAgICAgICB0aGlzLl9zdG9yZXNbbmFtZV0gPSBzdG9yZTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+R2V0dGVyIGZvciB0aGUgZXZlbnQgZW1pdHRlcjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIGdldEV2ZW50RW1pdHRlclxuLy8gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBzdG9yZVxuLy8gICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gZXZlbnRFbWl0dGVyIFRoZSBjb3JyZXNwb25kaW5nIGV2ZW50IGVtaXR0ZXJcbi8vICAgICAgICAgKi9cbi8vICAgICAgICAgZ2V0RXZlbnRFbWl0dGVyOiBmdW5jdGlvbiBnZXRFdmVudEVtaXR0ZXIobmFtZSkge1xuLy8gICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fZXZlbnRFbWl0dGVycywgbmFtZSksICdSLkZsdXguRmx1eEluc3RhbmNlLmdldEV2ZW50RW1pdHRlciguLi4pOiBubyBzdWNoIEV2ZW50RW1pdHRlci4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50RW1pdHRlcnNbbmFtZV07XG4vLyAgICAgICAgIH0sXG5cbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+UmVnaXN0ZXIgYW4gZXZlbnQgZW1pdHRlciBkZWZpbmVkIGluIHRoZSBmbHV4IGNsYXNzIG9mIEFwcDwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyRXZlbnRFbWl0dGVyXG4vLyAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gcmVnaXN0ZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRFbWl0dGVyIFRoZSBldmVudCBlbWl0dGVyIHRvIHJlZ2lzdGVyXG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIHJlZ2lzdGVyRXZlbnRFbWl0dGVyOiBmdW5jdGlvbiByZWdpc3RlckV2ZW50RW1pdHRlcihuYW1lLCBldmVudEVtaXR0ZXIpIHtcbi8vICAgICAgICAgICBhc3NlcnQoUi5pc0NsaWVudCgpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckV2ZW50RW1pdHRlciguLi4pOiBzaG91bGQgbm90IGJlIGNhbGxlZCBpbiB0aGUgc2VydmVyLicpO1xuLy8gICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICAgICBhc3NlcnQoZXZlbnRFbWl0dGVyLl9pc0V2ZW50RW1pdHRlckluc3RhbmNlXywgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJFdmVudEVtaXR0ZXIoLi4uKTogZXhwZWN0aW5nIGEgUi5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVySW5zdGFuY2UuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgICBhc3NlcnQoIV8uaGFzKHRoaXMuX2V2ZW50RW1pdHRlcnMsIG5hbWUpLCAnUi5GbHV4LkZsdXhJbnN0YW5jZS5yZWdpc3RlckV2ZW50RW1pdHRlciguLi4pOiBuYW1lIGFscmVhZHkgYXNzaWduZWQuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbbmFtZV0gPSBldmVudEVtaXR0ZXI7XG4vLyAgICAgICAgIH0sXG5cbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+R2V0dGVyIGZvciB0aGUgZGlzcGF0Y2hlcjwvcD5cbi8vICAgICAgICAgKiBAbWV0aG9kIGdldERpc3BhdGNoZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc3RvcmVcbi8vICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IGRpc3BhdGNoZXIgVGhlIGNvcnJlc3BvbmRpbmcgZGlzcGF0Y2hlclxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICBnZXREaXNwYXRjaGVyOiBmdW5jdGlvbiBnZXREaXNwYXRjaGVyKG5hbWUpIHtcbi8vICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX2Rpc3BhdGNoZXJzLCBuYW1lKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UuZ2V0RGlzcGF0Y2hlciguLi4pOiBubyBzdWNoIERpc3BhdGNoZXIuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgfSwgdGhpcykpO1xuLy8gICAgICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyc1tuYW1lXTtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgLyoqXG4vLyAgICAgICAgICogPHA+UmVnaXN0ZXIgYSBkaXNwYXRjaGVyIGRlZmluZWQgaW4gdGhlIGZsdXggY2xhc3Mgb2YgQXBwPC9wPlxuLy8gICAgICAgICAqIEBtZXRob2QgcmVnaXN0ZXJEaXNwYXRjaGVyXG4vLyAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgdG8gcmVnaXN0ZXJcbi8vICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZGlzcGF0Y2hlciBUaGUgZGlzcGF0Y2hlciB0byByZWdpc3RlclxuLy8gICAgICAgICAqL1xuLy8gICAgICAgICByZWdpc3RlckRpc3BhdGNoZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyRGlzcGF0Y2hlcihuYW1lLCBkaXNwYXRjaGVyKSB7XG4vLyAgICAgICAgICAgYXNzZXJ0KFIuaXNDbGllbnQoKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJEaXNwYXRjaGVyKC4uLik6IHNob3VsZCBub3QgYmUgY2FsbGVkIGluIHRoZSBzZXJ2ZXIuICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIGFzc2VydChkaXNwYXRjaGVyLl9pc0Rpc3BhdGNoZXJJbnN0YW5jZV8sICdSLkZsdXguRmx1eEluc3RhbmNlLnJlZ2lzdGVyRGlzcGF0Y2hlciguLi4pOiBleHBlY3RpbmcgYSBSLkRpc3BhdGNoZXIuRGlzcGF0Y2hlckluc3RhbmNlICgnICsgbmFtZSArICcpJyk7XG4vLyAgICAgICAgICAgICBhc3NlcnQoIV8uaGFzKHRoaXMuX2Rpc3BhdGNoZXJzLCBuYW1lKSwgJ1IuRmx1eC5GbHV4SW5zdGFuY2UucmVnaXN0ZXJEaXNwYXRjaGVyKC4uLik6IG5hbWUgYWxyZWFkeSBhc3NpZ25lZC4gKCcgKyBuYW1lICsgJyknKTtcbi8vICAgICAgICAgICB9LCB0aGlzKSk7XG4vLyAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbbmFtZV0gPSBkaXNwYXRjaGVyO1xuLy8gICAgICAgICB9LFxuXG4vLyAgICAgICAgIC8qKlxuLy8gICAgICAgICAqIDxwPkNsZWFycyB0aGUgc3RvcmUgYnkgY2FsbGluZyBlaXRoZXIgdGhpcy5kZXN0cm95SW5TZXJ2ZXIgb3IgdGhpcy5kZXN0cm95SW5DbGllbnQgYW5kIHJlY3Vyc2l2ZWx5IGFwcGx5aW5nIGRlc3Ryb3kgb24gZWFjaCBzdG9yZS9ldmVudCBlbWl0dHJlL2Rpc3BhdGNoZXIuPGJyIC8+XG4vLyAgICAgICAgICogVXNlZCBmb3IgcHJlLXJlbmRlcmluZyBtYWdpYy48L3A+XG4vLyAgICAgICAgICogQG1ldGhvZCBkZXN0cm95XG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4vLyAgICAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XG4vLyAgICAgICAgICAgICB0aGlzLmRlc3Ryb3lJbkNsaWVudCgpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbi8vICAgICAgICAgICAgIHRoaXMuZGVzdHJveUluU2VydmVyKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIF8uZWFjaCh0aGlzLl9zdG9yZXMsIGZ1bmN0aW9uKHN0b3JlKSB7XG4vLyAgICAgICAgICAgICBzdG9yZS5kZXN0cm95KCk7XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgdGhpcy5fc3RvcmVzID0gbnVsbDtcbi8vICAgICAgICAgICBfLmVhY2godGhpcy5fZXZlbnRFbWl0dGVycywgZnVuY3Rpb24oZXZlbnRFbWl0dGVyKSB7XG4vLyAgICAgICAgICAgICBldmVudEVtaXR0ZXIuZGVzdHJveSgpO1xuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSBudWxsO1xuLy8gICAgICAgICAgIF8uZWFjaCh0aGlzLl9kaXNwYXRjaGVycywgZnVuY3Rpb24oZGlzcGF0Y2hlcikge1xuLy8gICAgICAgICAgICAgZGlzcGF0Y2hlci5kZXN0cm95KCk7XG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnMgPSBudWxsO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgfSk7XG5cbi8vIHJldHVybiBGbHV4O1xuLy8gfTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==