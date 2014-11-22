module.exports = function(R) {
  const _ = R._;

  class Listener {
    constructor({ room, handler }) {
      _.dev(() => room.should.be.a.String &&
        handler.should.be.a.Function
      );
      _.extend(this, { room, handler, id: _.uniqueId(room)});
    }

    addTo(listeners) {
      _.dev(() => listeners.should.be.an.Object);
      if(!listeners[this.room]) {
        listeners[this.room] = {};
      }
      _.dev(() => listeners[this.room].should.be.an.Object &&
        listeners[this.room].should.not.have.property(this.id)
      );
      listeners[this.room][this.id] = this;
      return Object.keys(listeners[this.room]).length === 1;
    }

    removeFrom(listeners) {
      _.dev(() => listeners.should.be.an.Object &&
        listeners.should.have.property(this.room) &&
        listeners[this.room].should.be.an.Object &&
        listeners[this.room].should.have.propery(this.id, this)
      );
      delete listeners[this.room][this.id];
      if(Object.keys(listeners[this.room]).length === 0) {
        delete listeners[this.room];
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

  return Listener;
};
