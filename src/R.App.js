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
            renderToStringInServer: function* renderToStringInServer(req) {
                R.Debug.dev(function() {
                    assert(R.isServer(), "R.App.AppInstance.renderAppToStringInServer(...): should be in server.");
                });
                var guid = R.guid();
                var flux = new this._fluxClass();
                yield flux.bootstrapInServer(req, req.headers, guid);
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
                var surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);
                if(!surrogateRootComponent.componentWillMount) {
                    R.Debug.dev(function() {
                        console.error("Root component doesn't have componentWillMount. Maybe you forgot R.Root.Mixin? ('" + surrogateRootComponent.displayName + "')");
                    });
                }
                surrogateRootComponent.componentWillMount();
                yield surrogateRootComponent.prefetchFluxStores();
                surrogateRootComponent.componentWillUnmount();
                var rootComponent = this._rootClass(rootProps);
                flux.startInjectingFromStores();
                var rootHtml = React.renderComponentToString(rootComponent);
                flux.stopInjectingFromStores();
                var serializedFlux = flux.serialize();
                flux.destroy();
                return this._template(_.extend({}, yield this._bootstrapTemplateVarsInServer(req), this._vars, {
                    rootHtml: rootHtml,
                    serializedFlux: serializedFlux,
                    serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                    guid: guid,
                }), this._templateLibs);
            },
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
                yield flux.bootstrapInClient(window, headers, guid);
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
                var rootComponent = this._rootClass(rootProps);
                R.Debug.dev(function() {
                    window.__ReactOnRails.rootComponent = rootComponent;
                });
                flux.startInjectingFromStores();
                React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                flux.stopInjectingFromStores();
            },
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

    return App;
};
