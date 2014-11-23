"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

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

  var _Flux = (function () {
    var _Flux = function _Flux(_ref2) {
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

    _classProps(_Flux, null, {
      bootstrap: {
        writable: true,
        value: regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0: _.abstract();
              case 1:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      },
      destroy: {
        writable: true,
        // jshint ignore:line

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
        value: function (p) {
          if (p === undefined) p = {};
          var preventEncoding = !!p.preventEncoding;
          var serializable = _.mapValues(this.stores, function (store) {
            return store.serialize({ preventEncoding: true });
          });
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, p) {
          var _this4 = this;
          if (p === undefined) p = {};
          var preventDecoding = !!p.preventDecoding;
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

    return _Flux;
  })();

  _.extend(_Flux.prototype, {
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
        var _ref3 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref3.name;
        var key = _ref3.key;
        var _ref4 = [name, key];
        var _ref5 = _toArray(_ref4);

        var storeName = _ref5[0];
        var path = _ref5[1];
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
        var _ref6 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref6.name;
        var key = _ref6.key;
        var _ref7 = [name, key];
        var _ref8 = _toArray(_ref7);

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
        var _ref11 = _toArray(_ref10);

        var eventEmitterName = _ref11[0];
        var room = _ref11[1];
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

    _unsubscribeFrom: function (_ref12) {
      var _this25 = this;
      var subscription = _ref12.subscription;
      var id = _ref12.id;
      var storeName = _ref12.storeName;
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

    _unlistenFrom: function (_ref13) {
      var _this28 = this;
      var listener = _ref13.listener;
      var id = _ref13.id;
      var eventEmitterName = _ref13.eventEmitterName;
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

  _Flux.Mixin = {
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

    prefetchFluxStores: regeneratorRuntime.mark(function _callee3() {
      var _this30 = this;
      var props, subscriptions, context, state, flux, surrogateComponent, renderedComponent, childContext;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (true) switch (_context3.prev = _context3.next) {
          case 0: props = _this30.props;
            subscriptions = _this30.getFluxStoreSubscriptions(props);
            context = _this30.context;
            state = _.extend({}, _this30.state || {});
            flux = _this30.getFlux();
            _context3.next = 7;
            return Object.keys(subscriptions).map(function (stateKey) {
              return _.co(_.scope(regeneratorRuntime.mark(function _callee2() {
                var location, _ref14, name, key, _ref15, _ref16, storeName, path;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (true) switch (_context2.prev = _context2.next) {
                    case 0: location = subscriptions[stateKey];
                      _ref14 = FluxMixinStatics.parseFluxLocation(location);
                      name = _ref14.name;
                      key = _ref14.key;
                      _ref15 = [name, key];
                      _ref16 = _toArray(_ref15);
                      storeName = _ref16[0];
                      path = _ref16[1];
                      _context2.next = 10;
                      return flux.getStore(storeName).pull(path);
                    case 10: state[stateKey] = _context2.sent;
                    case 11:
                    case "end": return _context2.stop();
                  }
                }, _callee2, this);
              }), _this30));
            });
          case 7:
            flux.injectingFromStores(function () {
              surrogateComponent = new _this30.__ReactNexusSurrogate({ context: context, props: props, state: state });
              surrogateComponent.componentWillMount();
            });

            renderedComponent = surrogateComponent.render();
            childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : context;
            surrogateComponent.componentWillUnmount();

            _context3.next = 13;
            return React.Children.mapTree(renderedComponent, function (childComponent) {
              return _.co.wrap(_this30._prefetchChildComponent).call(_this30, childComponent, childContext);
            });
          case 13:
          case "end": return _context3.stop();
        }
      }, _callee3, this);
    }),

    _prefetchChildComponent: regeneratorRuntime.mark(function _callee4(component, context) {
      var type, props, surrogateComponent;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (true) switch (_context4.prev = _context4.next) {
          case 0:
            if (_.isObject(component)) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return");
          case 2: type = component.type;
            props = component.props;
            if (!(!_.isObject(type) || !type.__ReactNexusSurrogate)) {
              _context4.next = 6;
              break;
            }
            return _context4.abrupt("return");
          case 6: surrogateComponent = new type.__ReactNexusSurrogate({ context: context, props: props, state: {} });
            if (!surrogateComponent.componentWillMount) {
              _.dev(function () {
                throw new Error("Component " + surrogateComponent.displayName + " doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?");
              });
            }
            surrogateComponent.componentWillMount();
            _context4.next = 11;
            return surrogateComponent.prefetchFluxStores();
          case 11:
            surrogateComponent.componentWillUnmount();
          case 12:
          case "end": return _context4.stop();
        }
      }, _callee4, this);
    }),

    dispatch: function (location, params) {
      var _ref17 = FluxMixinStatics.parseFluxLocation(location);

      var name = _ref17.name;
      var key = _ref17.key;
      var _ref18 = [name, key];
      var _ref19 = _toArray(_ref18);

      var dispatcherName = _ref19[0];
      var action = _ref19[1];
      var flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    } };

  _Flux.PropType = function (props) {
    return props.flux && props.flux instanceof _Flux;
  };

  return _Flux;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRmx1eC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7O01BRXJDLEtBQUk7UUFBSixLQUFJLEdBQ0csU0FEUCxLQUFJLFFBQ29DO1VBQTlCLE9BQU8sU0FBUCxPQUFPO1VBQUUsSUFBSSxTQUFKLElBQUk7VUFBRSxNQUFNLFNBQU4sTUFBTTtVQUFFLEdBQUcsU0FBSCxHQUFHO0FBQ3RDLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN2QixDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQ3BFLENBQUM7QUFDRixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7S0FDdEM7O2dCQWRHLEtBQUk7QUFnQlAsZUFBUzs7dUNBQUE7OztzQkFBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Ozs7O1NBQUU7O0FBRTlCLGFBQU87Ozs7ZUFBQSxZQUFHOztBQUNSLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTO21CQUFLLE1BQUssZUFBZSxDQUFDLFNBQVMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUNqRixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsZ0JBQWdCO21CQUFLLE1BQUssc0JBQXNCLENBQUMsZ0JBQWdCLENBQUM7V0FBQSxDQUFDLENBQUM7QUFDN0csZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGNBQWM7bUJBQUssTUFBSyxvQkFBb0IsQ0FBQyxjQUFjLENBQUM7V0FBQSxDQUFDLENBQUM7O0FBRXJHLGNBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLGNBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELCtCQUF5Qjs7ZUFBQSxZQUFHOztBQUMxQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssdUJBQXVCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUMzRCxjQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELDhCQUF3Qjs7ZUFBQSxZQUFHOztBQUN6QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssdUJBQXVCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7QUFDckMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQseUJBQW1COztlQUFBLFVBQUMsRUFBRSxFQUFFO0FBQ3RCLGNBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ2pDLGNBQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQ2YsY0FBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsaUJBQU8sQ0FBQyxDQUFDO1NBQ1Y7O0FBRUQsNEJBQXNCOztlQUFBLFlBQUc7QUFDdkIsaUJBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDO1NBQ3JDOztBQUVELGVBQVM7O2VBQUEsVUFBQyxDQUFDLEVBQU87Y0FBUixDQUFDLGdCQUFELENBQUMsR0FBRyxFQUFFO0FBQ2QsY0FBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7QUFDNUMsY0FBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSzttQkFBSyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQ3JHLGlCQUFPLGVBQWUsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDdEY7O0FBRUQsaUJBQVc7O2VBQUEsVUFBQyxVQUFVLEVBQUUsQ0FBQyxFQUFPOztjQUFSLENBQUMsZ0JBQUQsQ0FBQyxHQUFHLEVBQUU7QUFDNUIsY0FBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUM7QUFDNUMsY0FBTSxjQUFjLEdBQUcsZUFBZSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUM3RixnQkFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLEVBQUs7QUFDakQsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDekQsbUJBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztXQUMxRixDQUFDLENBQUM7QUFDSCxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxtQkFBYTs7ZUFBQSxVQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7O0FBQzlCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQ2hELFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzVCLE9BQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7V0FBQSxDQUNoRCxDQUFDO0FBQ0YsY0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDL0IsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQscUJBQWU7O2VBQUEsVUFBQyxTQUFTLEVBQUU7O0FBQ3pCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdEMsT0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQzNDLE9BQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1dBQUEsQ0FDeEQsQ0FBQztBQUNGLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLFNBQVMsRUFBRTs7QUFDbEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxPQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFDM0MsT0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7V0FBQSxDQUN4RCxDQUFDO0FBQ0YsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMvQjs7QUFFRCwwQkFBb0I7O2VBQUEsVUFBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUU7O0FBQ25ELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQzlELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDbkMsT0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1dBQUEsQ0FDOUQsQ0FBQztBQUNGLGNBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxZQUFZLENBQUM7QUFDcEQsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsNEJBQXNCOztlQUFBLFVBQUMsZ0JBQWdCLEVBQUU7O0FBQ3ZDLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUM3QyxPQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUN6RCxPQUFLLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO1dBQUEsQ0FDN0UsQ0FBQztBQUNGLGlCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM1QyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxxQkFBZTs7ZUFBQSxVQUFDLGdCQUFnQixFQUFFOztBQUNoQyxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDN0MsUUFBSyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFDekQsUUFBSyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztXQUFBLENBQzdFLENBQUM7QUFDRixpQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDN0M7O0FBRUQsd0JBQWtCOztlQUFBLFVBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRTs7QUFDN0MsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFDMUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsUUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztXQUFBLENBQzFELENBQUM7QUFDRixjQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUM5QyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCwwQkFBb0I7O2VBQUEsVUFBQyxjQUFjLEVBQUU7O0FBQ25DLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDM0MsUUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQ3JELFFBQUssV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1dBQUEsQ0FDdkUsQ0FBQztBQUNGLGlCQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsbUJBQWE7O2VBQUEsVUFBQyxjQUFjLEVBQUU7O0FBQzVCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDM0MsUUFBSyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQ3JELFFBQUssV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1dBQUEsQ0FDdkUsQ0FBQztBQUNGLGlCQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDekM7O0FBRUQsaUJBQVc7O2VBQUEsVUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFDcEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxRQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFDM0MsUUFBSyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7V0FBQSxDQUM3QixDQUFDO0FBQ0YsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxjQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0RCxpQkFBTyxZQUFZLENBQUM7U0FDckI7O0FBRUQscUJBQWU7O2VBQUEsVUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFOztBQUN2QyxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3RDLFFBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUMzQyxRQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUN2RCxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1dBQUEsQ0FDM0QsQ0FBQztBQUNGLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsaUJBQU8sS0FBSyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1Qzs7QUFFRCxjQUFROztlQUFBLFVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFDeEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzdDLFFBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQ3pELFFBQUssYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7V0FBQSxDQUM3QixDQUFDO0FBQ0YsY0FBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVELGNBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RELGlCQUFPLFFBQVEsQ0FBQztTQUNqQjs7QUFFRCxrQkFBWTs7ZUFBQSxVQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRTs7QUFDdkMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzdDLFFBQUssYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQ3pELFFBQUssYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFDNUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztXQUFBLENBQzFELENBQUM7QUFDRixjQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDNUQsaUJBQU8sWUFBWSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM1Qzs7QUFFRCxjQUFROztlQUFBLFVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0FBQ3ZDLGdCQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUN0QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzNDLFFBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUNyRCxRQUFLLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUN0RSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQzNCLENBQUM7QUFDRixjQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RELGlCQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzVDOzs7O1dBM01HLEtBQUk7OztBQThNVixHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkIsV0FBTyxFQUFFLElBQUk7QUFDYixRQUFJLEVBQUUsSUFBSTtBQUNWLFVBQU0sRUFBRSxJQUFJO0FBQ1osT0FBRyxFQUFFLElBQUk7QUFDVCxVQUFNLEVBQUUsSUFBSTtBQUNaLGlCQUFhLEVBQUUsSUFBSTtBQUNuQixlQUFXLEVBQUUsSUFBSTtBQUNqQiwyQkFBdUIsRUFBRSxJQUFJLEVBQzlCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLHFCQUFpQixFQUFBLFVBQUMsUUFBUSxFQUFFO0FBQzFCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtPQUFBLENBQUMsQ0FBQztBQUN6QyxVQUFNLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN2QyxhQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDbEM7O0FBRUQsa0NBQThCLEVBQUEsWUFBRzs7QUFDL0IsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLFFBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUMxQyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUIsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRSxhQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FDdkMsR0FBRyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ2pCLFlBQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkIsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDOztZQUExRCxJQUFJLFNBQUosSUFBSTtZQUFFLEdBQUcsU0FBSCxHQUFHO29CQUNTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7O1lBQTlCLFNBQVM7WUFBRSxJQUFJO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUNyRCxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGVBQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDMUIsQ0FBQyxDQUNILENBQUM7S0FDSDs7QUFFRCxrQ0FBOEIsRUFBQSxZQUFHOztBQUMvQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sUUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQzFDLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakUsYUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQ3ZDLEdBQUcsQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNqQixZQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsZUFBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN6QixDQUFDLENBQ0gsQ0FBQztLQUNIOztBQUVELGVBQVcsRUFBQSxVQUFDLEtBQUssRUFBRTs7QUFDakIsV0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDcEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLFFBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQzFCLENBQUM7QUFDRixVQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQ3JFLEdBQUcsQ0FBQyxVQUFDLEdBQUc7ZUFBSyxRQUFLLHVCQUF1QixDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNqRCxVQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQzdELEdBQUcsQ0FBQyxVQUFDLEdBQUc7ZUFBSyxRQUFLLG1CQUFtQixDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFN0MsVUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEUsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoRSxZQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQzdCLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNyQixZQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdkIsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDOztZQUExRCxJQUFJLFNBQUosSUFBSTtZQUFFLEdBQUcsU0FBSCxHQUFHO29CQUNTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7O1lBQTlCLFNBQVM7WUFBRSxJQUFJO0FBQ3RCLHdCQUFnQixDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzFELENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUN6QixPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDckIsWUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsQixnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7O1lBQTFELElBQUksU0FBSixJQUFJO1lBQUUsR0FBRyxTQUFILEdBQUc7cUJBQ2dCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7O1lBQXJDLGdCQUFnQjtZQUFFLElBQUk7QUFDN0Isd0JBQWdCLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM3RCxDQUFDLENBQUM7O0FBRUgsMEJBQW9CLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBWTtlQUFLLFFBQUssZ0JBQWdCLENBQUMsWUFBWSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3BGLHNCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7ZUFBSyxRQUFLLGFBQWEsQ0FBQyxRQUFRLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDdEU7O0FBRUQsY0FBVSxFQUFBLFlBQUc7O0FBQ1gsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLFFBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUMxQyxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUN4QyxPQUFPLENBQUMsVUFBQyxHQUFHO2VBQUssUUFBSyxnQkFBZ0IsQ0FBQyxRQUFLLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQzVFLFlBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQ3BDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7ZUFBSyxRQUFLLGFBQWEsQ0FBQyxRQUFLLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3RFOztBQUVELHlCQUFxQixFQUFBLFVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFOztBQUN0RCxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDckMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUMxQixDQUFDO0FBQ0YsYUFBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFNO0FBQzdCLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sUUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQzFDLGdCQUFLLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNELGdCQUFLLFFBQVE7ZUFBSSxRQUFRLElBQUcsS0FBSzs7V0FBbkIsRUFBcUIsRUFBQyxDQUFDO0FBQ3JDLGdCQUFLLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQzNELENBQUMsQ0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDYjs7QUFFRCxnQkFBWSxFQUFBLFVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7O0FBQ3RDLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN2QixRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUMzQixRQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDNUIsUUFBSyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO09BQUEsQ0FDakQsQ0FBQztBQUNGLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixVQUFNLGVBQWUsR0FBRyxVQUFDLEtBQUs7ZUFBSyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7T0FBQSxDQUFDO0FBQzVHLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN4RSxVQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsRUFBRSxFQUFGLEVBQUUsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLENBQUM7QUFDbkUsYUFBTyxJQUFJLENBQUM7S0FDYjs7QUFFRCxvQkFBZ0IsRUFBQSxrQkFBa0M7O1VBQS9CLFlBQVksVUFBWixZQUFZO1VBQUUsRUFBRSxVQUFGLEVBQUU7VUFBRSxTQUFTLFVBQVQsU0FBUztBQUM1QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUNwRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNyQixRQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDNUIsUUFBSyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7T0FBQSxDQUNqRSxDQUFDO0FBQ0YsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzlDLGFBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLGFBQU8sSUFBSSxDQUFDO0tBQ2I7O0FBRUQsbUJBQWUsRUFBQSxVQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOztBQUN2RCxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUMzQixDQUFDOztBQUVGLGFBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBTTtBQUM3QixTQUFDLENBQUMsR0FBRyxDQUFDO2lCQUFNLFFBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUMxQyxnQkFBSyx3QkFBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLGVBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGdCQUFLLHVCQUF1QixDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDdkUsQ0FBQyxDQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNiOztBQUVELGFBQVMsRUFBQSxVQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBQ3pDLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzVCLFFBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUM1QixRQUFLLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUM3QyxDQUFDO0FBQ0YsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFVBQU0sY0FBYyxHQUFHLFVBQUMsTUFBTTtlQUFLLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUM7QUFDN0csVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDdkUsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLEVBQUUsRUFBRixFQUFFLEVBQUUsZ0JBQWdCLEVBQWhCLGdCQUFnQixFQUFFLENBQUM7QUFDbEUsYUFBTyxJQUFJLENBQUM7S0FDYjs7QUFFRCxpQkFBYSxFQUFBLGtCQUFxQzs7VUFBbEMsUUFBUSxVQUFSLFFBQVE7VUFBRSxFQUFFLFVBQUYsRUFBRTtVQUFFLGdCQUFnQixVQUFoQixnQkFBZ0I7QUFDNUMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFDbkUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDckIsUUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQzVCLFFBQUssbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO09BQUEsQ0FDekQsQ0FBQztBQUNGLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLGFBQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLGFBQU8sSUFBSSxDQUFDO0tBQ2I7O0FBRUQsMEJBQXNCLEVBQUU7QUFDdEIsK0JBQXlCLEVBQUEsVUFBQyxLQUFLLEVBQUU7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFO0FBQy9DLG1DQUE2QixFQUFBLFVBQUMsS0FBSyxFQUFFO0FBQUUsZUFBTyxFQUFFLENBQUM7T0FBRTtBQUNuRCx5QkFBbUIsRUFBQSxVQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUFFLGVBQU8sS0FBSyxDQUFDLENBQUM7T0FBRTtBQUN4RSx3QkFBa0IsRUFBQSxVQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUFFLGVBQU8sS0FBSyxDQUFDLENBQUM7T0FBRTtBQUN2RSw4QkFBd0IsRUFBQSxVQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQUUsZUFBTyxLQUFLLENBQUMsQ0FBQztPQUFFO0FBQ3BGLDZCQUF1QixFQUFBLFVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFBRSxlQUFPLEtBQUssQ0FBQyxDQUFDO09BQUUsRUFDcEYsRUFDRixDQUFDOztBQUVGLE9BQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxjQUFVLEVBQUUsSUFBSTtBQUNoQiwyQkFBdUIsRUFBRSxJQUFJO0FBQzdCLHVCQUFtQixFQUFFLElBQUk7O0FBRXpCLFdBQU8sRUFBRSxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBRTs7QUFFN0IsbUJBQWUsRUFBQSxZQUFHO0FBQ2hCLFVBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUU7QUFDMUMsZUFBTyxnQkFBZ0IsQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbkUsTUFDSTtBQUNILGVBQU8sZ0JBQWdCLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25FO0tBQ0Y7O0FBRUQsc0JBQWtCLEVBQUEsWUFBRzs7QUFDbkIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLFFBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDM0MsUUFBSyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM5QyxRQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7T0FBQSxDQUM5QixDQUFDO0FBQ0YsVUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztBQUM5QixVQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO0FBQ2xDLFlBQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FDbkQsT0FBTyxDQUFDLFVBQUMsVUFBVTtlQUFLLFFBQUssVUFBVSxDQUFDLEdBQUcsUUFBSyxVQUFVLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLFNBQU07T0FBQSxDQUFDLENBQUM7S0FDakk7O0FBRUQscUJBQWlCLEVBQUEsWUFBRztBQUNsQixzQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckQ7O0FBRUQsNkJBQXlCLEVBQUEsVUFBQyxLQUFLLEVBQUU7QUFDL0Isc0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDaEQ7O0FBRUQsd0JBQW9CLEVBQUEsWUFBRztBQUNyQixzQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hDOztBQUVELEFBQUMsc0JBQWtCLDBCQUFBOztVQUNYLEtBQUssRUFDTCxhQUFhLEVBQ2IsT0FBTyxFQUNQLEtBQUssRUFDTCxJQUFJLEVBVU4sa0JBQWtCLEVBTWhCLGlCQUFpQixFQUNqQixZQUFZOzs7a0JBckJaLEtBQUssR0FBRyxRQUFLLEtBQUs7QUFDbEIseUJBQWEsR0FBRyxRQUFLLHlCQUF5QixDQUFDLEtBQUssQ0FBQztBQUNyRCxtQkFBTyxHQUFHLFFBQUssT0FBTztBQUN0QixpQkFBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQUssS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxnQkFBSSxHQUFHLFFBQUssT0FBTyxFQUFFOzttQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FDL0IsR0FBRyxDQUFDLFVBQUMsUUFBUTtxQkFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLHlCQUFDO29CQUN4QixRQUFRLFVBQ04sSUFBSSxFQUFFLEdBQUcsa0JBQ1YsU0FBUyxFQUFFLElBQUk7Ozs0QkFGaEIsUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUM7K0JBQ2xCLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztBQUExRCwwQkFBSSxVQUFKLElBQUk7QUFBRSx5QkFBRyxVQUFILEdBQUc7K0JBQ1MsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDOztBQUE5QiwrQkFBUztBQUFFLDBCQUFJOzs2QkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7NkJBQTNELEtBQUssQ0FBQyxRQUFRLENBQUM7Ozs7O2VBQ2hCLFdBQU8sQ0FBQzthQUFBLENBQUM7O0FBSVYsZ0JBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFNO0FBQzdCLGdDQUFrQixHQUFHLElBQUksUUFBSyxxQkFBcUIsQ0FBQyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMvRSxnQ0FBa0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQ3pDLENBQUMsQ0FBQzs7QUFFRyw2QkFBaUIsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7QUFDL0Msd0JBQVksR0FBRyxrQkFBa0IsQ0FBQyxlQUFlLEdBQUcsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEdBQUcsT0FBTztBQUN4Ryw4QkFBa0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOzs7bUJBRXBDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFVBQUMsY0FBYztxQkFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFLLHVCQUF1QixDQUFDLENBQUMsSUFBSSxVQUFPLGNBQWMsRUFBRSxZQUFZLENBQUM7YUFBQSxDQUFDOzs7OztLQUN0SixDQUFBOztBQUVELEFBQUMsMkJBQXVCLDBCQUFBLGtCQUFDLFNBQVMsRUFBRSxPQUFPO1VBSWpDLElBQUksRUFBRSxLQUFLLEVBS2Isa0JBQWtCOzs7O2dCQVJwQixDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQzs7Ozs7a0JBR2pCLElBQUksR0FBWSxTQUFTLENBQXpCLElBQUk7QUFBRSxpQkFBSyxHQUFLLFNBQVMsQ0FBbkIsS0FBSztpQkFDaEIsQ0FBQSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUE7Ozs7O2tCQUk3QyxrQkFBa0IsR0FBRyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDeEYsZ0JBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsRUFBRTtBQUN6QyxlQUFDLENBQUMsR0FBRyxDQUFDLFlBQU07QUFBRSxzQkFBTSxJQUFJLEtBQUssZ0JBQWMsa0JBQWtCLENBQUMsV0FBVyxpRkFBOEUsQ0FBQztlQUFFLENBQUMsQ0FBQzthQUM3SjtBQUNELDhCQUFrQixDQUFDLGtCQUFrQixFQUFFLENBQUM7O21CQUNsQyxrQkFBa0IsQ0FBQyxrQkFBa0IsRUFBRTs7QUFDN0MsOEJBQWtCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7Ozs7S0FDM0MsQ0FBQTs7QUFFRCxZQUFRLEVBQUEsVUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFFO21CQUNILGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQzs7VUFBMUQsSUFBSSxVQUFKLElBQUk7VUFBRSxHQUFHLFVBQUgsR0FBRzttQkFDZ0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDOzs7VUFBckMsY0FBYztVQUFFLE1BQU07QUFDN0IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3RELEVBRUYsQ0FBQzs7QUFFRixPQUFJLENBQUMsUUFBUSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzlCLFdBQU8sS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxZQUFZLEtBQUksQ0FBQztHQUNqRCxDQUFDOztBQUVGLFNBQU8sS0FBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIGNvbnN0IGZsdXhMb2NhdGlvblJlZ0V4cCA9IC9eKC4qKTpcXC8oLiopJC87XG5cbiAgY2xhc3MgRmx1eCB7XG4gICAgY29uc3RydWN0b3IoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICB0aGlzLmd1aWQgPSBndWlkO1xuICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICB0aGlzLnJlcSA9IHJlcTtcbiAgICAgIHRoaXMuc3RvcmVzID0ge307XG4gICAgICB0aGlzLmV2ZW50RW1pdHRlcnMgPSB7fTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcnMgPSB7fTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAqYm9vdHN0cmFwKCkgeyBfLmFic3RyYWN0KCk7IH0gLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5zdG9yZXMpLmZvckVhY2goKHN0b3JlTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50RW1pdHRlcnMpLmZvckVhY2goKGV2ZW50RW1pdHRlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRpc3BhdGNoZXJzKS5mb3JFYWNoKChkaXNwYXRjaGVyTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLmhlYWRlcnMgPSBudWxsO1xuICAgICAgdGhpcy53aW5kb3cgPSBudWxsO1xuICAgICAgdGhpcy5yZXEgPSBudWxsO1xuICAgICAgdGhpcy5zdG9yZXMgPSBudWxsO1xuICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzID0gbnVsbDtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcnMgPSBudWxsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGluamVjdGluZ0Zyb21TdG9yZXMoZm4pIHtcbiAgICAgIHRoaXMuX3N0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgY29uc3QgciA9IGZuKCk7XG4gICAgICB0aGlzLl9zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzO1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZShwID0ge30pIHtcbiAgICAgIGNvbnN0IHByZXZlbnRFbmNvZGluZyA9ICEhcC5wcmV2ZW50RW5jb2Rpbmc7XG4gICAgICBjb25zdCBzZXJpYWxpemFibGUgPSBfLm1hcFZhbHVlcyh0aGlzLnN0b3JlcywgKHN0b3JlKSA9PiBzdG9yZS5zZXJpYWxpemUoeyBwcmV2ZW50RW5jb2Rpbmc6IHRydWUgfSkpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHAgPSB7fSkge1xuICAgICAgY29uc3QgcHJldmVudERlY29kaW5nID0gISFwLnByZXZlbnREZWNvZGluZztcbiAgICAgIGNvbnN0IHVuc2VyaWFsaXphYmxlID0gcHJldmVudERlY29kaW5nID8gc2VyaWFsaXplZCA6IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUoc2VyaWFsaXplZCkpO1xuICAgICAgT2JqZWN0LmtleXModW5zZXJpYWxpemFibGUpLmZvckVhY2goKHN0b3JlTmFtZSkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLnN0b3Jlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpKTtcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS51bnNlcmlhbGl6ZSh1bnNlcmlhbGl6YWJsZVtzdG9yZU5hbWVdLCB7IHByZXZlbnREZWNvZGluZzogdHJ1ZSB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUsIHN0b3JlKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpXG4gICAgICApO1xuICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXSA9IHN0b3JlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlclN0b3JlKHN0b3JlTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLnN0b3Jlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpICYmXG4gICAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSlcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldFN0b3JlKHN0b3JlTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLnN0b3Jlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpICYmXG4gICAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICB9XG5cbiAgICByZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lLCBldmVudEVtaXR0ZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShldmVudEVtaXR0ZXJOYW1lKVxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXSA9IGV2ZW50RW1pdHRlcjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcilcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShldmVudEVtaXR0ZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXTtcbiAgICB9XG5cbiAgICByZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUsIGRpc3BhdGNoZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKSAmJlxuICAgICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVycy5zaG91bGQubm90LmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpXG4gICAgICApO1xuICAgICAgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0gPSBkaXNwYXRjaGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGRpc3BhdGNoZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzdG9yZS5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZS5TdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICByZXR1cm4gc3RvcmUudW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGNvbnN0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBldmVudEVtaXR0ZXIubGlzdGVuVG8ocm9vbSwgaGFuZGxlcik7XG4gICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfVxuXG4gICAgdW5saXN0ZW5Gcm9tKGV2ZW50RW1pdHRlck5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBjb25zdCBldmVudEVtaXR0ZXIgPSB0aGlzLmdldEV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKTtcbiAgICAgIHJldHVybiBldmVudEVtaXR0ZXIudW5saXN0ZW5Gcm9tKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGRpc3BhdGNoZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpICYmXG4gICAgICAgIGFjdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyLmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChGbHV4LnByb3RvdHlwZSwge1xuICAgIGhlYWRlcnM6IG51bGwsXG4gICAgZ3VpZDogbnVsbCxcbiAgICB3aW5kb3c6IG51bGwsXG4gICAgcmVxOiBudWxsLFxuICAgIHN0b3JlczogbnVsbCxcbiAgICBldmVudEVtaXR0ZXJzOiBudWxsLFxuICAgIGRpc3BhdGNoZXJzOiBudWxsLFxuICAgIF9zaG91bGRJbmplY3RGcm9tU3RvcmVzOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBGbHV4TWl4aW5TdGF0aWNzID0ge1xuICAgIHBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBsb2NhdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgY29uc3QgciA9IGZsdXhMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgIF8uZGV2KCgpID0+IChyICE9PSBudWxsKS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbmFtZTogclswXSwga2V5OiByWzFdIH07XG4gICAgfSxcblxuICAgIF9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgY29uc3QgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICAgIGNvbnN0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgICAgY29uc3Qgc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuaGFzQ2FjaGVkVmFsdWUocGF0aCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN0b3JlLmdldENhY2hlZFZhbHVlKHBhdGgpO1xuICAgICAgICAgIHJldHVybiBbc3RhdGVLZXksIHZhbHVlXTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSxcblxuICAgIF9nZXRJbml0aWFsU3RhdGVXaWxsTnVsbFZhbHVlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgbnVsbF07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRmx1eChwcm9wcykge1xuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgcHJvcHMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRTdWJzY3JpcHRpb25zID0gT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1trZXldKTtcblxuICAgICAgY29uc3QgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgY29uc3QgbmV4dExpc3RlbmVycyA9IHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpO1xuXG4gICAgICBPYmplY3Qua2V5cyhuZXh0U3Vic2NyaXB0aW9ucylcbiAgICAgIC5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZUtleSA9IG5leHRTdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgY29uc3QgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBjb25zdCBbc3RvcmVOYW1lLCBwYXRoXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICBGbHV4TWl4aW5TdGF0aWNzLl9zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHN0YXRlS2V5KTtcbiAgICAgIH0pO1xuXG4gICAgICBPYmplY3Qua2V5cyhuZXh0TGlzdGVuZXJzKVxuICAgICAgLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXh0TGlzdGVuZXJzW2xvY2F0aW9uXTtcbiAgICAgICAgY29uc3QgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBjb25zdCBbZXZlbnRFbWl0dGVyTmFtZSwgcm9vbV0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgRmx1eE1peGluU3RhdGljcy5fbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcik7XG4gICAgICB9KTtcblxuICAgICAgY3VycmVudFN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3Vic2NyaXB0aW9uKSA9PiB0aGlzLl91bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKSk7XG4gICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB0aGlzLl91bmxpc3RlbkZyb20obGlzdGVuZXIpKTtcbiAgICB9LFxuXG4gICAgX2NsZWFyRmx1eCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuX3Vuc3Vic2NyaWJlRnJvbSh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2tleV0pKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuX3VubGlzdGVuRnJvbSh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNba2V5XSkpO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlU3RvcmVVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0YXRlS2V5LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB2YWx1ZS5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgcmV0dXJuIFIuQXN5bmMuaWZNb3VudGVkKCgpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHRoaXMuZmx1eFN0b3JlV2lsbFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBbc3RhdGVLZXldOiB2YWx1ZSB9KTtcbiAgICAgICAgdGhpcy5mbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgfSlcbiAgICAgIC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBjb25zdCBwcm9wYWdhdGVVcGRhdGUgPSAodmFsdWUpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGZsdXguc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBwcm9wYWdhdGVVcGRhdGUpO1xuICAgICAgY29uc3QgaWQgPSBfLnVuaXF1ZUlkKHN0YXRlS2V5KTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbaWRdID0geyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uLCBpZCwgc3RvcmVOYW1lIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlLlN1YnNjcmlwdGlvbikgJiZcbiAgICAgICAgaWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0uc2hvdWxkLmJlLmV4YWN0bHkoc3Vic2NyaXB0aW9uKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGNvbnN0IHByb3BhZ2F0ZUV2ZW50ID0gKHBhcmFtcykgPT4gRmx1eE1peGluU3RhdGljcy5fcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gZmx1eC5saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwcm9wYWdhdGVFdmVudCk7XG4gICAgICBjb25zdCBpZCA9IF8udW5pcXVlSWQocm9vbSk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdID0geyBsaXN0ZW5lciwgaWQsIGV2ZW50RW1pdHRlck5hbWUgfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5saXN0ZW5Gcm9tKHsgbGlzdGVuZXIsIGlkLCBldmVudEVtaXR0ZXJOYW1lIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdLnNob3VsZC5iZS5leGFjdGx5KGxpc3RlbmVyKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5saXN0ZW5Gcm9tKGV2ZW50RW1pdHRlck5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGRlZmF1bHRJbXBsZW1lbnRhdGlvbnM6IHtcbiAgICAgIGdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKSB7IHJldHVybiB7fTsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikgeyByZXR1cm4gdm9pZCAwOyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikgeyByZXR1cm4gdm9pZCAwOyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICB9LFxuICB9O1xuXG4gIEZsdXguTWl4aW4gPSB7XG4gICAgX0ZsdXhNaXhpbjogdHJ1ZSxcbiAgICBfRmx1eE1peGluU3Vic2NyaXB0aW9uczogbnVsbCxcbiAgICBfRmx1eE1peGluTGlzdGVuZXJzOiBudWxsLFxuXG4gICAgc3RhdGljczogeyBGbHV4TWl4aW5TdGF0aWNzIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICBpZih0aGlzLmdldEZsdXgoKS5zaG91bGRJbmplY3RGcm9tU3RvcmVzKCkpIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZUZyb21GbHV4U3RvcmVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuZ2V0Rmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB0aGlzLmdldEZsdXgoKS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXG4gICAgICAgIHRoaXMuX0FzeW5jTWl4aW4uc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzID0ge307XG4gICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zID0ge307XG4gICAgICBPYmplY3Qua2V5cyhGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobWV0aG9kTmFtZSkgPT4gdGhpc1ttZXRob2ROYW1lXSA9IHRoaXNbbWV0aG9kTmFtZV0gfHwgRmx1eE1peGluU3RhdGljcy5kZWZhdWx0SW1wbGVtZW50YXRpb25zW21ldGhvZE5hbWVdLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3VwZGF0ZUZsdXguY2FsbCh0aGlzLCB0aGlzLnByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl9jbGVhckZsdXguY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgKnByZWZldGNoRmx1eFN0b3JlcygpIHtcbiAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgIGNvbnN0IHN0YXRlID0gXy5leHRlbmQoe30sIHRoaXMuc3RhdGUgfHwge30pO1xuICAgICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgeWllbGQgT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucylcbiAgICAgIC5tYXAoKHN0YXRlS2V5KSA9PiBfLmNvKF8uc2NvcGUoZnVuY3Rpb24qKCkge1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHN1YnNjcmlwdGlvbnNbc3RhdGVLZXldO1xuICAgICAgICBjb25zdCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgIGNvbnN0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgIHN0YXRlW3N0YXRlS2V5XSA9IHlpZWxkIGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKS5wdWxsKHBhdGgpO1xuICAgICAgfSwgdGhpcykpKTtcblxuICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIG9uZSwgYnV0IHRoaXMgdGltZSBpbmplY3QgZnJvbSB0aGUgcHJlZmV0Y2hlZCBzdG9yZXMuXG4gICAgICBsZXQgc3Vycm9nYXRlQ29tcG9uZW50O1xuICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHtcbiAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50ID0gbmV3IHRoaXMuX19SZWFjdE5leHVzU3Vycm9nYXRlKHsgY29udGV4dCwgcHJvcHMsIHN0YXRlIH0pO1xuICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XG4gICAgICBjb25zdCBjaGlsZENvbnRleHQgPSBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0ID8gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dDtcbiAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICB5aWVsZCBSZWFjdC5DaGlsZHJlbi5tYXBUcmVlKHJlbmRlcmVkQ29tcG9uZW50LCAoY2hpbGRDb21wb25lbnQpID0+IF8uY28ud3JhcCh0aGlzLl9wcmVmZXRjaENoaWxkQ29tcG9uZW50KS5jYWxsKHRoaXMsIGNoaWxkQ29tcG9uZW50LCBjaGlsZENvbnRleHQpKTtcbiAgICB9LFxuXG4gICAgKl9wcmVmZXRjaENoaWxkQ29tcG9uZW50KGNvbXBvbmVudCwgY29udGV4dCkge1xuICAgICAgaWYoIV8uaXNPYmplY3QoY29tcG9uZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB7IHR5cGUsIHByb3BzIH0gPSBjb21wb25lbnQ7XG4gICAgICBpZighXy5pc09iamVjdCh0eXBlKSB8fCAhdHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIGNoaWxkICh3aXRob3V0IGluamVjdGluZyBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3JlcykuXG4gICAgICBjb25zdCBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0LCBwcm9wcywgc3RhdGU6IHt9IH0pO1xuICAgICAgaWYoIXN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke3N1cnJvZ2F0ZUNvbXBvbmVudC5kaXNwbGF5TmFtZX0gZG9lc24ndCBpbXBsZW1lbnQgY29tcG9uZW50V2lsbE1vdW50LiBNYXliZSB5b3UgZm9yZ290IFIuQ29tcG9uZW50Lm1peGluID9gKTsgfSk7XG4gICAgICB9XG4gICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICB5aWVsZCBzdXJyb2dhdGVDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XG4gICAgICBzdXJyb2dhdGVDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuICAgICAgY29uc3QgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgY29uc3QgW2Rpc3BhdGNoZXJOYW1lLCBhY3Rpb25dID0gW25hbWUsIGtleV07XG4gICAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICByZXR1cm4gZmx1eC5kaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpO1xuICAgIH0sXG5cbiAgfTtcblxuICBGbHV4LlByb3BUeXBlID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgICByZXR1cm4gcHJvcHMuZmx1eCAmJiBwcm9wcy5mbHV4IGluc3RhbmNlb2YgRmx1eDtcbiAgfTtcblxuICByZXR1cm4gRmx1eDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=