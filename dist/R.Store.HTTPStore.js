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

  var _HTTPStore = (function (Store) {
    var _HTTPStore = function _HTTPStore(fetch) {
      _.dev(function () {
        return fetch.should.be.a.Function;
      });
      Store.call(this);
      this._fetch = fetch;
      this._pending = {};
    };

    _extends(_HTTPStore, Store);

    _classProps(_HTTPStore, null, {
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

    return _HTTPStore;
  })(Store);

  _.extend(_HTTPStore.prototype, {
    _fetch: null,
    _pending: null });

  return _HTTPStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuU3RvcmUuSFRUUFN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsVUFBUyxjQUFTLEtBQUs7UUFBdkIsVUFBUyxHQUNGLFNBRFAsVUFBUyxDQUNELEtBQUssRUFBRTtBQUNqQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUFDLENBQUM7QUFGcEIsQUFHcEIsV0FIeUIsV0FHbEIsQ0FBQztBQUNSLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOzthQU5HLFVBQVMsRUFBUyxLQUFLOztnQkFBdkIsVUFBUztBQVFiLG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxXQUFXLENBQUM7U0FDcEI7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOztBQVpZLEFBYXBCLGVBYnlCLFdBYW5CLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2pCLGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQzNELGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDNUIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7O0FBQ1YsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUNyQyxjQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QixnQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM1RCxhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLE9BQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO2FBQUEsQ0FBQyxDQUFDO1dBQzVEO0FBQ0QsaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1Qjs7OztXQWpDRyxVQUFTO0tBQVMsS0FBSzs7QUFvQzdCLEdBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxDQUFDLFNBQVMsRUFBRTtBQUM1QixVQUFNLEVBQUUsSUFBSTtBQUNaLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sVUFBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5IVFRQU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuXHJcbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoZmV0Y2gpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gZmV0Y2guc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLl9mZXRjaCA9IGZldGNoO1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XHJcbiAgICAgIHJldHVybiAnSFRUUFN0b3JlJztcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBwZW5kaW5nc1xyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxyXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0uY2FuY2VsKG5ldyBFcnJvcignSFRUUFN0b3JlIGRlc3Ryb3knKSk7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2ZldGNoID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gdGhpcy5fZmV0Y2guZmV0Y2gocGF0aCkuY2FuY2VsbGFibGUoKTtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nW3BhdGhdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoSFRUUFN0b3JlLnByb3RvdHlwZSwge1xyXG4gICAgX2ZldGNoOiBudWxsLFxyXG4gICAgX3BlbmRpbmc6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBIVFRQU3RvcmU7XHJcbn07XHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=