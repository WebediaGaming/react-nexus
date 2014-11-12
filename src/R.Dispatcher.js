module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const ActionHandler = require('./R.Dispatcher.ActionHandler')(R);

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
