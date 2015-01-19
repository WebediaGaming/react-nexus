import Nexus from '../';
import React from 'react';
import LocalFlux from 'nexus-flux/adapters/Local';

const div = React.createFactory('div');

const AppRootClass = React.createClass({
  mixins: [Nexus.Mixin],

  getNexusBindings(props) {
    return {
      route: [this.getNexus().local, '/route'],
    };
  },

  render() {
    return div(null, 'My route is ', this.state ? this.state.route.get('path') : null);
  },
});

const AppRoot = React.createFactory(AppRootClass);

const localFluxServer = new LocalFlux.Server();
const localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store('/route', localFluxServer.lifespan).set('path', '/home').commit();

const nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(AppRoot(), nexus)
.then(([html, data]) => {
  html.should.be.exactly('<div>My route is /home</div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({ local: { '/route': { path: '/home' }}}));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
});
