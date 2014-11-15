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
              resolve();
            } else {
              _this._queue.push(resolve);
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
            var resolve = this._queue[0];
            this._queue.shift();
            resolve();
          } else {
            this._acquired = false;
          }
        }
      },
      perform: {
        writable: true,
        value: function (fn) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var res;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0: context$4$0.next = 2;
                  return this.acquire();
                case 2: context$4$0.next = 4;
                  return fn();
                case 4: res = context$4$0.sent;
                  this.release();
                  return context$4$0.abrupt("return", res);
                case 7:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      }
    });

    return Lock;
  })();

  _.extend(Lock.prototype, {
    _acquired: null,
    _queue: null });

  return Lock;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsSUFBSTtRQUFKLElBQUksR0FDRyxTQURQLElBQUksR0FDTTtBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ2xCOztnQkFKRyxJQUFJO0FBTVIsYUFBTzs7ZUFBQSxZQUFHOztBQUNSLGlCQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxnQkFBRyxDQUFDLE1BQUssU0FBUyxFQUFFO0FBQ2xCLG9CQUFLLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIscUJBQU8sRUFBRSxDQUFDO2FBQ1gsTUFDSTtBQUNILG9CQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDM0I7V0FDRixDQUFDLENBQUM7U0FDSjs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekMsY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEIsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsTUFDSTtBQUNILGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztXQUN4QjtTQUNGOztBQUVELGFBQU87O2VBQUEsVUFBQyxFQUFFLEVBQUU7QUFDVixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFFYixHQUFHOzs7O3lCQURELElBQUksQ0FBQyxPQUFPLEVBQUU7O3lCQUNKLEVBQUUsRUFBRTt3QkFBaEIsR0FBRztBQUNQLHNCQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7c0RBQ1IsR0FBRzs7Ozs7V0FDWCxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FyQ0csSUFBSTs7O0FBd0NWLEdBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRSxJQUFJLEVBQ2IsQ0FBQyxDQUFDOztBQUVILFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIExvY2sge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX3F1ZXVlID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWNxdWlyZSgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZighdGhpcy5fYWNxdWlyZWQpIHtcclxuICAgICAgICAgIHRoaXMuX2FjcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9xdWV1ZS5wdXNoKHJlc29sdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSgpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fYWNxdWlyZWQuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgaWYodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCByZXNvbHZlID0gdGhpcy5fcXVldWVbMF07XHJcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBlcmZvcm0oZm4pIHtcclxuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICB5aWVsZCB0aGlzLmFjcXVpcmUoKTtcclxuICAgICAgICBsZXQgcmVzID0geWllbGQgZm4oKTtcclxuICAgICAgICB0aGlzLnJlbGVhc2UoKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKExvY2sucHJvdG90eXBlLCB7XHJcbiAgICBfYWNxdWlyZWQ6IG51bGwsXHJcbiAgICBfcXVldWU6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBMb2NrO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=