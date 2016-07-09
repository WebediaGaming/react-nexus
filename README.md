# React Nexus 4
*Page still in development.*

## Minimal React Nexus boilerplate
```js
const flux = createFlux();
const app = <App flux={flux} />;
await Nexus.prepare(app);
ReactDOMServer.renderToStaticMarkup(app);
```

## 1. Flux creation
- A flux contains **stores** and **actions**.
- There are two implementations for stores and actions: **HTTP** and **Memory**.

#### Create your Memory Flux
```js
Flux.create({
  actions: [
    action('changeStatus'), async function changeStatus(status) {
      // change user status
    },
    action('setAge'), async function setAge(age) {
      // set user age
    },
  ]
  stores: [
    store('channels').set({}, {
      'public': 'channels/public',
    })
  ]
});
```

#### Create your HTTP Flux
```js
Flux.create({
  actions: [
    action('/user/create'),
    action('/user/:id/delete'),
  ]
  stores: [
    store('/users'),
  ]
});
```

## 2. Create Root Component
This component will receive the builded `Flux`. This should be done by decorating the component with `root()` method:
```js
root()(class App extends React.Component {
  render() {
    return <div></div>;
  }
});
```

## 3. Add Flux' dependencies on components
By decorating each component with `deps()` method:​
```js
export default deps(({ userId }) => ({
  actions: {
    deleteUser: '/delete/${userId}/delete', // HTTP action
    changeStatus: 'changeStatus', // memory action
  },
  stores: {
    users: '/users', // HTTP store
    channels: 'channels', // memory store
  },
}))
(class Users extends React.Component {
  render() {
    if(users.isPending()) {
      return <div className='User pending'>
        {'Loading...'}
      </div>;
    }
    if(users.isRejected()) {
      return <div className='User rejected'>
        {'Error: '}{users.reason}
      </div>;
    }
    return <ul>
      users.value.map((user) => <li>user</li>);
    </ul>;
  }
});
```

Or by decorating directly with `stores` (or `actions`):
```js
export default stores(({ userId }) => ({
  users: '/users',
}))
(class Users extends React.Component {
  render() {
    if(users.isPending()) {
      return <div className='User pending'>
        {'Loading...'}
      </div>;
    }
    if(users.isRejected()) {
      return <div className='User rejected'>
        {'Error: '}{users.reason}
      </div>;
    }
    return <ul>
      users.value.map((user) => <li>user</li>);
    </ul>;
  }
});
```

## 4. Prepare Root Component
`prepare` method recursively browses the root component, looking for child components wrapped by `deps()` method. This method may contains actions and stores references. These stores and actions are injected as component *props*. Stores are beforehand fetched by *React Nexus*.

## 5. Constructs HTML component
By applicating `React.renderToString` on root component.

## Selenium's Tests

### Pre-requisites:

Selenium's config will run tests with 2 default browsers:

- Chrome
- Firefox

So you have to install both browser or change the following configuration:

- `/config/wdio/${env}/wdio.config.js`

```js
capabilities: [{
  browserName: '${browser1}',
}, {
  browserName: '${browser2}',
}],
```

You can check [platform-configurator](https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/) to configure your own platform.


In order to perform tests with Selenium, just run the automated test :
```bash
gulp test-selenium
```

### Tips

If you want run selenium headlessly, on linux you can use `xvfb` as:
```bash
xvfb-run --server-args="-screen ${screenNumber}, ${pixels}" gulp test-selenium
# xvfb-run --server-args="-screen 0, 1366x768x24" gulp test-selenium
```
