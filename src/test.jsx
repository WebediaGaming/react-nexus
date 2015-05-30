import React from 'react';
import LocalFlux from 'nexus-flux/adapters/Local';
import { Remutable } from 'nexus-flux';
import Nexus from '../';
import App from './test/App';

const stores = {
  '/route': new Remutable({
    path: '/home',
  }),
  '/bar': new Remutable({
    mood: 'happy',
  }),
  '/etc': new Remutable({
    foo: 'bar',
  }),
  '/dev/null': new Remutable({
    'void': null,
  }),
};

const localFluxServer = new LocalFlux.Server(stores);
const localFluxClient = new LocalFlux.Client(localFluxServer);

const nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(<App />, nexus)
.then(([html, data]) => {
  console.log(html, data);
  html.should.be.exactly('<div class="App">' +
    '<p>My route is /home and foo is <span>happy</span>.</p>' +
    '<p>The clicks counter is 0. <button>increase counter</button></p>' +
    '<div class="Etc">etc = foo: bar</div>' +
  '</div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': { path: '/home' },
      '/bar': { mood: 'happy' },
      '/etc': { foo: 'bar' },
      '/notFound': void 0,
    },
  }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
})
.catch((err) => {
  throw err;
});
