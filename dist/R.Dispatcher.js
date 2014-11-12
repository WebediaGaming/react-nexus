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
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this3 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _this3._actionsHandlers[action].should.be.ok;
                  });
                  context$4$0.next = 3;
                  return Object.keys(this._actionsHandlers[action]).map(function (key) {
                    return _this3._actionsHandlers[action][key].dispatch(params);
                  });

                case 3: return context$4$0.abrupt("return", context$4$0.sent);
                case 4:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLEdBQ0E7OztBQUNaLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlDLE1BQUssY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUN6QyxDQUFDOztBQUVGLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDM0IsT0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDZixrQkFBa0IsRUFDbEIscUJBQXFCLEVBQ3JCLFVBQVUsQ0FDWCxDQUFDLENBQUM7O0FBRUgsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2hDLFlBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTTtlQUFLLE1BQUssZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUMxRjs7Z0JBZkcsVUFBVTtBQWlCZCxzQkFBZ0I7O2VBQUEsVUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ2hDLGNBQUksY0FBYyxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RCx3QkFBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMvQyxpQkFBTyxjQUFjLENBQUM7U0FDdkI7O0FBRUQseUJBQW1COztlQUFBLFVBQUMsY0FBYyxFQUFFOzs7QUFDbEMsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQzVELGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBSyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQzVELENBQUM7QUFDRix3QkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsRDs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBTztjQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7O0FBQzFCLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7OztBQUNqQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxPQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUFDLENBQUM7O3lCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUN0RCxHQUFHLENBQUMsVUFBQyxHQUFHOzJCQUFLLE9BQUssZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzttQkFBQSxDQUFDOzs7Ozs7O1dBQ25FLEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7OztXQXBDRyxVQUFVOzs7OztBQXVDaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzdCLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLG9CQUFnQixFQUFFLElBQUksRUFDdkIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ25CLGlCQUFhLEVBQWIsYUFBYSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFVBQVUsQ0FBQztDQUNuQixDQUFDIiwiZmlsZSI6IlIuRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICBjb25zdCBBY3Rpb25IYW5kbGVyID0gcmVxdWlyZSgnLi9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlcicpKFIpO1xuXG4gIGNsYXNzIERpc3BhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRBY3Rpb25zLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuZ2V0RGlzcGxheU5hbWUuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2FjdGlvbnNIYW5kbGVycyA9IHt9O1xuICAgICAgXy5zY29wZUFsbCh0aGlzLCBbXG4gICAgICAgICdhZGRBY3Rpb25IYW5kbGVyJyxcbiAgICAgICAgJ3JlbW92ZUFjdGlvbkhhbmRsZXInLFxuICAgICAgICAnZGlzcGF0Y2gnLFxuICAgICAgXSk7XG5cbiAgICAgIGxldCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKCk7XG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMuYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGFjdGlvbnNbYWN0aW9uXSkpO1xuICAgIH1cblxuICAgIGFkZEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKSB7XG4gICAgICBsZXQgYWN0aW9uTGlzdGVuZXIgPSBuZXcgQWN0aW9uSGFuZGxlcihhY3Rpb24sIGhhbmRsZXIpO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucHVzaEludG8odGhpcy5fYWN0aW9uc0hhbmRsZXJzKTtcbiAgICAgIHJldHVybiBhY3Rpb25MaXN0ZW5lcjtcbiAgICB9XG5cbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKGFjdGlvbkxpc3RlbmVyKSB7XG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25IYW5kbGVyKSAmJlxuICAgICAgICBhY3Rpb25MaXN0ZW5lci5pc0luc2lkZSh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpLnNob3VsZC5iZS5va1xuICAgICAgKTtcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnJlbW92ZUZyb20odGhpcy5fYWN0aW9uc0hhbmRsZXJzKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaChhY3Rpb24sIHBhcmFtcyA9IHt9KSB7XG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5fYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl0pXG4gICAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl1ba2V5XS5kaXNwYXRjaChwYXJhbXMpKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKERpc3BhdGNoZXIucHJvdG90eXBlLCB7XG4gICAgZGlzcGxheU5hbWU6IG51bGwsXG4gICAgX2FjdGlvbnNIYW5kbGVyczogbnVsbCxcbiAgfSk7XG5cbiAgXy5leHRlbmQoRGlzcGF0Y2hlciwge1xuICAgIEFjdGlvbkhhbmRsZXIsXG4gIH0pO1xuXG4gIHJldHVybiBEaXNwYXRjaGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==