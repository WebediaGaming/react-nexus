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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsR0FDRDtBQURVLEFBRXRCLFdBRjJCLFdBRXBCLENBQUM7QUFDUixVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztLQUNqQjs7YUFKRyxXQUFXLEVBQVMsS0FBSzs7Z0JBQXpCLFdBQVc7QUFNZixhQUFPOztlQUFBLFlBQUc7OztBQU5jLEFBT3RCLGVBUDJCLFdBT3JCLFlBQU8sTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxVQUFDLElBQUk7bUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtXQUFBLENBQUMsQ0FBQzs7QUFFNUMsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsV0FBSzs7ZUFBQSxVQUFDLElBQUksRUFBRTs7O0FBQ1YsaUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3ZCLGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFBQSxDQUFDLENBQUM7QUFDckMsbUJBQUsscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2FBQUEsQ0FBQyxDQUFDO0FBQ2xELG1CQUFPLE9BQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ3pCLENBQUMsQ0FBQztTQUNKOztBQUVELFNBQUc7O2VBQUEsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN6QixjQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuQzs7OztXQS9CRyxXQUFXO0tBQVMsS0FBSzs7OztBQWtDL0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO0FBQzlCLFNBQUssRUFBRSxJQUFJLEVBQ1osQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5NZW1vcnlTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcblxyXG4gIGNsYXNzIE1lbW9yeVN0b3JlIGV4dGVuZHMgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSBkYXRhXHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpXHJcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9kYXRhW3BhdGhdID0gbnVsbCk7XHJcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xyXG4gICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5oYXModGhpcy5fZGF0YSwgcGF0aCkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHBhdGgsIHZhbHVlKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgKG51bGwgPT09IHZhbHVlIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgdGhpcy5fZGF0YVtwYXRoXSA9IHZhbHVlO1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZVVwZGF0ZShwYXRoLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChNZW1vcnlTdG9yZS5wcm90b3R5cGUsIHtcclxuICAgIF9kYXRhOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTWVtb3J5U3RvcmU7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==