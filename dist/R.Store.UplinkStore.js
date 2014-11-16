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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxPQUNTO1VBQVYsTUFBTSxRQUFOLE1BQU07O0FBRWxCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDakQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2pDLENBQUM7QUFOb0IsQUFPdEIsV0FQMkIsV0FPcEIsQ0FBQztBQUNSLFVBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDL0IsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7S0FDdEI7O2FBWEcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBYWYsYUFBTzs7ZUFBQSxZQUFHOztBQWJjLEFBY3RCLGVBZDJCLFdBY3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQzs7O1dBR3JDLE9BQU8sQ0FBQyxV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QUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFBQSxDQUFDLENBQUM7QUFDdkcsZ0JBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxtQkFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25EO0FBQ0QsaUJBQU8sRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQztTQUN0Qzs7OztXQWxFRyxXQUFXO0tBQVMsS0FBSzs7QUFxRS9CLEdBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUM5QixXQUFPLEVBQUUsSUFBSTtBQUNiLHdCQUFvQixFQUFFLElBQUksRUFDM0IsQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5VcGxpbmtTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNsYXNzIFVwbGlua1N0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgdXBsaW5rIH0pIHtcbiAgICAgIC8vIER1Y2t0eXBlLWNoZWNrIHVwbGluayAoc2luY2Ugd2UgZG9udCBoYXZlIGFjY2VzcyB0byB0aGUgY29uc3RydWN0b3IpXG4gICAgICBfLmRldigoKSA9PiB1cGxpbmsuc3Vic2NyaWJlVG8uc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdXBsaW5rLnVuc3Vic2NyaWJlRnJvbS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICB1cGxpbmsucHVsbC5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLl91cGxpbmsgPSB1cGxpbms7XG4gICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zID0ge307XG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHVwbGlua1N1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmdzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zKVxuICAgICAgLy8gVW5zdWJzY3JpcHRpb25zIGFyZSBtYWRlIGluIGVhY2ggdW5zdWJzY3JpYmVGcm9tIGluIHN1cGVyLmRlc3RvcnlcbiAgICAgIC8vICh0aGUgbGFzdCBvbmUgY2FsbHMgdGhpcy5fdXBsaW5rLnVuc3Vic2NyaWJlRnJvbSBhdXRvbWF0aWNhbGx5KS5cbiAgICAgIC5mb3JFYWNoKChpZCkgPT4gdGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tpZF0gPSBudWxsKTtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdLmNhbmNlbChuZXcgRXJyb3IoJ1VwbGlua1N0b3JlIGRlc3Ryb3knKSk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSBudWxsO1xuICAgICAgfSk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX3VwbGluayA9IG51bGw7XG4gICAgICB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl91cGxpbmsucHVsbChwYXRoKS5jYW5jZWxsYWJsZSgpLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgLy8gQXMgc29vbiBhcyB0aGUgcmVzdWx0IGlzIHJlY2VpdmVkLCByZW1vdmUgaXQgZnJvbSB0aGUgcGVuZGluZyBsaXN0LlxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nW3BhdGhdO1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgbGV0IHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9ID0gc3VwZXIuc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcik7XG4gICAgICBpZihjcmVhdGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICAgIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXSA9IHRoaXMuX3VwbGluay5zdWJzY3JpYmVUbyhwYXRoLCAodmFsdWUpID0+IHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcbiAgICAgIGxldCB7IGRlbGV0ZWRQYXRoIH0gPSBzdXBlci51bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSk7XG4gICAgICBpZihkZWxldGVkUGF0aCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl91cGxpbmtTdWJzY3JpcHRpb25zW3N1YnNjcmlwdGlvbi5pZF0uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5VcGxpbmsuU3Vic2NyaXB0aW9uKSk7XG4gICAgICAgIHRoaXMuX3VwbGluay51bnN1YnNjcmliZUZyb20odGhpcy5fdXBsaW5rU3Vic2NyaXB0aW9uc1tzdWJzY3JpcHRpb24uaWRdKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3VwbGlua1N1YnNjcmlwdGlvbnNbc3Vic2NyaXB0aW9uLmlkXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChVcGxpbmtTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfdXBsaW5rOiBudWxsLFxuICAgIF91cGxpbmtTdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gVXBsaW5rU3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9