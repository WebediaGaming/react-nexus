WORK IN PROGRESS - DONT USE!


React on Rails
===========

React on Rails (`R` in the code) is a real-world webapp thin framework upon React. It fully embraces the React paradigm and implements
many useful programmatic tools and mixins to do things the React way all along.

React on Rails means to provide all you need to never need again to hack into React yourself, and instead fully enjoy its power and neatness
to build things that work outside of `todolist.js`.

Core principles:
- Neatness should not cost performance, it should improve it.
- Server-side rendering and efficient data-fetching are mandatory for real-world apps.
- Data must always flow. Non-private data should always be conceived as by the leafiers immutable and mutable by the rootiers.
- Components are pure relatively to 3 sources of ground truth: props, state, and flux, which consists in tree-global, controlled stores and event emitters.
- Stores and Dispatchers are asynchronous by default. This way the flux can be backed by a remote backend, not only a local, in-memory backend.
- Components initialization can be asynchronous, but once they have rendered once, they must be kept consistent synchronously.
- Data-backend-agnostic; you should be able to roll whichever complex, real-world resilient data backend you wish.

What React on Rails provides:
- Structure and guidelines for architecturing your app
- Efficient implementation of commonly needed primitives and patterns
- Full-blown frontend, with cacheable and load-balancable server-side SEO/performance-friendly prerendering

What React on Rails doesn't provide:
- Strict checking that you will follow the guidelines
- Support for non-recommended patterns (non-pure components, integration with jQuery, etc)
- Data backend implementation (although it integrates very well with commonly used backends patterns)

Contents
========

- `R.utils`: global utilities, such as `R.isServer`/`R.isClient` or `R.scope`, a lightweight version of `Function.prototype.bind`.
- `R.Debug`: debugging utilities, to avoid length try/catch in production while developing safely.
- `R.Decorate`: Functional decoration.
- `R.Descriptor`: lightweight representation and manipulation of React Component Descriptors, to perform tree walking/transformations.
- `R.Query`: utility functions on top of R.Descriptor. `$` for React.
- `R.App`: React.createClass wrapper to bootstrap your application with R goodness.
- `R.Component`: React.createClass wrapper to bootstrap your components with R goodness.
- `R.Dependencies`: Declare and manipulate asynchronous dependencies to enable real-world server-side rendering.
- `R.Pure`: Pure components mixin and utilities.
- `R.Async`: Efficiently dealing with asynchronous operations in React Components.
- `R.Animate`: Efficient programmatic animation in React Components. `Velocity` for React.
- `R.Styles`: Sane style management in React components. Includes vendor-prefixing and bundling.
- `R.Store`: Asynchronous Store management in React. Supports local and remote backends.
- `R.EventEmitter`: Asynchronous EventEmitter management in React. Supports local and remote backends.
- `R.Flux`: Asynchronous flux management in React. Supports bootstrapping the flux on either the server (based on the `req`) or the client (based on `window`).
- `R.Router`: Router for an R app.
- `R.Session`: Sessions for an R app.
- `R.Users`: Users/permissions for an R app.

Conventions
===========

- Private variables are prefixed with _. The behaviour of R is undefined if private variables are accessed.
- Read-only variables are decorated with @readOnly. The behaviour of R is undefined if readOnly variables are written.
- All methods (object properties that are Functions) are assumed readOnly unless otherwise explicitly mentionned.
- All Mixin-specific variables are prefixed with _$NameOfTheMixin and are assumed private.
- All Components are assumed Pure.
- All Components are assumed to be create with either R.createAppClass or R.createComponentClass. Don't call React.createClass directly.
- You should pass NODE_ENV=development when developing, and NODE_ENV=production in production. Use envify.
- All code is assumed isomorphic, unless otherwise mentionned. If you need to execute environment-specific code, use R.IfServer or R.IfClient.
- Code in componentDidMount doesn't need to be ismorphic.
- We use generators. Use regenerator or node --harmony.
- Typechecking and other assertions should be wrapped in R.Debug.dev to avoid lengthy try/catch blocks in production.