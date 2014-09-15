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
        });
        _.extend(this, {
            _fluxClass: params.fluxClass,
            _rootClass: params.rootClass,
            _template: params.template || App.defaultTemplate,
            _componentsClasses: params.componentsClasses,
            _bootstrapTemplateVarsInServer: params.bootstrapTemplateVarsInServer,
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
            return co(regeneratorRuntime.mark(function callee$2$0() {
                var guid, flux, rootComponent, rootHtml, serializedFlux;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        guid = R.guid();
                        flux = new this._fluxClass();
                        context$3$0.next = 4;
                        return flux.bootstrapInServer(req, req.headers, guid);
                    case 4:
                        flux.registerAllComponentsStylesheetRules(this._componentsClasses);

                        rootComponent = this._rootClass({
                            flux: flux,
                        });

                        console.warn("rootComponent:");
                        /* jshint ignore:start */
                        _.forIn(rootComponent.__proto__, function(val, key) {
                            console.warn(key, val);
                        });
                        context$3$0.next = 10;
                        return rootComponent.prefetchFluxStores();
                    case 10:
                        rootHtml = React.renderComponentToString(rootComponent);
                        flux.stopInjectingFromStores();
                        serializedFlux = flux.serialize();
                        if(!this._cachedStyleChunks) {
                            this._cachedStyleChunks = _.map(flux.getAllStylesheets(), function(stylesheet) {
                                return stylesheet.slowlyExportToCSS();
                            });
                        }
                        flux.destroy();

                        return context$3$0.abrupt(
                            "return",
                            this._template(_.extend({}, this._bootstrapTemplateVarsInServer(req), {
                                displayName: displayName,
                                styleChunks: this._cachedStyleChunks,
                                rootHtml: rootHtml,
                                serializedFlux: serializedFlux,
                                headers: req.headers,
                                guid: guid,
                            }))
                        );
                    case 16:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })).call(this);
        },
        renderIntoDocumentInClient: function renderAppInExistingDocumentInClient(window) {
            R.Debug.dev(function() {
                assert(R.isClient(), "R.App.renderAppIntoDocumentInClient(...): should be in client.");
                assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                assert(_.has(window.__ReactOnRails, "headers") && _.isString(window.__ReactOnRails.headers), "R.App.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
            });
            return co(regeneratorRuntime.mark(function callee$2$0() {
                var flux, guid, rootComponent;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        flux = new this._fluxClass();
                        flux.unserialize(JSON.parse(window.__ReactOnRails.serializedFlux));
                        guid = window.__ReactOnRails.guid;
                        context$3$0.next = 5;
                        return flux.bootstrapInClient(window, headers, guid);
                    case 5:
                        rootComponent = this._rootClass({
                            flux: flux,
                        });

                        React.renderComponent(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
                        flux.stopInjectingFromStores();
                    case 8:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })).call(this);
        },
    });

    R.App = App;
    return R;
};
