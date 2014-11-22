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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLFFBQVE7UUFBUixRQUFRLEdBQ0QsU0FEUCxRQUFRLE9BQ21CO1VBQWpCLElBQUksUUFBSixJQUFJO1VBQUUsT0FBTyxRQUFQLE9BQU87O0FBQ3pCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixPQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDeEQ7O2dCQU5HLFFBQVE7QUFRWixXQUFLOztlQUFBLFVBQUMsU0FBUyxFQUFFOzs7QUFDZixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQzNDLGNBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3hCLHFCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztXQUMzQjtBQUNELFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQUssSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNsRCxTQUFTLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUMvQyxDQUFDO0FBQ0YsbUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNyQyxpQkFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEOztBQUVELGdCQUFVOztlQUFBLFVBQUMsU0FBUyxFQUFFOzs7QUFDcEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN2QyxTQUFTLENBQUMsT0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3hDLFNBQVMsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07V0FBQSxDQUN0RCxDQUFDO0FBQ0YsaUJBQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsY0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pELG1CQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxpQkFBTyxLQUFLLENBQUM7U0FDZDs7QUFFRCxVQUFJOztlQUFBLFVBQUMsTUFBTSxFQUFPO2NBQWIsTUFBTSxnQkFBTixNQUFNLEdBQUcsRUFBRTs7QUFDZCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3hDLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNqQzs7OztXQXBDRyxRQUFROzs7OztBQXVDZCxHQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDM0IsUUFBSSxFQUFFLElBQUk7QUFDVixNQUFFLEVBQUUsSUFBSTtBQUNSLFdBQU8sRUFBRSxJQUFJLEVBQ2QsQ0FBQyxDQUFDOztBQUVILFNBQU8sUUFBUSxDQUFDO0NBQ2pCLENBQUMiLCJmaWxlIjoiUi5FdmVudEVtaXR0ZXIuTGlzdGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcblxyXG4gIGNsYXNzIExpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgcm9vbSwgaGFuZGxlciB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxyXG4gICAgICApO1xyXG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IHJvb20sIGhhbmRsZXIsIGlkOiBfLnVuaXF1ZUlkKHJvb20pfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVG8obGlzdGVuZXJzKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgaWYoIWxpc3RlbmVyc1t0aGlzLnJvb21dKSB7XHJcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0gPSB7fTtcclxuICAgICAgfVxyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnNbdGhpcy5yb29tXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXSA9IHRoaXM7XHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhsaXN0ZW5lcnNbdGhpcy5yb29tXSkubGVuZ3RoID09PSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUZyb20obGlzdGVuZXJzKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMucm9vbV0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLnJvb21dW3RoaXMuaWRdLnNob3VsZC5iZS5leGFjdGx5KHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5yb29tXVt0aGlzLmlkXTtcclxuICAgICAgaWYoT2JqZWN0LmtleXMobGlzdGVuZXJzW3RoaXMucm9vbV0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5yb29tXTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZW1pdChwYXJhbXMgPSB7fSkge1xyXG4gICAgICBfLmRldigoKSA9PiBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChMaXN0ZW5lci5wcm90b3R5cGUsIHtcclxuICAgIHJvb206IG51bGwsXHJcbiAgICBpZDogbnVsbCxcclxuICAgIGhhbmRsZXI6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBMaXN0ZW5lcjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9