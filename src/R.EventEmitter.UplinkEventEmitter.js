module.exports = function(R, EventEmitter) {
  const _ = R._;
  const should = R.should;

  class UplinkEventEmitter extends EventEmitter {
    constructor({ uplink }) {
      _.dev(() => uplink.should.be.instanceOf(R.Uplink));
      super();
      this.uplink = uplink;
      this.uplinkListeners = {};
    }

    getDisplayName() {
      return 'UplinkEventEmitter';
    }

    addListener(room, handler) {
      let { listener, createdRoom } = super.addListener(room, handler);
      if(createdRoom) {
        _.dev(() => this.uplinkListeners[listener.id].should.not.be.ok);
        this.uplinkListeners[listener.id] = this.uplink.listenTo(room, (params) => this._emit(room, params));
      }
      _.dev(() => this.uplinkListeners[listener.id].should.be.ok);
      return { listener, createdRoom };
    }

    removeListener(listener) {
      let { deletedRoom } = super.removeListener(listener);
      if(deletedRoom) {
        _.dev(() => this.uplinkListeners[listener.id].should.be.ok);
        this.uplink.unlistenFrom(this.uplinkListeners[listener.id]);
        delete this.uplinkListeners[listener.id];
      }
      _.dev(() => this.uplinkListeners[listener.id].should.not.be.ok);
      return { listener, deletedRoom };
    }

    destroy() {
      super.destroy();
      _.dev(() => Object.keys(this.uplinkListeners).length.should.be.exactly(0));
      this.uplinkListeners = null;
      this.uplink = null;
    }
  }

  _.extend(UplinkEventEmitter.prototype, {
    uplink: null,
    uplinkListeners: null,
  });

  return UplinkEventEmitter;
};
