module.exports = function(R) {
  const _ = R._;
  const should = R.should;

  class Listener {
    constructor({ room, handler }) {
      _.dev(() => room.should.be.a.String &&
        handler.should.be.a.Function
      );
      this.room = room;
      this.handler = handler;
      this.id = _.uniqueId('Listener');
    }

    addTo(listeners) {
      _.dev(() => listeners.should.be.an.Object);
      if(!listeners[this.action]) {
        listeners[this.action] = {};
      }
      _.dev(() => listeners[this.action].should.be.an.Object &&
        listeners[this.action][this.id].should.not.be.ok
      );
      listeners[this.action][this.id] = this;
      return Object.keys(listeners[this.action]).length === 1;
    }

    removeFrom(listeners) {
      _.dev(() => listeners.should.be.an.Object &&
        listeners[this.action].should.be.an.Object &&
        listeners[this.action][this.id].should.be.exactly(this)
      );
      delete listeners[this.action][this.id];
      if(Object.keys(listeners[this.action]).length === 0) {
        delete listeners[this.action];
        return true;
      }
      return false;
    }

    emit(params = {}) {
      _.dev(() => params.should.be.an.Object);
      this.handler.call(null, params);
    }
  }

  _.extend(Listener.prototype, {
    room: null,
    id: null,
    handler: null,
  });

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
        createdEvent: listener.addTo(this.listeners),
      };
    }

    removeListener(listener) {
      _.dev(() => listener.should.be.an.instanceOf(Listener));
      return {
        listener,
        deletedEvent: listener.removeFrom(this.listeners),
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

  class MemoryEventEmitter extends EventEmitter {
    constructor(params = {}) {
      super();
    }

    getDisplayName() {
      return 'MemoryEventEmitter';
    }

    emit(room, params = {}) {
      if(this.listeners[room]) {
        Object.keys(this.listeners[room]).forEach((key) =>
          this.listeners[room][key].emit(params)
        );
      }
    }
  }

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

  _.extend(EventEmitter, {
    Listener,
    MemoryEventEmitter,
    UplinkEventEmitter,
  });

  return EventEmitter;
};
