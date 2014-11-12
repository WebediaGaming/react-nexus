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

  var Subscription = (function () {
    var Subscription = function Subscription(_ref) {
      var path = _ref.path;
      var handler = _ref.handler;

      _.dev(function () {
        return path.should.be.a.String && handler.should.be.a.Function;
      });
      var id = _.uniqueId(path);
      _.extend(this, { path: path, handler: handler, id: id });
    };

    _classProps(Subscription, null, {
      addTo: {
        writable: true,
        value: function (subscriptions) {
          var _this = this;

          _.dev(function () {
            return subscriptions.should.be.an.Object;
          });
          if (!subscriptions[this.path]) {
            subscriptions[this.path] = {};
          }
          _.dev(function () {
            return subscriptions[_this.path].should.be.an.Object && subscriptions[_this.path][_this.id].should.not.be.ok;
          });
          subscriptions[this.path][this.id] = this;
          return Object.keys(subscriptions[this.path]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (subscriptions) {
          var _this2 = this;

          _.dev(function () {
            return subscriptions.should.be.an.Object && subscriptions[_this2.path].shoulbe.be.an.Object && subscriptions[_this2.path][_this2.id].should.be.exactly(_this2);
          });
          delete subscriptions[this.path][this.id];
          if (Object.keys(subscriptions[this.path]).length === 0) {
            delete subscriptions[this.path];
            return true;
          }
          return false;
        }
      },
      update: {
        writable: true,
        value: function (value) {
          _.dev(function () {
            return (value === null || _.isObject(value)).should.be.ok;
          });
          this.handler.call(null, value);
        }
      }
    });

    return Subscription;
  })();

  _.extend(Subscription.prototype, {
    path: null,
    handler: null,
    id: null });

  return Subscription;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlN1YnNjcmlwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7O01BR2xCLFlBQVk7UUFBWixZQUFZLEdBQ0wsU0FEUCxZQUFZLE9BQ2U7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTzs7QUFDekIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDN0IsQ0FBQztBQUNGLFVBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsT0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxFQUFGLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDdkM7O2dCQVBHLFlBQVk7QUFTaEIsV0FBSzs7ZUFBQSxVQUFDLGFBQWEsRUFBRTs7O0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDL0MsY0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUIseUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQy9CO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxhQUFhLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3RELGFBQWEsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ25ELENBQUM7QUFDRix1QkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pDLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDM0Q7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxhQUFhLEVBQUU7OztBQUN4QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0MsYUFBYSxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQzFELENBQUM7QUFDRixpQkFBTyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckQsbUJBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGlCQUFPLEtBQUssQ0FBQztTQUNkOztBQUVELFlBQU07O2VBQUEsVUFBQyxLQUFLLEVBQUU7QUFDWixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ2hFLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoQzs7OztXQXJDRyxZQUFZOzs7OztBQXdDbEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQy9CLFFBQUksRUFBRSxJQUFJO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixNQUFFLEVBQUUsSUFBSSxFQUNULENBQUMsQ0FBQzs7QUFFSCxTQUFPLFlBQVksQ0FBQztDQUNyQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuU3Vic2NyaXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuXHJcbiAgY2xhc3MgU3Vic2NyaXB0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgcGF0aCwgaGFuZGxlciB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBsZXQgaWQgPSBfLnVuaXF1ZUlkKHBhdGgpO1xyXG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IHBhdGgsIGhhbmRsZXIsIGlkIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFRvKHN1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgaWYoIXN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkge1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdW3RoaXMuaWRdID0gdGhpcztcclxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUZyb20oc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0uc2hvdWxiZS5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcclxuICAgICAgKTtcclxuICAgICAgZGVsZXRlIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXTtcclxuICAgICAgaWYoT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkZWxldGUgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUodmFsdWUpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gKHZhbHVlID09PSBudWxsIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2spO1xyXG4gICAgICB0aGlzLmhhbmRsZXIuY2FsbChudWxsLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChTdWJzY3JpcHRpb24ucHJvdG90eXBlLCB7XHJcbiAgICBwYXRoOiBudWxsLFxyXG4gICAgaGFuZGxlcjogbnVsbCxcclxuICAgIGlkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gU3Vic2NyaXB0aW9uO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=