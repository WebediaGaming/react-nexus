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
          Object.keys(this._stores).forEach(function (storeName) {
            return _this.unregisterStore(storeName);
          });
          Object.keys(this._eventEmitters).forEach(function (eventEmitterName) {
            return _this.unregisterEventEmitter(eventEmitterName);
          });
          Object.keys(this._dispatchers).forEach(function (dispatcherName) {
            return _this.unregisterDispatcher(dispatcherName);
          });
          // Nullify references
          this._headers = null;
          this._window = null;
          this._req = null;
          this._stores = null;
          this._eventEmitters = null;
          this._dispatchers = null;
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
          var serializable = _.mapValues(this._stores, function (store) {
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
              return _this4._stores[storeName].should.be.ok;
            });
            _this4._stores[storeName].unserialize(unserializable[storeName], { preventDecoding: true });
          });
          return this;
        }
      },
      registerStore: {
        writable: true,
        value: function (storeName, store) {
          var _this5 = this;
          _.dev(function () {
            return store.should.be.an.instanceOf(R.Store) && storeName.should.be.a.String() && _this5._stores[storeName].should.not.be.ok;
          });
          this._stores[storeName] = store;
          return this;
        }
      },
      unregisterStore: {
        writable: true,
        value: function (storeName) {
          var _this6 = this;
          _.dev(function () {
            return storeName.should.be.a.String && _this6._stores[storeName].should.be.an.instanceOf(R.Store);
          });
          delete this._stores[storeName];
          return this;
        }
      },
      getStore: {
        writable: true,
        value: function (storeName) {
          var _this7 = this;
          _.dev(function () {
            return storeName.should.be.a.String && _this7._stores[storeName].should.be.an.instanceOf(R.Store);
          });
          return this._stores[storeName];
        }
      },
      registerEventEmitter: {
        writable: true,
        value: function (eventEmitterName, eventEmitter) {
          var _this8 = this;
          _.dev(function () {
            return eventEmitter.should.be.an.instanceOf(R.EventEmitter) && eventEmitterName.should.be.a.String && _this8._eventEmitters[eventEmitterName].should.not.be.ok;
          });
          this._eventEmitters[eventEmitterName] = eventEmitter;
          return this;
        }
      },
      unregisterEventEmitter: {
        writable: true,
        value: function (eventEmitterName) {
          var _this9 = this;
          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this9._eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
          });
          delete this._eventEmitters[eventEmitterName];
          return this;
        }
      },
      getEventEmitter: {
        writable: true,
        value: function (eventEmitterName) {
          var _this10 = this;
          _.dev(function () {
            return eventEmitterName.should.be.a.String && _this10._eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter);
          });
          return this._eventEmitters[eventEmitterName];
        }
      },
      registerDispatcher: {
        writable: true,
        value: function (dispatcherName, dispatcher) {
          var _this11 = this;
          _.dev(function () {
            return dispatcher.should.be.an.instanceOf(R.Dispatcher) && dispatcherName.should.be.a.String && _this11._dispatchers[dispatcherName].should.not.be.ok;
          });
          this._dispatchers[dispatcherName] = dispatcher;
          return this;
        }
      },
      unregisterDispatcher: {
        writable: true,
        value: function (dispatcherName) {
          var _this12 = this;
          _.dev(function () {
            return dispatcherName.should.be.a.String && _this12._dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
          });
          delete this._dispatchers[dispatcherName];
          return this;
        }
      },
      getDispatcher: {
        writable: true,
        value: function (dispatcherName) {
          var _this13 = this;
          _.dev(function () {
            return dispatcherName.should.be.a.String && _this13._dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher);
          });
          return this._dispatchers[dispatcherName];
        }
      },
      subscribeTo: {
        writable: true,
        value: function (storeName, path, handler) {
          var _this14 = this;
          _.dev(function () {
            return storeName.should.be.a.String && _this14._stores[storeName].should.be.an.instanceOf(R.Store) && path.should.be.a.String && handler.should.be.a.Function;
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
            return storeName.should.be.a.String && _this15._stores[storeName].should.be.an.instanceOf(R.Store) && subscription.should.be.an.instanceOf(R.Store.Subscription);
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
            return eventEmitterName.should.be.a.String && _this16._eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && room.should.be.a.String && handler.should.be.a.Function;
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
            return eventEmitterName.should.be.a.String && _this17._eventEmitters[eventEmitterName].should.be.an.instanceOf(R.EventEmitter) && listener.should.be.an.instanceOf(R.EventEmitter.Listener);
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
            return dispatcherName.should.be.a.String && _this18._dispatchers[dispatcherName].should.be.an.instanceOf(R.Dispatcher) && action.should.be.a.String && params.should.be.an.Object;
          });
          var dispatcher = this.getDispatcher(dispatcherName);
          return dispatcher.dispatch(action, params);
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

  var Mixin = {
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

    prefetchFluxStores: function () {
      return _.copromise(regeneratorRuntime.mark(function callee$2$0() {
        var _this30, props, subscriptions, context, state, flux, surrogateComponent, renderedComponent, childContext;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0: _this30 = this;
              props = this.props;
              subscriptions = this.getFluxStoreSubscriptions(props);
              context = this.context;
              state = _.extend({}, this.state || {});
              flux = this.getFlux();
              context$3$0.next = 8;
              return Object.keys(subscriptions).map(function (stateKey) {
                return _.copromise(regeneratorRuntime.mark(function callee$4$0() {
                  var location, _ref13, name, key, _ref14, storeName, path;
                  return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {
                      case 0: location = subscriptions[stateKey];
                        _ref13 = FluxMixinStatics.parseFluxLocation(location);
                        name = _ref13.name;
                        key = _ref13.key;
                        _ref14 = [name, key];
                        storeName = _ref14[0];
                        path = _ref14[1];
                        context$5$0.next = 9;
                        return flux.getStore(storeName).pull(path);
                      case 9: state[stateKey] = context$5$0.sent;
                      case 10:
                      case "end": return context$5$0.stop();
                    }
                  }, callee$4$0, this);
                }), _this30);
              });
            case 8:
              flux.injectingFromStores(function () {
                surrogateComponent = new _this30.__ReactNexusSurrogate({ context: context, props: props, state: state });
                surrogateComponent.componentWillMount();
              });

              renderedComponent = surrogateComponent.render();
              childContext = surrogateComponent.getChildContext ? surrogateComponent.getChildContext() : context;
              surrogateComponent.componentWillUnmount();

              context$3$0.next = 14;
              return React.Children.mapTree(renderedComponent, function (childComponent) {
                return _.copromise(regeneratorRuntime.mark(function callee$4$0() {
                  var childType, surrogateChildComponent;
                  return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {
                      case 0:
                        if (_.isObject(childComponent)) {
                          context$5$0.next = 2;
                          break;
                        }
                        return context$5$0.abrupt("return");
                      case 2: childType = childComponent.type;
                        if (!(!_.isObject(childType) || !childType.__ReactNexusSurrogate)) {
                          context$5$0.next = 5;
                          break;
                        }
                        return context$5$0.abrupt("return");
                      case 5: surrogateChildComponent = new childType.__ReactNexusSurrogate({ context: childContext, props: childComponent.props });
                        if (!surrogateChildComponent.componentWillMount) {
                          _.dev(function () {
                            throw new Error("Component " + surrogateChildComponent.displayName + " doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?");
                          });
                        }
                        surrogateChildComponent.componentWillMount();
                        context$5$0.next = 10;
                        return surrogateChildComponent.prefetchFluxStores();
                      case 10:
                        surrogateChildComponent.componentWillUnmount();
                      case 11:
                      case "end": return context$5$0.stop();
                    }
                  }, callee$4$0, this);
                }), _this30);
              });
            case 14:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      }), this);
    },

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

  function PropType(props) {
    return props.flux && props.flux instanceof Flux;
  }

  _.extend(Flux, { Mixin: Mixin, PropType: PropType });

  return Flux;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7O01BRXJDLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLFFBQ29DO1VBQTlCLE9BQU8sU0FBUCxPQUFPO1VBQUUsSUFBSSxTQUFKLElBQUk7VUFBRSxNQUFNLFNBQU4sTUFBTTtVQUFFLEdBQUcsU0FBSCxHQUFHO0FBQ3RDLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN2QixDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQ3BFLENBQUM7QUFDRixVQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUN4QixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FB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Q0FBQyIsImZpbGUiOiJSLkZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgY29uc3QgZmx1eExvY2F0aW9uUmVnRXhwID0gL14oLiopOlxcLyguKikkLztcblxuICBjbGFzcyBGbHV4IHtcbiAgICBjb25zdHJ1Y3Rvcih7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdywgcmVxIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgdGhpcy5faGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICB0aGlzLl9ndWlkID0gZ3VpZDtcbiAgICAgIHRoaXMuX3dpbmRvdyA9IHdpbmRvdztcbiAgICAgIHRoaXMuX3JlcSA9IHJlcTtcbiAgICAgIHRoaXMuX3N0b3JlcyA9IHt9O1xuICAgICAgdGhpcy5fZXZlbnRFbWl0dGVycyA9IHt9O1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlcnMgPSB7fTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBib290c3RyYXAoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3N0b3JlcykuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50RW1pdHRlcnMpLmZvckVhY2goKGV2ZW50RW1pdHRlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9kaXNwYXRjaGVycykuZm9yRWFjaCgoZGlzcGF0Y2hlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5faGVhZGVycyA9IG51bGw7XG4gICAgICB0aGlzLl93aW5kb3cgPSBudWxsO1xuICAgICAgdGhpcy5fcmVxID0gbnVsbDtcbiAgICAgIHRoaXMuX3N0b3JlcyA9IG51bGw7XG4gICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzID0gbnVsbDtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzID0gbnVsbDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzLnNob3VsZC5iZS5vayk7XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbmplY3RpbmdGcm9tU3RvcmVzKGZuKSB7XG4gICAgICB0aGlzLl9zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcbiAgICAgIGxldCByID0gZm4oKTtcbiAgICAgIHRoaXMuX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICBzaG91bGRJbmplY3RGcm9tU3RvcmVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXM7XG4gICAgfVxuXG4gICAgc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nIH0pIHtcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLm1hcFZhbHVlcyh0aGlzLl9zdG9yZXMsIChzdG9yZSkgPT4gc3RvcmUuc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nOiB0cnVlIH0pKTtcbiAgICAgIHJldHVybiBwcmV2ZW50RW5jb2RpbmcgPyBzZXJpYWxpemFibGUgOiBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShzZXJpYWxpemFibGUpKTtcbiAgICB9XG5cbiAgICB1bnNlcmlhbGl6ZShzZXJpYWxpemVkLCB7IHByZXZlbnREZWNvZGluZyB9KSB7XG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBPYmplY3Qua2V5cyh1bnNlcmlhbGl6YWJsZSkuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnVuc2VyaWFsaXplKHVuc2VyaWFsaXphYmxlW3N0b3JlTmFtZV0sIHsgcHJldmVudERlY29kaW5nOiB0cnVlIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZWdpc3RlclN0b3JlKHN0b3JlTmFtZSwgc3RvcmUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcoKSAmJlxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQubm90LmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0gPSBzdG9yZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSlcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRTdG9yZShzdG9yZU5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV07XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSwgZXZlbnRFbWl0dGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0gPSBldmVudEVtaXR0ZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXTtcbiAgICB9XG5cbiAgICByZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUsIGRpc3BhdGNoZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKSAmJlxuICAgICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0gPSBkaXNwYXRjaGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckRpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcilcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHN0b3JlLnN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oc3RvcmVOYW1lLCBzdWJzY3JpcHRpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKVxuICAgICAgKTtcbiAgICAgIGxldCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIHJldHVybiBzdG9yZS51bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBsaXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gZXZlbnRFbWl0dGVyLmxpc3RlblRvKHJvb20sIGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH1cblxuICAgIHVubGlzdGVuRnJvbShldmVudEVtaXR0ZXJOYW1lLCBsaXN0ZW5lcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIpXG4gICAgICApO1xuICAgICAgbGV0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xuICAgICAgcmV0dXJuIGV2ZW50RW1pdHRlci51bmxpc3RlbkZyb20obGlzdGVuZXIpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpICYmXG4gICAgICAgIGFjdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBsZXQgZGlzcGF0Y2hlciA9IHRoaXMuZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XG4gICAgICByZXR1cm4gZGlzcGF0Y2hlci5kaXNwYXRjaChhY3Rpb24sIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRmx1eC5wcm90b3R5cGUsIHtcbiAgICBfaGVhZGVyczogbnVsbCxcbiAgICBfZ3VpZDogbnVsbCxcbiAgICBfd2luZG93OiBudWxsLFxuICAgIF9yZXE6IG51bGwsXG4gICAgX3N0b3JlczogbnVsbCxcbiAgICBfZXZlbnRFbWl0dGVyczogbnVsbCxcbiAgICBfZGlzcGF0Y2hlcnM6IG51bGwsXG4gICAgX3Nob3VsZEluamVjdEZyb21TdG9yZXM6IG51bGwsXG4gIH0pO1xuXG4gIGNvbnN0IEZsdXhNaXhpblN0YXRpY3MgPSB7XG4gICAgcGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGxvY2F0aW9uLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICBsZXQgciA9IGZsdXhMb2NhdGlvblJlZ0V4cC5leGVjKGxvY2F0aW9uKTtcbiAgICAgIF8uZGV2KCgpID0+IChyICE9PSBudWxsKS5zaG91bGQuYmUub2spO1xuICAgICAgcmV0dXJuIHsgbmFtZTogclswXSwga2V5OiByWzFdIH07XG4gICAgfSxcblxuICAgIF9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgICBsZXQgc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuaGFzQ2FjaGVkVmFsdWUocGF0aCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBzdG9yZS5nZXRDYWNoZWRWYWx1ZShwYXRoKTtcbiAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCB2YWx1ZV07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfZ2V0SW5pdGlhbFN0YXRlV2lsbE51bGxWYWx1ZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgbnVsbF07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRmx1eChwcm9wcykge1xuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgcHJvcHMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNba2V5XSk7XG4gICAgICBsZXQgY3VycmVudExpc3RlbmVycyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pO1xuXG4gICAgICBsZXQgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgbGV0IG5leHRMaXN0ZW5lcnMgPSB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dFN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgbGV0IHN0YXRlS2V5ID0gbmV4dFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgRmx1eE1peGluU3RhdGljcy5fc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSk7XG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dExpc3RlbmVycylcbiAgICAgIC5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICBsZXQgaGFuZGxlciA9IG5leHRMaXN0ZW5lcnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW2V2ZW50RW1pdHRlck5hbWUsIHJvb21dID0gW25hbWUsIGtleV07XG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGN1cnJlbnRTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbikpO1xuICAgICAgY3VycmVudExpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gdGhpcy5fdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSk7XG4gICAgfSxcblxuICAgIF9jbGVhckZsdXgoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bnN1YnNjcmliZUZyb20odGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bmxpc3RlbkZyb20odGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pKTtcbiAgICB9LFxuXG4gICAgX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7XG4gICAgICBfLmRldigoKSA9PiBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdmFsdWUuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHJldHVybiBSLkFzeW5jLmlmTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgW3N0YXRlS2V5XTogdmFsdWUgfSk7XG4gICAgICAgIHRoaXMuZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3N1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgc3RhdGVLZXkpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgc3RhdGVLZXkuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBwcm9wYWdhdGVVcGRhdGUgPSAodmFsdWUpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBmbHV4LnN1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgcHJvcGFnYXRlVXBkYXRlKTtcbiAgICAgIGxldCBpZCA9IF8udW5pcXVlSWQoc3RhdGVLZXkpO1xuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0gPSB7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXS5zaG91bGQuYmUuZXhhY3RseShzdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgcHJvcGFnYXRlRXZlbnQgPSAocGFyYW1zKSA9PiBGbHV4TWl4aW5TdGF0aWNzLl9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gZmx1eC5saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwcm9wYWdhdGVFdmVudCk7XG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHJvb20pO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXIsIGlkLCBldmVudEVtaXR0ZXJOYW1lIH07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3VubGlzdGVuRnJvbSh7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcikgJiZcbiAgICAgICAgaWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXS5zaG91bGQuYmUuZXhhY3RseShsaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZGVmYXVsdEltcGxlbWVudGF0aW9uczoge1xuICAgICAgZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykgeyByZXR1cm4ge307IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LCAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHsgcmV0dXJuIHZvaWQgMDsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7IHJldHVybiB2b2lkIDA7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgTWl4aW4gPSB7XG4gICAgX0ZsdXhNaXhpbjogdHJ1ZSxcbiAgICBfRmx1eE1peGluU3Vic2NyaXB0aW9uczogbnVsbCxcbiAgICBfRmx1eE1peGluTGlzdGVuZXJzOiBudWxsLFxuXG4gICAgc3RhdGljczogeyBGbHV4TWl4aW5TdGF0aWNzIH0sXG5cbiAgICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICBpZih0aGlzLmdldEZsdXgoKS5zaG91bGRJbmplY3RGcm9tU3RvcmVzKCkpIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZUZyb21GbHV4U3RvcmVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEZsdXhNaXhpblN0YXRpY3MuX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuZ2V0Rmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB0aGlzLmdldEZsdXgoKS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXG4gICAgICAgIHRoaXMuX0FzeW5jTWl4aW4uc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzID0ge307XG4gICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zID0ge307XG4gICAgICBPYmplY3Qua2V5cyhGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobWV0aG9kTmFtZSkgPT4gdGhpc1ttZXRob2ROYW1lXSA9IHRoaXNbbWV0aG9kTmFtZV0gfHwgRmx1eE1peGluU3RhdGljcy5kZWZhdWx0SW1wbGVtZW50YXRpb25zW21ldGhvZE5hbWVdLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3VwZGF0ZUZsdXguY2FsbCh0aGlzLCB0aGlzLnByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHByb3BzKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl9jbGVhckZsdXguY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgcHJlZmV0Y2hGbHV4U3RvcmVzKCkge1xuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgbGV0IHN0YXRlID0gXy5leHRlbmQoe30sIHRoaXMuc3RhdGUgfHwge30pO1xuICAgICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgICB5aWVsZCBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChzdGF0ZUtleSkgPT4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIGxldCBsb2NhdGlvbiA9IHN1YnNjcmlwdGlvbnNbc3RhdGVLZXldO1xuICAgICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgICAgc3RhdGVbc3RhdGVLZXldID0geWllbGQgZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpLnB1bGwocGF0aCk7XG4gICAgICAgIH0sIHRoaXMpKTtcblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgb25lLCBidXQgdGhpcyB0aW1lIGluamVjdCBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3Jlcy5cbiAgICAgICAgbGV0IHN1cnJvZ2F0ZUNvbXBvbmVudDtcbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHtcbiAgICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdGhpcy5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0LCBwcm9wcywgc3RhdGUgfSk7XG4gICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XG4gICAgICAgIGxldCBjaGlsZENvbnRleHQgPSBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0ID8gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dDtcbiAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgeWllbGQgUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZShyZW5kZXJlZENvbXBvbmVudCwgKGNoaWxkQ29tcG9uZW50KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgaWYoIV8uaXNPYmplY3QoY2hpbGRDb21wb25lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBjaGlsZFR5cGUgPSBjaGlsZENvbXBvbmVudC50eXBlO1xuICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkVHlwZSkgfHwgIWNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIGNoaWxkICh3aXRob3V0IGluamVjdGluZyBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3JlcykuXG4gICAgICAgICAgbGV0IHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50ID0gbmV3IGNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0OiBjaGlsZENvbnRleHQsIHByb3BzOiBjaGlsZENvbXBvbmVudC5wcm9wcyB9KTtcbiAgICAgICAgICBpZighc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7c3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuZGlzcGxheU5hbWV9IGRvZXNuJ3QgaW1wbGVtZW50IGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLkNvbXBvbmVudC5taXhpbiA/YCk7IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICB9LCB0aGlzKSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgIGxldCBbZGlzcGF0Y2hlck5hbWUsIGFjdGlvbl0gPSBbbmFtZSwga2V5XTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICByZXR1cm4gZmx1eC5kaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpO1xuICAgIH0sXG5cbiAgfTtcblxuICBmdW5jdGlvbiBQcm9wVHlwZShwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy5mbHV4ICYmIHByb3BzLmZsdXggaW5zdGFuY2VvZiBGbHV4O1xuICB9XG5cbiAgXy5leHRlbmQoRmx1eCwgeyBNaXhpbiwgUHJvcFR5cGUgfSk7XG5cbiAgcmV0dXJuIEZsdXg7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9