module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Dispatcher = {
        createDispatcher: function createDispatcher(specs) {
            R.Debug.dev(function() {
                assert(_.isObject(specs), "R.Dispatcher.createDispatcher(...).specs: expecting Object.");
                assert(specs.actions && _.isObject(specs), "R.Dispatcher.createDispatcher(...).specs.actions: expecting Object.");
                assert(specs.displayName && _.isString(specs.displayName), "R.Dispatcher.createDispatcher(...).specs.displayName: expecting String.");
            });

            var DispatcherInstance = function DispatcherInstance() {
                this.displayName = specs.displayName;
                this._actionsListeners = {};
                this.addActionListener = R.scope(this.addActionListener, this);
                this.removeActionListener = R.scope(this.removeActionListener, this);
                this.dispatch = R.scope(this.dispatch, this);
                _.extend(this, specs);
                _.each(specs, R.scope(function(val, attr) {
                    if(_.isFunction(val)) {
                        this[attr] = R.scope(val, this);
                    }
                }, this));
                _.each(specs.actions, this.addActionListener);
            };

            _.extend(DispatcherInstance, R.Dispatcher._DispatcherInstancePrototype);
        },
        _DispatcherInstancePrototype: {
            _isDispatcher_: true,
            displayName: null,
            _actionsListeners: null,
            addActionListener: function addActionListener(action, fn) {
                var actionListener = new R.Dispatcher.ActionListener(action);
                if(!_.has(this._actionsListeners, action)) {
                    this._actionsListeners[action] = {};
                }
                this._actionsListeners[action][actionListener.uniqueId] = fn;
                return actionListener;
            },
            removeActionListener: function removeActionListener(actionListener) {
                R.Debug.dev(R.scope(function() {
                    assert(actionListener instanceof R.Dispatcher.ActionListener, "R.Dispatcher.DispatcherInstance.removeActionListener(...): type R.Dispatcher.ActionListener expected.");
                    assert(_.has(this._actionsListeners, actionListener), "R.Dispatcher.DispatcherInstance.removeActionListener(...): no action listener for this action.");
                    assert(_.has(this._actionsListeners[actionListener.action], actionListener.uniqueId), "R.Dispatcher.DispatcherInstance.removeActionListener(...): no such action listener.");
                }, this));
                delete this._actionsListeners[actionListener.action][actionListener.uniqueId];
                if(_.size(this._actionsListeners[actionListener.action]) === 0) {
                    delete this._actionsListeners[actionListener.action];
                }
            },
            dispatch: function* dispatch(action, params) {
                params = params || {};
                R.Debug.dev(R.scope(function() {
                    if(!_.has(this._actionsListeners, action)) {
                        console.warn("R.Dispatcher.DispatcherInstance.dispatch: dispatching an action with no listeners attached.");
                    }
                }, this));
                if(_.has(this._actionsListeners, action)) {
                    return yield _.map(this._actionsListeners[action], function(listener) {
                        return listener(params);
                    });
                }
            },
            destroy: function destroy() {
                _.each(this._actionsListeners, this.removeActionListener);
            },
        },
    };

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

    R.Dispatcher = Dispatcher;
    return R;
};
