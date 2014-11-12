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

  var MemoryStore = (function (Store) {
    var MemoryStore = function MemoryStore() {
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
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
          this.pull(path, { bypassCache: true }).then(function (fetched) {
            return _.dev(function () {
              return _.isEqual(value, fetch).should.be.ok;
            });
          });
        }
      }
    });

    return MemoryStore;
  })(Store);

  _.extend(MemoryStore.prototype, {
    _data: null });

  return MemoryStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsR0FDRDtBQURVLEFBRXRCLFdBRjJCLFlBQUwsS0FBSyw0QkFFbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDakI7O2FBSkcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBTWYsYUFBTzs7ZUFBQSxZQUFHOzs7QUFOYyxBQU90QixlQVAyQixXQU9yQixZQUFPLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsVUFBQyxJQUFJO21CQUFLLE1BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7V0FBQSxDQUFDLENBQUM7O0FBRTVDLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25COztBQUVELG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxhQUFhLENBQUM7U0FDdEI7O0FBRUQsV0FBSzs7ZUFBQSxVQUFDLElBQUksRUFBRTs7O0FBQ1YsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3ZCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFBQSxDQUFDLENBQUM7QUFDckMsbUJBQUsscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2xELG1CQUFPLE9BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3pCLENBQUMsQ0FBQztTQUNKOztBQUVELFNBQUc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87bUJBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDO1dBQUEsQ0FBQyxDQUFDO1NBQzdHOzs7O1dBbkNHLFdBQVc7S0FBUyxLQUFLOzs7O0FBc0MvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsU0FBSyxFQUFFLElBQUksRUFDWixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLk1lbW9yeVN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIE1lbW9yeVN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IGRhdGFcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fZGF0YVtwYXRoXSA9IG51bGwpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnTWVtb3J5U3RvcmUnO1xuICAgIH1cblxuICAgIGZldGNoKHBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5oYXModGhpcy5fZGF0YSwgcGF0aCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIChudWxsID09PSB2YWx1ZSB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIHRoaXMuX2RhdGFbcGF0aF0gPSB2YWx1ZTtcbiAgICAgIHRoaXMucHVsbChwYXRoLCB7IGJ5cGFzc0NhY2hlOiB0cnVlIH0pLnRoZW4oKGZldGNoZWQpID0+IF8uZGV2KCgpID0+IF8uaXNFcXVhbCh2YWx1ZSwgZmV0Y2gpLnNob3VsZC5iZS5vaykpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKE1lbW9yeVN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9kYXRhOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gTWVtb3J5U3RvcmU7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9