import _ from 'lodash';
import superagent from 'superagent';
import url from 'url';
import Promise from 'bluebird';
import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';

import Flux from './Flux';
import { version as versionType, versions as versionsType } from '../utils/types';

const __DEV__ = process.env.NODE_ENV === 'development';

const optNumber = T.option(T.Number());

const optionsType = T.shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber,
});
const defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000,
};

const paramsType = T.shape({
  path: T.String(),
  query: T.Object(),
  refreshEvery: optNumber,
});
const defaultParams = {
  query: {},
  refreshEvery: void 0,
};

class HTTPFlux extends Flux {
  static displayName = 'HTTPFlux';

  @devTakes(T.shape({
    baseUrl: T.String(),
    options: optionsType,
    data: T.Object({ type: versionsType }),
  }))
  @devReturns(T.instanceOf(HTTPFlux))
  static unserialize({ baseUrl, options, data }) {
    return new HTTPFlux(baseUrl, options, data);
  }

  @devTakes(paramsType)
  @devReturns(T.String())
  static keyFor(params) {
    return JSON.stringify(params);
  }

  constructor(baseUrl, options = {}, data = {}) {
    super();
    if(__DEV__) {
      T.String()(baseUrl);
      optionsType(options);
      T.Object({ type: versionsType })(data);
    }
    this.originalOptions = options;
    this.options = _.defaults({}, options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
    this.promises = _.mapValues(data, ([err, res]) => Promise.resolve([err, res]));
    this.observers = {};
    this.refreshers = {};
  }

  @devReturns(T.shape({
    baseUrl: T.String(),
    options: optionsType,
    data: T.Object({ type: versionsType }),
  }))
  serialize() {
    return {
      baseUrl: this.baseUrl,
      options: this.originalOptions,
      data: this.data,
    };
  }

  @devTakes(T.String(), versionType)
  @devReturns(T.instanceOf(HTTPFlux))
  pushVersion(key, [err, res]) {
    const version = [err, res, new Date()];
    this.data[key] = (this.data[key] || []).concat([version]);
    if(_.has(this.observers, key)) {
      _.each(this.observers[key], (fn) => fn(version));
    }
    return this;
  }

  @devTakes(T.String(), T.Object())
  @devReturns(T.shape({
    flux: T.instanceOf(HTTPFlux),
    params: paramsType,
  }))
  get(path, params = {}) {
    return {
      flux: this,
      params: Object.assign({}, _.defaults({}, params, defaultParams), { path }),
    };
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

  @devTakes(
    T.String(),
    T.oneOf(T.exactly('get'), T.exactly('post')),
    T.option(T.Object())
  )
  @devReturns(T.Promise())
  request(path, method, opts = {}) {
    let req;
    return new Promise((resolve, reject) => {
      req = superagent[method](url.resolve(this.baseUrl, path))
        .accept('json')
        .timeout(this.options.maxRequestDuration);
      if(opts.query) {
        req = req.query(opts.query);
      }
      if(opts.body) {
        req = req.send(opts.body);
      }
      req.end((err, res) => {
        if(err) {
          return reject(err);
        }
        return resolve(res.body);
      });
    })
    .cancellable()
    .catch(Promise.CancellationError, (err) => {
      req.abort();
      throw err;
    })
    .then((res) => [void 0, res])
    .catch((err) => [err.toString(), void 0]);
  }

  @devTakes(paramsType)
  @devReturns(T.Promise())
  populate(params) {
    const key = this.constructor.keyFor(params);
    const { path, query } = params;
    if(!_.has(this.promises, key)) {
      this.promises[key] = this.request(path, 'get', { query })
        .then(([err, res]) => this.pushVersion(key, [err, res]));
    }
    return this.promises[key];
  }

  @devTakes(T.shape({
    path: T.String(),
    query: T.option(T.any()),
    body: T.option(T.any()),
  }))
  @devReturns(T.Promise())
  post({ path, query, body }) {
    return this.fetch(path, 'post', { query, body })
    .then(([, err, res]) => {
      if(err) {
        throw err;
      }
      return res.body;
    });
  }

  @devTakes(paramsType, T.Function())
  @devReturns(T.Function())
  observe(params, fn) {
    const key = this.constructor.keyFor(params);
    if(!_.has(this.observers, key)) {
      this.observers[key] = [];
      const { path, query, refreshEvery } = params;
      if(refreshEvery) {
        this.refreshers[key] = setInterval(() =>
          this.fetch(path, 'get', { query })
            .then(([err, res]) => this.pushVersion(key, [err, res]))
        , refreshEvery);
      }
    }
    this.observers[key].push(fn);
    if(this.promises[key]) {
      _.defer(() => _.each(this.data[key], ([err, res]) => fn([err, res])));
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
}

export default HTTPFlux;
