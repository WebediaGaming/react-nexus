var R = require("./R");
var _ = require("lodash");
var assert = require("assert");
var co = require("co");

/**
 * @memberOf R
 */
var Dispatcher = function Dispatcher(displayName) {
    this._actionsListeners = {};
};

_.extend(Dispatcher.prototype, /** @lends R.Dispatcher.prototype */{
    _isDispatcher_: true,
    displayName: null,
    _actionsListeners: null,
    addActionListener: function addActionListener(action, fn) {
        var actionListener = new R.Dispatcher.ActionListener(action);
        if(!_.has(this._actionsListeners, action)) {
            this._actionsListeners[action] = {};
        }
        this._actionsListeners[action][actionListener.uniqueId] = fn;
    },
    removeActionListener: function removeActionListener(actionListener) {
        R.Debug.dev(R.scope(function() {
            assert(actionListener instanceof R.Dispatcher.ActionListener, "R.Dispatcher.removeActionListener(...): type R.Dispatcher.ActionListener expected.");
            assert(_.has(this._actionsListeners, actionListener), "R.Dispatcher.removeActionListener(...): no action listener for this action.");
            assert(_.has(this._actionsListeners[actionListener.action], actionListener.uniqueId), "R.Dispatcher.removeActionListener(...): no such action listener.");
        }, this));
        delete this._actionsListeners[actionListener.action][actionListener.uniqueId];
        if(_.size(this._actionsListeners[actionListener.action]) === 0) {
            delete this._actionsListeners[actionListener.action];
        }
    },
    trigger: function trigger(action, params) {
        params = params || {};
        R.Debug.dev(R.scope(function() {
            if(!_.has(this._actionsListeners, action)) {
                console.warn("R.Dispatcher.trigger: triggering an action with no listeners attached.");
            }
        }, this));
        if(_.has(this._actionsListeners, action)) {
            return co(regeneratorRuntime.mark(function callee$1$0() {
                return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return _.map(this._actionsListeners[action], R.callWith(params));
                    case 2:
                        return context$2$0.abrupt("return", context$2$0.sent);
                    case 3:
                    case "end":
                        return context$2$0.stop();
                    }
                }, callee$1$0, this);
            })).call(this);
        }
        else {
            return R.noopThunk;
        }
    },
});

Dispatcher.ActionListener = function ActionListener(action) {
    this.uniqueId = _.uniqueId("ActionListener");
    this.action = action;
};

_.extend(Dispatcher.ActionListener.prototype, /** @lends R.Dispatcher.ActionListener */ {
    /**
     * @type {String}
     * @private
     * @readOnly
     */
    uniqueId: null,
    /**
     * @type {String}
     * @private
     * @readOnly
     */
    action: null,
});

module.exports = {
    Dispatcher: Dispatcher,
};
