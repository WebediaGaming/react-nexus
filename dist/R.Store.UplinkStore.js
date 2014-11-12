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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsT0FDUztVQUFWLE1BQU0sUUFBTixNQUFNOztBQUNsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBRmhDLEFBR3RCLFdBSDJCLFlBQUwsS0FBSyw0QkFHbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7YUFQRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFTZixhQUFPOztlQUFBLFlBQUc7OztBQVRjLEFBVXRCLGVBVjJCLFdBVXJCLFlBQU8sTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7OztXQUdyQyxPQUFPLENBQUMsVUFBQyxFQUFFO21CQUFLLE1BQUssb0JBQW9CLENBQUMsRUFBRSxD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Q0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQTFERyxXQUFXO0tBQVMsS0FBSzs7OztBQTZEL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIFVwbGlua1N0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlVwbGluaykpO1xuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuX3VwbGluayA9IHVwbGluaztcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdXBsaW5rU3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZ3NcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMpXG4gICAgICAvLyBVbnN1YnNjcmlwdGlvbnMgYXJlIG1hZGUgaW4gZWFjaCB1bnN1YnNjcmliZUZyb20gaW4gc3VwZXIuZGVzdG9yeVxuICAgICAgLy8gKHRoZSBsYXN0IG9uZSBjYWxscyB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tIGF1dG9tYXRpY2FsbHkpLlxuICAgICAgLmZvckVhY2goKGlkKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW2lkXSA9IG51bGwpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGVuZGluZylcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0uY2FuY2VsKG5ldyBFcnJvcignVXBsaW5rU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fdXBsaW5rID0gbnVsbDtcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ1VwbGlua1N0b3JlJztcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSA9IHRoaXMuX3VwbGluay5zdWJzY3JpYmVUbyhwYXRoLCAodmFsdWUpID0+IHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRQYXRoIH0gPSBzdXBlci51bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSk7XG4gICAgICBpZihkZWxldGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XG4gICAgICAgIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20odGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChVcGxpbmtTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfdXBsaW5rOiBudWxsLFxuICAgIF91cGxpbmtTdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rU3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9