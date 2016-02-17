const { describe, it } = global;
import should from 'should/as-function';

import ApiServer from '../fixtures/ApiServer';

import { HTTPStore } from '../../';

const API_PORT = 7777;

describe('HTTP.Store', () => {
  describe('#options', () => {
    describe('rewritePath', () => {
      it('should correctly access the server with the rewritten path for any path of the store', async function test() {
        const apiServer = new ApiServer({ port: API_PORT });
        await apiServer.startListening();
        try {
          const store = HTTPStore.create(
            '/test/users/:userId/custom/path',
            { protocol: 'http', hostname: 'localhost', port: API_PORT },
            {
              rewritePath({ userId }) {
                return `/users/${userId}`;
              },
            }
          );

          const user1Info = await store.fetch({ userId: '1' });
          should(user1Info.isResolved()).be.true();
          should(user1Info.value).be.deepEqual({ userId: 1, userName: 'Martin', rank: 'Gold' });

          const user2Info = await store.fetch({ userId: '2' });
          should(user2Info.isResolved()).be.true();
          should(user2Info.value).be.deepEqual({ userId: 2, userName: 'Matthieu', rank: 'Silver' });
        }
        finally {
          return await apiServer.stopListening();
        }
      });
    });
  });
});
