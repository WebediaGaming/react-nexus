module.exports = function(R, EventEmitter) {

  class MemoryEventEmitter extends EventEmitter {
    constructor() {
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
