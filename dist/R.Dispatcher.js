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
                case 0:
                  _this3 = this;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLEdBQ0E7OztBQUNaLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQUssY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUN6QyxDQUFDOztBQUVGLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDM0IsT0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDZixrQkFBa0IsRUFDbEIscUJBQXFCLEVBQ3JCLFVBQVUsQ0FDWCxDQUFDLENBQUM7O0FBRUgsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2hDLFlBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtlQUFLLE1BQUssZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUMxRjs7Z0JBZkcsVUFBVTtBQWlCZCxzQkFBZ0I7O2VBQUEsVUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ2hDLGNBQUksY0FBYyxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RCx3QkFBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMvQyxpQkFBTyxjQUFjLENBQUM7U0FDdkI7O0FBRUQseUJBQW1COztlQUFBLFVBQUMsY0FBYyxFQUFFOzs7QUFDbEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQzVELGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBSyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQzVELENBQUM7QUFDRix3QkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsRDs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBTztjQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7O0FBQzFCLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7Ozs7O0FBQ2pCLG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE9BQUssZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO21CQUFBLENBQUMsQ0FBQzs7eUJBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3RELEdBQUcsQ0FBQyxVQUFDLEdBQUc7MkJBQUssT0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO21CQUFBLENBQUM7Ozs7Ozs7V0FDbkUsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBcENHLFVBQVU7Ozs7O0FBdUNoQixHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDN0IsZUFBVyxFQUFFLElBQUk7QUFDakIsb0JBQWdCLEVBQUUsSUFBSSxFQUN2QixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDbkIsaUJBQWEsRUFBYixhQUFhLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sVUFBVSxDQUFDO0NBQ25CLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IEFjdGlvbkhhbmRsZXIgPSByZXF1aXJlKCcuL1IuRGlzcGF0Y2hlci5BY3Rpb25IYW5kbGVyJykoUik7XG5cbiAgY2xhc3MgRGlzcGF0Y2hlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLmdldEFjdGlvbnMuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5nZXREaXNwbGF5TmFtZS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcblxuICAgICAgdGhpcy5fYWN0aW9uc0hhbmRsZXJzID0ge307XG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcbiAgICAgICAgJ2FkZEFjdGlvbkhhbmRsZXInLFxuICAgICAgICAncmVtb3ZlQWN0aW9uSGFuZGxlcicsXG4gICAgICAgICdkaXNwYXRjaCcsXG4gICAgICBdKTtcblxuICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoKTtcbiAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5hZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgYWN0aW9uc1thY3Rpb25dKSk7XG4gICAgfVxuXG4gICAgYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcik7XG4gICAgICBhY3Rpb25MaXN0ZW5lci5wdXNoSW50byh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xuICAgICAgcmV0dXJuIGFjdGlvbkxpc3RlbmVyO1xuICAgIH1cblxuICAgIHJlbW92ZUFjdGlvbkhhbmRsZXIoYWN0aW9uTGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkxpc3RlbmVyLnNob3VsZC5iZS5pbnN0YW5jZU9mKEFjdGlvbkhhbmRsZXIpICYmXG4gICAgICAgIGFjdGlvbkxpc3RlbmVyLmlzSW5zaWRlKHRoaXMuX2FjdGlvbnNIYW5kbGVycykuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHtcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjdGlvbnNIYW5kbGVyc1thY3Rpb25dLnNob3VsZC5iZS5vayk7XG4gICAgICAgIHJldHVybiB5aWVsZCBPYmplY3Qua2V5cyh0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXSlcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXVtrZXldLmRpc3BhdGNoKHBhcmFtcykpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIHtcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICBfYWN0aW9uc0hhbmRsZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLCB7XG4gICAgQWN0aW9uSGFuZGxlcixcbiAgfSk7XG5cbiAgcmV0dXJuIERpc3BhdGNoZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9