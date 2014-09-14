var R = require("../");
var co = require("co");
var React = require("react");

var App = function App(params) {
    R.Debug.dev(function() {
        assert(_.isPlainObject(params), "R.App(...).params: expecting Object.");
        assert(_.has(params, "fluxClass") && _.isFunction(params.fluxClass), "R.App(...).params.fluxClass: expecting Function.");
        assert(_.has(params, "rootClass") && _.isFunction(params.rootClass), "R.App(...).params.rootClass: expecting Function.");
        assert(_.has(params, "componentsClasses") && _.isPlainObject(params.componentsClasses), "R.App(...).params.componentsClasses: expecting Object.");
        assert(_.has(params, "bootstrapTemplateVarsInServer") && _.isPlainObject(params.bootstrapTemplateVarsInServer), "R.App(...).params.bootstrapTemplateVarsInServer: expecting Function.");
    });
    _.extend(this, {
        _fluxClass: params.fluxClass,
        _rootClass: params.rootClass,
        _template: params.template || App.defaultTemplate,
        _componentsClasses: params.componentsClasses,
        _bootstrapTemplateVarsInServer: params.bootstrapTemplateVarsInServer,
    });
};

App.defaultTemplate = require("./R.App.defaultTemplate");

_.extend(App.prototype, /** @lends R.App.prototype */ {
    _fluxClass: null,
    _rootClass: null,
    _template: null,
    _componentsClasses: null,
    _bootstrapTemplateVarsInServer: null,
    _cachedStyleChunks: null,
    renderToStringInServer: function renderAppToString(req) {
        R.Debug.dev(function() {
            assert(R.isServer(), "R.App.renderAppToStringInServer(...): should be in server.");
        });
        return co(function*() {
            var flux = new this._fluxClass();
            yield flux.bootstrapInServer(req);
            flux.registerAllComponentsStylesheetRules(this._componentsClasses);
            var rootComponent = this._rootClass({
                flux: flux,
            });
            yield rootComponent.prefetchFluxStores();
            var rootHtml = React.renderComponentToString(rootComponent);
            flux.stopInjectingFromStores();
            var serializedFlux = flux.serialize();
            if(!this._cachedStyleChunks) {
                this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                    return stylesheet.slowlyExportToCSS();
                });
            }
            flux.destroy();
            return this._template(_.extend({}, this._bootstrapTemplateVarsInServer(req), {
                displayName: displayName,
                rootHtml: rootHtml,
                serializedFlux: serializedFlux,
                styleChunks: this._cachedStyleChunks,
            }));
        }).call(this);
    },
    renderIntoDocumentInClient: function renderAppInExistingDocumentInClient(window) {
        R.Debug.dev(function() {
            assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
        });
        var flux = new this._fluxClass();
        flux.unserialize(JSON.parse(window.__ReactOnRails.serializedFlux));
        flux.bootstrapInClient(window);
        var rootComponent = this._rootClass({
            flux: flux,
        });
        React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
        flux.stopInjectingFromStores();
    },
});

module.exports = {
    App: App,
};
