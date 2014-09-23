module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var React = R.React;

    var Root = {
        Mixin: {
            mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
            _AppMixinHasAppMixin: true,
            propTypes: {
                flux: R.Flux.PropType,
            },
            childContextTypes: {
                flux: R.Flux.PropType,
            },
            getChildContext: function getChildContext() {
                return {
                    flux: this.props.flux,
                };
            },
            getFlux: function getFlux() {
                return this.props.flux;
            },
        },
    };

    R.Root = Root;
    return R;
};
