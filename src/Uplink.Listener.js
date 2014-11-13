const _ = require('lodash-next');
const should = _.should;

class Listener {
  constructor({ room, handler }) {
    _.dev(() => room.should.be.a.String &&
      handler.should.be.a.Function
    );
    _.extend(this, { room, handler, id: _.uniqueId(room) });
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

  emit(params) {
    _.dev(() => params.should.be.an.Object);
    this.handler.call(null, params);
  }
}

_.extend(Listener.prototype, {
  room: null,
  handler: null,
  id: null,
});

module.exports = Listener;
