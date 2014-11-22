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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLGFBQWE7UUFBYixhQUFhLEdBQ04sU0FEUCxhQUFhLENBQ0wsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUMzQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsT0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsQ0FDWCxDQUFDLENBQUM7S0FDSjs7Z0JBVkcsYUFBYTtBQVlqQixjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFOzs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxjQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixzQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDOUI7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztBQUMvRCxvQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3pDOztBQUVELGdCQUFVOztlQUFBLFVBQUMsVUFBVSxFQUFFOzs7QUFDckIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN4QyxVQUFVLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLFVBQVUsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07V0FBQSxDQUN6RCxDQUFDO0FBQ0YsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3BELG1CQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDaEM7U0FDRjs7QUFFRCxjQUFROztlQUFBLFVBQUMsVUFBVSxFQUFFO0FBQ25CLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDNUMsaUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFDNUIsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQ2hDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztTQUM3Qzs7QUFFRCxjQUFROztlQUFBLFVBQUMsTUFBTSxFQUFFO0FBQ2YsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUN4QyxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDeEM7Ozs7V0ExQ0csYUFBYTs7Ozs7QUE2Q25CLEdBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtBQUNoQyxNQUFFLEVBQUUsSUFBSSxFQUNULENBQUMsQ0FBQzs7QUFFSCxTQUFPLGFBQWEsQ0FBQztDQUN0QixDQUFDIiwiZmlsZSI6IlIuRGlzcGF0Y2hlci5BY3Rpb25IYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjbGFzcyBBY3Rpb25IYW5kbGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGFjdGlvbiwgaGFuZGxlcikge1xyXG4gICAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcclxuICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcclxuICAgICAgdGhpcy5pZCA9IF8udW5pcXVlSWQoJ0FjdGlvbkhhbmRsZXInKTtcclxuICAgICAgXy5zY29wZUFsbCh0aGlzLCBbXHJcbiAgICAgICAgJ3B1c2hJbnRvJyxcclxuICAgICAgICAncmVtb3ZlRnJvbScsXHJcbiAgICAgICAgJ2Rpc3BhdGNoJyxcclxuICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaEludG8oY29sbGVjdGlvbikge1xyXG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICBpZighY29sbGVjdGlvblt0aGlzLmFjdGlvbl0pIHtcclxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2spO1xyXG4gICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlRnJvbShjb2xsZWN0aW9uKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXS5zaG91bGQuYmUuZXhhY3RseSh0aGlzKVxyXG4gICAgICApO1xyXG4gICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF07XHJcbiAgICAgIGlmKE9iamVjdC5rZXlzKGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc0luc2lkZShjb2xsZWN0aW9uKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSAmJlxyXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdICYmXHJcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPT09IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2gocGFyYW1zKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChBY3Rpb25IYW5kbGVyLnByb3RvdHlwZSwge1xyXG4gICAgaWQ6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBBY3Rpb25IYW5kbGVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=