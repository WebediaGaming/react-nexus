module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const Listener = require('./R.EventEmitter.Listener')(R);

  class EventEmitter {
    constructor(params = {}) {
      this.listeners = {};
      this.displayName = this.getDisplayName();
    }

    getDisplayName() { _.abstract(); }

    addListener(room, handler) {
      _.dev(() => room.should.be.a.String &&
        handler.should.be.a.Function
      );
      let listener = new Listener({ room, handler });
      return {
        listener,
        createdRoom: listener.addTo(this.listeners),
      };
    }

    removeListener(listener) {
      _.dev(() => listener.should.be.an.instanceOf(Listener));
      return {
        listener,
        deletedRoom: listener.removeFrom(this.listeners),
      };
    }

    destroy() {
      Object.keys(this.listeners).forEach((i) =>
        Object.keys(this.listeners[i]).forEach((j) =>
          this.listeners[i][j].removeFrom(this.listeners)
        )
      );
      // Nullify references
      this.listeners = null;
    }
  }

  _.extend(EventEmitter.prototype, {
    listeners: null,
    displayName: null,
  });

  _.extend(EventEmitter, { Listener });

  const MemoryEventEmitter = require('./R.EventEmitter.MemoryEventEmitter')(R, EventEmitter);
  const UplinkEventEmitter = require('./R.EventEmitter.MemoryEventEmitter')(R, EventEmitter);

  _.extend(EventEmitter, { MemoryEventEmitter, UplinkEventEmitter });

  return EventEmitter;
};
