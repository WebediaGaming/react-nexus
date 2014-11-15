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
    var HTTPStore = function HTTPStore(fetch) {
      _.dev(function () {
        return fetch.should.be.a.Function;
      });
      Store.call(this);
      this._fetch = fetch;
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
          this._fetch = null;
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
            this._pending[path] = this._fetch.fetch(path).cancellable();
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
    _fetch: null,
    _pending: null });

  return HTTPStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsU0FBUyxjQUFTLEtBQUs7UUFBdkIsU0FBUyxHQUNGLFNBRFAsU0FBUyxDQUNELEtBQUssRUFBRTtBQUNqQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUFDLENBQUM7QUFGcEIsQUFHcEIsV0FIeUIsV0FHbEIsQ0FBQztBQUNSLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOzthQU5HLFNBQVMsRUFBUyxLQUFLOztnQkFBdkIsU0FBUztBQVFiLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxXQUFXLENBQUM7U0FDcEI7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOztBQVpZLEFBYXBCLGVBYnlCLFdBYW5CLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2pCLGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQzNELGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDNUIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7O0FBQ1YsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUNyQyxjQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QixnQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM1RCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE9BQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO2FBQUEsQ0FBQyxDQUFDO1dBQzVEO0FBQ0QsaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1Qjs7OztXQWpDRyxTQUFTO0tBQVMsS0FBSzs7QUFvQzdCLEdBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtBQUM1QixVQUFNLEVBQUUsSUFBSTtBQUNaLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5IVFRQU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKGZldGNoKSB7XG4gICAgICBfLmRldigoKSA9PiBmZXRjaC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5fZmV0Y2ggPSBmZXRjaDtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnSFRUUFN0b3JlJztcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHBlbmRpbmdzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdIVFRQU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLl9mZXRjaCA9IG51bGw7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl9mZXRjaC5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoSFRUUFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9mZXRjaDogbnVsbCxcbiAgICBfcGVuZGluZzogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIEhUVFBTdG9yZTtcbn07XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==