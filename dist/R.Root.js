"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
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