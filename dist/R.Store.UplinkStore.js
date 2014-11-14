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

      // Ducktype-check uplink (since we dont have access to the constructor)
      _.dev(function () {
        return uplink.subscribeTo.should.be.a.Function && uplink.unsubscribeFrom.should.be.a.Function && uplink.pull.should.be.a.Function;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsT0FDUztVQUFWLE1BQU0sUUFBTixNQUFNOzs7QUFFbEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUNqRCxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDakMsQ0FBQztBQU5vQixBQU90QixXQVAyQixZQUFMLEtBQUssNEJBT2xCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDL0IsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7S0FDdEI7O2FBWEcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBYWYsYUFBTzs7ZUFBQSxZQUFHOzs7QUFiYyxBQWN0QixlQWQyQixXQWNyQixZQUFPLE1BQUUsQ0FB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O0FBQ2QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDdkcsZ0JBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQWxFRyxXQUFXO0tBQVMsS0FBSzs7OztBQXFFL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IHVwbGluayB9KSB7XHJcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXHJcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zdWJzY3JpYmVUby5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHVwbGluay51bnN1YnNjcmliZUZyb20uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICB1cGxpbmsucHVsbC5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICB0aGlzLl91cGxpbmsgPSB1cGxpbms7XHJcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSB7fTtcclxuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdXBsaW5rU3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZ3NcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9ucylcclxuICAgICAgLy8gVW5zdWJzY3JpcHRpb25zIGFyZSBtYWRlIGluIGVhY2ggdW5zdWJzY3JpYmVGcm9tIGluIHN1cGVyLmRlc3RvcnlcclxuICAgICAgLy8gKHRoZSBsYXN0IG9uZSBjYWxscyB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tIGF1dG9tYXRpY2FsbHkpLlxyXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbaWRdID0gbnVsbCk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXHJcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdVcGxpbmtTdG9yZSBkZXN0cm95JykpO1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMuX3VwbGluayA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSBudWxsO1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2gocGF0aCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5wdWxsKHBhdGgpLmNhbmNlbGxhYmxlKCkudGhlbigodmFsdWUpID0+IHtcclxuICAgICAgICAgIC8vIEFzIHNvb24gYXMgdGhlIHJlc3VsdCBpcyByZWNlaXZlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHBlbmRpbmcgbGlzdC5cclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nW3BhdGhdO1xyXG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3BlbmRpbmdbcGF0aF0udGhlbi5zaG91bGQuYmUuYS5GdW5jdGlvbik7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nW3BhdGhdO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XHJcbiAgICAgIGlmKGNyZWF0ZWRQYXRoKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdLnNob3VsZC5ub3QuYmUub2spO1xyXG4gICAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSA9IHRoaXMuX3VwbGluay5zdWJzY3JpYmVUbyhwYXRoLCAodmFsdWUpID0+IHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9O1xyXG4gICAgfVxyXG5cclxuICAgIHVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KSB7XHJcbiAgICAgIGxldCB7IGRlbGV0ZWRQYXRoIH0gPSBzdXBlci51bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSk7XHJcbiAgICAgIGlmKGRlbGV0ZWRQYXRoKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rLlN1YnNjcmlwdGlvbikpO1xyXG4gICAgICAgIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20odGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKFVwbGlua1N0b3JlLnByb3RvdHlwZSwge1xyXG4gICAgX3VwbGluazogbnVsbCxcclxuICAgIF91cGxpbmtTdWJzY3JpcHRpb25zOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gVXBsaW5rU3RvcmU7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==