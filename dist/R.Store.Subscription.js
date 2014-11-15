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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlN1YnNjcmlwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOzs7TUFHbEIsWUFBWTtRQUFaLFlBQVksR0FDTCxTQURQLFlBQVksT0FDZTtVQUFqQixJQUFJLFFBQUosSUFBSTtVQUFFLE9BQU8sUUFBUCxPQUFPO0FBQ3pCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixPQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDeEQ7O2dCQU5HLFlBQVk7QUFRaEIsV0FBSzs7ZUFBQSxVQUFDLGFBQWEsRUFBRTs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUMvQyxjQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM1Qix5QkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDL0I7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDdEQsYUFBYSxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FDbkQsQ0FBQztBQUNGLHVCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDekMsaUJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUMzRDs7QUFFRCxnQkFBVTs7ZUFBQSxVQUFDLGFBQWEsRUFBRTs7QUFDeEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUMzQyxhQUFhLENBQUMsT0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07V0FBQSxDQUMxRCxDQUFDO0FBQ0YsaUJBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JELG1CQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxpQkFBTyxLQUFLLENBQUM7U0FDZDs7QUFFRCxZQUFNOztlQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ1osV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUNoRSxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7Ozs7V0FwQ0csWUFBWTs7O0FBdUNsQixHQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7QUFDL0IsUUFBSSxFQUFFLElBQUk7QUFDVixXQUFPLEVBQUUsSUFBSTtBQUNiLE1BQUUsRUFBRSxJQUFJLEVBQ1QsQ0FBQyxDQUFDOztBQUVILFNBQU8sWUFBWSxDQUFDO0NBQ3JCLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5TdWJzY3JpcHRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG5cclxuICBjbGFzcyBTdWJzY3JpcHRpb24ge1xyXG4gICAgY29uc3RydWN0b3IoeyBwYXRoLCBoYW5kbGVyIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgcGF0aCwgaGFuZGxlciwgaWQ6IF8udW5pcXVlSWQocGF0aCl9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRUbyhzdWJzY3JpcHRpb25zKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbnMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIGlmKCFzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0pIHtcclxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXS5zaG91bGQubm90LmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXSA9IHRoaXM7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0pLmxlbmd0aCA9PT0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVGcm9tKHN1YnNjcmlwdGlvbnMpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsYmUuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF07XHJcbiAgICAgIGlmKE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZGVsZXRlIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKHZhbHVlKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+ICh2YWx1ZSA9PT0gbnVsbCB8fCBfLmlzT2JqZWN0KHZhbHVlKSkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoU3Vic2NyaXB0aW9uLnByb3RvdHlwZSwge1xyXG4gICAgcGF0aDogbnVsbCxcclxuICAgIGhhbmRsZXI6IG51bGwsXHJcbiAgICBpZDogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFN1YnNjcmlwdGlvbjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9