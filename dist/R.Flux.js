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

          Object.keys(this._stores, function (storeName) {
            return _this.unregisterStore(storeName);
          });
          Object.keys(this._eventEmitters, function (eventEmitterName) {
            return _this.unregisterEventEmitter(eventEmitterName);
          });
          Object.keys(this._dispatchers, function (dispatcherName) {
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
          delete this._stores[storeName];
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
        var props, subscriptions, context, state, flux, surrogateComponent, renderedComponent, childContext;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          var _this30 = this;
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              props = this.props;
              subscriptions = this.getFluxStoreSubscriptions(props);
              context = this.context;
              state = _.extend({}, this.state || {});
              flux = this.getFlux();
              context$3$0.next = 7;
              return Object.keys(subscriptions).map(function (stateKey) {
                return _.copromise(regeneratorRuntime.mark(function callee$4$0() {
                  var location, _ref13, name, key, _ref14, storeName, path;
                  return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {case 0:
                        location = subscriptions[stateKey];
                        _ref13 = FluxMixinStatics.parseFluxLocation(location);
                        name = _ref13.name;
                        key = _ref13.key;
                        _ref14 = [name, key];
                        storeName = _ref14[0];
                        path = _ref14[1];
                        context$5$0.next = 9;
                        return flux.getStore(storeName).fetch(path);

                      case 9: state[stateKey] = context$5$0.sent;
                      case 10:
                      case "end": return context$5$0.stop();
                    }
                  }, callee$4$0, this);
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

              context$3$0.next = 13;
              return React.Children.mapTree(renderedComponent, function (childComponent) {
                return _.copromise(regeneratorRuntime.mark(function callee$4$0() {
                  var childType, surrogateChildComponent;
                  return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {case 0:

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

            case 13:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkZsdXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7O01BRXJDLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLFFBQ29DO1VBQTlCLE9BQU8sU0FBUCxPQUFPO1VBQUUsSUFBSSxTQUFKLElBQUk7VUFBRSxNQUFNLFNBQU4sTUFBTTtVQUFFLEdBQUcsU0FBSCxHQUFHOztBQUN0QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDdkIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUNwRSxDQUFDO0FBQ0YsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDeEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLElB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bnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcblxuICBjb25zdCBmbHV4TG9jYXRpb25SZWdFeHAgPSAvXiguKik6XFwvKC4qKSQvO1xuXG4gIGNsYXNzIEZsdXgge1xuICAgIGNvbnN0cnVjdG9yKHsgaGVhZGVycywgZ3VpZCwgd2luZG93LCByZXEgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gaGVhZGVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICB0aGlzLl9oZWFkZXJzID0gaGVhZGVycztcbiAgICAgIHRoaXMuX2d1aWQgPSBndWlkO1xuICAgICAgdGhpcy5fd2luZG93ID0gd2luZG93O1xuICAgICAgdGhpcy5fcmVxID0gcmVxO1xuICAgICAgdGhpcy5fc3RvcmVzID0ge307XG4gICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzID0ge307XG4gICAgICB0aGlzLl9kaXNwYXRjaGVycyA9IHt9O1xuICAgICAgdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGJvb3RzdHJhcCgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fc3RvcmVzLCAoc3RvcmVOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJTdG9yZShzdG9yZU5hbWUpKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50RW1pdHRlcnMsIChldmVudEVtaXR0ZXJOYW1lKSA9PiB0aGlzLnVucmVnaXN0ZXJFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSkpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fZGlzcGF0Y2hlcnMsIChkaXNwYXRjaGVyTmFtZSkgPT4gdGhpcy51bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9oZWFkZXJzID0gbnVsbDtcbiAgICAgIHRoaXMuX3dpbmRvdyA9IG51bGw7XG4gICAgICB0aGlzLl9yZXEgPSBudWxsO1xuICAgICAgdGhpcy5fc3RvcmVzID0gbnVsbDtcbiAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnMgPSBudWxsO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlcnMgPSBudWxsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICB0aGlzLl9zaG91bGRJbmplY3RGcm9tU3RvcmVzID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMuc2hvdWxkLmJlLm9rKTtcbiAgICAgIHRoaXMuX3Nob3VsZEluamVjdEZyb21TdG9yZXMgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGluamVjdGluZ0Zyb21TdG9yZXMoZm4pIHtcbiAgICAgIHRoaXMuX3N0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgbGV0IHIgPSBmbigpO1xuICAgICAgdGhpcy5fc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKTtcbiAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIHNob3VsZEluamVjdEZyb21TdG9yZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2hvdWxkSW5qZWN0RnJvbVN0b3JlcztcbiAgICB9XG5cbiAgICBzZXJpYWxpemUoeyBwcmV2ZW50RW5jb2RpbmcgfSkge1xuICAgICAgbGV0IHNlcmlhbGl6YWJsZSA9IF8ubWFwVmFsdWVzKHRoaXMuX3N0b3JlcywgKHN0b3JlKSA9PiBzdG9yZS5zZXJpYWxpemUoeyBwcmV2ZW50RW5jb2Rpbmc6IHRydWUgfSkpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIGxldCB1bnNlcmlhbGl6YWJsZSA9IHByZXZlbnREZWNvZGluZyA/IHNlcmlhbGl6ZWQgOiBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHNlcmlhbGl6ZWQpKTtcbiAgICAgIE9iamVjdC5rZXlzKHVuc2VyaWFsaXphYmxlKS5mb3JFYWNoKChzdG9yZU5hbWUpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5fc3RvcmVzW3N0b3JlTmFtZV0udW5zZXJpYWxpemUodW5zZXJpYWxpemFibGVbc3RvcmVOYW1lXSwgeyBwcmV2ZW50RGVjb2Rpbmc6IHRydWUgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyU3RvcmUoc3RvcmVOYW1lLCBzdG9yZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmUuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZSkgJiZcbiAgICAgICAgc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZygpICYmXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXSA9IHN0b3JlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlclN0b3JlKHN0b3JlTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldFN0b3JlKHN0b3JlTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICB9XG5cbiAgICByZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lLCBldmVudEVtaXR0ZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlcikgJiZcbiAgICAgICAgZXZlbnRFbWl0dGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyc1tldmVudEVtaXR0ZXJOYW1lXS5zaG91bGQubm90LmJlLm9rXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5yZWdpc3RlckV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldEV2ZW50RW1pdHRlcihldmVudEVtaXR0ZXJOYW1lKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSwgZGlzcGF0Y2hlcikge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpICYmXG4gICAgICAgIGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXSA9IGRpc3BhdGNoZXI7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnJlZ2lzdGVyRGlzcGF0Y2hlcihkaXNwYXRjaGVyTmFtZSkge1xuICAgICAgXy5kZXYoKCkgPT4gZGlzcGF0Y2hlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkRpc3BhdGNoZXIpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHRoaXMuX2Rpc3BhdGNoZXJzW2Rpc3BhdGNoZXJOYW1lXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldERpc3BhdGNoZXIoZGlzcGF0Y2hlck5hbWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IGRpc3BhdGNoZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5EaXNwYXRjaGVyKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyc1tkaXNwYXRjaGVyTmFtZV07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBzdG9yZU5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX3N0b3Jlc1tzdG9yZU5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUpICYmXG4gICAgICAgIHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgc3RvcmUgPSB0aGlzLmdldFN0b3JlKHN0b3JlTmFtZSk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uID0gc3RvcmUuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbShzdG9yZU5hbWUsIHN1YnNjcmlwdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gc3RvcmVOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9zdG9yZXNbc3RvcmVOYW1lXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlN0b3JlKSAmJlxuICAgICAgICBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5TdG9yZS5TdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgbGV0IHN0b3JlID0gdGhpcy5nZXRTdG9yZShzdG9yZU5hbWUpO1xuICAgICAgcmV0dXJuIHN0b3JlLnVuc3Vic2NyaWJlRnJvbShzdWJzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIGxpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX2V2ZW50RW1pdHRlcnNbZXZlbnRFbWl0dGVyTmFtZV0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5FdmVudEVtaXR0ZXIpICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XG4gICAgICBsZXQgbGlzdGVuZXIgPSBldmVudEVtaXR0ZXIubGlzdGVuVG8ocm9vbSwgaGFuZGxlcik7XG4gICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgfVxuXG4gICAgdW5saXN0ZW5Gcm9tKGV2ZW50RW1pdHRlck5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBldmVudEVtaXR0ZXJOYW1lLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICB0aGlzLl9ldmVudEVtaXR0ZXJzW2V2ZW50RW1pdHRlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRXZlbnRFbWl0dGVyKSAmJlxuICAgICAgICBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBsZXQgZXZlbnRFbWl0dGVyID0gdGhpcy5nZXRFdmVudEVtaXR0ZXIoZXZlbnRFbWl0dGVyTmFtZSk7XG4gICAgICByZXR1cm4gZXZlbnRFbWl0dGVyLnVubGlzdGVuRnJvbShsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goZGlzcGF0Y2hlck5hbWUsIGFjdGlvbiwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICBfLmRldigoKSA9PiBkaXNwYXRjaGVyTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlcnNbZGlzcGF0Y2hlck5hbWVdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRGlzcGF0Y2hlcikgJiZcbiAgICAgICAgYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBkaXNwYXRjaGVyID0gdGhpcy5nZXREaXNwYXRjaGVyKGRpc3BhdGNoZXJOYW1lKTtcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyLmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChGbHV4LnByb3RvdHlwZSwge1xuICAgIF9oZWFkZXJzOiBudWxsLFxuICAgIF9ndWlkOiBudWxsLFxuICAgIF93aW5kb3c6IG51bGwsXG4gICAgX3JlcTogbnVsbCxcbiAgICBfc3RvcmVzOiBudWxsLFxuICAgIF9ldmVudEVtaXR0ZXJzOiBudWxsLFxuICAgIF9kaXNwYXRjaGVyczogbnVsbCxcbiAgICBfc2hvdWxkSW5qZWN0RnJvbVN0b3JlczogbnVsbCxcbiAgfSk7XG5cbiAgY29uc3QgRmx1eE1peGluU3RhdGljcyA9IHtcbiAgICBwYXJzZUZsdXhMb2NhdGlvbihsb2NhdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gbG9jYXRpb24uc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGxldCByID0gZmx1eExvY2F0aW9uUmVnRXhwLmV4ZWMobG9jYXRpb24pO1xuICAgICAgXy5kZXYoKCkgPT4gKHIgIT09IG51bGwpLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geyBuYW1lOiByWzBdLCBrZXk6IHJbMV0gfTtcbiAgICB9LFxuXG4gICAgX2dldEluaXRpYWxTdGF0ZUZyb21GbHV4U3RvcmVzKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnModGhpcy5wcm9wcyk7XG4gICAgICByZXR1cm4gXy5vYmplY3QoT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgLm1hcCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGVLZXkgPSBzdWJzY3JpcHRpb25zW2xvY2F0aW9uXTtcbiAgICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICAgIGxldCBbc3RvcmVOYW1lLCBwYXRoXSA9IFtuYW1lLCBrZXldO1xuICAgICAgICAgIGxldCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoc3RvcmVOYW1lKTtcbiAgICAgICAgICBfLmRldigoKSA9PiBzdG9yZS5oYXNDYWNoZWRWYWx1ZShwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgICAgIGxldCB2YWx1ZSA9IHN0b3JlLmdldENhY2hlZFZhbHVlKHBhdGgpO1xuICAgICAgICAgIHJldHVybiBbc3RhdGVLZXksIHZhbHVlXTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSxcblxuICAgIF9nZXRJbml0aWFsU3RhdGVXaWxsTnVsbFZhbHVlcygpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gdGhpcy5nZXRGbHV4U3RvcmVTdWJzY3JpcHRpb25zKHRoaXMucHJvcHMpO1xuICAgICAgcmV0dXJuIF8ub2JqZWN0KE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKGxvY2F0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlS2V5ID0gc3Vic2NyaXB0aW9uc1tsb2NhdGlvbl07XG4gICAgICAgICAgcmV0dXJuIFtzdGF0ZUtleSwgbnVsbF07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlRmx1eChwcm9wcykge1xuICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgcHJvcHMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBjdXJyZW50U3Vic2NyaXB0aW9ucyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnNba2V5XSk7XG4gICAgICBsZXQgY3VycmVudExpc3RlbmVycyA9IE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVycylcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pO1xuXG4gICAgICBsZXQgbmV4dFN1YnNjcmlwdGlvbnMgPSB0aGlzLmdldEZsdXhTdG9yZVN1YnNjcmlwdGlvbnMocHJvcHMpO1xuICAgICAgbGV0IG5leHRMaXN0ZW5lcnMgPSB0aGlzLmdldEZsdXhFdmVudEVtaXR0ZXJzTGlzdGVuZXJzKHByb3BzKTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dFN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgobG9jYXRpb24pID0+IHtcbiAgICAgICAgbGV0IHN0YXRlS2V5ID0gbmV4dFN1YnNjcmlwdGlvbnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgRmx1eE1peGluU3RhdGljcy5fc3Vic2NyaWJlVG8oc3RvcmVOYW1lLCBwYXRoLCBzdGF0ZUtleSk7XG4gICAgICB9KTtcblxuICAgICAgT2JqZWN0LmtleXMobmV4dExpc3RlbmVycylcbiAgICAgIC5mb3JFYWNoKChsb2NhdGlvbikgPT4ge1xuICAgICAgICBsZXQgaGFuZGxlciA9IG5leHRMaXN0ZW5lcnNbbG9jYXRpb25dO1xuICAgICAgICBsZXQgeyBuYW1lLCBrZXkgfSA9IEZsdXhNaXhpblN0YXRpY3MucGFyc2VGbHV4TG9jYXRpb24obG9jYXRpb24pO1xuICAgICAgICBsZXQgW2V2ZW50RW1pdHRlck5hbWUsIHJvb21dID0gW25hbWUsIGtleV07XG4gICAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGN1cnJlbnRTdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4gdGhpcy5fdW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbikpO1xuICAgICAgY3VycmVudExpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gdGhpcy5fdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSk7XG4gICAgfSxcblxuICAgIF9jbGVhckZsdXgoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bnN1YnNjcmliZUZyb20odGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1trZXldKSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLl91bmxpc3RlbkZyb20odGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2tleV0pKTtcbiAgICB9LFxuXG4gICAgX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7XG4gICAgICBfLmRldigoKSA9PiBzdGF0ZUtleS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdmFsdWUuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIHJldHVybiBSLkFzeW5jLmlmTW91bnRlZCgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2spO1xuICAgICAgICB0aGlzLmZsdXhTdG9yZVdpbGxVcGRhdGUoc3RvcmVOYW1lLCBwYXRoLCB2YWx1ZSwgc3RhdGVLZXkpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgW3N0YXRlS2V5XTogdmFsdWUgfSk7XG4gICAgICAgIHRoaXMuZmx1eFN0b3JlRGlkVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX3N1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgc3RhdGVLZXkpIHtcbiAgICAgIF8uZGV2KCgpID0+IHN0b3JlTmFtZS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgc3RhdGVLZXkuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGxldCBwcm9wYWdhdGVVcGRhdGUgPSAodmFsdWUpID0+IEZsdXhNaXhpblN0YXRpY3MuX3Byb3BhZ2F0ZVN0b3JlVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBmbHV4LnN1YnNjcmliZVRvKHN0b3JlTmFtZSwgcGF0aCwgcHJvcGFnYXRlVXBkYXRlKTtcbiAgICAgIGxldCBpZCA9IF8udW5pcXVlSWQoc3RhdGVLZXkpO1xuICAgICAgdGhpcy5fRmx1eE1peGluU3Vic2NyaXB0aW9uc1tpZF0gPSB7IHN1YnNjcmlwdGlvbiwgaWQsIHN0b3JlTmFtZSB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIF91bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24sIGlkLCBzdG9yZU5hbWUgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuU3RvcmUuU3Vic2NyaXB0aW9uKSAmJlxuICAgICAgICBpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXS5zaG91bGQuYmUuZXhhY3RseShzdWJzY3JpcHRpb24pXG4gICAgICApO1xuICAgICAgbGV0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcbiAgICAgIGZsdXgudW5zdWJzY3JpYmVGcm9tKHN0b3JlTmFtZSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9GbHV4TWl4aW5TdWJzY3JpcHRpb25zW2lkXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBfcHJvcGFnYXRlRXZlbnQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7XG4gICAgICBfLmRldigoKSA9PiBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gUi5Bc3luYy5pZk1vdW50ZWQoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9GbHV4TWl4aW4uc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgdGhpcy5mbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgICAgaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgICAgIHRoaXMuZmx1eEV2ZW50RW1pdHRlckRpZEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKTtcbiAgICAgIH0pXG4gICAgICAuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2xpc3RlblRvKGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIGhhbmRsZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGV2ZW50RW1pdHRlck5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICAgKTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICBsZXQgcHJvcGFnYXRlRXZlbnQgPSAocGFyYW1zKSA9PiBGbHV4TWl4aW5TdGF0aWNzLl9wcm9wYWdhdGVFdmVudChldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwYXJhbXMsIGhhbmRsZXIpO1xuICAgICAgbGV0IGxpc3RlbmVyID0gZmx1eC5saXN0ZW5UbyhldmVudEVtaXR0ZXJOYW1lLCByb29tLCBwcm9wYWdhdGVFdmVudCk7XG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHJvb20pO1xuICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXSA9IHsgbGlzdGVuZXIsIGlkLCBldmVudEVtaXR0ZXJOYW1lIH07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgX3VubGlzdGVuRnJvbSh7IGxpc3RlbmVyLCBpZCwgZXZlbnRFbWl0dGVyTmFtZSB9KSB7XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lci5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkV2ZW50RW1pdHRlci5MaXN0ZW5lcikgJiZcbiAgICAgICAgaWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIHRoaXMuX0ZsdXhNaXhpbi5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgdGhpcy5fRmx1eE1peGluTGlzdGVuZXJzW2lkXS5zaG91bGQuYmUuZXhhY3RseShsaXN0ZW5lcilcbiAgICAgICk7XG4gICAgICBsZXQgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuICAgICAgZmx1eC51bmxpc3RlbkZyb20oZXZlbnRFbWl0dGVyTmFtZSwgbGlzdGVuZXIpO1xuICAgICAgZGVsZXRlIHRoaXMuX0ZsdXhNaXhpbkxpc3RlbmVyc1tpZF07XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZGVmYXVsdEltcGxlbWVudGF0aW9uczoge1xuICAgICAgZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcykgeyByZXR1cm4ge307IH0sXG4gICAgICBnZXRGbHV4RXZlbnRFbWl0dGVyc0xpc3RlbmVycyhwcm9wcykgeyByZXR1cm4ge307IH0sXG4gICAgICBmbHV4U3RvcmVXaWxsVXBkYXRlKHN0b3JlTmFtZSwgcGF0aCwgdmFsdWUsIHN0YXRlS2V5KSB7fSxcbiAgICAgIGZsdXhTdG9yZURpZFVwZGF0ZShzdG9yZU5hbWUsIHBhdGgsIHZhbHVlLCBzdGF0ZUtleSkge30sXG4gICAgICBmbHV4RXZlbnRFbWl0dGVyV2lsbEVtaXQoZXZlbnRFbWl0dGVyTmFtZSwgcm9vbSwgcGFyYW1zLCBoYW5kbGVyKSB7fSxcbiAgICAgIGZsdXhFdmVudEVtaXR0ZXJEaWRFbWl0KGV2ZW50RW1pdHRlck5hbWUsIHJvb20sIHBhcmFtcywgaGFuZGxlcikge30sXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IEZsdXhNaXhpbiA9IHtcbiAgICBfRmx1eE1peGluOiB0cnVlLFxuICAgIF9GbHV4TWl4aW5TdWJzY3JpcHRpb25zOiBudWxsLFxuICAgIF9GbHV4TWl4aW5MaXN0ZW5lcnM6IG51bGwsXG5cbiAgICBzdGF0aWNzOiB7IEZsdXhNaXhpblN0YXRpY3MgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgIGlmKHRoaXMuZ2V0Rmx1eCgpLnNob3VsZEluamVjdEZyb21TdG9yZXMoKSkge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlRnJvbUZsdXhTdG9yZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gRmx1eE1peGluU3RhdGljcy5fZ2V0SW5pdGlhbFN0YXRlV2lsbE51bGxWYWx1ZXMuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRGbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuZ2V0Rmx1eCgpLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRmx1eCkgJiZcbiAgICAgICAgdGhpcy5fQXN5bmNNaXhpbi5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9GbHV4TWl4aW5MaXN0ZW5lcnMgPSB7fTtcbiAgICAgIHRoaXMuX0ZsdXhNaXhpblN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKEZsdXhNaXhpblN0YXRpY3MuZGVmYXVsdEltcGxlbWVudGF0aW9ucylcbiAgICAgIC5mb3JFYWNoKChtZXRob2ROYW1lKSA9PiB0aGlzW21ldGhvZE5hbWVdID0gdGhpc1ttZXRob2ROYW1lXSB8fCBGbHV4TWl4aW5TdGF0aWNzLmRlZmF1bHRJbXBsZW1lbnRhdGlvbnNbbWV0aG9kTmFtZV0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgRmx1eE1peGluU3RhdGljcy5fdXBkYXRlRmx1eC5jYWxsKHRoaXMsIHRoaXMucHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICBGbHV4TWl4aW5TdGF0aWNzLl91cGRhdGVGbHV4LmNhbGwodGhpcywgcHJvcHMpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIEZsdXhNaXhpblN0YXRpY3MuX2NsZWFyRmx1eC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBwcmVmZXRjaEZsdXhTdG9yZXMoKSB7XG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9ucyA9IHRoaXMuZ2V0Rmx1eFN0b3JlU3Vic2NyaXB0aW9ucyhwcm9wcyk7XG4gICAgICAgIGxldCBjb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBsZXQgc3RhdGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5zdGF0ZSB8fCB7fSk7XG4gICAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICAgIHlpZWxkIE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIC5tYXAoKHN0YXRlS2V5KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uID0gc3Vic2NyaXB0aW9uc1tzdGF0ZUtleV07XG4gICAgICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgICAgICBsZXQgW3N0b3JlTmFtZSwgcGF0aF0gPSBbbmFtZSwga2V5XTtcbiAgICAgICAgICBzdGF0ZVtzdGF0ZUtleV0gPSB5aWVsZCBmbHV4LmdldFN0b3JlKHN0b3JlTmFtZSkuZmV0Y2gocGF0aCk7XG4gICAgICAgIH0sIHRoaXMpKTtcblxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcG9uZW50LCBzdXJyb2dhdGUgZm9yIHRoaXMgb25lLCBidXQgdGhpcyB0aW1lIGluamVjdCBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3Jlcy5cbiAgICAgICAgbGV0IHN1cnJvZ2F0ZUNvbXBvbmVudDtcbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHtcbiAgICAgICAgICBzdXJyb2dhdGVDb21wb25lbnQgPSBuZXcgdGhpcy5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0LCBwcm9wcywgc3RhdGUgfSk7XG4gICAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgcmVuZGVyZWRDb21wb25lbnQgPSBzdXJyb2dhdGVDb21wb25lbnQucmVuZGVyKCk7XG4gICAgICAgIGxldCBjaGlsZENvbnRleHQgPSBzdXJyb2dhdGVDb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0ID8gc3Vycm9nYXRlQ29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dDtcbiAgICAgICAgc3Vycm9nYXRlQ29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgeWllbGQgUmVhY3QuQ2hpbGRyZW4ubWFwVHJlZShyZW5kZXJlZENvbXBvbmVudCwgKGNoaWxkQ29tcG9uZW50KSA9PiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgaWYoIV8uaXNPYmplY3QoY2hpbGRDb21wb25lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBjaGlsZFR5cGUgPSBjaGlsZENvbXBvbmVudC50eXBlO1xuICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGNoaWxkVHlwZSkgfHwgIWNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBvbmVudCwgc3Vycm9nYXRlIGZvciB0aGlzIGNoaWxkICh3aXRob3V0IGluamVjdGluZyBmcm9tIHRoZSBwcmVmZXRjaGVkIHN0b3JlcykuXG4gICAgICAgICAgbGV0IHN1cnJvZ2F0ZUNoaWxkQ29tcG9uZW50ID0gbmV3IGNoaWxkVHlwZS5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoeyBjb250ZXh0OiBjaGlsZENvbnRleHQsIHByb3BzOiBjaGlsZENvbXBvbmVudC5wcm9wcyB9KTtcbiAgICAgICAgICBpZighc3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiB7IHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7c3Vycm9nYXRlQ2hpbGRDb21wb25lbnQuZGlzcGxheU5hbWV9IGRvZXNuJ3QgaW1wbGVtZW50IGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLkNvbXBvbmVudC5taXhpbiA/YCk7IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgICBzdXJyb2dhdGVDaGlsZENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICB9LCB0aGlzKSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2gobG9jYXRpb24sIHBhcmFtcykge1xuICAgICAgbGV0IHsgbmFtZSwga2V5IH0gPSBGbHV4TWl4aW5TdGF0aWNzLnBhcnNlRmx1eExvY2F0aW9uKGxvY2F0aW9uKTtcbiAgICAgIGxldCBbZGlzcGF0Y2hlck5hbWUsIGFjdGlvbl0gPSBbbmFtZSwga2V5XTtcbiAgICAgIGxldCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG4gICAgICByZXR1cm4gZmx1eC5kaXNwYXRjaChkaXNwYXRjaGVyTmFtZSwgYWN0aW9uLCBwYXJhbXMpO1xuICAgIH0sXG5cbiAgfTtcblxuICBmdW5jdGlvbiBQcm9wVHlwZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICByZXR1cm4gcHJvcHMuZmx1eCAmJiBwcm9wcy5mbHV4IGluc3RhbmNlb2YgRmx1eDtcbiAgfVxuXG4gIF8uZXh0ZW5kKEZsdXgsIHsgTWl4aW4sIFByb3BUeXBlIH0pO1xuXG4gIHJldHVybiBGbHV4O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==