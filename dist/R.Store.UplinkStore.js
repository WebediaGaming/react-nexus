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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixXQUFXLGNBQVMsS0FBSztRQUF6QixXQUFXLEdBQ0osU0FEUCxXQUFXLE9BQ1M7VUFBVixNQUFNLFFBQU4sTUFBTTs7QUFFbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUNqRCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDakMsQ0FBQztBQU5vQixBQU90QixXQVAyQixXQU9wQixDQUFDO0FBQ1IsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7YUFYRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFhZixhQUFPOztlQUFBLFlBQUc7O0FBYmMsQUFjdEIsZUFkMkIsV0FjckIsT0FBTyxLQUFBLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMs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O3FCQUFNLE9BQUssb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUFBLENBQUMsQ0FBQztBQUN2RyxnQkFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLG1CQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7V0FDbkQ7QUFDRCxpQkFBTyxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDO1NBQ3RDOzs7O1dBbEVHLFdBQVc7S0FBUyxLQUFLOztBQXFFL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIFVwbGlua1N0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsuc3Vic2NyaWJlVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnVuc3Vic2NyaWJlRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB1cGxpbmsucHVsbC5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLl91cGxpbmsgPSB1cGxpbms7XG4gICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zID0ge307XG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHVwbGlua1N1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmdzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zKVxuICAgICAgLy8gVW5zdWJzY3JpcHRpb25zIGFyZSBtYWRlIGluIGVhY2ggdW5zdWJzY3JpYmVGcm9tIGluIHN1cGVyLmRlc3RvcnlcbiAgICAgIC8vICh0aGUgbGFzdCBvbmUgY2FsbHMgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSBhdXRvbWF0aWNhbGx5KS5cbiAgICAgIC5mb3JFYWNoKChpZCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tpZF0gPSBudWxsKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdLmNhbmNlbChuZXcgRXJyb3IoJ1VwbGlua1N0b3JlIGRlc3Ryb3knKSk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSBudWxsO1xuICAgICAgfSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX3VwbGluayA9IG51bGw7XG4gICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl91cGxpbmsucHVsbChwYXRoKS5jYW5jZWxsYWJsZSgpLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgLy8gQXMgc29vbiBhcyB0aGUgcmVzdWx0IGlzIHJlY2VpdmVkLCByZW1vdmUgaXQgZnJvbSB0aGUgcGVuZGluZyBsaXN0LlxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nW3BhdGhdO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSA9IHRoaXMuX3VwbGluay5zdWJzY3JpYmVUbyhwYXRoLCAodmFsdWUpID0+IHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRQYXRoIH0gPSBzdXBlci51bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSk7XG4gICAgICBpZihkZWxldGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XG4gICAgICAgIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20odGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChVcGxpbmtTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfdXBsaW5rOiBudWxsLFxuICAgIF91cGxpbmtTdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rU3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9