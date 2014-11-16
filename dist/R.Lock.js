"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var Lock = (function () {
    var Lock = function Lock() {
      this._acquired = false;
      this._queue = [];
    };

    _classProps(Lock, null, {
      acquire: {
        writable: true,
        value: function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
            if (!_this._acquired) {
              _this._acquired = true;
              return resolve();
            } else {
              return _this._queue.push({ resolve: resolve, reject: reject });
            }
          });
        }
      },
      release: {
        writable: true,
        value: function () {
          var _this2 = this;
          _.dev(function () {
            return _this2._acquired.should.be.ok;
          });
          if (this._queue.length > 0) {
            var resolve = this._queue[0].resolve;
            this._queue.shift();
            resolve();
          } else {
            this._acquired = false;
          }
        }
      },
      perform: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$0(fn) {
          var res;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: context$3$0.next = 2;
                return this.acquire();
              case 2: context$3$0.next = 4;
                return fn();
              case 4: res = context$3$0.sent;
                // jshint ignore:line
                this.release();
                return context$3$0.abrupt("return", res);
              case 7:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })
      }
    });

    return Lock;
  })();

  _.extend(Lock.prototype, {
    _acquired: null,
    _queue: null });

  return Lock;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVSLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007QUFDWixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNsQjs7Z0JBSkcsSUFBSTtBQU1SLGFBQU87O2VBQUEsWUFBRzs7QUFDUixpQkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsZ0JBQUcsQ0FBQyxNQUFLLFNBQVMsRUFBRTtBQUNsQixvQkFBSyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLHFCQUFPLE9BQU8sRUFBRSxDQUFDO2FBQ2xCLE1BQ0k7QUFDSCxxQkFBTyxNQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzlDO1dBQ0YsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOztBQUNSLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3pDLGNBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQixPQUFPLEdBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBMUIsT0FBTztBQUNiLGdCQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BCLG1CQUFPLEVBQUUsQ0FBQztXQUNYLE1BQ0k7QUFDSCxnQkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7V0FDeEI7U0FDRjs7QUFFQSxhQUFPOzt1Q0FBQSxvQkFBQyxFQUFFO2NBRUwsR0FBRzs7Ozt1QkFERCxJQUFJLENBQUMsT0FBTyxFQUFFOzt1QkFDSixFQUFFLEVBQUU7c0JBQWhCLEdBQUc7O0FBQ1Asb0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvREFDUixHQUFHOzs7OztTQUNYOzs7O1dBbkNHLElBQUk7OztBQXNDVixHQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkIsYUFBUyxFQUFFLElBQUk7QUFDZixVQUFNLEVBQUUsSUFBSSxFQUNiLENBQUMsQ0FBQzs7QUFFSCxTQUFPLElBQUksQ0FBQztDQUNiLENBQUMiLCJmaWxlIjoiUi5Mb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcblxuICBjbGFzcyBMb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIH1cblxuICAgIGFjcXVpcmUoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZighdGhpcy5fYWNxdWlyZWQpIHtcbiAgICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcXVldWUucHVzaCh7IHJlc29sdmUsIHJlamVjdCB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjcXVpcmVkLnNob3VsZC5iZS5vayk7XG4gICAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCB7IHJlc29sdmUgfSA9IHRoaXMuX3F1ZXVlWzBdO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAqcGVyZm9ybShmbikgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIHlpZWxkIHRoaXMuYWNxdWlyZSgpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIGxldCByZXMgPSB5aWVsZCBmbigpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIHRoaXMucmVsZWFzZSgpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChMb2NrLnByb3RvdHlwZSwge1xuICAgIF9hY3F1aXJlZDogbnVsbCxcbiAgICBfcXVldWU6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBMb2NrO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==