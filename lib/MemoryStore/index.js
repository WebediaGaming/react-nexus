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
   * @param {Array|Object} state Object that defines data to load into the MemoryStore.
   * @return {MemoryStore} Instance of the current MemoryStore.
   */
  loadState(state) {
    _(entriesToObject(this.data.entries()))
      .keys()
      .each((path) => {
        if(!state.hasOwnProperty(path)) {
          this._delete(path);
        }
      });
    _.each(state, (dump, path) => this._set(path, Store.State.create(dump)));
    return this;
  }

  /**
   * Iterates over `this.data` in order to provide serializable data of the MemoryStore.
   *
   * @public
   * @return {Array} Serializable array that represent data of the MemoryStore.
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
   * @param {Object} query Query to use to retrieve the matching State.
   * @return {State} Matching State.
   */
  readFromState(query) {
    const path = this.toPath(query);
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
   * @param {Object} query Query to use to retrieve the matching State.
   * @return {State} Fetched state.
   */
  async fetch(query) {
    return this.readFromState(query);
  }

  /**
   * Sets a new observer on the given query.
   * - Converts the query to the path.
   * - Reads the corresponding state.
   * - Adds the new observer into the observers list with the onChange function.
   * Returns the unobserve function to the new observer candidate.
   *
   * @public
   * @param {Object} query Query that will be used for fetch the state.
   * @param {Function} onChange Function that will be triggered when the state will be updated.
   * @return {Function} Unobserve function.
   */
  observe(query, onChange) {
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
   * @param {String} path Path that will be used to match the observer.
   * @param {Object} observer Observer to remove.
   * @return {MemoryStore} Instance of the current MemoryStore.
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
   * Notify observers of this store with the new given state.
   *
   * @private
   * @param {String} path Path that will be used to set the state.
   * @param {State} state New state to set into data.
   * @return {undefined}
   */
  _set(path, state) {
    if(!this.data.has(path)) {
      this.data.set(path, {
        observers: new Set(),
      });
    }
    const data = this.data.get(path);
    data.state = state;
    data.observers.forEach(([onChange]) => onChange(state));
  }

  /**
   * Sets the state into MemoryStore's data with the given query.
   * Converts path and state if their types do not match.
   *
   * @public
   * @param {Object} query Query that will be used to set the state.
   * @param {State|*} valueOrState New state or value to set into data.
   * @return {MemoryStore} Instance of the current MemoryStore.
   */
  set(query, valueOrState) {
    const path = this.toPath(query);
    const state = valueOrState instanceof Store.State ? valueOrState : Store.State.resolve(valueOrState, { path });
    this._set(path, state);
    return this;
  }

  /**
   * Deletes the state from MemoryStore's data with the given path.
   * Notify observers about the deletion and removes all observers.
   *
   * @private
   * @param {String} path Path that will be used to delete the state.
   * @return {undefined}
   */
  _delete(path) {
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
  }

  /**
   * Deletes the state from MemoryStore's data with the given query.
   *
   * @public
   * @param {Object} query Query that will be used to delete the state.
   * @return {MemoryStore} Instance of the current MemoryStore.
   */
  delete(query) {
    const path = this.toPath(query);
    this._delete(path);
    return this;
  }
}

export default MemoryStore;
