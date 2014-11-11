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

  class Dispatcher {
    constructor() {
      _.dev(() => this.getActions.should.be.a.Function &&
        this.getDisplayName.should.be.a.Function
      );

      this._actionsHandlers = {};
      _.scopeAll(this, [
        'addActionHandler',
        'removeActionHandler',
        'dispatch',
      ]);

      let actions = this.getActions();
      Object.keys(actions).forEach((action) => this.addActionHandler(action, actions[action]));
    }

    addActionHandler(action, handler) {
      let actionListener = new ActionListener(action, handler);
      actionListener.pushInto(this._actionsHandlers);
      return actionListener;
    }

    removeActionHandler(actionListener) {
      _.dev(() => actionListener.should.be.instanceOf(ActionListener) &&
        actionListener.isInside(this._actionsHandlers).should.be.ok
      );
      actionListener.removeFrom(this._actionsHandlers);
    }

    dispatch(action, params = {}) {
      return _.copromise(function*() {
        _.dev(() => this._actionsHandlers[action].should.be.ok);
        return yield Object.keys(this._actionsHandlers[action])
        .map((key) => this._actionsHandlers[action][key].dispatch(params));
      }, this);
    }
  }

  _.extend(Dispatcher.prototype, {
    displayName: null,
    _actionsHandlers: null,
  });

  _.extend(Dispatcher, {
    ActionHandler,
  });

  return Dispatcher;
};
