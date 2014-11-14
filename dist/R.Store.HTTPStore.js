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

  var HTTPStore = (function (Store) {
    var HTTPStore = function HTTPStore(_ref) {
      var http = _ref.http;
      _.dev(function () {
        return http.shoud.be.an.Object && http.fetch.should.be.a.Function;
      });
      Store.call.apply(Store, [this].concat(Array.from(arguments)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5TdG9yZS5IVFRQU3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFNBQVMsY0FBUyxLQUFLO1FBQXZCLFNBQVMsR0FDRixTQURQLFNBQVMsT0FDUztVQUFSLElBQUksUUFBSixJQUFJO0FBQ2hCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUNoQyxDQUFDO0FBSmtCLEFBS3BCLFdBTHlCLFlBQUwsS0FBSywyQkFLaEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7S0FDcEI7O2FBUkcsU0FBUyxFQUFTLEtBQUs7O2dCQUF2QixTQUFTO0FBVWIsb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLFdBQVcsQ0FBQztTQUNwQjs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBZFksQUFlcEIsZUFmeUIsV0FlbkIsT0FBTyxLQUFBLE1BQUUsQ0FBQzs7QUFFaEIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUN6QixPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDakIsa0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7QUFDM0Qsa0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztXQUM1QixDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDbkI7O0FBRUQsV0FBSzs7ZUFBQSxVQUFDLElBQUksRUFBRTs7QUFDVixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3JDLGNBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNELGFBQUMsQ0FBQyxHQUFHLENBQUM7cUJBQU0sT0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7YUFBQSxDQUFDLENBQUM7V0FDNUQ7QUFDRCxpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCOzs7O1dBbkNHLFNBQVM7S0FBUyxLQUFLOztBQXNDN0IsR0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO0FBQzVCLFNBQUssRUFBRSxJQUFJO0FBQ1gsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxTQUFTLENBQUM7Q0FDbEIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLkhUVFBTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSLCBTdG9yZSkge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIEhUVFBTdG9yZSBleHRlbmRzIFN0b3JlIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgaHR0cCB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGh0dHAuc2hvdWQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgaHR0cC5mZXRjaC5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICB0aGlzLl9odHRwID0gaHR0cDtcclxuICAgICAgdGhpcy5fcGVuZGluZyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkge1xyXG4gICAgICByZXR1cm4gJ0hUVFBTdG9yZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgcGVuZGluZ3NcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGVuZGluZylcclxuICAgICAgLmZvckVhY2goKHBhdGgpID0+IHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdLmNhbmNlbChuZXcgRXJyb3IoJ0hUVFBTdG9yZSBkZXN0cm95JykpO1xyXG4gICAgICAgIHRoaXMuX3BlbmRpbmdbcGF0aF0gPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBudWxsO1xyXG4gICAgICB0aGlzLl9odHRwID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgaWYoIXRoaXMuX3BlbmRpbmdbcGF0aF0pIHtcclxuICAgICAgICB0aGlzLl9wZW5kaW5nW3BhdGhdID0gdGhpcy5faHR0cC5mZXRjaChwYXRoKS5jYW5jZWxsYWJsZSgpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3BlbmRpbmdbcGF0aF0udGhlbi5zaG91bGQuYmUuYS5GdW5jdGlvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuX3BlbmRpbmdbcGF0aF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChIVFRQU3RvcmUucHJvdG90eXBlLCB7XHJcbiAgICBfaHR0cDogbnVsbCxcclxuICAgIF9wZW5kaW5nOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gSFRUUFN0b3JlO1xyXG59O1xyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9