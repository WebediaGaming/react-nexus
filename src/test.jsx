import Nexus from '../';
import React from 'react';
import LocalFlux from 'nexus-flux/adapters/Local';

const Nested = React.createClass({
  mixins: [Nexus.Mixin],

  getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo]
    };
  },

  render() {
    const { bar } = this.state;
    return <span>{bar ? bar.get('mood') : null}</span>;
  },
});

const App = React.createClass({
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
      clicks: 0,
    };
  },

  click() {
    this.setState({ clicks: this.state.clicks + 1 });
  },

  render() {
    const { route, notFound, foo, clicks } = this.state;
    return <div className='App'>
      <p>My route is {route ? route.get('path') : null} and foo is <Nested foo={foo} />.</p>
      <p>The clicks counter is {clicks}. <button onClick={this.click}>increase counter</button></p>
    </div>;
  },
});

const localFluxServer = new LocalFlux.Server();
const localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store('/route', localFluxServer.lifespan).set('path', '/home').commit();
localFluxServer.Store('/bar', localFluxServer.lifespan).set('mood', 'happy').commit();
localFluxServer.Store('/dev/null', localFluxServer.lifespan).set('void', null).commit();

const nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(<App />, nexus)
.then(([html, data]) => {
  console.log(html, data);
  html.should.be.exactly('<div class="App"><p>My route is /home and foo is <span>happy</span>.</p><p>The clicks counter is 0. <button>increase counter</button></p></div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': { path: '/home' },
      '/bar': { mood: 'happy' },
      '/notFound': void 0,
    },
  }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
})
.catch((err) => {
  throw err;
});
