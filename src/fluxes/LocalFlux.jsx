import _ from 'lodash';
import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';
const __DEV__ = process.env.NODE_ENV === 'development';

import Flux from './Flux';
import { version as versionType, versions as versionsType } from '../utils/types';

const paramsType = T.String();

class LocalFlux extends Flux {
  static displayName = 'LocalFlux';

  @devTakes(T.shape({
    data: T.Object({ type: versionsType }),
  }))
  @devReturns(T.instanceOf(LocalFlux))
  static unserialize({ data }) {
    return new LocalFlux(data);
  }

  @devTakes(paramsType)
  @devReturns(T.String())
  static keyFor(params) {
    return params;
  }

  constructor(data = {}) {
    super();
    if(__DEV__) {
      T.Object({ type: versionsType })(data);
    }
    this.data = data;
    this.observers = {};
  }

  @devReturns(T.shape({
    data: T.Object({ type: versionType }),
  }))
  serialize() {
    const { data } = this;
    return { data };
  }

  @devTakes(paramsType)
  @devReturns(versionsType)
  versions(params) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.data, key)) {
      this.data[key] = [];
    }
    return this.data[key];
  }

  @devTakes(T.String(), versionType)
  @devReturns(T.instanceOf(LocalFlux))
  pushVersion(key, [err, val]) {
    const version = [err, val, new Date()];
    this.data[key] = (this.data[key] || []).concat([version]);
    if(_.has(this.observers, key)) {
      _.each(this.observers[key], (fn) => fn(version));
    }
    return this;
  }

  @devTakes(paramsType)
  @devReturns(T.Promise())
  populate() {
    return Promise.resolve();
  }

  @devTakes(T.String())
  @devReturns(T.shape({
    flux: T.instanceOf(LocalFlux),
    params: paramsType,
  }))
  get(path) {
    return {
      flux: this,
      params: path,
    };
  }

  @devTakes(paramsType, T.Function())
  @devReturns(T.Function())
  observe(params, fn) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.observers, key)) {
      this.observers[key] = [];
    }
    this.observers[key].push(fn);
    _.defer(() => _.each(this.versions(params), ([err, val, date]) => fn([err, val, date])));
    return () => {
      this.observers[key].splice(this.observers[key].indexOf(fn), 1);
      if(this.observers[key].length === 0) {
        delete this.observers[key];
        delete this.data[key];
      }
    };
  }

  @devTakes(paramsType, T.any())
  set(params, val) {
    return this.pushVersion(params, [void 0, val]);
  }
}

export default LocalFlux;
