import React from 'react';
import ReactDOMServer from 'react-dom/server';
const { describe, it } = global;
import should from 'should/as-function';

import App from '../../__tests__/fixtures/components/App';
import createFlux from './fixtures/createFlux';
import createServer from './fixtures/createServer';

import Nexus from '../../';

describe('@root', () => {
  it('prepare App on server', async function test() {
    const port = 9000;
    const server = createServer();
    try {
      await server.listenAsync(port);
      const flux = createFlux({ port });
      const app = <App flux={flux} />;
      await Nexus.prepare(app);
      should(ReactDOMServer.renderToStaticMarkup(app)).eql(ReactDOMServer.renderToStaticMarkup(
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
});
