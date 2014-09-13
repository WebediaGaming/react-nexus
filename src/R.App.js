var R = require("./R");
var _ = require("lodash");
var assert = require("assert");
var React = require("react");

var App = {
    createClass: function createClass(specs) {
        R.Debug.dev(function() {
            assert(_.isPlainObject(specs), "R.App.createClass(...): expecting an Object.");
            assert(!_.has(specs, "getFlux"), "R.App.createClass(...): should not define getFlux.");
        });
        if(!specs.propTypes) {
            specs.propTypes = {};
        }
        _.extend(specs.propTypes, {
            flux: function validateFlux(props, propName, componentName) {
                var flux = props.flux;
                var valid = null;
                R.Debug.dev(function() {
                    try {
                        assert(_.isObject(flux) && flux._isFluxInstance_, "R.App.createClass(...): expecting a R.Flux.FluxInstance.");
                    }
                    catch(err) {
                        valid = err;
                    }
                });
                return valid;
            },
        });
        if(!specs.childContextTypes) {
            specs.childContextTypes = {};
        }
        specs.childContextTypes.flux = {
            flux: specs.propTypes.flux,
        };
        var _getChildContext;
        if(!specs.getChildContext) {
            _getChildContext = function getChildContext() { return {}; };
        }
        else {
            _getChildContext = specs._getChildContext;
        }
        specs.getChildContext = function getChildContext() {
            return _.extend(_getChildContext.apply(this), {
                flux: this.props.flux,
            });
        };
        if(!specs.mixins) {
            specs.mixins = [];
        }
        _.each(R.App._getMixins(), function(mixin) {
            if(!_.contains(specs.mixins, mixin)) {
                specs.mixins.push(mixin);
            }
        });
        return React.createClass(specs);
    },
    Mixin: {
        _AppMixinHasAppMixin: true,
        getFlux: function getFlux() {
            return this.props.flux;
        },
    },
    _getMixins: function _getMixins() {
        return [
            R.Pure.Mixin,
            R.Query.Mixin,
            R.Async.Mixin,
            R.Animate.Mixin,
            R.App.Mixin,
            R.Dependencies.Mixin,
        ];
    },

};

module.exports = {
    App: App,
};
