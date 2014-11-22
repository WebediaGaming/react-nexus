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

    return UplinkStore;
  })(Store);

  _.extend(UplinkStore.prototype, {
    _uplink: null,
    _uplinkSubscriptions: null });

  return UplinkStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsT0FDUztVQUFWLE1BQU0sUUFBTixNQUFNOzs7QUFFbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUNqRCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDakMsQ0FBQztBQU5vQixBQU90QixXQVAyQixXQU9wQixDQUFDO0FBQ1IsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN0Qjs7YUFYRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFhZixhQUFPOztlQUFBLFlBQUc7OztBQWJjLEFBY3RCLGVBZDJCLFdBY3JCLFlBQU8sTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7OztXQUdyQyxPQUFP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Q0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDdkcsZ0JBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQTlERyxXQUFXO0tBQVMsS0FBSzs7OztBQWlFL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xuICAgICAgLy8gRHVja3R5cGUtY2hlY2sgdXBsaW5rIChzaW5jZSB3ZSBkb250IGhhdmUgYWNjZXNzIHRvIHRoZSBjb25zdHJ1Y3RvcilcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zdWJzY3JpYmVUby5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB1cGxpbmsudW5zdWJzY3JpYmVGcm9tLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHVwbGluay5wdWxsLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuX3VwbGluayA9IHVwbGluaztcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdXBsaW5rU3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZ3NcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMpXG4gICAgICAvLyBVbnN1YnNjcmlwdGlvbnMgYXJlIG1hZGUgaW4gZWFjaCB1bnN1YnNjcmliZUZyb20gaW4gc3VwZXIuZGVzdG9yeVxuICAgICAgLy8gKHRoZSBsYXN0IG9uZSBjYWxscyB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tIGF1dG9tYXRpY2FsbHkpLlxuICAgICAgLmZvckVhY2goKGlkKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW2lkXSA9IG51bGwpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGVuZGluZylcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0uY2FuY2VsKG5ldyBFcnJvcignVXBsaW5rU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fdXBsaW5rID0gbnVsbDtcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl91cGxpbmsucHVsbChwYXRoKS5jYW5jZWxsYWJsZSgpLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgLy8gQXMgc29vbiBhcyB0aGUgcmVzdWx0IGlzIHJlY2VpdmVkLCByZW1vdmUgaXQgZnJvbSB0aGUgcGVuZGluZyBsaXN0LlxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nW3BhdGhdO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zLnNob3VsZC5ub3QuaGF2ZS5wcm9wZXJ0eShzdWJzY3JpcHRpb24uaWQpKTtcbiAgICAgICAgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdID0gdGhpcy5fdXBsaW5rLnN1YnNjcmliZVRvKHBhdGgsICh2YWx1ZSkgPT4gdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSkge1xuICAgICAgbGV0IHsgZGVsZXRlZFBhdGggfSA9IHN1cGVyLnVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KTtcbiAgICAgIGlmKGRlbGV0ZWRQYXRoKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXS5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlVwbGluay5TdWJzY3JpcHRpb24pKTtcbiAgICAgICAgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0pO1xuICAgICAgICBkZWxldGUgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBkZWxldGVkUGF0aCB9O1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFVwbGlua1N0b3JlLnByb3RvdHlwZSwge1xuICAgIF91cGxpbms6IG51bGwsXG4gICAgX3VwbGlua1N1YnNjcmlwdGlvbnM6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBVcGxpbmtTdG9yZTtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=