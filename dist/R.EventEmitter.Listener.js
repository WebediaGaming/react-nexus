"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
  var _ = R._;

  var _Listener = (function () {
    var _Listener = function _Listener(_ref) {
      var room = _ref.room;
      var handler = _ref.handler;
      _.dev(function () {
        return room.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { room: room, handler: handler, id: _.uniqueId(room) });
    };

    _classProps(_Listener, null, {
      addTo: {
        writable: true,
        value: function (listeners) {
          var _this = this;
          _.dev(function () {
            return listeners.should.be.an.Object;
          });
          if (!listeners[this.room]) {
            listeners[this.room] = {};
          }
          _.dev(function () {
            return listeners[_this.room].should.be.an.Object && listeners[_this.room].should.not.have.property(_this.id);
          });
          listeners[this.room][this.id] = this;
          return Object.keys(listeners[this.room]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (listeners) {
          var _this2 = this;
          _.dev(function () {
            return listeners.should.be.an.Object && listeners.should.have.property(_this2.room) && listeners[_this2.room].should.be.an.Object && listeners[_this2.room].should.have.propery(_this2.id, _this2);
          });
          delete listeners[this.room][this.id];
          if (Object.keys(listeners[this.room]).length === 0) {
            delete listeners[this.room];
            return true;
          }
          return false;
        }
      },
      emit: {
        writable: true,
        value: function (params) {
          if (params === undefined) params = {};
          _.dev(function () {
            return params.should.be.an.Object;
          });
          this.handler.call(null, params);
        }
      }
    });

    return _Listener;
  })();

  _.extend(_Listener.prototype, {
    room: null,
    id: null,
    handler: null });

  return _Listener;
};