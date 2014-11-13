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
  var should = R.should;

  var UplinkStore = (function (Store) {
    var UplinkStore = function UplinkStore(_ref) {
      var uplink = _ref.uplink;

      _.dev(function () {
        return uplink.should.be.an.instanceOf(R.Uplink);
      });
      Store.call.apply(Store, [this].concat(Array.from(arguments)));
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
      getDisplayName: {
        writable: true,
        value: function () {
          return "UplinkStore";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxPQUNTO1VBQVYsTUFBTSxRQUFOLE1BQU07O0FBQ2xCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7QUFGaEMsQUFHdEIsV0FIMkIsWUFBTCxLQUFLLDJCQUdsQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixVQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ3RCOzthQVBHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQVNmLGFBQU87O2VBQUEsWUFBRzs7O0FBVGMsQUFVdEIsZUFWMkIsV0FVckIsT0FBTyxLQUFBLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDOzs7V0FHckMsT0FBTyxDQUFDLFVBQUMsRUFBRTttQkFBSyxNQUFLLG9CQUFvQixDQUFDLEVB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RSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUFBLENBQUMsQ0FBQztBQUN2RyxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLG1CQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7V0FDbkQ7QUFDRCxpQkFBTyxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ3RDOzs7O1dBOURHLFdBQVc7S0FBUyxLQUFLOzs7O0FBaUUvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsV0FBTyxFQUFFLElBQUk7QUFDYix3QkFBb0IsRUFBRSxJQUFJLEVBQzNCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuVXBsaW5rU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rKSk7XG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgdGhpcy5fdXBsaW5rID0gdXBsaW5rO1xuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB1cGxpbmtTdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nc1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucylcbiAgICAgIC8vIFVuc3Vic2NyaXB0aW9ucyBhcmUgbWFkZSBpbiBlYWNoIHVuc3Vic2NyaWJlRnJvbSBpbiBzdXBlci5kZXN0b3J5XG4gICAgICAvLyAodGhlIGxhc3Qgb25lIGNhbGxzIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20gYXV0b21hdGljYWxseSkuXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbaWRdID0gbnVsbCk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdVcGxpbmtTdG9yZSBkZXN0cm95JykpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl91cGxpbmsgPSBudWxsO1xuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnVXBsaW5rU3RvcmUnO1xuICAgIH1cblxuICAgIGZldGNoKHBhdGgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICBpZighdGhpcy5fcGVuZGluZ1twYXRoXSkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gdGhpcy5fdXBsaW5rLnB1bGwocGF0aCkuY2FuY2VsbGFibGUoKS50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIC8vIEFzIHNvb24gYXMgdGhlIHJlc3VsdCBpcyByZWNlaXZlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHBlbmRpbmcgbGlzdC5cbiAgICAgICAgICBkZWxldGUgdGhpcy5fcGVuZGluZ1twYXRoXTtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcGVuZGluZ1twYXRoXS50aGVuLnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcbiAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nW3BhdGhdO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIGxldCB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfSA9IHN1cGVyLnN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpO1xuICAgICAgaWYoY3JlYXRlZFBhdGgpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0gPSB0aGlzLl91cGxpbmsuc3Vic2NyaWJlVG8ocGF0aCwgKHZhbHVlKSA9PiB0aGlzLnByb3BhZ2F0ZVVwZGF0ZShwYXRoLCB2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9O1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KSB7XG4gICAgICBsZXQgeyBkZWxldGVkUGF0aCB9ID0gc3VwZXIudW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pO1xuICAgICAgaWYoZGVsZXRlZFBhdGgpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rLlN1YnNjcmlwdGlvbikpO1xuICAgICAgICB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tKHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF07XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGRlbGV0ZWRQYXRoIH07XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XG4gICAgX3VwbGluazogbnVsbCxcbiAgICBfdXBsaW5rU3Vic2NyaXB0aW9uczogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIFVwbGlua1N0b3JlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==