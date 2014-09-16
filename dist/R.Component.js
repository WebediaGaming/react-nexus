module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Component = {
        createClass: function createClass(specs) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(specs), "R.Component.createClass(...): expecting an Object.");
                assert(!_.has(specs, "getFlux"), "R.Component.createClass(...): should not define getFlux.");
            });
            if(!specs.contextTypes) {
                specs.contextTypes = {};
            }
            _.extend(specs.contextTypes, {
                flux: function validateFlux(props, propName, componentName) {
                    var flux = props.flux;
                    var valid = null;
                    R.Debug.dev(function() {
                        try {
                            assert(_.isObject(flux) && flux._isFluxInstance_, "R.Component.createClass(...): expecting a R.Flux.FluxInstance.");
                        }
                        catch(err) {
                            valid = err;
                        }
                    });
                    return valid;
                },
            });
            if(!specs.mixins) {
                specs.mixins = [];
            }
            _.each(R.Component._getMixins(), function(mixin) {
                if(!_.contains(specs.mixins, mixin)) {
                    specs.mixins.push(mixin);
                }
            });
            return React.createClass(specs);
        },
        Mixin: {
            _ComponentMixinHasComponentMixin: true,
            getFlux: function getFlux() {
                return this.context.flux;
            },
        },
        _getMixins: function _getMixins() {
            return [
                R.Pure.Mixin,
                R.$.Mixin,
                R.Async.Mixin,
                R.Animate.Mixin,
                R.Component.Mixin,
                R.Flux.Mixin,
            ];
        },
    };

    R.Component = Component;
    return R;
};
