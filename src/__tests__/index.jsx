const { before, after, describe, it } = global;
import _ from 'lodash';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import React from 'react';
import should from 'should/as-function';

Promise.promisifyAll(fs);

import app, { users, authTokens } from './fixtures/app';
import CustomHTTPFlux from './fixtures/fluxes/CustomHTTPFlux';
import CustomLocalFlux from './fixtures/fluxes/CustomLocalFlux';
import Nexus from '../';
import secret from './fixtures/secret';
import User from './fixtures/components/User';

describe('Nexus', () => {
  let server;
  before(() => server = app.listen(8888));
  it('.prepare', (done) => {
    const authToken = 'E47Exd7RdDds';
    const xDebugToken = jwt.sign(Date.now(), secret);
    const http = new CustomHTTPFlux('http://localhost:8888', { additionalHeaders: { 'X-Debug-Token': xDebugToken } });
    const local = new CustomLocalFlux();
    local.set('/authToken', authToken);
    local.set('/fontSize', 12);
    const nexus = { http, local };
    const tree = <Nexus.Context {...nexus}>
      <User userId='CategoricalDude' />
    </Nexus.Context>;
    Nexus.prepare(tree)
    .then(() => {
      return fs.readFileAsync(`${__dirname}/fixtures/expected/Users.html`)
      .then((rawHtml) => rawHtml.toString('utf-8').trim())
      .then((expectedHtml) => {
        const payload = Nexus.toPayload(nexus);
        should(payload).be.a.String();
        const renexus = Nexus.fromPayload(payload, {
          http: CustomHTTPFlux,
          local: CustomLocalFlux,
        });
        should(renexus).be.an.Object();
        should(renexus).have.property('http').which.is.an.instanceOf(CustomHTTPFlux);
        should(renexus).have.property('local').which.is.an.instanceOf(CustomLocalFlux);
        function fetched(path, params) {
          return renexus.http.versions(renexus.http.get(path, params).params);
        }
        function checkFetched(path, params, fn) {
          const versions = fetched(path, params);
          should(versions).be.an.Array().which.has.length(1);
          const [[err, val, date]] = versions;
          should(Date.now() - date).be.within(0, 100);
          should(err || val).have.property('_debug').which.eql({ xDebugToken });
          return fn(err, val, date);
        }
        checkFetched('/users', {}, (err, val) => {
          should(err).be.exactly(null);
          should(val).have.property('items');
          should(val.items).be.eql(users);
        });
        checkFetched('/me', { query: {
          authToken: _.find(authTokens, ({ userId }) =>
            userId === _.find(users, ({ userName }) => userName === 'Frierich Nietzsche').userId).authToken,
        } }, (err, val) => {
          should(err).be.exactly(null);
          should(_.omit(val, '_debug')).be.eql(_.find(users, ({ userName }) => userName === 'Frierich Nietzsche'));
        });
        checkFetched('/error', {}, (err, val) => {
          should(val).be.exactly(null);
          should(_.omit(err, '_debug')).be.eql({ err: 'Unknown route' });
        });
        should(Nexus.lastValueOf(renexus.local.versions('/authToken'))).be.exactly(authToken);
        const html = renderToStaticMarkup(tree);
        should(html).be.exactly(expectedHtml);
        done(null);
      });
    })
    .catch((err) => done(err));
  });
  it('.local.dispatch', (done) => {
    const local = new CustomLocalFlux();
    local.set('/fontSize', 18);
    local.dispatch('set font size', { fontSize: 42 })
    .then(() => {
      should(_.map(local.get('/fontSize').versions(), ([err, val]) => [err, val]))
      .be.eql([[null, 18], [null, 42]]);
      done(null);
    })
    .catch((err) => done(err));
  });
  it('.http.dispatch', (done) => {
    const authToken = 'E47Exd7RdDds';
    const userId = 'b@d_s@nt@';
    const http = new CustomHTTPFlux('http://localhost:8888');
    http.dispatch('follow user', { authToken, userId })
    .then(({ follows }) => {
      should(follows).eql([userId]);
      should(users[1].follows).eql([userId]);
      done(null);
    })
    .catch((err) => done(err));
  });
  after(() => server.close());
});
