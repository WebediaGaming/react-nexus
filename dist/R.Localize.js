module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var Locales = require("locale").Locales;
    var React = R.React;

    var Localize = {
        extractLocale: function extractLocale(headers, supported) {
            R.Debug.dev(function() {
                assert(_.has(headers, "accept-language") && _.isString(headers["accept-language"]), "R.Localize.extractLocale(...).headers['accept-language']: expected String.");
            });
            var supportedLocales = new Locales(supported);
            var acceptedLocales = new Locales(headers["accept-language"]);
            return acceptedLocales.best(supportedLocales);
        },
        createPlugin: function createPlugin(storeName, dispatcherName, supportedLocales) {
            return R.App.createPlugin({
                displayName: "Localize",
                installInClient: function installInClient(flux, window) {
                    flux.getDispatcher(dispatcherName).addActionListener("/Localize/setLocale", regeneratorRuntime.mark(function setLocale(params) {
                        return regeneratorRuntime.wrap(function setLocale$(context$4$0) {
                            while (1) switch (context$4$0.prev = context$4$0.next) {
                            case 0:
                                R.Debug.dev(function() {
                                    assert(params.locale && _.isString(params.locale), dispatcherName + "://Localize/setLocale.params.locale: expected String.");
                                });
                                context$4$0.next = 3;
                                return _.defer;
                            case 3:
                                flux.getStore(storeName).set("/Localize/locale", Localize.extractLocale(params.locale, supportedLocales));
                            case 4:
                            case "end":
                                return context$4$0.stop();
                            }
                        }, setLocale, this);
                    }));
                },
                installInServer: function installInServer(flux, req) {
                    flux.getStore(storeName).set("/Localize/locale", Localize.extractLocale(req.headers, supportedLocales));
                },
            });
        },
        createLocalizeClass: function createClass(specs) {
            R.Debug.dev(function() {
                assert(specs.storeName && _.isString(specs.storeName), "R.Localize.createClass(...).specs.storeName: expected String.");
                assert(specs.dispatcherName && _.isString(specs.dispatcherName), "R.Localize.createClass(...).specs.dispatcherName: expected String.");
            });
            return React.createClass({
                propTypes: {
                    locale: React.propTypes.string.isRequired,
                    children: React.PropTypes.element.isRequired,
                },
                getInitialState: function getInitialState() {
                    return {
                        locale: null,
                    };
                },
                getFluxStoreSubscriptions: function getFluxStoreSubscriptions(props) {
                    return R.record(specs.storeName + "://Localize/locale", "locale");
                },
                render: function render() {
                    if(this.props.locale === this.state.locale) {
                        return React.Children.only(this.props.children);
                    }
                    else {
                        return null;
                    }
                },
            });
        },
    };

    return Localize;
};
