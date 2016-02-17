import url from 'url';

import fetch from 'isomorphic-fetch';

import { Flux, MemoryStore, HTTPStore, Action } from '../../';

const action = (...args) => Action.create(...args);
const storeMemory = (...args) => MemoryStore.create(...args);
const storeHTTP = (...args) => HTTPStore.create(...args);

async function request(httpConfig, method, pathname, data) {
  const uri = url.format(
    Object.assign(
      {},
      httpConfig,
      { pathname },
    )
  );
  return await fetch(uri, {
    method,
    mode: 'cors',
    headers: Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, httpConfig.headers),
    body: JSON.stringify(data),
  });
}

function createFlux({ port }) {
  const httpConfig = {
    host: `localhost:${port}`,
    protocol: 'http',
  };
  return Flux.create({
    actions: [
      action('/users/create', async function createUser(flux, query, { userName, rank }) {
        await request(httpConfig, 'POST', `/users/create`, { userName, rank });
        await flux.store('/users').fetch({});
      }),
      action('/users/:userId/delete', async function deleteUser(flux, { userId }) {
        await request(httpConfig, 'DELETE', `/users/${userId}/delete`);
        await flux.store('/users').fetch({});
      }),
      action('/users/:userId/update', async function updateUser(flux, query, { userName, rank }) {
        await request(httpConfig, 'POST', `/users/${query.userId}/update`, { userName, rank });
        await flux.store('/users').fetch({});
      }),
      action('/ui/users/toggle/visibility', async function toggleVisibilityUsers(flux) {
        const previousValue = await flux.store('/ui/users/visibility').fetch({});
        flux.store('/ui/users/visibility').set({}, !previousValue.value);
      }),
    ],
    stores: [
      storeHTTP('/users', httpConfig),
      storeMemory('/ui/users/visibility').set({}, true),
    ],
  });
}

export default createFlux;
