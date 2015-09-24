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
            <div className='User'>{'Alice'}<button>{'X'}</button></div>
          </li>
          <li>
            <div className='User'>{'Bob'}<button>{'X'}</button></div>
          </li>
        </ul>
      </div>
    ));
  });
  it('dispatches Actions', async function test() {
    const flux = createFlux();
    await flux.dispatchAction('/users/id1/delete', {});
    await flux.dispatchAction('/users/create', { userId: 'id3', nickname: 'Charlie' });
    await flux.dispatchAction('/users/id3/update', { nickname: 'Carol' });
    const app = <App flux={flux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).eql(ReactDOMServer.renderToStaticMarkup(
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
  });
  it('serializes and unserializes state', async function test() {
    const flux = createFlux();
    await flux.dispatchAction('/users/id1/delete', {});
    await flux.dispatchAction('/users/create', { userId: 'id3', nickname: 'Charlie' });
    await flux.dispatchAction('/users/id3/update', { nickname: 'Caligula' });
    const json = JSON.stringify(flux.dumpState());
    const reflux = createFlux().loadState(JSON.parse(json));
    const app = <App flux={reflux} />;
    await Nexus.prepare(app);
    should(ReactDOMServer.renderToStaticMarkup(app)).eql(ReactDOMServer.renderToStaticMarkup(
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
  });
});
