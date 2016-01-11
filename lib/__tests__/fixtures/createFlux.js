import should from 'should/as-function';

import Nexus from '../../';
const { Flux, Memory } = Nexus;

async function userExists(userId, flux) {
  try {
    await flux.store('/users/:userId').fetch({ userId });
    return true;
  }
  catch(err) {
    return false;
  }
}

return () => Flux.create({
  actions: [
    Memory.Action.create('/users/create', async function createUser(query, { userId, nickname }, flux) {
      should(userId).be.a.String();
      should(nickname).be.a.String();
      should(await userExists(userId, flux)).be.exactly(false);
      flux.store('/users/:userId').set({ userId }, { nickname });
    }),
    Memory.Action.create('/users/:userId/delete', async function deleteUser({ userId }, params, flux) {
      should(userId).be.a.String();
      should(await userExists(userId, flux)).be.exactly(true);
      flux.store('/users/:userId').delete({ userId });
    }),
  ],
  stores: [
    Memory.Store.create('/users')
      .set(null, {
        'id1': '/users/id1',
        'id2': '/users/id2',
      }),
    Memory.Store.create('/users/:userId')
      .set({ userId: 'id1' }, { nickname: 'Alice' })
      .set({ userId: 'id2' }, { nickname: 'Bob' }),
  ],
});
