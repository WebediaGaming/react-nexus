import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import url from 'url';

const HTTP_OK_RANGE = {
  inf: 200,
  sup: 300,
};

async function request(method, pathname, body, opts, urlObj) {
  const href = url.format(_.merge({}, { pathname }, urlObj));
  const init = _.merge({
    method,
    mode: 'cors',
    body: JSON.stringify(body),
  }, opts);
  const res = await fetch(href, init);
  if(res.status < HTTP_OK_RANGE.inf || res.status >= HTTP_OK_RANGE.sup) {
    throw new Error(`HTTPError (code=${res.status}, text=${res.statusText})`);
  }
  return await res.json();
}

export default request;
