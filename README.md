ES6 Starterkit
==============

The future is today!

#### Usage

1. Fork or clone this repository.
2. (Optional) Edit `package.json` if you intent to publish your package on `npm`.
3. `npm install` to install all the required dependencies from `npm`.
4. Hack `src/index.js`.
5. Build/rebuild using `gulp`.
6. Don't forget to edit this `README.md` file.

#### Features

- Sanely configured `gulpfile.js`, `package.json`, `.gitignore`, `.editorconfig` and `.jshintrc`.
- ES6 code from the `src` folder is transpiled into ES5 code in the `dist` folder via `babel`.
- Both CommonJS and ES6 modules are supported.
- Several modules and variables are automatically injected in each module at transpile time. Check (and edit) `__prelude.js`.
- `__DEV__` and `__PROD__` are boolean constants reflecting `process.env.NODE_ENV`. Best friends with `envify` and `uglify`.
- `__BROWSER__` and `__NODE__` are boolean constants trying hard to reflect whether the code runs in the browser (via browserify/webpack) or in a NodeJS env.
- `bluebird` implementation of `Promise` is injected into global scope, since its is so neat and it outperforms native `Promise`.
- `should` is injected into each module, so you can do development-time assertions that are skipped in production, eg. `if(__DEV__) { n.should.be.a.Number; }`.
- `_` (`lodash`) is also injected into each module.

#### License

MIT [Elie Rotenberg](http://elie.rotenberg.io) <[elie@rotenberg.io](mailto:elie@rotenberg.io)>
