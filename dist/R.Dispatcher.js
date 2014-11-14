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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5EaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRTNELFVBQVU7UUFBVixVQUFVLEdBQ0gsU0FEUCxVQUFVLEdBQ0E7O0FBQ1osT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDOUMsTUFBSyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3pDLENBQUM7O0FBRUYsVUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMzQixPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsVUFBVSxDQUNYLENBQUMsQ0FBQzs7QUFFSCxVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDaEMsWUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2VBQUssTUFBSyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQzFGOztnQkFmRyxVQUFVO0FBaUJkLHNCQUFnQjs7ZUFBQSxVQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDaEMsY0FBSSxjQUFjLEdBQUcsSUFBSSxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELHdCQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9DLGlCQUFPLGNBQWMsQ0FBQztTQUN2Qjs7QUFFRCx5QkFBbUI7O2VBQUEsVUFBQyxjQUFjLEVBQUU7O0FBQ2xDLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUM1RCxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQUssZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUM1RCxDQUFDO0FBQ0Ysd0JBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbEQ7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQU87Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFO0FBQzFCLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sT0FBSyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7bUJBQUEsQ0FBQyxDQUFDOzt5QkFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDdEQsR0FBRyxDQUFDLFVBQUMsR0FBRzsyQkFBSyxPQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7bUJBQUEsQ0FBQzs7Ozs7O1dBQ25FLEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7OztXQXBDRyxVQUFVOzs7QUF1Q2hCLEdBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtBQUM3QixlQUFXLEVBQUUsSUFBSTtBQUNqQixvQkFBZ0IsRUFBRSxJQUFJLEVBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUNuQixpQkFBYSxFQUFiLGFBQWEsRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgQWN0aW9uSGFuZGxlciA9IHJlcXVpcmUoJy4vUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXInKShSKTtcclxuXHJcbiAgY2xhc3MgRGlzcGF0Y2hlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRBY3Rpb25zLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgdGhpcy5nZXREaXNwbGF5TmFtZS5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5fYWN0aW9uc0hhbmRsZXJzID0ge307XHJcbiAgICAgIF8uc2NvcGVBbGwodGhpcywgW1xyXG4gICAgICAgICdhZGRBY3Rpb25IYW5kbGVyJyxcclxuICAgICAgICAncmVtb3ZlQWN0aW9uSGFuZGxlcicsXHJcbiAgICAgICAgJ2Rpc3BhdGNoJyxcclxuICAgICAgXSk7XHJcblxyXG4gICAgICBsZXQgYWN0aW9ucyA9IHRoaXMuZ2V0QWN0aW9ucygpO1xyXG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMuYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGFjdGlvbnNbYWN0aW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKSB7XHJcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcik7XHJcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnB1c2hJbnRvKHRoaXMuX2FjdGlvbnNIYW5kbGVycyk7XHJcbiAgICAgIHJldHVybiBhY3Rpb25MaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKGFjdGlvbkxpc3RlbmVyKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkxpc3RlbmVyLnNob3VsZC5iZS5pbnN0YW5jZU9mKEFjdGlvbkhhbmRsZXIpICYmXHJcbiAgICAgICAgYWN0aW9uTGlzdGVuZXIuaXNJbnNpZGUodGhpcy5fYWN0aW9uc0hhbmRsZXJzKS5zaG91bGQuYmUub2tcclxuICAgICAgKTtcclxuICAgICAgYWN0aW9uTGlzdGVuZXIucmVtb3ZlRnJvbSh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHtcclxuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgIHJldHVybiB5aWVsZCBPYmplY3Qua2V5cyh0aGlzLl9hY3Rpb25zSGFuZGxlcnNbYWN0aW9uXSlcclxuICAgICAgICAubWFwKChrZXkpID0+IHRoaXMuX2FjdGlvbnNIYW5kbGVyc1thY3Rpb25dW2tleV0uZGlzcGF0Y2gocGFyYW1zKSk7XHJcbiAgICAgIH0sIHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIHtcclxuICAgIGRpc3BsYXlOYW1lOiBudWxsLFxyXG4gICAgX2FjdGlvbnNIYW5kbGVyczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgXy5leHRlbmQoRGlzcGF0Y2hlciwge1xyXG4gICAgQWN0aW9uSGFuZGxlcixcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIERpc3BhdGNoZXI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==