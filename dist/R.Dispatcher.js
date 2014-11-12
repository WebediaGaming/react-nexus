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

  var Dispatcher = (function () {
    var Dispatcher = function Dispatcher() {
      var _this3 = this;

      _.dev(function () {
        return _this3.getActions.should.be.a.Function && _this3.getDisplayName.should.be.a.Function;
      });

      this._actionsHandlers = {};
      _.scopeAll(this, ["addActionHandler", "removeActionHandler", "dispatch"]);

      var actions = this.getActions();
      Object.keys(actions).forEach(function (action) {
        return _this3.addActionHandler(action, actions[action]);
      });
    };

    _classProps(Dispatcher, null, {
      addActionHandler: {
        writable: true,
        value: function (action, handler) {
          var actionListener = new ActionListener(action, handler);
          actionListener.pushInto(this._actionsHandlers);
          return actionListener;
        }
      },
      removeActionHandler: {
        writable: true,
        value: function (actionListener) {
          var _this4 = this;

          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionListener) && actionListener.isInside(_this4._actionsHandlers).should.be.ok;
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
              var _this5 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _this5._actionsHandlers[action].should.be.ok;
                  });
                  context$4$0.next = 3;
                  return Object.keys(this._actionsHandlers[action]).map(function (key) {
                    return _this5._actionsHandlers[action][key].dispatch(params);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLGFBQWE7UUFBYixhQUFhLEdBQ04sU0FEUCxhQUFhLENBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUMzQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsT0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsQ0FDWCxDQUFDLENBQUM7S0FDSjs7Z0JBVkcsYUFBYTtBQVlqQixjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFOzs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxjQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixzQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDOUI7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFD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QUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtBQUM3QixlQUFXLEVBQUUsSUFBSTtBQUNqQixvQkFBZ0IsRUFBRSxJQUFJLEVBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUNuQixpQkFBYSxFQUFiLGFBQWEsRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIEFjdGlvbkhhbmRsZXIge1xyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uLCBoYW5kbGVyKSB7XHJcbiAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xyXG4gICAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xyXG4gICAgICB0aGlzLmlkID0gXy51bmlxdWVJZCgnQWN0aW9uSGFuZGxlcicpO1xyXG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcclxuICAgICAgICAncHVzaEludG8nLFxyXG4gICAgICAgICdyZW1vdmVGcm9tJyxcclxuICAgICAgICAnZGlzcGF0Y2gnLFxyXG4gICAgICBdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoSW50byhjb2xsZWN0aW9uKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIGlmKCFjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkge1xyXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dID0ge307XHJcbiAgICAgIH1cclxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVGcm9tKGNvbGxlY3Rpb24pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXTtcclxuICAgICAgaWYoT2JqZWN0LmtleXMoY29sbGVjdGlvblt0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzSW5zaWRlKGNvbGxlY3Rpb24pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dICYmXHJcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gJiZcclxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSA9PT0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChwYXJhbXMpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKEFjdGlvbkhhbmRsZXIucHJvdG90eXBlLCB7XHJcbiAgICBpZDogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgY2xhc3MgRGlzcGF0Y2hlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRBY3Rpb25zLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgdGhpcy5nZXREaXNwbGF5TmFtZS5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5fYWN0aW9uc0hhbmRsZXJzID0ge307XHJcbiAgICAgIF8uc2NvcGVBbGwodGhpcywgW1xyXG4gICAgICAgICdhZGRBY3Rpb25IYW5kbGVyJyxcclxuICAgICAgICAncmVtb3ZlQWN0aW9uSGFuZGxlcicsXHJcbiAgICAgICAgJ2Rpc3BhdGNoJyxcclxuICAgICAgXSk7XHJcblxyXG4gICAgICBsZXQgYWN0aW9ucyA9IHRoaXMuZ2V0QWN0aW9ucygpO1xyXG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMuYWRkQWN0aW9uSGFuZGxlcihhY3Rpb24sIGFjdGlvbnNbYWN0aW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbkhhbmRsZXIoYWN0aW9uLCBoYW5kbGVyKSB7XHJcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25MaXN0ZW5lcihhY3Rpb24sIGhhbmRsZXIpO1xyXG4gICAgICBhY3Rpb25MaXN0ZW5lci5wdXNoSW50byh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpO1xyXG4gICAgICByZXR1cm4gYWN0aW9uTGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQWN0aW9uSGFuZGxlcihhY3Rpb25MaXN0ZW5lcikge1xyXG4gICAgICBfLmRldigoKSA9PiBhY3Rpb25MaXN0ZW5lci5zaG91bGQuYmUuaW5zdGFuY2VPZihBY3Rpb25MaXN0ZW5lcikgJiZcclxuICAgICAgICBhY3Rpb25MaXN0ZW5lci5pc0luc2lkZSh0aGlzLl9hY3Rpb25zSGFuZGxlcnMpLnNob3VsZC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICBhY3Rpb25MaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMuX2FjdGlvbnNIYW5kbGVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2goYWN0aW9uLCBwYXJhbXMgPSB7fSkge1xyXG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjdGlvbnNIYW5kbGVyc1thY3Rpb25dLnNob3VsZC5iZS5vayk7XHJcbiAgICAgICAgcmV0dXJuIHlpZWxkIE9iamVjdC5rZXlzKHRoaXMuX2FjdGlvbnNIYW5kbGVyc1thY3Rpb25dKVxyXG4gICAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5fYWN0aW9uc0hhbmRsZXJzW2FjdGlvbl1ba2V5XS5kaXNwYXRjaChwYXJhbXMpKTtcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChEaXNwYXRjaGVyLnByb3RvdHlwZSwge1xyXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgICBfYWN0aW9uc0hhbmRsZXJzOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBfLmV4dGVuZChEaXNwYXRjaGVyLCB7XHJcbiAgICBBY3Rpb25IYW5kbGVyLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gRGlzcGF0Y2hlcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9