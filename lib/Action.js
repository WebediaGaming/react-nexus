import Nexus from './';

const { util: { creatable } } = Nexus;

@creatable
class Action {
  constructor({
    dispatch,
    route,
  }) {
    this.dispatch = (...args) => Reflect.apply(dispatch, this, args);
    this.route = route;
  }
}

export default Action;
