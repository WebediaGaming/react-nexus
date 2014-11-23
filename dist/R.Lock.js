"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
  var _ = R._;

  var _Lock = (function () {
    var _Lock = function _Lock() {
      this._acquired = false;
      this._queue = [];
    };

    _classProps(_Lock, null, {
      acquire: {
        writable: true,
        value: function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
            if (!_this._acquired) {
              _this._acquired = true;
              return resolve();
            } else {
              return _this._queue.push({ resolve: resolve, reject: reject });
            }
          });
        }
      },
      release: {
        writable: true,
        value: function () {
          var _this2 = this;
          _.dev(function () {
            return _this2._acquired.should.be.ok;
          });
          if (this._queue.length > 0) {
            var resolve = this._queue[0].resolve;
            this._queue.shift();
            resolve();
          } else {
            this._acquired = false;
          }
        }
      },
      perform: {
        writable: true,
        value: regeneratorRuntime.mark(function _callee(fn) {
          var _this3 = this;
          var res;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0: _context.next = 2;
                return _this3.acquire();
              case 2: _context.next = 4;
                return fn();
              case 4: res = _context.sent;
                // jshint ignore:line
                _this3.release();
                return _context.abrupt("return", res);
              case 7:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      }
    });

    return _Lock;
  })();

  _.extend(_Lock.prototype, {
    _acquired: null,
    _queue: null });

  return _Lock;
};