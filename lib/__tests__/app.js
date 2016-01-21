import React from 'react';
import ReactDOMServer from 'react-dom/server';
const { describe, it } = global;
import should from 'should/as-function';

import App from './fixtures/components/App';
import createFlux from './fixtures/createFlux';

import Nexus from '../';

describe('@root', () => {
  it('prepare App on server', async function test() {
    const flux = createFlux();
    const app = <App flux={flux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).eql(ReactDOMServer.renderToStaticMarkup(
      <div className='App'>
        <ul className='Users'>
          <li>
            <div className='User'>{'Alice'}</div>
          </li>
          <li>
            <div className='User'>{'Bob'}</div>
          </li>
        </ul>
      </div>
    ));
  });
});
