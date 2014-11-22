"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var _ActionHandler = (function () {
    var _ActionHandler = function _ActionHandler(action, handler) {
      this.action = action;
      this.handler = handler;
      this.id = _.uniqueId("ActionHandler");
      _.scopeAll(this, ["pushInto", "removeFrom", "dispatch"]);
    };

    _classProps(_ActionHandler, null, {
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

    return _ActionHandler;
  })();

  _.extend(_ActionHandler.prototype, {
    id: null });

  return _ActionHandler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRGlzcGF0Y2hlci5BY3Rpb25IYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixjQUFhO1FBQWIsY0FBYSxHQUNOLFNBRFAsY0FBYSxDQUNMLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDM0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLE9BQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLENBQ1gsQ0FBQyxDQUFDO0tBQ0o7O2dCQVZHLGNBQWE7QUFZakIsY0FBUTs7ZUFBQSxVQUFDLFVBQVUsRUFBRTs7QUFDbkIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUM1QyxjQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixzQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDOUI7QUFDRCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFLLEVBQUUsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN2RSxvQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3pDOztBQUVELGdCQUFVOztlQUFBLFVBQUMsVUFBVSxFQUFFOztBQUNyQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3hDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxJQUM1QyxVQUFVLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzNDLFVBQVUsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQUssRUFBRSxTQUFPO1dBQUEsQ0FDNUQsQ0FBQztBQUNGLGlCQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLGNBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNwRCxtQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQ2hDO1NBQ0Y7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLFVBQVUsRUFBRTtBQUNuQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzVDLGlCQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUNoQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7U0FDN0M7O0FBRUQsY0FBUTs7ZUFBQSxVQUFDLE1BQU0sRUFBRTtBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDeEMsaUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDOzs7O1dBM0NHLGNBQWE7OztBQThDbkIsR0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFhLENBQUMsU0FBUyxFQUFFO0FBQ2hDLE1BQUUsRUFBRSxJQUFJLEVBQ1QsQ0FBQyxDQUFDOztBQUVILFNBQU8sY0FBYSxDQUFDO0NBQ3RCLENBQUMiLCJmaWxlIjoiUi5EaXNwYXRjaGVyLkFjdGlvbkhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjbGFzcyBBY3Rpb25IYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3Rpb24sIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuYWN0aW9uID0gYWN0aW9uO1xuICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICAgIHRoaXMuaWQgPSBfLnVuaXF1ZUlkKCdBY3Rpb25IYW5kbGVyJyk7XG4gICAgICBfLnNjb3BlQWxsKHRoaXMsIFtcbiAgICAgICAgJ3B1c2hJbnRvJyxcbiAgICAgICAgJ3JlbW92ZUZyb20nLFxuICAgICAgICAnZGlzcGF0Y2gnLFxuICAgICAgXSk7XG4gICAgfVxuXG4gICAgcHVzaEludG8oY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKCFjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSkge1xuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSA9IHt9O1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvblt0aGlzLmFjdGlvbl0uc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KHRoaXMuaWQpKTtcbiAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdID0gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmVGcm9tKGNvbGxlY3Rpb24pIHtcbiAgICAgIF8uZGV2KCgpID0+IGNvbGxlY3Rpb24uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBjb2xsZWN0aW9uLnNob3VsZC5oYXZlLnByb3BlcnR5KHRoaXMuYWN0aW9uKSAmJlxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dLnNob3VsZC5oYXZlLnByb3BlcnR5KHRoaXMuaWQsIHRoaXMpXG4gICAgICApO1xuICAgICAgZGVsZXRlIGNvbGxlY3Rpb25bdGhpcy5hY3Rpb25dW3RoaXMuaWRdO1xuICAgICAgaWYoT2JqZWN0LmtleXMoY29sbGVjdGlvblt0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgY29sbGVjdGlvblt0aGlzLmFjdGlvbl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaXNJbnNpZGUoY29sbGVjdGlvbikge1xuICAgICAgXy5kZXYoKCkgPT4gY29sbGVjdGlvbi5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXSAmJlxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSAmJlxuICAgICAgICBjb2xsZWN0aW9uW3RoaXMuYWN0aW9uXVt0aGlzLmlkXSA9PT0gdGhpcztcbiAgICB9XG5cbiAgICBkaXNwYXRjaChwYXJhbXMpIHtcbiAgICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZXIuY2FsbChudWxsLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKEFjdGlvbkhhbmRsZXIucHJvdG90eXBlLCB7XG4gICAgaWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBBY3Rpb25IYW5kbGVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==