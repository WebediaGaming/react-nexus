import url from 'url';

import Action from '../Action';
import creatable from '../util/creatable';

@creatable
class HTTPAction extends Action {
  constructor(route, httpConfig, dispatch) {
    super(route, (...args) => Reflect.apply(dispatch, this, args));
    this.httpConfig = httpConfig;
  }

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

  post(q, headers, body) {
    return this.request(q, 'POST', headers, body);
  }

  put(q, headers, body) {
    return this.request(q, 'PUT', headers, body);
  }

  delete(q, headers, body) {
    return this.request(q, 'DELETE', headers, body);
  }
}

export default HTTPAction;
