import should from 'should/as-function';

import Nexus from '../../';
const { Flux, Memory } = Nexus;

async function userExists(userId, flux) {
  try {
    const { status } = await flux.store('/users/:userId').fetch({ userId });
    return status === Flux.Store.State.RESOLVED;
  }
  catch(err) {
    return false;
  }
}

const action = (...args) => Memory.Action.create(...args);
const store = (...args) => Memory.Store.create(...args);

function createFlux() {
  return Flux.create({
    actions: [
      action('/users/create', async function createUser(query, { userId, nickname }, flux) {
        should(userId).be.a.String();
        should(nickname).be.a.String();
        should(await userExists(userId, flux)).be.exactly(false);
        flux.store('/users/:userId').set({ userId }, { nickname });
      }),
      action('/users/:userId/delete', async function deleteUser({ userId }, params, flux) {
        should(userId).be.a.String();
        should(await userExists(userId, flux)).be.exactly(true);
        flux.store('/users/:userId').delete({ userId });
      }),
      action('/users/:userId/update', async function updateUser({ userId }, { nickname }, flux) {
        should(userId).be.a.String();
        should(await userExists(userId, flux)).be.exactly(true);
        flux.store('/users/:userId').set({ userId }, { nickname });
      }),
    ],
    stores: [
      store('/users')
        .set({}, {
          'id1': '/users/id1',
          'id2': '/users/id2',
        }),
      store('/users/:userId')
        .set({ userId: 'id1' }, { nickname: 'Alice' })
        .set({ userId: 'id2' }, { nickname: 'Bob' }),
    ],
  });
}

export default createFlux;
