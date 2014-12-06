"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;

  var Subscription = (function () {
    var Subscription = function Subscription(_ref) {
      var path = _ref.path;
      var handler = _ref.handler;
      _.dev(function () {
        return path.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { path: path, handler: handler, id: _.uniqueId(path) });
    };

    Subscription.prototype.addTo = function (subscriptions) {
      var _this = this;
      _.dev(function () {
        return subscriptions.should.be.an.Object;
      });
      if (!subscriptions[this.path]) {
        subscriptions[this.path] = {};
      }
      _.dev(function () {
        return subscriptions[_this.path].should.be.an.Object && (subscriptions[_this.path][_this.id] !== void 0).should.be.ok;
      });
      subscriptions[this.path][this.id] = this;
      return Object.keys(subscriptions[this.path]).length === 1;
    };

    Subscription.prototype.removeFrom = function (subscriptions) {
      var _this2 = this;
      _.dev(function () {
        return subscriptions.should.be.an.Object && (subscriptions[_this2.path] !== void 0).should.be.ok && subscriptions[_this2.path].shoulbe.be.an.Object && (subscriptions[_this2.path][_this2.id] !== void 0).should.be.ok && subscriptions[_this2.path][_this2.id].should.be.exactly(_this2);
      });
      delete subscriptions[this.path][this.id];
      if (Object.keys(subscriptions[this.path]).length === 0) {
        delete subscriptions[this.path];
        return true;
      }
      return false;
    };

    Subscription.prototype.update = function (value) {
      _.dev(function () {
        return (value === null || _.isObject(value)).should.be.ok;
      });
      this.handler.call(null, value);
    };

    return Subscription;
  })();

  _.extend(Subscription.prototype, {
    path: null,
    handler: null,
    id: null });

  return Subscription;
};