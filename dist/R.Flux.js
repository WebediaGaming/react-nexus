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
        var _ref5 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref5.name;
        var key = _ref5.key;
        var _ref6 = [name, key];
        var _ref7 = Array.from(_ref6);

        var storeName = _ref7[0];
        var path = _ref7[1];
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
        var _ref8 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref8.name;
        var key = _ref8.key;
        var _ref9 = [name, key];
        var _ref10 = Array.from(_ref9);

        var storeName = _ref10[0];
        var path = _ref10[1];
        FluxMixinStatics._subscribeTo(storeName, path, stateKey);
      });

      Object.keys(nextListeners).forEach(function (location) {
        var handler = nextListeners[location];
        var _ref11 = FluxMixinStatics.parseFluxLocation(location);

        var name = _ref11.name;
        var key = _ref11.key;
        var _ref12 = [name, key];
        var _ref13 = Array.from(_ref12);

        var eventEmitterName = _ref13[0];
        var room = _ref13[1];
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

    _unsubscribeFrom: function (_ref14) {
      var _this25 = this;
      var subscription = _ref14.subscription;
      var id = _ref14.id;
      var storeName = _ref14.storeName;
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

    _unlistenFrom: function (_ref15) {
      var _this28 = this;
      var listener = _ref15.listener;
      var id = _ref15.id;
      var eventEmitterName = _ref15.eventEmitterName;
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

    prefetchFluxStores: regeneratorRuntime.mark(function _callee4() {
      var _this30 = this;
      var props, subscriptions, context, state, flux, surrogateComponent, renderedComponent, childContext;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (true) switch (_context4.prev = _context4.next) {
          case 0: props = _this30.props;
            subscriptions = _this30.getFluxStoreSubscriptions(props);
            context = _this30.context;
            state = _.extend({}, _this30.state || {});
            flux = _this30.getFlux();
            _context4.next = 7;
            return Object.keys(subscriptions) // jshint ignore:line
            .map(function (stateKey) {
              return _.copromise(regeneratorRuntime.mark(function _callee2() {
                var location, _ref16, name, key, _ref17, _ref18, storeName, path;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (true) switch (_context2.prev = _context2.next) {
                    case 0: location = subscriptions[stateKey];
                      _ref16 = FluxMixinStatics.parseFluxLocation(location);
                      name = _ref16.name;
                      key = _ref16.key;
                      _ref17 = [name, key];
                      _ref18 = Array.from(_ref17);
                      storeName = _ref18[0];
                      path = _ref18[1];
                      _context2.next = 10;
                      return flux.getStore(storeName).pull(path);
                    case 10: state[stateKey] = _context2.sent;
                    case 11:
                    case "end": return _context2.stop();
                  }
                }, _callee2, this);
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

            _context4.next = 13;
            return React.Children.mapTree(renderedComponent, function (childComponent) {
              return _.copromise(regeneratorRuntime.mark(function _callee3() {
                var childType, surrogateChildComponent;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (true) switch (_context3.prev = _context3.next) {
                    case 0:
                      if (_.isObject(childComponent)) {
                        _context3.next = 2;
                        break;
                      }
                      return _context3.abrupt("return");
                    case 2: childType = childComponent.type;
                      if (!(!_.isObject(childType) || !childType.__ReactNexusSurrogate)) {
                        _context3.next = 5;
                        break;
                      }
                      return _context3.abrupt("return");
                    case 5: surrogateChildComponent = new childType.__ReactNexusSurrogate({ context: childContext, props: childComponent.props });
                      if (!surrogateChildComponent.componentWillMount) {
                        _.dev(function () {
                          throw new Error("Component " + surrogateChildComponent.displayName + " doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?");
                        });
                      }
                      surrogateChildComponent.componentWillMount();
                      _context3.next = 10;
                      return surrogateChildComponent.prefetchFluxStores();
                    case 10:
                      surrogateChildComponent.componentWillUnmount();
                    case 11:
                    case "end": return _context3.stop();
                  }
                }, _callee3, this);
              }), _this30);
            });
          case 13:
          case "end": return _context4.stop();
        }
      }, _callee4, this);
    }),

    dispatch: function (location, params) {
      var _ref19 = FluxMixinStatics.parseFluxLocation(location);

      var name = _ref19.name;
      var key = _ref19.key;
      var _ref20 = [name, key];
      var _ref21 = Array.from(_ref20);

      var dispatcherName = _ref21[0];
      var action = _ref21[1];
      var flux = this.getFlux();
      return flux.dispatch(dispatcherName, action, params);
    } };

  _Flux.PropType = function (props) {
    return props.flux && props.flux instanceof _Flux;
  };

  return _Flux;
};
//# sourceMappingURL=data:application/json;base64,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QUFDLG9CQUFvQixFQUFFLENBQUM7Ozs7O2VBQ2hELFdBQU87YUFBQSxDQUFDOzs7OztLQUNWLENBQUE7O0FBRUQsWUFBUSxFQUFBLFVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRTttQkFDTCxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7O1VBQTFELElBQUksVUFBSixJQUFJO1VBQUUsR0FBRyxVQUFILEdBQUc7bUJBQ2dCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7O1VBQXJDLGNBQWM7VUFBRSxNQUFNO0FBQzNCLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN0RCxFQUVGLENBQUM7O0FBRUYsT0FBSSxDQUFDLFFBQVEsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUM5QixXQUFPLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksWUFBWSxLQUFJLENBQUM7R0FDakQsQ0FBQzs7QUFFRixTQUFPLEtBQUksQ0FBQztDQUNiLENBQUMiLCJmaWxlIjoiUi5GbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcblxuICBjb25zdCBmbHV4TG9jYXRpb25SZWdFeHAgPSAvXiguKik6XFwvKC4qKSQvO1xuXG4gIGNsYXNzIEZsdXgge1xuICAgIGNvbnN0cnVjdG9yKHsgaGVhZGVycywgZ3VpZCwgd2luZG93LCByZXEgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gaGVhZGVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgdGhpcy5ndWlkID0gZ3VpZDtcbiAgICAgIHRoaXMud2luZG93ID0gd2luZG93O1xuICAgICAgdGhpcy5yZXEgPSByZXE7XG4gICAgICB0aGlzLnN0b3JlcyA9IHt9O1xuICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzID0ge307XG4gICAgICB0aGlzLmRpc3BhdGNoZXJzID0ge307XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgKmJvb3RzdHJhcCgpIHsgXy5hYnN0cmFjdCgpOyB9IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3RvcmVzKS5mb3JFYWNoKChzdG9yZU5hbWUpID0+IHRoaXMudW5yZWdpc3RlclN0b3JlKHN0b3JlTmFtZSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5ldmVudEVtaXR0ZXJzKS5mb3JFYWNoKChldmVudEVtaXR0ZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kaXNwYXRjaGVycykuZm9yRWFjaCgoZGlzcGF0Y2hlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5oZWFkZXJzID0gbnVsbDtcbiAgICAgIHRoaXMud2luZG93ID0gbnVsbDtcbiAgICAgIHRoaXMucmVxID0gbnVsbDtcbiAgICAgIHRoaXMuc3RvcmVzID0gbnVsbDtcbiAgICAgIHRoaXMuZXZlbnRFbWl0dGVycyA9IG51bGw7XG4gICAgICB0aGlzLmRpc3BhdGNoZXJzID0gbnVsbDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLnNob3VsZC5iZS5vayk7XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbmplY3RpbmdGcm9tU3RvcmVzKGZuKSB7XG4gICAgICB0aGlzLl9zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcbiAgICAgIGxldCByID0gZm4oKTtcbiAgICAgIHRoaXMuX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBzaG91bGRJbmplY3RGcm9tU3RvcmVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXM7XG4gICAgfVxuXG4gICAgc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nIH0pIHtcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLm1hcFZhbHVlcyh0aGlzLnN0b3JlcywgKHN0b3JlKSA9PiBzdG9yZS5zZXJpYWxpemUoeyBwcmV2ZW50RW5jb2Rpbmc6IHRydWUgfSkpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIGxldCB1bnNlcmlhbGl6YWJsZSA9IHByZXZlbnREZWNvZGluZyA/IHNlcmlhbGl6ZWQgOiBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHNlcmlhbGl6ZWQpKTtcbiAgICAgIE9iamVjdC5rZXlzKHVuc2VyaWFsaXphYmxlKS5mb3JFYWNoKChzdG9yZU5hbWUpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSk7XG4gICAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0udW5zZXJpYWxpemUodW5zZXJpYWxpemFibGVbc3RvcmVOYW1lXSwgeyBwcmV2ZW50RGVjb2Rpbmc6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lLCBzdG9yZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLnN0b3Jlcy5zaG91bGQubm90LmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKVxuICAgICAgKTtcbiAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0gPSBzdG9yZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSAmJlxuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRTdG9yZShzdG9yZU5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5zdG9yZXMuc2hvdWxkLmhhdmUucHJvcGVydHkoc3RvcmVOYW1lKSAmJlxuICAgICAgICB0aGlzLnN0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV07XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnRFbWl0dGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVycy5zaG91bGQubm90LmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSlcbiAgICAgICk7XG4gICAgICB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0gPSBldmVudEVtaXR0ZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShldmVudEVtaXR0ZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldEV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV07XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lLCBkaXNwYXRjaGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcbiAgICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hlcnMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KGRpc3BhdGNoZXJOYW1lKVxuICAgICAgKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdID0gZGlzcGF0Y2hlcjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzLnNob3VsZC5oYXZlLnByb3BlcnR5KGRpc3BhdGNoZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmRpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLnN0b3Jlcy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShzdG9yZU5hbWUpICYmXG4gICAgICAgIHRoaXMuc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGxldCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBzdG9yZS5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuc3RvcmVzLnNob3VsZC5oYXZlLnByb3BlcnR5KHN0b3JlTmFtZSkgJiZcbiAgICAgICAgdGhpcy5zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZS5TdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgbGV0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgcmV0dXJuIHN0b3JlLnVuc3Vic2NyaWJlRnJvbShzdWJzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIGxpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShldmVudEVtaXR0ZXJOYW1lKSAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XG4gICAgICBsZXQgbGlzdGVuZXIgPSBldmVudEVtaXR0ZXIubGlzdGVuVG8ocm9vbSwgaGFuZGxlcik7XG4gICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfVxuXG4gICAgdW5saXN0ZW5Gcm9tKGV2ZW50RW1pdHRlck5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlcnMuc2hvdWxkLmhhdmUucHJvcGVydHkoZXZlbnRFbWl0dGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBsZXQgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XG4gICAgICByZXR1cm4gZXZlbnRFbWl0dGVyLnVubGlzdGVuRnJvbShsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goZGlzcGF0Y2hlck5hbWUsIGFjdGlvbiwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eShkaXNwYXRjaGVyTmFtZSkgJiZcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKSAmJlxuICAgICAgICBhY3Rpb24uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEZsdXgucHJvdG90eXBlLCB7XG4gICAgaGVhZGVyczogbnVsbCxcbiAgICBndWlkOiBudWxsLFxuICAgIHdpbmRvdzogbnVsbCxcbiAgICByZXE6IG51bGwsXG4gICAgc3RvcmVzOiBudWxsLFxuICAgIGV2ZW50RW1pdHRlcnM6IG51bGwsXG4gICAgZGlzcGF0Y2hlcnM6IG51bGwsXG4gICAgX3Nob3VsZEluamVjdEZyb21TdG9yZXM6IG51bGwsXG4gIH0pO1xuXG4gIGNvbnN0IEZsdXhNaXhpblN0YXRpY3MgPSB7XG4gICAgcGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGxvY2F0aW9uLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICBsZXQgciA9IGZsdXhMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgIF8uZGV2KCgpID0+IChyICE9PSBudWxsKS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbmFtZTogclswXSwga2V5OiByWzFdIH07XG4gICAgfSxcblxuICAgIF9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgICBsZXQgc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuaGFzQ2FjaGVkVmFsdWUocGF0aCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBzdG9yZS5nZXRDYWNoZWRWYWx1ZShwYXRoKTtcbiAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCB2YWx1ZV07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfZ2V0SW5pdGlhbFN0YXRlV2lsbE51bGxWYWx1ZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgbnVsbF07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRmx1eChwcm9wcykge1xuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgcHJvcHMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNba2V5XSk7XG4gICAgICBsZXQgY3VycmVudExpc3RlbmVycyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pO1xuXG4gICAgICBsZXQgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgbGV0IG5leHRMaXN0ZW5lcnMgPSB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dFN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgbGV0IHN0YXRlS2V5ID0gbmV4dFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgRmx1eE1peGluU3RhdGljcy5fc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSk7XG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dExpc3RlbmVycylcbiAgICAgIC5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICBsZXQgaGFuZGxlciA9IG5leHRMaXN0ZW5lcnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW2V2ZW50RW1pdHRlck5hbWUsIHJvb21dID0gW25hbWUsIGtleV07XG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGN1cnJlbnRTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbikpO1xuICAgICAgY3VycmVudExpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gdGhpcy5fdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSk7XG4gICAgfSxcblxuICAgIF9jbGVhckZsdXgoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bnN1YnNjcmliZUZyb20odGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bmxpc3RlbkZyb20odGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pKTtcbiAgICB9LFxuXG4gICAgX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7XG4gICAgICBfLmRldigoKSA9PiBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdmFsdWUuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHJldHVybiBSLkFzeW5jLmlmTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgW3N0YXRlS2V5XTogdmFsdWUgfSk7XG4gICAgICAgIHRoaXMuZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3N1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgc3RhdGVLZXkpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgc3RhdGVLZXkuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBwcm9wYWdhdGVVcGRhdGUgPSAodmFsdWUpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBmbHV4LnN1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgcHJvcGFnYXRlVXBkYXRlKTtcbiAgICAgIGxldCBpZCA9IF8udW5pcXVlSWQoc3RhdGVLZXkpO1xuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0gPSB7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXS5zaG91bGQuYmUuZXhhY3RseShzdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgcHJvcGFnYXRlRXZlbnQgPSAocGFyYW1zKSA9PiBGbHV4TWl4aW5TdGF0aWNzLl9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gZmx1eC5saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwcm9wYWdhdGVFdmVudCk7XG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHJvb20pO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXIsIGlkLCBldmVudEVtaXR0ZXJOYW1lIH07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3VubGlzdGVuRnJvbSh7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcikgJiZcbiAgICAgICAgaWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXS5zaG91bGQuYmUuZXhhY3RseShsaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZGVmYXVsdEltcGxlbWVudGF0aW9uczoge1xuICAgICAgZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykgeyByZXR1cm4ge307IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIH0sXG4gIH07XG5cbiAgRmx1eC5NaXhpbiA9IHtcbiAgICBfRmx1eE1peGluOiB0cnVlLFxuICAgIF9GbHV4TWl4aW5TdWJzY3JpcHRpb25zOiBudWxsLFxuICAgIF9GbHV4TWl4aW5MaXN0ZW5lcnM6IG51bGwsXG5cbiAgICBzdGF0aWNzOiB7IEZsdXhNaXhpblN0YXRpY3MgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlRnJvbUZsdXhTdG9yZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlV2lsbE51bGxWYWx1ZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRGbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuZ2V0Rmx1eCgpLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRmx1eCkgJiZcbiAgICAgICAgdGhpcy5fQXN5bmNNaXhpbi5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMgPSB7fTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9ucylcbiAgICAgIC5mb3JFYWNoKChtZXRob2ROYW1lKSA9PiB0aGlzW21ldGhvZE5hbWVdID0gdGhpc1ttZXRob2ROYW1lXSB8fCBGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnNbbWV0aG9kTmFtZV0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHRoaXMucHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl91cGRhdGVGbHV4LmNhbGwodGhpcywgcHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2NsZWFyRmx1eC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICAqcHJlZmV0Y2hGbHV4U3RvcmVzKCkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcyk7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgIGxldCBzdGF0ZSA9IF8uZXh0ZW5kKHt9LCB0aGlzLnN0YXRlIHx8IHt9KTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICB5aWVsZCBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIC5tYXAoKHN0YXRlS2V5KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IHN1YnNjcmlwdGlvbnNbc3RhdGVLZXldO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgc3RhdGVbc3RhdGVLZXldID0geWllbGQgZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpLnB1bGwocGF0aCk7XG4gICAgICB9LCB0aGlzKSk7XG5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBjb21wb25lbnQsIHN1cnJvZ2F0ZSBmb3IgdGhpcyBvbmUsIGJ1dCB0aGlzIHRpbWUgaW5qZWN0IGZyb20gdGhlIHByZWZldGNoZWQgc3RvcmVzLlxuICAgICAgbGV0IHN1cnJvZ2F0ZUNvbXBvbmVudDtcbiAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiB7XG4gICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudCA9IG5ldyB0aGlzLl9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7IGNvbnRleHQsIHByb3BzLCBzdGF0ZSB9KTtcbiAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCByZW5kZXJlZENvbXBvbmVudCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGxldCBjaGlsZENvbnRleHQgPSBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0ID8gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dDtcbiAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICB5aWVsZCBSZWFjdC5DaGlsZHJlbi5tYXBUcmVlKHJlbmRlcmVkQ29tcG9uZW50LCAoY2hpbGRDb21wb25lbnQpID0+IF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkQ29tcG9uZW50KSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2hpbGRUeXBlID0gY2hpbGRDb21wb25lbnQudHlwZTtcbiAgICAgICAgaWYoIV8uaXNPYmplY3QoY2hpbGRUeXBlKSB8fCAhY2hpbGRUeXBlLl9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgY2hpbGQgKHdpdGhvdXQgaW5qZWN0aW5nIGZyb20gdGhlIHByZWZldGNoZWQgc3RvcmVzKS5cbiAgICAgICAgbGV0IHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50ID0gbmV3IGNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0OiBjaGlsZENvbnRleHQsIHByb3BzOiBjaGlsZENvbXBvbmVudC5wcm9wcyB9KTtcbiAgICAgICAgaWYoIXN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IHsgdGhyb3cgbmV3IEVycm9yKGBDb21wb25lbnQgJHtzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5kaXNwbGF5TmFtZX0gZG9lc24ndCBpbXBsZW1lbnQgY29tcG9uZW50V2lsbE1vdW50LiBNYXliZSB5b3UgZm9yZ290IFIuQ29tcG9uZW50Lm1peGluID9gKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgIHlpZWxkIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgfSwgdGhpcykpO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaChsb2NhdGlvbiwgcGFyYW1zKSB7XG4gICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgbGV0IFtkaXNwYXRjaGVyTmFtZSwgYWN0aW9uXSA9IFtuYW1lLCBrZXldO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIHJldHVybiBmbHV4LmRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcyk7XG4gICAgfSxcblxuICB9O1xuXG4gIEZsdXguUHJvcFR5cGUgPSBmdW5jdGlvbihwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5mbHV4ICYmIHByb3BzLmZsdXggaW5zdGFuY2VvZiBGbHV4O1xuICB9O1xuXG4gIHJldHVybiBGbHV4O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==