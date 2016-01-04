import Nexus from './';

const { util: { creatable } } = Nexus;

@creatable
class Action {
  constructor({
    dispatch,
  }) {
    this.dispatch = dispatch;
  }
}

export default Action;
