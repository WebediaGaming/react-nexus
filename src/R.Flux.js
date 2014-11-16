module.exports = function(R) {
  const _ = R._;
  const React = R.React;

  const fluxLocationRegExp = /^(.*):\/(.*)$/;

  class Flux {
    constructor({ headers, guid, window, req }) {
      _.dev(() => headers.should.be.an.Object &&
        guid.should.be.a.String &&
        _.isServer() ? req.should.be.an.Object : window.should.be.an.Object
      );
      this.headers = headers;
      this.guid = guid;
      this.window = window;
      this.req = req;
      this.stores = {};
      this.eventEmitters = {};
      this.dispatchers = {};
      this._shouldInjectFromStores = false;
    }

    *bootstrap() { _.abstract(); } // jshint ignore:line

    destroy() {
      Object.keys(this.stores).forEach((storeName) => this.unregisterStore(storeName));
      Object.keys(this.eventEmitters).forEach((eventEmitterName) => this.unregisterEventEmitter(eventEmitterName));
      Object.keys(this.dispatchers).forEach((dispatcherName) => this.unregisterDispatcher(dispatcherName));
      // Nullify references
      this.headers = null;
      this.window = null;
      this.req = null;
      this.stores = null;
      this.eventEmitters = null;
      this.dispatchers = null;
      return this;
    }

    _startInjectingFromStores() {
      _.dev(() => this._shouldInjectFromStores.should.not.be.ok);
      this._shouldInjectFromStores = true;
      return this;
    }

    _stopInjectingFromStores() {
      _.dev(() => this._shouldInjectFromStores.should.be.ok);
      this._shouldInjectFromStores = false;
      return this;
    }

    injectingFromStores(fn) {
      this._startInjectingFromStores();
      let r = fn();
      this._stopInjectingFromStores();
      return r;
    }

    shouldInjectFromStores() {
      return this._shouldInjectFromStores;
    }

    serialize({ preventEncoding }) {
      let serializable = _.mapValues(this.stores, (store) => store.serialize({ preventEncoding: true }));
      return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
    }

    unserialize(serialized, { preventDecoding }) {
      let unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
      Object.keys(unserializable).forEach((storeName) => {
        _.dev(() => this.stores[storeName].should.be.ok);
        this.stores[storeName].unserialize(unserializable[storeName], { preventDecoding: true });
      });
      return this;
    }

    registerStore(storeName, store) {
      _.dev(() => store.should.be.an.instanceOf(R.Store) &&
        storeName.should.be.a.String() &&
        this.stores[storeName].should.not.be.ok
      );
      this.stores[storeName] = store;
      return this;
    }

    unregisterStore(storeName) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores[storeName].should.be.an.instanceOf(R.Store)
      );
      delete this.stores[storeName];
      return this;
    }

    getStore(storeName) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores[storeName].should.be.an.instanceOf(R.Store)
      );
      return this.stores[storeName];
    }

    registerEventEmitter(eventEmitterName, eventEmitter) {
      _.dev(() => eventEmitter.should.be.an.instanceOf(R.EventEmitter) &&
        eventEmitterName.should.be.a.String &&
        this.eventEmitters[eventEmitterName].should.not.be.ok
      );
      this.eventEmitters[eventEmitterName] = eventEmitter;
      return this;
    }

    unregisterEventEmitter(eventEmitterName) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter)
      );
      delete this.eventEmitters[eventEmitterName];
      return this;
    }

    getEventEmitter(eventEmitterName) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter)
      );
      return this.eventEmitters[eventEmitterName];
    }

    registerDispatcher(dispatcherName, dispatcher) {
      _.dev(() => dispatcher.should.be.an.instanceOf(R.Dispatcher) &&
        dispatcherName.should.be.a.String &&
        this.dispatchers[dispatcherName].should.not.be.ok
      );
      this.dispatchers[dispatcherName] = dispatcher;
      return this;
    }

    unregisterDispatcher(dispatcherName) {
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher)
      );
      delete this.dispatchers[dispatcherName];
      return this;
    }

    getDispatcher(dispatcherName) {
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher)
      );
      return this.dispatchers[dispatcherName];
    }

    subscribeTo(storeName, path, handler) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores[storeName].should.be.an.instanceOf(R.Store) &&
        path.should.be.a.String &&
        handler.should.be.a.Function
      );
      let store = this.getStore(storeName);
      let subscription = store.subscribeTo(path, handler);
      return subscription;
    }

    unsubscribeFrom(storeName, subscription) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores[storeName].should.be.an.instanceOf(R.Store) &&
        subscription.should.be.an.instanceOf(R.Store.Subscription)
      );
      let store = this.getStore(storeName);
      return store.unsubscribeFrom(subscription);
    }

    listenTo(eventEmitterName, room, handler) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) &&
        room.should.be.a.String &&
        handler.should.be.a.Function
      );
      let eventEmitter = this.getEventEmitter(eventEmitterName);
      let listener = eventEmitter.listenTo(room, handler);
      return listener;
    }

    unlistenFrom(eventEmitterName, listener) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) &&
        listener.should.be.an.instanceOf(R.EventEmitter.Listener)
      );
      let eventEmitter = this.getEventEmitter(eventEmitterName);
      return eventEmitter.unlistenFrom(listener);
    }

    dispatch(dispatcherName, action, params) {
      params = params || {};
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher) &&
        action.should.be.a.String &&
        params.should.be.an.Object
      );
      let dispatcher = this.getDispatcher(dispatcherName);
      return dispatcher.dispatch(action, params);
    }
  }

  _.extend(Flux.prototype, {
    headers: null,
    guid: null,
    window: null,
    req: null,
    stores: null,
    eventEmitters: null,
    dispatchers: null,
    _shouldInjectFromStores: null,
  });

  const FluxMixinStatics = {
    parseFluxLocation(location) {
      _.dev(() => location.should.be.a.String);
      let r = fluxLocationRegExp.exec(location);
      _.dev(() => (r !== null).should.be.ok);
      return { name: r[0], key: r[1] };
    },

    _getInitialStateFromFluxStores() {
      _.dev(() => this._FluxMixin.should.be.ok);
      let flux = this.getFlux();
      let subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions)
        .map((location) => {
          let stateKey = subscriptions[location];
          let { name, key } = FluxMixinStatics.parseFluxLocation(location);
          let [storeName, path] = [name, key];
          let store = flux.getStore(storeName);
          _.dev(() => store.hasCachedValue(path).should.be.ok);
          let value = store.getCachedValue(path);
          return [stateKey, value];
        })
      );
    },

    _getInitialStateWillNullValues() {
      _.dev(() => this._FluxMixin.should.be.ok);
      let subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions)
        .map((location) => {
          let stateKey = subscriptions[location];
          return [stateKey, null];
        })
      );
    },

    _updateFlux(props) {
      props = props || {};
      _.dev(() => this._FluxMixin.should.be.ok &&
        props.should.be.an.Object
      );
      let currentSubscriptions = Object.keys(this._FluxMixinSubscriptions)
      .map((key) => this._FluxMixinSubscriptions[key]);
      let currentListeners = Object.keys(this._FluxMixinListeners)
      .map((key) => this._FluxMixinListeners[key]);

      let nextSubscriptions = this.getFluxStoreSubscriptions(props);
      let nextListeners = this.getFluxEventEmittersListeners(props);

      Object.keys(nextSubscriptions)
      .forEach((location) => {
        let stateKey = nextSubscriptions[location];
        let { name, key } = FluxMixinStatics.parseFluxLocation(location);
        let [storeName, path] = [name, key];
        FluxMixinStatics._subscribeTo(storeName, path, stateKey);
      });

      Object.keys(nextListeners)
      .forEach((location) => {
        let handler = nextListeners[location];
        let { name, key } = FluxMixinStatics.parseFluxLocation(location);
        let [eventEmitterName, room] = [name, key];
        FluxMixinStatics._listenTo(eventEmitterName, room, handler);
      });

      currentSubscriptions.forEach((subscription) => this._unsubscribeFrom(subscription));
      currentListeners.forEach((listener) => this._unlistenFrom(listener));
    },

    _clearFlux() {
      _.dev(() => this._FluxMixin.should.be.ok);
      Object.keys(this._FluxMixinSubscriptions)
      .forEach((key) => this._unsubscribeFrom(this._FluxMixinSubscriptions[key]));
      Object.keys(this._FluxMixinListeners)
      .forEach((key) => this._unlistenFrom(this._FluxMixinListeners[key]));
    },

    _propagateStoreUpdate(storeName, path, value, stateKey) {
      _.dev(() => stateKey.should.be.a.String &&
        value.should.be.an.Object
      );
      return R.Async.ifMounted(() => {
        _.dev(() => this._FluxMixin.should.be.ok);
        this.fluxStoreWillUpdate(storeName, path, value, stateKey);
        this.setState({ [stateKey]: value });
        this.fluxStoreDidUpdate(storeName, path, value, stateKey);
      })
      .call(this);
    },

    _subscribeTo(storeName, path, stateKey) {
      _.dev(() => storeName.should.be.a.String &&
        path.should.be.a.String &&
        stateKey.should.be.a.String &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinSubscriptions.should.be.an.Object
      );
      let flux = this.getFlux();
      let propagateUpdate = (value) => FluxMixinStatics._propagateStoreUpdate(storeName, path, value, stateKey);
      let subscription = flux.subscribeTo(storeName, path, propagateUpdate);
      let id = _.uniqueId(stateKey);
      this._FluxMixinSubscriptions[id] = { subscription, id, storeName };
      return this;
    },

    _unsubscribeFrom({ subscription, id, storeName }) {
      _.dev(() => subscription.should.be.an.instanceOf(R.Store.Subscription) &&
        id.should.be.a.String &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinSubscriptions[id].should.be.exactly(subscription)
      );
      let flux = this.getFlux();
      flux.unsubscribeFrom(storeName, subscription);
      delete this._FluxMixinSubscriptions[id];
      return this;
    },

    _propagateEvent(eventEmitterName, room, params, handler) {
      _.dev(() => handler.should.be.a.Function &&
        params.should.be.an.Object
      );

      return R.Async.ifMounted(() => {
        _.dev(() => this._FluxMixin.should.be.ok);
        this.fluxEventEmitterWillEmit(eventEmitterName, room, params, handler);
        handler.call(null, params);
        this.fluxEventEmitterDidEmit(eventEmitterName, room, params, handler);
      })
      .call(this);
    },

    _listenTo(eventEmitterName, room, handler) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        room.should.be.a.String &&
        handler.should.be.a.Function &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinListeners.should.be.an.Object
      );
      let flux = this.getFlux();
      let propagateEvent = (params) => FluxMixinStatics._propagateEvent(eventEmitterName, room, params, handler);
      let listener = flux.listenTo(eventEmitterName, room, propagateEvent);
      let id = _.uniqueId(room);
      this._FluxMixinListeners[id] = { listener, id, eventEmitterName };
      return this;
    },

    _unlistenFrom({ listener, id, eventEmitterName }) {
      _.dev(() => listener.should.be.an.instanceOf(R.EventEmitter.Listener) &&
        id.should.be.a.String &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinListeners[id].should.be.exactly(listener)
      );
      let flux = this.getFlux();
      flux.unlistenFrom(eventEmitterName, listener);
      delete this._FluxMixinListeners[id];
      return this;
    },

    defaultImplementations: {
      getFluxStoreSubscriptions(props) { return {}; }, // jshint ignore:line
      getFluxEventEmittersListeners(props) { return {}; }, // jshint ignore:line
      fluxStoreWillUpdate(storeName, path, value, stateKey) { return void 0; }, // jshint ignore:line
      fluxStoreDidUpdate(storeName, path, value, stateKey) { return void 0; }, // jshint ignore:line
      fluxEventEmitterWillEmit(eventEmitterName, room, params, handler) { return void 0; }, // jshint ignore:line
      fluxEventEmitterDidEmit(eventEmitterName, room, params, handler) { return void 0; }, // jshint ignore:line
    },
  };

  Flux.Mixin = {
    _FluxMixin: true,
    _FluxMixinSubscriptions: null,
    _FluxMixinListeners: null,

    statics: { FluxMixinStatics },

    getInitialState() {
      if(this.getFlux().shouldInjectFromStores()) {
        return FluxMixinStatics._getInitialStateFromFluxStores.call(this);
      }
      else {
        return FluxMixinStatics._getInitialStateWillNullValues.call(this);
      }
    },

    componentWillMount() {
      _.dev(() => this.getFlux.should.be.a.Function &&
        this.getFlux().should.be.an.instanceOf(R.Flux) &&
        this._AsyncMixin.should.be.ok
      );
      this._FluxMixinListeners = {};
      this._FluxMixinSubscriptions = {};
      Object.keys(FluxMixinStatics.defaultImplementations)
      .forEach((methodName) => this[methodName] = this[methodName] || FluxMixinStatics.defaultImplementations[methodName].bind(this));
    },

    componentDidMount() {
      FluxMixinStatics._updateFlux.call(this, this.props);
    },

    componentWillReceiveProps(props) {
      FluxMixinStatics._updateFlux.call(this, props);
    },

    componentWillUnmount() {
      FluxMixinStatics._clearFlux.call(this);
    },

    prefetchFluxStores() {
      return _.copromise(function*() {
        let props = this.props;
        let subscriptions = this.getFluxStoreSubscriptions(props);
        let context = this.context;
        let state = _.extend({}, this.state || {});
        let flux = this.getFlux();
        yield Object.keys(subscriptions)
        .map((stateKey) => _.copromise(function*() {
          let location = subscriptions[stateKey];
          let { name, key } = FluxMixinStatics.parseFluxLocation(location);
          let [storeName, path] = [name, key];
          state[stateKey] = yield flux.getStore(storeName).pull(path);
        }, this));

        // Create a new component, surrogate for this one, but this time inject from the prefetched stores.
        let surrogateComponent;
        flux.injectingFromStores(() => {
          surrogateComponent = new this.__ReactNexusSurrogate({ context, props, state });
          surrogateComponent.componentWillMount();
        });

        let renderedComponent = surrogateComponent.render();
        let childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : context;
        surrogateComponent.componentWillUnmount();

        yield React.Children.mapTree(renderedComponent, (childComponent) => _.copromise(function*() {
          if(!_.isObject(childComponent)) {
            return;
          }
          let childType = childComponent.type;
          if(!_.isObject(childType) || !childType.__ReactNexusSurrogate) {
            return;
          }
          // Create a new component, surrogate for this child (without injecting from the prefetched stores).
          let surrogateChildComponent = new childType.__ReactNexusSurrogate({ context: childContext, props: childComponent.props });
          if(!surrogateChildComponent.componentWillMount) {
            _.dev(() => { throw new Error(`Component ${surrogateChildComponent.displayName} doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?`); });
          }
          surrogateChildComponent.componentWillMount();
          yield surrogateChildComponent.prefetchFluxStores();
          surrogateChildComponent.componentWillUnmount();
        }, this));
      }, this);
    },

    dispatch(location, params) {
      let { name, key } = FluxMixinStatics.parseFluxLocation(location);
      let [dispatcherName, action] = [name, key];
      let flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    },

  };

  Flux.PropType = function(props) {
    return props.flux && props.flux instanceof Flux;
  };

  return Flux;
};
