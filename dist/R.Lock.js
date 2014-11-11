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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007QUFDWixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNsQjs7Z0JBSkcsSUFBSTtBQU1SLGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsaUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGdCQUFHLENBQUMsTUFBSyxTQUFTLEVBQUU7QUFDbEIsb0JBQUssU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixxQkFBTyxFQUFFLENBQUM7YUFDWCxNQUNJO0FBQ0gsb0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQjtXQUNGLENBQUMsQ0FBQztTQUNKOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekMsY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEIsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsTUFDSTtBQUNILGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztXQUN4QjtTQUNGOztBQUVELGFBQU87O2VBQUEsVUFBQyxFQUFFLEVBQUU7QUFDVixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFFYixHQUFHOzs7O3lCQURELElBQUksQ0FBQyxPQUFPLEVBQUU7Ozs7eUJBQ0osRUFBRSxFQUFFOzs7QUFBaEIscUJBQUc7O0FBQ1Asc0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztzREFDUixHQUFHOzs7Ozs7V0FDWCxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FyQ0csSUFBSTs7Ozs7QUF3Q1YsR0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3ZCLGFBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBTSxFQUFFLElBQUksRUFDYixDQUFDLENBQUM7O0FBRUgsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDIiwiZmlsZSI6IlIuTG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuXG4gIGNsYXNzIExvY2sge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3F1ZXVlID0gW107XG4gICAgfVxuXG4gICAgYWNxdWlyZSgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmKCF0aGlzLl9hY3F1aXJlZCkge1xuICAgICAgICAgIHRoaXMuX2FjcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcXVldWUucHVzaChyZXNvbHZlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVsZWFzZSgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjcXVpcmVkLnNob3VsZC5iZS5vayk7XG4gICAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCByZXNvbHZlID0gdGhpcy5fcXVldWVbMF07XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBlcmZvcm0oZm4pIHtcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgIHlpZWxkIHRoaXMuYWNxdWlyZSgpO1xuICAgICAgICBsZXQgcmVzID0geWllbGQgZm4oKTtcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChMb2NrLnByb3RvdHlwZSwge1xuICAgIF9hY3F1aXJlZDogbnVsbCxcbiAgICBfcXVldWU6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBMb2NrO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==