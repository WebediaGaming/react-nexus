React Nexus
===========

Isomorphic React apps done ~~right~~ well. Server-side rendering, data prefetching, SEO for free.

### Nexus Flux

React Nexus is closely related to [Nexus Flux](https://github.com/elierotenberg/nexus-flux), although Nexus Flux works without React Nexus.

React Nexus takes a webapp, made with React components using Nexus Flux, and orchestrates everything to achieve server-side rendering, data prefetching, SEO and truly isormophic apps for free.

### What does 'truly isomorphic' mean ?

Truly isomorphic means that your app can actually be rendered on the server. It means in particular that it can fetch data asynchronously, which `React.renderToString` can't achieve on its own. Without React Nexus (or a very closely similar app design), you need to fetch all the data BEFORE rendering the React tree, which means that you need to know, only from the request url at the top level, what data your components will need. This violates the component-oriented design of most React apps. You most likely want to define data dependency at the component level, not the router level. Thats exactly what React Nexus allows you to do.

### Example

The [React docs](http://facebook.github.io/react/tips/initial-ajax.html) suggest that you perform data fetching in `componentDidMount`. Besides the fact that `componentDidMount` is never called when doing server-side rendering, it wouldn't work anyway: data fetching is asynchronous, and `renderToString` is synchronous. Which means that by the time your HTTP request is resolved, `renderToString` has already returned.

Here's how you would do it using React Nexus:

- Instanciate a [Nexus Flux](https://github.com/elierotenberg/nexus-flux) which abstracts your asynchronous data backend

- Define a component class enhanced with `Nexus.bind`, which declares its dependencies in `getNexusBindings`. The bindings will be automatically resolved and kept up to date, and injected back in the props of the component.

- Render the app on the server using `Nexus.prerenderApp`

- Respond to the initial request using the generated HTML and the serialized stores.


Example (using LocalFlux as a placeholder, but you can use SocketIOFlux to use remote stores):

```js
const App = Nexus.bind(class extends React.Component {
  getNexusBindings(props) {
    return {
      route: ['local', '/route', Immutable.Map({ path: 'unknown' })],
    };
  }

  render() {
    return <div>`My route is ${this.props.route.get('path')}`</div>;
  }
})

// alternate syntax
const App = Nexus.bind(class extends React.Component {
  render() {
    return <div>`My route is ${this.props.route.get('path')}`</div>;
  }
}, (props) => ({
  route: ['local', '/route', Immutable.Map({ path: 'unknown' })],
}));

// decorator syntax
@Nexus.inject((props) => ({
  route: ['local', '/route', Immutable.Map({ path: 'unknown' })],
})))
class App extends React.Component {
  render() {
    return <div>`My route is ${this.props.route.get('path')}`</div>;
  }
}

const localFluxServer = new LocalFlux.Server();
const localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store('/route', localFluxServer.lifespan)
  .set('path', '/home')
.commit();

// A nexus object is just a map of Nexus Flux clients
const nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(<App />, nexus)
.then(([html, data]) => {
  html.should.be.exactly('<div>My route is /home</div>');
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: { '/route': { path: '/home' }}
  }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
});
```

### Full API documentation

#### `Nexus.prerenderApp(element: React.Element, nexus: Object): Promise`

Asynchronously pre-renders the given React Element. Returns a `Promise` for an 2-element array `[html, data]` containing the generated HTML and the prefetched data in POJO form.
Analogous to `React.renderToString`.

#### `Nexus.prerenderAppToStaticMarkup(element: React.Element, nexus: Object)`

Similar to `Nexus.prerenderApp`, but strips out React-specific markup. Analogous to `React.renderToStaticMarkup`.

#### `Nexus.mountApp(element: React.Element, nexus: Object, data: Object, domNode: DOMNode)`

Synchronously mounts the given React Element, and starts the asynchronous prefetching/reconciling of each bindings in the hierarchy.
Analogous to `React.render`.

#### `Nexus.bind(Component: React.Component, [getNexusBindings(props: Object): Object], [displayName: String])`

Enhances the given React Component class with Nexus bindings. The `getNexusBindings` function can be either passed as the 2nd parameter, or defined or the prototype of `Component`, whichever you find more convenient. The returned component will maintain bindings with the underlying Nexus Flux stores, ie. its props will be updated everytime the underlying Nexus Flux stores are updated.

Bindings can depend on props (provided as the single argument of `getNexusBindings`). Similarly to `render`, `getNexusBindings` should be fast and without side-effects, since it will be called multiple times during the lifecycle of the component.

`getNexusBindings` must return an Object mapping each `key` with a `[fluxName, storeName, defaultValue = void 0]` triplet. `flux` is a Nexus Flux instance, `storeName` is the name of the bound store, and `storeKey` is the key of the value to be bound. `defaultValue` is an optional default value, which will be passed as props for this key until the store is actually fetched (useful for distinguishing stores containing `void 0` with unresolved bindings). `defaultValue` is automatically wrapped with `Immutable.Map` so you can pass POJOs as default values;

#### `@Nexus.inject([getNexusBindings(props: Object): Object], [displayName: String])`

React Component decorator with the same effect as calling `Nexus.bind` on it.

#### `Nexus.Injector: React.Component`

Special React component which performs data-binding for you. Its props are interpreted as bindings, and passed to its child function. See the example below.

Example:
```js
<Injector {route=['local', '/route']}>
  {({ route }) => <MyComponent route={route} />}
</Injector>
```

You can't pass <MyComponent> directly because the evaluation of React Elements are not lazy in React.

#### `Nexus.PropTypes.Immutable.Map`

Convenient `PropTypes` validator for `Immutable.Map` (delegating to `Immutable.Map.isMap`), to typecheck the results of bindings.

Example:
```js
static propTypes = {
  route: Nexus.PropTypes.Immutable.Map,
}
```
