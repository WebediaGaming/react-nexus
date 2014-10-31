module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var React = R.React;

    /**
    * <p>Defines the specific mixin for the root component<br />
    * This will allow components to access the main methods of react-rails</p>
    * <ul>
    * <li> Component.getFlux => Provide Flux for the current component </li>
    * </ul>
    * @class R.Root
    */
    var Root = {
        Mixin: {
            /**  
            * <p>Refers to specifics mixins in order to manage Pure, Async, Animate and Flux methods</p>
            * @property mixins
            * @type {array.object}
            */
            mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],
            _AppMixinHasAppMixin: true,

            /** <p>Checking types</p>
            * @property propTypes
            * @type {object} flux
            */
            propTypes: {
                flux: R.Flux.PropType,
            },

            /** <p> Must be defined in order to use getChildContext </p>
            * @property childContextTypes
            * @type {object} flux 
            */
            childContextTypes: {
                flux: R.Flux.PropType,
            },

            /** <p>Provides all children access to the Flux of the App </p>
            * @method getChildContext
            * @return {object} flux The flux of current component
            */
            getChildContext: function getChildContext() {
                return {
                    flux: this.props.flux,
                };
            },

            /** <p>Provide Flux for the current component</p>
            * @method getFlux
            * @return {object} this.context.flux The Flux of the App
            */
            getFlux: function getFlux() {
                return this.props.flux;
            },
        },
    };

    return Root;
};
