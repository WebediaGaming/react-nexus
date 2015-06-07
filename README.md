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

- Define a root component using `@root(createNexus)`. `createNexus` returns a `Promise` for an object mapping to instances of [Nexus Flux](https://github.com/elierotenberg/nexus-flux) clients. Each of these instances abstracts an asynchronous data backend.

- Define components using `@component(getNexusBindings)`. `getNexusBindings` returns an object mapping flux stores to props keys.

- Render the app on the server using `Nexus.renderToString`. It will resolve asynchronously, and return `{ html, data }` where `html` is the fully generated HTML (with dependencies resolved), and `data` a serialization of the prefeteched data so you can serve it to the client.

- On the client, bootstrap your root component using the injected `data`.


Example (using LocalFlux as a placeholder, but you can use SocketIOFlux to use remote stores):

```js
import Nexus from 'react-nexus';

// root component decorator
@Nexus.root(({ data }) => {
  // nexus instanciation can be asynchronous
  return Promise.try(() => {
    // init some flux stores
    const stores = {
      // if the value is already in data, reuse it, otherwise initialize it
      '/counters': data && data['/counters'] || { clicks: 0 },
    };

    const server = new LocalFlux.Server(stores);
    const client = new LocalFlux.Client(server);

    // define some actions
    server.on('action', ({ path, params }) => {
      if(path === '/click') {
        const counters = stores['/counters'];
        counters.set('clicks,' counters.get('clicks') + 1);
        // updates the stores
        server.dispatchUpdate('/counters', counters.commit());
      }
    });

    // define some clean-up logic
    const lifespan = new Lifespan();
    lifespan.onRelease(() => {
      client.lifespan.release();
      server.lifespan.release();
    });

    const nexus = { local: client };
    // export the nexus and a lifespan object to clean things up later
    return { nexus, lifespan };
  });
})
// component decorator
@Nexus.component(() => ({
  // bind the 'counters' props to the '/counter' store of the 'local' flux
  // provide a default value in case fetching fails somehow
  counters: ['local://counters', { clicks: NaN }],
}))
class App extends React.Component {
  static propTypes = {
    nexus: React.PropTypes.object.isRequired,
    counters: Nexus.PropTypes.Immutable.Map,
  };

  click() {
    const { nexus } = this.props;
    const { local } = nexus;
    local.dispatchAction('/click', {});
  }

  render() {
    const { counters } = this.props;
    const clicks = counters.get('clicks');
    return <button onClick={() => this.click()>
      I have been clicked {clicks} times.
    </button>;
  }
}

// on the server
Nexus.renderToString(<App />)
.then(({ html, data }) => {
  serveHtmlAndDataToClient(html, data);
});

// on the client
React.render(<App data={getInjectedData()} />);
```

### API

The API is very concise. There are only a few core functions and some useful helps.

#### `renderToString(element)`

`element` is a `React.Component` with the `@root` decorator.

Asynchronously renders the App. Returns a `Promise` for `{ html, data }` where `html` is the fully-rendered HTML, and `data` is a serializable object with you can pass to the client (eg. using `<script>` injection).

#### `renderToStaticMarkup(element)`

Exactly like `renderToString`, but generates clean HTML, like `React.renderToStaticMarkup`.

#### `@root(createNexus, defaultRender)`

`React.Component` class decorator.

`createNexus` is function which takes the props of the components, and returns a `Promise` for `{ nexus, lifespan }`. `nexus` is an object mapping flux names to flux clients. `lifespan` should have a `release` method which will be called when the framework is done with your `nexus` so you can clean up after yourself.

`defaultRender` is an optional alternative `render` function (defaulting to a `null`-returning function) to call when attempting to render on the client while `createNexus()` is pending. This can be useful to display a spinning loader for example.

`@root` returns a higher-order component. However, it will transfer all its props (except for the special prop `data`) to the underlying component. It should be used at the top level of a components hierachy, as expected by `renderToString`.

#### `@component(getNexusBindings)`

`React.Component` class decorator.

`getNexusBindings` is a function which takes the props of the component, and returns an object mapping each key to `[storeLocation, defaultValue]` where `storeLocation` takes the form `${fluxName}:/${storeKey}`. For example, `local://route` will map to the `/route` store of the `local` flux. `defaultValue` is an optional value to use when the fetching is pending or has failed.

`@component` returns a higher-order component. However, it will transfer all its props to the underlying component, as well as a special `nexus` property, which you can use to dispatch actions on a particular flux. It should be used on components in a React hierarchy of which the root has the `@root` decorator.

The enhanced component will be passed the values of the bindings as props (using the same keys as the bindings object). Whenever a binding value is updated, the component will receive new props. Whenever the wrapper components props change, the bindings are updated to reflect the new return value of `getNexusBindings`.

This means in particular that you can typecheck fetched values using `propTypes`, as well as react to updates using `componentWillReceiveProps`.

Much like `render`, `getNexusBindings` should be very fast and without side effects, as it will be called multiple times during the lifecycle of a component.

`@component` and `@root` can be applied on the same component, but beware that the order is very important:

```js
// good
@root()
@component()
class ... extends React.Component

// bad
@component()
@root()
class ... extends React.Component
```

#### `PropTypes.Immutable.Map`

Convenient `PropTypes` validator for `Immutable.Map` (delegating to `Immutable.Map.isMap`), to typecheck the results of bindings.

Example:
```js
static propTypes = {
  route: Nexus.PropTypes.Immutable.Map,
}
```

### How to inject data in the client

This is the relatively tricky part, at least if you're not used to ismorphic javascript tricks. One simple solution is to inject the `data` object in the clients' main function using an injected `<script>` tag, as follows:

```js
// --- SERVER PART ---
import jsescape from 'jsesc';

renderToString(<App />)
.then(({ html, data }) => {
  sendToClient(`<html>
    <head>
      ...
    </head>
    <body>
      <div id='AppRoot'>${html}</div>
      <script src='client.js'></script>
      <script>
        (function(data) {
          // startClient is a global exported by client.js
          startClient(data, document.getElementById('AppRoot'));
        })(JSON.parse(${jsescape(JSON.stringify(data))}));
      <script>
    </body>
  </html>`);
});

// --- CLIENT PART ---
window.startClient = (data, node) => React.render(<App data={data} />, node);
```
