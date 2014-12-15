module.exports = function(R, EventEmitter) {
  const _ = R._;

  class UplinkEventEmitter extends EventEmitter {
    constructor({ uplink }) {
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(() => uplink.listenTo.should.be.a.Function &&
        uplink.unlistenFrom.should.be.a.Function
      );
      super();
      this.uplink = uplink;
      this.uplinkListeners = {};
    }

    listenTo(room, handler) {
      let { listener, createdRoom } = super.listenTo(room, handler);
      if(createdRoom) {
        _.dev(() => (this.uplinkListeners[listener.id] === void 0).should.be.ok);
        this.uplinkListeners[listener.id] = this.uplink.listenTo(room, (params) => this._emit(room, params));
      }
      _.dev(() => this.uplinkListeners[listener.id].should.be.ok);
      return { listener, createdRoom };
    }

    unlistenFrom(listener) {
      let { deletedRoom } = super.unlistenFrom(listener);
      if(deletedRoom) {
        _.dev(() => (this.uplinkListeners[listener.id] !== void 0).should.be.ok);
        this.uplink.unlistenFrom(this.uplinkListeners[listener.id]);
        delete this.uplinkListeners[listener.id];
      }
      _.dev(() => (this.uplinkListeners[listener.id] === void 0).should.be.ok);
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
