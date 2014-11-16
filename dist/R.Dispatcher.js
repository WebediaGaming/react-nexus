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
      var _this = this;
      if (actionHandlers === undefined) actionHandlers = {};
      _.dev(function () {
        return actionHandlers.should.be.an.Object && Object.keys(actionHandlers).map(function (action) {
          return action.should.be.a.String && actionHandlers[action].should.be.a.Function;
        });
      });
      this.actionHandlers = {};
      Object.keys(actionHandlers).forEach(function (action) {
        return _this.addActionHandler(action, actionHandlers[action]);
      });
    };

    _classProps(Dispatcher, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this2 = this;
          // Explicitly remove all action handlers
          Object.keys(this.actionHandlers).forEach(function (action) {
            return _this2.removeActionHandler(_this2.actionHandlers[action]);
          });
          // Nullify references
          this.actionHandlers = null;
        }
      },
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
          var _this3 = this;
          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionHandler) && actionListener.isInside(_this3.actionsHandlers).should.be.ok;
          });
          actionListener.removeFrom(this.actionsHandlers);
        }
      },
      dispatch: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$0(action, params) {
          var _this4;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: _this4 = this;
                if (params === undefined) params = {};
                // jshint ignore:line
                _.dev(function () {
                  return _this4.actionsHandlers[action].should.be.ok;
                });
                context$3$0.next = 5;
                return Object.keys(this.actionsHandlers[action]) // jshint ignore:line
                .map(function (key) {
                  return _this4.actionsHandlers[action][key].dispatch(params);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLENBQ0YsY0FBYyxFQUFPOztVQUFyQixjQUFjLGdCQUFkLGNBQWMsR0FBRyxFQUFFO0FBQzdCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU07aUJBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDbkUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FBQSxDQUM1QztPQUFBLENBQ0YsQ0FBQztBQUNGLFVBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFlBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQzFCLE9BQU8sQ0FBQyxVQUFDLE1BQU07ZUFBSyxNQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDN0U7O2dCQVZHLFVBQVU7QUFZZCxhQUFPOztlQUFBLFlBQUc7OztBQUVSLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDL0IsT0FBTyxDQUFDLFVBQUMsTUFBTTttQkFBSyxPQUFLLG1CQUFtQixDQUFDLE9BQUssY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDOztBQUU1RSxjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM1Qjs7QUFFRCxzQkFBZ0I7O2VBQUEsVUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ2hDLGNBQUksY0FBYyxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RCx3QkFBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDOUMsaUJBQU8sY0FBYyxDQUFDO1NBQ3ZCOztBQUVELHlCQUFtQjs7ZUFBQSxVQUFDLGNBQWMsRUFBRTs7QUFDbEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQzVELGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBSyxlQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUMzRCxDQUFDO0FBQ0Ysd0JBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ2pEOztBQUVBLGNBQVE7O3VDQUFBLG9CQUFDLE1BQU0sRUFBRSxNQUFNOzs7OztvQkFBTixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFOztBQUMzQixpQkFBQyxDQUFDLEdBQUcsQ0FBQzt5QkFBTSxPQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQUEsQ0FBQyxDQUFDOzt1QkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNyRCxHQUFHLENBQUMsVUFBQyxHQUFHO3lCQUFLLE9BQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7aUJBQUEsQ0FBQzs7Ozs7O1NBQ2xFOzs7O1dBckNHLFVBQVU7OztBQXdDaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzdCLGtCQUFjLEVBQUUsSUFBSSxFQUNyQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDbkIsaUJBQWEsRUFBYixhQUFhLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sVUFBVSxDQUFDO0NBQ25CLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3QgQWN0aW9uSGFuZGxlciA9IHJlcXVpcmUoJy4vUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXInKShSKTtcblxuICBjbGFzcyBEaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb25IYW5kbGVycyA9IHt9KSB7XG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25IYW5kbGVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbkhhbmRsZXJzKS5tYXAoKGFjdGlvbikgPT4gYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgIGFjdGlvbkhhbmRsZXJzW2FjdGlvbl0uc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIHRoaXMuYWN0aW9uSGFuZGxlcnMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKGFjdGlvbkhhbmRsZXJzKVxuICAgICAgLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5hZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgYWN0aW9uSGFuZGxlcnNbYWN0aW9uXSkpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAvLyBFeHBsaWNpdGx5IHJlbW92ZSBhbGwgYWN0aW9uIGhhbmRsZXJzXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmFjdGlvbkhhbmRsZXJzKVxuICAgICAgLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5yZW1vdmVBY3Rpb25IYW5kbGVyKHRoaXMuYWN0aW9uSGFuZGxlcnNbYWN0aW9uXSkpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLmFjdGlvbkhhbmRsZXJzID0gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcikge1xuICAgICAgbGV0IGFjdGlvbkxpc3RlbmVyID0gbmV3IEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKTtcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnB1c2hJbnRvKHRoaXMuYWN0aW9uc0hhbmRsZXJzKTtcbiAgICAgIHJldHVybiBhY3Rpb25MaXN0ZW5lcjtcbiAgICB9XG5cbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKGFjdGlvbkxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25IYW5kbGVyKSAmJlxuICAgICAgICBhY3Rpb25MaXN0ZW5lci5pc0luc2lkZSh0aGlzLmFjdGlvbnNIYW5kbGVycykuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLmFjdGlvbnNIYW5kbGVycyk7XG4gICAgfVxuXG4gICAgKmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICBfLmRldigoKSA9PiB0aGlzLmFjdGlvbnNIYW5kbGVyc1thY3Rpb25dLnNob3VsZC5iZS5vayk7XG4gICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXSkgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAubWFwKChrZXkpID0+IHRoaXMuYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl1ba2V5XS5kaXNwYXRjaChwYXJhbXMpKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwge1xuICAgIGFjdGlvbkhhbmRsZXJzOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChEaXNwYXRjaGVyLCB7XG4gICAgQWN0aW9uSGFuZGxlcixcbiAgfSk7XG5cbiAgcmV0dXJuIERpc3BhdGNoZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9