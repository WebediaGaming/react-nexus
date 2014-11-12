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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7OztBQUd4QixNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDO0FBQ2xDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUM1QixNQUFNLFlBQVksR0FBRywwQkFBMEIsQ0FBQzs7QUFFaEQsV0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFO0FBQzlCLFdBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FDOUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FDakMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDN0MsYUFBTyxRQUFRLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQztLQUN0QyxDQUFDLENBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqQyxXQUFPLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztHQUMzRDs7QUFFRCxXQUFTLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDbkQsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFD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QyxDQUFDO0FBQ3RCLGlCQUFHLEdBQUcsRUFBRSx5QkFBSSxNQUFNLEVBQUMsQ0FBQzthQUNyQjtXQUNGLENBQUMsQ0FBQztBQUNILGNBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN4QixlQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1dBQzFDO0FBQ0QsaUJBQU8sR0FBRyxDQUFDO1NBQ1o7Ozs7V0FyREcsTUFBTTs7Ozs7QUF3RFosU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuUm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cblxuICBjb25zdCBvcHRpb25hbFBhcmFtID0gL1xcKCguKj8pXFwpL2c7XG4gIGNvbnN0IG5hbWVkUGFyYW0gPSAvKFxcKFxcPyk/OlxcdysvZztcbiAgY29uc3Qgc3BsYXRQYXJhbSA9IC9cXCpcXHcrL2c7XG4gIGNvbnN0IGVzY2FwZVJlZ0V4cCA9IC9bXFwte31cXFtcXF0rPy4sXFxcXFxcXiR8I1xcc10vZztcblxuICBmdW5jdGlvbiByb3V0ZVRvUmVnRXhwKHBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gcGF0dGVybi5yZXBsYWNlKGVzY2FwZVJlZ0V4cCwgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2Uob3B0aW9uYWxQYXJhbSwgJyg/OiQxKT8nKVxuICAgIC5yZXBsYWNlKG5hbWVkUGFyYW0sIGZ1bmN0aW9uKG1hdGNoLCBvcHRpb25hbCkge1xuICAgICAgcmV0dXJuIG9wdGlvbmFsID8gbWF0Y2ggOiAnKFteLz9dKyknO1xuICAgIH0pXG4gICAgLnJlcGxhY2Uoc3BsYXRQYXJhbSwgJyhbXj9dKj8pJyk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcGF0dGVybiArICcoPzpcXFxcPyhbXFxcXHNcXFxcU10qKSk/JCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gZXh0cmFjdEZyYWdtZW50UGFyYW1ldGVycyhyZWdleHAsIGZyYWdtZW50KSB7XG4gICAgbGV0IHBhcmFtcyA9IHJlZ2V4cC5leGVjKGZyYWdtZW50KS5zbGljZSgxKTtcbiAgICByZXR1cm4gcGFyYW1zLm1hcCgoaSkgPT4ge1xuICAgICAgbGV0IHBhcmFtID0gcGFyYW1zW2ldO1xuICAgICAgaWYoaSA9PT0gcGFyYW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtIHx8IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW0gPyBkZWNvZGVVUklDb21wb25lbnQocGFyYW0pIDogbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGNsYXNzIFJvdXRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLl9yb3V0ZXMgPSB7fTtcbiAgICB9XG5cbiAgICByb3V0ZShwYXR0ZXJuLCBmbikge1xuICAgICAgaWYoIWZuKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3JvdXRlc1twYXR0ZXJuXS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4gdGhpcy5fcm91dGVzW3BhdHRlcm5dO1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcm91dGVzW3BhdHRlcm5dLnNob3VsZC5ub3QuYmUub2sgJiZcbiAgICAgICAgZm4uc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBpZihwYXR0ZXJuID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHQoZm4pO1xuICAgICAgfVxuICAgICAgbGV0IHJlZ2V4cCA9IHJvdXRlVG9SZWdFeHAocGF0dGVybik7XG4gICAgICB0aGlzLl9yb3V0ZXNbcGF0dGVybl0gPSB7IHJlZ2V4cCwgZm4gfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJvdXRlcyhwYXR0ZXJucykge1xuICAgICAgaWYoIXBhdHRlcm5zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXM7XG4gICAgICB9XG4gICAgICBvYmplY3Qua2V5cyhwYXR0ZXJuKS5mb3JFYWNoKChwYXR0ZXJuKSA9PiB0aGlzLnJvdXRlKHBhdHRlcm4sIHBhdHRlcm5zW3BhdHRlcm5dKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkZWZhdWx0KGZuKSB7XG4gICAgICBpZighZm4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHQ7XG4gICAgICB9XG4gICAgICB0aGlzLl9kZWZhdWx0ID0gZm47XG4gICAgfVxuXG4gICAgbWF0Y2goZnJhZ21lbnQpIHtcbiAgICAgIGxldCByZXMgPSBudWxsO1xuICAgICAgb2JqZWN0LmtleXModGhpcy5fcm91dGVzLCAocGF0dGVybikgPT4ge1xuICAgICAgICBsZXQgeyByZWdleHAsIGZuIH0gPSB0aGlzLl9yb3V0ZXNbcGF0dGVybl07XG4gICAgICAgIGlmKHJlcyAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihmcmFnbWVudC5tYXRjaChyZWdleHApICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IHBhcmFtcyA9IGV4dHJhY3RGcmFnbWVudFBhcmFtZXRlcnMocmVnZXhwLCBmcmFnbWVudCk7XG4gICAgICAgICAgcGFyYW1zLnB1c2goZnJhZ21lbnQpO1xuICAgICAgICAgIHJlcyA9IGZuKC4uLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYoIXJlcyAmJiB0aGlzLl9kZWZhdWx0KSB7XG4gICAgICAgIHJlcyA9IHRoaXMuX2RlZmF1bHQuY2FsbChudWxsLCBmcmFnbWVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBSb3V0ZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9