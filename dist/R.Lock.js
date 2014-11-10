"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");

  var Lock = function Lock() {
    this._acquired = false;
    this._queue = [];
  };

  _.extend(Lock.prototype, {
    _acquired: null,
    _queue: null,
    acquire: function acquire() {
      return R.scope(function (fn) {
        if (!this._acquired) {
          this._acquired = true;
          _.defer(fn);
        } else {
          this._queue.push(fn);
        }
      }, this);
    },
    release: function release() {
      assert(this._acquired, "R.Lock.release(): lock not currently acquired.");
      if (_.size(this._queue) > 0) {
        var fn = this._queue[0];
        this._queue.shift();
        _.defer(fn);
      } else {
        this._acquired = false;
      }
    },
    performSync: regeneratorRuntime.mark(function performSync(fn) {
      var res;
      return regeneratorRuntime.wrap(function performSync$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {case 0:
            context$2$0.next = 2;
            return this.acquire();

          case 2:
            res = fn();

            this.release();
            return context$2$0.abrupt("return", res);

          case 5:
          case "end": return context$2$0.stop();
        }
      }, performSync, this);
    }),
    perform: regeneratorRuntime.mark(function perform(fn) {
      var res;
      return regeneratorRuntime.wrap(function perform$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {case 0:
            context$2$0.next = 2;
            return this.acquire();

          case 2:
            context$2$0.next = 4;
            return fn();

          case 4:
            res = context$2$0.sent;

            this.release();
            return context$2$0.abrupt("return", res);

          case 7:
          case "end": return context$2$0.stop();
        }
      }, perform, this);
    }) });

  return Lock;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFL0IsTUFBSSxJQUFJLEdBQUcsU0FBUyxJQUFJLEdBQUc7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDcEIsQ0FBQzs7QUFFRixHQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDckIsYUFBUyxFQUFFLElBQUk7QUFDZixVQUFNLEVBQUUsSUFBSTtBQUNaLFdBQU8sRUFBRSxTQUFTLE9BQU8sR0FBRztBQUN4QixhQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBUyxFQUFFLEVBQUU7QUFDeEIsWUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDaEIsY0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsV0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNmLE1BQ0k7QUFDRCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN4QjtPQUNKLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDWjtBQUNELFdBQU8sRUFBRSxTQUFTLE9BQU8sR0FBRztBQUN4QixZQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pFLFVBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwQixTQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQ2YsTUFDSTtBQUNELFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQzFCO0tBQ0o7QUFDRCxlQUFXLDBCQUFFLFNBQVUsV0FBVyxDQUFDLEVBQUU7VUFFN0IsR0FBRzs7OzttQkFERCxJQUFJLENBQUMsT0FBTyxFQUFFOzs7QUFDaEIsZUFBRyxHQUFHLEVBQUUsRUFBRTs7QUFDZCxnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dEQUNSLEdBQUc7Ozs7O1NBSlMsV0FBVztLQUtqQyxDQUFBO0FBQ0QsV0FBTywwQkFBRSxTQUFVLE9BQU8sQ0FBQyxFQUFFO1VBRXJCLEdBQUc7Ozs7bUJBREQsSUFBSSxDQUFDLE9BQU8sRUFBRTs7OzttQkFDSixFQUFFLEVBQUU7OztBQUFoQixlQUFHOztBQUNQLGdCQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0RBQ1IsR0FBRzs7Ozs7U0FKSyxPQUFPO0tBS3pCLENBQUEsRUFDSixDQUFDLENBQUM7O0FBRUgsU0FBTyxJQUFJLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuTG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuXHJcbiAgICB2YXIgTG9jayA9IGZ1bmN0aW9uIExvY2soKSB7XHJcbiAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xyXG4gICAgfTtcclxuXHJcbiAgICBfLmV4dGVuZChMb2NrLnByb3RvdHlwZSwge1xyXG4gICAgICAgIF9hY3F1aXJlZDogbnVsbCxcclxuICAgICAgICBfcXVldWU6IG51bGwsXHJcbiAgICAgICAgYWNxdWlyZTogZnVuY3Rpb24gYWNxdWlyZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFIuc2NvcGUoZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLl9hY3F1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBfLmRlZmVyKGZuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3F1ZXVlLnB1c2goZm4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbGVhc2U6IGZ1bmN0aW9uIHJlbGVhc2UoKSB7XHJcbiAgICAgICAgICAgIGFzc2VydCh0aGlzLl9hY3F1aXJlZCwgXCJSLkxvY2sucmVsZWFzZSgpOiBsb2NrIG5vdCBjdXJyZW50bHkgYWNxdWlyZWQuXCIpO1xyXG4gICAgICAgICAgICBpZihfLnNpemUodGhpcy5fcXVldWUpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZuID0gdGhpcy5fcXVldWVbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgXy5kZWZlcihmbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJmb3JtU3luYzogZnVuY3Rpb24qIHBlcmZvcm1TeW5jKGZuKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuYWNxdWlyZSgpO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZm4oKTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwZXJmb3JtOiBmdW5jdGlvbiogcGVyZm9ybShmbikge1xyXG4gICAgICAgICAgICB5aWVsZCB0aGlzLmFjcXVpcmUoKTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHlpZWxkIGZuKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gTG9jaztcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9