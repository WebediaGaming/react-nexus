import React from 'react';
import ReactDOMServer from 'react-dom/server';
const { describe, it } = global;
import should from 'should/as-function';

import App from '../../__tests__/fixtures/components/App';
import createFlux from './fixtures/createFlux';
import createServer from './fixtures/createServer';

import { prepare, HTTPStore } from '../../';

describe('@root', () => {
  it('prepare App on server', async function test() {
    const port = 29000;
    const server = createServer();
    try {
      await server.listenAsync(port);
      const flux = createFlux({ port });
      const app = <App flux={flux} />;
      await prepare(app);
      should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
        <div className='App'>
          <ul className='Users'>
            <li>
              <div className='User'>{'Alice'}<button>{'X'}</button></div>
            </li>
            <li>
              <div className='User'>{'Bob'}<button>{'X'}</button></div>
            </li>
          </ul>
        </div>
      ));
    }
    finally {
      server.close();
    }
  });
  it('dispatches Actions', async function test() {
    const port = 29001;
    const server = createServer();
    try {
      await server.listenAsync(port);
      const flux = createFlux({ port });
      await flux.dispatchAction('/users/id1/delete', {});
      await flux.dispatchAction('/users/create', { userId: 'id3', nickname: 'Charlie' });
      await flux.dispatchAction('/users/id3/update', { nickname: 'Carol' });
      const app = <App flux={flux} />;
      await prepare(app);
      should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
        <div className='App'>
          <ul className='Users'>
            <li>
              <div className='User'>{'Bob'}<button>{'X'}</button></div>
            </li>
            <li>
              <div className='User'>{'Carol'}<button>{'X'}</button></div>
            </li>
          </ul>
        </div>
      ));
    }
    finally {
      server.close();
    }
  });
  it('serializes and unserializes state', async function test() {
    const port = 29002;
    const server = createServer();
    try {
      await server.listenAsync(port);
      const flux = createFlux({ port });
      await flux.dispatchAction('/users/id1/delete', {});
      await flux.dispatchAction('/users/create', { userId: 'id3', nickname: 'Charlie' });
      await flux.dispatchAction('/users/id3/update', { nickname: 'Caligula' });
      await prepare(<App flux={flux} />);
      const json = JSON.stringify(flux.dumpState());
      const reflux = createFlux().loadState(JSON.parse(json));
      const app = <App flux={reflux} />;
      should(ReactDOMServer.renderToStaticMarkup(app)).be.deepEqual(ReactDOMServer.renderToStaticMarkup(
        <div className='App'>
          <ul className='Users'>
            <li>
              <div className='User'>{'Bob'}<button>{'X'}</button></div>
            </li>
            <li>
              <div className='User'>{'Caligula'}<button>{'X'}</button></div>
            </li>
          </ul>
        </div>
      ));
    }
    finally {
      server.close();
    }
  });
});

describe('HTTP.Store', () => {
  describe('#options', () => {
    describe('rewritePath', () => {
      it('should correctly access the server with the rewritten path for any path of the store', async function test() {
        const port = 29002;
        const server = createServer();
        await server.listenAsync(port);
        try {
          const store = HTTPStore.create(
            '/test/users/:userId/custom/path',
            { protocol: 'http', hostname: 'localhost', port },
            {
              rewritePath({ userId }) {
                return `/users/${userId}`;
              },
            }
          );

          const user1Info = await store.fetch({ userId: 'id1' });
          should(user1Info.isResolved()).be.true();
          should(user1Info.value).be.deepEqual({ nickname: 'Alice' });

          const user2Info = await store.fetch({ userId: 'id2' });
          should(user2Info.isResolved()).be.true();
          should(user2Info.value).be.deepEqual({ nickname: 'Bob' });
        }
        finally {
          server.close();
        }
      });

      it('should correctly access the server with the rewritten path only for a specific path', async function test() {
        const port = 29002;
        const server = createServer();
        await server.listenAsync(port);
        try {
          const store = HTTPStore.create(
            '/test/users/:userId/custom/path',
            { protocol: 'http', hostname: 'localhost', port },
          ).options({ userId: 'id1' }, {
            rewritePath({ userId }) {
              return `/users/${userId}`;
            },
          });

          const user1Info = await store.fetch({ userId: 'id1' });
          should(user1Info.isResolved()).be.true();
          should(user1Info.value).be.deepEqual({ nickname: 'Alice' });

          const user2Info = await store.fetch({ userId: 'id2' });
          should(user2Info.isRejected()).be.true();
        }
        finally {
          server.close();
        }
      });
    });
  });
});
