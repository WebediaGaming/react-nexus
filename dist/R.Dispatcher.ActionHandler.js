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

  return ActionHandler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkRpc3BhdGNoZXIuQWN0aW9uSGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsYUFBYTtRQUFiLGFBQWEsR0FDTixTQURQLGFBQWEsQ0FDTCxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxPQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUMsQ0FBQztLQUNKOztnQkFWRyxhQUFhO0FBWWpCLGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7OztBQUNuQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzVDLGNBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzNCLHNCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUM5QjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sVUFBVSxDQUFDLE1BQUssTUFBTSxDQUFDLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQy9ELG9CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDekM7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxVQUFVLEVBQUU7OztBQUNyQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3hDLFVBQVUsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDM0MsVUFBVSxDQUFDLE9BQUssTUFBTSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQ3pELENBQUM7QUFDRixpQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDcEQsbUJBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUNoQztTQUNGOztBQUVELGNBQVE7O2VBQUEsVUFBQyxVQUFVLEVBQUU7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxpQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUM1QixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFDaEMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO1NBQzdDOztBQUVELGNBQVE7O2VBQUEsVUFBQyxNQUFNLEVBQUU7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3hDLGlCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4Qzs7OztXQTFDRyxhQUFhOzs7OztBQTZDbkIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO0FBQ2hDLE1BQUUsRUFBRSxJQUFJLEVBQ1QsQ0FBQyxDQUFDOztBQUVILFNBQU8sYUFBYSxDQUFDO0NBQ3RCLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBBY3Rpb25IYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICAgIHRoaXMuaWQgPSBfLnVuaXF1ZUlkKCdBY3Rpb25IYW5kbGVyJyk7XG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcbiAgICAgICAgJ3B1c2hJbnRvJyxcbiAgICAgICAgJ3JlbW92ZUZyb20nLFxuICAgICAgICAnZGlzcGF0Y2gnLFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgcHVzaEludG8oY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKCFjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkge1xuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSA9IHt9O1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5vayk7XG4gICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSA9IHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlRnJvbShjb2xsZWN0aW9uKSB7XG4gICAgICBfLmRldigoKSA9PiBjb2xsZWN0aW9uLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXS5zaG91bGQuYmUuZXhhY3RseSh0aGlzKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzSW5zaWRlKGNvbGxlY3Rpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICByZXR1cm4gY29sbGVjdGlvblt0aGlzLmFjdGlvbl0gJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gJiZcbiAgICAgICAgY29sbGVjdGlvblt0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPT09IHRoaXM7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2gocGFyYW1zKSB7XG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChBY3Rpb25IYW5kbGVyLnByb3RvdHlwZSwge1xuICAgIGlkOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gQWN0aW9uSGFuZGxlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=