import _ from 'lodash';

import Flux from './Flux';

class LocalFlux extends Flux {
  static displayName = 'LocalFlux';

  static Binding = class LocalBinding extends Flux.Binding {};

  static unserialize({ data }) {
    return new this(data);
  }

  static keyFor(params) {
    return params;
  }

  constructor(data = {}) {
    super();
    this.data = data;
    this.observers = {};
  }

  serialize() {
    return {
      data: this.data,
    };
  }

  versions(params) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.data, key)) {
      this.data[key] = [];
    }
    return this.data[key];
  }

  pushVersion(key, [err, val]) {
    const version = [err, val, Date.now()];
    this.data[key] = (this.data[key] || []).concat([version]);
    if(_.has(this.observers, key)) {
      _.each(this.observers[key], (fn) => fn(version));
    }
    return this;
  }

  populate() {
    return Promise.resolve();
  }

  get(path) {
    return new LocalFlux.Binding(this, path);
  }

  observe(params, fn) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.observers, key)) {
      this.observers[key] = [];
    }
    this.observers[key].push(fn);
    _.defer(() => _.each(this.versions(params), (version) => fn(version)));
    return () => {
      this.observers[key].splice(this.observers[key].indexOf(fn), 1);
      if(this.observers[key].length === 0) {
        delete this.observers[key];
        delete this.data[key];
      }
    };
  }

  set(params, val) {
    return this.pushVersion(params, [null, val]);
  }
}

export default LocalFlux;
