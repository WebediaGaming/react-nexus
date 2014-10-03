module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var React = R.React;

    var Component = {
        Mixin: {
            mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
            contextTypes: {
                flux: R.Flux.PropType,
            },
            _ComponentMixinHasComponentMixin: true,
            getFlux: function getFlux() {
                return this.context.flux;
            },
        },
    };

    return Component;
};
