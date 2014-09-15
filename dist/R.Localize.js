var R = require("../");
var _ = require("lodash");
var assert = require("assert");
var loc = require("locale");

var _cache = {};

var Localize = function Localize(storeName, dispatcherName) {
    if(!_cache[storeName]) {
        _cache[storeName] = R.Component.createClass(/** @lends R.Localize.prototype */{
            displayName: "Localize",
            _LocalizeStoreName: storeName,
            propTypes: {
                locale: React.PropTypes.string.isRequired,
                children: React.PropTypes.component,
            },
            getInitialState: function getInitialState() {
                return {
                    locale: null,
                };
            },
            getFluxStoreSubscriptions: function getFluxStoreSubscriptions(props) {
                return [{
                    storeName: storeName,
                    storeKey: "locale",
                    stateKey: "locale",
                }];
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
        _.extend(_cache[storeName], /** @lends R.Localize.prototype */{
            setLocale: function setLocale(flux, locale) {
                Localize.setLocale(flux, dispatcherName, locale);
            },
        });
    }
    return _cache[storeName];
};

_.extend(Localize, /** @lends R.Localize */{
    extractLocale: function extractLocale(headers, accepted) {
        R.Debug.dev(function() {
            assert(_.has(headers, "accept-language") && _.isString(headers["accept-language"]), "R.Localize.extractLocale(...).headers['accept-language']: expected String.");
        });
        return new loc.locales(accepted).best(headers["accept-language"]);
    },
    localize: function localize(flux, storeName, map) {
        var locale = flux.getStore(storeName).get("locale");
        return map[locale];
    },
    setLocale: function setLocale(flux, dispatcherName, locale) {
        flux.getDispatcher(dispatcherName).trigger("setLocale", { locale: locale });
    },
});

module.exports = {
    Localize: Localize,
};
