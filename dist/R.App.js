module.exports = function(R) {
    var co = require("co");
    var React = R.React;
    var _ = require("lodash");
    var assert = require("assert");
    var path = require("path");

    var App = function App(params) {
        R.Debug.dev(function() {
            assert(_.isPlainObject(params), "R.App(...).params: expecting Object.");
            assert(_.has(params, "fluxClass") && _.isFunction(params.fluxClass), "R.App(...).params.fluxClass: expecting Function.");
            assert(_.has(params, "rootClass") && _.isFunction(params.rootClass), "R.App(...).params.rootClass: expecting Function.");
            assert(_.has(params, "componentsClasses") && _.isPlainObject(params.componentsClasses), "R.App(...).params.componentsClasses: expecting Object.");
            assert(_.has(params, "bootstrapTemplateVarsInServer") && _.isFunction(params.bootstrapTemplateVarsInServer), "R.App(...).params.bootstrapTemplateVarsInServer: expecting Function.");
        });
        _.extend(this, {
            _fluxClass: params.fluxClass,
            _rootClass: params.rootClass,
            _template: params.template || App.defaultTemplate,
            _componentsClasses: params.componentsClasses,
            _bootstrapTemplateVarsInServer: params.bootstrapTemplateVarsInServer,
            _vars: params.vars || {},
            _libs: _.extend(params.libs || {}, {
                _: _,
            }),
        });
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
            throw new Error("R.App.defaultTemplate(...): should not be called in the client.");
        };
    }

    _.extend(App.prototype, /** @lends R.App.prototype */ {
        _fluxClass: null,
        _rootClass: null,
        _template: null,
        _componentsClasses: null,
        _bootstrapTemplateVarsInServer: null,
        _cachedStyleChunks: null,
        _vars: null,
        _libs: null,
        renderToStringInServer: regeneratorRuntime.mark(function renderToStringInServer(req) {
            var guid, flux, rootProps, surrogateRootComponent, rootComponent, rootHtml, serializedFlux;

            return regeneratorRuntime.wrap(function renderToStringInServer$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    R.Debug.dev(function() {
                        assert(R.isServer(), "R.App.renderAppToStringInServer(...): should be in server.");
                    });
                    guid = R.guid();
                    flux = new this._fluxClass();
                    context$2$0.next = 5;
                    return flux.bootstrapInServer(req, req.headers, guid);
                case 5:
                    flux.registerAllComponentsStylesheetRules(this._componentsClasses);
                    rootProps = { flux: flux };
                    R.Debug.dev(R.scope(function() {
                        _.extend(rootProps, { __ReactOnRailsApp: this });
                    }, this));
                    surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);
                    surrogateRootComponent.componentWillMount();
                    context$2$0.next = 12;
                    return surrogateRootComponent.prefetchFluxStores();
                case 12:
                    surrogateRootComponent.componentWillUnmount();
                    rootComponent = this._rootClass(rootProps);
                    flux.startInjectingFromStores();
                    rootHtml = React.renderComponentToString(rootComponent);
                    flux.stopInjectingFromStores();
                    serializedFlux = flux.serialize();
                    if(!this._cachedStyleChunks) {
                        this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                            return stylesheet.slowlyExportToCSS();
                        });
                    }
                    flux.destroy();
                    context$2$0.next = 22;
                    return this._bootstrapTemplateVarsInServer(req);
                case 22:
                    context$2$0.t0 = context$2$0.sent;

                    context$2$0.t1 = {
                        styleChunks: this._cachedStyleChunks,
                        rootHtml: rootHtml,
                        serializedFlux: serializedFlux,
                        serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                        guid: guid,
                    };

                    context$2$0.t2 = _.extend({}, context$2$0.t0, this._vars, context$2$0.t1);
                    return context$2$0.abrupt("return", this._template(context$2$0.t2, this._libs));
                case 26:
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
                        assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
                        assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                        assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                        assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                        assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
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
                case 15:
                case "end":
                    return context$2$0.stop();
                }
            }, renderAppInExistingDocumentInClient, this);
        }),
    });

    R.App = App;
    return R;
};
