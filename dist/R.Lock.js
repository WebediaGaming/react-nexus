"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var _Lock = (function () {
    var _Lock = function _Lock() {
      this._acquired = false;
      this._queue = [];
    };

    _classProps(_Lock, null, {
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
        value: regeneratorRuntime.mark(function _callee(fn) {
          var _this3 = this;
          var res;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0: _context.next = 2;
                return _this3.acquire();
              case 2: _context.next = 4;
                return fn();
              case 4: res = _context.sent;
                // jshint ignore:line
                _this3.release();
                return _context.abrupt("return", res);
              case 7:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      }
    });

    return _Lock;
  })();

  _.extend(_Lock.prototype, {
    _acquired: null,
    _queue: null });

  return _Lock;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuTG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsS0FBSTtRQUFKLEtBQUksR0FDRyxTQURQLEtBQUksR0FDTTtBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ2xCOztnQkFKRyxLQUFJO0FBTVIsYUFBTzs7ZUFBQSxZQUFHOztBQUNSLGlCQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxnQkFBRyxDQUFDLE1BQUssU0FBUyxFQUFFO0FBQ2xCLG9CQUFLLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIscUJBQU8sT0FBTyxFQUFFLENBQUM7YUFDbEIsTUFDSTtBQUNILHFCQUFPLE1BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUM7V0FDRixDQUFDLENBQUM7U0FDSjs7QUFFRCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekMsY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLE9BQU8sR0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUExQixPQUFPO0FBQ2IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEIsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsTUFDSTtBQUNILGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztXQUN4QjtTQUNGOztBQUVBLGFBQU87O3VDQUFBLGlCQUFDLEVBQUU7O2NBRUwsR0FBRzs7Ozt1QkFERCxPQUFLLE9BQU8sRUFBRTs7dUJBQ0osRUFBRSxFQUFFO3NCQUFoQixHQUFHOztBQUNQLHVCQUFLLE9BQU8sRUFBRSxDQUFDO2lEQUNSLEdBQUc7Ozs7O1NBQ1g7Ozs7V0FuQ0csS0FBSTs7O0FBc0NWLEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRSxJQUFJLEVBQ2IsQ0FBQyxDQUFDOztBQUVILFNBQU8sS0FBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjbGFzcyBMb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLl9hY3F1aXJlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFjcXVpcmUoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2FjcXVpcmVkKSB7XHJcbiAgICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLl9xdWV1ZS5wdXNoKHsgcmVzb2x2ZSwgcmVqZWN0IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSgpIHtcclxuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fYWNxdWlyZWQuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgaWYodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCB7IHJlc29sdmUgfSA9IHRoaXMuX3F1ZXVlWzBdO1xyXG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAqcGVyZm9ybShmbikgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuICAgICAgeWllbGQgdGhpcy5hY3F1aXJlKCk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG4gICAgICBsZXQgcmVzID0geWllbGQgZm4oKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoTG9jay5wcm90b3R5cGUsIHtcclxuICAgIF9hY3F1aXJlZDogbnVsbCxcclxuICAgIF9xdWV1ZTogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIExvY2s7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==