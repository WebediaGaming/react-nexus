import Routable from './Routable';
import creatable from './util/creatable';

@creatable
class Action extends Routable {
  constructor({
    dispatch,
    route,
  }) {
    super(route);
    this.dispatch = (...args) => Reflect.apply(dispatch, this, args);
  }
}

export default Action;
