import Nexus from '../';
import React from 'react';
import LocalFlux from 'nexus-flux/adapters/Local';

const div = React.createFactory('div');
const p = React.createFactory('p');

const NestedClass = React.createClass({
  mixins: [Nexus.Mixin],

  getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo]
    };
  },

  render() {
    return p(null, this.state.bar.get('mood'));
  },
});

const Nested = React.createFactory(NestedClass);

const AppRootClass = React.createClass({
  mixins: [Nexus.Mixin],

  getNexusBindings(props) {
    return {
      route: [this.getNexus().local, '/route'],
      notFound: [this.getNexus().local, '/notFound'],
    };
  },

  getInitialState() {
    return {
      foo: '/bar',
    };
  },

  render() {
    return div(null, 'My route is ', this.state.route ? this.state.route.get('path') : null, ' and foo is ', Nested({ foo: this.state.foo }));
  },
});

const AppRoot = React.createFactory(AppRootClass);

const localFluxServer = new LocalFlux.Server();
const localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store('/route', localFluxServer.lifespan).set('path', '/home').commit();
localFluxServer.Store('/bar', localFluxServer.lifespan).set('mood', 'happy').commit();
localFluxServer.Store('/dev/null', localFluxServer.lifespan).set('void', null).commit();

const nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(AppRoot(), nexus)
.then(([html, data]) => {
  console.log(html, data);
  html.should.be.exactly('<div>My route is /home and foo is <p>happy</p></div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': { path: '/home' },
      '/bar': { mood: 'happy' },
      '/notFound': void 0,
    },
  }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
});
