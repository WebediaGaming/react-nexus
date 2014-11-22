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
          actionListener.pushInto(this.actionHandlers);
          return actionListener;
        }
      },
      removeActionHandler: {
        writable: true,
        value: function (actionListener) {
          var _this3 = this;

          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionHandler) && actionListener.isInside(_this3.actionHandlers).should.be.ok;
          });
          actionListener.removeFrom(this.actionHandlers);
        }
      },
      dispatch: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$0(action, params) {
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            var _this4 = this;
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:

                if (params === undefined) params = {};
                // jshint ignore:line
                _.dev(function () {
                  return _this4.actionHandlers[action].should.be.ok;
                });
                context$3$0.next = 4;
                return Object.keys(this.actionHandlers[action]) // jshint ignore:line
                .map(function (key) {
                  return _this4.actionHandlers[action][key].dispatch(params);
                });

              case 4: return context$3$0.abrupt("return", context$3$0.sent);
              case 5:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUUzRCxVQUFVO1FBQVYsVUFBVSxHQUNILFNBRFAsVUFBVSxDQUNGLGNBQWMsRUFBTzs7O1VBQXJCLGNBQWMsZ0JBQWQsY0FBYyxHQUFHLEVBQUU7O0FBQzdCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU07aUJBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDbkUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7U0FBQSxDQUM1QztPQUFBLENBQ0YsQ0FBQztBQUNGLFVBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFlBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQzFCLE9BQU8sQ0FBQyxVQUFDLE1BQU07ZUFBSyxNQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDN0U7O2dCQVZHLFVBQVU7QUFZZCxhQUFPOztlQUFBLFlBQUc7Ozs7QUFFUixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQy9CLE9BQU8sQ0FBQyxVQUFDLE1BQU07bUJBQUssT0FBSyxtQkFBbUIsQ0FBQyxPQUFLLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQzs7QUFFNUUsY0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7O0FBRUQsc0JBQWdCOztlQUFBLFVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNoQyxjQUFJLGNBQWMsR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEQsd0JBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzdDLGlCQUFPLGNBQWMsQ0FBQztTQUN2Qjs7QUFFRCx5QkFBbUI7O2VBQUEsVUFBQyxjQUFjLEVBQUU7OztBQUNsQyxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFDNUQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFLLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQzFELENBQUM7QUFDRix3QkFBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDaEQ7O0FBRUEsY0FBUTs7dUNBQUEsb0JBQUMsTUFBTSxFQUFFLE1BQU07Ozs7O29CQUFOLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7O0FBQzNCLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE9BQUssY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFBQSxDQUFDLENBQUM7O3VCQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3BELEdBQUcsQ0FBQyxVQUFDLEdBQUc7eUJBQUssT0FBSyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztpQkFBQSxDQUFDOzs7Ozs7O1NBQ2pFOzs7O1dBckNHLFVBQVU7Ozs7O0FBd0NoQixHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDN0Isa0JBQWMsRUFBRSxJQUFJLEVBQ3JCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUNuQixpQkFBYSxFQUFiLGFBQWEsRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3QgQWN0aW9uSGFuZGxlciA9IHJlcXVpcmUoJy4vUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXInKShSKTtcclxuXHJcbiAgY2xhc3MgRGlzcGF0Y2hlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb25IYW5kbGVycyA9IHt9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkhhbmRsZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBPYmplY3Qua2V5cyhhY3Rpb25IYW5kbGVycykubWFwKChhY3Rpb24pID0+IGFjdGlvbi5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICAgIGFjdGlvbkhhbmRsZXJzW2FjdGlvbl0uc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuYWN0aW9uSGFuZGxlcnMgPSB7fTtcclxuICAgICAgT2JqZWN0LmtleXMoYWN0aW9uSGFuZGxlcnMpXHJcbiAgICAgIC5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMuYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGFjdGlvbkhhbmRsZXJzW2FjdGlvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IHJlbW92ZSBhbGwgYWN0aW9uIGhhbmRsZXJzXHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuYWN0aW9uSGFuZGxlcnMpXHJcbiAgICAgIC5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMucmVtb3ZlQWN0aW9uSGFuZGxlcih0aGlzLmFjdGlvbkhhbmRsZXJzW2FjdGlvbl0pKTtcclxuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXHJcbiAgICAgIHRoaXMuYWN0aW9uSGFuZGxlcnMgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKSB7XHJcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25IYW5kbGVyKGFjdGlvbiwgaGFuZGxlcik7XHJcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnB1c2hJbnRvKHRoaXMuYWN0aW9uSGFuZGxlcnMpO1xyXG4gICAgICByZXR1cm4gYWN0aW9uTGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWN0aW9uSGFuZGxlcihhY3Rpb25MaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25IYW5kbGVyKSAmJlxyXG4gICAgICAgIGFjdGlvbkxpc3RlbmVyLmlzSW5zaWRlKHRoaXMuYWN0aW9uSGFuZGxlcnMpLnNob3VsZC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICBhY3Rpb25MaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMuYWN0aW9uSGFuZGxlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgICpkaXNwYXRjaChhY3Rpb24sIHBhcmFtcyA9IHt9KSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLmFjdGlvbkhhbmRsZXJzW2FjdGlvbl0uc2hvdWxkLmJlLm9rKTtcclxuICAgICAgcmV0dXJuIHlpZWxkIE9iamVjdC5rZXlzKHRoaXMuYWN0aW9uSGFuZGxlcnNbYWN0aW9uXSkgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5hY3Rpb25IYW5kbGVyc1thY3Rpb25dW2tleV0uZGlzcGF0Y2gocGFyYW1zKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwge1xyXG4gICAgYWN0aW9uSGFuZGxlcnM6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIF8uZXh0ZW5kKERpc3BhdGNoZXIsIHtcclxuICAgIEFjdGlvbkhhbmRsZXIsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBEaXNwYXRjaGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=