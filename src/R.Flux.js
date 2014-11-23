module.exports = function(R) {
  const _ = R._;
  const React = R.React;

  const fluxLocationRegExp = /^(.*):\/(.*)$/;

  class Flux {
    constructor({ headers, guid, window, req }) {
      _.dev(() => headers.should.be.an.Object &&
        guid.should.be.a.String &&
        (__NODE__) ? req.should.be.an.Object : window.should.be.an.Object
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
      const r = fn();
      this._stopInjectingFromStores();
      return r;
    }

    shouldInjectFromStores() {
      return this._shouldInjectFromStores;
    }

    serialize(p = {}) {
      const preventEncoding = !!p.preventEncoding;
      const serializable = _.mapValues(this.stores, (store) => store.serialize({ preventEncoding: true }));
      return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
    }

    unserialize(serialized, p = {}) {
      const preventDecoding = !!p.preventDecoding;
      const unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
      Object.keys(unserializable).forEach((storeName) => {
        _.dev(() => this.stores.should.have.property(storeName));
        this.stores[storeName].unserialize(unserializable[storeName], { preventDecoding: true });
      });
      return this;
    }

    registerStore(storeName, store) {
      _.dev(() => store.should.be.an.instanceOf(R.Store) &&
        storeName.should.be.a.String &&
        this.stores.should.not.have.property(storeName)
      );
      this.stores[storeName] = store;
      return this;
    }

    unregisterStore(storeName) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores.should.have.property(storeName) &&
        this.stores[storeName].should.be.an.instanceOf(R.Store)
      );
      delete this.stores[storeName];
      return this;
    }

    getStore(storeName) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores.should.have.property(storeName) &&
        this.stores[storeName].should.be.an.instanceOf(R.Store)
      );
      return this.stores[storeName];
    }

    registerEventEmitter(eventEmitterName, eventEmitter) {
      _.dev(() => eventEmitter.should.be.an.instanceOf(R.EventEmitter) &&
        eventEmitterName.should.be.a.String &&
        this.eventEmitters.should.not.have.property(eventEmitterName)
      );
      this.eventEmitters[eventEmitterName] = eventEmitter;
      return this;
    }

    unregisterEventEmitter(eventEmitterName) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters.should.have.property(eventEmitterName) &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter)
      );
      delete this.eventEmitters[eventEmitterName];
      return this;
    }

    getEventEmitter(eventEmitterName) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters.should.have.property(eventEmitterName) &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter)
      );
      return this.eventEmitters[eventEmitterName];
    }

    registerDispatcher(dispatcherName, dispatcher) {
      _.dev(() => dispatcher.should.be.an.instanceOf(R.Dispatcher) &&
        dispatcherName.should.be.a.String &&
        this.dispatchers.should.not.have.property(dispatcherName)
      );
      this.dispatchers[dispatcherName] = dispatcher;
      return this;
    }

    unregisterDispatcher(dispatcherName) {
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers.should.have.property(dispatcherName) &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher)
      );
      delete this.dispatchers[dispatcherName];
      return this;
    }

    getDispatcher(dispatcherName) {
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers.should.have.property(dispatcherName) &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher)
      );
      return this.dispatchers[dispatcherName];
    }

    subscribeTo(storeName, path, handler) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores.should.have.property(storeName) &&
        this.stores[storeName].should.be.an.instanceOf(R.Store) &&
        path.should.be.a.String &&
        handler.should.be.a.Function
      );
      const store = this.getStore(storeName);
      const subscription = store.subscribeTo(path, handler);
      return subscription;
    }

    unsubscribeFrom(storeName, subscription) {
      _.dev(() => storeName.should.be.a.String &&
        this.stores.should.have.property(storeName) &&
        this.stores[storeName].should.be.an.instanceOf(R.Store) &&
        subscription.should.be.an.instanceOf(R.Store.Subscription)
      );
      const store = this.getStore(storeName);
      return store.unsubscribeFrom(subscription);
    }

    listenTo(eventEmitterName, room, handler) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters.should.have.property(eventEmitterName) &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) &&
        room.should.be.a.String &&
        handler.should.be.a.Function
      );
      const eventEmitter = this.getEventEmitter(eventEmitterName);
      const listener = eventEmitter.listenTo(room, handler);
      return listener;
    }

    unlistenFrom(eventEmitterName, listener) {
      _.dev(() => eventEmitterName.should.be.a.String &&
        this.eventEmitters.should.have.property(eventEmitterName) &&
        this.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) &&
        listener.should.be.an.instanceOf(R.EventEmitter.Listener)
      );
      const eventEmitter = this.getEventEmitter(eventEmitterName);
      return eventEmitter.unlistenFrom(listener);
    }

    dispatch(dispatcherName, action, params) {
      params = params || {};
      _.dev(() => dispatcherName.should.be.a.String &&
        this.dispatchers.should.have.property(dispatcherName) &&
        this.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher) &&
        action.should.be.a.String &&
        params.should.be.an.Object
      );
      const dispatcher = this.getDispatcher(dispatcherName);
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
      const r = fluxLocationRegExp.exec(location);
      _.dev(() => (r !== null).should.be.ok);
      return { name: r[0], key: r[1] };
    },

    _getInitialStateFromFluxStores() {
      _.dev(() => this._FluxMixin.should.be.ok);
      const flux = this.getFlux();
      const subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions)
        .map((location) => {
          const stateKey = subscriptions[location];
          const { name, key } = FluxMixinStatics.parseFluxLocation(location);
          const [storeName, path] = [name, key];
          const store = flux.getStore(storeName);
          _.dev(() => store.hasCachedValue(path).should.be.ok);
          const value = store.getCachedValue(path);
          return [stateKey, value];
        })
      );
    },

    _getInitialStateWillNullValues() {
      _.dev(() => this._FluxMixin.should.be.ok);
      const subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions)
        .map((location) => {
          const stateKey = subscriptions[location];
          return [stateKey, null];
        })
      );
    },

    _updateFlux(props) {
      props = props || {};
      _.dev(() => this._FluxMixin.should.be.ok &&
        props.should.be.an.Object
      );
      const currentSubscriptions = Object.keys(this._FluxMixinSubscriptions)
      .map((key) => this._FluxMixinSubscriptions[key]);
      const currentListeners = Object.keys(this._FluxMixinListeners)
      .map((key) => this._FluxMixinListeners[key]);

      const nextSubscriptions = this.getFluxStoreSubscriptions(props);
      const nextListeners = this.getFluxEventEmittersListeners(props);

      Object.keys(nextSubscriptions)
      .forEach((location) => {
        const stateKey = nextSubscriptions[location];
        const { name, key } = FluxMixinStatics.parseFluxLocation(location);
        const [storeName, path] = [name, key];
        FluxMixinStatics._subscribeTo(storeName, path, stateKey);
      });

      Object.keys(nextListeners)
      .forEach((location) => {
        const handler = nextListeners[location];
        const { name, key } = FluxMixinStatics.parseFluxLocation(location);
        const [eventEmitterName, room] = [name, key];
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
      const flux = this.getFlux();
      const propagateUpdate = (value) => FluxMixinStatics._propagateStoreUpdate(storeName, path, value, stateKey);
      const subscription = flux.subscribeTo(storeName, path, propagateUpdate);
      const id = _.uniqueId(stateKey);
      this._FluxMixinSubscriptions[id] = { subscription, id, storeName };
      return this;
    },

    _unsubscribeFrom({ subscription, id, storeName }) {
      _.dev(() => subscription.should.be.an.instanceOf(R.Store.Subscription) &&
        id.should.be.a.String &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinSubscriptions[id].should.be.exactly(subscription)
      );
      const flux = this.getFlux();
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
      const flux = this.getFlux();
      const propagateEvent = (params) => FluxMixinStatics._propagateEvent(eventEmitterName, room, params, handler);
      const listener = flux.listenTo(eventEmitterName, room, propagateEvent);
      const id = _.uniqueId(room);
      this._FluxMixinListeners[id] = { listener, id, eventEmitterName };
      return this;
    },

    _unlistenFrom({ listener, id, eventEmitterName }) {
      _.dev(() => listener.should.be.an.instanceOf(R.EventEmitter.Listener) &&
        id.should.be.a.String &&
        this._FluxMixin.should.be.ok &&
        this._FluxMixinListeners[id].should.be.exactly(listener)
      );
      const flux = this.getFlux();
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

    *prefetchFluxStores() {
      const props = this.props;
      const subscriptions = this.getFluxStoreSubscriptions(props);
      const context = this.context;
      const state = _.extend({}, this.state || {});
      const flux = this.getFlux();
      yield Object.keys(subscriptions)
      .map((stateKey) => _.co(_.scope(function*() {
        const location = subscriptions[stateKey];
        const { name, key } = FluxMixinStatics.parseFluxLocation(location);
        const [storeName, path] = [name, key];
        state[stateKey] = yield flux.getStore(storeName).pull(path);
      }, this)));

      // Create a new component, surrogate for this one, but this time inject from the prefetched stores.
      let surrogateComponent;
      flux.injectingFromStores(() => {
        surrogateComponent = new this.__ReactNexusSurrogate({ context, props, state });
        surrogateComponent.componentWillMount();
      });

      const renderedComponent = surrogateComponent.render();
      const childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : context;
      surrogateComponent.componentWillUnmount();

      yield React.Children.mapTree(renderedComponent, (childComponent) => _.co.wrap(this._prefetchChildComponent).call(this, childComponent, childContext));
    },

    *_prefetchChildComponent(component, context) {
      if(!_.isObject(component)) {
        return;
      }
      const { type, props } = component;
      if(!_.isObject(type) || !type.__ReactNexusSurrogate) {
        return;
      }
      // Create a new component, surrogate for this child (without injecting from the prefetched stores).
      const surrogateComponent = new type.__ReactNexusSurrogate({ context, props, state: {} });
      if(!surrogateComponent.componentWillMount) {
        _.dev(() => { throw new Error(`Component ${surrogateComponent.displayName} doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?`); });
      }
      surrogateComponent.componentWillMount();
      yield surrogateComponent.prefetchFluxStores();
      surrogateComponent.componentWillUnmount();
    },

    dispatch(location, params) {
      const { name, key } = FluxMixinStatics.parseFluxLocation(location);
      const [dispatcherName, action] = [name, key];
      const flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    },

  };

  Flux.PropType = function(props) {
    return props.flux && props.flux instanceof Flux;
  };

  return Flux;
};
