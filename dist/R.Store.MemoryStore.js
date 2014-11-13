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
      Store.call.apply(Store, [this].concat(Array.from(arguments)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxHQUNEO0FBRFUsQUFFdEIsV0FGMkIsWUFBTCxLQUFLLDJCQUVsQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztLQUNqQjs7YUFKRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFNZixhQUFPOztlQUFBLFlBQUc7OztBQU5jLEFBT3RCLGVBUDJCLFdBT3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUU1QyxjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sYUFBYSxDQUFDO1NBQ3RCOztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7OztBQUNWLGlCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBTTtBQUN2QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2FBQUEsQ0FBQyxDQUFDO0FBQ3JDLG1CQUFLLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTthQUFBLENBQUMsQ0FBQztBQUNsRCxtQkFBTyxPQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUN6QixDQUFDLENBQUM7U0FDSjs7QUFFRCxTQUFHOztlQUFBLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUNuRCxDQUFDO0FBQ0YsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDekIsY0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkM7Ozs7V0FuQ0csV0FBVztLQUFTLEtBQUs7Ozs7QUFzQy9CLEdBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUM5QixTQUFLLEVBQUUsSUFBSSxFQUNaLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuTWVtb3J5U3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgTWVtb3J5U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgZGF0YVxuICAgICAgT2JqZWN0LmtleXModGhpcy5fZGF0YSlcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9kYXRhW3BhdGhdID0gbnVsbCk7XG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcbiAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdNZW1vcnlTdG9yZSc7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IHtcbiAgICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgICBfLmRldigoKSA9PiBfLmhhcyh0aGlzLl9kYXRhLCBwYXRoKS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldChwYXRoLCB2YWx1ZSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgKG51bGwgPT09IHZhbHVlIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgdGhpcy5fZGF0YVtwYXRoXSA9IHZhbHVlO1xuICAgICAgdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKE1lbW9yeVN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9kYXRhOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gTWVtb3J5U3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9