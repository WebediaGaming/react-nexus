"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
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