"use strict";

var _toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
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
        return headers.should.be.an.Object && guid.should.be.a.String && (__NODE__) ? req.should.be.an.Object : window.should.be.an.Object;
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
              return (_this4.stores[storeName] !== void 0).should.be.ok;
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
            return store.should.be.an.instanceOf(R.Store) && storeName.should.be.a.String && (_this5.stores[storeName] === void 0).should.be.ok;
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
            return storeName.should.be.a.String && (_this6.stores[storeName] !== void 0).should.be.ok && _this6.stores[storeName].should.be.an.instanceOf(R.Store);
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
            return storeName.should.be.a.String && (_this7.stores[storeName] !== void 0).should.be.ok && _this7.stores[storeName].should.be.an.instanceOf(R.Store);
          });
          return this.stores[storeName];
        }
      },
      registerEventEmitter: {
        writable: true,
        value: function (eventEmitterName, eventEmitter) {
          var _this8 = this;
          _.dev(function () {
            return eventEmitter.should.be.an.instanceOf(R.EventEmitter) && eventEmitterName.should.be.a.String && (_this8.eventEmitters[eventEmitterName] === void 0).should.be.ok;
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
            return eventEmitterName.should.be.a.String && (_this9.eventEmitters[eventEmitterName] !== void 0).should.be.ok && _this9.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
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
            return eventEmitterName.should.be.a.String && (_this10.eventEmitters[eventEmitterName] !== void 0).should.be.ok && _this10.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
          });
          return this.eventEmitters[eventEmitterName];
        }
      },
      registerDispatcher: {
        writable: true,
        value: function (dispatcherName, dispatcher) {
          var _this11 = this;
          _.dev(function () {
            return dispatcher.should.be.an.instanceOf(R.Dispatcher) && dispatcherName.should.be.a.String && (_this11.dispatchers[dispatcherName] === void 0).should.be.ok;
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
            return dispatcherName.should.be.a.String && (_this12.dispatchers[dispatcherName] !== void 0).should.be.ok && _this12.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
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
            return dispatcherName.should.be.a.String && (_this13.dispatchers[dispatcherName] !== void 0).should.be.ok && _this13.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
          });
          return this.dispatchers[dispatcherName];
        }
      },
      subscribeTo: {
        writable: true,
        value: function (storeName, path, handler) {
          var _this14 = this;
          _.dev(function () {
            return storeName.should.be.a.String && (_this14.stores[storeName] !== void 0).should.be.ok && _this14.stores[storeName].should.be.an.instanceOf(R.Store) && path.should.be.a.String && handler.should.be.a.Function;
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
            return storeName.should.be.a.String && (_this15.stores[storeName] !== void 0).should.be.ok && _this15.stores[storeName].should.be.an.instanceOf(R.Store) && subscription.should.be.an.instanceOf(R.Store.Subscription);
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
            return eventEmitterName.should.be.a.String && (_this16.eventEmitters[eventEmitterName] !== void 0).should.be.ok && _this16.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && room.should.be.a.String && handler.should.be.a.Function;
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
            return eventEmitterName.should.be.a.String && (_this17.eventEmitters[eventEmitterName] !== void 0).should.be.ok && _this17.eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && listener.should.be.an.instanceOf(R.EventEmitter.Listener);
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
            return dispatcherName.should.be.a.String && (_this18.dispatchers[dispatcherName] !== void 0).should.be.ok && _this18.dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher) && action.should.be.a.String && params.should.be.an.Object;
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
              return _.co(regeneratorRuntime.mark(function _callee2() {
                var _ref14, name, key;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (true) switch (_context2.prev = _context2.next) {
                    case 0: _ref14 = FluxMixinStatics.parseFluxLocation(subscriptions[stateKey]);
                      name = _ref14.name;
                      key = _ref14.key;
                      _context2.next = 5;
                      return flux.getStore(name).pull(key);
                    case 5: state[stateKey] = _context2.sent;
                    case 6:
                    case "end": return _context2.stop();
                  }
                }, _callee2, this);
              }));
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
      var _ref15 = FluxMixinStatics.parseFluxLocation(location);

      var name = _ref15.name;
      var key = _ref15.key;
      var _ref16 = [name, key];
      var _ref17 = _toArray(_ref16);

      var dispatcherName = _ref17[0];
      var action = _ref17[1];
      var flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    } };

  _Flux.PropType = function (props) {
    return props.flux && props.flux instanceof _Flux;
  };

  return _Flux;
};