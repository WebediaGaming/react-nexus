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
    var Dispatcher = function Dispatcher() {
      var _this = this;
      _.dev(function () {
        return _this.getActions.should.be.a.Function && _this.getDisplayName.should.be.a.Function;
      });

      this._actionsHandlers = {};
      _.scopeAll(this, ["addActionHandler", "removeActionHandler", "dispatch"]);

      var actions = this.getActions();
      Object.keys(actions).forEach(function (action) {
        return _this.addActionHandler(action, actions[action]);
      });
    };

    _classProps(Dispatcher, null, {
      addActionHandler: {
        writable: true,
        value: function (action, handler) {
          var actionListener = new ActionHandler(action, handler);
          actionListener.pushInto(this._actionsHandlers);
          return actionListener;
        }
      },
      removeActionHandler: {
        writable: true,
        value: function (actionListener) {
          var _this2 = this;
          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionHandler) && actionListener.isInside(_this2._actionsHandlers).should.be.ok;
          });
          actionListener.removeFrom(this._actionsHandlers);
        }
      },
      dispatch: {
        writable: true,
        value: function (action, params) {
          if (params === undefined) params = {};
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var _this3;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0: _this3 = this;
                  _.dev(function () {
                    return _this3._actionsHandlers[action].should.be.ok;
                  });
                  context$4$0.next = 4;
                  return Object.keys(this._actionsHandlers[action]).map(function (key) {
                    return _this3._actionsHandlers[action][key].dispatch(params);
                  });
                case 4: return context$4$0.abrupt("return", context$4$0.sent);
                case 5:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      }
    });

    return Dispatcher;
  })();

  _.extend(Dispatcher.prototype, {
    displayName: null,
    _actionsHandlers: null });

  _.extend(Dispatcher, {
    ActionHandler: ActionHandler });

  return Dispatcher;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLEdBQ0E7O0FBQ1osT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDOUMsTUFBSyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7O0FBRUYsVUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMzQixPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsVUFBVSxDQUNYLENBQUMsQ0FBQzs7QUFFSCxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDaEMsWUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2VBQUssTUFBSyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQzFGOztnQkFmRyxVQUFVO0FBaUJkLHNCQUFnQjs7ZUFBQSxVQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDaEMsY0FBSSxjQUFjLEdBQUcsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELHdCQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9DLGlCQUFPLGNBQWMsQ0FBQztTQUN2Qjs7QUFFRCx5QkFBbUI7O2VBQUEsVUFBQyxjQUFjLEVBQUU7O0FBQ2xDLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUM1RCxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQUssZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUM1RCxDQUFDO0FBQ0Ysd0JBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbEQ7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQU87Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFO0FBQzFCLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7OztBQUNqQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxPQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUFDLENBQUM7O3lCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUN0RCxHQUFHLENBQUMsVUFBQyxHQUFHOzJCQUFLLE9BQUssZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzttQkFBQSxDQUFDOzs7Ozs7V0FDbkUsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBcENHLFVBQVU7OztBQXVDaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzdCLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLG9CQUFnQixFQUFFLElBQUksRUFDdkIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ25CLGlCQUFhLEVBQWIsYUFBYSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFVBQVUsQ0FBQztDQUNuQixDQUFDIiwiZmlsZSI6IlIuRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IEFjdGlvbkhhbmRsZXIgPSByZXF1aXJlKCcuL1IuRGlzcGF0Y2hlci5BY3Rpb25IYW5kbGVyJykoUik7XG5cbiAgY2xhc3MgRGlzcGF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLmdldEFjdGlvbnMuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5nZXREaXNwbGF5TmFtZS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcblxuICAgICAgdGhpcy5fYWN0aW9uc0hhbmRsZXJzID0ge307XG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcbiAgICAgICAgJ2FkZEFjdGlvbkhhbmRsZXInLFxuICAgICAgICAncmVtb3ZlQWN0aW9uSGFuZGxlcicsXG4gICAgICAgICdkaXNwYXRjaCcsXG4gICAgICBdKTtcblxuICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoKTtcbiAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5hZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgYWN0aW9uc1thY3Rpb25dKSk7XG4gICAgfVxuXG4gICAgYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcik7XG4gICAgICBhY3Rpb25MaXN0ZW5lci5wdXNoSW50byh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xuICAgICAgcmV0dXJuIGFjdGlvbkxpc3RlbmVyO1xuICAgIH1cblxuICAgIHJlbW92ZUFjdGlvbkhhbmRsZXIoYWN0aW9uTGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkxpc3RlbmVyLnNob3VsZC5iZS5pbnN0YW5jZU9mKEFjdGlvbkhhbmRsZXIpICYmXG4gICAgICAgIGFjdGlvbkxpc3RlbmVyLmlzSW5zaWRlKHRoaXMuX2FjdGlvbnNIYW5kbGVycykuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHtcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjdGlvbnNIYW5kbGVyc1thY3Rpb25dLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHJldHVybiB5aWVsZCBPYmplY3Qua2V5cyh0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXSlcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXVtrZXldLmRpc3BhdGNoKHBhcmFtcykpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIHtcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICBfYWN0aW9uc0hhbmRsZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLCB7XG4gICAgQWN0aW9uSGFuZGxlcixcbiAgfSk7XG5cbiAgcmV0dXJuIERpc3BhdGNoZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9