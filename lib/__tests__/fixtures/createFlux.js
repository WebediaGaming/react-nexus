import Nexus from '../../';
const { Flux, Memory, HTTP } = Nexus;

const actionMemory = (...args) => Memory.Action.create(...args);
const actionHTTP = (...args) => HTTP.Action.create(...args);

const storeMemory = (...args) => Memory.Store.create(...args);
const storeHTTP = (...args) => HTTP.Store.create(...args);

function createFlux({ port }) {
  const httpConfig = {
    host: `localhost:${port}`,
    protocol: 'http',
  };
  const flux = Flux.create({
    actions: [
      actionHTTP('/users/create', httpConfig, async function createUser(query, { userName, rank }) {
        await this.post(query || {}, void 0, { userName, rank });
        await flux.store('/users').fetch({}, { ignoreCache: true });
      }),
      actionHTTP('/users/:userId/delete', httpConfig, async function deleteUser({ userId }) {
        await this.delete({ userId });
        await flux.store('/users').fetch({}, { ignoreCache: true });
      }),
      actionHTTP('/users/:userId/update', httpConfig, async function updateUser(query, { userName, rank }) {
        await this.post(query || {}, void 0, { userName, rank });
        await flux.store('/users').fetch({}, { ignoreCache: true });
      }),
      actionMemory('/ui/users/toggle/visibility', async function toggleVisibilityUsers() {
        const previousValue = await flux.store('/ui/users/visibility').fetch({});
        flux.store('/ui/users/visibility').set({}, !previousValue.value);
      }),
    ],
    stores: [
      storeHTTP('/users', httpConfig),
      storeMemory('/ui/users/visibility').set({}, true),
    ],
  });

  return flux;
}

export default createFlux;
