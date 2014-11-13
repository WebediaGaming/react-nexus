"use strict";

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
              res = fn.apply(null, Array.from(params));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7O0FBR3hCLE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUM7QUFDbEMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQzVCLE1BQU0sWUFBWSxHQUFHLDBCQUEwQixDQUFDOztBQUVoRCxXQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUU7QUFDOUIsV0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUM5QyxPQUFPLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUNqQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVMsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM3QyxhQUFPLFFBQVEsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFDO0tBQ3RDLENBQUMsQ0FDRCxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pDLFdBQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO0dBQzNEOztBQUVELFdBQVMseUJBQXlCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNuRCxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1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LENBQUM7QUFDdEIsaUJBQUcsR0FBRyxFQUFFLHdCQUFJLE1BQU0sRUFBQyxDQUFDO2FBQ3JCO1dBQ0YsQ0FBQyxDQUFDO0FBQ0gsY0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3hCLGVBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7V0FDMUM7QUFDRCxpQkFBTyxHQUFHLENBQUM7U0FDWjs7OztXQXJERyxNQUFNOzs7OztBQXdEWixTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5Sb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuXG4gIGNvbnN0IG9wdGlvbmFsUGFyYW0gPSAvXFwoKC4qPylcXCkvZztcbiAgY29uc3QgbmFtZWRQYXJhbSA9IC8oXFwoXFw/KT86XFx3Ky9nO1xuICBjb25zdCBzcGxhdFBhcmFtID0gL1xcKlxcdysvZztcbiAgY29uc3QgZXNjYXBlUmVnRXhwID0gL1tcXC17fVxcW1xcXSs/LixcXFxcXFxeJHwjXFxzXS9nO1xuXG4gIGZ1bmN0aW9uIHJvdXRlVG9SZWdFeHAocGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoZXNjYXBlUmVnRXhwLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZShvcHRpb25hbFBhcmFtLCAnKD86JDEpPycpXG4gICAgLnJlcGxhY2UobmFtZWRQYXJhbSwgZnVuY3Rpb24obWF0Y2gsIG9wdGlvbmFsKSB7XG4gICAgICByZXR1cm4gb3B0aW9uYWwgPyBtYXRjaCA6ICcoW14vP10rKSc7XG4gICAgfSlcbiAgICAucmVwbGFjZShzcGxhdFBhcmFtLCAnKFteP10qPyknKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBwYXR0ZXJuICsgJyg/OlxcXFw/KFtcXFxcc1xcXFxTXSopKT8kJyk7XG4gIH1cblxuICBmdW5jdGlvbiBleHRyYWN0RnJhZ21lbnRQYXJhbWV0ZXJzKHJlZ2V4cCwgZnJhZ21lbnQpIHtcbiAgICBsZXQgcGFyYW1zID0gcmVnZXhwLmV4ZWMoZnJhZ21lbnQpLnNsaWNlKDEpO1xuICAgIHJldHVybiBwYXJhbXMubWFwKChpKSA9PiB7XG4gICAgICBsZXQgcGFyYW0gPSBwYXJhbXNbaV07XG4gICAgICBpZihpID09PSBwYXJhbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXR1cm4gcGFyYW0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbSA/IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbSkgOiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgY2xhc3MgUm91dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuX3JvdXRlcyA9IHt9O1xuICAgIH1cblxuICAgIHJvdXRlKHBhdHRlcm4sIGZuKSB7XG4gICAgICBpZighZm4pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fcm91dGVzW3BhdHRlcm5dLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3V0ZXNbcGF0dGVybl07XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9yb3V0ZXNbcGF0dGVybl0uc2hvdWxkLm5vdC5iZS5vayAmJlxuICAgICAgICBmbi5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGlmKHBhdHRlcm4gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdChmbik7XG4gICAgICB9XG4gICAgICBsZXQgcmVnZXhwID0gcm91dGVUb1JlZ0V4cChwYXR0ZXJuKTtcbiAgICAgIHRoaXMuX3JvdXRlc1twYXR0ZXJuXSA9IHsgcmVnZXhwLCBmbiB9O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcm91dGVzKHBhdHRlcm5zKSB7XG4gICAgICBpZighcGF0dGVybnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdXRlcztcbiAgICAgIH1cbiAgICAgIG9iamVjdC5rZXlzKHBhdHRlcm4pLmZvckVhY2goKHBhdHRlcm4pID0+IHRoaXMucm91dGUocGF0dGVybiwgcGF0dGVybnNbcGF0dGVybl0pKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlZmF1bHQoZm4pIHtcbiAgICAgIGlmKCFmbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RlZmF1bHQgPSBmbjtcbiAgICB9XG5cbiAgICBtYXRjaChmcmFnbWVudCkge1xuICAgICAgbGV0IHJlcyA9IG51bGw7XG4gICAgICBvYmplY3Qua2V5cyh0aGlzLl9yb3V0ZXMsIChwYXR0ZXJuKSA9PiB7XG4gICAgICAgIGxldCB7IHJlZ2V4cCwgZm4gfSA9IHRoaXMuX3JvdXRlc1twYXR0ZXJuXTtcbiAgICAgICAgaWYocmVzICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGZyYWdtZW50Lm1hdGNoKHJlZ2V4cCkgIT09IG51bGwpIHtcbiAgICAgICAgICBsZXQgcGFyYW1zID0gZXh0cmFjdEZyYWdtZW50UGFyYW1ldGVycyhyZWdleHAsIGZyYWdtZW50KTtcbiAgICAgICAgICBwYXJhbXMucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgcmVzID0gZm4oLi4ucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZighcmVzICYmIHRoaXMuX2RlZmF1bHQpIHtcbiAgICAgICAgcmVzID0gdGhpcy5fZGVmYXVsdC5jYWxsKG51bGwsIGZyYWdtZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFJvdXRlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=