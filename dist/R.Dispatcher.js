"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
  var ActionHandler = require("./R.Dispatcher.ActionHandler")(R);

  var Dispatcher = (function () {
    var Dispatcher = function Dispatcher(actionHandlers) {
      if (actionHandlers === undefined) actionHandlers = {};
      _.dev(function () {
        return actionHandlers.should.be.an.Object && Object.keys(actionHandlers).map(function (action) {
          return action.should.be.a.String && actionHandlers[action].should.be.a.Function;
        });
      });
      _.extend(this, { actionHandlers: actionHandlers });
    };

    _classProps(Dispatcher, null, {
      addActionHandler: {
        writable: true,
        value: function (action, handler) {
          var actionListener = new ActionHandler(action, handler);
          actionListener.pushInto(this.actionsHandlers);
          return actionListener;
        }
      },
      removeActionHandler: {
        writable: true,
        value: function (actionListener) {
          var _this = this;
          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionHandler) && actionListener.isInside(_this.actionsHandlers).should.be.ok;
          });
          actionListener.removeFrom(this.actionsHandlers);
        }
      },
      dispatch: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$0(action, params) {
          var _this2;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: _this2 = this;
                if (params === undefined) params = {};
                // jshint ignore:line
                _.dev(function () {
                  return _this2.actionsHandlers[action].should.be.ok;
                });
                context$3$0.next = 5;
                return Object.keys(this.actionsHandlers[action]) // jshint ignore:line
                .map(function (key) {
                  return _this2.actionsHandlers[action][key].dispatch(params);
                });
              case 5: return context$3$0.abrupt("return", context$3$0.sent);
              case 6:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })
      }
    });

    return Dispatcher;
  })();

  _.extend(Dispatcher.prototype, {
    actionHandlers: null });

  _.extend(Dispatcher, {
    ActionHandler: ActionHandler });

  return Dispatcher;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLENBQ0YsY0FBYyxFQUFPO1VBQXJCLGNBQWMsZ0JBQWQsY0FBYyxHQUFHLEVBQUU7QUFDN0IsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTTtpQkFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNuRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtTQUFBLENBQzVDO09BQUEsQ0FDRixDQUFDO0FBQ0YsT0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLEVBQWQsY0FBYyxFQUFFLENBQUMsQ0FBQztLQUNwQzs7Z0JBUkcsVUFBVTtBQVVkLHNCQUFnQjs7ZUFBQSxVQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDaEMsY0FBSSxjQUFjLEdBQUcsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELHdCQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM5QyxpQkFBTyxjQUFjLENBQUM7U0FDdkI7O0FBRUQseUJBQW1COztlQUFBLFVBQUMsY0FBYyxFQUFFOztBQUNsQyxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFDNUQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFLLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQzNELENBQUM7QUFDRix3QkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDakQ7O0FBRUEsY0FBUTs7dUNBQUEsb0JBQUMsTUFBTSxFQUFFLE1BQU07Ozs7O29CQUFOLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7O0FBQzNCLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE9BQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFBQSxDQUFDLENBQUM7O3VCQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3JELEdBQUcsQ0FBQyxVQUFDLEdBQUc7eUJBQUssT0FBSyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztpQkFBQSxDQUFDOzs7Ozs7U0FDbEU7Ozs7V0EzQkcsVUFBVTs7O0FBOEJoQixHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDN0Isa0JBQWMsRUFBRSxJQUFJLEVBQ3JCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUNuQixpQkFBYSxFQUFiLGFBQWEsRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBBY3Rpb25IYW5kbGVyID0gcmVxdWlyZSgnLi9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlcicpKFIpO1xuXG4gIGNsYXNzIERpc3BhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKGFjdGlvbkhhbmRsZXJzID0ge30pIHtcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkhhbmRsZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgT2JqZWN0LmtleXMoYWN0aW9uSGFuZGxlcnMpLm1hcCgoYWN0aW9uKSA9PiBhY3Rpb24uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgYWN0aW9uSGFuZGxlcnNbYWN0aW9uXS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgICApXG4gICAgICApO1xuICAgICAgXy5leHRlbmQodGhpcywgeyBhY3Rpb25IYW5kbGVycyB9KTtcbiAgICB9XG5cbiAgICBhZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcikge1xuICAgICAgbGV0IGFjdGlvbkxpc3RlbmVyID0gbmV3IEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKTtcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnB1c2hJbnRvKHRoaXMuYWN0aW9uc0hhbmRsZXJzKTtcbiAgICAgIHJldHVybiBhY3Rpb25MaXN0ZW5lcjtcbiAgICB9XG5cbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKGFjdGlvbkxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25IYW5kbGVyKSAmJlxuICAgICAgICBhY3Rpb25MaXN0ZW5lci5pc0luc2lkZSh0aGlzLmFjdGlvbnNIYW5kbGVycykuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLmFjdGlvbnNIYW5kbGVycyk7XG4gICAgfVxuXG4gICAgKmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBfLmRldigoKSA9PiB0aGlzLmFjdGlvbnNIYW5kbGVyc1thY3Rpb25dLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXSkgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl1ba2V5XS5kaXNwYXRjaChwYXJhbXMpKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwge1xuICAgIGFjdGlvbkhhbmRsZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLCB7XG4gICAgQWN0aW9uSGFuZGxlcixcbiAgfSk7XG5cbiAgcmV0dXJuIERpc3BhdGNoZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9