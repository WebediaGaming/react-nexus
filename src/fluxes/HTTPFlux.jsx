import _ from 'lodash';
import superagent from 'superagent';
import url from 'url';
import Promise from 'bluebird';

import Flux from './Flux';

const defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000,
  additionalHeaders: {},
};

const defaultParams = {
  query: {},
};

class HTTPFlux extends Flux {
  static displayName = 'HTTPFlux';

  static Binding = class HTTPBinding extends Flux.Binding {
    update() {
      const { flux, params } = this;
      return flux.update(params);
    }
  }

  static unserialize({ baseUrl, options, data }) {
    return new this(baseUrl, options, data);
  }

  static keyFor(params) {
    return JSON.stringify(params);
  }

  constructor(baseUrl, options = {}, data = {}) {
    super();
    this.originalOptions = options;
    this.options = _.defaults({}, options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
    this.promises = _.mapValues(this.data, (versions) => {
      const lastVersion = _.last(versions);
      if(!lastVersion) {
        return null;
      }
      return Promise.resolve(lastVersion);
    });
    this.observers = {};
    this.refreshers = {};
  }

  serialize() {
    return {
      baseUrl: this.baseUrl,
      options: this.originalOptions,
      data: this.data,
    };
  }

  pushVersion(key, [err, val]) {
    const version = [err, val, Date.now()];
    this.data[key] = (this.data[key] || []).concat([version]);
    if(_.has(this.observers, key)) {
      _.each(this.observers[key], (fn) => fn(version));
    }
    return [err, val, Date.now()];
  }

  get(path, params = {}) {
    return new HTTPFlux.Binding(this, Object.assign({}, _.defaults({}, params, defaultParams), { path }));
  }

  versions(params) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.data, key)) {
      this.data[key] = [];
    }
    return this.data[key];
  }

  request(path, method, opts = {}) {
    return new Promise((resolve, reject, onCancel) => {
      const req = superagent[method](url.resolve(this.baseUrl, path))
        .set(this.options.additionalHeaders)
        .accept('json')
        .timeout(this.options.maxRequestDuration);
      if(opts.query) {
        req.query(opts.query);
      }
      if(opts.body) {
        req.send(opts.body);
      }
      req.end((err, res) => (err ? reject : resolve)(res.body));
      onCancel(() => req.abort());
    });
  }

  _getAndPushVersion(key, path, query) {
    return this.request(path, 'get', { query })
      .then((val) => [null, val])
      .catch((err) => [err, null])
      .then(([err, val]) => this.pushVersion(key, [err, val]));
  }

  populate(params) {
    const key = this.constructor.keyFor(params);
    const { path, query } = params;
    if(!_.has(this.promises, key) || this.promises[key] === null) {
      this.promises[key] = this._getAndPushVersion(key, path, query);
    }
    return this.promises[key];
  }

  observe(params, fn) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.observers, key)) {
      this.observers[key] = [];
    }
    this.observers[key].push(fn);
    if(this.promises[key]) {
      _.defer(() => _.each(this.versions(params), (version) => fn(version)));
    }
    else {
      this.populate(params);
    }
    return () => {
      this.observers[key].splice(this.observers[key].indexOf(fn), 1);
      if(this.observers[key].length === 0) {
        if(_.has(this.refreshers, key)) {
          clearInterval(this.refreshers[key]);
          delete this.refreshers[key];
        }
        delete this.observers[key];
        delete this.data[key];
        delete this.promises[key];
      }
    };
  }

  update(params) {
    const key = this.constructor.keyFor(params);
    const { path, query } = params;
    return this._getAndPushVersion(key, path, query);
  }
}

export default HTTPFlux;
