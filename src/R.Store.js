module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const co = _.co;

  class Subscription {
    constructor({ path, handler }) {
      _.dev(() => path.should.be.a.String &&
        handler.should.be.a.Function
      );
      let id = _.uniqueId(path);
      _.extend(this, { path, handler, id });
    }

    addTo(subscriptions) {
      _.dev(() => subscriptions.should.be.an.Object);
      if(!subscriptions[this.path]) {
        subscriptions[this.path] = {};
      }
      _.dev(() => subscriptions[this.path].should.be.an.Object &&
        subscriptions[this.path][this.id].should.not.be.ok
      );
      subscriptions[this.path][this.id] = this;
      return Object.keys(subscriptions[this.path]).length === 1;
    }

    removeFrom(subscriptions) {
      _.dev(() => subscriptions.should.be.an.Object &&
        subscriptions[this.path].shoulbe.be.an.Object &&
        subscriptions[this.path][this.id].should.be.exactly(this)
      );
      delete subscriptions[this.path][this.id];
      if(Object.keys(subscriptions[this.path]).length === 0) {
        delete subscriptions[this.path];
        return true;
      }
      return false;
    }

    update(value) {
      _.dev(() => (value === null || _.isObject(value)).should.be.ok);
      this.handler.call(null, value);
    }
  }

  _.extend(Subscription.prototype, {
    path: null,
    handler: null,
    id: null,
  });

  class Store {
    constructor() {
      this._destroyed = false;
      this._cache = {};
      this.subscriptions = {};
    }

    destroy() {
      this._shouldNotBeDestroyed();
      // Explicitly nullify the cache
      Object.keys(this._cache).forEach((path) => this._cache[path] = null);
      // Nullify references
      this._cache = null;
      this._destroyed = true;
    }

    getDisplayName() { _.abstract(); }

    fetch(path) { _.abstract(); }

    subscribeTo(path, handler) {
      this._shouldNotBeDestroyed();
      let subscription = new Subscription({ path, handler });
      return {
        subscription,
        createdPath: subscription.addTo(this.subscriptions),
      };
    }

    unsubscribeFrom({ subscription }) {
      this._shouldNotBeDestroyed();
      _.dev(() => subscription.should.be.an.instanceOf(Subscription));
      return {
        subscriptions,
        deletedPath: subscriptions.removeFrom(this.subscriptions),
      };
    }

    serialize({ preventEncoding }) {
      this._shouldNotBeDestroyed();
      let serializable = _.extend({}, this._cache);
      return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
    }

    unserialize(serialized, { preventDecoding }) {
      this._shouldNotBeDestroyed();
      let unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
      _.extend(this, { _cache: unserializable });
      return this;
    }

    propagateUpdate(path, value) {
      this._shouldNotBeDestroyed();
      this._cache[path] = value;
      if(this.subscriptions[path]) {
        Object.keys(this.subscriptions[path])
        .forEach((key) => this.subscriptions[path][key].update(value));
      }
    }

    getCachedValue(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => _.has(this._cache, path).should.be.ok);
      return this._cache[path];
    }

    hasCachedValue(path) {
      this._shouldNotBeDestroyed();
      return _.has(this._cache, path);
    }

    _shouldNotBeDestroyed() {
      _.dev(() => this._destroyed.should.not.be.ok);
    }
  }

  _.extend(Store.prototype, {
    _cache: null,
    _destroyed: null,
    subscriptions: null,
  });

  class MemoryStore extends Store {
    constructor() {
      super(...arguments);
      this._data = {};
    }

    destroy() {
      super.destroy();
      // Explicitly nullify data
      Object.keys(this._data)
      .forEach((path) => this._data[path] = null);
      // Nullify references
      this._data = null;
    }

    getDisplayName() {
      return 'MemoryStore';
    }

    fetch(path) {
      return Promise.try(() => {
        _.dev(() => _.has(this._data, path).should.be.ok);
        return this._data[path];
      });
    }

    set(path, value) {
      this._shouldNotBeDestroyed();
      this._data[path] = value;
      if(this.subscriptions[path]) {
        Object.keys(this.subscriptions[path])
        .forEach((key) => this.subscriptions[path].update(value));
      }
    }
  }

  _.extend(MemoryStore.prototype, {
    _data: null,
  });

  class HTTPStore extends Store {
    constructor({ http }) {
      _.dev(() => http.shoud.be.an.Object &&
        http.fetch.should.be.a.Function
      );
      super(...arguments);
      this._http = http;
    }

    getDisplayName() {
      return 'HTTPStore';
    }
  }

  _.extend(HTTPStore.prototype, {
    _http: null,
  });

  class UplinkStore extends Store {
    constructor({ uplink }) {
      _.dev(() => uplink.should.be.an.instanceOf(R.Uplink));
      super(...arguments);
      this._uplink = uplink;
    }

    getDisplayName() {
      return 'UplinkStore';
    }
  }

  _.extend(UplinkStore.prototype, {
    _uplink: null,
  });

  _.extend(Store, { MemoryStore, HTTPStore, UplinkStore });

  return Store;

};


       //  /**
       //   * <p> Implementation of R.Store using a remote, HTTP passive Store. The store is read-only from the components, <br />
       //   * as well as from the Client in general. However, its values may be updated across refreshes/reloads, but the remote <br />
       //   * backend should be wired-up with R.Dispatcher.HTTPDispatcher to implement a second-class over-the-wire Flux. </p>
       //   */
       //   createHTTPStore: function createHTTPStore() {
       //    return function HTTPStore(http) {
       //      R.Debug.dev(function() {
       //        assert(http.fetch && _.isFunction(http.fetch), 'R.Store.createHTTPStore(...).http.fetch: expecting Function.');
       //      });
       //      var _fetch = http.fetch;
       //      var _destroyed = false;
       //      var data = {};
       //      var subscribers = {};
       //      var fetch = function* fetch(key) {
       //        var val = yield _fetch(key);
       //        if(!_destroyed) {
       //          data[key] = val;
       //          return val;
       //        }
       //        else {
       //          throw new Error('R.Store.HTTPStore.fetch(...): instance destroyed.');
       //        }
       //      };

       //      var get = function get(key) {
       //        if(!_.has(data, key)) {
       //          console.warn('R.Store.MemoryStore.get(...): data not available. ('' + key + '')');
       //        }
       //        return data[key];
       //      };

       //      var sub = function sub(key) {
       //        var subscription = new R.Store.Subscription(key);
       //        if(!_.has(subscribers, key)) {
       //          subscribers[key] = {};
       //        }
       //        subscribers[key][subscription.uniqueId] = subscription;
       //        return subscription;
       //      };

       //      var unsub = function unsub(subscription) {
       //        R.Debug.dev(function() {
       //          assert(!_destroyed, 'R.Store.UplinkStore.unsub(...): instance destroyed.');
       //          assert(subscription instanceof R.Store.Subscription, 'R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.');
       //          assert(_.has(subscribers, subscription.key), 'R.Store.UplinkStore.unsub(...): no subscribers for this key. ('' + subscription.key + '')');
       //          assert(_.has(subscribers[subscription.key], subscription.uniqueId), 'R.Store.UplinkStore.unsub(...): no such subscription. ('' + subscription.key + '', '' + subscription.uniqueId + '')');
       //        });
       //        delete subscribers[subscription.key][subscription.uniqueId];
       //        if(_.size(subscribers[subscription.key]) === 0) {
       //          delete subscribers[subscription.key];
       //          if(_.has(data, subscription.key)) {
       //            delete data[subscription.key];
       //          }
       //        }
       //      };

       //      var serialize = function serialize() {
       //        return JSON.stringify(data);
       //      };

       //      var unserialize = function unserialize(str) {
       //        _.extend(data, JSON.parse(str));
       //      };

       //      var destroy = function destroy() {
       //        R.Debug.dev(function() {
       //          assert(!_destroyed, 'R.Store.UplinkStore.destroy(...): instance destroyed.');
       //        });
       //        _.each(subscribers, function(keySubscribers, key) {
       //          _.each(subscribers[key], unsub);
       //        });
       //        _.each(data, function(val, key) {
       //          delete data[key];
       //        });
       //        data = null;
       //        subscribers = null;
       //        _destroyed = true;
       //      };

       //      return new (R.Store.createStore({
       //        displayName: 'HTTPStore',
       //        _data: data,
       //        _subscribers: subscribers,
       //        fetch: fetch,
       //        get: get,
       //        sub: sub,
       //        unsub: unsub,
       //        serialize: serialize,
       //        unserialize: unserialize,
       //        destroy: destroy,
       //      }))();
       //    };
       //  },
       //  /**
       //   * <p>Implementation of R.Store using a remote, REST-like Store. The store is read-only from the components, <br />
       //   * as well as from the Client in general, but the remote backend should be wired-up with R.Dispatcher.UplinkDispatcher to
       //   * implement the over-the-wire Flux. </p>
       //   * @class R.Store.UplinkStore
       //   * @implements {R.Store}
       //   */
       //   createUplinkStore: function createUplinkStore() {
       //    return function UplinkStore(uplink) {
       //      R.Debug.dev(function() {
       //        assert(uplink.fetch && _.isFunction(uplink.fetch), 'R.Store.createUplinkStore(...).uplink.fetch: expecting Function.');
       //        assert(uplink.subscribeTo && _.isFunction(uplink.subscribeTo), 'R.Store.createUplinkStore(...).uplink.subscribeTo: expecting Function.');
       //        assert(uplink.unsubscribeFrom && _.isFunction(uplink.unsubscribeFrom), 'R.Store.createUplinkStore(...).uplink.unsubscribeFrom: expecting Function.');
       //      });
       //      var _fetch = uplink.fetch;
       //      var subscribeTo = uplink.subscribeTo;
       //      var unsubscribeFrom = uplink.unsubscribeFrom;
       //      _destroyed = false;
       //      var data = {};
       //      var subscribers = {};
       //      var updaters = {};

       //          /**
       //          * <p>Fetch data according to a key</p>
       //          * @method fetch
       //          * @param {string} key The key
       //          * @return {Function} fn the yielded fonction
       //          */
       //          var fetch = function* fetch(key) {
       //            var val = yield _fetch(key);
       //            if(!_destroyed) {
       //              data[key] = val;
       //              return val;
       //            }
       //            else {
       //              throw new Error('R.Store.UplinkStore.fetch(...): instance destroyed.');
       //            }
       //          };
       //          var get = function get(key) {
       //            R.Debug.dev(function() {
       //              if(!_.has(data, key)) {
       //                console.warn('R.Store.UplinkStore.get(...): data not available. ('' + key + '')');
       //              }
       //            });
       //            return data[key];
       //          };
       //          /**
       //          * <p>Triggered by the socket.on('update') event in R.Uplink <br />
       //          * Fetch data according to the given key <br />
       //          * Call the saved function contained in subscribers </p>
       //          * @method signalUpdate
       //          * @param {string} key The key to fetch
       //          */
       //          var signalUpdate = function signalUpdate(key, val) {
       //            if(!_.has(subscribers, key)) {
       //              return;
       //            }
       //            _.each(subscribers[key], function(fn, uniqueId) {
       //              if(fn) {
       //                fn(val);
       //              }
       //            });
       //          };
       //         /**
       //          * <p> Subscribe at a specific key </p>
       //          * @method sub
       //          * @param {string} key The specific key to subscribe
       //          * @param {function} _signalUpdate the function that will be call when a data corresponding to a key will be updated
       //          * @return {Object} subscription The saved subscription
       //          */
       //          var sub = function sub(key, _signalUpdate) {
       //            R.Debug.dev(function() {
       //              assert(!_destroyed, 'R.Store.UplinkStore.sub(...): instance destroyed. ('' + key + '')');
       //            });
       //            var subscription = new R.Store.Subscription(key);
       //            if(!_.has(subscribers, key)) {
       //              subscribers[key] = {};
       //                  // call subscribeTo from R.Uplink => emit 'subscribeTo' signal
       //                  updaters[key] = subscribeTo(key, signalUpdate);
       //                }
       //                subscribers[key][subscription.uniqueId] = _signalUpdate;
       //                co(function*() {
       //                  var val = yield fetch(key);
       //                  _.defer(function() {
       //                    _signalUpdate(val);
       //                  });
       //                }).call(this, R.Debug.rethrow('R.Store.sub.fetch(...): data not available. ('' + key + '')'));
       //                return subscription;
       //              };
       //          /**
       //          * <p> Unsubscribe</p>
       //          * @method unsub
       //          * @param {object} subscription The subscription that contains the key to unsuscribe
       //          */
       //          var unsub = function unsub(subscription) {
       //            R.Debug.dev(function() {
       //              assert(!_destroyed, 'R.Store.UplinkStore.unsub(...): instance destroyed.');
       //              assert(subscription instanceof R.Store.Subscription, 'R.Store.UplinkStore.unsub(...): type R.Store.Subscription expected.');
       //              assert(_.has(subscribers, subscription.key), 'R.Store.UplinkStore.unsub(...): no subscribers for this key. ('' + subscription.key + '')');
       //              assert(_.has(subscribers[subscription.key], subscription.uniqueId), 'R.Store.UplinkStore.unsub(...): no such subscription. ('' + subscription.key + '', '' + subscription.uniqueId + '')');
       //            });
       //            delete subscribers[subscription.key][subscription.uniqueId];
       //            if(_.size(subscribers[subscription.key]) === 0) {
       //              unsubscribeFrom(subscription.key, updaters[subscription.key]);
       //              delete subscribers[subscription.key];
       //              delete updaters[subscription.key];
       //              if(_.has(data, subscription.key)) {
       //                delete data[subscription.key];
       //              }
       //            }
       //          };

       //          /**
       //          * <p> Serialize the UplinkStore store </p>
       //          * @method serialize
       //          * @return {string} data The serialized UplinkStore store
       //          */
       //          var serialize = function serialize() {
       //            return JSON.stringify(data);
       //          };

       //          /**
       //          * <p> Unserialize the UplinkStore store </p>
       //          * @method unserialize
       //          * @param {string} str The string to unserialise
       //          */
       //          var unserialize = function unserialize(str) {
       //            _.extend(data, JSON.parse(str));
       //          };

       //          /**
       //          * <p> Clean UplinkStore store </p>
       //          * @method destroy
       //          */
       //          var destroy = function destroy() {
       //            R.Debug.dev(function() {
       //              assert(!_destroyed, 'R.Store.UplinkStore.destroy(...): instance destroyed.');
       //            });
       //            _.each(subscribers, function(keySubscribers, key) {
       //              _.each(subscribers[key], unsub);
       //            });
       //            _.each(data, function(val, key) {
       //              delete data[key];
       //            });
       //            data = null;
       //            subscribers = null;
       //            updaters = null;
       //            _destroyed = true;
       //          };
       //          return new (R.Store.createStore({
       //            displayName: 'UplinkStore',
       //            _data: data,
       //            _subscribers: subscribers,
       //            _updaters: updaters,
       //            fetch: fetch,
       //            get: get,
       //            sub: sub,
       //            unsub: unsub,
       //            signalUpdate: signalUpdate,
       //            serialize: serialize,
       //            unserialize: unserialize,
       //            destroy: destroy,
       //          }))();
       //        };
       //      },
       //    };

       //    _.extend(Store.Subscription.prototype, /** @lends R.Store.Subscription */{
       //  /**
       //   * @public
       //   * @readOnly
       //   * @type {String}
       //   */
       //   uniqueId: null,
       //  /**
       //   * @public
       //   * @readOnly
       //   * @type {String}
       //   */
       //   key: null,
       // });

       //    return Store;
       //  };
