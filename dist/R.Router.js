"use strict";

var _slice = Array.prototype.slice;
var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var should = R.should;

  var optionalParam = /\((.*?)\)/g;
  var namedParam = /(\(\?)?:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  function routeToRegExp(pattern) {
    pattern = pattern.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function (match, optional) {
      return optional ? match : "([^/?]+)";
    }).replace(splatParam, "([^?]*?)");
    return new RegExp("^" + pattern + "(?:\\?([\\s\\S]*))?$");
  }

  function extractFragmentParameters(regexp, fragment) {
    var params = regexp.exec(fragment).slice(1);
    return params.map(function (i) {
      var param = params[i];
      if (i === params.length - 1) {
        return param || null;
      }
      return param ? decodeURIComponent(param) : null;
    });
  }

  var Router = (function () {
    var Router = function Router() {
      this._routes = {};
    };

    _classProps(Router, null, {
      route: {
        writable: true,
        value: function (pattern, fn) {
          var _this = this;

          if (!fn) {
            _.dev(function () {
              return _this._routes[pattern].should.be.ok;
            });
            return this._routes[pattern];
          }
          _.dev(function () {
            return _this._routes[pattern].should.not.be.ok && fn.should.be.a.Function;
          });
          if (pattern === null) {
            return this.default(fn);
          }
          var regexp = routeToRegExp(pattern);
          this._routes[pattern] = { regexp: regexp, fn: fn };
          return this;
        }
      },
      routes: {
        writable: true,
        value: function (patterns) {
          var _this2 = this;

          if (!patterns) {
            return this._routes;
          }
          object.keys(pattern).forEach(function (pattern) {
            return _this2.route(pattern, patterns[pattern]);
          });
          return this;
        }
      },
      default: {
        writable: true,
        value: function (fn) {
          if (!fn) {
            return this._default;
          }
          this._default = fn;
        }
      },
      match: {
        writable: true,
        value: function (fragment) {
          var _this3 = this;

          var res = null;
          object.keys(this._routes, function (pattern) {
            var regexp = _this3._routes[pattern].regexp;
            var fn = _this3._routes[pattern].fn;

            if (res !== null) {
              return;
            }
            if (fragment.match(regexp) !== null) {
              var params = extractFragmentParameters(regexp, fragment);
              params.push(fragment);
              res = fn.apply(null, _slice.call(params));
            }
          });
          if (!res && this._default) {
            res = this._default.call(null, fragment);
          }
          return res;
        }
      }
    });

    return Router;
  })();

  return Router;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7OztBQUd4QixNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDO0FBQ2xDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUM1QixNQUFNLFlBQVksR0FBRywwQkFBMEIsQ0FBQzs7QUFFaEQsV0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFO0FBQzlCLFdBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FDOUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FDakMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0MsYUFBTyxRQUFRLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQztLQUN0QyxDQUFDLENBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqQyxXQUFPLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztHQUMzRDs7QUFFRCxXQUFTLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDbkQsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFD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QyxDQUFDO0FBQ3RCLGlCQUFHLEdBQUcsRUFBRSx5QkFBSSxNQUFNLEVBQUMsQ0FBQzthQUNyQjtXQUNGLENBQUMsQ0FBQztBQUNILGNBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN4QixlQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsaUJBQU8sR0FBRyxDQUFDO1NBQ1o7Ozs7V0FyREcsTUFBTTs7Ozs7QUF3RFosU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuUm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuXHJcbiAgY29uc3Qgb3B0aW9uYWxQYXJhbSA9IC9cXCgoLio/KVxcKS9nO1xyXG4gIGNvbnN0IG5hbWVkUGFyYW0gPSAvKFxcKFxcPyk/OlxcdysvZztcclxuICBjb25zdCBzcGxhdFBhcmFtID0gL1xcKlxcdysvZztcclxuICBjb25zdCBlc2NhcGVSZWdFeHAgPSAvW1xcLXt9XFxbXFxdKz8uLFxcXFxcXF4kfCNcXHNdL2c7XHJcblxyXG4gIGZ1bmN0aW9uIHJvdXRlVG9SZWdFeHAocGF0dGVybikge1xyXG4gICAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZShlc2NhcGVSZWdFeHAsICdcXFxcJCYnKVxyXG4gICAgLnJlcGxhY2Uob3B0aW9uYWxQYXJhbSwgJyg/OiQxKT8nKVxyXG4gICAgLnJlcGxhY2UobmFtZWRQYXJhbSwgZnVuY3Rpb24obWF0Y2gsIG9wdGlvbmFsKSB7XHJcbiAgICAgIHJldHVybiBvcHRpb25hbCA/IG1hdGNoIDogJyhbXi8/XSspJztcclxuICAgIH0pXHJcbiAgICAucmVwbGFjZShzcGxhdFBhcmFtLCAnKFteP10qPyknKTtcclxuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHBhdHRlcm4gKyAnKD86XFxcXD8oW1xcXFxzXFxcXFNdKikpPyQnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV4dHJhY3RGcmFnbWVudFBhcmFtZXRlcnMocmVnZXhwLCBmcmFnbWVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHJlZ2V4cC5leGVjKGZyYWdtZW50KS5zbGljZSgxKTtcclxuICAgIHJldHVybiBwYXJhbXMubWFwKChpKSA9PiB7XHJcbiAgICAgIGxldCBwYXJhbSA9IHBhcmFtc1tpXTtcclxuICAgICAgaWYoaSA9PT0gcGFyYW1zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICByZXR1cm4gcGFyYW0gfHwgbnVsbDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGFyYW0gPyBkZWNvZGVVUklDb21wb25lbnQocGFyYW0pIDogbnVsbDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xhc3MgUm91dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLl9yb3V0ZXMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICByb3V0ZShwYXR0ZXJuLCBmbikge1xyXG4gICAgICBpZighZm4pIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9yb3V0ZXNbcGF0dGVybl0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm91dGVzW3BhdHRlcm5dO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3JvdXRlc1twYXR0ZXJuXS5zaG91bGQubm90LmJlLm9rICYmXHJcbiAgICAgICAgZm4uc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgaWYocGF0dGVybiA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHQoZm4pO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCByZWdleHAgPSByb3V0ZVRvUmVnRXhwKHBhdHRlcm4pO1xyXG4gICAgICB0aGlzLl9yb3V0ZXNbcGF0dGVybl0gPSB7IHJlZ2V4cCwgZm4gfTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcm91dGVzKHBhdHRlcm5zKSB7XHJcbiAgICAgIGlmKCFwYXR0ZXJucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXM7XHJcbiAgICAgIH1cclxuICAgICAgb2JqZWN0LmtleXMocGF0dGVybikuZm9yRWFjaCgocGF0dGVybikgPT4gdGhpcy5yb3V0ZShwYXR0ZXJuLCBwYXR0ZXJuc1twYXR0ZXJuXSkpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkZWZhdWx0KGZuKSB7XHJcbiAgICAgIGlmKCFmbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2RlZmF1bHQgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaChmcmFnbWVudCkge1xyXG4gICAgICBsZXQgcmVzID0gbnVsbDtcclxuICAgICAgb2JqZWN0LmtleXModGhpcy5fcm91dGVzLCAocGF0dGVybikgPT4ge1xyXG4gICAgICAgIGxldCB7IHJlZ2V4cCwgZm4gfSA9IHRoaXMuX3JvdXRlc1twYXR0ZXJuXTtcclxuICAgICAgICBpZihyZXMgIT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoZnJhZ21lbnQubWF0Y2gocmVnZXhwKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgbGV0IHBhcmFtcyA9IGV4dHJhY3RGcmFnbWVudFBhcmFtZXRlcnMocmVnZXhwLCBmcmFnbWVudCk7XHJcbiAgICAgICAgICBwYXJhbXMucHVzaChmcmFnbWVudCk7XHJcbiAgICAgICAgICByZXMgPSBmbiguLi5wYXJhbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGlmKCFyZXMgJiYgdGhpcy5fZGVmYXVsdCkge1xyXG4gICAgICAgIHJlcyA9IHRoaXMuX2RlZmF1bHQuY2FsbChudWxsLCBmcmFnbWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBSb3V0ZXI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==