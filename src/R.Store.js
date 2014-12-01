module.exports = function(R) {
  const _ = R._;
  const Subscription = require('./R.Store.Subscription')(R);

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

    pull(path, opts = {}) {
      let { bypassCache } = opts;
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String);
      if(bypassCache || !this._cache[path]) {
        this._cache[path] = this.fetch(path);
      }
      return this._cache[path];
    }

    fetch(path) { _.abstract(); } // jshint ignore:line

    subscribeTo(path, handler) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String &&
        handler.should.be.a.Function
      );
      let subscription = new Subscription({ path, handler });
      let createdPath = subscription.addTo(this.subscriptions);
      this.pull(path).then(handler);
      return { subscription, createdPath };
    }

    unsubscribeFrom({ subscription }) {
      this._shouldNotBeDestroyed();
      _.dev(() => subscription.should.be.an.instanceOf(Subscription));
      return {
        subscription,
        deletedPath: subscription.removeFrom(this.subscriptions),
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
      if(this.subscriptions[path]) {
        Object.keys(this.subscriptions[path])
        .forEach((key) => this.subscriptions[path][key].update(value));
      }
      return value;
    }

    getCachedValue(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String &&
        _.has(this._cache, path).should.be.ok &&
        this._cache[path].isFulfilled().should.be.ok
      );
      return this._cache[path].value();
    }

    hasCachedValue(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String);
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

  _.extend(Store, { Subscription });
  const MemoryStore = require('./R.Store.MemoryStore')(R, Store);
  const HTTPStore = require('./R.Store.HTTPStore')(R, Store);
  const UplinkStore = require('./R.Store.UplinkStore')(R, Store);

  _.extend(Store, { MemoryStore, HTTPStore, UplinkStore });

  return Store;

};
