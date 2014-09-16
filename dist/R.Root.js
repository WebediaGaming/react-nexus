module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var React = require("react");

    var Root = {
        _validateFlux: function _validateFlux(props, propName, componentName) {
            var flux = props.flux;
            var valid = null;
            R.Debug.dev(function() {
                try {
                    assert(_.isObject(flux) && flux._isFluxInstance_, "R.Root.createClass(...): expecting a R.Flux.FluxInstance.");
                }
                catch(err) {
                    valid = err;
                }
            });
            return valid;
        },
        createClass: function createClass(specs) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(specs), "R.Root.createClass(...): expecting an Object.");
                assert(!_.has(specs, "getFlux"), "R.Root.createClass(...): should not define getFlux.");
            });
            if(!specs.propTypes) {
                specs.propTypes = {};
            }
            _.extend(specs.propTypes, {
                flux: R.Root._validateFlux,
            });
            if(!specs.childContextTypes) {
                specs.childContextTypes = {};
            }
            _.extend(specs.childContextTypes, {
                flux: R.Root._validateFlux,
            });
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
            _.each(R.Root._getMixins(), function(mixin) {
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
                R.$.Mixin,
                R.Async.Mixin,
                R.Animate.Mixin,
                R.Root.Mixin,
                R.Flux.Mixin,
            ];
        },
    };

    R.Root = Root;
    return R;
};
