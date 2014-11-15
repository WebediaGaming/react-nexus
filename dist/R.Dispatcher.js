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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFM0QsVUFBVTtRQUFWLFVBQVUsR0FDSCxTQURQLFVBQVUsR0FDQTs7QUFDWixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QyxNQUFLLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDekMsQ0FBQzs7QUFFRixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzNCLE9BQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQ2Ysa0JBQWtCLEVBQ2xCLHFCQUFxQixFQUNyQixVQUFVLENBQ1gsQ0FBQyxDQUFDOztBQUVILFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNoQyxZQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07ZUFBSyxNQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDMUY7O2dCQWZHLFVBQVU7QUFpQmQsc0JBQWdCOztlQUFBLFVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNoQyxjQUFJLGNBQWMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEQsd0JBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDL0MsaUJBQU8sY0FBYyxDQUFDO1NBQ3ZCOztBQUVELHlCQUFtQjs7ZUFBQSxVQUFDLGNBQWMsRUFBRTs7QUFDbEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQzVELGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBSyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQzVELENBQUM7QUFDRix3QkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsRDs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBTztjQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7QUFDMUIsaUJBQU8sQ0FBQyxDQUFDLFNBQVMseUJBQUM7Ozs7O0FBQ2pCLG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE9BQUssZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO21CQUFBLENBQUMsQ0FBQzs7eUJBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3RELEdBQUcsQ0FBQyxVQUFDLEdBQUc7MkJBQUssT0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO21CQUFBLENBQUM7Ozs7OztXQUNuRSxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FwQ0csVUFBVTs7O0FBdUNoQixHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDN0IsZUFBVyxFQUFFLElBQUk7QUFDakIsb0JBQWdCLEVBQUUsSUFBSSxFQUN2QixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDbkIsaUJBQWEsRUFBYixhQUFhLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sVUFBVSxDQUFDO0NBQ25CLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IEFjdGlvbkhhbmRsZXIgPSByZXF1aXJlKCcuL1IuRGlzcGF0Y2hlci5BY3Rpb25IYW5kbGVyJykoUik7XHJcblxyXG4gIGNsYXNzIERpc3BhdGNoZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuZ2V0QWN0aW9ucy5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgIHRoaXMuZ2V0RGlzcGxheU5hbWUuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuXHJcbiAgICAgIHRoaXMuX2FjdGlvbnNIYW5kbGVycyA9IHt9O1xyXG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcclxuICAgICAgICAnYWRkQWN0aW9uSGFuZGxlcicsXHJcbiAgICAgICAgJ3JlbW92ZUFjdGlvbkhhbmRsZXInLFxyXG4gICAgICAgICdkaXNwYXRjaCcsXHJcbiAgICAgIF0pO1xyXG5cclxuICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoKTtcclxuICAgICAgT2JqZWN0LmtleXMoYWN0aW9ucykuZm9yRWFjaCgoYWN0aW9uKSA9PiB0aGlzLmFkZEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBhY3Rpb25zW2FjdGlvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcikge1xyXG4gICAgICBsZXQgYWN0aW9uTGlzdGVuZXIgPSBuZXcgQWN0aW9uSGFuZGxlcihhY3Rpb24sIGhhbmRsZXIpO1xyXG4gICAgICBhY3Rpb25MaXN0ZW5lci5wdXNoSW50byh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xyXG4gICAgICByZXR1cm4gYWN0aW9uTGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWN0aW9uSGFuZGxlcihhY3Rpb25MaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25IYW5kbGVyKSAmJlxyXG4gICAgICAgIGFjdGlvbkxpc3RlbmVyLmlzSW5zaWRlKHRoaXMuX2FjdGlvbnNIYW5kbGVycykuc2hvdWxkLmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnJlbW92ZUZyb20odGhpcy5fYWN0aW9uc0hhbmRsZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChhY3Rpb24sIHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5fYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl0pXHJcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXVtrZXldLmRpc3BhdGNoKHBhcmFtcykpO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKERpc3BhdGNoZXIucHJvdG90eXBlLCB7XHJcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcclxuICAgIF9hY3Rpb25zSGFuZGxlcnM6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIF8uZXh0ZW5kKERpc3BhdGNoZXIsIHtcclxuICAgIEFjdGlvbkhhbmRsZXIsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBEaXNwYXRjaGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=