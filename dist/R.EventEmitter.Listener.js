"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var _Listener = (function () {
    var _Listener = function _Listener(_ref) {
      var room = _ref.room;
      var handler = _ref.handler;
      _.dev(function () {
        return room.should.be.a.String && handler.should.be.a.Function;
      });
      _.extend(this, { room: room, handler: handler, id: _.uniqueId(room) });
    };

    _classProps(_Listener, null, {
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
            return listeners[_this.room].should.be.an.Object && listeners[_this.room].should.not.have.property(_this.id);
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
            return listeners.should.be.an.Object && listeners.should.have.property(_this2.room) && listeners[_this2.room].should.be.an.Object && listeners[_this2.room].should.have.propery(_this2.id, _this2);
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

    return _Listener;
  })();

  _.extend(_Listener.prototype, {
    room: null,
    id: null,
    handler: null });

  return _Listener;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixTQUFRO1FBQVIsU0FBUSxHQUNELFNBRFAsU0FBUSxPQUNtQjtVQUFqQixJQUFJLFFBQUosSUFBSTtVQUFFLE9BQU8sUUFBUCxPQUFPO0FBQ3pCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixPQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDeEQ7O2dCQU5HLFNBQVE7QUFRWixXQUFLOztlQUFBLFVBQUMsU0FBUyxFQUFFOztBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDM0MsY0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDeEIscUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQzNCO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ2xELFNBQVMsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFLLEVBQUUsQ0FBQztXQUFBLENBQ3ZELENBQUM7QUFDRixtQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDdkQ7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxTQUFTLEVBQUU7O0FBQ3BCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDdkMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQUssSUFBSSxDQUFDLElBQ3pDLFNBQVMsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDeEMsU0FBUyxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBSyxFQUFFLFNBQU87V0FBQSxDQUN4RCxDQUFDO0FBQ0YsaUJBQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pELG1CQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxpQkFBTyxLQUFLLENBQUM7U0FDZDs7QUFFRCxVQUFJOztlQUFBLFVBQUMsTUFBTSxFQUFPO2NBQWIsTUFBTSxnQkFBTixNQUFNLEdBQUcsRUFBRTtBQUNkLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDOzs7O1dBckNHLFNBQVE7OztBQXdDZCxHQUFDLENBQUMsTUFBTSxDQUFDLFNBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDM0IsUUFBSSxFQUFFLElBQUk7QUFDVixNQUFFLEVBQUUsSUFBSTtBQUNSLFdBQU8sRUFBRSxJQUFJLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sU0FBUSxDQUFDO0NBQ2pCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjbGFzcyBMaXN0ZW5lciB7XG4gICAgY29uc3RydWN0b3IoeyByb29tLCBoYW5kbGVyIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IHJvb20sIGhhbmRsZXIsIGlkOiBfLnVuaXF1ZUlkKHJvb20pfSk7XG4gICAgfVxuXG4gICAgYWRkVG8obGlzdGVuZXJzKSB7XG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICBpZighbGlzdGVuZXJzW3RoaXMucm9vbV0pIHtcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyc1t0aGlzLnJvb21dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0uc2hvdWxkLm5vdC5oYXZlLnByb3BlcnR5KHRoaXMuaWQpXG4gICAgICApO1xuICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV1bdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLnJvb21dKS5sZW5ndGggPT09IDE7XG4gICAgfVxuXG4gICAgcmVtb3ZlRnJvbShsaXN0ZW5lcnMpIHtcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgIGxpc3RlbmVycy5zaG91bGQuaGF2ZS5wcm9wZXJ0eSh0aGlzLnJvb20pICYmXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLnJvb21dLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0uc2hvdWxkLmhhdmUucHJvcGVyeSh0aGlzLmlkLCB0aGlzKVxuICAgICAgKTtcbiAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXTtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLnJvb21dKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLnJvb21dO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBlbWl0KHBhcmFtcyA9IHt9KSB7XG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICB0aGlzLmhhbmRsZXIuY2FsbChudWxsLCBwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKExpc3RlbmVyLnByb3RvdHlwZSwge1xuICAgIHJvb206IG51bGwsXG4gICAgaWQ6IG51bGwsXG4gICAgaGFuZGxlcjogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIExpc3RlbmVyO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==