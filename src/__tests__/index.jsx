import _ from 'lodash';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const { before, after, describe, it } = global;
import should from 'should/as-function';

import app, { users, authTokens } from './fixtures/app';
import User from './fixtures/components/User';
import Nexus from '../';

describe('Nexus', () => {
  let server;
  before(() => server = app.listen(8888));
  it('.prepare', (done) => {
    const context = { http: new Nexus.HTTPFlux('http://localhost:8888') };
    const tree = <Nexus.Context {...context}>
      <User userId='CategoricalDude' />
    </Nexus.Context>;
    Nexus.prepare(tree)
    .then(() => {
      function fetched(path, params) {
        return context.http.values(context.http.get(path, params).params);
      }
      function checkFetched(path, params, fn) {
        const values = fetched(path, params);
        should(values).be.an.Array().which.has.length(1);
        const [[err, res, date]] = values;
        should(date).be.an.instanceOf(Date);
        return fn(err, res, date);
      }
      checkFetched('/users', { refreshEvery: 5000 }, (err, res) => {
        should(err).be.exactly(void 0);
        should(res).be.eql(users);
      });
      checkFetched('/me', { query: {
        authToken: _.find(authTokens, ({ userId }) =>
          userId === _.find(users, ({ userName }) => userName === 'Frierich Nietzsche').userId).authToken,
      } }, (err, res) => {
        should(err).be.exactly(void 0);
        should(res).be.eql(_.find(users, ({ userName }) => userName === 'Frierich Nietzsche'));
      });
      checkFetched('/error', {}, (err, res) => {
        should(err).be.a.String().containEql('Not Found');
        should(res).be.exactly(void 0);
      });
      const html = renderToStaticMarkup(tree);
      should(html).be.a.String();
      done(null);
    })
    .catch((err) => done(err));
  });
  after(() => server.close());
});
