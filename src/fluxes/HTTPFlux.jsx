import _ from 'lodash';
import superagent from 'superagent';
import url from 'url';
import Promise from 'bluebird';
import T, { takes as devTakes, returns as devReturns } from 'typecheck-decorator';

import Flux from './Flux';
import { version as versionType, versions as versionsType } from '../utils/types';

const __DEV__ = process.env.NODE_ENV === 'development';

const optNumber = T.option(T.Number());

const optObjectString = T.option(T.Object({ type: String }));

const optionsType = T.shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber,
  additionalHeaders: optObjectString,
});
const defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000,
  additionalHeaders: {},
};

const paramsType = T.shape({
  path: T.String(),
  query: T.Object(),
});

const defaultParams = {
  query: {},
};

const serializedType = T.shape({
  baseUrl: T.String(),
  options: optionsType,
  data: T.Object({ type: versionsType }),
});

class HTTPFlux extends Flux {
  static displayName = 'HTTPFlux';

  static Binding = class HTTPBinding extends Flux.Binding {
    update() {
      const { flux, params } = this;
      return flux.update(params);
    }
  }

  @devTakes(serializedType)
  @devReturns(T.instanceOf(HTTPFlux))
  static unserialize({ baseUrl, options, data }) {
    return new this(baseUrl, options, data);
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

  @devReturns(serializedType)
  serialize() {
    return {
      baseUrl: this.baseUrl,
      options: this.originalOptions,
      data: this.data,
    };
  }

  @devTakes(T.String(), versionType)
  @devReturns(versionType)
  pushVersion(key, [err, val]) {
    const version = [err, val, Date.now()];
    this.data[key] = (this.data[key] || []).concat([version]);
    if(_.has(this.observers, key)) {
      _.each(this.observers[key], (fn) => fn(version));
    }
    return [err, val, Date.now()];
  }

  @devTakes(T.String(), T.Object())
  @devReturns(T.instanceOf(HTTPFlux.Binding))
  get(path, params = {}) {
    return new HTTPFlux.Binding(this, Object.assign({}, _.defaults({}, params, defaultParams), { path }));
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
        .set(this.options.additionalHeaders)
        .accept('json')
        .timeout(this.options.maxRequestDuration);
      if(opts.query) {
        req = req.query(opts.query);
      }
      if(opts.body) {
        req = req.send(opts.body);
      }
      req.end((err, res) => (err ? reject : resolve)(res.body));
    })
    .cancellable()
    .catch(Promise.CancellationError, (err) => {
      req.abort();
      throw err;
    });
  }

  @devTakes(T.String(), T.String(), T.option(T.Object()))
  @devReturns(T.Promise())
  _getAndPushVersion(key, path, query) {
    return this.request(path, 'get', { query })
      .then((val) => [null, val])
      .catch((err) => [err, null])
      .then(([err, val]) => this.pushVersion(key, [err, val]));
  }

  @devTakes(paramsType)
  @devReturns(T.Promise())
  populate(params) {
    const key = this.constructor.keyFor(params);
    const { path, query } = params;
    if(!_.has(this.promises, key) || this.promises[key] === null) {
      this.promises[key] = this._getAndPushVersion(key, path, query);
    }
    return this.promises[key];
  }

  @devTakes(paramsType, T.Function())
  @devReturns(T.Function())
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

  @devTakes(paramsType, T.Function())
  @devReturns(T.Promise())
  update(params) {
    const key = this.constructor.keyFor(params);
    const { path, query } = params;
    return this._getAndPushVersion(key, path, query);
  }
}

export default HTTPFlux;
