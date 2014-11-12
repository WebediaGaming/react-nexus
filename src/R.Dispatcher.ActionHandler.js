module.exports = function(R) {
  const _ = R._;
  const should = R.should;

  class ActionHandler {
    constructor(action, handler) {
      this.action = action;
      this.handler = handler;
      this.id = _.uniqueId('ActionHandler');
      _.scopeAll(this, [
        'pushInto',
        'removeFrom',
        'dispatch',
      ]);
    }

    pushInto(collection) {
      _.dev(() => collection.should.be.an.Object);
      if(!collection[this.action]) {
        collection[this.action] = {};
      }
      _.dev(() => collection[this.action][this.id].should.not.be.ok);
      collection[this.action][this.id] = this;
    }

    removeFrom(collection) {
      _.dev(() => collection.should.be.an.Object &&
        collection[this.action].should.be.an.Object &&
        collection[this.action][this.id].should.be.exactly(this)
      );
      delete collection[this.action][this.id];
      if(Object.keys(collection[this.action]).length === 0) {
        delete collection[this.action];
      }
    }

    isInside(collection) {
      _.dev(() => collection.should.be.an.Object);
      return collection[this.action] &&
        collection[this.action][this.id] &&
        collection[this.action][this.id] === this;
    }

    dispatch(params) {
      _.dev(() => params.should.be.an.Object);
      return this.handler.call(null, params);
    }
  }

  _.extend(ActionHandler.prototype, {
    id: null,
  });

  return ActionHandler;
};
