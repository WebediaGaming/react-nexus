module.exports = function(R) {
    const React = R.React;
    const _ = R._;
    const Plugin = require('./R.App.Plugin')(R);

    /**
    * <p>Simply create an App class with specifics</p>
    * <p>Provides methods in order to render the specified App server-side and client-side</p>
    * <ul>
    * <li> App.createApp => initializes methods of an application according to the specifications provided </li>
    * <li> App.renderToStringInServer => compute all React Components with data and render the corresponding HTML for the requesting client </li>
    * <li> App.renderIntoDocumentInClient => compute all React Components client-side and establishes a connection via socket in order to make data subscriptions</li>
    * <li> App.createPlugin => initiliaziation method of a plugin for the application </li>
    * </ul>
    * @class R.App
    */
    class App {
      constructor() {
        this.Flux = this.getFluxClass();
        this.Root = this.getRootClass();
        this.RootFactory = React.createFactory(this.Root);
        this.template = this.getTemplate();
        this.Plugins = this.getPluginsClasses();

        _.dev(() => this.Flux.should.be.a.Function &&
          this.Root.should.be.a.Function &&
          this.vars.should.be.an.Object &&
          this.template.should.be.a.Function &&
          this.Plugins.should.be.an.Array
        );
      }

      getFluxClass() { _.abstract(); }

      getRootClass() { _.abstract(); }

      getTemplate() { _.abstract(); }

      getPluginsClasses() { _.abstract(); }

      // Future-proof: might do something with { req, window } at some point
      // of the future.
      *getTemplateVars({ req }) { _.abstract(); } // jshint ignore:line

      prerender(req, res) {
        this.render({ req })
        .then((html) => res.status(200).send(html))
        .catch((err) => {
          let json = { err: err.toString() };
          _.dev(() => _.extend(json, { stack: err.stack }));
          return res.status(500).json(json);
        });
      }

      *render({ req, window }) { // jshint ignore:line
        _.dev(() => _.isServer() ? req.should.be.an.Object : window.should.be.an.Object);
        return _.isServer() ? this._renderInServer(req) : this._renderInClient(window);
      }
      /**
      * <p>Compute all React Components with data server-side and render the corresponding HTML for the requesting client</p>
      * @method renderToStringInServer
      * @param {object} req The classical request object
      * @return {object} template : the computed HTML template with data for the requesting client
      */
      *_renderInServer(req) { // jshint ignore:line
        _.dev(() => _.isServer().should.be.ok &&
          req.headers.should.be.ok
        );

        let guid = _.guid();
        let headers = req.headers;
        let flux = new this.Flux({ guid, headers, req });
        // Register store (R.Store) : UplinkServer and Memory
        // Initializes flux and UplinkServer in order to be able to fetch data from uplink-server
        yield flux.bootstrap(); // jshint ignore:line

        // Initializes plugin and fill all corresponding data for store : Memory
        let plugins = this.Plugins.map((Plugin) => new Plugin({ flux, req, headers }));

        let rootProps = { flux, plugins };
        // Create the React instance of root component with flux
        let surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);
        if(!surrogateRootComponent.componentWillMount) {
          _.dev(() => console.error('Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?'));
        }
        // Emulate React lifecycle
        surrogateRootComponent.componentWillMount();
        yield surrogateRootComponent.prefetchFluxStores();
        surrogateRootComponent.componentWillUnmount();

        /*
        * Render root component server-side, for each components :
        * 1. getInitialState : return prefetched stored data and fill the component's state
        * 2. componentWillMount : simple initialization
        * 3. Render : compute DOM with the component's state
        */
        let rootComponent = this.RootFactory(rootProps);
        let rootHtml;
        flux.injectingFromStores(() => rootHtml = React.renderToString(rootComponent));
        // Serializes flux in order to provides all prefetched stored data to the client
        let serializedFlux = flux.serialize();
        flux.destroy();
        plugins.forEach((plugin) => plugin.destroy());

        let serializedHeaders = _.base64Encode(JSON.stringify(headers));
        return this.template(_.extend({}, yield this.getTemplateVars({ req }), { rootHtml, serializedFlux, serializedHeaders, guid }));
      }

      /**
      * <p>Setting all the data for each React Component and Render it into the client. <br />
      * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
      * @method renderIntoDocumentInClient
      * @param {object} window The classical window object
      */
      *_renderInClient(window) { // jshint ignore:line
        _.dev(() => _.isClient().should.be.ok &&
          window.__ReactNexus.should.be.an.Object &&
          window.__ReactNexus.guid.should.be.a.String &&
          window.__ReactNexus.serializedFlux.should.be.a.String &&
          window.__ReactNexus.serializedHeaders.should.be.a.String &&
          window.__ReactNexus.rootElement.should.be.ok
        );
        _.dev(() => window.__ReactNexus.app = this);
        let headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
        let guid = window.__ReactNexus.guid;
        let flux = new this.Flux({ headers, guid, window });
        _.dev(() => window.__ReactNexus.flux = flux);

        yield flux.bootstrap({ window, headers, guid }); // jshint ignore:line
        flux.unserialize(window.__ReactNexus.serializedFlux);
        let plugins = this.Plugins.forEach((Plugin) => new Plugin({ flux, window, headers }));
        _.dev(() => window.__ReactNexus.plugins = plugins);

        let rootProps = { flux, plugins };
        let rootComponent = this.RootFactory(rootProps);
        _.dev(() => window.__ReactNexus.rootComponent = rootComponent);
        /*
        * Render root component client-side, for each components:
        * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
        * 2. componentWillMount : initialization
        * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
        * Root Component already has this server-rendered markup,
        * React will preserve it and only attach event handlers.
        * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
        */
        flux.injectingFromStores(() => React.render(rootComponent, window.__ReactNexus.rootElement));
      }
    }

    _.extend(App.prototype, /** @lends App.prototype */{
      Flux: null,
      Root: null,
      RootFactory: null,
      template: null,
      Plugins: null,
    });

    _.extend(App, { Plugin });
    return App;
};
