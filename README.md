React Nexus
===========

Isomorphic React apps done right. Server-side rendering, data prefetching, SEO for free.

#### Nexus Flux

React Nexus is closely related to [Nexus Flux](https://github.com/elierotenberg/nexus-flux), although Nexus Flux works without React Nexus.

React Nexus takes a webapp, made with React components using Nexus Flux, and orchestrates everything to achieve server-side rendering, data prefetching, SEO and truly isormophic apps for free.

#### What does 'truly isomorphic' mean ?

Truly isomorphic means that your app can actually be rendered on the server. It means in particular that it can fetch data asynchronously, which `React.renderToString` can't achieve on its own. Without React Nexus (or a very closely similar app design), you need to fetch all the data BEFORE rendering the React tree, which means that you need to know, only from the request url at the top level, what data your components will need. This violates the component-oriented design of most React apps. You most likely want to define data dependency at the component level, not the router level. Thats exactly what React Nexus allows you to do.

#### Example

The [React docs](http://facebook.github.io/react/tips/initial-ajax.html) suggest that you perform data fetching in `componentDidMount`. Besides the fact that `componentDidMount` is never called when doing server-side rendering, it wouldn't work anyway: data fetching is asynchronous, and `renderToString` is synchronous. Which means that by the time your HTTP request is resolved, `renderToString` has already returned.

Here's how you would do it using React Nexus:

- Instanciate a [Nexus Flux](https://github.com/elierotenberg/nexus-flux) which abstracts your asynchronous data backend

- Define a component using `Nexus.Mixin` which declares its dependencies in `getNexusBindings`: it will be invoked to perform one-way binding from Nexus Flux stores (which can be remote stores) to the components state.

- Render the app on the server using `Nexus.prerenderApp`

- Respond to the initial request using the generated HTML and the serialized stores.


Example (using LocalFlux as a placeholder, but you can use SocketIOFlux to use remote stores):

```js
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
```


