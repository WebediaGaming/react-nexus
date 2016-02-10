import {
  Flux,
  HTTPAction,
  HTTPStore,
} from '../../..';

function createFlux({
  protocol = 'http',
  hostname = 'localhost',
  port,
} = {}) {
  const httpConfig = { protocol, hostname, port };
  const action = (...args) => HTTPAction.create(...args, httpConfig, async function dispatch(query, params) {
    return await this.post(query, {}, params);
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
