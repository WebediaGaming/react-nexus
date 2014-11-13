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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkV2ZW50RW1pdHRlci5MaXN0ZW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztNQUVsQixRQUFRO1FBQVIsUUFBUSxHQUNELFNBRFAsUUFBUSxPQUNtQjtVQUFqQixJQUFJLFFBQUosSUFBSTtVQUFFLE9BQU8sUUFBUCxPQUFPO0FBQ3pCLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQzdCLENBQUM7QUFDRixPQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7S0FDeEQ7O2dCQU5HLFFBQVE7QUFRWixXQUFLOztlQUFBLFVBQUMsU0FBUyxFQUFFOztBQUNmLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDM0MsY0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDMUIscUJBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1dBQzdCO0FBQ0QsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxTQUFTLENBQUMsTUFBSyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BELFNBQVMsQ0FBQyxNQUFLLE1BQU0sQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQ2pELENBQUM7QUFDRixtQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDekQ7O0FBRUQsZ0JBQVU7O2VBQUEsVUFBQyxTQUFTLEVBQUU7O0FBQ3BCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDdkMsU0FBUyxDQUFDLE9BQUssTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUMxQyxTQUFTLENBQUMsT0FBSyxNQUFNLENBQUMsQ0FBQyxPQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxRQUFNO1dBQUEsQ0FDeEQsQ0FBQztBQUNGLGlCQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLGNBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNuRCxtQkFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLG1CQUFPLElBQUksQ0FBQztXQUNiO0FBQ0QsaUJBQU8sS0FBSyxDQUFDO1NBQ2Q7O0FBRUQsVUFBSTs7ZUFBQSxVQUFDLE1BQU0sRUFBTztjQUFiLE1BQU0sZ0JBQU4sTUFBTSxHQUFHLEVBQUU7QUFDZCxXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO1dBQUEsQ0FBQyxDQUFDO0FBQ3hDLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNqQzs7OztXQXBDRyxRQUFROzs7QUF1Q2QsR0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQzNCLFFBQUksRUFBRSxJQUFJO0FBQ1YsTUFBRSxFQUFFLElBQUk7QUFDUixXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFFBQVEsQ0FBQztDQUNqQixDQUFDIiwiZmlsZSI6IlIuRXZlbnRFbWl0dGVyLkxpc3RlbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuICBjbGFzcyBMaXN0ZW5lciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IHJvb20sIGhhbmRsZXIgfSkge1xyXG4gICAgICBfLmRldigoKSA9PiByb29tLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgXy5leHRlbmQodGhpcywgeyByb29tLCBoYW5kbGVyLCBpZDogXy51bmlxdWVJZChyb29tKX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFRvKGxpc3RlbmVycykge1xyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIGlmKCFsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dKSB7XHJcbiAgICAgICAgbGlzdGVuZXJzW3RoaXMuYWN0aW9uXSA9IHt9O1xyXG4gICAgICB9XHJcbiAgICAgIF8uZGV2KCgpID0+IGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLm5vdC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dW3RoaXMuaWRdID0gdGhpcztcclxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVGcm9tKGxpc3RlbmVycykge1xyXG4gICAgICBfLmRldigoKSA9PiBsaXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0uc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcclxuICAgICAgKTtcclxuICAgICAgZGVsZXRlIGxpc3RlbmVyc1t0aGlzLmFjdGlvbl1bdGhpcy5pZF07XHJcbiAgICAgIGlmKE9iamVjdC5rZXlzKGxpc3RlbmVyc1t0aGlzLmFjdGlvbl0pLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRlbGV0ZSBsaXN0ZW5lcnNbdGhpcy5hY3Rpb25dO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBlbWl0KHBhcmFtcyA9IHt9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgdGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgcGFyYW1zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKExpc3RlbmVyLnByb3RvdHlwZSwge1xyXG4gICAgcm9vbTogbnVsbCxcclxuICAgIGlkOiBudWxsLFxyXG4gICAgaGFuZGxlcjogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIExpc3RlbmVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=