import 'setimmediate';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import url from 'url';

import Store from '../Store';
import creatable from '../util/creatable';
import entriesToObject from '../util/entriesToObject';
import headersToObject from './headersToObject';

@creatable
class HTTPStore extends Store {
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

  dumpState() {
    return _(entriesToObject(this.data.entries()))
      .mapValues(({ state }) => state.dump())
    .value();
  }

  readFromState(queryOrPath) {
    const path = typeof queryOrPath === 'string' ? queryOrPath : this.toPath(queryOrPath);
    if(!this.data.has(path)) {
      return Store.State.pending({ path });
    }
    return this.data.get(path).state;
  }

  async _forceFetch(path, { ignoreCache = false } = {}) {
    const { pathname, query } = url.parse(path, false, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    try {
      const res = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
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
