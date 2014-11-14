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
      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.subscribeTo.should.be.a.Function && uplink.unsubscribeFrom.should.be.a.Function && uplink.pull.should.be.a.Function;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5TdG9yZS5VcGxpbmtTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxPQUNTO1VBQVYsTUFBTSxRQUFOLE1BQU07O0FBRWxCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDakQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2pDLENBQUM7QUFOb0IsQUFPdEIsV0FQMkIsWUFBTCxLQUFLLDJCQU9sQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixVQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ3RCOzthQVhHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQWFmLGFBQU87O2VBQUEsWUFBRzs7QUFiYyxBQWN0QixlQWQyQixXQWNyQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVo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QUNkLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sT0FBSyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQUEsQ0FBQyxDQUFDO0FBQ3ZHLGdCQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekUsbUJBQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztXQUNuRDtBQUNELGlCQUFPLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUM7U0FDdEM7Ozs7V0FsRUcsV0FBVztLQUFTLEtBQUs7O0FBcUUvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsV0FBTyxFQUFFLElBQUk7QUFDYix3QkFBb0IsRUFBRSxJQUFJLEVBQzNCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuVXBsaW5rU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuICBjbGFzcyBVcGxpbmtTdG9yZSBleHRlbmRzIFN0b3JlIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcclxuICAgICAgLy8gRHVja3R5cGUtY2hlY2sgdXBsaW5rIChzaW5jZSB3ZSBkb250IGhhdmUgYWNjZXNzIHRvIHRoZSBjb25zdHJ1Y3RvcilcclxuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnN1YnNjcmliZVRvLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgdXBsaW5rLnVuc3Vic2NyaWJlRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHVwbGluay5wdWxsLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgIHRoaXMuX3VwbGluayA9IHVwbGluaztcclxuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IHt9O1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB1cGxpbmtTdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nc1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zKVxyXG4gICAgICAvLyBVbnN1YnNjcmlwdGlvbnMgYXJlIG1hZGUgaW4gZWFjaCB1bnN1YnNjcmliZUZyb20gaW4gc3VwZXIuZGVzdG9yeVxyXG4gICAgICAvLyAodGhlIGxhc3Qgb25lIGNhbGxzIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20gYXV0b21hdGljYWxseSkuXHJcbiAgICAgIC5mb3JFYWNoKChpZCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tpZF0gPSBudWxsKTtcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGVuZGluZylcclxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdLmNhbmNlbChuZXcgRXJyb3IoJ1VwbGlua1N0b3JlIGRlc3Ryb3knKSk7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5fdXBsaW5rID0gbnVsbDtcclxuICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICByZXR1cm4gJ1VwbGlua1N0b3JlJztcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gdGhpcy5fdXBsaW5rLnB1bGwocGF0aCkuY2FuY2VsbGFibGUoKS50aGVuKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgLy8gQXMgc29vbiBhcyB0aGUgcmVzdWx0IGlzIHJlY2VpdmVkLCByZW1vdmUgaXQgZnJvbSB0aGUgcGVuZGluZyBsaXN0LlxyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3BlbmRpbmdbcGF0aF07XHJcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcGVuZGluZ1twYXRoXS50aGVuLnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcclxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xyXG4gICAgICBsZXQgeyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH0gPSBzdXBlci5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcclxuICAgICAgaWYoY3JlYXRlZFBhdGgpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdID0gdGhpcy5fdXBsaW5rLnN1YnNjcmliZVRvKHBhdGgsICh2YWx1ZSkgPT4gdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcclxuICAgICAgbGV0IHsgZGVsZXRlZFBhdGggfSA9IHN1cGVyLnVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KTtcclxuICAgICAgaWYoZGVsZXRlZFBhdGgpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XHJcbiAgICAgICAgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBkZWxldGVkUGF0aCB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XHJcbiAgICBfdXBsaW5rOiBudWxsLFxyXG4gICAgX3VwbGlua1N1YnNjcmlwdGlvbnM6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBVcGxpbmtTdG9yZTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9