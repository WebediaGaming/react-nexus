module.exports = function(R) {
    var co = require("co");
    var React = R.React;
    var _ = require("lodash");
    var assert = require("assert");
    var path = require("path");

    var App = {
        createApp: function createApp(specs) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(specs), "R.App.createApp(...).specs: expecting Object.");
                assert(specs.fluxClass && _.isFunction(specs.fluxClass), "R.App.createApp(...).specs.fluxClass: expecting Function.");
                assert(specs.rootClass && _.isFunction(specs.rootClass), "R.App.createApp(...).specs.rootClass: expecting Function.");
                assert(specs.componentsClasses && _.isPlainObject(specs.componentsClasses), "R.App.createApp(...).specs.componentsClasses: expecting Object.");
                assert(specs.bootstrapTemplateVarsInServer && _.isFunction(specs.bootstrapTemplateVarsInServer, "R.App.createApp(...).specs.bootstrapTemplateVarsInServer: expecting Function."));
            });

            var AppInstance = function AppInstance() {
                _.extend(this, {
                    _fluxClass: specs.fluxClass,
                    _rootClass: specs.rootClass,
                    _template: specs.template || App.defaultTemplate,
                    _componentsClasses: specs.componentsClasses,
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
            _componentsClasses: null,
            _bootstrapTemplateVarsInServer: null,
            _cachedStyleChunks: null,
            _vars: null,
            _templateLibs: null,
            _plugins: null,
            renderToStringInServer: regeneratorRuntime.mark(function renderToStringInServer(req) {
                var guid, flux, rootProps, surrogateRootComponent, rootComponent, rootHtml, serializedFlux;

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
                        _.each(this._plugins, function(Plugin, name) {
                            var plugin = new Plugin();
                            R.Debug.dev(function() {
                                if(!plugin.installInServer) {
                                    console.warn("name", name);
                                    R.Debug.display("plugin", plugin);
                                }
                                assert(plugin.installInServer && _.isFunction(plugin.installInServer), "R.App.renderToStringInServer(...).plugins[...].installInServer: expecting Function. ('" + name + "')");
                            });
                            plugin.installInServer(flux, req);
                        });
                        flux.registerAllComponentsStylesheetRules(this._componentsClasses);
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
                        context$2$0.next = 14;
                        return surrogateRootComponent.prefetchFluxStores();
                    case 14:
                        surrogateRootComponent.componentWillUnmount();
                        rootComponent = this._rootClass(rootProps);
                        flux.startInjectingFromStores();
                        rootHtml = React.renderComponentToString(rootComponent);
                        flux.stopInjectingFromStores();
                        serializedFlux = flux.serialize();
                        if(!this._cachedStyleChunks) {
                            this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                                return stylesheet.getProcessedCSS();
                            });
                        }
                        flux.destroy();
                        context$2$0.next = 24;
                        return this._bootstrapTemplateVarsInServer(req);
                    case 24:
                        context$2$0.t0 = context$2$0.sent;

                        context$2$0.t1 = {
                            styleChunks: this._cachedStyleChunks,
                            rootHtml: rootHtml,
                            serializedFlux: serializedFlux,
                            serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                            guid: guid,
                        };

                        context$2$0.t2 = _.extend({}, context$2$0.t0, this._vars, context$2$0.t1);
                        return context$2$0.abrupt("return", this._template(context$2$0.t2, this._templateLibs));
                    case 28:
                    case "end":
                        return context$2$0.stop();
                    }
                }, renderToStringInServer, this);
            }),
            renderIntoDocumentInClient: regeneratorRuntime.mark(function renderAppInExistingDocumentInClient(window) {
                var flux, headers, guid, rootProps, rootComponent;

                return regeneratorRuntime.wrap(function renderAppInExistingDocumentInClient$(context$2$0) {
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
                        rootComponent = this._rootClass(rootProps);
                        R.Debug.dev(function() {
                            window.__ReactOnRails.rootComponent = rootComponent;
                        });
                        flux.startInjectingFromStores();
                        React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                        flux.stopInjectingFromStores();
                    case 16:
                    case "end":
                        return context$2$0.stop();
                    }
                }, renderAppInExistingDocumentInClient, this);
            }),
        },
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

    R.App = App;
    return R;
};
