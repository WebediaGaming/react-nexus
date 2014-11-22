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

  var _Dispatcher = (function () {
    var _Dispatcher = function _Dispatcher(actionHandlers) {
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

    _classProps(_Dispatcher, null, {
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
        value: regeneratorRuntime.mark(function _callee(action, params) {
          var _this4 = this;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0:
                if (params === undefined) params = {};
                // jshint ignore:line
                _.dev(function () {
                  return _this4.actionHandlers[action].should.be.ok;
                });
                _context.next = 4;
                return Object.keys(_this4.actionHandlers[action]) // jshint ignore:line
                .map(function (key) {
                  return _this4.actionHandlers[action][key].dispatch(params);
                });
              case 4: return _context.abrupt("return", _context.sent);
              case 5:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      }
    });

    return _Dispatcher;
  })();

  _.extend(_Dispatcher.prototype, {
    actionHandlers: null });

  _.extend(_Dispatcher, {
    ActionHandler: ActionHandler });

  return _Dispatcher;
};
//# sourceMappingURL=data:application/json;base64,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QUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7aUJBQUEsQ0FBQzs7Ozs7O1NBQ2pFOzs7O1dBckNHLFdBQVU7OztBQXdDaEIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFVLENBQUMsU0FBUyxFQUFFO0FBQzdCLGtCQUFjLEVBQUUsSUFBSSxFQUNyQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFVLEVBQUU7QUFDbkIsaUJBQWEsRUFBYixhQUFhLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sV0FBVSxDQUFDO0NBQ25CLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBBY3Rpb25IYW5kbGVyID0gcmVxdWlyZSgnLi9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlcicpKFIpO1xyXG5cclxuICBjbGFzcyBEaXNwYXRjaGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGFjdGlvbkhhbmRsZXJzID0ge30pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gYWN0aW9uSGFuZGxlcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbkhhbmRsZXJzKS5tYXAoKGFjdGlvbikgPT4gYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgYWN0aW9uSGFuZGxlcnNbYWN0aW9uXS5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5hY3Rpb25IYW5kbGVycyA9IHt9O1xyXG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25IYW5kbGVycylcclxuICAgICAgLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5hZGRBY3Rpb25IYW5kbGVyKGFjdGlvbiwgYWN0aW9uSGFuZGxlcnNbYWN0aW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgcmVtb3ZlIGFsbCBhY3Rpb24gaGFuZGxlcnNcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5hY3Rpb25IYW5kbGVycylcclxuICAgICAgLmZvckVhY2goKGFjdGlvbikgPT4gdGhpcy5yZW1vdmVBY3Rpb25IYW5kbGVyKHRoaXMuYWN0aW9uSGFuZGxlcnNbYWN0aW9uXSkpO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5hY3Rpb25IYW5kbGVycyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGhhbmRsZXIpIHtcclxuICAgICAgbGV0IGFjdGlvbkxpc3RlbmVyID0gbmV3IEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKTtcclxuICAgICAgYWN0aW9uTGlzdGVuZXIucHVzaEludG8odGhpcy5hY3Rpb25IYW5kbGVycyk7XHJcbiAgICAgIHJldHVybiBhY3Rpb25MaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVBY3Rpb25IYW5kbGVyKGFjdGlvbkxpc3RlbmVyKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkxpc3RlbmVyLnNob3VsZC5iZS5pbnN0YW5jZU9mKEFjdGlvbkhhbmRsZXIpICYmXHJcbiAgICAgICAgYWN0aW9uTGlzdGVuZXIuaXNJbnNpZGUodGhpcy5hY3Rpb25IYW5kbGVycykuc2hvdWxkLmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIGFjdGlvbkxpc3RlbmVyLnJlbW92ZUZyb20odGhpcy5hY3Rpb25IYW5kbGVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgKmRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuYWN0aW9uSGFuZGxlcnNbYWN0aW9uXS5zaG91bGQuYmUub2spO1xyXG4gICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5hY3Rpb25IYW5kbGVyc1thY3Rpb25dKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLmFjdGlvbkhhbmRsZXJzW2FjdGlvbl1ba2V5XS5kaXNwYXRjaChwYXJhbXMpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKERpc3BhdGNoZXIucHJvdG90eXBlLCB7XHJcbiAgICBhY3Rpb25IYW5kbGVyczogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgXy5leHRlbmQoRGlzcGF0Y2hlciwge1xyXG4gICAgQWN0aW9uSGFuZGxlcixcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIERpc3BhdGNoZXI7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==