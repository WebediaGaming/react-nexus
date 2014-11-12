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
      let { listener, createdEvent } = super.addListener(room, handler);
      if(createdEvent) {
        _.dev(() => this.uplinkListeners[room].should.not.be.ok);
        this.uplinkListeners[room] = this.uplink.listenTo(room, (params) => this._emit(room, params));
      }
      _.dev(() => this.uplinkListeners[room].should.be.ok);
      return { listener, createdEvent };
    }

    removeListener(listener) {
      let { deletedEvent } = super.removeListener(listener);
      if(deletedEvent) {
        _.dev(() => this.uplinkListeners[room].should.be.ok);
        this.uplink.unlistenFrom(room, this.uplinkListeners[room]);
        delete this.uplinkListeners[room];
      }
      _.dev(() => this.uplinkListeners[room].should.not.be.ok);
      return { listener, deletedEvent };
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
