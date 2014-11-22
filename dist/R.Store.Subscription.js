"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var Subscription = (function () {
    var Subscription = function Subscription(_ref) {
      var path = _ref.path;
      var handler = _ref.handler;

      _.dev(function () {
        return path.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { path: path, handler: handler, id: _.uniqueId(path) });
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
            return subscriptions[_this.path].should.be.an.Object && subscriptions[_this.path].should.not.have.property(_this.id);
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
            return subscriptions.should.be.an.Object && subscriptions.should.have.property(_this2.path) && subscriptions[_this2.path].shoulbe.be.an.Object && subscriptions[_this2.path].should.have.property(_this2.id, _this2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLlN0b3JlLlN1YnNjcmlwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLFlBQVk7UUFBWixZQUFZLEdBQ0wsU0FEUCxZQUFZLE9BQ2U7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTzs7QUFDekIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDN0IsQ0FBQztBQUNGLE9BQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUN4RDs7Z0JBTkcsWUFBWTtBQVFoQixXQUFLOztlQUFBLFVBQUMsYUFBYSxFQUFFOzs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUMvQyxjQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1Qix5QkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDL0I7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDdEQsYUFBYSxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQUssRUFBRSxDQUFDO1dBQUEsQ0FDM0QsQ0FBQztBQUNGLHVCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDekMsaUJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUMzRDs7QUFFRCxnQkFBVTs7ZUFBQSxVQUFDLGFBQWEsRUFBRTs7O0FBQ3hCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDM0MsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQUssSUFBSSxDQUFDLElBQzdDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0MsYUFBYSxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBSyxFQUFFLFNBQU87V0FBQSxDQUM3RCxDQUFDO0FBQ0YsaUJBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JELG1CQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxpQkFBTyxLQUFLLENBQUM7U0FDZDs7QUFFRCxZQUFNOztlQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ1osV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNoRSxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7Ozs7V0FyQ0csWUFBWTs7Ozs7QUF3Q2xCLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMvQixRQUFJLEVBQUUsSUFBSTtBQUNWLFdBQU8sRUFBRSxJQUFJO0FBQ2IsTUFBRSxFQUFFLElBQUksRUFDVCxDQUFDLENBQUM7O0FBRUgsU0FBTyxZQUFZLENBQUM7Q0FDckIsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLlN1YnNjcmlwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHBhdGgsIGhhbmRsZXIgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgcGF0aCwgaGFuZGxlciwgaWQ6IF8udW5pcXVlSWQocGF0aCl9KTtcbiAgICB9XG5cbiAgICBhZGRUbyhzdWJzY3JpcHRpb25zKSB7XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIXN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkge1xuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXS5zaG91bGQubm90LmhhdmUucHJvcGVydHkodGhpcy5pZClcbiAgICAgICk7XG4gICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAxO1xuICAgIH1cblxuICAgIHJlbW92ZUZyb20oc3Vic2NyaXB0aW9ucykge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuc2hvdWxkLmhhdmUucHJvcGVydHkodGhpcy5wYXRoKSAmJlxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0uc2hvdWxiZS5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsZC5oYXZlLnByb3BlcnR5KHRoaXMuaWQsIHRoaXMpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZSh2YWx1ZSkge1xuICAgICAgXy5kZXYoKCkgPT4gKHZhbHVlID09PSBudWxsIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFN1YnNjcmlwdGlvbi5wcm90b3R5cGUsIHtcbiAgICBwYXRoOiBudWxsLFxuICAgIGhhbmRsZXI6IG51bGwsXG4gICAgaWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBTdWJzY3JpcHRpb247XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9