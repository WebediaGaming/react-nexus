import fetch from 'isomorphic-fetch';
import url from 'url';
import { Flux, HTTPStore, Action } from '../../../';

function createFlux({
  protocol = 'http',
  hostname = 'localhost',
  port,
} = {}) {
  const httpConfig = { protocol, hostname, port };
  const action = (route) => Action.create(route, async function dispatch(flux, query, params) {
    const pathname = flux.action(route).toPath(query);
    const requestUrl = url.format({ protocol, hostname, port, pathname });
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    };
    if(params) {
      requestOptions.body = JSON.stringify(params);
      requestOptions.headers = Object.assign(requestOptions, {
        'Content-Type': 'application/json',
      });
    }
    return await fetch(requestUrl, requestOptions);
  });
  const store = (...args) => HTTPStore.create(...args, httpConfig);
  const flux = Flux.create({
    actions: [
      action('/users/create'),
      action('/users/:userId/delete'),
      action('/users/:userId/update'),
    ],
    stores: [
      store('/users'),
      store('/users/:userId'),
    ],
  });

  return flux;
}

export default createFlux;
