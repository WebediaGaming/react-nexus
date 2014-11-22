"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

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
            return collection[_this.action].should.not.have.property(_this.id);
          });
          collection[this.action][this.id] = this;
        }
      },
      removeFrom: {
        writable: true,
        value: function (collection) {
          var _this2 = this;

          _.dev(function () {
            return collection.should.be.an.Object && collection.should.have.property(_this2.action) && collection[_this2.action].should.be.an.Object && collection[_this2.action].should.have.property(_this2.id, _this2);
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

  return ActionHandler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLGFBQWE7UUFBYixhQUFhLEdBQ04sU0FEUCxhQUFhLENBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUMzQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsT0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsQ0FDWCxDQUFDLENBQUM7S0FDSjs7Z0JBVkcsYUFBYTtBQVlqQixjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFOzs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxjQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixzQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDOUI7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFLLEVBQUUsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN2RSxvQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3pDOztBQUVELGdCQUFVOztlQUFBLFVBQUMsVUFBVSxFQUFFOzs7QUFDckIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN4QyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBSyxNQUFNLENBQUMsSUFDNUMsVUFBVSxDQUFDLE9BQUssTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUMzQyxVQUFVLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFLLEVBQUUsU0FBTztXQUFBLENBQzVELENBQUM7QUFDRixpQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDcEQsbUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUNoQztTQUNGOztBQUVELGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxpQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUM1QixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFDaEMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO1NBQzdDOztBQUVELGNBQVE7O2VBQUEsVUFBQyxNQUFNLEVBQUU7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3hDLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4Qzs7OztXQTNDRyxhQUFhOzs7OztBQThDbkIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO0FBQ2hDLE1BQUUsRUFBRSxJQUFJLEVBQ1QsQ0FBQyxDQUFDOztBQUVILFNBQU8sYUFBYSxDQUFDO0NBQ3RCLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuXG4gIGNsYXNzIEFjdGlvbkhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKGFjdGlvbiwgaGFuZGxlcikge1xuICAgICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XG4gICAgICB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgdGhpcy5pZCA9IF8udW5pcXVlSWQoJ0FjdGlvbkhhbmRsZXInKTtcbiAgICAgIF8uc2NvcGVBbGwodGhpcywgW1xuICAgICAgICAncHVzaEludG8nLFxuICAgICAgICAncmVtb3ZlRnJvbScsXG4gICAgICAgICdkaXNwYXRjaCcsXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICBwdXNoSW50byhjb2xsZWN0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIWNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dKSB7XG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dID0ge307XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXS5zaG91bGQubm90LmhhdmUucHJvcGVydHkodGhpcy5pZCkpO1xuICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZUZyb20oY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGNvbGxlY3Rpb24uc2hvdWxkLmhhdmUucHJvcGVydHkodGhpcy5hY3Rpb24pICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0uc2hvdWxkLmhhdmUucHJvcGVydHkodGhpcy5pZCwgdGhpcylcbiAgICAgICk7XG4gICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0luc2lkZShjb2xsZWN0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID09PSB0aGlzO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHBhcmFtcykge1xuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoQWN0aW9uSGFuZGxlci5wcm90b3R5cGUsIHtcbiAgICBpZDogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIEFjdGlvbkhhbmRsZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9