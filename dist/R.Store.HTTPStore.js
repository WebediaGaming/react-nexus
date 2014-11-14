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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(_ref) {
      var http = _ref.http;

      _.dev(function () {
        return http.shoud.be.an.Object && http.fetch.should.be.a.Function;
      });
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
      this._http = http;
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
          this._http = null;
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
            this._pending[path] = this._http.fetch(path).cancellable();
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
    _http: null,
    _pending: null });

  return HTTPStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLkhUVFBTdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixTQUFTLGNBQVMsS0FBSztRQUF2QixTQUFTLEdBQ0YsU0FEUCxTQUFTLE9BQ1M7VUFBUixJQUFJLFFBQUosSUFBSTs7QUFDaEIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ2hDLENBQUM7QUFKa0IsQUFLcEIsV0FMeUIsWUFBTCxLQUFLLDRCQUtoQixTQUFTLEdBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7YUFSRyxTQUFTLEVBQVMsS0FBSzs7Z0JBQXZCLFNBQVM7QUFVYixvQkFBYzs7ZUFBQSxZQUFHO0FBQ2YsaUJBQU8sV0FBVyxDQUFDO1NBQ3BCOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBZFksQUFlcEIsZUFmeUIsV0FlbkIsWUFBTyxNQUFFLENBQUM7O0FBRWhCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2pCLGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQzNELGtCQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDNUIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25COztBQUVELFdBQUs7O2VBQUEsVUFBQyxJQUFJLEVBQUU7OztBQUNWLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDckMsY0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDM0QsYUFBQyxDQUFDLEdBQUcsQ0FBQztxQkFBTSxPQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUFBLENBQUMsQ0FBQztXQUM1RDtBQUNELGlCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7Ozs7V0FuQ0csU0FBUztLQUFTLEtBQUs7Ozs7QUFzQzdCLEdBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtBQUM1QixTQUFLLEVBQUUsSUFBSTtBQUNYLFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sU0FBUyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5IVFRQU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuICBjbGFzcyBIVFRQU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IGh0dHAgfSkge1xyXG4gICAgICBfLmRldigoKSA9PiBodHRwLnNob3VkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGh0dHAuZmV0Y2guc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgdGhpcy5faHR0cCA9IGh0dHA7XHJcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHtcclxuICAgICAgcmV0dXJuICdIVFRQU3RvcmUnO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgICAgLy8gRXhwbGljaXRseSBudWxsaWZ5IHBlbmRpbmdzXHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BlbmRpbmcpXHJcbiAgICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXS5jYW5jZWwobmV3IEVycm9yKCdIVFRQU3RvcmUgZGVzdHJveScpKTtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gbnVsbDtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xyXG4gICAgICB0aGlzLl9wZW5kaW5nID0gbnVsbDtcclxuICAgICAgdGhpcy5faHR0cCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2gocGF0aCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgIGlmKCF0aGlzLl9wZW5kaW5nW3BhdGhdKSB7XHJcbiAgICAgICAgdGhpcy5fcGVuZGluZ1twYXRoXSA9IHRoaXMuX2h0dHAuZmV0Y2gocGF0aCkuY2FuY2VsbGFibGUoKTtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nW3BhdGhdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoSFRUUFN0b3JlLnByb3RvdHlwZSwge1xyXG4gICAgX2h0dHA6IG51bGwsXHJcbiAgICBfcGVuZGluZzogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIEhUVFBTdG9yZTtcclxufTtcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==