import _ from 'lodash';
import should from 'should/as-function';

import { Flux, MemoryAction, MemoryStore } from '../../';

const action = (...args) => MemoryAction.create(...args);
const store = (...args) => MemoryStore.create(...args);

function createFlux() {
  const flux = Flux.create({
    actions: [
      action('/users/create', async function createUser(query, { userId, nickname }) {
        should(userId).be.a.String();
        should(nickname).be.a.String();
        const users = (await flux.store('/users').fetch({})).value;
        should(users).not.have.ownProperty(userId);
        flux.store('/users/:userId').set({ userId }, { nickname });
        flux.store('/users').set({}, _.assign({}, users, { [userId]: `/users/${userId}` }));
      }),
      action('/users/:userId/delete', async function deleteUser({ userId }) {
        should(userId).be.a.String();
        const users = (await flux.store('/users').fetch({})).value;
        should(users).have.ownProperty(userId);
        flux.store('/users/:userId').delete({ userId });
        flux.store('/users').set({}, _.omit(users, userId));
      }),
      action('/users/:userId/update', async function updateUser({ userId }, { nickname }) {
        should(userId).be.a.String();
        const users = (await flux.store('/users').fetch({})).value;
        should(users).have.ownProperty(userId);
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

  return flux;
}

export default createFlux;
