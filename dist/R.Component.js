"use strict";

require("6to5/polyfill");var Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var Component = {
    Mixin: {
      _ComponentMixin: true,

      mixins: [R.Pure.Mixin, R.Async.Mixin, R.Animate.Mixin, R.Flux.Mixin],

      contextTypes: {
        flux: R.Flux.PropType },

      getFlux: function () {
        return this.context.flux;
      } } };

  return Component;
};