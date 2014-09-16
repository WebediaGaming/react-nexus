module.exports = function(R) {
    var co = require("co");
    var React = require("react");
    var _ = require("lodash");
    var assert = require("assert");
    var defaultTemplate = require("../templates/R.App.defaultTemplate");

    var App = function App(params) {
        R.Debug.dev(function() {
            assert(_.isPlainObject(params), "R.App(...).params: expecting Object.");
            assert(_.has(params, "fluxClass") && _.isFunction(params.fluxClass), "R.App(...).params.fluxClass: expecting Function.");
            assert(_.has(params, "rootClass") && _.isFunction(params.rootClass), "R.App(...).params.rootClass: expecting Function.");
            assert(_.has(params, "componentsClasses") && _.isPlainObject(params.componentsClasses), "R.App(...).params.componentsClasses: expecting Object.");
            assert(_.has(params, "bootstrapTemplateVarsInServer") && _.isFunction(params.bootstrapTemplateVarsInServer), "R.App(...).params.bootstrapTemplateVarsInServer: expecting Function.");
            assert(_.has(params, "client") && _.isString(params.client), "R.App(...).params.client: expecting String.");
        });
        _.extend(this, {
            _fluxClass: params.fluxClass,
            _rootClass: params.rootClass,
            _template: params.template || App.defaultTemplate,
            _componentsClasses: params.componentsClasses,
            _bootstrapTemplateVarsInServer: params.bootstrapTemplateVarsInServer,
            _client: params.client,
        });
    };

    App.defaultTemplate = defaultTemplate;

    _.extend(App.prototype, /** @lends R.App.prototype */ {
        _fluxClass: null,
        _rootClass: null,
        _template: null,
        _componentsClasses: null,
        _bootstrapTemplateVarsInServer: null,
        _cachedStyleChunks: null,
        renderToStringInServer: function renderToStringInServer(req) {
            R.Debug.dev(function() {
                assert(R.isServer(), "R.App.renderAppToStringInServer(...): should be in server.");
            });
            return R.scope(co(function*() {
                var guid = R.guid();
                var flux = new this._fluxClass();
                yield flux.bootstrapInServer(req, req.headers, guid);
                flux.registerAllComponentsStylesheetRules(this._componentsClasses);
                var surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, {
                    flux: flux,
                });
                surrogateRootComponent.componentWillMount();
                console.warn("before yield");
                yield surrogateRootComponent.prefetchFluxStores();
                console.warn("after yield");
                surrogateRootComponent.componentWillUnmount();
                var rootComponent = this._rootClass({
                    flux: flux,
                });
                var rootHtml = React.renderComponentToString(rootComponent);
                flux.stopInjectingFromStores();
                var serializedFlux = flux.serialize();
                if(!this._cachedStyleChunks) {
                    this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                        return stylesheet.slowlyExportToCSS();
                    });
                }
                flux.destroy();
                return this._template(_.extend({}, yield this._bootstrapTemplateVarsInServer(req), {
                    client: this._client,
                    styleChunks: this._cachedStyleChunks,
                    rootHtml: rootHtml,
                    serializedFlux: serializedFlux,
                    headers: req.headers,
                    guid: guid,
                }));
            }), this);
        },
        renderIntoDocumentInClient: function renderAppInExistingDocumentInClient(window) {
            R.Debug.dev(function() {
                assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
                assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                assert(_.has(window.__ReactOnRails, "headers") && _.isString(window.__ReactOnRails.headers), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
            });
            return co(function*() {
                var flux = new this._fluxClass();
                flux.unserialize(JSON.parse(window.__ReactOnRails.serializedFlux));
                var guid = window.__ReactOnRails.guid;
                yield flux.bootstrapInClient(window, headers, guid);
                var rootComponent = this._rootClass({
                    flux: flux,
                });
                React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                flux.stopInjectingFromStores();
            }).call(this);
        },
    });

    R.App = App;
    return R;
};
