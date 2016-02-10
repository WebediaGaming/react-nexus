import url from 'url';

import Action from '../Action';
import creatable from '../util/creatable';

@creatable
class HTTPAction extends Action {
  constructor(route, httpConfig, dispatch) {
    super(route, (...args) => Reflect.apply(dispatch, this, args));
    this.httpConfig = httpConfig;
  }

  async request(q, method = 'POST', headers, body) {
    const path = this.toPath(q);
    const { pathname, query } = url.parse(path, false, true);
    const uri = url.format(Object.assign({}, this.httpConfig, { pathname, query }));
    return await fetch(uri, {
      method,
      mode: 'cors',
      headers: Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }, headers),
      body: JSON.stringify(body),
    });
  }

  post(q, headers, body) {
    return this.request(q, 'POST', headers, body);
  }

  put(q, headers, body) {
    return this.request(q, 'PUT', headers, body);
  }

  delete(q, headers, body) {
    return this.request(q, 'PUT', headers, body);
  }
}

export default HTTPAction;
