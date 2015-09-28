import React from 'react';
const { before, after, describe, it } = global;

import app from './fixtures/app';
import User from './fixtures/components/User';
import Nexus from '../';
import HTTPFlux from './fixtures/fluxes/HTTPFlux';

describe('Nexus', () => {
  let server;
  before(() => server = app.listen(8888));
  it('.prepare', (done) => {
    const context = { http: new HTTPFlux('http://localhost:8888') };
    Nexus.prepare(<Nexus.Context {...context}>
      <User userId='CategoricalDude' />
    </Nexus.Context>)
    .then((res) => {
      console.warn(JSON.stringify(context.http.serialize(), null, 2));
      done(null, res);
    })
    .catch((err) => done(err));
  });
  after(() => server.close());
});
