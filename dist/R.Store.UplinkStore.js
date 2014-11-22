"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

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

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R, Store) {
  var _ = R._;

  var _UplinkStore = (function (Store) {
    var _UplinkStore = function _UplinkStore(_ref) {
      var uplink = _ref.uplink;
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.subscribeTo.should.be.a.Function && uplink.unsubscribeFrom.should.be.a.Function && uplink.pull.should.be.a.Function;
      });
      Store.call(this);
      this._uplink = uplink;
      this._uplinkSubscriptions = {};
      this._pending = {};
    };

    _extends(_UplinkStore, Store);

    _classProps(_UplinkStore, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          Store.prototype.destroy.call(this);
          // Explicitly nullify uplinkSubscriptions and pendings
          Object.keys(this._uplinkSubscriptions)
          // Unsubscriptions are made in each unsubscribeFrom in super.destory
          // (the last one calls this._uplink.unsubscribeFrom automatically).
          .forEach(function (id) {
            return _this._uplinkSubscriptions[id] = null;
          });
          Object.keys(this._pending).forEach(function (path) {
            _this._pending[path].cancel(new Error("UplinkStore destroy"));
            _this._pending[path] = null;
          });
          // Nullify references
          this._uplink = null;
          this._uplinkSubscriptions = null;
          this._pending = null;
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          var _this2 = this;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String;
          });
          if (!this._pending[path]) {
            this._pending[path] = this._uplink.pull(path).cancellable().then(function (value) {
              // As soon as the result is received, remove it from the pending list.
              delete _this2._pending[path];
              return value;
            });
          }
          _.dev(function () {
            return _this2._pending[path].then.should.be.a.Function;
          });
          return this._pending[path];
        }
      },
      subscribeTo: {
        writable: true,
        value: function (path, handler) {
          var _this3 = this;
          var _ref2 = Store.prototype.subscribeTo.call(this, path, handler);

          var subscription = _ref2.subscription;
          var createdPath = _ref2.createdPath;
          if (createdPath) {
            _.dev(function () {
              return _this3._uplinkSubscriptions.should.not.have.property(subscription.id);
            });
            this._uplinkSubscriptions[subscription.id] = this._uplink.subscribeTo(path, function (value) {
              return _this3.propagateUpdate(path, value);
            });
          }
          return { subscription: subscription, createdPath: createdPath };
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (_ref3) {
          var _this4 = this;
          var subscription = _ref3.subscription;
          var _ref4 = Store.prototype.unsubscribeFrom.call(this, { subscription: subscription });

          var deletedPath = _ref4.deletedPath;
          if (deletedPath) {
            _.dev(function () {
              return _this4._uplinkSubscriptions[subscription.id].should.be.an.instanceOf(R.Uplink.Subscription);
            });
            this._uplink.unsubscribeFrom(this._uplinkSubscriptions[subscription.id]);
            delete this._uplinkSubscriptions[subscription.id];
          }
          return { subscription: subscription, deletedPath: deletedPath };
        }
      }
    });

    return _UplinkStore;
  })(Store);

  _.extend(_UplinkStore.prototype, {
    _uplink: null,
    _uplinkSubscriptions: null,
    _pending: null });

  return _UplinkStore;
};
//# sourceMappingURL=data:application/json;base64,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QSxDQUFDLENBQUM7QUFDdkcsZ0JBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQTlERyxZQUFXO0tBQVMsS0FBSzs7QUFpRS9CLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBVyxDQUFDLFNBQVMsRUFBRTtBQUM5QixXQUFPLEVBQUUsSUFBSTtBQUNiLHdCQUFvQixFQUFFLElBQUk7QUFDMUIsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxZQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNsYXNzIFVwbGlua1N0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsuc3Vic2NyaWJlVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnVuc3Vic2NyaWJlRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB1cGxpbmsucHVsbC5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLl91cGxpbmsgPSB1cGxpbms7XG4gICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zID0ge307XG4gICAgICB0aGlzLl9wZW5kaW5nID0ge307XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB1cGxpbmtTdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nc1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucylcbiAgICAgIC8vIFVuc3Vic2NyaXB0aW9ucyBhcmUgbWFkZSBpbiBlYWNoIHVuc3Vic2NyaWJlRnJvbSBpbiBzdXBlci5kZXN0b3J5XG4gICAgICAvLyAodGhlIGxhc3Qgb25lIGNhbGxzIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20gYXV0b21hdGljYWxseSkuXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbaWRdID0gbnVsbCk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdVcGxpbmtTdG9yZSBkZXN0cm95JykpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl91cGxpbmsgPSBudWxsO1xuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5wdWxsKHBhdGgpLmNhbmNlbGxhYmxlKCkudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAvLyBBcyBzb29uIGFzIHRoZSByZXN1bHQgaXMgcmVjZWl2ZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBwZW5kaW5nIGxpc3QuXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3BlbmRpbmdbcGF0aF0udGhlbi5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5fcGVuZGluZ1twYXRoXTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKSB7XG4gICAgICBsZXQgeyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH0gPSBzdXBlci5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcbiAgICAgIGlmKGNyZWF0ZWRQYXRoKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMuc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KHN1YnNjcmlwdGlvbi5pZCkpO1xuICAgICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0gPSB0aGlzLl91cGxpbmsuc3Vic2NyaWJlVG8ocGF0aCwgKHZhbHVlKSA9PiB0aGlzLnByb3BhZ2F0ZVVwZGF0ZShwYXRoLCB2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9O1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KSB7XG4gICAgICBsZXQgeyBkZWxldGVkUGF0aCB9ID0gc3VwZXIudW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pO1xuICAgICAgaWYoZGVsZXRlZFBhdGgpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rLlN1YnNjcmlwdGlvbikpO1xuICAgICAgICB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tKHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF07XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGRlbGV0ZWRQYXRoIH07XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XG4gICAgX3VwbGluazogbnVsbCxcbiAgICBfdXBsaW5rU3Vic2NyaXB0aW9uczogbnVsbCxcbiAgICBfcGVuZGluZzogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIFVwbGlua1N0b3JlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==