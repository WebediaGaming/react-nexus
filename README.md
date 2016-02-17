This package is a simple general-purpose starterkit.

It provides a sane directory structure, and pre-wired gulp tasks including:
- linting with eslint and rules based on the coding styles
- transpiling with babel (see below) with appropriate presets for usage in the browser, and in node (with unnecessary transforms removed),
- bundling with webpack, for usage in the browser or in node.

By default, 4 bundles are produced when running `gulp`:

- `browser-dev`: package is transpiled using strict mode transforms, and bundled with `eval-source-map` and all debug flags,
- `browser-prod`: package is transpiled using loose-mode transforms (when appropriate), and bundled with `inline-source-maps`, and then minified using `uglifyjs2`.
- `node-dev`: package is transpiled using strict mode transforms, without the transforms not required by node `^5.0.0`, and bundled with `eval-source-map` and all debug flags,
- `node-prod`: package is transpiled using loose-mode transforms (when appropriate), without the transforms not required by node `^5.0.0`, and bundled with `inline-source-maps`, and then minified using `uglifyjs2`.

`package.json` sets the `private` flag to true by default. To actually publish your library, carefully edit `package.json`
to proper configuration and remove the `private` flag.

Several non-standard `babel` transforms are enabled by default, including:
- `decorators`,
- `class-properties`,
- `jsx`,
- `react-inline-elements` and `react-constant-elements` only in the dev builds,
- `object-rest-spread`,
- `async-functions`,
- `async-generators`,
- `exponentiation-operator`,
- `trailing-function-commas`.

Several other general-purpose libraries are also included by default, which you can of course remove if you don't want them:
- `lodash`,
- `bluebird`.

Test are pre-wired to use `mocha` and `should` but are very easy to replace.

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
