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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(_ref) {
      var http = _ref.http;

      _.dev(function () {
        return http.shoud.be.an.Object && http.fetch.should.be.a.Function;
      });
      Store.call.apply(Store, [this].concat(Array.from(arguments)));
      this._http = http;
      this._pending = {};
    };

    _extends(HTTPStore, Store);

    _classProps(HTTPStore, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "HTTPStore";
        }
      },
      destroy: {
        writable: true,
        value: function () {
          var _this = this;

          Store.prototype.destroy.call(this);
          // Explicitly nullify pendings
          Object.keys(this._pending).forEach(function (path) {
            _this._pending[path].cancel(new Error("HTTPStore destroy"));
            _this._pending[path] = null;
          });
          // Nullify references
          this._pending = null;
          this._http = null;
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
            this._pending[path] = this._http.fetch(path).cancellable();
            _.dev(function () {
              return _this2._pending[path].then.should.be.a.Function;
            });
          }
          return this._pending[path];
        }
      }
    });

    return HTTPStore;
  })(Store);

  _.extend(HTTPStore.prototype, {
    _http: null,
    _pending: null });

  return HTTPStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFNBQVMsY0FBUyxLQUFLO1FBQXZCLFNBQVMsR0FDRixTQURQLFNBQVMsT0FDUztVQUFSLElBQUksUUFBSixJQUFJOztBQUNoQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDaEMsQ0FBQztBQUprQixBQUtwQixXQUx5QixZQUFMLEtBQUssMkJBS2hCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOzthQVJHLFNBQVMsRUFBUyxLQUFLOztnQkFBdkIsU0FBUztBQVViLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxXQUFXLENBQUM7U0FDcEI7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOzs7QUFkWSxBQWVwQixlQWZ5QixXQWVuQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQixrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUMzRCxrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBQzVCLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOzs7QUFDVixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3JDLGNBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNELGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sT0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7YUFBQSxDQUFDLENBQUM7V0FDNUQ7QUFDRCxpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCOzs7O1dBbkNHLFNBQVM7S0FBUyxLQUFLOzs7O0FBc0M3QixHQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7QUFDNUIsU0FBSyxFQUFFLElBQUk7QUFDWCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFNBQVMsQ0FBQztDQUNsQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuSFRUUFN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIEhUVFBTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGh0dHAgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gaHR0cC5zaG91ZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgaHR0cC5mZXRjaC5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICB0aGlzLl9odHRwID0gaHR0cDtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnSFRUUFN0b3JlJztcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHBlbmRpbmdzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdIVFRQU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLl9odHRwID0gbnVsbDtcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX2h0dHAuZmV0Y2gocGF0aCkuY2FuY2VsbGFibGUoKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcGVuZGluZ1twYXRoXS50aGVuLnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nW3BhdGhdO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEhUVFBTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfaHR0cDogbnVsbCxcbiAgICBfcGVuZGluZzogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIEhUVFBTdG9yZTtcbn07XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==