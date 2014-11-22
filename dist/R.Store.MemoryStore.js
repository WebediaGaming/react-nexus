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

  var _MemoryStore = (function (Store) {
    var _MemoryStore = function _MemoryStore() {
      Store.call(this);
      this._data = {};
    };

    _extends(_MemoryStore, Store);

    _classProps(_MemoryStore, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          Store.prototype.destroy.call(this);
          // Explicitly nullify data
          Object.keys(this._data).forEach(function (path) {
            return _this._data[path] = null;
          });
          // Nullify references
          this._data = null;
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          var _this2 = this;
          return Promise["try"](function () {
            _.dev(function () {
              return path.should.be.a.String;
            });
            _this2._shouldNotBeDestroyed();
            _.dev(function () {
              return _.has(_this2._data, path).should.be.ok;
            });
            return _this2._data[path];
          });
        }
      },
      set: {
        writable: true,
        value: function (path, value) {
          _.dev(function () {
            return path.should.be.a.String && (null === value || _.isObject(value)).should.be.ok;
          });
          this._shouldNotBeDestroyed();
          this._data[path] = value;
          this.propagateUpdate(path, value);
        }
      }
    });

    return _MemoryStore;
  })(Store);

  _.extend(_MemoryStore.prototype, {
    _data: null });

  return _MemoryStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuU3RvcmUuTWVtb3J5U3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixZQUFXLGNBQVMsS0FBSztRQUF6QixZQUFXLEdBQ0osU0FEUCxZQUFXLEdBQ0Q7QUFEVSxBQUV0QixXQUYyQixXQUVwQixDQUFDO0FBQ1IsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDakI7O2FBSkcsWUFBVyxFQUFTLEtBQUs7O2dCQUF6QixZQUFXO0FBTWYsYUFBTzs7ZUFBQSxZQUFHOztBQU5jLEFBT3RCLGVBUDJCLFdBT3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUU1QyxjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOztBQUNWLGlCQUFPLE9BQU8sT0FBSSxDQUFDLFlBQU07QUFDdkIsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTthQUFBLENBQUMsQ0FBQztBQUNyQyxtQkFBSyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDbEQsbUJBQU8sT0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDekIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsU0FBRzs7ZUFBQSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FDbkQsQ0FBQztBQUNGLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25DOzs7O1dBL0JHLFlBQVc7S0FBUyxLQUFLOztBQWtDL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFNBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sWUFBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5NZW1vcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjbGFzcyBNZW1vcnlTdG9yZSBleHRlbmRzIFN0b3JlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLl9kYXRhID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgZGF0YVxyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKVxyXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fZGF0YVtwYXRoXSA9IG51bGwpO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2gocGF0aCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaGFzKHRoaXMuX2RhdGEsIHBhdGgpLnNob3VsZC5iZS5vayk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aF07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChwYXRoLCB2YWx1ZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIChudWxsID09PSB2YWx1ZSB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIHRoaXMuX2RhdGFbcGF0aF0gPSB2YWx1ZTtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoTWVtb3J5U3RvcmUucHJvdG90eXBlLCB7XHJcbiAgICBfZGF0YTogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIE1lbW9yeVN0b3JlO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=