"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var Root = {
    Mixin: {
      _RootMixin: true,

      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],

      propTypes: {
        flux: R.Flux.PropType },

      childContextTypes: {
        flux: R.Flux.PropType },

      getChildContext: function () {
        return { flux: this.props.flux };
      },

      getFlux: function () {
        return this.props.flux;
      } } };

  return Root;
};