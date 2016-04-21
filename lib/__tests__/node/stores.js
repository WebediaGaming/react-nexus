const { describe, it, beforeEach, afterEach } = global;
import should from 'should/as-function';
import sinon from 'sinon';

import ApiServer from '../fixtures/ApiServer';

import { HTTPStore, MemoryStore } from '../../';

const API_PORT = 7777;

describe('HTTP.Store', () => {
  describe('#options', () => {
    describe('rewritePath', () => {
      let apiServer = null;

      beforeEach(() => {
        apiServer = new ApiServer({ port: API_PORT });
        return apiServer.startListening();
      });

      afterEach(() => apiServer.stopListening());

      it('should correctly access the server with the rewritten path for any path of the store', async function test() {
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
      });

      it('should correctly access the server with the rewritten path with a query', async function test() {
        const store = HTTPStore.create(
          '/foo/:foo/bar/:bar',
          { protocol: 'http', hostname: 'localhost', port: API_PORT },
          {
            rewritePath({ foo, bar }) {
              return `/echoQuery?foo=${foo}&bar=${bar}`;
            },
          }
        );

        const query = { foo: 'baz', bar: 'qux' };
        const echo = await store.fetch(query);
        should(echo.isResolved()).be.true();
        should(echo.value).be.deepEqual(query);
      });
    });
  });
});

describe('Memory.Store', () => {
  describe('#observe', () => {
    const onChange = sinon.stub().returns();
    it('should initializes and observe memory store correctly', () => {
      const store = MemoryStore.create('/foo/:bar');
      store.observe({ bar: 'bar' }, onChange);
      store.set({ bar: 'bar' }, 'foo');

      sinon.assert.called(onChange);
    });
  });
});
