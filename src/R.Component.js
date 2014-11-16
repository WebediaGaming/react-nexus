module.exports = function(R) {

  const Component = {
    Mixin: {
      _ComponentMixin: true,

      mixins: [
        R.Pure.Mixin,
        R.Async.Mixin,
        R.Animate.Mixin,
        R.Flux.Mixin,
      ],

      contextTypes: {
        flux: R.Flux.PropType,
      },

      getFlux() {
        return this.context.flux;
      },
    },
  };

  return Component;
};
