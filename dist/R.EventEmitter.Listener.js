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
          if (!listeners[this.room]) {
            listeners[this.room] = {};
          }
          _.dev(function () {
            return listeners[_this.room].should.be.an.Object && listeners[_this.room][_this.id].should.not.be.ok;
          });
          listeners[this.room][this.id] = this;
          return Object.keys(listeners[this.room]).length === 1;
        }
      },
      removeFrom: {
        writable: true,
        value: function (listeners) {
          var _this2 = this;
          _.dev(function () {
            return listeners.should.be.an.Object && listeners[_this2.room].should.be.an.Object && listeners[_this2.room][_this2.id].should.be.exactly(_this2);
          });
          delete listeners[this.room][this.id];
          if (Object.keys(listeners[this.room]).length === 0) {
            delete listeners[this.room];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsUUFBUTtRQUFSLFFBQVEsR0FDRCxTQURQLFFBQVEsT0FDbUI7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTztBQUN6QixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7T0FBQSxDQUM3QixDQUFDO0FBQ0YsT0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0tBQ3hEOztnQkFORyxRQUFRO0FBUVosV0FBSzs7ZUFBQSxVQUFDLFNBQVMsRUFBRTs7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzNDLGNBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hCLHFCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUMzQjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNsRCxTQUFTLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUMvQyxDQUFDO0FBQ0YsbUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNyQyxpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEOztBQUVELGdCQUFVOztlQUFBLFVBQUMsU0FBUyxFQUFFOztBQUNwQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3ZDLFNBQVMsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDeEMsU0FBUyxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQ3RELENBQUM7QUFDRixpQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDakQsbUJBQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGlCQUFPLEtBQUssQ0FBQztTQUNkOztBQUVELFVBQUk7O2VBQUEsVUFBQyxNQUFNLEVBQU87Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFO0FBQ2QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtXQUFBLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakM7Ozs7V0FwQ0csUUFBUTs7O0FBdUNkLEdBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtBQUMzQixRQUFJLEVBQUUsSUFBSTtBQUNWLE1BQUUsRUFBRSxJQUFJO0FBQ1IsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG5cbiAgY2xhc3MgTGlzdGVuZXIge1xuICAgIGNvbnN0cnVjdG9yKHsgcm9vbSwgaGFuZGxlciB9KSB7XG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgXy5leHRlbmQodGhpcywgeyByb29tLCBoYW5kbGVyLCBpZDogXy51bmlxdWVJZChyb29tKX0pO1xuICAgIH1cblxuICAgIGFkZFRvKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIWxpc3RlbmVyc1t0aGlzLnJvb21dKSB7XG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLnJvb21dID0ge307XG4gICAgICB9XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnNbdGhpcy5yb29tXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLnJvb21dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXSA9IHRoaXM7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMobGlzdGVuZXJzW3RoaXMucm9vbV0pLmxlbmd0aCA9PT0gMTtcbiAgICB9XG5cbiAgICByZW1vdmVGcm9tKGxpc3RlbmVycykge1xuICAgICAgXy5kZXYoKCkgPT4gbGlzdGVuZXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXS5zaG91bGQuYmUuZXhhY3RseSh0aGlzKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLnJvb21dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLnJvb21dO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBlbWl0KHBhcmFtcyA9IHt9KSB7XG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICB0aGlzLmhhbmRsZXIuY2FsbChudWxsLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKExpc3RlbmVyLnByb3RvdHlwZSwge1xuICAgIHJvb206IG51bGwsXG4gICAgaWQ6IG51bGwsXG4gICAgaGFuZGxlcjogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIExpc3RlbmVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==