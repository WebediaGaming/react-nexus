import 'setimmediate';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import url from 'url';

import Store from '../Store';
import creatable from '../util/creatable';
import entriesToObject from '../util/entriesToObject';
import headersToObject from './headersToObject';

/**
 * Represents a HttpStore.
 * @extends Store
 */
@creatable
class HttpStore extends Store {

  /**
   * Constructs a new HttpStore.
   * @constructor
   * @param {String} route Route of the HttpStore
   * @param {Object} httpConfig HTTP settings that will be use in `url` module configuration
   * @param {Object} options Store options object.
   */
  constructor(route, httpConfig, options = {}) {
    const keys = [
      'dumpState',
      'fetch',
      'loadState',
      'observe',
      'readFromState',
    ];
    const mapHttpStoreKeys = _.map(
      keys,
      (key) => [key, ((...args) => Reflect.apply(HttpStore.prototype[key], this, args))]
    );
    super(route, _.fromPairs(mapHttpStoreKeys));
    this.httpConfig = httpConfig;
    this.data = new Map();
    this.options = Object.assign({ rewritePath: (query, path) => path }, options);
  }

  /**
   * Loads data into the HttpStore using the given `state` object.
   * Cleans data that are not defines in the `state` object.
   *
   * @public
   * @param {Array|Object} state Object that defines data to load into the HttpStore.
   * @return {HttpStore} Instance of the current HttpStore.
   */
  loadState(state) {
    const entriesKeys = _.keys(entriesToObject(this.data.entries()));
    _.each(entriesKeys, (path) => {
      if(!state.hasOwnProperty(path)) {
        this.delete(path);
      }
    });
    _.each(state, (dump, path) => this._set(path, Store.State.create(dump)));
    return this;
  }

  /**
   * Iterates over `this.data` in order to provide serializable data of the HttpStore.
   *
   * @public
   * @return {Array} Serializable array that represent data of the HttpStore.
   */
  dumpState() {
    return _.mapValues(entriesToObject(this.data.entries()), ({ state }) => state.dump());
  }

  /**
   * Returns the HttpStore's {@link State} according to the given `queryOrPath`.
   * If store isn't found, returns a rejected uninitialized {@link State}.
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
   * @param {Object} pathQuery Query to be passed to rewrite path.
   *                 It's there because path is passed directly to avoid to compute it twice when fetch
   *                 is used internally.
   * @return {State} Result of the request wrapped into {@link State}.
   */
  async _forceFetch(path, pathQuery) {
    const { ignoreCache = false, rewritePath } = this.options;
    const { pathname, query } = url.parse(rewritePath(pathQuery, path), true, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    const currentState = this._findOrCreatePathData(path).state;
    this._set(path, Store.State.pending(currentState.value, { path }));

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
      return this._set(path, Store.State.reject(currentState.value, await res.text(), { path }));
    }
    return this._set(path, Store.State.resolve(await res.json(), meta));
  }

  /**
   * Fetchs the state of a store given a query.
   *
   * If store is pending, returns current fetching promise.
   *
   * @public
   * @param {Object} query Query that will be use to fetch the store and set the state.
   * @return {State} Fetched state wrapped into {@link State}.
   */
  async fetch(query) {
    const path = this.toPath(query);
    const data = this._findOrCreatePathData(path);
    if(!data.state.isPending()) {
      data.promise = this._forceFetch(path, query);
    }
    return data.promise;
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
        state: Store.State.reject(void 0, `Path ${path} is not initialized!`, { path, uninitialized: true }),
      });
    }
    return this.data.get(path);
  }

  /**
   * Sets the state into HttpStore's data with the given path.
   * Converts path and state if their types do not match.
   * Notify observers of this store with the new given state.
   *
   * @private
   * @param {String} path Path that will be used to set the state.
   * @param {Object} state New state to set into data.
   * @return {HttpStore} The instance of the current HttpStore.
   */
  _set(path, state) {
    const data = this._findOrCreatePathData(path);
    data.state = state;
    data.observers.forEach((onChange) => onChange(state));
    return state;
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
      this._forceFetch(path, query);
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
   * @return {HttpStore} Instance of the current HttpStore.
   */
  _unobserve(path, observer) {
    const pathData = this.data.get(path);
    pathData.observers.delete(observer);
    if(pathData.observers.size === 0 && pathData.state.meta.uninitialized) {
      this.data.delete(path);
    }
    return this;
  }
}

export default HttpStore;
