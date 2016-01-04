import Nexus from './';

const { util: { creatable } } = Nexus;

@creatable
class Store {
  constructor({
      dumpState,
      fetch,
      loadState,
      observe,
      readFromState,
  }) {
    this.dumpState = dumpState;
    this.fetch = fetch;
    this.loadState = loadState;
    this.observe = observe;
    this.readFromState = readFromState;
  }
}

export default Store;
