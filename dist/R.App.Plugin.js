"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;

  var Plugin = (function () {
    var Plugin = function Plugin(_ref) {
      var flux = _ref.flux;
      var req = _ref.req;
      var window = _ref.window;
      var headers = _ref.headers;
      _.dev(function () {
        return flux.should.be.an.instanceOf(R.Flux) && headers.should.be.an.Object;
      });
      _.dev(function () {
        return (__NODE__) ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.displayName = this.getDisplayName();
      this.flux = flux;
      this.window = window;
      this.req = req;
      this.headers = headers;
    };

    Plugin.prototype.getDisplayName = function () {
      _.abstract();
    };

    Plugin.prototype.destroy = function () {
      _.abstract();
    };

    return Plugin;
  })();

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */{
    flux: null,
    window: null,
    req: null,
    headers: null,
    displayName: null });

  return Plugin;
};