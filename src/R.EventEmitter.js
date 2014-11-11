module.exports = function(R) {
  const _ = R._;
  const should = R.should;

  class EventListener {
    constructor(event, handler) {
      _.dev(() => event.should.be.a.String &&
        handler.should.be.a.Function
      );
      this.event = event;
      this.handler = handler;
      this.id = _.uniqueId('EventListener');
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

  _.extend(EventListener.prototype, {
    event: null,
    id: null,
    handler: null,
  });

  class EventEmitter {
    constructor(params = {}) {
      this.listeners = {};
      this.displayName = this.getDisplayName();
    }

    getDisplayName() { _.abstract(); }

    addListener(event, handler) {
      let listener = new EventListener(event, handler);
      return {
        listener,
        createdEvent: listener.addTo(this.listeners),
      };
    }

    removeListener(listener) {
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

    emit(event, params = {}) {
      if(this.listeners[event]) {
        Object.keys(this.listeners[event]).forEach((key) =>
          this.listeners[event][key].emit(params)
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

    addListener(event, handler) {
      let { listener, createdEvent } = super.addListener(event, handler);
      if(createdEvent) {
        _.dev(() => this.uplinkListeners[event].should.not.be.ok);
        this.uplinkListeners[event] = this.uplink.listenTo(event, (params) => this._emit(event, params));
      }
      _.dev(() => this.uplinkListeners[event].should.be.ok);
      return { listener, createdEvent };
    }

    removeListener(listener) {
      let { deletedEvent } = super.removeListener(listener);
      if(deletedEvent) {
        _.dev(() => this.uplinkListeners[event].should.be.ok);
        this.uplink.unlistenFrom(event, this.uplinkListeners[event]);
        delete this.uplinkListeners[event];
      }
      _.dev(() => this.uplinkListeners[event].should.not.be.ok);
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
    MemoryEventEmitter,
    UplinkEventEmitter,
  });

  return EventEmitter;
};
