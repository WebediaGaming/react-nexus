"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var _Subscription = (function () {
    var _Subscription = function _Subscription(_ref) {
      var path = _ref.path;
      var handler = _ref.handler;
      _.dev(function () {
        return path.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { path: path, handler: handler, id: _.uniqueId(path) });
    };

    _classProps(_Subscription, null, {
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

    return _Subscription;
  })();

  _.extend(_Subscription.prototype, {
    path: null,
    handler: null,
    id: null });

  return _Subscription;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuU3RvcmUuU3Vic2NyaXB0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixhQUFZO1FBQVosYUFBWSxHQUNMLFNBRFAsYUFBWSxPQUNlO1VBQWpCLElBQUksUUFBSixJQUFJO1VBQUUsT0FBTyxRQUFQLE9BQU87QUFDekIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDN0IsQ0FBQztBQUNGLE9BQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUN4RDs7Z0JBTkcsYUFBWTtBQVFoQixXQUFLOztlQUFBLFVBQUMsYUFBYSxFQUFFOztBQUNuQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQy9DLGNBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzVCLHlCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUMvQjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sYUFBYSxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN0RCxhQUFhLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBSyxFQUFFLENBQUM7V0FBQSxDQUMzRCxDQUFDO0FBQ0YsdUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN6QyxpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQzNEOztBQUVELGdCQUFVOztlQUFBLFVBQUMsYUFBYSxFQUFFOztBQUN4QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFLLElBQUksQ0FBQyxJQUM3QyxhQUFhLENBQUMsT0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQUssRUFBRSxTQUFPO1dBQUEsQ0FDN0QsQ0FBQztBQUNGLGlCQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLGNBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNyRCxtQkFBTyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLG1CQUFPLElBQUksQ0FBQztXQUNiO0FBQ0QsaUJBQU8sS0FBSyxDQUFDO1NBQ2Q7O0FBRUQsWUFBTTs7ZUFBQSxVQUFDLEtBQUssRUFBRTtBQUNaLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDaEUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hDOzs7O1dBckNHLGFBQVk7OztBQXdDbEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFZLENBQUMsU0FBUyxFQUFFO0FBQy9CLFFBQUksRUFBRSxJQUFJO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixNQUFFLEVBQUUsSUFBSSxFQUNULENBQUMsQ0FBQzs7QUFFSCxTQUFPLGFBQVksQ0FBQztDQUNyQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuU3Vic2NyaXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHBhdGgsIGhhbmRsZXIgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgcGF0aCwgaGFuZGxlciwgaWQ6IF8udW5pcXVlSWQocGF0aCl9KTtcbiAgICB9XG5cbiAgICBhZGRUbyhzdWJzY3JpcHRpb25zKSB7XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIXN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkge1xuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXS5zaG91bGQubm90LmhhdmUucHJvcGVydHkodGhpcy5pZClcbiAgICAgICk7XG4gICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAxO1xuICAgIH1cblxuICAgIHJlbW92ZUZyb20oc3Vic2NyaXB0aW9ucykge1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuc2hvdWxkLmhhdmUucHJvcGVydHkodGhpcy5wYXRoKSAmJlxuICAgICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0uc2hvdWxiZS5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsZC5oYXZlLnByb3BlcnR5KHRoaXMuaWQsIHRoaXMpXG4gICAgICApO1xuICAgICAgZGVsZXRlIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZSh2YWx1ZSkge1xuICAgICAgXy5kZXYoKCkgPT4gKHZhbHVlID09PSBudWxsIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2spO1xuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFN1YnNjcmlwdGlvbi5wcm90b3R5cGUsIHtcbiAgICBwYXRoOiBudWxsLFxuICAgIGhhbmRsZXI6IG51bGwsXG4gICAgaWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBTdWJzY3JpcHRpb247XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9