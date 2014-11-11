module.exports = function(R) {
    const React = R.React;
    const _ = R._;
    const should = R.should;
    const path = require('path');

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
        this.vars = this.getDefaultVars();
        this.template = this.getTemplate();
        this.templateLibs = this.getTemplateLibs();
        this.Plugins = this.getPluginsClasses();

        _.dev(() => this.Flux.should.be.a.Function &&
          this.Root.should.be.a.Function &&
          this.vars.should.be.an.Object &&
          this.template.should.be.a.Function &&
          this.templateLibs.should.be.an.Object &&
          this.Plugins.should.be.an.Array
        );
      }

      getFluxClass() { _.abstract(); }

      getRootClass() { _.abstract(); }

      getDefaultVars() { _.abstract(); }

      getTemplate() { _.abstract(); }

      getTemplateLibs() { _.abstract(); }

      getPluginsClasses() { _.abstract(); }

      getTemplateVars({ req }) { _.abstract(); }

      render({ req, window }) {
        _.dev(() => _.isServer() ? req.should.be.an.Object : window.should.be.an.Object);
        return _.isServer() ? this._renderInServer(req) : this._renderInClient(window);
      }
      /**
      * <p>Compute all React Components with data server-side and render the corresponding HTML for the requesting client</p>
      * @method renderToStringInServer
      * @param {object} req The classical request object
      * @return {object} template : the computed HTML template with data for the requesting client
      */
      _renderInServer(req) {
        return _.copromise(function*() {
          _.dev(() => _.isServer().should.be.ok &&
            req.headers.should.be.ok
          );

          let guid = _.guid();
          let headers = req.headers;
          let flux = new this.Flux({ guid, headers, req });
          //Register store (R.Store) : UplinkServer and Memory
          //Initializes flux and UplinkServer in order to be able to fetch data from uplink-server
          yield flux.bootstrap();

          //Initializes plugin and fill all corresponding data for store : Memory
          let plugins = this.Plugins.map((Plugin) => new Plugin({ flux, req }));

          let rootProps = { flux, plugins };
          //Create the React instance of root component with flux
          let surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);
          if(!surrogateRootComponent.componentWillMount) {
            _.dev(() => console.error('Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?'));
          }
          surrogateRootComponent.componentWillMount();
          yield surrogateRootComponent.prefetchFluxStores();
          surrogateRootComponent.componentWillUnmount();

          let rootComponentFactory = React.createFactory(this.Root);
          let rootComponent = rootComponentFactory(rootProps);
          flux.startInjectingFromStores();

          /*
          * Render root component server-side, for each components :
          * 1. getInitialState : return prefetched stored data and fill the component's state
          * 2. componentWillMount : simple initialization
          * 3. Render : compute DOM with the component's state
          */
          let rootHtml = React.renderToString(rootComponent);
          flux.stopInjectingFromStores();
          //Serializes flux in order to provides all prefetched stored data to the client
          let serializedFlux = flux.serialize();
          flux.destroy();
          plugins.forEach((plugin) => plugin.destroy());

          let vars = _.extend({}, yield this.getTemplateVars({ req }), this.vars);
          let serializedHeaders = _.base64Encode(JSON.stringify(headers));
          return this.template({ vars, rootHtml, serializedFlux, serializedHeaders, guid }, this.templateLibs);

        }, this);
      }

      /**
      * <p>Setting all the data for each React Component and Render it into the client. <br />
      * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
      * @method renderIntoDocumentInClient
      * @param {object} window The classical window object
      */
      _renderInClient(window) {
        return _.copromise(function*() {
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

          yield flux.bootstrap({ window, headers, guid });
          flux.unserialize(window.__ReactNexus.serializedFlux);
          let plugins = this.Plugins.forEach((Plugin) => new Plugin({ flux, window }));
          _.dev(() => window.__ReactNexus.plugins = plugins);

          let rootProps = { flux, plugins };
          let rootComponentFactory = React.createFactory(this.Root);
          let rootComponent = rootComponentFactory(rootProps);
          _.dev(() => window.__ReactNexus.rootComponent = rootComponent);
          flux.startInjectingFromStores();
          /*
          * Render root component client-side, for each components:
          * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
          * 2. componentWillMount : initialization
          * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
          * Root Component already has this server-rendered markup,
          * React will preserve it and only attach event handlers.
          * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
          */
          React.render(rootComponent, window.__ReactNexus.rootElement);
          flux.stopInjectingFromStores();
        }, this);
      }

    }

    _.extend(App.prototype, /** @lends App.prototype */{
      fluxClass: null,
      rootClass: null,
      template: null,
      vars: null,
      plugins: null,
      bootstrapTemplateVarsInServer: null,
    });

    class Plugin {
      constructor({ flux, req, window }) {
        _.dev(() => flux.should.be.instanceOf(R.Flux));
        _.dev(() => _.isServer() ? req.should.be.an.Object : window.should.be.an.Object);
        this.displayName = this.getDisplayName();
      }

      getDisplayName() { _.abstract(); }

      destroy() { _.abstract(); }
    }

    _.extend(Plugin.prototype, /** @lends Plugin.Prototype */ {
      displayName: null,
    });

    _.extend(App, { Plugin });
    return App;
};
