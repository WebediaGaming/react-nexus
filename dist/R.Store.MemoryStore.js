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

  var MemoryStore = (function (Store) {
    var MemoryStore = function MemoryStore() {
      Store.call(this);
      this._data = {};
    };

    _extends(MemoryStore, Store);

    _classProps(MemoryStore, null, {
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
      getDisplayName: {
        writable: true,
        value: function () {
          return "MemoryStore";
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          var _this2 = this;
          return Promise.try(function () {
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

    return MemoryStore;
  })(Store);

  _.extend(MemoryStore.prototype, {
    _data: null });

  return MemoryStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixXQUFXLGNBQVMsS0FBSztRQUF6QixXQUFXLEdBQ0osU0FEUCxXQUFXLEdBQ0Q7QUFEVSxBQUV0QixXQUYyQixXQUVwQixDQUFDO0FBQ1IsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDakI7O2FBSkcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBTWYsYUFBTzs7ZUFBQSxZQUFHOztBQU5jLEFBT3RCLGVBUDJCLFdBT3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUU1QyxjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sYUFBYSxDQUFDO1NBQ3RCOztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7O0FBQ1YsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3ZCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFBQSxDQUFDLENBQUM7QUFDckMsbUJBQUsscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2xELG1CQUFPLE9BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3pCLENBQUMsQ0FBQztTQUNKOztBQUVELFNBQUc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuQzs7OztXQW5DRyxXQUFXO0tBQVMsS0FBSzs7QUFzQy9CLEdBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUM5QixTQUFLLEVBQUUsSUFBSSxFQUNaLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuTWVtb3J5U3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgTWVtb3J5U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgZGF0YVxuICAgICAgT2JqZWN0LmtleXModGhpcy5fZGF0YSlcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9kYXRhW3BhdGhdID0gbnVsbCk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdNZW1vcnlTdG9yZSc7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgICBfLmRldigoKSA9PiBfLmhhcyh0aGlzLl9kYXRhLCBwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldChwYXRoLCB2YWx1ZSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgKG51bGwgPT09IHZhbHVlIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgdGhpcy5fZGF0YVtwYXRoXSA9IHZhbHVlO1xuICAgICAgdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKE1lbW9yeVN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9kYXRhOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gTWVtb3J5U3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9