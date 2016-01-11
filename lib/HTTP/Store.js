import 'setimmediate';
import _ from 'lodash';

import Nexus from '../';
const { util: { creatable, mapToObject } } = Nexus;

@creatable
class MemoryStore extends Nexus.Store {
  constructor(route) {
    const superArgs = _([
      'dumpState',
      'fetch',
      'loadState',
      'observe',
      'readFromState',
    ])
      .map((key) => [key, ((...args) => this[key](...args))])
      .object()
    .value();
    superArgs.route = route;
    super(superArgs);
    this.data = new Map();
  }

  dumpState() {
    return _(mapToObject(this.data))
      .mapValues(({ value }) => value.dump())
    .value();
  }

  async fetch(query, params, flux, path) {
    return this.readFromState(path);
  }

  loadState(state) {
    _.each(state, (dump, path) => this.set(path, Nexus.Store.create(dump)));
    return this;
  }

  observe(query, params, onChange, flux, path) {
    const firstTick = setImmediate(() => onChange(this.readFromState(query, params, flux, path)));
    const clearFirstTick = () => clearImmediate(firstTick);
    if(!this.data.has(path)) {
      return clearFirstTick;
    }
    const { observers } = this.data.get(path);
    observers.add(onChange);
    const unobserve = () => observers.remove(onChange);
    return _.flow(clearFirstTick, unobserve);
  }

  readFromState(query, params, flux, path) {
    if(!this.data.has(path)) {
      return Nexus.Store.State.reject('Store not found', { path });
    }
    return this.data.get(path).value;
  }

  set(path, value) {
    if(!this.data.has(path)) {
      this.data.set(path, {
        observers: new Set(),
      });
    }
    const { data, observers } = this.data.get(path);
    data.value = Nexus.Store.resolve(value, { path });
    observers.forEach((onChange) => onChange(data.value));
  }
}

export default MemoryStore;
