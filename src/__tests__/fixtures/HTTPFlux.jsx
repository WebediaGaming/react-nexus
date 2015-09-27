import _ from 'lodash';
import request from 'superagent';
import T, { takes, returns } from 'typecheck-decorator';
import should from 'should/as-function';
import url from 'url';
import Promise from 'bluebird';
const __DEV__ = process.env.NODE_ENV === 'development';

import { Flux } from '../..';

const optNumber = T.option(T.Number());

const valueShape = T.shape([
  T.bool(),
  T.option(T.oneOf(T.instanceOf(Error), T.String())),
  T.any(),
  T.oneOf(T.instanceOf(Date), T.String()),
]);
const valuesType = T.Array(valueShape);

const optionsShape = T.shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber,
});
const defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000,
};

const paramsShape = T.shape({
  path: T.String(),
  query: T.Object(),
  refreshEvery: optNumber,
});
const defaultParams = {
  refreshEvery: null,
  authToken: null,
};

class HTTPFlux extends Flux {
  static displayName = 'HTTPFlux';

  @takes(T.shape({
    baseUrl: T.String(),
    options: optionsShape,
    data: T.Object(valuesType),
  }))
  @returns(T.instanceOf(HTTPFlux))
  static unserialize({ baseUrl, options, data }) {
    return new HTTPFlux(baseUrl, options, data);
  }

  @takes(paramsShape)
  @returns(T.String())
  static keyFor(params) {
    return JSON.stringify(params);
  }

  constructor(baseUrl, options, data) {
    super();
    if(__DEV__) {
      T.String()(baseUrl);
      optionsShape(options);
      T.Object(valuesType)(data);
    }
    this.originalOptions = options;
    this.options = _.defaults(options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
  }

  @returns(T.shape({
    baseUrl: T.String(),
    options: optionsShape,
    data: T.Object(valuesType),
  }))
  serialize() {
    return {
      baseUrl: this.baseUrl,
      options: this.originalOptions,
      data: this.data,
    };
  }

  @takes(
    T.String(),
    T.shape([T.String(), T.any()])
  )
  @returns(T.instanceOf(HTTPFlux))
  pushValue(params, [pending, err, res]) {
    const key = this.constructor.keyFor(params);
    this.data[key] = (this.data[key] || []).concat([[pending, err, res, new Date()]]);
    return this;
  }

  @takes(T.String())
  @returns(T.instanceOf(request.Request))
  request(method, path) {
    return request[method](url.resolve(this.baseUrl, path))
      .accept('json')
      .timeout(this.options.maxRequestDuration);
  }

  @takes(
    T.String(),
    paramsShape
  )
  @returns(T.shape({
    flux: T.instanceOf(HTTPFlux),
    params: paramsShape,
  }))
  get(path, params = {}) {
    return {
      flux: this,
      params: Object.assign({}, _.defaults(params, defaultParams), { path }),
    };
  }

  @takes(paramsShape)
  @returns(valuesType)
  values(params) {
    const key = this.constructor.keyFor(params);
    if(__DEV__) {
      should(this.data).have.property(key);
    }
    return this.data[key];
  }

  @takes(paramsShape)
  @returns(T.Promise())
  populate({ path, query }) {
    let req;
    return new Promise((resolve, reject) => {
      req = this.pushValue([true, null, null])
        .request('get', path)
        .query(query)
        .end((err, res) => {
          if(err) {
            return reject(err);
          }
          resolve(res.body);
        });
    })
    .cancellable()
    .catch(Promise.CancellationError, (err) => {
      req.abort();
      throw err;
    })
    .then((res) => [false, null, res])
    .catch((err) => [false, err.toString(), void 0])
    .then(([pending, err, res]) => this.pushValue(pending, err, res));
  }
}

export default HTTPFlux;
