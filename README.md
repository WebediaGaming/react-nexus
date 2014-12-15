React Nexus
===========

The ultimate isomorphic React framework.

React is the future, we all know about this. How about we make it the present?
React Nexus adresses several common pitfalls when building real world React-powered websites/webapps.

1. Flux done right (because design and maintanability)
2. Server-side rendering done right (because SEO and Mobile)
3. Async tasks management done right (because animations)
4. Plugins (because everyone loves plugins) [1]

Core means of doing this:

- Streamlined implementation of the Flux architecture
- All component code is isomorphic (it can run on the server, in the browser main thread, and even in a WebWorker)
- Everything that is not isomorphic (global state, current URL, etc) is injected into a serializable, context-based app state

Hence:

- All components can be pure, yay! (debugging heaven)
- Everything can be fully rendered on the server, without PhantomJS/Selenium black magic (SEO & Mobile paradise)

API
===

"Code is self-documenting &copy;" (= docs are WIP)

Staterkit
=========

See the [official react-nexus-starterkit](https://github.com/elierotenberg/react-nexus-starterkit) for a good starting point.

[1]: Without plugins, how the hell do you want to integrate this nasty HelloJS/Twitter/GoogleAnalytics SDK anyway ?
