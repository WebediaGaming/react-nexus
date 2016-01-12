import 'setimmediate';
import _ from 'lodash';

import Store from '../Store';
import creatable from '../util/creatable';
import mapToObject from '../util/mapToObject';

@creatable
class MemoryStore extends Store {
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

  loadState(state) {
    _(this.data)
      .keys()
      .each((path) => {
        if(!state.hasOwnProperty(path)) {
          this.delete(path);
        }
      })
    .run();
    _.each(state, (dump, path) => this.set(path, Store.State.create(dump)));
    return this;
  }

  dumpState() {
    return _(mapToObject(this.data))
      .mapValues(({ state }) => state.dump())
    .value();
  }

  readFromState(query) {
    const path = this.toPath(query);
    if(!this.data.has(path)) {
      return Store.State.reject('Store not found', { path });
    }
    return this.data.get(path).state;
  }

  async fetch(query) {
    return this.readFromState(query);
  }

  observe(query, params, onChange, flux) {
    const path = this.toPath(query);
    const firstTick = setImmediate(() => onChange(this.readFromState(query, params, flux, path)));
    const clearFirstTick = () => clearImmediate(firstTick);
    if(!this.data.has(path)) {
      return clearFirstTick;
    }
    const { observers } = this.data.get(path);
    const observer = [onChange, firstTick];
    observers.add(observer);
    return () => this._unobserve(path, observer);
  }

  _unobserve(path, observer) {
    const [, firstTick] = observer;
    clearImmediate(firstTick);
    this.data.get(path).observers.remove(observer);
    return this;
  }

  set(query, value) {
    const path = this.toPath(query);
    if(!this.data.has(path)) {
      this.data.set(path, {
        observers: new Set(),
      });
    }
    const data = this.data.get(path);
    const state = Store.State.resolve(value, { path });
    data.state = state;
    data.observers.forEach(([onChange]) => onChange(state));
    return this;
  }

  delete(queryOrPath) {
    const path = typeof queryOrPath === 'string' ? queryOrPath : this.toPath(queryOrPath);
    if(!this.data.has(path)) {
      throw new Error(`Store not found: ${ path }`);
    }
    const data = this.data.get(path);
    const state = Store.State.reject('Store deleted', { path });
    data.observers.forEach((observer) => {
      const [onChange] = observer;
      onChange(state);
      this._unobserve(path, observer);
    });
    data.observers.clear();
    data.state = null;
    this.data.delete(path);
    return this;
  }
}

export default MemoryStore;
