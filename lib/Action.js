import Routable from './Routable';
import creatable from './util/creatable';

/**
 * Class representing an action.
 * @extends Routable
 */
@creatable
class Action extends Routable {
  /**
   * Creates an Action.
   * @constructor
   * @param {String} route Route of the action
   * @param {Function} dispatch Function to call when the action is dispatched
   */
  constructor(route, dispatch) {
    super(route);
    this.dispatch = (...args) => Reflect.apply(dispatch, this, args);
  }
}

export default Action;
