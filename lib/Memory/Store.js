import 'setimmediate';
import _ from 'lodash';

import Store from '../Store';
import creatable from '../util/creatable';
import entriesToObject from '../util/entriesToObject';

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
      .map((key) => [key, ((...args) => Reflect.apply(MemoryStore.prototype[key], this, args))])
      .fromPairs()
    .value();
    super(route, superArgs);
    this.data = new Map();
  }

  loadState(state) {
    _(entriesToObject(this.data.entries()))
      .keys()
      .each((path) => {
        if(!state.hasOwnProperty(path)) {
          this.delete(path);
        }
      })
    .commit();
    _.each(state, (dump, path) => this.set(path, Store.State.create(dump)));
    return this;
  }

  dumpState() {
    return _(entriesToObject(this.data.entries()))
      .mapValues(({ state }) => state.dump())
    .value();
  }

  readFromState(queryOrPath) {
    const path = typeof queryOrPath === 'string' ? queryOrPath : this.toPath(queryOrPath);
    if(!this.data.has(path)) {
      return Store.State.reject('Store not found', { path });
    }
    return this.data.get(path).state;
  }

  async fetch(queryOrPath) {
    return this.readFromState(queryOrPath);
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

  set(queryOrPath, valueOrState) {
    const path = typeof queryOrPath === 'string' ? queryOrPath : this.toPath(queryOrPath);
    const state = valueOrState instanceof Store.State ? valueOrState : Store.State.resolve(valueOrState, { path });
    if(!this.data.has(path)) {
      this.data.set(path, {
        observers: new Set(),
      });
    }
    const data = this.data.get(path);
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
