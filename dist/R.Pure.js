"use strict";

require("6to5/polyfill");var Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;

  function shouldComponentUpdate(props, state) {
    return !(_.isEqual(this.props, props) && _.isEqual(this.state, state));
  }

  var Pure = {
    shouldComponentUpdate: shouldComponentUpdate,

    Mixin: {
      _PureMixin: true,
      shouldComponentUpdate: shouldComponentUpdate } };

  return Pure;
};