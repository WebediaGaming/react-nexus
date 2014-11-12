module.exports = function(R, Store) {
  const _ = R._;
  const should = R.should;

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

  return UplinkStore;
};
