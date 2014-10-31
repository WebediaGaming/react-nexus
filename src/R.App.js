module.exports = function(R) {
    var co = require("co");
    var React = R.React;
    var _ = require("lodash");
    var assert = require("assert");
    var path = require("path");

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
    var App = {
        /**
        * <p> Initializes the application according to the specifications provided </p>
        * @method createApp
        * @param {object} specs All the specifications of the App
        * @return {AppInstance} AppInstance The instance of the created App
        */
        createApp: function createApp(specs) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(specs), "R.App.createApp(...).specs: expecting Object.");
                assert(specs.fluxClass && _.isFunction(specs.fluxClass), "R.App.createApp(...).specs.fluxClass: expecting Function.");
                assert(specs.rootClass && _.isFunction(specs.rootClass), "R.App.createApp(...).specs.rootClass: expecting Function.");
                assert(specs.bootstrapTemplateVarsInServer && _.isFunction(specs.bootstrapTemplateVarsInServer, "R.App.createApp(...).specs.bootstrapTemplateVarsInServer: expecting Function."));
            });

            var AppInstance = function AppInstance() {
                _.extend(this, {
                    _fluxClass: specs.fluxClass,
                    _rootClass: specs.rootClass,
                    _template: specs.template || App.defaultTemplate,
                    _bootstrapTemplateVarsInServer: specs.bootstrapTemplateVarsInServer,
                    _vars: specs.vars || {},
                    _plugins: specs.plugins || {},
                    _templateLibs: _.extend(specs.templateLibs || {}, {
                        _: _,
                    }),
                });
                _.extend(this, specs);
                _.each(specs, R.scope(function(val, attr) {
                    if(_.isFunction(val)) {
                        this[attr] = R.scope(val, this);
                    }
                }, this));
            };
            _.extend(AppInstance.prototype, R.App._AppInstancePrototype);
            return AppInstance;
        },
        _AppInstancePrototype: {
            _fluxClass: null,
            _rootClass: null,
            _template: null,
            _bootstrapTemplateVarsInServer: null,
            _vars: null,
            _templateLibs: null,
            _plugins: null,
            /**
            * <p>Compute all React Components with data server-side and render the corresponding HTML for the requesting client</p>
            * @method renderToStringInServer
            * @param {object} req The classical request object
            * @return {object} template : the computed HTML template with data for the requesting client
            */
            renderToStringInServer: function* renderToStringInServer(req) {
                R.Debug.dev(function() {
                    assert(R.isServer(), "R.App.AppInstance.renderAppToStringInServer(...): should be in server.");
                });
                //Generate a guid
                var guid = R.guid();
                //Flux is the class that will allow each component to retrieve data
                var flux = new this._fluxClass();
                //Register store (R.Store) : UplinkServer and Memory
                //Initializes flux and UplinkServer in order to be able to fetch data from uplink-server
                yield flux.bootstrapInServer(req, req.headers, guid);
                //Initializes plugin and fill all corresponding data for store : Memory
                _.each(this._plugins, function(Plugin, name) {
                    var plugin = new Plugin();
                    R.Debug.dev(function() {
                        assert(plugin.installInServer && _.isFunction(plugin.installInServer), "R.App.renderToStringInServer(...).plugins[...].installInServer: expecting Function. ('" + name + "')");
                    });
                    plugin.installInServer(flux, req);
                });
                var rootProps = { flux: flux };
                R.Debug.dev(R.scope(function() {
                    _.extend(rootProps, { __ReactOnRailsApp: this });
                }, this));

                //Create the React instance of root component with flux
                var surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);

                if(!surrogateRootComponent.componentWillMount) {
                    R.Debug.dev(function() {
                        console.error("Root component doesn't have componentWillMount. Maybe you forgot R.Root.Mixin? ('" + surrogateRootComponent.displayName + "')");
                    });
                }
                surrogateRootComponent.componentWillMount();

                //Fetching root component and childs in order to retrieve all data
                //Fill all data for store : Uplink
                yield surrogateRootComponent.prefetchFluxStores();
                surrogateRootComponent.componentWillUnmount();

                var factoryRootComponent = React.createFactory(this._rootClass);
                var rootComponent = factoryRootComponent(rootProps);
                flux.startInjectingFromStores();
                /*
                * Render root component server-side, for each components :
                * 1. getInitialState : return prefetched stored data and fill the component's state
                * 2. componentWillMount : simple initialization 
                * 3. Render : compute DOM with the component's state
                */
                var rootHtml = React.renderToString(rootComponent);
                flux.stopInjectingFromStores();

                //Serializes flux in order to provides all prefetched stored data to the client
                var serializedFlux = flux.serialize();
                flux.destroy();
                return this._template(_.extend({}, yield this._bootstrapTemplateVarsInServer(req), this._vars, {
                    rootHtml: rootHtml,
                    serializedFlux: serializedFlux,
                    serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                    guid: guid,
                }), this._templateLibs);
            },
            /**
            * <p>Setting all the data for each React Component and Render it into the client. <br />
            * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
            * @method renderIntoDocumentInClient
            * @param {object} window The classical window object
            */
            renderIntoDocumentInClient: function* renderIntoDocumentInClient(window) {
                R.Debug.dev(function() {
                    assert(R.isClient(), "R.App.AppInstance.renderAppIntoDocumentInClient(...): should be in client.");
                    assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                    assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                    assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                    assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
                });
                var flux = new this._fluxClass();
                R.Debug.dev(function() {
                    window.__ReactOnRails.flux = flux;
                });
                var headers = JSON.parse(R.Base64.decode(window.__ReactOnRails.serializedHeaders));
                var guid = window.__ReactOnRails.guid;
                //Register store (R.Store) : UplinkServer and Memory
                //Initialize flux and UplinkServer in order to be able to fetch data from uplink-server and connect to it via socket
                yield flux.bootstrapInClient(window, headers, guid);
                //Unserialize flux in order to fill all data in store
                flux.unserialize(window.__ReactOnRails.serializedFlux);
                _.each(this._plugins, function(Plugin, name) {
                    var plugin = new Plugin();
                    R.Debug.dev(function() {
                        assert(plugin.installInClient && _.isFunction(plugin.installInClient), "R.App.renderToStringInServer(...).plugins[...].installInClient: expecting Function. ('" + name + "')");
                    });
                    plugin.installInClient(flux, window);
                });
                var rootProps = { flux: flux };
                R.Debug.dev(R.scope(function() {
                    _.extend(rootProps, { __ReactOnRailsApp: this });
                }, this));
                var factoryRootComponent = React.createFactory(this._rootClass);
                var rootComponent = factoryRootComponent(rootProps);
                R.Debug.dev(function() {
                    window.__ReactOnRails.rootComponent = rootComponent;
                });
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
                React.render(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                flux.stopInjectingFromStores();
            },
        },
        /**
        * <p>Initiliaziation method of a plugin for the application</p>
        * @method createPlugin
        * @param {object} specs The specified specs provided by the plugin
        * @return {object} PluginInstance The instance of the created plugin
        */
        createPlugin: function createPlugin(specs) {
            R.Debug.dev(function() {
                assert(specs && _.isPlainObject(specs), "R.App.createPlugin(...).specs: expecting Object.");
                assert(specs.displayName && _.isString(specs.displayName), "R.App.createPlugin(...).specs.displayName: expecting String.");
                assert(specs.installInServer && _.isFunction(specs.installInServer), "R.App.createPlugin(...).specs.installInServer: expecting Function.");
                assert(specs.installInClient && _.isFunction(specs.installInClient), "R.App.createPlugin(...).specs.installInClient: expecting Function.");
            });

            var PluginInstance = function PluginInstance() {
                this.displayName = specs.displayName;
                _.each(specs, R.scope(function(val, attr) {
                    if(_.isFunction(val)) {
                        this[attr] = R.scope(val, this);
                    }
                }, this));
            };

            _.extend(PluginInstance.prototype, specs, App._PluginInstancePrototype);

            return PluginInstance;
        },
        _PluginInstancePrototype: {
            displayName: null,
            installInClient: null,
            installInServer: null,
        },
    };

    if(R.isServer()) {
        var fs = require("fs");
        var _defaultTemplate = _.template(fs.readFileSync(path.join(__dirname, "..", "src", "R.App.defaultTemplate.tpl")));
        App.defaultTemplate = function defaultTemplate(vars, libs) {
            return _defaultTemplate({ vars: vars, libs: libs });
        };
    }
    else {
        App.defaultTemplate = function defaultTemplate(vars, libs) {
            throw new Error("R.App.AppInstance.defaultTemplate(...): should not be called in the client.");
        };
    }

    return App;
};
