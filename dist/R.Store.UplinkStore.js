"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R, Store) {
  var _ = R._;

  var UplinkStore = (function (Store) {
    var UplinkStore = function UplinkStore(_ref) {
      var uplink = _ref.uplink;
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.subscribeTo.should.be.a.Function && uplink.unsubscribeFrom.should.be.a.Function && uplink.pull.should.be.a.Function;
      });
      Store.call(this);
      this._uplink = uplink;
      this._uplinkSubscriptions = {};
    };

    _extends(UplinkStore, Store);

    UplinkStore.prototype.destroy = function () {
      var _this = this;
      Store.prototype.destroy.call(this);
      // Explicitly nullify uplinkSubscriptions and pendings
      Object.keys(this._uplinkSubscriptions)
      // Unsubscriptions are made in each unsubscribeFrom in super.destory
      // (the last one calls this._uplink.unsubscribeFrom automatically).
      .forEach(function (id) {
        return _this._uplinkSubscriptions[id] = null;
      });
      // Nullify references
      this._uplink = null;
      this._uplinkSubscriptions = null;
    };

    UplinkStore.prototype.fetch = function (path) {
      this._shouldNotBeDestroyed();
      _.dev(function () {
        return path.should.be.a.String;
      });
      return this._uplink.pull(path);
    };

    UplinkStore.prototype.subscribeTo = function (path, handler) {
      var _this2 = this;
      var _ref2 = Store.prototype.subscribeTo.call(this, path, handler);

      var subscription = _ref2.subscription;
      var createdPath = _ref2.createdPath;
      if (createdPath) {
        _.dev(function () {
          return (_this2._uplinkSubscriptions[subscription.id] === void 0).should.be.ok;
        });
        this._uplinkSubscriptions[subscription.id] = this._uplink.subscribeTo(path, function (value) {
          return _this2.propagateUpdate(path, value);
        });
      }
      return { subscription: subscription, createdPath: createdPath };
    };

    UplinkStore.prototype.unsubscribeFrom = function (_ref3) {
      var _this3 = this;
      var subscription = _ref3.subscription;
      var _ref4 = Store.prototype.unsubscribeFrom.call(this, { subscription: subscription });

      var deletedPath = _ref4.deletedPath;
      if (deletedPath) {
        _.dev(function () {
          return _this3._uplinkSubscriptions[subscription.id].should.be.an.instanceOf(R.Uplink.Subscription);
        });
        this._uplink.unsubscribeFrom(this._uplinkSubscriptions[subscription.id]);
        delete this._uplinkSubscriptions[subscription.id];
      }
      return { subscription: subscription, deletedPath: deletedPath };
    };

    return UplinkStore;
  })(Store);

  _.extend(UplinkStore.prototype, {
    _uplink: null,
    _uplinkSubscriptions: null });

  return UplinkStore;
};