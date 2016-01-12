import React from 'react';
const { describe, it } = global;

import App from './fixtures/components/App';
import createFlux from './fixtures/createFlux';

import Nexus from '../';

describe('@root', () => {
  it('prepare App on server', async function test() {
    const app = <App createFlux={createFlux} />;
    await Nexus.prepare(app);
    React.renderToStaticMarkup(app);
  });
});
