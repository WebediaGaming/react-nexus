import Nexus from './';
import Routable from './Routable';

const { util: { creatable } } = Nexus;

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
