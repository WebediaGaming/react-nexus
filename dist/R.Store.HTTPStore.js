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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(_ref) {
      var http = _ref.http;

      _.dev(function () {
        return http.shoud.be.an.Object && http.fetch.should.be.a.Function;
      });
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
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
          if (!this._pending[path]) {
            this._pending[path] = http.fetch(path).cancellable();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixTQUFTLGNBQVMsS0FBSztRQUF2QixTQUFTLEdBQ0YsU0FEUCxTQUFTLE9BQ1M7VUFBUixJQUFJLFFBQUosSUFBSTs7QUFDaEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2hDLENBQUM7QUFKa0IsQUFLcEIsV0FMeUIsWUFBTCxLQUFLLDRCQUtoQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7YUFSRyxTQUFTLEVBQVMsS0FBSzs7Z0JBQXZCLFNBQVM7QUFVYixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sV0FBVyxDQUFDO1NBQ3BCOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBZFksQUFlcEIsZUFmeUIsV0FlbkIsWUFBTyxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2pCLGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQzNELGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDNUIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25COztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7OztBQUNWLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDckQsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUFBLENBQUMsQ0FBQztXQUM1RDtBQUNELGlCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7Ozs7V0FsQ0csU0FBUztLQUFTLEtBQUs7Ozs7QUFxQzdCLEdBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtBQUM1QixTQUFLLEVBQUUsSUFBSTtBQUNYLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5IVFRQU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHsgaHR0cCB9KSB7XG4gICAgICBfLmRldigoKSA9PiBodHRwLnNob3VkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBodHRwLmZldGNoLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuX2h0dHAgPSBodHRwO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IHt9O1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdIVFRQU3RvcmUnO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgcGVuZGluZ3NcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdLmNhbmNlbChuZXcgRXJyb3IoJ0hUVFBTdG9yZSBkZXN0cm95JykpO1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuX2h0dHAgPSBudWxsO1xuICAgIH1cblxuICAgIGZldGNoKHBhdGgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBpZighdGhpcy5fcGVuZGluZ1twYXRoXSkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gaHR0cC5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoSFRUUFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9odHRwOiBudWxsLFxuICAgIF9wZW5kaW5nOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gSFRUUFN0b3JlO1xufTtcblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9