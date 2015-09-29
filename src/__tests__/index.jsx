import _ from 'lodash';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const { before, after, describe, it } = global;
import should from 'should/as-function';
import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);

import app, { users, authTokens } from './fixtures/app';
import User from './fixtures/components/User';
import CustomHTTPFlux from './fixtures/fluxes/CustomHTTPFlux';
import Nexus from '../';

describe('Nexus', () => {
  let server;
  before(() => server = app.listen(8888));
  it('.prepare', (done) => {
    const authTokenValue = 'E47Exd7RdDds';
    const http = new CustomHTTPFlux('http://localhost:8888');
    const local = new Nexus.LocalFlux();
    local.set('/authToken', authTokenValue);
    local.set('/fontSize', 12);
    const context = { http, local };
    const tree = <Nexus.Context {...context}>
      <User userId='CategoricalDude' />
    </Nexus.Context>;
    Nexus.prepare(tree)
    .then(() => fs.readFileAsync(`${__dirname}/fixtures/expected/Users.html`))
    .then((rawHtml) => rawHtml.toString('utf-8').trim())
    .then((expectedHtml) => {
      function fetched(path, params) {
        return http.versions(http.get(path, params).params);
      }
      function checkFetched(path, params, fn) {
        const versions = fetched(path, params);
        should(versions).be.an.Array().which.has.length(1);
        const [[err, val, date]] = versions;
        should(date).be.an.instanceOf(Date);
        return fn(err, val, date);
      }
      checkFetched('/users', { refreshEvery: 5000 }, (err, val) => {
        should(err).be.exactly(void 0);
        should(val).be.eql(users);
      });
      checkFetched('/me', { query: {
        authToken: _.find(authTokens, ({ userId }) =>
          userId === _.find(users, ({ userName }) => userName === 'Frierich Nietzsche').userId).authToken,
      } }, (err, val) => {
        should(err).be.exactly(void 0);
        should(val).be.eql(_.find(users, ({ userName }) => userName === 'Frierich Nietzsche'));
      });
      checkFetched('/error', {}, (err, val) => {
        should(err).be.a.String().containEql('Not Found');
        should(val).be.exactly(void 0);
      });
      should(Nexus.lastValueOf(local.versions('/authToken'))).be.exactly(authTokenValue);
      const html = renderToStaticMarkup(tree);
      should(html).be.exactly(expectedHtml);
      done(null);
    })
    .catch((err) => done(err));
  });
  after(() => server.close());
});
