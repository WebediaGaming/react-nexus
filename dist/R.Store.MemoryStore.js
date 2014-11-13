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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLk1lbW9yeVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixXQUFXLGNBQVMsS0FBSztRQUF6QixXQUFXLEdBQ0osU0FEUCxXQUFXLEdBQ0Q7QUFEVSxBQUV0QixXQUYyQixZQUFMLEtBQUssMkJBRWxCLFNBQVMsR0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0tBQ2pCOzthQUpHLFdBQVcsRUFBUyxLQUFLOztnQkFBekIsV0FBVztBQU1mLGFBQU87O2VBQUEsWUFBRzs7QUFOYyxBQU90QixlQVAyQixXQU9yQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxVQUFDLElBQUk7bUJBQUssTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtXQUFBLENBQUMsQ0FBQzs7QUFFNUMsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLGFBQWEsQ0FBQztTQUN0Qjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOztBQUNWLGlCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBTTtBQUN2QixhQUFDLENBQUMsR0FBRyxDQUFDO3FCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO2FBQUEsQ0FBQyxDQUFDO0FBQ3JDLG1CQUFLLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTthQUFBLENBQUMsQ0FBQztBQUNsRCxtQkFBTyxPQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUN6QixDQUFDLENBQUM7U0FDSjs7QUFFRCxTQUFHOztlQUFBLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUNuRCxDQUFDO0FBQ0YsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDekIsY0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkM7Ozs7V0FuQ0csV0FBVztLQUFTLEtBQUs7O0FBc0MvQixHQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7QUFDOUIsU0FBSyxFQUFFLElBQUksRUFDWixDQUFDLENBQUM7O0FBRUgsU0FBTyxXQUFXLENBQUM7Q0FDcEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLk1lbW9yeVN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgTWVtb3J5U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IGRhdGFcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fZGF0YSlcclxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHRoaXMuX2RhdGFbcGF0aF0gPSBudWxsKTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICByZXR1cm4gJ01lbW9yeVN0b3JlJztcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xyXG4gICAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5oYXModGhpcy5fZGF0YSwgcGF0aCkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtwYXRoXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KHBhdGgsIHZhbHVlKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgKG51bGwgPT09IHZhbHVlIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgdGhpcy5fZGF0YVtwYXRoXSA9IHZhbHVlO1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZVVwZGF0ZShwYXRoLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChNZW1vcnlTdG9yZS5wcm90b3R5cGUsIHtcclxuICAgIF9kYXRhOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTWVtb3J5U3RvcmU7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==