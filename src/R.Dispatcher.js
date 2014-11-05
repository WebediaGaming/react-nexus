module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    /**
    * <p>R.Dispatcher acts as a layer between Store/EventEmitters and components.
    * A React component may submit an action to a dispatcher (such as a click event) and perform updates required.</p>
    * <ul>
    * <li> Dispatcher.createDispatcher => initialize methods according to the specifications provided</li>
    * <li> Dispatcher.addActionListener => add an action listener</li>
    * <li> Dispatcher.removeActionListener => remove an action listener</li>
    * <li> Dispatcher.dispatch => dispatches an action submitted by a React component</li>
    * <li> Dispatcher.destroy => remove all listener previously added</li>
    * </ul>
    * @class R.Dispatcher
    */
    var Dispatcher = {
        /**
        * Initializes the dispatcher according to the specifications provided
        * @method createDispatcher
        * @param {object} specs The specifications
        * @return {DispatcherInstance} DispatcherInstance The created dispatcher instance
        */
        createDispatcher: function createDispatcher(specs) {
            R.Debug.dev(function() {
                assert(_.isObject(specs), "R.Dispatcher.createDispatcher(...).specs: expecting Object.");
                assert(specs.actions && _.isObject(specs.actions), "R.Dispatcher.createDispatcher(...).specs.actions: expecting Object.");
                assert(specs.displayName && _.isString(specs.displayName), "R.Dispatcher.createDispatcher(...).specs.displayName: expecting String.");
            });

            var DispatcherInstance = function DispatcherInstance() {
                this._actionsListeners = {};
                this.addActionListener = R.scope(this.addActionListener, this);
                this.removeActionListener = R.scope(this.removeActionListener, this);
                this.dispatch = R.scope(this.dispatch, this);
                _.each(specs, R.scope(function(val, attr) {
                    if(_.isFunction(val)) {
                        this[attr] = R.scope(val, this);
                    }
                }, this));
                _.each(specs.actions, this.addActionListener);
            };

            _.extend(DispatcherInstance.prototype, specs, R.Dispatcher._DispatcherInstancePrototype);

            return DispatcherInstance;
        },
        _DispatcherInstancePrototype: {
            _isDispatcherInstance_: true,
            displayName: null,
            _actionsListeners: null,
            /**
            * <p>Register an async action listener</p>
            * @method addActionListener
            * @param {object} action The action name
            * @param {Function} fn The function to execute when the listener will be notified
            * @return {Dispatcher.ActionListener} actionListener The created actionListener
            */
            addActionListener: function addActionListener(action, fn) {
                var actionListener = new R.Dispatcher.ActionListener(action);
                if(!_.has(this._actionsListeners, action)) {
                    this._actionsListeners[action] = {};
                }
                this._actionsListeners[action][actionListener.uniqueId] = fn;
                return actionListener;
            },
            /**
            * <p>Remove the previously added action listener</p>
            * @method removeActionListener
            * @param {object} actionListener The action name
            */
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
            /**
            * <p>Dispatches an action submitted by a React component</p>
            * @method dispatch
            * @param {action} action The action name of the listener
            * @param {object} params The specifics params necessary for an action
            * @return {*} * the data that may be provided by the listener function
            */
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
            /**
            * <p>Remove all listener previously added </p>
            * @method destroy
            */
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
         * @property
         * @type {String}
         * @private
         * @readOnly
         */
        uniqueId: null,
        /**
         * @property
         * @type {String}
         * @private
         * @readOnly
         */
        action: null,
    });

    return Dispatcher;
};
