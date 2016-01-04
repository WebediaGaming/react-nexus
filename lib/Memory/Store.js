import _ from 'lodash';

import Nexus from '../';
const { util: { creatable }, Flux: { StoreNotFoundError } } = Nexus;

@creatable
class MemoryStore extends Nexus.Store {
  constructor(initialState = {}) {
    super(initialState);
    this.values = _.mapValues(initialState, (value) => ({
      value,
      observers: new Set(),
    }));
  }

  dumpState() {
    return _.mapValues(this.values, ({ value }) => value);
  }

  assertPath(path) {
    if(!this.values.hasOwnProperty(path)) {
      throw new StoreNotFoundError(path);
    }
    return this;
  }

  setState(path, value) {
    this.assertPath(path);
    const item = this.values[path];
    item.value = value;
    item.observers.forEach((onChange) => onChange(value));
    return this;
  }

  async fetch(query, params, flux, path) {
    return this.readFromState(query, params, flux, path);
  }

  readFromState(query, params, flux, path) {
    this.assertPath(path);
    const { value } = this.values[path];
    return value;
  }

  observe(query, params, flux, onChange, path) {
    this.assertPath(path);
    const { observers } = this.values[path];
    observers.add(onChange);
    return () => observers.remove(path);
  }
}

export default MemoryStore;
