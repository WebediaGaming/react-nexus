import React from 'react';
import ReactDOMServer from 'react-dom/server';
const { describe, it } = global;

import App from './fixtures/components/App';
import createFlux from './fixtures/createFlux';

import Nexus from '../';

describe('@root', () => {
  it('prepare App on server', async function test() {
    const app = <App createFlux={createFlux} />;
    await Nexus.prepare(app);
    console.warn(ReactDOMServer.renderToStaticMarkup(app));
  });
});
