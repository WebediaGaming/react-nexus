module.exports = function(R) {

  const Root = {
    Mixin: {
      _RootMixin: true,

      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],

      propTypes: {
        flux: R.Flux.PropType,
      },

      childContextTypes: {
        flux: R.Flux.PropType,
      },

      getChildContext() {
        return { flux: this.props.flux };
      },

      getFlux() {
        return this.props.flux;
      },
    },
  };

  return Root;
};
