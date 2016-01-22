import Nexus from '../../../';
const { Flux } = Nexus;
import HTTP from '../../';

function createFlux({
  protocol = 'http',
  hostname = 'localhost',
  port,
} = {}) {
  const httpConfig = { protocol, hostname, port };
  const action = (...args) => HTTP.Action.create(...args, httpConfig);
  const store = (...args) => HTTP.Store.create(...args, httpConfig);
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
