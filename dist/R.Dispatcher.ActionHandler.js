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

  return ActionHandler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsYUFBYTtRQUFiLGFBQWEsR0FDTixTQURQLGFBQWEsQ0FDTCxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUMsQ0FBQztLQUNKOztnQkFWRyxhQUFhO0FBWWpCLGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7O0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDNUMsY0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDM0Isc0JBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQzlCO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDL0Qsb0JBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN6Qzs7QUFFRCxnQkFBVTs7ZUFBQSxVQUFDLFVBQVUsRUFBRTs7QUFDckIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN4QyxVQUFVLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLFVBQVUsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07V0FBQSxDQUN6RCxDQUFDO0FBQ0YsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3BELG1CQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDaEM7U0FDRjs7QUFFRCxjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFO0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDNUMsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztTQUM3Qzs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUN4QyxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDeEM7Ozs7V0ExQ0csYUFBYTs7O0FBNkNuQixHQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7QUFDaEMsTUFBRSxFQUFFLElBQUksRUFDVCxDQUFDLENBQUM7O0FBRUgsU0FBTyxhQUFhLENBQUM7Q0FDdEIsQ0FBQyIsImZpbGUiOiJSLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgQWN0aW9uSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IoYWN0aW9uLCBoYW5kbGVyKSB7XG4gICAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgICB0aGlzLmlkID0gXy51bmlxdWVJZCgnQWN0aW9uSGFuZGxlcicpO1xuICAgICAgXy5zY29wZUFsbCh0aGlzLCBbXG4gICAgICAgICdwdXNoSW50bycsXG4gICAgICAgICdyZW1vdmVGcm9tJyxcbiAgICAgICAgJ2Rpc3BhdGNoJyxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIHB1c2hJbnRvKGNvbGxlY3Rpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICBpZighY29sbGVjdGlvblt0aGlzLmFjdGlvbl0pIHtcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2spO1xuICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZUZyb20oY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcbiAgICAgICk7XG4gICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc0luc2lkZShjb2xsZWN0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID09PSB0aGlzO1xuICAgIH1cblxuICAgIGRpc3BhdGNoKHBhcmFtcykge1xuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoQWN0aW9uSGFuZGxlci5wcm90b3R5cGUsIHtcbiAgICBpZDogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIEFjdGlvbkhhbmRsZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9