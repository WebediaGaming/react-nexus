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
            case 0:
              _this30 = this;
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
                      case 0:
                        location = subscriptions[stateKey];
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

                      case 2:
                        childType = childComponent.type;

                        if (!(!_.isObject(childType) || !childType.__ReactNexusSurrogate)) {
                          context$5$0.next = 5;
                          break;
                        }
                        return context$5$0.abrupt("return");

                      case 5:
                        surrogateChildComponent = new childType.__ReactNexusSurrogate({ context: childContext, props: childComponent.props });

                        if (!surrogateChildComponent.componentWillMount) {
                          _.dev(function () {
                            throw new Error("Component " + surrogateChildComponent.displayName + " doesn't implement componentWillMount. Maybe you forgot R.Component.mixin ?");
                          });
                        }
                        surrogateChildComponent.componentWillMount();
                        context$5$0.next = 10;
                        return surrogateChildComponent.prefetchFluxStores();

                      case 10: surrogateChildComponent.componentWillUnmount();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7O01BRXJDLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLFFBQ29DO1VBQTlCLE9BQU8sU0FBUCxPQUFPO1VBQUUsSUFBSSxTQUFKLElBQUk7VUFBRSxNQUFNLFNBQU4sTUFBTTtVQUFFLEdBQUcsU0FBSCxHQUFHOztBQUN0QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdkIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUNwRSxDQUFDO0FBQ0YsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLElB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TCxLQUFLLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRXBDLFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIGNvbnN0IGZsdXhMb2NhdGlvblJlZ0V4cCA9IC9eKC4qKTpcXC8oLiopJC87XG5cbiAgY2xhc3MgRmx1eCB7XG4gICAgY29uc3RydWN0b3IoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3csIHJlcSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgdGhpcy5fZ3VpZCA9IGd1aWQ7XG4gICAgICB0aGlzLl93aW5kb3cgPSB3aW5kb3c7XG4gICAgICB0aGlzLl9yZXEgPSByZXE7XG4gICAgICB0aGlzLl9zdG9yZXMgPSB7fTtcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSB7fTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzID0ge307XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYm9vdHN0cmFwKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9zdG9yZXMpLmZvckVhY2goKHN0b3JlTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9ldmVudEVtaXR0ZXJzKS5mb3JFYWNoKChldmVudEVtaXR0ZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fZGlzcGF0Y2hlcnMpLmZvckVhY2goKGRpc3BhdGNoZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSBudWxsO1xuICAgICAgdGhpcy5fd2luZG93ID0gbnVsbDtcbiAgICAgIHRoaXMuX3JlcSA9IG51bGw7XG4gICAgICB0aGlzLl9zdG9yZXMgPSBudWxsO1xuICAgICAgdGhpcy5fZXZlbnRFbWl0dGVycyA9IG51bGw7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IG51bGw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3Jlcy5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaW5qZWN0aW5nRnJvbVN0b3Jlcyhmbikge1xuICAgICAgdGhpcy5fc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICBsZXQgciA9IGZuKCk7XG4gICAgICB0aGlzLl9zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzO1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZyB9KSB7XG4gICAgICBsZXQgc2VyaWFsaXphYmxlID0gXy5tYXBWYWx1ZXModGhpcy5fc3RvcmVzLCAoc3RvcmUpID0+IHN0b3JlLnNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZzogdHJ1ZSB9KSk7XG4gICAgICByZXR1cm4gcHJldmVudEVuY29kaW5nID8gc2VyaWFsaXphYmxlIDogXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphYmxlKSk7XG4gICAgfVxuXG4gICAgdW5zZXJpYWxpemUoc2VyaWFsaXplZCwgeyBwcmV2ZW50RGVjb2RpbmcgfSkge1xuICAgICAgbGV0IHVuc2VyaWFsaXphYmxlID0gcHJldmVudERlY29kaW5nID8gc2VyaWFsaXplZCA6IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUoc2VyaWFsaXplZCkpO1xuICAgICAgT2JqZWN0LmtleXModW5zZXJpYWxpemFibGUpLmZvckVhY2goKHN0b3JlTmFtZSkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS51bnNlcmlhbGl6ZSh1bnNlcmlhbGl6YWJsZVtzdG9yZU5hbWVdLCB7IHByZXZlbnREZWNvZGluZzogdHJ1ZSB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUsIHN0b3JlKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nKCkgJiZcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdID0gc3RvcmU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0U3RvcmUoc3RvcmVOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUsIGV2ZW50RW1pdHRlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdID0gZXZlbnRFbWl0dGVyO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRFbWl0dGVyKGV2ZW50RW1pdHRlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV07XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lLCBkaXNwYXRjaGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcbiAgICAgICAgZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQubm90LmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdID0gZGlzcGF0Y2hlcjtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVucmVnaXN0ZXJEaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcilcbiAgICAgICk7XG4gICAgICBkZWxldGUgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGxldCBzdG9yZSA9IHRoaXMuZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBzdG9yZS5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlLlN1YnNjcmlwdGlvbilcbiAgICAgICk7XG4gICAgICBsZXQgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICByZXR1cm4gc3RvcmUudW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGxldCBldmVudEVtaXR0ZXIgPSB0aGlzLmdldEV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKTtcbiAgICAgIGxldCBsaXN0ZW5lciA9IGV2ZW50RW1pdHRlci5saXN0ZW5Ubyhyb29tLCBoYW5kbGVyKTtcbiAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9XG5cbiAgICB1bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKVxuICAgICAgKTtcbiAgICAgIGxldCBldmVudEVtaXR0ZXIgPSB0aGlzLmdldEV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKTtcbiAgICAgIHJldHVybiBldmVudEVtaXR0ZXIudW5saXN0ZW5Gcm9tKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKSAmJlxuICAgICAgICBhY3Rpb24uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGRpc3BhdGNoZXIgPSB0aGlzLmdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoZXIuZGlzcGF0Y2goYWN0aW9uLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEZsdXgucHJvdG90eXBlLCB7XG4gICAgX2hlYWRlcnM6IG51bGwsXG4gICAgX2d1aWQ6IG51bGwsXG4gICAgX3dpbmRvdzogbnVsbCxcbiAgICBfcmVxOiBudWxsLFxuICAgIF9zdG9yZXM6IG51bGwsXG4gICAgX2V2ZW50RW1pdHRlcnM6IG51bGwsXG4gICAgX2Rpc3BhdGNoZXJzOiBudWxsLFxuICAgIF9zaG91bGRJbmplY3RGcm9tU3RvcmVzOiBudWxsLFxuICB9KTtcblxuICBjb25zdCBGbHV4TWl4aW5TdGF0aWNzID0ge1xuICAgIHBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBsb2NhdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgbGV0IHIgPSBmbHV4TG9jYXRpb25SZWdFeHAuZXhlYyhsb2NhdGlvbik7XG4gICAgICBfLmRldigoKSA9PiAociAhPT0gbnVsbCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgIHJldHVybiB7IG5hbWU6IHJbMF0sIGtleTogclsxXSB9O1xuICAgIH0sXG5cbiAgICBfZ2V0SW5pdGlhbFN0YXRlRnJvbUZsdXhTdG9yZXMoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyh0aGlzLnByb3BzKTtcbiAgICAgIHJldHVybiBfLm9iamVjdChPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKVxuICAgICAgICAubWFwKChsb2NhdGlvbikgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZUtleSA9IHN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgICAgbGV0IFtzdG9yZU5hbWUsIHBhdGhdID0gW25hbWUsIGtleV07XG4gICAgICAgICAgbGV0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHN0b3JlLmhhc0NhY2hlZFZhbHVlKHBhdGgpLnNob3VsZC5iZS5vayk7XG4gICAgICAgICAgbGV0IHZhbHVlID0gc3RvcmUuZ2V0Q2FjaGVkVmFsdWUocGF0aCk7XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgdmFsdWVdO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgX2dldEluaXRpYWxTdGF0ZVdpbGxOdWxsVmFsdWVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4gICAgICByZXR1cm4gXy5vYmplY3QoT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgLm1hcCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGVLZXkgPSBzdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgICByZXR1cm4gW3N0YXRlS2V5LCBudWxsXTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSxcblxuICAgIF91cGRhdGVGbHV4KHByb3BzKSB7XG4gICAgICBwcm9wcyA9IHByb3BzIHx8IHt9O1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICBwcm9wcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGN1cnJlbnRTdWJzY3JpcHRpb25zID0gT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKTtcbiAgICAgIGxldCBjdXJyZW50TGlzdGVuZXJzID0gT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluTGlzdGVuZXJzKVxuICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNba2V5XSk7XG5cbiAgICAgIGxldCBuZXh0U3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcyk7XG4gICAgICBsZXQgbmV4dExpc3RlbmVycyA9IHRoaXMuZ2V0Rmx1eEV2ZW50RW1pdHRlcnNMaXN0ZW5lcnMocHJvcHMpO1xuXG4gICAgICBPYmplY3Qua2V5cyhuZXh0U3Vic2NyaXB0aW9ucylcbiAgICAgIC5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICBsZXQgc3RhdGVLZXkgPSBuZXh0U3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgIGxldCBbc3RvcmVOYW1lLCBwYXRoXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICBGbHV4TWl4aW5TdGF0aWNzLl9zdWJzY3JpYmVUbyhzdG9yZU5hbWUsIHBhdGgsIHN0YXRlS2V5KTtcbiAgICAgIH0pO1xuXG4gICAgICBPYmplY3Qua2V5cyhuZXh0TGlzdGVuZXJzKVxuICAgICAgLmZvckVhY2goKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgIGxldCBoYW5kbGVyID0gbmV4dExpc3RlbmVyc1tsb2NhdGlvbl07XG4gICAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICAgIGxldCBbZXZlbnRFbWl0dGVyTmFtZSwgcm9vbV0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgRmx1eE1peGluU3RhdGljcy5fbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcik7XG4gICAgICB9KTtcblxuICAgICAgY3VycmVudFN1YnNjcmlwdGlvbnMuZm9yRWFjaCgoc3Vic2NyaXB0aW9uKSA9PiB0aGlzLl91bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKSk7XG4gICAgICBjdXJyZW50TGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB0aGlzLl91bmxpc3RlbkZyb20obGlzdGVuZXIpKTtcbiAgICB9LFxuXG4gICAgX2NsZWFyRmx1eCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuX3Vuc3Vic2NyaWJlRnJvbSh0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2tleV0pKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuX3VubGlzdGVuRnJvbSh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNba2V5XSkpO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlU3RvcmVVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0YXRlS2V5LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB2YWx1ZS5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgcmV0dXJuIFIuQXN5bmMuaWZNb3VudGVkKCgpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHRoaXMuZmx1eFN0b3JlV2lsbFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBbc3RhdGVLZXldOiB2YWx1ZSB9KTtcbiAgICAgICAgdGhpcy5mbHV4U3RvcmVEaWRVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgfSlcbiAgICAgIC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgbGV0IHByb3BhZ2F0ZVVwZGF0ZSA9ICh2YWx1ZSkgPT4gRmx1eE1peGluU3RhdGljcy5fcHJvcGFnYXRlU3RvcmVVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IGZsdXguc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBwcm9wYWdhdGVVcGRhdGUpO1xuICAgICAgbGV0IGlkID0gXy51bmlxdWVJZChzdGF0ZUtleSk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXSA9IHsgc3Vic2NyaXB0aW9uLCBpZCwgc3RvcmVOYW1lIH07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3Vuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZS5TdWJzY3JpcHRpb24pICYmXG4gICAgICAgIGlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbaWRdLnNob3VsZC5iZS5leGFjdGx5KHN1YnNjcmlwdGlvbilcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bnN1YnNjcmliZUZyb20oc3RvcmVOYW1lLCBzdWJzY3JpcHRpb24pO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNbaWRdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBSLkFzeW5jLmlmTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLmZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgICBoYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyRGlkRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgfSlcbiAgICAgIC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBfbGlzdGVuVG8oZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgaGFuZGxlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBwcm9wYWdhdGVFdmVudCA9IChwYXJhbXMpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZUV2ZW50KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcik7XG4gICAgICBsZXQgbGlzdGVuZXIgPSBmbHV4Lmxpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHByb3BhZ2F0ZUV2ZW50KTtcbiAgICAgIGxldCBpZCA9IF8udW5pcXVlSWQocm9vbSk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdID0geyBsaXN0ZW5lciwgaWQsIGV2ZW50RW1pdHRlck5hbWUgfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfdW5saXN0ZW5Gcm9tKHsgbGlzdGVuZXIsIGlkLCBldmVudEVtaXR0ZXJOYW1lIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnNbaWRdLnNob3VsZC5iZS5leGFjdGx5KGxpc3RlbmVyKVxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBmbHV4LnVubGlzdGVuRnJvbShldmVudEVtaXR0ZXJOYW1lLCBsaXN0ZW5lcik7XG4gICAgICBkZWxldGUgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBkZWZhdWx0SW1wbGVtZW50YXRpb25zOiB7XG4gICAgICBnZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKSB7IHJldHVybiB7fTsgfSxcbiAgICAgIGdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKSB7IHJldHVybiB7fTsgfSxcbiAgICAgIGZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpIHt9LFxuICAgICAgZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7fSxcbiAgICAgIGZsdXhFdmVudEVtaXR0ZXJXaWxsRW1pdChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpIHt9LFxuICAgICAgZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7fSxcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgRmx1eE1peGluID0ge1xuICAgIF9GbHV4TWl4aW46IHRydWUsXG4gICAgX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnM6IG51bGwsXG4gICAgX0ZsdXhNaXhpbkxpc3RlbmVyczogbnVsbCxcblxuICAgIHN0YXRpY3M6IHsgRmx1eE1peGluU3RhdGljcyB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgICAgaWYodGhpcy5nZXRGbHV4KCkuc2hvdWxkSW5qZWN0RnJvbVN0b3JlcygpKSB7XG4gICAgICAgIHJldHVybiBGbHV4TWl4aW5TdGF0aWNzLl9nZXRJbml0aWFsU3RhdGVGcm9tRmx1eFN0b3Jlcy5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBGbHV4TWl4aW5TdGF0aWNzLl9nZXRJbml0aWFsU3RhdGVXaWxsTnVsbFZhbHVlcy5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLmdldEZsdXguc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5nZXRGbHV4KCkuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5GbHV4KSAmJlxuICAgICAgICB0aGlzLl9Bc3luY01peGluLnNob3VsZC5iZS5va1xuICAgICAgKTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycyA9IHt9O1xuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgT2JqZWN0LmtleXMoRmx1eE1peGluU3RhdGljcy5kZWZhdWx0SW1wbGVtZW50YXRpb25zKVxuICAgICAgLmZvckVhY2goKG1ldGhvZE5hbWUpID0+IHRoaXNbbWV0aG9kTmFtZV0gPSB0aGlzW21ldGhvZE5hbWVdIHx8IEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9uc1ttZXRob2ROYW1lXS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl91cGRhdGVGbHV4LmNhbGwodGhpcywgdGhpcy5wcm9wcyk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX3VwZGF0ZUZsdXguY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fY2xlYXJGbHV4LmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIHByZWZldGNoRmx1eFN0b3JlcygpIHtcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHByb3BzKTtcbiAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGxldCBzdGF0ZSA9IF8uZXh0ZW5kKHt9LCB0aGlzLnN0YXRlIHx8IHt9KTtcbiAgICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgICAgeWllbGQgT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgLm1hcCgoc3RhdGVLZXkpID0+IF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBsZXQgbG9jYXRpb24gPSBzdWJzY3JpcHRpb25zW3N0YXRlS2V5XTtcbiAgICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICAgIGxldCBbc3RvcmVOYW1lLCBwYXRoXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICAgIHN0YXRlW3N0YXRlS2V5XSA9IHlpZWxkIGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKS5wdWxsKHBhdGgpO1xuICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIG9uZSwgYnV0IHRoaXMgdGltZSBpbmplY3QgZnJvbSB0aGUgcHJlZmV0Y2hlZCBzdG9yZXMuXG4gICAgICAgIGxldCBzdXJyb2dhdGVDb21wb25lbnQ7XG4gICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiB7XG4gICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50ID0gbmV3IHRoaXMuX19SZWFjdE5leHVzU3Vycm9nYXRlKHsgY29udGV4dCwgcHJvcHMsIHN0YXRlIH0pO1xuICAgICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHJlbmRlcmVkQ29tcG9uZW50ID0gc3Vycm9nYXRlQ29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgICBsZXQgY2hpbGRDb250ZXh0ID0gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCA/IHN1cnJvZ2F0ZUNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSA6IGNvbnRleHQ7XG4gICAgICAgIHN1cnJvZ2F0ZUNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICAgIHlpZWxkIFJlYWN0LkNoaWxkcmVuLm1hcFRyZWUocmVuZGVyZWRDb21wb25lbnQsIChjaGlsZENvbXBvbmVudCkgPT4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkQ29tcG9uZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgY2hpbGRUeXBlID0gY2hpbGRDb21wb25lbnQudHlwZTtcbiAgICAgICAgICBpZighXy5pc09iamVjdChjaGlsZFR5cGUpIHx8ICFjaGlsZFR5cGUuX19SZWFjdE5leHVzU3Vycm9nYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBjb21wb25lbnQsIHN1cnJvZ2F0ZSBmb3IgdGhpcyBjaGlsZCAod2l0aG91dCBpbmplY3RpbmcgZnJvbSB0aGUgcHJlZmV0Y2hlZCBzdG9yZXMpLlxuICAgICAgICAgIGxldCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudCA9IG5ldyBjaGlsZFR5cGUuX19SZWFjdE5leHVzU3Vycm9nYXRlKHsgY29udGV4dDogY2hpbGRDb250ZXh0LCBwcm9wczogY2hpbGRDb21wb25lbnQucHJvcHMgfSk7XG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke3N1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50LmRpc3BsYXlOYW1lfSBkb2Vzbid0IGltcGxlbWVudCBjb21wb25lbnRXaWxsTW91bnQuIE1heWJlIHlvdSBmb3Jnb3QgUi5Db21wb25lbnQubWl4aW4gP2ApOyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgeWllbGQgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XG4gICAgICAgICAgc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgfSwgdGhpcykpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoKGxvY2F0aW9uLCBwYXJhbXMpIHtcbiAgICAgIGxldCB7IG5hbWUsIGtleSB9ID0gRmx1eE1peGluU3RhdGljcy5wYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICBsZXQgW2Rpc3BhdGNoZXJOYW1lLCBhY3Rpb25dID0gW25hbWUsIGtleV07XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgcmV0dXJuIGZsdXguZGlzcGF0Y2goZGlzcGF0Y2hlck5hbWUsIGFjdGlvbiwgcGFyYW1zKTtcbiAgICB9LFxuXG4gIH07XG5cbiAgZnVuY3Rpb24gUHJvcFR5cGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAgcmV0dXJuIHByb3BzLmZsdXggJiYgcHJvcHMuZmx1eCBpbnN0YW5jZW9mIEZsdXg7XG4gIH1cblxuICBfLmV4dGVuZChGbHV4LCB7IE1peGluLCBQcm9wVHlwZSB9KTtcblxuICByZXR1cm4gRmx1eDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=