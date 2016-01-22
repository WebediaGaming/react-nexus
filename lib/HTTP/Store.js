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

  readFromState(query) {
    const path = this.toPath(query);
    if(!this.data.has(path)) {
      return Store.State.reject('Store not found', { path });
    }
    return this.data.get(path).state;
  }

  async _forceFetch(path) {
    const { pathname, query } = url.parse(path, false, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    try {
      const res = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      const headers = headersToObject(res.headers);
      const { status, statusText } = res;
      const meta = { headers, status, statusText };
      if(!res.ok) {
        return Store.State.reject(res.text(), meta);
      }
      return Store.State.resolve(res.json(), meta);
    }
    catch(err) {
      return Store.State.reject(err.toString(), { path });
    }
  }

  async fetch(query) {
    const path = this.toPath(query);
    if(this.data.has(path)) {
      return this.readFromState(path);
    }
    this._set(query, Store.State.pending({ path }));
    const state = await this._forceFetch(path);
    this._set(query, state);
    console.warn('fetch', { query, state });
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
    data.observers.forEach((onChange) => onChange(state));
    return this;
  }

  observe(query, params, onChange) {
    const path = this.toPath(query);
    this.fetch(query);
    const { observers } = this.data.get(path);
    const observer = onChange;
    observers.add(observer);
    return () => this._unobserve(path, observer);
  }

  _unobserve(path, observer) {
    this.data.get(path).observers.remove(observer);
    return this;
  }
}

export default HTTPStore;
