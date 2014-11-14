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

  var ActionHandler = (function () {
    var ActionHandler = function ActionHandler(action, handler) {
      this.action = action;
      this.handler = handler;
      this.id = _.uniqueId("ActionHandler");
      _.scopeAll(this, ["pushInto", "removeFrom", "dispatch"]);
    };

    _classProps(ActionHandler, null, {
      pushInto: {
        writable: true,
        value: function (collection) {
          var _this = this;
          _.dev(function () {
            return collection.should.be.an.Object;
          });
          if (!collection[this.action]) {
            collection[this.action] = {};
          }
          _.dev(function () {
            return collection[_this.action][_this.id].should.not.be.ok;
          });
          collection[this.action][this.id] = this;
        }
      },
      removeFrom: {
        writable: true,
        value: function (collection) {
          var _this2 = this;
          _.dev(function () {
            return collection.should.be.an.Object && collection[_this2.action].should.be.an.Object && collection[_this2.action][_this2.id].should.be.exactly(_this2);
          });
          delete collection[this.action][this.id];
          if (Object.keys(collection[this.action]).length === 0) {
            delete collection[this.action];
          }
        }
      },
      isInside: {
        writable: true,
        value: function (collection) {
          _.dev(function () {
            return collection.should.be.an.Object;
          });
          return collection[this.action] && collection[this.action][this.id] && collection[this.action][this.id] === this;
        }
      },
      dispatch: {
        writable: true,
        value: function (params) {
          _.dev(function () {
            return params.should.be.an.Object;
          });
          return this.handler.call(null, params);
        }
      }
    });

    return ActionHandler;
  })();

  _.extend(ActionHandler.prototype, {
    id: null });

  return ActionHandler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsYUFBYTtRQUFiLGFBQWEsR0FDTixTQURQLGFBQWEsQ0FDTCxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUMsQ0FBQztLQUNKOztnQkFWRyxhQUFhO0FBWWpCLGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7O0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDNUMsY0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDM0Isc0JBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQzlCO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDL0Qsb0JBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN6Qzs7QUFFRCxnQkFBVTs7ZUFBQSxVQUFDLFVBQVUsRUFBRTs7QUFDckIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN4QyxVQUFVLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLFVBQVUsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07V0FBQSxDQUN6RCxDQUFDO0FBQ0YsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3BELG1CQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDaEM7U0FDRjs7QUFFRCxjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFO0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDNUMsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztTQUM3Qzs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUN4QyxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDeEM7Ozs7V0ExQ0csYUFBYTs7O0FBNkNuQixHQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7QUFDaEMsTUFBRSxFQUFFLElBQUksRUFDVCxDQUFDLENBQUM7O0FBRUgsU0FBTyxhQUFhLENBQUM7Q0FDdEIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgQWN0aW9uSGFuZGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb24sIGhhbmRsZXIpIHtcclxuICAgICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XHJcbiAgICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICAgIHRoaXMuaWQgPSBfLnVuaXF1ZUlkKCdBY3Rpb25IYW5kbGVyJyk7XHJcbiAgICAgIF8uc2NvcGVBbGwodGhpcywgW1xyXG4gICAgICAgICdwdXNoSW50bycsXHJcbiAgICAgICAgJ3JlbW92ZUZyb20nLFxyXG4gICAgICAgICdkaXNwYXRjaCcsXHJcbiAgICAgIF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2hJbnRvKGNvbGxlY3Rpb24pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgaWYoIWNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dKSB7XHJcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXS5zaG91bGQubm90LmJlLm9rKTtcclxuICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUZyb20oY29sbGVjdGlvbikge1xyXG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcclxuICAgICAgKTtcclxuICAgICAgZGVsZXRlIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdO1xyXG4gICAgICBpZihPYmplY3Qua2V5cyhjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZGVsZXRlIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNJbnNpZGUoY29sbGVjdGlvbikge1xyXG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICByZXR1cm4gY29sbGVjdGlvblt0aGlzLmFjdGlvbl0gJiZcclxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSAmJlxyXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID09PSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKHBhcmFtcykge1xyXG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZXIuY2FsbChudWxsLCBwYXJhbXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoQWN0aW9uSGFuZGxlci5wcm90b3R5cGUsIHtcclxuICAgIGlkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gQWN0aW9uSGFuZGxlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9