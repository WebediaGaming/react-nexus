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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsU0FBUyxjQUFTLEtBQUs7UUFBdkIsU0FBUyxHQUNGLFNBRFAsU0FBUyxPQUNTO1VBQVIsSUFBSSxRQUFKLElBQUk7QUFDaEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2hDLENBQUM7QUFKa0IsQUFLcEIsV0FMeUIsWUFBTCxLQUFLLDJCQUtoQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7YUFSRyxTQUFTLEVBQVMsS0FBSzs7Z0JBQXZCLFNBQVM7QUFVYixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sV0FBVyxDQUFDO1NBQ3BCOztBQUVELGFBQU87O2VBQUEsWUFBRzs7QUFkWSxBQWVwQixlQWZ5QixXQWVuQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQixrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUMzRCxrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBQzVCLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOztBQUNWLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDckMsY0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDM0QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUFBLENBQUMsQ0FBQztXQUM1RDtBQUNELGlCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7Ozs7V0FuQ0csU0FBUztLQUFTLEtBQUs7O0FBc0M3QixHQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7QUFDNUIsU0FBSyxFQUFFLElBQUk7QUFDWCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFNBQVMsQ0FBQztDQUNsQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuSFRUUFN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoeyBodHRwIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gaHR0cC5zaG91ZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBodHRwLmZldGNoLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgIHRoaXMuX2h0dHAgPSBodHRwO1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgIHJldHVybiAnSFRUUFN0b3JlJztcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBwZW5kaW5nc1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxyXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0uY2FuY2VsKG5ldyBFcnJvcignSFRUUFN0b3JlIGRlc3Ryb3knKSk7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2h0dHAgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoKHBhdGgpIHtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICBpZighdGhpcy5fcGVuZGluZ1twYXRoXSkge1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl9odHRwLmZldGNoKHBhdGgpLmNhbmNlbGxhYmxlKCk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcGVuZGluZ1twYXRoXS50aGVuLnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5fcGVuZGluZ1twYXRoXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKEhUVFBTdG9yZS5wcm90b3R5cGUsIHtcclxuICAgIF9odHRwOiBudWxsLFxyXG4gICAgX3BlbmRpbmc6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBIVFRQU3RvcmU7XHJcbn07XHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=