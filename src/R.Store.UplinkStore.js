module.exports = function(R, Store) {
  const _ = R._;

  class UplinkStore extends Store {
    constructor({ uplink }) {
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(() => uplink.subscribeTo.should.be.a.Function &&
        uplink.unsubscribeFrom.should.be.a.Function &&
        uplink.pull.should.be.a.Function
      );
      super();
      this._uplink = uplink;
      this._uplinkSubscriptions = {};
    }

    destroy() {
      super.destroy();
      // Explicitly nullify uplinkSubscriptions and pendings
      Object.keys(this._uplinkSubscriptions)
      // Unsubscriptions are made in each unsubscribeFrom in super.destory
      // (the last one calls this._uplink.unsubscribeFrom automatically).
      .forEach((id) => this._uplinkSubscriptions[id] = null);
      // Nullify references
      this._uplink = null;
      this._uplinkSubscriptions = null;
    }

    fetch(path) {
      this._shouldNotBeDestroyed();
      _.dev(() => path.should.be.a.String);
      return this._uplink.pull(path);
    }

    subscribeTo(path, handler) {
      const { subscription, createdPath } = super.subscribeTo(path, handler);
      if(createdPath) {
        _.dev(() => (this._uplinkSubscriptions[subscription.id] === void 0).should.be.ok);
        this._uplinkSubscriptions[subscription.id] = this._uplink.subscribeTo(path, (value) => this.propagateUpdate(path, value));
      }
      return { subscription, createdPath };
    }

    unsubscribeFrom({ subscription }) {
      const { deletedPath } = super.unsubscribeFrom({ subscription });
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
