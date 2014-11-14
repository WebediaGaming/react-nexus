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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsR0FDRDtBQURVLEFBRXRCLFdBRjJCLFlBQUwsS0FBSyw0QkFFbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDakI7O2FBSkcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBTWYsYUFBTzs7ZUFBQSxZQUFHOzs7QUFOYyxBQU90QixlQVAyQixXQU9yQixZQUFPLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsVUFBQyxJQUFJO21CQUFLLE1BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7V0FBQSxDQUFDLENBQUM7O0FBRTVDLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25COztBQUVELG9CQUFjOztlQUFBLFlBQUc7QUFDZixpQkFBTyxhQUFhLENBQUM7U0FDdEI7O0FBRUQsV0FBSzs7ZUFBQSxVQUFDLElBQUksRUFBRTs7O0FBQ1YsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3ZCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFBQSxDQUFDLENBQUM7QUFDckMsbUJBQUsscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2xELG1CQUFPLE9BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3pCLENBQUMsQ0FBQztTQUNKOztBQUVELFNBQUc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuQzs7OztXQW5DRyxXQUFXO0tBQVMsS0FBSzs7OztBQXNDL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFNBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5NZW1vcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIE1lbW9yeVN0b3JlIGV4dGVuZHMgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBkYXRhXHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpXHJcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9kYXRhW3BhdGhdID0gbnVsbCk7XHJcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xyXG4gICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdNZW1vcnlTdG9yZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2gocGF0aCkge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaGFzKHRoaXMuX2RhdGEsIHBhdGgpLnNob3VsZC5iZS5vayk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aF07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldChwYXRoLCB2YWx1ZSkge1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIChudWxsID09PSB2YWx1ZSB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIHRoaXMuX2RhdGFbcGF0aF0gPSB2YWx1ZTtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoTWVtb3J5U3RvcmUucHJvdG90eXBlLCB7XHJcbiAgICBfZGF0YTogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIE1lbW9yeVN0b3JlO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=