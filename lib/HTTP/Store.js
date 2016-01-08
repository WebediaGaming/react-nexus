import _ from 'lodash';

import Nexus from '../';
const { util: { creatable, mapToObject } } = Nexus;
const { StoreNotFound } = Nexus.Flux;
import request from './request';

const defaultParams = {
  cache: 'default',
  refreshEvery: null,
  async transform(x) {
    return x;
  },
};

const STORE_PENDING = 'STORE_PENDING';

@creatable
class HTTPStore extends Nexus.Store {
  constructor(route, urlObj) {
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
    this.urlObj = urlObj;
  }

  dumpState() {
    return _(mapToObject(this.data))
      .mapValues(({ value }) => value)
    .value();
  }

  async get(pathname, opts) {
    return await request('GET', pathname, null, opts, this.urlObj);
  }

  async attemptToGet(...args) {
    try {
      return await this.get(...args);
    }
    catch(err) {
      return err;
    }
  }

  async fetch(query, params, flux, path) {
    const { cache, transform } = _.merge({}, params, defaultParams);
    const res = await transform(await this.attemptToGet(path, { cache }));
    const item = _.isError(res) ? [res, null] : [null, res];
    this.set(path, item);
    return res;
  }

  loadState(state) {
    _.each(state, ([err, obj], path) => this.set(path, [new Error(err), obj]));
    return this;
  }

  observe(query, params, onChange, flux, path) {
    if(!this.data.has(path)) {
      this.set(path, STORE_PENDING);
      this.fetch(query, params, flux, path);
    }
    const { observers } = this.data.get(path);
    const firstTick = setImmediate(() => onChange(this.data.get(path).value));
    return () => {
      clearImmediate(firstTick);
      observers.remove(onChange);
    };
  }

  readFromState(query, params, flux, path) {
    if(!this.data.has(path)) {
      throw new StoreNotFound(path);
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
    data.value = value;
    observers.forEach((onChange) => onChange(value, path));
  }
}

export default HTTPStore;
