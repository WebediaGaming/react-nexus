module.exports = function(R) {
    var co = require("co");
    var React = require("react");
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
        renderToStringInServer: function renderToStringInServer(req) {
            R.Debug.dev(function() {
                assert(R.isServer(), "R.App.renderAppToStringInServer(...): should be in server.");
            });
            return R.scope(co(regeneratorRuntime.mark(function callee$2$0() {
                var guid, flux, surrogateRootComponent, rootComponent, rootHtml, serializedFlux;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        guid = R.guid();
                        flux = new this._fluxClass();
                        context$3$0.next = 4;
                        return flux.bootstrapInServer(req, req.headers, guid);
                    case 4:
                        flux.registerAllComponentsStylesheetRules(this._componentsClasses);

                        surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, {
                            flux: flux,
                        });

                        surrogateRootComponent.componentWillMount();
                        context$3$0.next = 9;
                        return surrogateRootComponent.prefetchFluxStores();
                    case 9:
                        surrogateRootComponent.componentWillUnmount();

                        rootComponent = this._rootClass({
                            flux: flux,
                        });

                        rootHtml = React.renderComponentToString(rootComponent);
                        flux.stopInjectingFromStores();
                        serializedFlux = flux.serialize();
                        if(!this._cachedStyleChunks) {
                            this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                                return stylesheet.slowlyExportToCSS();
                            });
                        }
                        flux.destroy();
                        context$3$0.next = 18;
                        return this._bootstrapTemplateVarsInServer(req);
                    case 18:
                        context$3$0.t0 = context$3$0.sent;

                        context$3$0.t1 = {
                            styleChunks: this._cachedStyleChunks,
                            rootHtml: rootHtml,
                            serializedFlux: serializedFlux,
                            serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                            guid: guid,
                        };

                        context$3$0.t2 = _.extend({}, context$3$0.t0, this._vars, context$3$0.t1);
                        return context$3$0.abrupt("return", this._template(context$3$0.t2, this._libs));
                    case 22:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })), this);
        },
        renderIntoDocumentInClient: function renderAppInExistingDocumentInClient(window) {
            R.Debug.dev(function() {
                assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
                assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
            });
            return R.scope(co(regeneratorRuntime.mark(function callee$2$0() {
                var flux, headers, guid, rootComponent;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        flux = new this._fluxClass();
                        headers = JSON.parse(R.Base64.decode(window.__ReactOnRails.serializedHeaders));
                        guid = window.__ReactOnRails.guid;
                        context$3$0.next = 5;
                        return flux.bootstrapInClient(window, headers, guid);
                    case 5:
                        flux.unserialize(window.__ReactOnRails.serializedFlux);

                        rootComponent = this._rootClass({
                            flux: flux,
                        });

                        React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                        flux.stopInjectingFromStores();
                    case 9:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })), this);
        },
    });

    R.App = App;
    return R;
};
