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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsUUFBUTtRQUFSLFFBQVEsR0FDRCxTQURQLFFBQVEsT0FDbUI7VUFBakIsSUFBSSxRQUFKLElBQUk7VUFBRSxPQUFPLFFBQVAsT0FBTzs7QUFDekIsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FDN0IsQ0FBQztBQUNGLE9BQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUN4RDs7Z0JBTkcsUUFBUTtBQVFaLFdBQUs7O2VBQUEsVUFBQyxTQUFTLEVBQUU7OztBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDM0MsY0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDMUIscUJBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQzdCO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BELFNBQVMsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ2pELENBQUM7QUFDRixtQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDekQ7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxTQUFTLEVBQUU7OztBQUNwQixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3ZDLFNBQVMsQ0FBQyxPQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDMUMsU0FBUyxDQUFDLE9BQUssTUFBTSxDQUFDLENBQUMsT0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sUUFBTTtXQUFBLENBQ3hELENBQUM7QUFDRixpQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QyxjQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbkQsbUJBQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGlCQUFPLEtBQUssQ0FBQztTQUNkOztBQUVELFVBQUk7O2VBQUEsVUFBQyxNQUFNLEVBQU87Y0FBYixNQUFNLGdCQUFOLE1BQU0sR0FBRyxFQUFFOztBQUNkLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDOzs7O1dBcENHLFFBQVE7Ozs7O0FBdUNkLEdBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtBQUMzQixRQUFJLEVBQUUsSUFBSTtBQUNWLE1BQUUsRUFBRSxJQUFJO0FBQ1IsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsU0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQyIsImZpbGUiOiJSLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIExpc3RlbmVyIHtcbiAgICBjb25zdHJ1Y3Rvcih7IHJvb20sIGhhbmRsZXIgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgcm9vbSwgaGFuZGxlciwgaWQ6IF8udW5pcXVlSWQocm9vbSl9KTtcbiAgICB9XG5cbiAgICBhZGRUbyhsaXN0ZW5lcnMpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKCFsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKSB7XG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICk7XG4gICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdID0gdGhpcztcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDE7XG4gICAgfVxuXG4gICAgcmVtb3ZlRnJvbShsaXN0ZW5lcnMpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXG4gICAgICApO1xuICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF07XG4gICAgICBpZihPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGVtaXQocGFyYW1zID0ge30pIHtcbiAgICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoTGlzdGVuZXIucHJvdG90eXBlLCB7XG4gICAgcm9vbTogbnVsbCxcbiAgICBpZDogbnVsbCxcbiAgICBoYW5kbGVyOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gTGlzdGVuZXI7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9