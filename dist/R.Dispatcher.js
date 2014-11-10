"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
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
      R.Debug.dev(function () {
        assert(_.isObject(specs), "R.Dispatcher.createDispatcher(...).specs: expecting Object.");
        assert(specs.actions && _.isObject(specs.actions), "R.Dispatcher.createDispatcher(...).specs.actions: expecting Object.");
        assert(specs.displayName && _.isString(specs.displayName), "R.Dispatcher.createDispatcher(...).specs.displayName: expecting String.");
      });

      var DispatcherInstance = function DispatcherInstance() {
        this._actionsListeners = {};
        this.addActionListener = R.scope(this.addActionListener, this);
        this.removeActionListener = R.scope(this.removeActionListener, this);
        this.dispatch = R.scope(this.dispatch, this);
        _.each(specs, R.scope(function (val, attr) {
          if (_.isFunction(val)) {
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
        if (!_.has(this._actionsListeners, action)) {
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
        R.Debug.dev(R.scope(function () {
          assert(actionListener instanceof R.Dispatcher.ActionListener, "R.Dispatcher.DispatcherInstance.removeActionListener(...): type R.Dispatcher.ActionListener expected.");
          assert(_.has(this._actionsListeners, actionListener), "R.Dispatcher.DispatcherInstance.removeActionListener(...): no action listener for this action.");
          assert(_.has(this._actionsListeners[actionListener.action], actionListener.uniqueId), "R.Dispatcher.DispatcherInstance.removeActionListener(...): no such action listener.");
        }, this));
        delete this._actionsListeners[actionListener.action][actionListener.uniqueId];
        if (_.size(this._actionsListeners[actionListener.action]) === 0) {
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
      dispatch: regeneratorRuntime.mark(function dispatch(action, params) {
        return regeneratorRuntime.wrap(function dispatch$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {case 0:

              params = params || {};
              R.Debug.dev(R.scope(function () {
                if (!_.has(this._actionsListeners, action)) {
                  console.warn("R.Dispatcher.DispatcherInstance.dispatch: dispatching an action with no listeners attached.");
                }
              }, this));

              if (!_.has(this._actionsListeners, action)) {
                context$2$0.next = 6;
                break;
              }
              context$2$0.next = 5;
              return _.map(this._actionsListeners[action], function (listener) {
                return listener(params);
              });

            case 5: return context$2$0.abrupt("return", context$2$0.sent);
            case 6:
            case "end": return context$2$0.stop();
          }
        }, dispatch, this);
      }),
      /**
      * <p>Remove all listener previously added </p>
      * @method destroy
      */
      destroy: function destroy() {
        _.each(this._actionsListeners, this.removeActionListener);
      } } };

  Dispatcher.ActionListener = function ActionListener(action) {
    this.uniqueId = _.uniqueId("ActionListener");
    this.action = action;
  };

  _.extend(Dispatcher.ActionListener.prototype, /** @lends R.Dispatcher.ActionListener */{
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
    action: null });

  return Dispatcher;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFjL0IsTUFBSSxVQUFVLEdBQUc7Ozs7Ozs7QUFPYixvQkFBZ0IsRUFBRSxTQUFTLGdCQUFnQixDQUFDLEtBQUssRUFBRTtBQUMvQyxPQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ25CLGNBQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLDZEQUE2RCxDQUFDLENBQUM7QUFDekYsY0FBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUscUVBQXFFLENBQUMsQ0FBQztBQUMxSCxjQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSx5RUFBeUUsQ0FBQyxDQUFDO09BQ3pJLENBQUMsQ0FBQzs7QUFFSCxVQUFJLGtCQUFrQixHQUFHLFNBQVMsa0JBQWtCLEdBQUc7QUFDbkQsWUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0QsWUFBSSxDQUFD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QUFDIiwiZmlsZSI6IlIuRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuXHJcbiAgICAvKipcclxuICAgICogPHA+Ui5EaXNwYXRjaGVyIGFjdHMgYXMgYSBsYXllciBiZXR3ZWVuIFN0b3JlL0V2ZW50RW1pdHRlcnMgYW5kIGNvbXBvbmVudHMuXHJcbiAgICAqIEEgUmVhY3QgY29tcG9uZW50IG1heSBzdWJtaXQgYW4gYWN0aW9uIHRvIGEgZGlzcGF0Y2hlciAoc3VjaCBhcyBhIGNsaWNrIGV2ZW50KSBhbmQgcGVyZm9ybSB1cGRhdGVzIHJlcXVpcmVkLjwvcD5cclxuICAgICogPHVsPlxyXG4gICAgKiA8bGk+IERpc3BhdGNoZXIuY3JlYXRlRGlzcGF0Y2hlciA9PiBpbml0aWFsaXplIG1ldGhvZHMgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZDwvbGk+XHJcbiAgICAqIDxsaT4gRGlzcGF0Y2hlci5hZGRBY3Rpb25MaXN0ZW5lciA9PiBhZGQgYW4gYWN0aW9uIGxpc3RlbmVyPC9saT5cclxuICAgICogPGxpPiBEaXNwYXRjaGVyLnJlbW92ZUFjdGlvbkxpc3RlbmVyID0+IHJlbW92ZSBhbiBhY3Rpb24gbGlzdGVuZXI8L2xpPlxyXG4gICAgKiA8bGk+IERpc3BhdGNoZXIuZGlzcGF0Y2ggPT4gZGlzcGF0Y2hlcyBhbiBhY3Rpb24gc3VibWl0dGVkIGJ5IGEgUmVhY3QgY29tcG9uZW50PC9saT5cclxuICAgICogPGxpPiBEaXNwYXRjaGVyLmRlc3Ryb3kgPT4gcmVtb3ZlIGFsbCBsaXN0ZW5lciBwcmV2aW91c2x5IGFkZGVkPC9saT5cclxuICAgICogPC91bD5cclxuICAgICogQGNsYXNzIFIuRGlzcGF0Y2hlclxyXG4gICAgKi9cclxuICAgIHZhciBEaXNwYXRjaGVyID0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIGRpc3BhdGNoZXIgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgICogQG1ldGhvZCBjcmVhdGVEaXNwYXRjaGVyXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3BlY3MgVGhlIHNwZWNpZmljYXRpb25zXHJcbiAgICAgICAgKiBAcmV0dXJuIHtEaXNwYXRjaGVySW5zdGFuY2V9IERpc3BhdGNoZXJJbnN0YW5jZSBUaGUgY3JlYXRlZCBkaXNwYXRjaGVyIGluc3RhbmNlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBjcmVhdGVEaXNwYXRjaGVyOiBmdW5jdGlvbiBjcmVhdGVEaXNwYXRjaGVyKHNwZWNzKSB7XHJcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNPYmplY3Qoc3BlY3MpLCBcIlIuRGlzcGF0Y2hlci5jcmVhdGVEaXNwYXRjaGVyKC4uLikuc3BlY3M6IGV4cGVjdGluZyBPYmplY3QuXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmFjdGlvbnMgJiYgXy5pc09iamVjdChzcGVjcy5hY3Rpb25zKSwgXCJSLkRpc3BhdGNoZXIuY3JlYXRlRGlzcGF0Y2hlciguLi4pLnNwZWNzLmFjdGlvbnM6IGV4cGVjdGluZyBPYmplY3QuXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmRpc3BsYXlOYW1lICYmIF8uaXNTdHJpbmcoc3BlY3MuZGlzcGxheU5hbWUpLCBcIlIuRGlzcGF0Y2hlci5jcmVhdGVEaXNwYXRjaGVyKC4uLikuc3BlY3MuZGlzcGxheU5hbWU6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBEaXNwYXRjaGVySW5zdGFuY2UgPSBmdW5jdGlvbiBEaXNwYXRjaGVySW5zdGFuY2UoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3Rpb25zTGlzdGVuZXJzID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEFjdGlvbkxpc3RlbmVyID0gUi5zY29wZSh0aGlzLmFkZEFjdGlvbkxpc3RlbmVyLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aW9uTGlzdGVuZXIgPSBSLnNjb3BlKHRoaXMucmVtb3ZlQWN0aW9uTGlzdGVuZXIsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaCA9IFIuc2NvcGUodGhpcy5kaXNwYXRjaCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2goc3BlY3MsIFIuc2NvcGUoZnVuY3Rpb24odmFsLCBhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1thdHRyXSA9IFIuc2NvcGUodmFsLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2goc3BlY3MuYWN0aW9ucywgdGhpcy5hZGRBY3Rpb25MaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBfLmV4dGVuZChEaXNwYXRjaGVySW5zdGFuY2UucHJvdG90eXBlLCBzcGVjcywgUi5EaXNwYXRjaGVyLl9EaXNwYXRjaGVySW5zdGFuY2VQcm90b3R5cGUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIERpc3BhdGNoZXJJbnN0YW5jZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9EaXNwYXRjaGVySW5zdGFuY2VQcm90b3R5cGU6IHtcclxuICAgICAgICAgICAgX2lzRGlzcGF0Y2hlckluc3RhbmNlXzogdHJ1ZSxcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgICAgICAgICAgIF9hY3Rpb25zTGlzdGVuZXJzOiBudWxsLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiA8cD5SZWdpc3RlciBhbiBhc3luYyBhY3Rpb24gbGlzdGVuZXI8L3A+XHJcbiAgICAgICAgICAgICogQG1ldGhvZCBhZGRBY3Rpb25MaXN0ZW5lclxyXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIGFjdGlvbiBuYW1lXHJcbiAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgbGlzdGVuZXIgd2lsbCBiZSBub3RpZmllZFxyXG4gICAgICAgICAgICAqIEByZXR1cm4ge0Rpc3BhdGNoZXIuQWN0aW9uTGlzdGVuZXJ9IGFjdGlvbkxpc3RlbmVyIFRoZSBjcmVhdGVkIGFjdGlvbkxpc3RlbmVyXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGFkZEFjdGlvbkxpc3RlbmVyOiBmdW5jdGlvbiBhZGRBY3Rpb25MaXN0ZW5lcihhY3Rpb24sIGZuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aW9uTGlzdGVuZXIgPSBuZXcgUi5EaXNwYXRjaGVyLkFjdGlvbkxpc3RlbmVyKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpZighXy5oYXModGhpcy5fYWN0aW9uc0xpc3RlbmVycywgYWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnNbYWN0aW9uXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aW9uc0xpc3RlbmVyc1thY3Rpb25dW2FjdGlvbkxpc3RlbmVyLnVuaXF1ZUlkXSA9IGZuO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGlvbkxpc3RlbmVyO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiA8cD5SZW1vdmUgdGhlIHByZXZpb3VzbHkgYWRkZWQgYWN0aW9uIGxpc3RlbmVyPC9wPlxyXG4gICAgICAgICAgICAqIEBtZXRob2QgcmVtb3ZlQWN0aW9uTGlzdGVuZXJcclxuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uTGlzdGVuZXIgVGhlIGFjdGlvbiBuYW1lXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHJlbW92ZUFjdGlvbkxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVBY3Rpb25MaXN0ZW5lcihhY3Rpb25MaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoYWN0aW9uTGlzdGVuZXIgaW5zdGFuY2VvZiBSLkRpc3BhdGNoZXIuQWN0aW9uTGlzdGVuZXIsIFwiUi5EaXNwYXRjaGVyLkRpc3BhdGNoZXJJbnN0YW5jZS5yZW1vdmVBY3Rpb25MaXN0ZW5lciguLi4pOiB0eXBlIFIuRGlzcGF0Y2hlci5BY3Rpb25MaXN0ZW5lciBleHBlY3RlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnMsIGFjdGlvbkxpc3RlbmVyKSwgXCJSLkRpc3BhdGNoZXIuRGlzcGF0Y2hlckluc3RhbmNlLnJlbW92ZUFjdGlvbkxpc3RlbmVyKC4uLik6IG5vIGFjdGlvbiBsaXN0ZW5lciBmb3IgdGhpcyBhY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9hY3Rpb25zTGlzdGVuZXJzW2FjdGlvbkxpc3RlbmVyLmFjdGlvbl0sIGFjdGlvbkxpc3RlbmVyLnVuaXF1ZUlkKSwgXCJSLkRpc3BhdGNoZXIuRGlzcGF0Y2hlckluc3RhbmNlLnJlbW92ZUFjdGlvbkxpc3RlbmVyKC4uLik6IG5vIHN1Y2ggYWN0aW9uIGxpc3RlbmVyLlwiKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9hY3Rpb25zTGlzdGVuZXJzW2FjdGlvbkxpc3RlbmVyLmFjdGlvbl1bYWN0aW9uTGlzdGVuZXIudW5pcXVlSWRdO1xyXG4gICAgICAgICAgICAgICAgaWYoXy5zaXplKHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnNbYWN0aW9uTGlzdGVuZXIuYWN0aW9uXSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYWN0aW9uc0xpc3RlbmVyc1thY3Rpb25MaXN0ZW5lci5hY3Rpb25dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiA8cD5EaXNwYXRjaGVzIGFuIGFjdGlvbiBzdWJtaXR0ZWQgYnkgYSBSZWFjdCBjb21wb25lbnQ8L3A+XHJcbiAgICAgICAgICAgICogQG1ldGhvZCBkaXNwYXRjaFxyXG4gICAgICAgICAgICAqIEBwYXJhbSB7YWN0aW9ufSBhY3Rpb24gVGhlIGFjdGlvbiBuYW1lIG9mIHRoZSBsaXN0ZW5lclxyXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgVGhlIHNwZWNpZmljcyBwYXJhbXMgbmVjZXNzYXJ5IGZvciBhbiBhY3Rpb25cclxuICAgICAgICAgICAgKiBAcmV0dXJuIHsqfSAqIHRoZSBkYXRhIHRoYXQgbWF5IGJlIHByb3ZpZGVkIGJ5IHRoZSBsaXN0ZW5lciBmdW5jdGlvblxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24qIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFfLmhhcyh0aGlzLl9hY3Rpb25zTGlzdGVuZXJzLCBhY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlIuRGlzcGF0Y2hlci5EaXNwYXRjaGVySW5zdGFuY2UuZGlzcGF0Y2g6IGRpc3BhdGNoaW5nIGFuIGFjdGlvbiB3aXRoIG5vIGxpc3RlbmVycyBhdHRhY2hlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgaWYoXy5oYXModGhpcy5fYWN0aW9uc0xpc3RlbmVycywgYWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBfLm1hcCh0aGlzLl9hY3Rpb25zTGlzdGVuZXJzW2FjdGlvbl0sIGZ1bmN0aW9uKGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcihwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiA8cD5SZW1vdmUgYWxsIGxpc3RlbmVyIHByZXZpb3VzbHkgYWRkZWQgPC9wPlxyXG4gICAgICAgICAgICAqIEBtZXRob2QgZGVzdHJveVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnMsIHRoaXMucmVtb3ZlQWN0aW9uTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIERpc3BhdGNoZXIuQWN0aW9uTGlzdGVuZXIgPSBmdW5jdGlvbiBBY3Rpb25MaXN0ZW5lcihhY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnVuaXF1ZUlkID0gXy51bmlxdWVJZChcIkFjdGlvbkxpc3RlbmVyXCIpO1xyXG4gICAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBfLmV4dGVuZChEaXNwYXRjaGVyLkFjdGlvbkxpc3RlbmVyLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBSLkRpc3BhdGNoZXIuQWN0aW9uTGlzdGVuZXIgKi8ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBwcm9wZXJ0eVxyXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcmVhZE9ubHlcclxuICAgICAgICAgKi9cclxuICAgICAgICB1bmlxdWVJZDogbnVsbCxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcHJvcGVydHlcclxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHJlYWRPbmx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYWN0aW9uOiBudWxsLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIERpc3BhdGNoZXI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==