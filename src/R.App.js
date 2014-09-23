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
                assert(specs.fluxClass && _.isFunction(params.fluxClass), "R.App.createApp(...).params.fluxClass: expecting Function.");
                assert(specs.rootClass && _.isFunction(params.rootClass), "R.App.createApp(...).params.rootClass: expecting Function.");
                assert(specs.componentsClasses && _.isPlainObject(params.componentsClasses), "R.App.createApp(...).params.componentsClasses: expecting Object.");
                assert(specs.bootstrapTemplateVarsInServer && _.isFunction(params.bootstrapTemplateVarsInServer, "R.App.createApp(...).params.bootstrapTemplateVarsInServer: expecting Function."));
            });

            var AppInstance = function AppInstance() {
                _.extend(this, {
                    _fluxClass: specs.fluxClass,
                    _rootClass: specs.rootClass,
                    _template: specs.template || App.defaultTemplate,
                    _componentsClasses: specs.componentsClasses,
                    _bootstrapTemplateVarsInServer: specs._bootstrapTemplateVarsInServer,
                    _vars: params.vars || {},
                    _plugins: params.plugins || {},
                    _templateLibs: _.extend(params.templateLibs || {}, {
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
            _.extend(AppInstance.prototype, R.App.AppInstance._AppInstancePrototype);
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
            _libs: null,
            _plugins: null,
            renderToStringInServer: function* renderToStringInServer(req) {
                R.Debug.dev(function() {
                    assert(R.isServer(), "R.App.AppInstance.renderAppToStringInServer(...): should be in server.");
                });
                var guid = R.guid();
                var flux = new this._fluxClass();
                _.each(this.plugins, function(plugin) {
                    plugin.installInServer(flux, req);
                });
                yield flux.bootstrapInServer(req, req.headers, guid);
                flux.registerAllComponentsStylesheetRules(this._componentsClasses);
                var rootProps = { flux: flux };
                R.Debug.dev(R.scope(function() {
                    _.extend(rootProps, { __ReactOnRailsApp: this });
                }, this));
                var surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);
                surrogateRootComponent.componentWillMount();
                yield surrogateRootComponent.prefetchFluxStores();
                surrogateRootComponent.componentWillUnmount();
                var rootComponent = this._rootClass(rootProps);
                flux.startInjectingFromStores();
                var rootHtml = React.renderComponentToString(rootComponent);
                flux.stopInjectingFromStores();
                var serializedFlux = flux.serialize();
                if(!this._cachedStyleChunks) {
                    this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                        return stylesheet.slowlyExportToCSS();
                    });
                }
                flux.destroy();
                return this._template(_.extend({}, yield this._bootstrapTemplateVarsInServer(req), this._vars, {
                    styleChunks: this._cachedStyleChunks,
                    rootHtml: rootHtml,
                    serializedFlux: serializedFlux,
                    serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                    guid: guid,
                }), this._libs);
            },
            renderIntoDocumentInClient: function* renderAppInExistingDocumentInClient(window) {
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
                _.each(this.plugins, function(plugin) {
                    plugin.installInServer(flux, window);
                });
                var headers = JSON.parse(R.Base64.decode(window.__ReactOnRails.serializedHeaders));
                var guid = window.__ReactOnRails.guid;
                yield flux.bootstrapInClient(window, headers, guid);
                flux.unserialize(window.__ReactOnRails.serializedFlux);
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
                assert(specs.installInClient && _.isFunction(specs.installInClient), "R.App.createPlugin(...).specs.installInFlux: expecting Function.");
                assert(specs.installInServer && _.isFunction(specs.installInServer), "R.App.createPlugin(...).specs.installInServer: expecting Function.");
            });

            var PluginInstance = function PluginInstance() {
                this.displayName = specs.displayName;
                _.extend(this, specs);
                _.each(specs, R.scope(function(val, attr) {
                    if(_.isFunction(val)) {
                        this[attr] = R.scope(val, this);
                    }
                }, this));
            };

            _.extend(PluginInstance, App._PluginInstancePrototype);
        },
        _PluginInstancePrototype: {
            displayName: null,
            installInFlux: null,
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
