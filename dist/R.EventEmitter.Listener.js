"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;

  var Listener = (function () {
    var Listener = function Listener(_ref) {
      var room = _ref.room;
      var handler = _ref.handler;
      _.dev(function () {
        return room.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { room: room, handler: handler, id: _.uniqueId(room) });
    };

    Listener.prototype.addTo = function (listeners) {
      var _this = this;
      _.dev(function () {
        return listeners.should.be.an.Object;
      });
      if (!listeners[this.room]) {
        listeners[this.room] = {};
      }
      _.dev(function () {
        return listeners[_this.room].should.be.an.Object && (listeners[_this.room][_this.id] === void 0).should.be.ok;
      });
      listeners[this.room][this.id] = this;
      return Object.keys(listeners[this.room]).length === 1;
    };

    Listener.prototype.removeFrom = function (listeners) {
      var _this2 = this;
      _.dev(function () {
        return listeners.should.be.an.Object && (listeners[_this2.room] !== void 0).should.be.ok && listeners[_this2.room].should.be.an.Object && (listeners[_this2.room][_this2.id] !== void 0).should.be.ok && listeners[_this2.room][_this2.id].should.be.exactly(_this2);
      });
      delete listeners[this.room][this.id];
      if (Object.keys(listeners[this.room]).length === 0) {
        delete listeners[this.room];
        return true;
      }
      return false;
    };

    Listener.prototype.emit = function (params) {
      if (params === undefined) params = {};
      _.dev(function () {
        return params.should.be.an.Object;
      });
      this.handler.call(null, params);
    };

    return Listener;
  })();

  _.extend(Listener.prototype, {
    room: null,
    id: null,
    handler: null });

  return Listener;
};