"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");var co = require("co");
co(regeneratorRuntime.mark(function _callee() {
  var myWorld;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (true) switch (_context.prev = _context.next) {
      case 0: myWorld = "world";
        console.warn((function () {
          return "Hello " + myWorld;
        })());
        _context.next = 4;
        return new Promise(function (resolve, reject) {
          return resolve(42) || reject(void 0);
        });
      case 4: _context.t0 = _context.sent;
        console.warn(_context.t0);

        return _context.abrupt("return", 1337);
      case 7:
      case "end": return _context.stop();
    }
  }, _callee, this);
})).call(null, function (err, res) {
  return console.warn(err, res);
});