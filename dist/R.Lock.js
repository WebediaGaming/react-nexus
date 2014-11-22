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
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
                context$3$0.next = 2;
                return this.acquire();

              case 2:
                context$3$0.next = 4;
                return fn();

              case 4:
                res = context$3$0.sent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixJQUFJO1FBQUosSUFBSSxHQUNHLFNBRFAsSUFBSSxHQUNNO0FBQ1osVUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDbEI7O2dCQUpHLElBQUk7QUFNUixhQUFPOztlQUFBLFlBQUc7OztBQUNSLGlCQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxnQkFBRyxDQUFDLE1BQUssU0FBUyxFQUFFO0FBQ2xCLG9CQUFLLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIscUJBQU8sT0FBTyxFQUFFLENBQUM7YUFDbEIsTUFDSTtBQUNILHFCQUFPLE1BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUM7V0FDRixDQUFDLENBQUM7U0FDSjs7QUFFRCxhQUFPOztlQUFBLFlBQUc7OztBQUNSLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3pDLGNBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQixPQUFPLEdBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBMUIsT0FBTzs7QUFDYixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNwQixtQkFBTyxFQUFFLENBQUM7V0FDWCxNQUNJO0FBQ0gsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1dBQ3hCO1NBQ0Y7O0FBRUEsYUFBTzs7dUNBQUEsb0JBQUMsRUFBRTtjQUVMLEdBQUc7Ozs7dUJBREQsSUFBSSxDQUFDLE9BQU8sRUFBRTs7Ozt1QkFDSixFQUFFLEVBQUU7OztBQUFoQixtQkFBRzs7QUFDUCxvQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29EQUNSLEdBQUc7Ozs7OztTQUNYOzs7O1dBbkNHLElBQUk7Ozs7O0FBc0NWLEdBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRSxJQUFJLEVBQ2IsQ0FBQyxDQUFDOztBQUVILFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcblxyXG4gIGNsYXNzIExvY2sge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX3F1ZXVlID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWNxdWlyZSgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZighdGhpcy5fYWNxdWlyZWQpIHtcclxuICAgICAgICAgIHRoaXMuX2FjcXVpcmVkID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXVlLnB1c2goeyByZXNvbHZlLCByZWplY3QgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9hY3F1aXJlZC5zaG91bGQuYmUub2spO1xyXG4gICAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IHsgcmVzb2x2ZSB9ID0gdGhpcy5fcXVldWVbMF07XHJcbiAgICAgICAgdGhpcy5fcXVldWUuc2hpZnQoKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICpwZXJmb3JtKGZuKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG4gICAgICB5aWVsZCB0aGlzLmFjcXVpcmUoKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIGxldCByZXMgPSB5aWVsZCBmbigpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChMb2NrLnByb3RvdHlwZSwge1xyXG4gICAgX2FjcXVpcmVkOiBudWxsLFxyXG4gICAgX3F1ZXVlOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTG9jaztcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9