"use strict";

var _slice = Array.prototype.slice;
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
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
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
            this._pending[path] = this._uplink.fetch(path).cancellable();
            _.dev(function () {
              return _this2._pending[path].then.should.be.a.Function;
            });
          }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsT0FDUztVQUFWLE1BQU0sUUFBTixNQUFNOztBQUNsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBRmhDLEFBR3RCLFdBSDJCLFlBQUwsS0FBSyw0QkFHbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7YUFQRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFTZixhQUFPOztlQUFBLFlBQUc7OztBQVRjLEFBVXRCLGVBVjJCLFdBVXJCLFlBQU8sTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7OztXQUdyQyxPQUFPLENBQUMsVUFBQyxFQUFFO21CQUFLLE1BQUssb0JBQW9CLENBQUMsRUFBRSxD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Q0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQTFERyxXQUFXO0tBQVMsS0FBSzs7OztBQTZEL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IHVwbGluayB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlVwbGluaykpO1xyXG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICB0aGlzLl91cGxpbmsgPSB1cGxpbms7XHJcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSB7fTtcclxuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdXBsaW5rU3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZ3NcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucylcclxuICAgICAgLy8gVW5zdWJzY3JpcHRpb25zIGFyZSBtYWRlIGluIGVhY2ggdW5zdWJzY3JpYmVGcm9tIGluIHN1cGVyLmRlc3RvcnlcclxuICAgICAgLy8gKHRoZSBsYXN0IG9uZSBjYWxscyB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tIGF1dG9tYXRpY2FsbHkpLlxyXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbaWRdID0gbnVsbCk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXHJcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdVcGxpbmtTdG9yZSBkZXN0cm95JykpO1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMuX3VwbGluayA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSBudWxsO1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2gocGF0aCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3BlbmRpbmdbcGF0aF0udGhlbi5zaG91bGQuYmUuYS5GdW5jdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xyXG4gICAgICBsZXQgeyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH0gPSBzdXBlci5zdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKTtcclxuICAgICAgaWYoY3JlYXRlZFBhdGgpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdID0gdGhpcy5fdXBsaW5rLnN1YnNjcmliZVRvKHBhdGgsICh2YWx1ZSkgPT4gdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcclxuICAgICAgbGV0IHsgZGVsZXRlZFBhdGggfSA9IHN1cGVyLnVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KTtcclxuICAgICAgaWYoZGVsZXRlZFBhdGgpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XHJcbiAgICAgICAgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0pO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBkZWxldGVkUGF0aCB9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XHJcbiAgICBfdXBsaW5rOiBudWxsLFxyXG4gICAgX3VwbGlua1N1YnNjcmlwdGlvbnM6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBVcGxpbmtTdG9yZTtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9