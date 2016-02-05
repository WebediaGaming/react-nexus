import 'setimmediate';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import url from 'url';

import Store from '../Store';
import creatable from '../util/creatable';
import entriesToObject from '../util/entriesToObject';
import headersToObject from './headersToObject';

/**
 * Represents a HTTPStore.
 * @extends Store
 */
@creatable
class HTTPStore extends Store {

  /**
   * Constructs a new HTTPStore.
   * @constructor
   * @param {String} route Route of the HTTPStore
   * @param {Object} httpConfig HTTP settings that will be use in `url` module configuration
   */
  constructor(route, httpConfig) {
    const superArgs = _([
      'dumpState',
      'fetch',
      'loadState',
      'observe',
      'readFromState',
    ])
      .map((key) => [key, ((...args) => Reflect.apply(HTTPStore.prototype[key], this, args))])
      .fromPairs()
    .value();
    super(route, superArgs);
    this.httpConfig = httpConfig;
    this.data = new Map();
  }

  /**
   * Loads data into the HTTPStore using the given `state` object.
   * Cleans data that are not defines in the `state` object.
   *
   * @public
   * @param {Array|Object} state The object that defines data to load into the HTTPStore.
   * @return {HTTPStore} The instance of the current HTTPStore.
   */
  loadState(state) {
    _(entriesToObject(this.data.entries()))
      .keys()
      .each((path) => {
        if(!state.hasOwnProperty(path)) {
          this.delete(path);
        }
      });
    _.each(state, (dump, path) => this._set(path, Store.State.create(dump)));
    return this;
  }

  /**
   * Iterates over `this.data` in order to provide serializable data of the HTTPStore.
   *
   * @public
   * @return {Array} The serializable array that represent data of the HTTPStore.
   */
  dumpState() {
    return _(entriesToObject(this.data.entries()))
      .mapValues(({ state }) => state.dump())
    .value();
  }

  /**
   * Returns the HTTPStore's {@link State} according to the given `queryOrPath`.
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
   * Executes an HTTP GET request according to the given configuration.
   * Returns the response and its metadata using {@link State}.
   *
   * @private
   * @param {string} path The path to query.
   * @param {Object} config Defines the object that handle `ignoreCache`.
   * @param {Boolean} config.ignoreCache Enable or disable cache.
   * @return {State} The result of the request wrapped into {@link State}.
   */
  async _forceFetch(path, { ignoreCache = false } = {}) {
    const { pathname, query } = url.parse(path, false, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    try {
      const res = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: Object.assign({}, {
          'Accept': 'application/json',
        }, this.httpConfig.headers),
        cache: ignoreCache ? 'no-cache' : 'default',
      });
      const headers = headersToObject(res.headers);
      const { status, statusText } = res;
      const meta = { headers, status, statusText };
      if(!res.ok) {
        return Store.State.reject(await res.text(), meta);
      }
      return Store.State.resolve(await res.json(), meta);
    }
    catch(err) {
      return Store.State.reject(err.toString(), { path });
    }
  }

  /**
   * Fetchs the state of the given query.
   * Directly returns the state if it's available in the data or if the cache is enable,
   * otherwise it executes an HTTP request using `_forceFetch`.
   *
   * @public
   * @param {string} query The query that will be use to fetch the store and set the state.
   * @param {Object} config Defines the object that handle `ignoreCache`.
   * @param {Boolean} config.ignoreCache Enable or disable cache.
   * @return {State} The fetched state wrapped into {@link State}.
   */
  async fetch(query, { ignoreCache = false } = {}) {
    const path = this.toPath(query);
    if(this.data.has(path) && !ignoreCache) {
      return this.readFromState(path);
    }
    this._set(query, Store.State.pending({ path }));
    const state = await this._forceFetch(path, { ignoreCache });
    this._set(query, state);
    return state;
  }

  /**
   * Sets the state into HTTPStore's data with the given path.
   * Converts path and state if their types do not match.
   * Notify observers of this store with the new given state.
   *
   * @private
   * @param {Object|String} queryOrPath The path that will be used to set the state.
   * @param {Object|String} valueOrState The new state to set into data.
   * @return {HTTPStore} The instance of the current HTTPStore.
   */
  _set(queryOrPath, valueOrState) {
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
   * Sets a new observer on the given query.
   * - Converts the query to the path.
   * - Fetchs the corresponding state.
   * - Manages the polling system of the new observer.
   * - Adds the new observer into the observers list with the onChange function.
   * Returns the unobserve function to the new observer candidate.
   *
   * @public
   * @param {Object} query The query that will be used for fetch the state.
   * @param {Object} config Defines the object that handle `refreshInterval` and `ignoreCache`.
   * @param {Number} config.refreshInterval The refresh interval for the polling in ms.
   * @param {Boolean} config.ignoreCache Enable or disable cache.
   * @param {Function} onChange The function that will be triggered when the state will be updated.
   * @return {Function} The unobserve function.
   */
  observe(query, { refreshInterval = null, ignoreCache = false } = {}, onChange) {
    const path = this.toPath(query);
    const fetchQuery = () => this.fetch(query, { ignoreCache });
    fetchQuery();
    const { observers } = this.data.get(path);
    const refreshHandle = refreshInterval === null ? null : setInterval(fetchQuery, refreshInterval);
    const observer = [onChange, refreshHandle];
    observers.add(observer);
    return () => this._unobserve(path, observer);
  }

  /**
   * Removes an existing observer according to the given path.
   * Clears the refreshHandle if the observer was defined as polling system.
   *
   * @private
   * @param {String} path The path that will be used to match the observer.
   * @param {Object} observer The observer to remove.
   * @return {HTTPStore} The instance of the current HTTPStore.
   */
  _unobserve(path, observer) {
    const [, refreshHandle] = observer;
    if(refreshHandle !== null) {
      clearInterval(refreshHandle);
    }
    this.data.get(path).observers.delete(observer);
    return this;
  }
}

export default HTTPStore;
