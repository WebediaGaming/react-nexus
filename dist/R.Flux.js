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
      var flux = this.getFlux();
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
      },
      getFluxEventEmittersListeners: function (props) {
        return {};
      },
      fluxStoreWillUpdate: function (storeName, path, value, stateKey) {},
      fluxStoreDidUpdate: function (storeName, path, value, stateKey) {},
      fluxEventEmitterWillEmit: function (eventEmitterName, room, params, handler) {},
      fluxEventEmitterDidEmit: function (eventEmitterName, room, params, handler) {} }
  };

  var FluxMixin = {
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

  function PropType(props, propName, componentName) {
    return props.flux && props.flux instanceof Flux;
  }

  _.extend(Flux, { Mixin: Mixin, PropType: PropType });

  return Flux;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUV0QixNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQzs7TUFFckMsSUFBSTtRQUFKLElBQUksR0FDRyxTQURQLElBQUksUUFDb0M7VUFBOUIsT0FBTyxTQUFQLE9BQU87VUFBRSxJQUFJLFNBQUosSUFBSTtVQUFFLE1BQU0sU0FBTixNQUFNO1VBQUUsR0FBRyxTQUFILEdBQUc7QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3ZCLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO09BQUEsQ0FDcEUsQ0FBQztBQUNGLFVBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLEdBQUcsR0FB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QUM7Q0FDYixDQUFDIiwiZmlsZSI6IlIuRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XHJcblxyXG4gIGNvbnN0IGZsdXhMb2NhdGlvblJlZ0V4cCA9IC9eKC4qKTpcXC8oLiopJC87XHJcblxyXG4gIGNsYXNzIEZsdXgge1xyXG4gICAgY29uc3RydWN0b3IoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3csIHJlcSB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGhlYWRlcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdFxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLl9oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgdGhpcy5fZ3VpZCA9IGd1aWQ7XHJcbiAgICAgIHRoaXMuX3dpbmRvdyA9IHdpbmRvdztcclxuICAgICAgdGhpcy5fcmVxID0gcmVxO1xyXG4gICAgICB0aGlzLl9zdG9yZXMgPSB7fTtcclxuICAgICAgdGhpcy5fZXZlbnRFbWl0dGVycyA9IHt9O1xyXG4gICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IHt9O1xyXG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgYm9vdHN0cmFwKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9zdG9yZXMpLmZvckVhY2goKHN0b3JlTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50RW1pdHRlcnMpLmZvckVhY2goKGV2ZW50RW1pdHRlck5hbWUpID0+IHRoaXMudW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2Rpc3BhdGNoZXJzKS5mb3JFYWNoKChkaXNwYXRjaGVyTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkpO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5faGVhZGVycyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3dpbmRvdyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3JlcSA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3N0b3JlcyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSBudWxsO1xyXG4gICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IG51bGw7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIF9zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBfc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpbmplY3RpbmdGcm9tU3RvcmVzKGZuKSB7XHJcbiAgICAgIHRoaXMuX3N0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpO1xyXG4gICAgICBsZXQgciA9IGZuKCk7XHJcbiAgICAgIHRoaXMuX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XHJcbiAgICAgIHJldHVybiByO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3VsZEluamVjdEZyb21TdG9yZXMoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZyB9KSB7XHJcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLm1hcFZhbHVlcyh0aGlzLl9zdG9yZXMsIChzdG9yZSkgPT4gc3RvcmUuc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nOiB0cnVlIH0pKTtcclxuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcclxuICAgICAgbGV0IHVuc2VyaWFsaXphYmxlID0gcHJldmVudERlY29kaW5nID8gc2VyaWFsaXplZCA6IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUoc2VyaWFsaXplZCkpO1xyXG4gICAgICBPYmplY3Qua2V5cyh1bnNlcmlhbGl6YWJsZSkuZm9yRWFjaCgoc3RvcmVOYW1lKSA9PiB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS51bnNlcmlhbGl6ZSh1bnNlcmlhbGl6YWJsZVtzdG9yZU5hbWVdLCB7IHByZXZlbnREZWNvZGluZzogdHJ1ZSB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lLCBzdG9yZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBzdG9yZS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxyXG4gICAgICAgIHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcoKSAmJlxyXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5ub3QuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0gPSBzdG9yZTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdW5yZWdpc3RlclN0b3JlKHN0b3JlTmFtZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSlcclxuICAgICAgKTtcclxuICAgICAgZGVsZXRlIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdG9yZShzdG9yZU5hbWUpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lLCBldmVudEVtaXR0ZXIpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxyXG4gICAgICAgIGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQubm90LmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0gPSBldmVudEVtaXR0ZXI7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHVucmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSwgZGlzcGF0Y2hlcikge1xyXG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcclxuICAgICAgICBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLm5vdC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0gPSBkaXNwYXRjaGVyO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB1bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxyXG4gICAgICApO1xyXG4gICAgICBkZWxldGUgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBoYW5kbGVyKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxyXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBzdG9yZS5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcclxuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZUZyb20oc3RvcmVOYW1lLCBzdWJzY3JpcHRpb24pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKVxyXG4gICAgICApO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgIHJldHVybiBzdG9yZS51bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBoYW5kbGVyKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcclxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgbGV0IGV2ZW50RW1pdHRlciA9IHRoaXMuZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpO1xyXG4gICAgICBsZXQgbGlzdGVuZXIgPSBldmVudEVtaXR0ZXIubGlzdGVuVG8ocm9vbSwgaGFuZGxlcik7XHJcbiAgICAgIHJldHVybiBsaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICB1bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxyXG4gICAgICAgIGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKVxyXG4gICAgICApO1xyXG4gICAgICBsZXQgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XHJcbiAgICAgIHJldHVybiBldmVudEVtaXR0ZXIudW5saXN0ZW5Gcm9tKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpIHtcclxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xyXG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKSAmJlxyXG4gICAgICAgIGFjdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxyXG4gICAgICApO1xyXG4gICAgICBsZXQgZGlzcGF0Y2hlciA9IHRoaXMuZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSk7XHJcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyLmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKEZsdXgucHJvdG90eXBlLCB7XHJcbiAgICBfaGVhZGVyczogbnVsbCxcclxuICAgIF9ndWlkOiBudWxsLFxyXG4gICAgX3dpbmRvdzogbnVsbCxcclxuICAgIF9yZXE6IG51bGwsXHJcbiAgICBfc3RvcmVzOiBudWxsLFxyXG4gICAgX2V2ZW50RW1pdHRlcnM6IG51bGwsXHJcbiAgICBfZGlzcGF0Y2hlcnM6IG51bGwsXHJcbiAgICBfc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgRmx1eE1peGluU3RhdGljcyA9IHtcclxuICAgIHBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGxvY2F0aW9uLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgIGxldCByID0gZmx1eExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xyXG4gICAgICBfLmRldigoKSA9PiAociAhPT0gbnVsbCkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHsgbmFtZTogclswXSwga2V5OiByWzFdIH07XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3JlcygpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xyXG4gICAgICByZXR1cm4gXy5vYmplY3QoT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucylcclxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xyXG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XHJcbiAgICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xyXG4gICAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XHJcbiAgICAgICAgICBsZXQgc3RvcmUgPSBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5oYXNDYWNoZWRWYWx1ZShwYXRoKS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgICAgbGV0IHZhbHVlID0gc3RvcmUuZ2V0Q2FjaGVkVmFsdWUocGF0aCk7XHJcbiAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCB2YWx1ZV07XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzKCkge1xyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XHJcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxyXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XHJcbiAgICAgICAgICBsZXQgc3RhdGVLZXkgPSBzdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcclxuICAgICAgICAgIHJldHVybiBbc3RhdGVLZXksIG51bGxdO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIF91cGRhdGVGbHV4KHByb3BzKSB7XHJcbiAgICAgIHByb3BzID0gcHJvcHMgfHwge307XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICBwcm9wcy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXHJcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKTtcclxuICAgICAgbGV0IGN1cnJlbnRMaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXHJcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pO1xyXG5cclxuICAgICAgbGV0IG5leHRTdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKTtcclxuICAgICAgbGV0IG5leHRMaXN0ZW5lcnMgPSB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKTtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKG5leHRTdWJzY3JpcHRpb25zKVxyXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcclxuICAgICAgICBsZXQgc3RhdGVLZXkgPSBuZXh0U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XHJcbiAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcclxuICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcclxuICAgICAgICBGbHV4TWl4aW5TdGF0aWNzLl9zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHN0YXRlS2V5KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhuZXh0TGlzdGVuZXJzKVxyXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcclxuICAgICAgICBsZXQgaGFuZGxlciA9IG5leHRMaXN0ZW5lcnNbbG9jYXRpb25dO1xyXG4gICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XHJcbiAgICAgICAgbGV0IFtldmVudEVtaXR0ZXJOYW1lLCByb29tXSA9IFtuYW1lLCBrZXldO1xyXG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGN1cnJlbnRTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbikpO1xyXG4gICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB0aGlzLl91bmxpc3RlbkZyb20obGlzdGVuZXIpKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2NsZWFyRmx1eCgpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXHJcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuX3Vuc3Vic2NyaWJlRnJvbSh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2tleV0pKTtcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluTGlzdGVuZXJzKVxyXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bmxpc3RlbkZyb20odGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pKTtcclxuICAgIH0sXHJcblxyXG4gICAgX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHN0YXRlS2V5LnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHZhbHVlLnNob3VsZC5iZS5hbi5PYmplY3RcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIFIuQXN5bmMuaWZNb3VudGVkKCgpID0+IHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBbc3RhdGVLZXldOiB2YWx1ZSB9KTtcclxuICAgICAgICB0aGlzLmZsdXhTdG9yZURpZFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYWxsKHRoaXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSkge1xyXG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XHJcbiAgICAgIGxldCBwcm9wYWdhdGVVcGRhdGUgPSAodmFsdWUpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IGZsdXguc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBwcm9wYWdhdGVVcGRhdGUpO1xyXG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHN0YXRlS2V5KTtcclxuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0gPSB7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9O1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgX3Vuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlLlN1YnNjcmlwdGlvbikgJiZcclxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0uc2hvdWxkLmJlLmV4YWN0bHkoc3Vic2NyaXB0aW9uKVxyXG4gICAgICApO1xyXG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xyXG4gICAgICBmbHV4LnVuc3Vic2NyaWJlRnJvbShzdG9yZU5hbWUsIHN1YnNjcmlwdGlvbik7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIF9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xyXG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcik7XHJcbiAgICAgICAgaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyRGlkRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2FsbCh0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3RcclxuICAgICAgKTtcclxuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcclxuICAgICAgbGV0IHByb3BhZ2F0ZUV2ZW50ID0gKHBhcmFtcykgPT4gRmx1eE1peGluU3RhdGljcy5fcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcclxuICAgICAgbGV0IGxpc3RlbmVyID0gZmx1eC5saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwcm9wYWdhdGVFdmVudCk7XHJcbiAgICAgIGxldCBpZCA9IF8udW5pcXVlSWQocm9vbSk7XHJcbiAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF0gPSB7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9O1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgX3VubGlzdGVuRnJvbSh7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKSAmJlxyXG4gICAgICAgIGlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdLnNob3VsZC5iZS5leGFjdGx5KGxpc3RlbmVyKVxyXG4gICAgICApO1xyXG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xyXG4gICAgICBmbHV4LnVubGlzdGVuRnJvbShldmVudEVtaXR0ZXJOYW1lLCBsaXN0ZW5lcik7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgZGVmYXVsdEltcGxlbWVudGF0aW9uczoge1xyXG4gICAgICBnZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKSB7IHJldHVybiB7fTsgfSxcclxuICAgICAgZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpIHsgcmV0dXJuIHt9OyB9LFxyXG4gICAgICBmbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7fSxcclxuICAgICAgZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7fSxcclxuICAgICAgZmx1eEV2ZW50RW1pdHRlcldpbGxFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikge30sXHJcbiAgICAgIGZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikge30sXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgRmx1eE1peGluID0ge1xyXG4gICAgX0ZsdXhNaXhpbjogdHJ1ZSxcclxuICAgIF9GbHV4TWl4aW5TdWJzY3JpcHRpb25zOiBudWxsLFxyXG4gICAgX0ZsdXhNaXhpbkxpc3RlbmVyczogbnVsbCxcclxuXHJcbiAgICBzdGF0aWNzOiB7IEZsdXhNaXhpblN0YXRpY3MgfSxcclxuXHJcbiAgICBnZXRJbml0aWFsU3RhdGUoKSB7XHJcbiAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xyXG4gICAgICAgIHJldHVybiBGbHV4TWl4aW5TdGF0aWNzLl9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3Jlcy5jYWxsKHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBGbHV4TWl4aW5TdGF0aWNzLl9nZXRJbml0aWFsU3RhdGVXaWxsTnVsbFZhbHVlcy5jYWxsKHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRGbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgdGhpcy5nZXRGbHV4KCkuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5GbHV4KSAmJlxyXG4gICAgICAgIHRoaXMuX0FzeW5jTWl4aW4uc2hvdWxkLmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycyA9IHt9O1xyXG4gICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zID0ge307XHJcbiAgICAgIE9iamVjdC5rZXlzKEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9ucylcclxuICAgICAgLmZvckVhY2goKG1ldGhvZE5hbWUpID0+IHRoaXNbbWV0aG9kTmFtZV0gPSB0aGlzW21ldGhvZE5hbWVdIHx8IEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9uc1ttZXRob2ROYW1lXS5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3VwZGF0ZUZsdXguY2FsbCh0aGlzLCB0aGlzLnByb3BzKTtcclxuICAgIH0sXHJcblxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xyXG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl91cGRhdGVGbHV4LmNhbGwodGhpcywgcHJvcHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgRmx1eE1peGluU3RhdGljcy5fY2xlYXJGbHV4LmNhbGwodGhpcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZWZldGNoRmx1eFN0b3JlcygpIHtcclxuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKTtcclxuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMuY29udGV4dDtcclxuICAgICAgICBsZXQgc3RhdGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSB8fCB7fSk7XHJcbiAgICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcclxuICAgICAgICB5aWVsZCBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxyXG4gICAgICAgIC5tYXAoKHN0YXRlS2V5KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgICBsZXQgbG9jYXRpb24gPSBzdWJzY3JpcHRpb25zW3N0YXRlS2V5XTtcclxuICAgICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XHJcbiAgICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcclxuICAgICAgICAgIHN0YXRlW3N0YXRlS2V5XSA9IHlpZWxkIGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKS5wdWxsKHBhdGgpO1xyXG4gICAgICAgIH0sIHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIG9uZSwgYnV0IHRoaXMgdGltZSBpbmplY3QgZnJvbSB0aGUgcHJlZmV0Y2hlZCBzdG9yZXMuXHJcbiAgICAgICAgbGV0IHN1cnJvZ2F0ZUNvbXBvbmVudDtcclxuICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4ge1xyXG4gICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50ID0gbmV3IHRoaXMuX19SZWFjdE5leHVzU3Vycm9nYXRlKHsgY29udGV4dCwgcHJvcHMsIHN0YXRlIH0pO1xyXG4gICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XHJcbiAgICAgICAgbGV0IGNoaWxkQ29udGV4dCA9IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQgPyBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkgOiBjb250ZXh0O1xyXG4gICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xyXG5cclxuICAgICAgICB5aWVsZCBSZWFjdC5DaGlsZHJlbi5tYXBUcmVlKHJlbmRlcmVkQ29tcG9uZW50LCAoY2hpbGRDb21wb25lbnQpID0+IF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkQ29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgY2hpbGRUeXBlID0gY2hpbGRDb21wb25lbnQudHlwZTtcclxuICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkVHlwZSkgfHwgIWNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIGNoaWxkICh3aXRob3V0IGluamVjdGluZyBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3JlcykuXHJcbiAgICAgICAgICBsZXQgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQgPSBuZXcgY2hpbGRUeXBlLl9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7IGNvbnRleHQ6IGNoaWxkQ29udGV4dCwgcHJvcHM6IGNoaWxkQ29tcG9uZW50LnByb3BzIH0pO1xyXG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7c3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuZGlzcGxheU5hbWV9IGRvZXNuJ3QgaW1wbGVtZW50IGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLkNvbXBvbmVudC5taXhpbiA/YCk7IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcclxuICAgICAgICAgIHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcbiAgICAgICAgfSwgdGhpcykpO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xyXG4gICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xyXG4gICAgICBsZXQgW2Rpc3BhdGNoZXJOYW1lLCBhY3Rpb25dID0gW25hbWUsIGtleV07XHJcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XHJcbiAgICAgIHJldHVybiBmbHV4LmRpc3BhdGNoKGRpc3BhdGNoZXJOYW1lLCBhY3Rpb24sIHBhcmFtcyk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBQcm9wVHlwZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcclxuICAgIHJldHVybiBwcm9wcy5mbHV4ICYmIHByb3BzLmZsdXggaW5zdGFuY2VvZiBGbHV4O1xyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoRmx1eCwgeyBNaXhpbiwgUHJvcFR5cGUgfSk7XHJcblxyXG4gIHJldHVybiBGbHV4O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=