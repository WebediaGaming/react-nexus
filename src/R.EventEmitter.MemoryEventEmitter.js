module.exports = function(R, EventEmitter) {
  const _ = R._;
  const should = R.should;

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

  return MemoryEventEmitter;
};
