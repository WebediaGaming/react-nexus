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
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
                  context$4$0.next = 2;
                  return this.acquire();

                case 2:
                  context$4$0.next = 4;
                  return fn();

                case 4:
                  res = context$4$0.sent;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007QUFDWixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNsQjs7Z0JBSkcsSUFBSTtBQU1SLGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsaUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGdCQUFHLENBQUMsTUFBSyxTQUFTLEVBQUU7QUFDbEIsb0JBQUssU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixxQkFBTyxFQUFFLENBQUM7YUFDWCxNQUNJO0FBQ0gsb0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQjtXQUNGLENBQUMsQ0FBQztTQUNKOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekMsY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEIsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsTUFDSTtBQUNILGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztXQUN4QjtTQUNGOztBQUVELGFBQU87O2VBQUEsVUFBQyxFQUFFLEVBQUU7QUFDVixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFFYixHQUFHOzs7O3lCQURELElBQUksQ0FBQyxPQUFPLEVBQUU7Ozs7eUJBQ0osRUFBRSxFQUFFOzs7QUFBaEIscUJBQUc7O0FBQ1Asc0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztzREFDUixHQUFHOzs7Ozs7V0FDWCxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FyQ0csSUFBSTs7Ozs7QUF3Q1YsR0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3ZCLGFBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBTSxFQUFFLElBQUksRUFDYixDQUFDLENBQUM7O0FBRUgsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDIiwiZmlsZSI6IlIuTG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuXHJcbiAgY2xhc3MgTG9jayB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5fcXVldWUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhY3F1aXJlKCkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGlmKCF0aGlzLl9hY3F1aXJlZCkge1xyXG4gICAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuX3F1ZXVlLnB1c2gocmVzb2x2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlKCkge1xyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9hY3F1aXJlZC5zaG91bGQuYmUub2spO1xyXG4gICAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IHJlc29sdmUgPSB0aGlzLl9xdWV1ZVswXTtcclxuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcGVyZm9ybShmbikge1xyXG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgIHlpZWxkIHRoaXMuYWNxdWlyZSgpO1xyXG4gICAgICAgIGxldCByZXMgPSB5aWVsZCBmbigpO1xyXG4gICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgIH0sIHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoTG9jay5wcm90b3R5cGUsIHtcclxuICAgIF9hY3F1aXJlZDogbnVsbCxcclxuICAgIF9xdWV1ZTogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIExvY2s7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==