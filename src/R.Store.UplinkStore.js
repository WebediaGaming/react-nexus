module.exports = function(R, Store) {
  const _ = R._;
  const should = R.should;

  class UplinkStore extends Store {
    constructor({ uplink }) {
      _.dev(() => uplink.should.be.an.instanceOf(R.Uplink));
      super(...arguments);
      this._uplink = uplink;
      this._uplinkSubscriptions = {};
      this._pending = null;
    }

    destroy() {
      super.destroy();
      // Explicitly nullify uplinkSubscriptions and pendings
      Object.keys(this._uplinkSubscriptions)
      // Unsubscriptions are made in each unsubscribeFrom in super.destory
      // (the last one calls this._uplink.unsubscribeFrom automatically).
      .forEach((id) => this._uplinkSubscriptions[id] = null);
      Object.keys(this._pending)
      .forEach((path) => {
        this._pending[path].cancel(new Error('UplinkStore destroy'));
        this._pending[path] = null;
      });
      // Nullify references
      this._uplink = null;
      this._uplinkSubscriptions = null;
      this._pending = null;
    }

    getDisplayName() {
      return 'UplinkStore';
    }

    fetch(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String);
      if(!this._pending[path]) {
        this._pending[path] = this._uplink.fetch(path).cancellable();
        _.dev(() => this._pending[path].then.should.be.a.Function);
      }
      return this._pending[path];
    }

    subscribeTo(path, handler) {
      let { subscription, createdPath } = super.subscribeTo(path, handler);
      if(createdPath) {
        _.dev(() => this._uplinkSubscriptions[subscription.id].should.not.be.ok);
        this._uplinkSubscriptions[subscription.id] = this._uplink.subscribeTo(path, (value) => this.propagateUpdate(path, value));
      }
      return { subscription, createdPath };
    }

    unsubscribeFrom({ subscription }) {
      let { deletedPath } = super.unsubscribeFrom({ subscription });
      if(deletedPath) {
        _.dev(() => this._uplinkSubscriptions[subscription.id].should.be.an.instanceOf(R.Uplink.Subscription));
        this._uplink.unsubscribeFrom(this._uplinkSubscriptions[subscription.id]);
        delete this._uplinkSubscriptions[subscription.id];
      }
      return { subscription, deletedPath };
    }
  }

  _.extend(UplinkStore.prototype, {
    _uplink: null,
    _uplinkSubscriptions: null,
  });

  return UplinkStore;
};
