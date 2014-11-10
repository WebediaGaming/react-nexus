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

  var ActionListener = (function () {
    var ActionListener = function ActionListener(action, handler) {
      this.action = action;
      this.handler = handler;
      this.id = _.uniqueId("ActionListener");
      _.scopeAll(this, ["pushInto", "removeFrom", "dispatch"]);
    };

    _classProps(ActionListener, null, {
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

    return ActionListener;
  })();

  _.extend(ActionListener.prototype, {
    id: null });

  var Dispatcher = (function () {
    var Dispatcher = function Dispatcher() {
      var _this3 = this;

      _.dev(function () {
        return _this3.getActions.should.be.a.Function && _this3.getDisplayName.should.be.a.Function;
      });

      this._actionsListeners = {};
      _.scopeAll(this, ["addActionListener", "removeActionListener", "dispatch"]);

      var actions = this.getActions();
      Object.keys(actions).forEach(function (action) {
        return _this3.addActionListener(action, actions[action]);
      });
    };

    _classProps(Dispatcher, null, {
      addActionListener: {
        writable: true,
        value: function (action, handler) {
          var actionListener = new ActionListener(action, handler);
          actionListener.pushInto(this._actionsListeners);
          return actionListener;
        }
      },
      removeActionListener: {
        writable: true,
        value: function (actionListener) {
          var _this4 = this;

          _.dev(function () {
            return actionListener.should.be.instanceOf(ActionListener) && actionListener.isInside(_this4._actionsListeners).should.be.ok;
          });
          actionListener.removeFrom(this._actionsListeners);
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
                    return _this5._actionsListeners[action].should.be.ok;
                  });
                  context$4$0.next = 3;
                  return Object.keys(this._actionsListeners[action]).map(function (key) {
                    return _this5._actionsListeners[action][key].dispatch(params);
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
    _actionsListeners: null });

  _.extend(Dispatcher, {
    ActionListener: ActionListener });

  return Dispatcher;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLGNBQWM7UUFBZCxjQUFjLEdBQ1AsU0FEUCxjQUFjLENBQ04sTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUMzQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUMsQ0FBQztLQUNKOztnQkFWRyxjQUFjO0FBWWxCLGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7OztBQUNuQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzVDLGNBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzNCLHNCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUM5QjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQUssTUFBTSxDQUFDLENB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LE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzdCLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLHFCQUFpQixFQUFFLElBQUksRUFDeEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ25CLGtCQUFjLEVBQWQsY0FBYyxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFVBQVUsQ0FBQztDQUNuQixDQUFDIiwiZmlsZSI6IlIuRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIEFjdGlvbkxpc3RlbmVyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICAgIHRoaXMuaWQgPSBfLnVuaXF1ZUlkKCdBY3Rpb25MaXN0ZW5lcicpO1xuICAgICAgXy5zY29wZUFsbCh0aGlzLCBbXG4gICAgICAgICdwdXNoSW50bycsXG4gICAgICAgICdyZW1vdmVGcm9tJyxcbiAgICAgICAgJ2Rpc3BhdGNoJyxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIHB1c2hJbnRvKGNvbGxlY3Rpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICBpZighY29sbGVjdGlvblt0aGlzLmFjdGlvbl0pIHtcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZUZyb20oY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcbiAgICAgICk7XG4gICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0luc2lkZShjb2xsZWN0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID09PSB0aGlzO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHBhcmFtcykge1xuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoQWN0aW9uTGlzdGVuZXIucHJvdG90eXBlLCB7XG4gICAgaWQ6IG51bGwsXG4gIH0pO1xuXG4gIGNsYXNzIERpc3BhdGNoZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5nZXRBY3Rpb25zLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgIHRoaXMuZ2V0RGlzcGxheU5hbWUuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnMgPSB7fTtcbiAgICAgIF8uc2NvcGVBbGwodGhpcywgW1xuICAgICAgICAnYWRkQWN0aW9uTGlzdGVuZXInLFxuICAgICAgICAncmVtb3ZlQWN0aW9uTGlzdGVuZXInLFxuICAgICAgICAnZGlzcGF0Y2gnLFxuICAgICAgXSk7XG5cbiAgICAgIGxldCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKCk7XG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKChhY3Rpb24pID0+IHRoaXMuYWRkQWN0aW9uTGlzdGVuZXIoYWN0aW9uLCBhY3Rpb25zW2FjdGlvbl0pKTtcbiAgICB9XG5cbiAgICBhZGRBY3Rpb25MaXN0ZW5lcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIGxldCBhY3Rpb25MaXN0ZW5lciA9IG5ldyBBY3Rpb25MaXN0ZW5lcihhY3Rpb24sIGhhbmRsZXIpO1xuICAgICAgYWN0aW9uTGlzdGVuZXIucHVzaEludG8odGhpcy5fYWN0aW9uc0xpc3RlbmVycyk7XG4gICAgICByZXR1cm4gYWN0aW9uTGlzdGVuZXI7XG4gICAgfVxuXG4gICAgcmVtb3ZlQWN0aW9uTGlzdGVuZXIoYWN0aW9uTGlzdGVuZXIpIHtcbiAgICAgIF8uZGV2KCgpID0+IGFjdGlvbkxpc3RlbmVyLnNob3VsZC5iZS5pbnN0YW5jZU9mKEFjdGlvbkxpc3RlbmVyKSAmJlxuICAgICAgICBhY3Rpb25MaXN0ZW5lci5pc0luc2lkZSh0aGlzLl9hY3Rpb25zTGlzdGVuZXJzKS5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICBhY3Rpb25MaXN0ZW5lci5yZW1vdmVGcm9tKHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnMpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zID0ge30pIHtcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnNbYWN0aW9uXS5zaG91bGQuYmUub2spO1xuICAgICAgICByZXR1cm4geWllbGQgT2JqZWN0LmtleXModGhpcy5fYWN0aW9uc0xpc3RlbmVyc1thY3Rpb25dKVxuICAgICAgICAubWFwKChrZXkpID0+IHRoaXMuX2FjdGlvbnNMaXN0ZW5lcnNbYWN0aW9uXVtrZXldLmRpc3BhdGNoKHBhcmFtcykpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIHtcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICBfYWN0aW9uc0xpc3RlbmVyczogbnVsbCxcbiAgfSk7XG5cbiAgXy5leHRlbmQoRGlzcGF0Y2hlciwge1xuICAgIEFjdGlvbkxpc3RlbmVyLFxuICB9KTtcblxuICByZXR1cm4gRGlzcGF0Y2hlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=