"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var ActionHandler = require("./R.Dispatcher.ActionHandler")(R);

  var Dispatcher = (function () {
    var Dispatcher = function Dispatcher(actionHandlers) {
      var _this = this;
      if (actionHandlers === undefined) actionHandlers = {};
      _.dev(function () {
        return actionHandlers.should.be.an.Object && Object.keys(actionHandlers).map(function (action) {
          return action.should.be.a.String && actionHandlers[action].should.be.a.Function;
        });
      });
      this.actionHandlers = {};
      Object.keys(actionHandlers).forEach(function (action) {
        return _this.addActionHandler(action, actionHandlers[action]);
      });
    };

    Dispatcher.prototype.destroy = function () {
      var _this2 = this;
      // Explicitly remove all action handlers
      Object.keys(this.actionHandlers).forEach(function (action) {
        return Object.keys(_this2.actionHandlers[action]).forEach(function (k) {
          return _this2.removeActionHandler(_this2.actionHandlers[action][k]);
        });
      });
      // Nullify references
      this.actionHandlers = null;
    };

    Dispatcher.prototype.addActionHandler = function (action, handler) {
      var actionListener = new ActionHandler(action, handler);
      actionListener.pushInto(this.actionHandlers);
      return actionListener;
    };

    Dispatcher.prototype.removeActionHandler = function (actionListener) {
      var _this3 = this;
      _.dev(function () {
        return actionListener.should.be.instanceOf(ActionHandler) && actionListener.isInside(_this3.actionHandlers).should.be.ok;
      });
      actionListener.removeFrom(this.actionHandlers);
    };

    Dispatcher.prototype.dispatch = regeneratorRuntime.mark(function _callee(action, params) {
      var _this4 = this;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (true) switch (_context.prev = _context.next) {
          case 0:
            if (params === undefined) params = {};
            // jshint ignore:line
            _.dev(function () {
              return _this4.actionHandlers[action].should.be.ok;
            });
            _context.next = 4;
            return Object.keys(_this4.actionHandlers[action]) // jshint ignore:line
            .map(function (key) {
              return _this4.actionHandlers[action][key].dispatch(params);
            });
          case 4: return _context.abrupt("return", _context.sent);
          case 5:
          case "end": return _context.stop();
        }
      }, _callee, this);
    });
    return Dispatcher;
  })();

  _.extend(Dispatcher.prototype, {
    actionHandlers: null });

  _.extend(Dispatcher, { ActionHandler: ActionHandler });

  var UplinkDispatcher = require("./R.Dispatcher.UplinkDispatcher")(R, Dispatcher);

  _.extend(Dispatcher, { UplinkDispatcher: UplinkDispatcher });

  return Dispatcher;
};