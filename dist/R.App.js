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
            renderToStringInServer: regeneratorRuntime.mark(function renderToStringInServer(req) {
                var guid, flux, rootProps, surrogateRootComponent, factoryRootComponent, rootComponent, rootHtml, serializedFlux;

                return regeneratorRuntime.wrap(function renderToStringInServer$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        R.Debug.dev(function() {
                            assert(R.isServer(), "R.App.AppInstance.renderAppToStringInServer(...): should be in server.");
                        });
                        guid = R.guid();
                        flux = new this._fluxClass();
                        context$2$0.next = 5;
                        return flux.bootstrapInServer(req, req.headers, guid);
                    case 5:
                        //Initializes plugin and fill all corresponding data for store : Memory
                        _.each(this._plugins, function(Plugin, name) {
                            var plugin = new Plugin();
                            R.Debug.dev(function() {
                                assert(plugin.installInServer && _.isFunction(plugin.installInServer), "R.App.renderToStringInServer(...).plugins[...].installInServer: expecting Function. ('" + name + "')");
                            });
                            plugin.installInServer(flux, req);
                        });
                        rootProps = { flux: flux };
                        R.Debug.dev(R.scope(function() {
                            _.extend(rootProps, { __ReactOnRailsApp: this });
                        }, this));

                        surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);

                        if(!surrogateRootComponent.componentWillMount) {
                            R.Debug.dev(function() {
                                console.error("Root component doesn't have componentWillMount. Maybe you forgot R.Root.Mixin? ('" + surrogateRootComponent.displayName + "')");
                            });
                        }
                        surrogateRootComponent.componentWillMount();

                        context$2$0.next = 13;
                        return surrogateRootComponent.prefetchFluxStores();
                    case 13:
                        surrogateRootComponent.componentWillUnmount();

                        factoryRootComponent = React.createFactory(this._rootClass);
                        rootComponent = factoryRootComponent(rootProps);
                        flux.startInjectingFromStores();
                        rootHtml = React.renderToString(rootComponent);
                        flux.stopInjectingFromStores();

                        serializedFlux = flux.serialize();
                        flux.destroy();
                        context$2$0.next = 23;
                        return this._bootstrapTemplateVarsInServer(req);
                    case 23:
                        context$2$0.t0 = context$2$0.sent;

                        context$2$0.t1 = {
                            rootHtml: rootHtml,
                            serializedFlux: serializedFlux,
                            serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                            guid: guid,
                        };

                        context$2$0.t2 = _.extend({}, context$2$0.t0, this._vars, context$2$0.t1);
                        return context$2$0.abrupt("return", this._template(context$2$0.t2, this._templateLibs));
                    case 27:
                    case "end":
                        return context$2$0.stop();
                    }
                }, renderToStringInServer, this);
            }),
            /**
            * <p>Setting all the data for each React Component and Render it into the client. <br />
            * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
            * @method renderIntoDocumentInClient
            * @param {object} window The classical window object
            */
            renderIntoDocumentInClient: regeneratorRuntime.mark(function renderIntoDocumentInClient(window) {
                var flux, headers, guid, rootProps, factoryRootComponent, rootComponent;

                return regeneratorRuntime.wrap(function renderIntoDocumentInClient$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        R.Debug.dev(function() {
                            assert(R.isClient(), "R.App.AppInstance.renderAppIntoDocumentInClient(...): should be in client.");
                            assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                            assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                            assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                            assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
                        });
                        flux = new this._fluxClass();
                        R.Debug.dev(function() {
                            window.__ReactOnRails.flux = flux;
                        });
                        headers = JSON.parse(R.Base64.decode(window.__ReactOnRails.serializedHeaders));
                        guid = window.__ReactOnRails.guid;
                        context$2$0.next = 7;
                        return flux.bootstrapInClient(window, headers, guid);
                    case 7:
                        //Unserialize flux in order to fill all data in store
                        flux.unserialize(window.__ReactOnRails.serializedFlux);
                        _.each(this._plugins, function(Plugin, name) {
                            var plugin = new Plugin();
                            R.Debug.dev(function() {
                                assert(plugin.installInClient && _.isFunction(plugin.installInClient), "R.App.renderToStringInServer(...).plugins[...].installInClient: expecting Function. ('" + name + "')");
                            });
                            plugin.installInClient(flux, window);
                        });
                        rootProps = { flux: flux };
                        R.Debug.dev(R.scope(function() {
                            _.extend(rootProps, { __ReactOnRailsApp: this });
                        }, this));
                        factoryRootComponent = React.createFactory(this._rootClass);
                        rootComponent = factoryRootComponent(rootProps);
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
                    case 17:
                    case "end":
                        return context$2$0.stop();
                    }
                }, renderIntoDocumentInClient, this);
            }),
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
