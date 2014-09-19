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
        renderToStringInServer: function* renderToStringInServer(req) {
            R.Debug.dev(function() {
                assert(R.isServer(), "R.App.renderAppToStringInServer(...): should be in server.");
            });
            var guid = R.guid();
            var flux = new this._fluxClass();
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
                assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
                assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
            });
            var flux = new this._fluxClass();
            R.Debug.dev(function() {
                window.__ReactOnRails.flux = flux;
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
            React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
            flux.stopInjectingFromStores();
        },
    });

    R.App = App;
    return R;
};
