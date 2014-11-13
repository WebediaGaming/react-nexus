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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxHQUNEO0FBRFUsQUFFdEIsV0FGMkIsWUFBTCxLQUFLLDJCQUVsQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztLQUNqQjs7YUFKRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFNZixhQUFPOztlQUFBLFlBQUc7OztBQU5jLEFBT3RCLGVBUDJCLFdBT3JCLE9BQU8sS0FBQSxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDdEIsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUU1QyxjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sYUFBYSxDQUFDO1NBQ3RCOztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7OztBQUNWLGlCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBTTtBQUN2QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2FBQUEsQ0FBQyxDQUFDO0FBQ3JDLG1CQUFLLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTthQUFBLENBQUMsQ0FBQztBQUNsRCxtQkFBTyxPQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUN6QixDQUFDLENBQUM7U0FDSjs7QUFFRCxTQUFHOztlQUFBLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUNuRCxDQUFDO0FBQ0YsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDekIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO21CQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQztXQUFBLENBQUMsQ0FBQztTQUM3Rzs7OztXQW5DRyxXQUFXO0tBQVMsS0FBSzs7OztBQXNDL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFNBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5NZW1vcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBNZW1vcnlTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBkYXRhXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHRoaXMuX2RhdGFbcGF0aF0gPSBudWxsKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICByZXR1cm4gJ01lbW9yeVN0b3JlJztcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaGFzKHRoaXMuX2RhdGEsIHBhdGgpLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW3BhdGhdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0KHBhdGgsIHZhbHVlKSB7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAobnVsbCA9PT0gdmFsdWUgfHwgXy5pc09iamVjdCh2YWx1ZSkpLnNob3VsZC5iZS5va1xuICAgICAgKTtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICB0aGlzLl9kYXRhW3BhdGhdID0gdmFsdWU7XG4gICAgICB0aGlzLnB1bGwocGF0aCwgeyBieXBhc3NDYWNoZTogdHJ1ZSB9KS50aGVuKChmZXRjaGVkKSA9PiBfLmRldigoKSA9PiBfLmlzRXF1YWwodmFsdWUsIGZldGNoKS5zaG91bGQuYmUub2spKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChNZW1vcnlTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfZGF0YTogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIE1lbW9yeVN0b3JlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==