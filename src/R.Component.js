module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;

  /**
  * <p>Defines a specific mixin</p>
  * <p>This will allow to components to access the main methods of react-rails</p>
  * <ul>
  * <li> Component.getFlux => Provide Flux for the current component </li>
  * </ul>
  * @class R.Component
  */
  const Component = {
    Mixin: {
      /**
      * <p>Refers to specifics mixins in order to manage Pure, Async, Animate and Flux methods</p>
      * @property mixins
      * @type {array.object}
      */
      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
      /**
      * <p>Defines context object for the current component<br />
      * Allows all components using this mixin to have reference to R.Flux (Provides by the R.Root)</p>
      * @property contextTypes
      * @type {object} flux
      */
      contextTypes: {
        flux: R.Flux.PropType,
      },

      _ComponentMixinHasComponentMixin: true,
      /** <p>Provide Flux for the current component</p>
      * @method getFlux
      * @return {object} this.context.flux The Flux of the App
      */
      getFlux() {
        return this.context.flux;
      },
    },
  };

  return Component;
};
