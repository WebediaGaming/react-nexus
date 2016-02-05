import url from 'url';

import Action from '../Action';
import creatable from '../util/creatable';

/**
 * Represents a HTTPAction.
 * @extends Action
 */
@creatable
class HTTPAction extends Action {

  /**
   * Creates a HTTPAction.
   * @constructor
   * @param {String} route Route of the HTTPAction
   * @param {Object} httpConfig HTTP settings that will be use in `url` module configuration
   * @param {Function} dispatch Function to call when the action is dispatched
   */
  constructor(route, httpConfig, dispatch) {
    super(route, (...args) => Reflect.apply(dispatch, this, args));
    this.httpConfig = httpConfig;
  }

  /**
   * Executes a HTTP request according to the given configuration.
   * Returns a Promise that handle the response of the HTTP request.
   *
   * @public
   * @param {Object} q The query that will be used in url to perform the HTTP request.
   * @param {GET|HEAD|POST|PUT|DELETE|TRACE|OPTIONS} method The method to perform the desired action.
   * @param {Object} headers The headers that will be used in the HTTP request.
   * @param {Object} body The enclosed data for the request.
   * @return {Promise} The promise that handle the response.
   */
  async request(q, method, headers, body) {
    const path = this.toPath(q);
    const { pathname, query } = url.parse(path, false, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    const request = {
      method,
      mode: 'cors',
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, headers),
    };
    if(body) {
      request.body = JSON.stringify(body);
      request.headers = Object.assign({}, request.headers, {
        'Content-Type': 'application/json',
      });
    }
    return await fetch(uri, request);
  }

  /**
   * Executes a HTTP request according to the given configuration, with 'POST' method
   *
   * @param {Object} q The query that will be used in url to perform the HTTP request.
   * @param {Object} headers The headers that will be used in the HTTP request.
   * @param {Object} body The enclosed data for the request.
   * @return {Promise} The promise that handle the response.
   */
  post(q, headers, body) {
    return this.request(q, 'POST', headers, body);
  }

  /**
   * Executes a HTTP request according to the given configuration, with 'PUT' method
   *
   * @param {Object} q The query that will be used in url to perform the HTTP request.
   * @param {Object} headers The headers that will be used in the HTTP request.
   * @param {Object} body The enclosed data for the request.
   * @return {Promise} The promise that handle the response.
   */
  put(q, headers, body) {
    return this.request(q, 'PUT', headers, body);
  }

  /**
   * Executes a HTTP request according to the given configuration, with 'DELETE' method
   *
   * @param {Object} q The query that will be used in url to perform the HTTP request.
   * @param {Object} headers The headers that will be used in the HTTP request.
   * @param {Object} body The enclosed data for the request.
   * @return {Promise} The promise that handle the response.
   */
  delete(q, headers, body) {
    return this.request(q, 'DELETE', headers, body);
  }
}

export default HTTPAction;
