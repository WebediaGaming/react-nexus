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
   * @param {Object} options Store options object.
   */
  constructor(route, httpConfig, options = {}) {
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
    this.options = Object.assign({ rewritePath: (query, path) => path }, options);
  }

  /**
   * Loads data into the HTTPStore using the given `state` object.
   * Cleans data that are not defines in the `state` object.
   *
   * @public
   * @param {Array|Object} state Object that defines data to load into the HTTPStore.
   * @return {HTTPStore} Instance of the current HTTPStore.
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
   * @return {Array} Serializable array that represent data of the HTTPStore.
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
   * @param {Object} query Query to retrieve the matching State.
   * @return {State} Matching State.
   */
  readFromState(query) {
    const path = this.toPath(query);
    return this._findOrCreatePathData(path).state;
  }

  /**
   * Executes an HTTP GET request according to the given configuration.
   * Returns the response and its metadata using {@link State}.
   *
   * @private
   * @param {string} path Path to query.
   * @return {State} Result of the request wrapped into {@link State}.
   */
  async _forceFetch(path, { ignoreCache = false }) {
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
   * Fetchs the state of a store given a query.
   *
   * @public
   * @param {Object} query Query that will be use to fetch the store and set the state.
   * @return {State} Fetched state wrapped into {@link State}.
   */
  async fetch(query) {
    const path = this.toPath(query);
    return this._fetch(path, query);
  }

  /**
   * Fetchs the state of a store given a path.
   *
   * @private
   * @param {path} path Path that will be use to fetch the store and set the state.
   * @param {Object} query Query to be passed to rewrite path.
   *                 It's there because path is passed directly to avoid to compute it twice when fetch
   *                 is used internally.
   * @return {State} Fetched state wrapped into {@link State}.
   */
  async _fetch(path, query) {
    this._set(path, Store.State.pending({ path }));
    const state = await this._forceFetch(this.options.rewritePath(query, path), this.options);
    this._set(path, state);
    return state;
  }

  /**
   * Finds or create the data of a path.
   * @param {String} path Path to find.
   * @return {Object} Path data found or created if not found.
   */
  _findOrCreatePathData(path) {
    if(!this.data.has(path)) {
      this.data.set(path, {
        observers: new Set(),
        options: {},
        state: Store.State.reject(`Path ${path} is not initialized!`, { path }),
      });
    }
    return this.data.get(path);
  }

  /**
   * Sets the state into HTTPStore's data with the given path.
   * Converts path and state if their types do not match.
   * Notify observers of this store with the new given state.
   *
   * @private
   * @param {String} path Path that will be used to set the state.
   * @param {Object} state New state to set into data.
   * @return {HTTPStore} The instance of the current HTTPStore.
   */
  _set(path, state) {
    const data = this._findOrCreatePathData(path);
    data.state = state;
    data.observers.forEach((onChange) => onChange(state));
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
   * @param {Function} onChange The function that will be triggered when the state will be updated.
   * @return {Function} The unobserve function.
   */
  observe(query, onChange) {
    const path = this.toPath(query);
    const { observers, state } = this._findOrCreatePathData(path);
    observers.add(onChange);
    if(state.isRejected()) {
      this._fetch(path, query);
    }
    return () => this._unobserve(path, onChange);
  }

  /**
   * Removes an existing observer according to the given path.
   * Clears the refreshHandle if the observer was defined as polling system.
   *
   * @private
   * @param {String} path The path that will be used to match the observer.
   * @param {Object} observer The observer to remove.
   * @return {HTTPStore} Instance of the current HTTPStore.
   */
  _unobserve(path, observer) {
    this.data.get(path).observers.delete(observer);
    return this;
  }

  /**
   * Updates options
   * @param  {Object} options Options to merge with the current options.
   * @return {HTTPStore} Instance of the current HTTPStore.
   */
  options(options) {
    Object.assign(this._options, options);
    return this;
  }
}

export default HTTPStore;
