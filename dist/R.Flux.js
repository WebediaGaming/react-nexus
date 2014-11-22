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
        var _ref5 = Array.from(_ref4);

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
        var _ref8 = Array.from(_ref7);

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
        var _ref11 = Array.from(_ref10);

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
                      _ref16 = Array.from(_ref15);
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
      var _ref19 = Array.from(_ref18);

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
//# sourceMappingURL=data:application/json;base64,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STdDLGtCQUFrQixHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4RixnQkFBRyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFO0FBQ3pDLGVBQUMsQ0FBQyxHQUFHLENBQUMsWUFBTTtBQUFFLHNCQUFNLElBQUksS0FBSyxnQkFBYyxrQkFBa0IsQ0FBQyxXQUFXLGlGQUE4RSxDQUFDO2VBQUUsQ0FBQyxDQUFDO2FBQzdKO0FBQ0QsOEJBQWtCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7bUJBQ2xDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFOztBQUM3Qyw4QkFBa0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOzs7OztLQUMzQyxDQUFBOztBQUVELFlBQVEsRUFBQSxVQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUU7bUJBQ0gsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDOztVQUExRCxJQUFJLFVBQUosSUFBSTtVQUFFLEdBQUcsVUFBSCxHQUFHO21CQUNnQixDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7OztVQUFyQyxjQUFjO1VBQUUsTUFBTTtBQUM3QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdEQsRUFFRixDQUFDOztBQUVGLE9BQUksQ0FBQyxRQUFRLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDOUIsV0FBTyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLFlBQVksS0FBSSxDQUFDO0dBQ2pELENBQUM7O0FBRUYsU0FBTyxLQUFJLENBQUM7Q0FDYixDQUFDIiwiZmlsZSI6IlIuRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgY29uc3QgZmx1eExvY2F0aW9uUmVnRXhwID0gL14oLiopOlxcLyguKikkLztcblxuICBjbGFzcyBGbHV4IHtcbiAgICBjb25zdHJ1Y3Rvcih7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdywgcmVxIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcbiAgICAgIHRoaXMuZ3VpZCA9IGd1aWQ7XG4gICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcbiAgICAgIHRoaXMucmVxID0gcmVxO1xuICAgICAgdGhpcy5zdG9yZXMgPSB7fTtcbiAgICAgIHRoaXMuZXZlbnRFbWl0dGVycyA9IHt9O1xuICAgICAgdGhpcy5kaXNwYXRjaGVycyA9IHt9O1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgIH1cblxuICAgICpib290c3RyYXAoKSB7IF8uYWJzdHJhY3QoKTsgfSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN0b3JlcykuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRFbWl0dGVycykuZm9yRWFjaCgoZXZlbnRFbWl0dGVyTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGlzcGF0Y2hlcnMpLmZvckVhY2goKGRpc3BhdGNoZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuaGVhZGVycyA9IG51bGw7XG4gICAgICB0aGlzLndpbmRvdyA9IG51bGw7XG4gICAgICB0aGlzLnJlcSA9IG51bGw7XG4gICAgICB0aGlzLnN0b3JlcyA9IG51bGw7XG4gICAgICB0aGlzLmV2ZW50RW1pdHRlcnMgPSBudWxsO1xuICAgICAgdGhpcy5kaXNwYXRjaGVycyA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW5qZWN0aW5nRnJvbVN0b3Jlcyhmbikge1xuICAgICAgdGhpcy5fc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICBjb25zdCByID0gZm4oKTtcbiAgICAgIHRoaXMuX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBzaG91bGRJbmplY3RGcm9tU3RvcmVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXM7XG4gICAgfVxuXG4gICAgc2VyaWFsaXplKHAgPSB7fSkge1xuICAgICAgY29uc3QgcHJldmVudEVuY29kaW5nID0gISFwLnByZXZlbnRFbmNvZGluZztcbiAgICAgIGNvbnN0IHNlcmlhbGl6YWJsZSA9IF8ubWFwVmFsdWVzKHRoaXMuc3RvcmVzLCAoc3RvcmUpID0+IHN0b3JlLnNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZzogdHJ1ZSB9KSk7XG4gICAgICByZXR1cm4gcHJldmVudEVuY29kaW5nID8gc2VyaWFsaXphYmxlIDogXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphYmxlKSk7XG4gICAgfVxuXG4gICAgdW5zZXJpYWxpemUoc2VyaWFsaXplZCwgcCA9IHt9KSB7XG4gICAgICBjb25zdCBwcmV2ZW50RGVjb2RpbmcgPSAhIXAucHJldmVudERlY29kaW5nO1xuICAgICAgY29uc3QgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBPYmplY3Qua2V5cyh1bnNlcmlhbGl6YWJsZSkuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkpO1xuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnVuc2VyaWFsaXplKHVuc2VyaWFsaXphYmxlW3N0b3JlTmFtZV0sIHsgcHJldmVudERlY29kaW5nOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZWdpc3RlclN0b3JlKHN0b3JlTmFtZSwgc3RvcmUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSlcbiAgICAgICk7XG4gICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdID0gc3RvcmU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0U3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50RW1pdHRlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpXG4gICAgICApO1xuICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdID0gZXZlbnRFbWl0dGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGV2ZW50RW1pdHRlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSwgZGlzcGF0Y2hlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpICYmXG4gICAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXSA9IGRpc3BhdGNoZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcilcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSAmJlxuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN0b3JlLnN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oc3RvcmVOYW1lLCBzdWJzY3JpcHRpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSAmJlxuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlLlN1YnNjcmlwdGlvbilcbiAgICAgICk7XG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIHJldHVybiBzdG9yZS51bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBsaXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgY29uc3QgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGV2ZW50RW1pdHRlci5saXN0ZW5Ubyhyb29tLCBoYW5kbGVyKTtcbiAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9XG5cbiAgICB1bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShldmVudEVtaXR0ZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgcmV0dXJuIGV2ZW50RW1pdHRlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZGlzcGF0Y2hlck5hbWUpICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcbiAgICAgICAgYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGRpc3BhdGNoZXIgPSB0aGlzLmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEZsdXgucHJvdG90eXBlLCB7XG4gICAgaGVhZGVyczogbnVsbCxcbiAgICBndWlkOiBudWxsLFxuICAgIHdpbmRvdzogbnVsbCxcbiAgICByZXE6IG51bGwsXG4gICAgc3RvcmVzOiBudWxsLFxuICAgIGV2ZW50RW1pdHRlcnM6IG51bGwsXG4gICAgZGlzcGF0Y2hlcnM6IG51bGwsXG4gICAgX3Nob3VsZEluamVjdEZyb21TdG9yZXM6IG51bGwsXG4gIH0pO1xuXG4gIGNvbnN0IEZsdXhNaXhpblN0YXRpY3MgPSB7XG4gICAgcGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGxvY2F0aW9uLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICBjb25zdCByID0gZmx1eExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuICAgICAgXy5kZXYoKCkgPT4gKHIgIT09IG51bGwpLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBuYW1lOiByWzBdLCBrZXk6IHJbMV0gfTtcbiAgICB9LFxuXG4gICAgX2dldEluaXRpYWxTdGF0ZUZyb21GbHV4U3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGVLZXkgPSBzdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgICBjb25zdCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgICAgY29uc3QgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5oYXNDYWNoZWRWYWx1ZShwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gc3RvcmUuZ2V0Q2FjaGVkVmFsdWUocGF0aCk7XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgdmFsdWVdO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGVLZXkgPSBzdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCBudWxsXTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSxcblxuICAgIF91cGRhdGVGbHV4KHByb3BzKSB7XG4gICAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICBwcm9wcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgY29uc3QgY3VycmVudFN1YnNjcmlwdGlvbnMgPSBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zKVxuICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2tleV0pO1xuICAgICAgY29uc3QgY3VycmVudExpc3RlbmVycyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pO1xuXG4gICAgICBjb25zdCBuZXh0U3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcyk7XG4gICAgICBjb25zdCBuZXh0TGlzdGVuZXJzID0gdGhpcy5nZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcyk7XG5cbiAgICAgIE9iamVjdC5rZXlzKG5leHRTdWJzY3JpcHRpb25zKVxuICAgICAgLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlS2V5ID0gbmV4dFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICBjb25zdCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgIGNvbnN0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3N1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgc3RhdGVLZXkpO1xuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5rZXlzKG5leHRMaXN0ZW5lcnMpXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IG5leHRMaXN0ZW5lcnNbbG9jYXRpb25dO1xuICAgICAgICBjb25zdCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgIGNvbnN0IFtldmVudEVtaXR0ZXJOYW1lLCByb29tXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICBGbHV4TWl4aW5TdGF0aWNzLl9saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBjdXJyZW50U3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWJzY3JpcHRpb24pID0+IHRoaXMuX3Vuc3Vic2NyaWJlRnJvbShzdWJzY3JpcHRpb24pKTtcbiAgICAgIGN1cnJlbnRMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHRoaXMuX3VubGlzdGVuRnJvbShsaXN0ZW5lcikpO1xuICAgIH0sXG5cbiAgICBfY2xlYXJGbHV4KCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNba2V5XSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluTGlzdGVuZXJzKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5fdW5saXN0ZW5Gcm9tKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1trZXldKSk7XG4gICAgfSxcblxuICAgIF9wcm9wYWdhdGVTdG9yZVVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RhdGVLZXkuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHZhbHVlLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IFtzdGF0ZUtleV06IHZhbHVlIH0pO1xuICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XG4gICAgICB9KVxuICAgICAgLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF9zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHN0YXRlS2V5KSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHN0YXRlS2V5LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGNvbnN0IHByb3BhZ2F0ZVVwZGF0ZSA9ICh2YWx1ZSkgPT4gRmx1eE1peGluU3RhdGljcy5fcHJvcGFnYXRlU3RvcmVVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gZmx1eC5zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHByb3BhZ2F0ZVVwZGF0ZSk7XG4gICAgICBjb25zdCBpZCA9IF8udW5pcXVlSWQoc3RhdGVLZXkpO1xuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0gPSB7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXS5zaG91bGQuYmUuZXhhY3RseShzdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bnN1YnNjcmliZUZyb20oc3RvcmVOYW1lLCBzdWJzY3JpcHRpb24pO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbaWRdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBSLkFzeW5jLmlmTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgICBoYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyRGlkRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgfSlcbiAgICAgIC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgY29uc3QgcHJvcGFnYXRlRXZlbnQgPSAocGFyYW1zKSA9PiBGbHV4TWl4aW5TdGF0aWNzLl9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBmbHV4Lmxpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHByb3BhZ2F0ZUV2ZW50KTtcbiAgICAgIGNvbnN0IGlkID0gXy51bmlxdWVJZChyb29tKTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF0gPSB7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bmxpc3RlbkZyb20oeyBsaXN0ZW5lciwgaWQsIGV2ZW50RW1pdHRlck5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIpICYmXG4gICAgICAgIGlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF0uc2hvdWxkLmJlLmV4YWN0bHkobGlzdGVuZXIpXG4gICAgICApO1xuICAgICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZGVmYXVsdEltcGxlbWVudGF0aW9uczoge1xuICAgICAgZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykgeyByZXR1cm4ge307IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIH0sXG4gIH07XG5cbiAgRmx1eC5NaXhpbiA9IHtcbiAgICBfRmx1eE1peGluOiB0cnVlLFxuICAgIF9GbHV4TWl4aW5TdWJzY3JpcHRpb25zOiBudWxsLFxuICAgIF9GbHV4TWl4aW5MaXN0ZW5lcnM6IG51bGwsXG5cbiAgICBzdGF0aWNzOiB7IEZsdXhNaXhpblN0YXRpY3MgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlRnJvbUZsdXhTdG9yZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlV2lsbE51bGxWYWx1ZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRGbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuZ2V0Rmx1eCgpLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRmx1eCkgJiZcbiAgICAgICAgdGhpcy5fQXN5bmNNaXhpbi5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMgPSB7fTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9ucylcbiAgICAgIC5mb3JFYWNoKChtZXRob2ROYW1lKSA9PiB0aGlzW21ldGhvZE5hbWVdID0gdGhpc1ttZXRob2ROYW1lXSB8fCBGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnNbbWV0aG9kTmFtZV0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHRoaXMucHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl91cGRhdGVGbHV4LmNhbGwodGhpcywgcHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2NsZWFyRmx1eC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICAqcHJlZmV0Y2hGbHV4U3RvcmVzKCkge1xuICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcyk7XG4gICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgY29uc3Qgc3RhdGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSB8fCB7fSk7XG4gICAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICB5aWVsZCBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgLm1hcCgoc3RhdGVLZXkpID0+IF8uY28oXy5zY29wZShmdW5jdGlvbiooKSB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gc3Vic2NyaXB0aW9uc1tzdGF0ZUtleV07XG4gICAgICAgIGNvbnN0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgY29uc3QgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgc3RhdGVbc3RhdGVLZXldID0geWllbGQgZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpLnB1bGwocGF0aCk7XG4gICAgICB9LCB0aGlzKSkpO1xuXG4gICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgb25lLCBidXQgdGhpcyB0aW1lIGluamVjdCBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3Jlcy5cbiAgICAgIGxldCBzdXJyb2dhdGVDb21wb25lbnQ7XG4gICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4ge1xuICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdGhpcy5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0LCBwcm9wcywgc3RhdGUgfSk7XG4gICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZW5kZXJlZENvbXBvbmVudCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbnN0IGNoaWxkQ29udGV4dCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQgPyBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkgOiBjb250ZXh0O1xuICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgIHlpZWxkIFJlYWN0LkNoaWxkcmVuLm1hcFRyZWUocmVuZGVyZWRDb21wb25lbnQsIChjaGlsZENvbXBvbmVudCkgPT4gXy5jby53cmFwKHRoaXMuX3ByZWZldGNoQ2hpbGRDb21wb25lbnQpLmNhbGwodGhpcywgY2hpbGRDb21wb25lbnQsIGNoaWxkQ29udGV4dCkpO1xuICAgIH0sXG5cbiAgICAqX3ByZWZldGNoQ2hpbGRDb21wb25lbnQoY29tcG9uZW50LCBjb250ZXh0KSB7XG4gICAgICBpZighXy5pc09iamVjdChjb21wb25lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgdHlwZSwgcHJvcHMgfSA9IGNvbXBvbmVudDtcbiAgICAgIGlmKCFfLmlzT2JqZWN0KHR5cGUpIHx8ICF0eXBlLl9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgY2hpbGQgKHdpdGhvdXQgaW5qZWN0aW5nIGZyb20gdGhlIHByZWZldGNoZWQgc3RvcmVzKS5cbiAgICAgIGNvbnN0IHN1cnJvZ2F0ZUNvbXBvbmVudCA9IG5ldyB0eXBlLl9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7IGNvbnRleHQsIHByb3BzLCBzdGF0ZToge30gfSk7XG4gICAgICBpZighc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICBfLmRldigoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7c3Vycm9nYXRlQ29tcG9uZW50LmRpc3BsYXlOYW1lfSBkb2Vzbid0IGltcGxlbWVudCBjb21wb25lbnRXaWxsTW91bnQuIE1heWJlIHlvdSBmb3Jnb3QgUi5Db21wb25lbnQubWl4aW4gP2ApOyB9KTtcbiAgICAgIH1cbiAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgIHlpZWxkIHN1cnJvZ2F0ZUNvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaChsb2NhdGlvbiwgcGFyYW1zKSB7XG4gICAgICBjb25zdCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICBjb25zdCBbZGlzcGF0Y2hlck5hbWUsIGFjdGlvbl0gPSBbbmFtZSwga2V5XTtcbiAgICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIHJldHVybiBmbHV4LmRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcyk7XG4gICAgfSxcblxuICB9O1xuXG4gIEZsdXguUHJvcFR5cGUgPSBmdW5jdGlvbihwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5mbHV4ICYmIHByb3BzLmZsdXggaW5zdGFuY2VvZiBGbHV4O1xuICB9O1xuXG4gIHJldHVybiBGbHV4O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==