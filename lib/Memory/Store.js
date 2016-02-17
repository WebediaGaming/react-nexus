import 'setimmediate';
import _ from 'lodash';

import Store from '../Store';
import creatable from '../util/creatable';
import entriesToObject from '../util/entriesToObject';

/**
 * Represents a MemoryStore.
 * @extends Store
 */
@creatable
class MemoryStore extends Store {

  /**
   * Constructs a new MemoryStore.
   * @constructor
   * @param {String} route Route of the MemoryStore
   */
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

  /**
   * Loads data into the MemoryStore using the given `state` object.
   * Cleans data that are not defined in the `state` object.
   *
   * @public
   * @param {Array|Object} state The object that defines data to load into the MemoryStore.
   * @return {MemoryStore} The instance of the current MemoryStore.
   */
  loadState(state) {
    _(entriesToObject(this.data.entries()))
      .keys()
      .each((path) => {
        if(!state.hasOwnProperty(path)) {
          this.delete(path);
        }
      });
    _.each(state, (dump, path) => this.set(path, Store.State.create(dump)));
    return this;
  }

  /**
   * Iterates over `this.data` in order to provide serializable data of the MemoryStore.
   *
   * @public
   * @return {Array} The serializable array that represent data of the MemoryStore.
   */
  dumpState() {
    return _(entriesToObject(this.data.entries()))
      .mapValues(({ state }) => state.dump())
    .value();
  }

  /**
   * Returns the MemoryStore's {@link State} according to the given `queryOrPath`.
   * If store isn't found, returns a rejected {@link State}.
   *
   * @public
   * @param {Object|String} queryOrPath The query or the path to use as a key to retrieve the matching State.
   * @return {State} The matching State.
   */
  readFromState(queryOrPath) {
    const path = typeof queryOrPath === 'string' ? queryOrPath : this.toPath(queryOrPath);
    if(!this.data.has(path)) {
      return Store.State.pending({ path });
    }
    return this.data.get(path).state;
  }

  /**
   * Fetchs the state of the given query or path.
   * Simply call readFromState function with the given query or path.
   *
   * @public
   * @param {Object|String} queryOrPath The query or the path to retrieve the matching State.
   * @return {State} The fetched state.
   */
  async fetch(queryOrPath) {
    return this.readFromState(queryOrPath);
  }

  /**
   * Sets a new observer on the given query.
   * - Converts the query to the path.
   * - Reads the corresponding state.
   * - Adds the new observer into the observers list with the onChange function.
   * Returns the unobserve function to the new observer candidate.
   *
   * @public
   * @param {Object} query The query that will be used for fetch the state.
   * @param {Object} params TODO: quick & dirty, not used but needed by {@link Flux}'s observe method.
   * @param {Function} onChange The function that will be triggered when the state will be updated.
   * @return {Function} The unobserve function.
   */
  observe(query, params, onChange) {
    const path = this.toPath(query);
    const firstTick = setImmediate(() => onChange(this.readFromState(query)));
    const clearFirstTick = () => clearImmediate(firstTick);
    if(!this.data.has(path)) {
      return clearFirstTick;
    }
    const { observers } = this.data.get(path);
    const observer = [onChange, firstTick];
    observers.add(observer);
    return () => this._unobserve(path, observer);
  }

  /**
   * Removes an existing observer according to the given path.
   *
   * @private
   * @param {String} path The path that will be used to match the observer.
   * @param {Object} observer The observer to remove.
   * @return {MemoryStore} The instance of the current MemoryStore.
   */
  _unobserve(path, observer) {
    const [, firstTick] = observer;
    clearImmediate(firstTick);
    if(this.data.has(path)) {
      this.data.get(path).observers.delete(observer);
    }
    return this;
  }

  /**
   * Sets the state into MemoryStore's data with the given path.
   * Converts path and state if their types do not match.
   * Notify observers of this store with the new given state.
   *
   * @public
   * @param {Object|String} queryOrPath The path that will be used to set the state.
   * @param {Object|String} valueOrState The new state to set into data.
   * @return {MemoryStore} The instance of the current MemoryStore.
   */
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

  /**
   * Deletes the state from MemoryStore's data with the given path.
   * Converts path and state if their types do not match.
   * Notify observers about the deletion and removes all observers.
   *
   * @public
   * @param {Object|String} queryOrPath The path that will be used to delete the state.
   * @return {MemoryStore} The instance of the current MemoryStore.
   */
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
