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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxPQUNTO1VBQVYsTUFBTSxRQUFOLE1BQU07O0FBQ2xCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7QUFGaEMsQUFHdEIsV0FIMkIsWUFBTCxLQUFLLDJCQUdsQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixVQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0tBQ3RCOzthQVBHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQVNmLGFBQU87O2VBQUEsWUFBRzs7O0FBVGMsQUFVdEIsZUFWMkIsV0FVckIsT0FBTyxLQUFBLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDOzs7V0FHckMsT0FBTyxDQUFDLFVBQUMsRUFBRTttQkFBSyxNQUFLLG9CQUFvQixDQUFDLEVB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Q0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQTFERyxXQUFXO0tBQVMsS0FBSzs7OztBQTZEL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFdBQU8sRUFBRSxJQUFJO0FBQ2Isd0JBQW9CLEVBQUUsSUFBSSxFQUMzQixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlVwbGlua1N0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIFVwbGlua1N0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHVwbGluay5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLlVwbGluaykpO1xuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuX3VwbGluayA9IHVwbGluaztcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdXBsaW5rU3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZ3NcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMpXG4gICAgICAvLyBVbnN1YnNjcmlwdGlvbnMgYXJlIG1hZGUgaW4gZWFjaCB1bnN1YnNjcmliZUZyb20gaW4gc3VwZXIuZGVzdG9yeVxuICAgICAgLy8gKHRoZSBsYXN0IG9uZSBjYWxscyB0aGlzLl91cGxpbmsudW5zdWJzY3JpYmVGcm9tIGF1dG9tYXRpY2FsbHkpLlxuICAgICAgLmZvckVhY2goKGlkKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW2lkXSA9IG51bGwpO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGVuZGluZylcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0uY2FuY2VsKG5ldyBFcnJvcignVXBsaW5rU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fdXBsaW5rID0gbnVsbDtcbiAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ1VwbGlua1N0b3JlJztcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX3VwbGluay5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSA9IHRoaXMuX3VwbGluay5zdWJzY3JpYmVUbyhwYXRoLCAodmFsdWUpID0+IHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRQYXRoIH0gPSBzdXBlci51bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSk7XG4gICAgICBpZihkZWxldGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XG4gICAgICAgIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20odGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChVcGxpbmtTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfdXBsaW5rOiBudWxsLFxuICAgIF91cGxpbmtTdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rU3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9