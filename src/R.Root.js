module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;

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
