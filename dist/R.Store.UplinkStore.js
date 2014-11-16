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
      this._pending = null;
    };

    _extends(UplinkStore, Store);

    _classProps(UplinkStore, null, {
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
              return _this3._uplinkSubscriptions[subscription.id].should.not.be.ok;
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

    return UplinkStore;
  })(Store);

  _.extend(UplinkStore.prototype, {
    _uplink: null,
    _uplinkSubscriptions: null });

  return UplinkStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxPQUNTO1VBQVYsTUFBTSxRQUFOLE1BQU07O0FBRWxCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDakQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2pDLENBQUM7QUFOb0IsQUFPdEIsV0FQMkIsV0FPcEIsQ0FBQztBQUNSLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDL0IsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7S0FDdEI7O2FBWEcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBYWYsYUFBTzs7ZUFBQSxZQUFHOztBQWJjLEFBY3RCLGVBZDJCLFdBY3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQzs7O1dBR3JDLE9BQU8sQ0FBQyxV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QUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ3ZHLGdCQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekUsbUJBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUNuRDtBQUNELGlCQUFPLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7U0FDdEM7Ozs7V0E5REcsV0FBVztLQUFTLEtBQUs7O0FBaUUvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsV0FBTyxFQUFFLElBQUk7QUFDYix3QkFBb0IsRUFBRSxJQUFJLEVBQzNCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuVXBsaW5rU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjbGFzcyBVcGxpbmtTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHVwbGluayB9KSB7XG4gICAgICAvLyBEdWNrdHlwZS1jaGVjayB1cGxpbmsgKHNpbmNlIHdlIGRvbnQgaGF2ZSBhY2Nlc3MgdG8gdGhlIGNvbnN0cnVjdG9yKVxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnN1YnNjcmliZVRvLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHVwbGluay51bnN1YnNjcmliZUZyb20uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnB1bGwuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5fdXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB1cGxpbmtTdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nc1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucylcbiAgICAgIC8vIFVuc3Vic2NyaXB0aW9ucyBhcmUgbWFkZSBpbiBlYWNoIHVuc3Vic2NyaWJlRnJvbSBpbiBzdXBlci5kZXN0b3J5XG4gICAgICAvLyAodGhlIGxhc3Qgb25lIGNhbGxzIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20gYXV0b21hdGljYWxseSkuXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbaWRdID0gbnVsbCk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdVcGxpbmtTdG9yZSBkZXN0cm95JykpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl91cGxpbmsgPSBudWxsO1xuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5wdWxsKHBhdGgpLmNhbmNlbGxhYmxlKCkudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAvLyBBcyBzb29uIGFzIHRoZSByZXN1bHQgaXMgcmVjZWl2ZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBwZW5kaW5nIGxpc3QuXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3BlbmRpbmdbcGF0aF0udGhlbi5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5fcGVuZGluZ1twYXRoXTtcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKSB7XG4gICAgICBsZXQgeyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH0gPSBzdXBlci5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcbiAgICAgIGlmKGNyZWF0ZWRQYXRoKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXS5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdID0gdGhpcy5fdXBsaW5rLnN1YnNjcmliZVRvKHBhdGgsICh2YWx1ZSkgPT4gdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSkge1xuICAgICAgbGV0IHsgZGVsZXRlZFBhdGggfSA9IHN1cGVyLnVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KTtcbiAgICAgIGlmKGRlbGV0ZWRQYXRoKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlVwbGluay5TdWJzY3JpcHRpb24pKTtcbiAgICAgICAgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0pO1xuICAgICAgICBkZWxldGUgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBkZWxldGVkUGF0aCB9O1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua1N0b3JlLnByb3RvdHlwZSwge1xuICAgIF91cGxpbms6IG51bGwsXG4gICAgX3VwbGlua1N1YnNjcmlwdGlvbnM6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBVcGxpbmtTdG9yZTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=