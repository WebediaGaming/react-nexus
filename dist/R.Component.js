"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
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