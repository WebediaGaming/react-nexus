"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var Listener = (function () {
    var Listener = function Listener(_ref) {
      var room = _ref.room;
      var handler = _ref.handler;
      _.dev(function () {
        return room.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { room: room, handler: handler, id: _.uniqueId(room) });
    };

    _classProps(Listener, null, {
      addTo: {
        writable: true,
        value: function (listeners) {
          var _this = this;
          _.dev(function () {
            return listeners.should.be.an.Object;
          });
          if (!listeners[this.action]) {
            listeners[this.action] = {};
          }
          _.dev(function () {
            return listeners[_this.action].should.be.an.Object && listeners[_this.action][_this.id].should.not.be.ok;
          });
          listeners[this.action][this.id] = this;
          return Object.keys(listeners[this.action]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (listeners) {
          var _this2 = this;
          _.dev(function () {
            return listeners.should.be.an.Object && listeners[_this2.action].should.be.an.Object && listeners[_this2.action][_this2.id].should.be.exactly(_this2);
          });
          delete listeners[this.action][this.id];
          if (Object.keys(listeners[this.action]).length === 0) {
            delete listeners[this.action];
            return true;
          }
          return false;
        }
      },
      emit: {
        writable: true,
        value: function (params) {
          if (params === undefined) params = {};
          _.dev(function () {
            return params.should.be.an.Object;
          });
          this.handler.call(null, params);
        }
      }
    });

    return Listener;
  })();

  _.extend(Listener.prototype, {
    room: null,
    id: null,
    handler: null });

  return Listener;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsUUFBUTtRQUFSLFFBQVEsR0FDRCxTQURQLFFBQVEsT0FDbUI7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTztBQUN6QixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUM3QixDQUFDO0FBQ0YsT0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ3hEOztnQkFORyxRQUFRO0FBUVosV0FBSzs7ZUFBQSxVQUFDLFNBQVMsRUFBRTs7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzNDLGNBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLHFCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUM3QjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQUssTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNwRCxTQUFTLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUNqRCxDQUFDO0FBQ0YsbUJBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN2QyxpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ3pEOztBQUVELGdCQUFVOztlQUFBLFVBQUMsU0FBUyxFQUFFOztBQUNwQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3ZDLFNBQVMsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDMUMsU0FBUyxDQUFDLE9BQUssTUFBTSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQ3hELENBQUM7QUFDRixpQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbkQsbUJBQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGlCQUFPLEtBQUssQ0FBQztTQUNkOztBQUVELFVBQUk7O2VBQUEsVUFBQyxNQUFNLEVBQU87Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFO0FBQ2QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakM7Ozs7V0FwQ0csUUFBUTs7O0FBdUNkLEdBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtBQUMzQixRQUFJLEVBQUUsSUFBSTtBQUNWLE1BQUUsRUFBRSxJQUFJO0FBQ1IsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgTGlzdGVuZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgcm9vbSwgaGFuZGxlciB9KSB7XG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgXy5leHRlbmQodGhpcywgeyByb29tLCBoYW5kbGVyLCBpZDogXy51bmlxdWVJZChyb29tKX0pO1xuICAgIH1cblxuICAgIGFkZFRvKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIWxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pIHtcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXSA9IHt9O1xuICAgICAgfVxuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5va1xuICAgICAgKTtcbiAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMTtcbiAgICB9XG5cbiAgICByZW1vdmVGcm9tKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcbiAgICAgICk7XG4gICAgICBkZWxldGUgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZW1pdChwYXJhbXMgPSB7fSkge1xuICAgICAgXy5kZXYoKCkgPT4gcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChMaXN0ZW5lci5wcm90b3R5cGUsIHtcbiAgICByb29tOiBudWxsLFxuICAgIGlkOiBudWxsLFxuICAgIGhhbmRsZXI6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBMaXN0ZW5lcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=