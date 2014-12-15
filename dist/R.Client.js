"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var Client = (function () {
    var Client = function Client(_ref) {
      var app = _ref.app;
      _.dev(function () {
        return (__BROWSER__).should.be.ok && app.should.be.an.instanceOf(R.App) && (window.React === void 0).should.be.ok;
      });
      window.React = React;
      this.app = app;
      this.rendered = false;
    };

    Client.prototype.mount = regeneratorRuntime.mark(function _callee(_ref2) {
      var _this = this;
      var window;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (true) switch (_context.prev = _context.next) {
          case 0: window = _ref2.window;
            // jshint ignore:line
            _.dev(function () {
              return window.should.be.an.Object && _this.rendered.should.not.be.ok;
            });
            window.React = React;
            _this.rendered = true;
            _context.next = 6;
            return _this.app.render({ window: window });
          case 6: return _context.abrupt("return", _context.sent);
          case 7:
          case "end": return _context.stop();
        }
      }, _callee, this);
    });
    return Client;
  })();

  _.extend(Client.prototype, /** @lends Client */{
    app: null,
    rendered: null });

  return Client;
};