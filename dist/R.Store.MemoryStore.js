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

    return MemoryStore;
  })(Store);

  _.extend(MemoryStore.prototype, {
    _data: null });

  return MemoryStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsV0FBVyxjQUFTLEtBQUs7UUFBekIsV0FBVyxHQUNKLFNBRFAsV0FBVyxHQUNEO0FBRFUsQUFFdEIsV0FGMkIsV0FFcEIsQ0FBQztBQUNSLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0tBQ2pCOzthQUpHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQU1mLGFBQU87O2VBQUEsWUFBRzs7QUFOYyxBQU90QixlQVAyQixXQU9yQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxVQUFDLElBQUk7bUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtXQUFBLENBQUMsQ0FBQzs7QUFFNUMsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLGFBQWEsQ0FBQztTQUN0Qjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOztBQUNWLGlCQUFPLE9BQU8sT0FBSSxDQUFDLFlBQU07QUFDdkIsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTthQUFBLENBQUMsQ0FBQztBQUNyQyxtQkFBSyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFBQSxDQUFDLENBQUM7QUFDbEQsbUJBQU8sT0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDekIsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsU0FBRzs7ZUFBQSxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FDbkQsQ0FBQztBQUNGLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25DOzs7O1dBbkNHLFdBQVc7S0FBUyxLQUFLOztBQXNDL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFNBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5NZW1vcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNsYXNzIE1lbW9yeVN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IGRhdGFcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpXG4gICAgICAuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fZGF0YVtwYXRoXSA9IG51bGwpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnTWVtb3J5U3RvcmUnO1xuICAgIH1cblxuICAgIGZldGNoKHBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiB7XG4gICAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5oYXModGhpcy5fZGF0YSwgcGF0aCkuc2hvdWxkLmJlLm9rKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbcGF0aF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXQocGF0aCwgdmFsdWUpIHtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIChudWxsID09PSB2YWx1ZSB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIHRoaXMuX2RhdGFbcGF0aF0gPSB2YWx1ZTtcbiAgICAgIHRoaXMucHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChNZW1vcnlTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfZGF0YTogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIE1lbW9yeVN0b3JlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==