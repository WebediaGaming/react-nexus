module.exports = function(R) {
  const _ = R._;
  const ActionHandler = require('./R.Dispatcher.ActionHandler')(R);

  class Dispatcher {
    constructor(actionHandlers = {}) {
      _.dev(() => actionHandlers.should.be.an.Object &&
        Object.keys(actionHandlers).map((action) => action.should.be.a.String &&
          actionHandlers[action].should.be.a.Function
        )
      );
      this.actionHandlers = {};
      Object.keys(actionHandlers)
      .forEach((action) => this.addActionHandler(action, actionHandlers[action]));
    }

    destroy() {
      // Explicitly remove all action handlers
      Object.keys(this.actionHandlers)
      .forEach((action) => this.removeActionHandler(this.actionHandlers[action]));
      // Nullify references
      this.actionHandlers = null;
    }

    addActionHandler(action, handler) {
      let actionListener = new ActionHandler(action, handler);
      actionListener.pushInto(this.actionsHandlers);
      return actionListener;
    }

    removeActionHandler(actionListener) {
      _.dev(() => actionListener.should.be.instanceOf(ActionHandler) &&
        actionListener.isInside(this.actionsHandlers).should.be.ok
      );
      actionListener.removeFrom(this.actionsHandlers);
    }

    *dispatch(action, params = {}) { // jshint ignore:line
      _.dev(() => this.actionsHandlers[action].should.be.ok);
      return yield Object.keys(this.actionsHandlers[action]) // jshint ignore:line
      .map((key) => this.actionsHandlers[action][key].dispatch(params));
    }
  }

  _.extend(Dispatcher.prototype, {
    actionHandlers: null,
  });

  _.extend(Dispatcher, {
    ActionHandler,
  });

  return Dispatcher;
};
