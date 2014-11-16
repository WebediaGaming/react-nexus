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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(fetch) {
      _.dev(function () {
        return fetch.should.be.a.Function;
      });
      Store.call(this);
      this._fetch = fetch;
      this._pending = {};
    };

    _extends(HTTPStore, Store);

    _classProps(HTTPStore, null, {
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

    return HTTPStore;
  })(Store);

  _.extend(HTTPStore.prototype, {
    _fetch: null,
    _pending: null });

  return HTTPStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLFNBQVMsY0FBUyxLQUFLO1FBQXZCLFNBQVMsR0FDRixTQURQLFNBQVMsQ0FDRCxLQUFLLEVBQUU7QUFDakIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FBQyxDQUFDO0FBRnBCLEFBR3BCLFdBSHlCLFdBR2xCLENBQUM7QUFDUixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7YUFORyxTQUFTLEVBQVMsS0FBSzs7Z0JBQXZCLFNBQVM7QUFRYixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sV0FBVyxDQUFDO1NBQ3BCOztBQUVELGFBQU87O2VBQUEsWUFBRzs7QUFaWSxBQWFwQixlQWJ5QixXQWFuQixPQUFPLEtBQUEsTUFBRSxDQUFDOztBQUVoQixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQixrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUMzRCxrQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBQzVCLENBQUMsQ0FBQzs7QUFFSCxjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7QUFFRCxXQUFLOztlQUFBLFVBQUMsSUFBSSxFQUFFOztBQUNWLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDckMsY0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDNUQsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUFBLENBQUMsQ0FBQztXQUM1RDtBQUNELGlCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7Ozs7V0FqQ0csU0FBUztLQUFTLEtBQUs7O0FBb0M3QixHQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7QUFDNUIsVUFBTSxFQUFFLElBQUk7QUFDWixZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFNBQVMsQ0FBQztDQUNsQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuSFRUUFN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIsIFN0b3JlKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgSFRUUFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKGZldGNoKSB7XG4gICAgICBfLmRldigoKSA9PiBmZXRjaC5zaG91bGQuYmUuYS5GdW5jdGlvbik7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5fZmV0Y2ggPSBmZXRjaDtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcbiAgICAgIHJldHVybiAnSFRUUFN0b3JlJztcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHBlbmRpbmdzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9wZW5kaW5nKVxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdIVFRQU3RvcmUgZGVzdHJveScpKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fcGVuZGluZyA9IG51bGw7XG4gICAgICB0aGlzLl9mZXRjaCA9IG51bGw7XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSB0aGlzLl9mZXRjaC5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoSFRUUFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9mZXRjaDogbnVsbCxcbiAgICBfcGVuZGluZzogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIEhUVFBTdG9yZTtcbn07XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==