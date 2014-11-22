"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var fluxLocationRegExp = /^(.*):\/(.*)$/;

  var Flux = (function () {
    var Flux = function Flux(_ref2) {
      var headers = _ref2.headers;
      var guid = _ref2.guid;
      var window = _ref2.window;
      var req = _ref2.req;

      _.dev(function () {
        return headers.should.be.an.Object && guid.should.be.a.String && _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.headers = headers;
      this.guid = guid;
      this.window = window;
      this.req = req;
      this.stores = {};
      this.eventEmitters = {};
      this.dispatchers = {};
      this._shouldInjectFromStores = false;
    };

    _classProps(Flux, null, {
      bootstrap: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$0() {
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0: _.abstract();
              case 1:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })
      },
      destroy: {
        writable: true,
        value: function () {
          var _this = this;

          Object.keys(this.stores).forEach(function (storeName) {
            return _this.unregisterStore(storeName);
          });
          Object.keys(this.eventEmitters).forEach(function (eventEmitterName) {
            return _this.unregisterEventEmitter(eventEmitterName);
          });
          Object.keys(this.dispatchers).forEach(function (dispatcherName) {
            return _this.unregisterDispatcher(dispatcherName);
          });
          // Nullify references
          this.headers = null;
          this.window = null;
          this.req = null;
          this.stores = null;
          this.eventEmitters = null;
          this.dispatchers = null;
          return this;
        }
      },
      _startInjectingFromStores: {
        writable: true,
        value: function () {
          var _this2 = this;

          _.dev(function () {
            return _this2._shouldInjectFromStores.should.not.be.ok;
          });
          this._shouldInjectFromStores = true;
          return this;
        }
      },
      _stopInjectingFromStores: {
        writable: true,
        value: function () {
          var _this3 = this;

          _.dev(function () {
            return _this3._shouldInjectFromStores.should.be.ok;
          });
          this._shouldInjectFromStores = false;
          return this;
        }
      },
      injectingFromStores: {
        writable: true,
        value: function (fn) {
          this._startInjectingFromStores();
          var r = fn();
          this._stopInjectingFromStores();
          return r;
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
        value: function (_ref3) {
          var preventEncoding = _ref3.preventEncoding;

          var serializable = _.mapValues(this.stores, function (store) {
            return store.serialize({ preventEncoding: true });
          });
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, _ref4) {
          var _this4 = this;
          var preventDecoding = _ref4.preventDecoding;

          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          Object.keys(unserializable).forEach(function (storeName) {
            _.dev(function () {
              return _this4.stores.should.have.property(storeName);
            });
            _this4.stores[storeName].unserialize(unserializable[storeName], { preventDecoding: true });
          });
          return this;
        }
      },
      registerStore: {
        writable: true,
        value: function (storeName, store) {
          var _this5 = this;

          _.dev(function () {
            return store.should.be.an.instanceOf(R.Store) && storeName.should.be.a.String && _this5.stores.should.not.have.property(storeName);
          });
          this.stores[storeName] = store;
          return this;
        }
      },
      unregisterStore: {
        writable: true,
        value: function (storeName) {
          var _this6 = this;

          _.dev(function () {
            return storeName.should.be.a.String && _this6.stores.should.have.property(storeName) && _this6.stores[storeName].should.be.an.instanceOf(R.Store);
          });
          delete this.stores[storeName];
          return this;
        }
      },
      getStore: {
        writable: true,
        value: function (storeName) {
          var _this7 = this;

          _.dev(function () {
            return storeName.should.be.a.String && _this7.stores.should.have.property(storeName) && _this7.stores[storeName].should.be.an.instanceOf(R.Store);
          });
          return this.stores[storeName];
        }
      },
      registerEventEmitter: {
        writable: true,
        value: function (eventEmitterName, eventEmitter) {
          var _this8 = this;

          _.dev(function () {
            return eventEmitter.should.be.an.instanceOf(R.EventEmitter) && eventEmitterName.should.be.a.String && _this8.eventEmitters.should.not.have.property(eventEmitterName);
          });
          this.eventEmitters[eventEmitterName] = eventEmitter;
          return this;
        }
      },
      unregisterEventEmitter: {
        writable: true,
        value: function (eventEmitterName) {
          var _this9 = this;

          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this9.eventEmitters.should.have.property(eventEmitterName) && _this9.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
          });
          delete this.eventEmitters[eventEmitterName];
          return this;
        }
      },
      getEventEmitter: {
        writable: true,
        value: function (eventEmitterName) {
          var _this10 = this;

          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this10.eventEmitters.should.have.property(eventEmitterName) && _this10.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
          });
          return this.eventEmitters[eventEmitterName];
        }
      },
      registerDispatcher: {
        writable: true,
        value: function (dispatcherName, dispatcher) {
          var _this11 = this;

          _.dev(function () {
            return dispatcher.should.be.an.instanceOf(R.Dispatcher) && dispatcherName.should.be.a.String && _this11.dispatchers.should.not.have.property(dispatcherName);
          });
          this.dispatchers[dispatcherName] = dispatcher;
          return this;
        }
      },
      unregisterDispatcher: {
        writable: true,
        value: function (dispatcherName) {
          var _this12 = this;

          _.dev(function () {
            return dispatcherName.should.be.a.String && _this12.dispatchers.should.have.property(dispatcherName) && _this12.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
          });
          delete this.dispatchers[dispatcherName];
          return this;
        }
      },
      getDispatcher: {
        writable: true,
        value: function (dispatcherName) {
          var _this13 = this;

          _.dev(function () {
            return dispatcherName.should.be.a.String && _this13.dispatchers.should.have.property(dispatcherName) && _this13.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
          });
          return this.dispatchers[dispatcherName];
        }
      },
      subscribeTo: {
        writable: true,
        value: function (storeName, path, handler) {
          var _this14 = this;

          _.dev(function () {
            return storeName.should.be.a.String && _this14.stores.should.have.property(storeName) && _this14.stores[storeName].should.be.an.instanceOf(R.Store) && path.should.be.a.String && handler.should.be.a.Function;
          });
          var store = this.getStore(storeName);
          var subscription = store.subscribeTo(path, handler);
          return subscription;
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (storeName, subscription) {
          var _this15 = this;

          _.dev(function () {
            return storeName.should.be.a.String && _this15.stores.should.have.property(storeName) && _this15.stores[storeName].should.be.an.instanceOf(R.Store) && subscription.should.be.an.instanceOf(R.Store.Subscription);
          });
          var store = this.getStore(storeName);
          return store.unsubscribeFrom(subscription);
        }
      },
      listenTo: {
        writable: true,
        value: function (eventEmitterName, room, handler) {
          var _this16 = this;

          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this16.eventEmitters.should.have.property(eventEmitterName) && _this16.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && room.should.be.a.String && handler.should.be.a.Function;
          });
          var eventEmitter = this.getEventEmitter(eventEmitterName);
          var listener = eventEmitter.listenTo(room, handler);
          return listener;
        }
      },
      unlistenFrom: {
        writable: true,
        value: function (eventEmitterName, listener) {
          var _this17 = this;

          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this17.eventEmitters.should.have.property(eventEmitterName) && _this17.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && listener.should.be.an.instanceOf(R.EventEmitter.Listener);
          });
          var eventEmitter = this.getEventEmitter(eventEmitterName);
          return eventEmitter.unlistenFrom(listener);
        }
      },
      dispatch: {
        writable: true,
        value: function (dispatcherName, action, params) {
          var _this18 = this;

          params = params || {};
          _.dev(function () {
            return dispatcherName.should.be.a.String && _this18.dispatchers.should.have.property(dispatcherName) && _this18.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher) && action.should.be.a.String && params.should.be.an.Object;
          });
          var dispatcher = this.getDispatcher(dispatcherName);
          return dispatcher.dispatch(action, params);
        }
      }
    });

    return Flux;
  })();

  _.extend(Flux.prototype, {
    headers: null,
    guid: null,
    window: null,
    req: null,
    stores: null,
    eventEmitters: null,
    dispatchers: null,
    _shouldInjectFromStores: null });

  var FluxMixinStatics = {
    parseFluxLocation: function (location) {
      _.dev(function () {
        return location.should.be.a.String;
      });
      var r = fluxLocationRegExp.exec(location);
      _.dev(function () {
        return (r !== null).should.be.ok;
      });
      return { name: r[0], key: r[1] };
    },

    _getInitialStateFromFluxStores: function () {
      var _this19 = this;

      _.dev(function () {
        return _this19._FluxMixin.should.be.ok;
      });
      var flux = this.getFlux();
      var subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions).map(function (location) {
        var stateKey = subscriptions[location];
        var _ref5 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref5.name;
        var key = _ref5.key;
        var _ref6 = [name, key];
        var storeName = _ref6[0];
        var path = _ref6[1];

        var store = flux.getStore(storeName);
        _.dev(function () {
          return store.hasCachedValue(path).should.be.ok;
        });
        var value = store.getCachedValue(path);
        return [stateKey, value];
      }));
    },

    _getInitialStateWillNullValues: function () {
      var _this20 = this;

      _.dev(function () {
        return _this20._FluxMixin.should.be.ok;
      });
      var subscriptions = this.getFluxStoreSubscriptions(this.props);
      return _.object(Object.keys(subscriptions).map(function (location) {
        var stateKey = subscriptions[location];
        return [stateKey, null];
      }));
    },

    _updateFlux: function (props) {
      var _this21 = this;

      props = props || {};
      _.dev(function () {
        return _this21._FluxMixin.should.be.ok && props.should.be.an.Object;
      });
      var currentSubscriptions = Object.keys(this._FluxMixinSubscriptions).map(function (key) {
        return _this21._FluxMixinSubscriptions[key];
      });
      var currentListeners = Object.keys(this._FluxMixinListeners).map(function (key) {
        return _this21._FluxMixinListeners[key];
      });

      var nextSubscriptions = this.getFluxStoreSubscriptions(props);
      var nextListeners = this.getFluxEventEmittersListeners(props);

      Object.keys(nextSubscriptions).forEach(function (location) {
        var stateKey = nextSubscriptions[location];
        var _ref7 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref7.name;
        var key = _ref7.key;
        var _ref8 = [name, key];
        var storeName = _ref8[0];
        var path = _ref8[1];

        FluxMixinStatics._subscribeTo(storeName, path, stateKey);
      });

      Object.keys(nextListeners).forEach(function (location) {
        var handler = nextListeners[location];
        var _ref9 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref9.name;
        var key = _ref9.key;
        var _ref10 = [name, key];
        var eventEmitterName = _ref10[0];
        var room = _ref10[1];

        FluxMixinStatics._listenTo(eventEmitterName, room, handler);
      });

      currentSubscriptions.forEach(function (subscription) {
        return _this21._unsubscribeFrom(subscription);
      });
      currentListeners.forEach(function (listener) {
        return _this21._unlistenFrom(listener);
      });
    },

    _clearFlux: function () {
      var _this22 = this;

      _.dev(function () {
        return _this22._FluxMixin.should.be.ok;
      });
      Object.keys(this._FluxMixinSubscriptions).forEach(function (key) {
        return _this22._unsubscribeFrom(_this22._FluxMixinSubscriptions[key]);
      });
      Object.keys(this._FluxMixinListeners).forEach(function (key) {
        return _this22._unlistenFrom(_this22._FluxMixinListeners[key]);
      });
    },

    _propagateStoreUpdate: function (storeName, path, value, stateKey) {
      var _this23 = this;

      _.dev(function () {
        return stateKey.should.be.a.String && value.should.be.an.Object;
      });
      return R.Async.ifMounted(function () {
        _.dev(function () {
          return _this23._FluxMixin.should.be.ok;
        });
        _this23.fluxStoreWillUpdate(storeName, path, value, stateKey);
        _this23.setState((function (_ref) {
          _ref[stateKey] = value;
          return _ref;
        })({}));
        _this23.fluxStoreDidUpdate(storeName, path, value, stateKey);
      }).call(this);
    },

    _subscribeTo: function (storeName, path, stateKey) {
      var _this24 = this;

      _.dev(function () {
        return storeName.should.be.a.String && path.should.be.a.String && stateKey.should.be.a.String && _this24._FluxMixin.should.be.ok && _this24._FluxMixinSubscriptions.should.be.an.Object;
      });
      var flux = this.getFlux();
      var propagateUpdate = function (value) {
        return FluxMixinStatics._propagateStoreUpdate(storeName, path, value, stateKey);
      };
      var subscription = flux.subscribeTo(storeName, path, propagateUpdate);
      var id = _.uniqueId(stateKey);
      this._FluxMixinSubscriptions[id] = { subscription: subscription, id: id, storeName: storeName };
      return this;
    },

    _unsubscribeFrom: function (_ref11) {
      var _this25 = this;
      var subscription = _ref11.subscription;
      var id = _ref11.id;
      var storeName = _ref11.storeName;

      _.dev(function () {
        return subscription.should.be.an.instanceOf(R.Store.Subscription) && id.should.be.a.String && _this25._FluxMixin.should.be.ok && _this25._FluxMixinSubscriptions[id].should.be.exactly(subscription);
      });
      var flux = this.getFlux();
      flux.unsubscribeFrom(storeName, subscription);
      delete this._FluxMixinSubscriptions[id];
      return this;
    },

    _propagateEvent: function (eventEmitterName, room, params, handler) {
      var _this26 = this;

      _.dev(function () {
        return handler.should.be.a.Function && params.should.be.an.Object;
      });

      return R.Async.ifMounted(function () {
        _.dev(function () {
          return _this26._FluxMixin.should.be.ok;
        });
        _this26.fluxEventEmitterWillEmit(eventEmitterName, room, params, handler);
        handler.call(null, params);
        _this26.fluxEventEmitterDidEmit(eventEmitterName, room, params, handler);
      }).call(this);
    },

    _listenTo: function (eventEmitterName, room, handler) {
      var _this27 = this;

      _.dev(function () {
        return eventEmitterName.should.be.a.String && room.should.be.a.String && handler.should.be.a.Function && _this27._FluxMixin.should.be.ok && _this27._FluxMixinListeners.should.be.an.Object;
      });
      var flux = this.getFlux();
      var propagateEvent = function (params) {
        return FluxMixinStatics._propagateEvent(eventEmitterName, room, params, handler);
      };
      var listener = flux.listenTo(eventEmitterName, room, propagateEvent);
      var id = _.uniqueId(room);
      this._FluxMixinListeners[id] = { listener: listener, id: id, eventEmitterName: eventEmitterName };
      return this;
    },

    _unlistenFrom: function (_ref12) {
      var _this28 = this;
      var listener = _ref12.listener;
      var id = _ref12.id;
      var eventEmitterName = _ref12.eventEmitterName;

      _.dev(function () {
        return listener.should.be.an.instanceOf(R.EventEmitter.Listener) && id.should.be.a.String && _this28._FluxMixin.should.be.ok && _this28._FluxMixinListeners[id].should.be.exactly(listener);
      });
      var flux = this.getFlux();
      flux.unlistenFrom(eventEmitterName, listener);
      delete this._FluxMixinListeners[id];
      return this;
    },

    defaultImplementations: {
      getFluxStoreSubscriptions: function (props) {
        return {};
      }, // jshint ignore:line
      getFluxEventEmittersListeners: function (props) {
        return {};
      }, // jshint ignore:line
      fluxStoreWillUpdate: function (storeName, path, value, stateKey) {
        return void 0;
      }, // jshint ignore:line
      fluxStoreDidUpdate: function (storeName, path, value, stateKey) {
        return void 0;
      }, // jshint ignore:line
      fluxEventEmitterWillEmit: function (eventEmitterName, room, params, handler) {
        return void 0;
      }, // jshint ignore:line
      fluxEventEmitterDidEmit: function (eventEmitterName, room, params, handler) {
        return void 0;
      } } };

  Flux.Mixin = {
    _FluxMixin: true,
    _FluxMixinSubscriptions: null,
    _FluxMixinListeners: null,

    statics: { FluxMixinStatics: FluxMixinStatics },

    getInitialState: function () {
      if (this.getFlux().shouldInjectFromStores()) {
        return FluxMixinStatics._getInitialStateFromFluxStores.call(this);
      } else {
        return FluxMixinStatics._getInitialStateWillNullValues.call(this);
      }
    },

    componentWillMount: function () {
      var _this29 = this;

      _.dev(function () {
        return _this29.getFlux.should.be.a.Function && _this29.getFlux().should.be.an.instanceOf(R.Flux) && _this29._AsyncMixin.should.be.ok;
      });
      this._FluxMixinListeners = {};
      this._FluxMixinSubscriptions = {};
      Object.keys(FluxMixinStatics.defaultImplementations).forEach(function (methodName) {
        return _this29[methodName] = _this29[methodName] || FluxMixinStatics.defaultImplementations[methodName].bind(_this29);
      });
    },

    componentDidMount: function () {
      FluxMixinStatics._updateFlux.call(this, this.props);
    },

    componentWillReceiveProps: function (props) {
      FluxMixinStatics._updateFlux.call(this, props);
    },

    componentWillUnmount: function () {
      FluxMixinStatics._clearFlux.call(this);
    },

    prefetchFluxStores: regeneratorRuntime.mark(function callee$1$0() {
      var props, subscriptions, context, state, flux, surrogateComponent, renderedComponent, childContext;
      return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        var _this30 = this;
        while (1) switch (context$2$0.prev = context$2$0.next) {case 0:
            props = this.props;
            subscriptions = this.getFluxStoreSubscriptions(props);
            context = this.context;
            state = _.extend({}, this.state || {});
            flux = this.getFlux();
            context$2$0.next = 7;
            return Object.keys(subscriptions) // jshint ignore:line
            .map(function (stateKey) {
              return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
                var location, _ref13, name, key, _ref14, storeName, path;
                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
                      location = subscriptions[stateKey];
                      _ref13 = FluxMixinStatics.parseFluxLocation(location);
                      name = _ref13.name;
                      key = _ref13.key;
                      _ref14 = [name, key];
                      storeName = _ref14[0];
                      path = _ref14[1];
                      context$4$0.next = 9;
                      return flux.getStore(storeName).pull(path);

                    case 9: state[stateKey] = context$4$0.sent;
                    case 10:
                    case "end": return context$4$0.stop();
                  }
                }, callee$3$0, this);
              }), _this30);
            });

          case 7:

            flux.injectingFromStores(function () {
              surrogateComponent = new _this30.__ReactNexusSurrogate({ context: context, props: props, state: state });
              surrogateComponent.componentWillMount();
            });

            renderedComponent = surrogateComponent.render();
            childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : context;

            surrogateComponent.componentWillUnmount();

            context$2$0.next = 13;
            return React.Children.mapTree(renderedComponent, function (childComponent) {
              return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
                var childType, surrogateChildComponent;
                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                      if (_.isObject(childComponent)) {
                        context$4$0.next = 2;
                        break;
                      }
                      return context$4$0.abrupt("return");

                    case 2:
                      childType = childComponent.type;

                      if (!(!_.isObject(childType) || !childType.__ReactNexusSurrogate)) {
                        context$4$0.next = 5;
                        break;
                      }
                      return context$4$0.abrupt("return");

                    case 5:
                      surrogateChildComponent = new childType.__ReactNexusSurrogate({ context: childContext, props: childComponent.props });

                      if (!surrogateChildComponent.componentWillMount) {
                        _.dev(function () {
                          throw new Error("Component " + surrogateChildComponent.displayName + " doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?");
                        });
                      }
                      surrogateChildComponent.componentWillMount();
                      context$4$0.next = 10;
                      return surrogateChildComponent.prefetchFluxStores();

                    case 10: surrogateChildComponent.componentWillUnmount();
                    case 11:
                    case "end": return context$4$0.stop();
                  }
                }, callee$3$0, this);
              }), _this30);
            });

          case 13:
          case "end": return context$2$0.stop();
        }
      }, callee$1$0, this);
    }),

    dispatch: function (location, params) {
      var _ref15 = FluxMixinStatics.parseFluxLocation(location);

      var name = _ref15.name;
      var key = _ref15.key;
      var _ref16 = [name, key];
      var dispatcherName = _ref16[0];
      var action = _ref16[1];

      var flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    } };

  Flux.PropType = function (props) {
    return props.flux && props.flux instanceof Flux;
  };

  return Flux;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O0FBRXRCLE1BQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDOztNQUVyQyxJQUFJO1FBQUosSUFBSSxHQUNHLFNBRFAsSUFBSSxRQUNvQztVQUE5QixPQUFPLFNBQVAsT0FBTztVQUFFLElBQUksU0FBSixJQUFJO1VBQUUsTUFBTSxTQUFOLE1BQU07VUFBRSxHQUFHLFNBQUgsR0FBRzs7QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3ZCLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO09BQUEsQ0FDcEUsQ0FBQztBQUNGLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLE1BQU0sR0FB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RSxDQUFDLENBQUM7dUJBQ2xLO0FBQ0QsNkNBQXVCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7NkJBQ3ZDLHVCQUF1QixDQUFDLGtCQUFrQixFQUFFOzs2QkFDbEQsdUJBQXVCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7Ozs7ZUFDaEQsV0FBTzthQUFBLENBQUM7Ozs7OztLQUNWLENBQUE7O0FBRUQsWUFBUSxFQUFBLFVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRTttQkFDTCxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7O1VBQTFELElBQUksVUFBSixJQUFJO1VBQUUsR0FBRyxVQUFILEdBQUc7bUJBQ2dCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztVQUFyQyxjQUFjO1VBQUUsTUFBTTs7QUFDM0IsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3RELEVBRUYsQ0FBQzs7QUFFRixNQUFJLENBQUMsUUFBUSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzlCLFdBQU8sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxZQUFZLElBQUksQ0FBQztHQUNqRCxDQUFDOztBQUVGLFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgY29uc3QgZmx1eExvY2F0aW9uUmVnRXhwID0gL14oLiopOlxcLyguKikkLztcblxuICBjbGFzcyBGbHV4IHtcbiAgICBjb25zdHJ1Y3Rvcih7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdywgcmVxIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcbiAgICAgIHRoaXMuZ3VpZCA9IGd1aWQ7XG4gICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcbiAgICAgIHRoaXMucmVxID0gcmVxO1xuICAgICAgdGhpcy5zdG9yZXMgPSB7fTtcbiAgICAgIHRoaXMuZXZlbnRFbWl0dGVycyA9IHt9O1xuICAgICAgdGhpcy5kaXNwYXRjaGVycyA9IHt9O1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgIH1cblxuICAgICpib290c3RyYXAoKSB7IF8uYWJzdHJhY3QoKTsgfSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN0b3JlcykuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRFbWl0dGVycykuZm9yRWFjaCgoZXZlbnRFbWl0dGVyTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGlzcGF0Y2hlcnMpLmZvckVhY2goKGRpc3BhdGNoZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuaGVhZGVycyA9IG51bGw7XG4gICAgICB0aGlzLndpbmRvdyA9IG51bGw7XG4gICAgICB0aGlzLnJlcSA9IG51bGw7XG4gICAgICB0aGlzLnN0b3JlcyA9IG51bGw7XG4gICAgICB0aGlzLmV2ZW50RW1pdHRlcnMgPSBudWxsO1xuICAgICAgdGhpcy5kaXNwYXRjaGVycyA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW5qZWN0aW5nRnJvbVN0b3Jlcyhmbikge1xuICAgICAgdGhpcy5fc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICBsZXQgciA9IGZuKCk7XG4gICAgICB0aGlzLl9zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzO1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZyB9KSB7XG4gICAgICBsZXQgc2VyaWFsaXphYmxlID0gXy5tYXBWYWx1ZXModGhpcy5zdG9yZXMsIChzdG9yZSkgPT4gc3RvcmUuc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nOiB0cnVlIH0pKTtcbiAgICAgIHJldHVybiBwcmV2ZW50RW5jb2RpbmcgPyBzZXJpYWxpemFibGUgOiBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShzZXJpYWxpemFibGUpKTtcbiAgICB9XG5cbiAgICB1bnNlcmlhbGl6ZShzZXJpYWxpemVkLCB7IHByZXZlbnREZWNvZGluZyB9KSB7XG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBPYmplY3Qua2V5cyh1bnNlcmlhbGl6YWJsZSkuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkpO1xuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnVuc2VyaWFsaXplKHVuc2VyaWFsaXphYmxlW3N0b3JlTmFtZV0sIHsgcHJldmVudERlY29kaW5nOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZWdpc3RlclN0b3JlKHN0b3JlTmFtZSwgc3RvcmUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSlcbiAgICAgICk7XG4gICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdID0gc3RvcmU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0U3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50RW1pdHRlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpXG4gICAgICApO1xuICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdID0gZXZlbnRFbWl0dGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSwgZGlzcGF0Y2hlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpICYmXG4gICAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXSA9IGRpc3BhdGNoZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcilcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSAmJlxuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uID0gc3RvcmUuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbShzdG9yZU5hbWUsIHN1YnNjcmlwdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLnN0b3Jlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpICYmXG4gICAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKVxuICAgICAgKTtcbiAgICAgIGxldCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIHJldHVybiBzdG9yZS51bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBsaXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gZXZlbnRFbWl0dGVyLmxpc3RlblRvKHJvb20sIGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH1cblxuICAgIHVubGlzdGVuRnJvbShldmVudEVtaXR0ZXJOYW1lLCBsaXN0ZW5lcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIpXG4gICAgICApO1xuICAgICAgbGV0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgcmV0dXJuIGV2ZW50RW1pdHRlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcbiAgICAgICAgYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBkaXNwYXRjaGVyID0gdGhpcy5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyLmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChGbHV4LnByb3RvdHlwZSwge1xuICAgIGhlYWRlcnM6IG51bGwsXG4gICAgZ3VpZDogbnVsbCxcbiAgICB3aW5kb3c6IG51bGwsXG4gICAgcmVxOiBudWxsLFxuICAgIHN0b3JlczogbnVsbCxcbiAgICBldmVudEVtaXR0ZXJzOiBudWxsLFxuICAgIGRpc3BhdGNoZXJzOiBudWxsLFxuICAgIF9zaG91bGRJbmplY3RGcm9tU3RvcmVzOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBGbHV4TWl4aW5TdGF0aWNzID0ge1xuICAgIHBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBsb2NhdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgbGV0IHIgPSBmbHV4TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4gICAgICBfLmRldigoKSA9PiAociAhPT0gbnVsbCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgIHJldHVybiB7IG5hbWU6IHJbMF0sIGtleTogclsxXSB9O1xuICAgIH0sXG5cbiAgICBfZ2V0SW5pdGlhbFN0YXRlRnJvbUZsdXhTdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZUtleSA9IHN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgICAgbGV0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLmhhc0NhY2hlZFZhbHVlKHBhdGgpLnNob3VsZC5iZS5vayk7XG4gICAgICAgICAgbGV0IHZhbHVlID0gc3RvcmUuZ2V0Q2FjaGVkVmFsdWUocGF0aCk7XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgdmFsdWVdO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZUtleSA9IHN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICAgIHJldHVybiBbc3RhdGVLZXksIG51bGxdO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUZsdXgocHJvcHMpIHtcbiAgICAgIHByb3BzID0gcHJvcHMgfHwge307XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHByb3BzLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBsZXQgY3VycmVudFN1YnNjcmlwdGlvbnMgPSBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zKVxuICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2tleV0pO1xuICAgICAgbGV0IGN1cnJlbnRMaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1trZXldKTtcblxuICAgICAgbGV0IG5leHRTdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKTtcbiAgICAgIGxldCBuZXh0TGlzdGVuZXJzID0gdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcyk7XG5cbiAgICAgIE9iamVjdC5rZXlzKG5leHRTdWJzY3JpcHRpb25zKVxuICAgICAgLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIGxldCBzdGF0ZUtleSA9IG5leHRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3N1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgc3RhdGVLZXkpO1xuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5rZXlzKG5leHRMaXN0ZW5lcnMpXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSBuZXh0TGlzdGVuZXJzW2xvY2F0aW9uXTtcbiAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgbGV0IFtldmVudEVtaXR0ZXJOYW1lLCByb29tXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICBGbHV4TWl4aW5TdGF0aWNzLl9saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBjdXJyZW50U3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWJzY3JpcHRpb24pID0+IHRoaXMuX3Vuc3Vic2NyaWJlRnJvbShzdWJzY3JpcHRpb24pKTtcbiAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHRoaXMuX3VubGlzdGVuRnJvbShsaXN0ZW5lcikpO1xuICAgIH0sXG5cbiAgICBfY2xlYXJGbHV4KCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNba2V5XSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluTGlzdGVuZXJzKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5fdW5saXN0ZW5Gcm9tKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1trZXldKSk7XG4gICAgfSxcblxuICAgIF9wcm9wYWdhdGVTdG9yZVVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RhdGVLZXkuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHZhbHVlLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFtzdGF0ZUtleV06IHZhbHVlIH0pO1xuICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XG4gICAgICB9KVxuICAgICAgLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF9zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHN0YXRlS2V5KSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHN0YXRlS2V5LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgcHJvcGFnYXRlVXBkYXRlID0gKHZhbHVlKSA9PiBGbHV4TWl4aW5TdGF0aWNzLl9wcm9wYWdhdGVTdG9yZVVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uID0gZmx1eC5zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHByb3BhZ2F0ZVVwZGF0ZSk7XG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHN0YXRlS2V5KTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbaWRdID0geyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uLCBpZCwgc3RvcmVOYW1lIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlLlN1YnNjcmlwdGlvbikgJiZcbiAgICAgICAgaWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0uc2hvdWxkLmJlLmV4YWN0bHkoc3Vic2NyaXB0aW9uKVxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBmbHV4LnVuc3Vic2NyaWJlRnJvbShzdG9yZU5hbWUsIHN1YnNjcmlwdGlvbik7XG4gICAgICBkZWxldGUgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3Byb3BhZ2F0ZUV2ZW50KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIFIuQXN5bmMuaWZNb3VudGVkKCgpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcik7XG4gICAgICAgIGhhbmRsZXIuY2FsbChudWxsLCBwYXJhbXMpO1xuICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcik7XG4gICAgICB9KVxuICAgICAgLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF9saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgbGV0IHByb3BhZ2F0ZUV2ZW50ID0gKHBhcmFtcykgPT4gRmx1eE1peGluU3RhdGljcy5fcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIGxldCBsaXN0ZW5lciA9IGZsdXgubGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcHJvcGFnYXRlRXZlbnQpO1xuICAgICAgbGV0IGlkID0gXy51bmlxdWVJZChyb29tKTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF0gPSB7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bmxpc3RlbkZyb20oeyBsaXN0ZW5lciwgaWQsIGV2ZW50RW1pdHRlck5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIpICYmXG4gICAgICAgIGlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF0uc2hvdWxkLmJlLmV4YWN0bHkobGlzdGVuZXIpXG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5saXN0ZW5Gcm9tKGV2ZW50RW1pdHRlck5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRlZmF1bHRJbXBsZW1lbnRhdGlvbnM6IHtcbiAgICAgIGdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKSB7IHJldHVybiB7fTsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikgeyByZXR1cm4gdm9pZCAwOyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikgeyByZXR1cm4gdm9pZCAwOyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICB9LFxuICB9O1xuXG4gIEZsdXguTWl4aW4gPSB7XG4gICAgX0ZsdXhNaXhpbjogdHJ1ZSxcbiAgICBfRmx1eE1peGluU3Vic2NyaXB0aW9uczogbnVsbCxcbiAgICBfRmx1eE1peGluTGlzdGVuZXJzOiBudWxsLFxuXG4gICAgc3RhdGljczogeyBGbHV4TWl4aW5TdGF0aWNzIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICBpZih0aGlzLmdldEZsdXgoKS5zaG91bGRJbmplY3RGcm9tU3RvcmVzKCkpIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZUZyb21GbHV4U3RvcmVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuZ2V0Rmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB0aGlzLmdldEZsdXgoKS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXG4gICAgICAgIHRoaXMuX0FzeW5jTWl4aW4uc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzID0ge307XG4gICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zID0ge307XG4gICAgICBPYmplY3Qua2V5cyhGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobWV0aG9kTmFtZSkgPT4gdGhpc1ttZXRob2ROYW1lXSA9IHRoaXNbbWV0aG9kTmFtZV0gfHwgRmx1eE1peGluU3RhdGljcy5kZWZhdWx0SW1wbGVtZW50YXRpb25zW21ldGhvZE5hbWVdLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3VwZGF0ZUZsdXguY2FsbCh0aGlzLCB0aGlzLnByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl9jbGVhckZsdXguY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgKnByZWZldGNoRmx1eFN0b3JlcygpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICBsZXQgc3RhdGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSB8fCB7fSk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgeWllbGQgT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucykgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAubWFwKChzdGF0ZUtleSkgPT4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBzdWJzY3JpcHRpb25zW3N0YXRlS2V5XTtcbiAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgIHN0YXRlW3N0YXRlS2V5XSA9IHlpZWxkIGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKS5wdWxsKHBhdGgpO1xuICAgICAgfSwgdGhpcykpO1xuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgb25lLCBidXQgdGhpcyB0aW1lIGluamVjdCBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3Jlcy5cbiAgICAgIGxldCBzdXJyb2dhdGVDb21wb25lbnQ7XG4gICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4ge1xuICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdGhpcy5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0LCBwcm9wcywgc3RhdGUgfSk7XG4gICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XG4gICAgICBsZXQgY2hpbGRDb250ZXh0ID0gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCA/IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSA6IGNvbnRleHQ7XG4gICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgeWllbGQgUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZShyZW5kZXJlZENvbXBvbmVudCwgKGNoaWxkQ29tcG9uZW50KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICBpZighXy5pc09iamVjdChjaGlsZENvbXBvbmVudCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoaWxkVHlwZSA9IGNoaWxkQ29tcG9uZW50LnR5cGU7XG4gICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkVHlwZSkgfHwgIWNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIGNoaWxkICh3aXRob3V0IGluamVjdGluZyBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3JlcykuXG4gICAgICAgIGxldCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudCA9IG5ldyBjaGlsZFR5cGUuX19SZWFjdE5leHVzU3Vycm9nYXRlKHsgY29udGV4dDogY2hpbGRDb250ZXh0LCBwcm9wczogY2hpbGRDb21wb25lbnQucHJvcHMgfSk7XG4gICAgICAgIGlmKCFzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7c3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuZGlzcGxheU5hbWV9IGRvZXNuJ3QgaW1wbGVtZW50IGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLkNvbXBvbmVudC5taXhpbiA/YCk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgIH0sIHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgIGxldCBbZGlzcGF0Y2hlck5hbWUsIGFjdGlvbl0gPSBbbmFtZSwga2V5XTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICByZXR1cm4gZmx1eC5kaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpO1xuICAgIH0sXG5cbiAgfTtcblxuICBGbHV4LlByb3BUeXBlID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuZmx1eCAmJiBwcm9wcy5mbHV4IGluc3RhbmNlb2YgRmx1eDtcbiAgfTtcblxuICByZXR1cm4gRmx1eDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=