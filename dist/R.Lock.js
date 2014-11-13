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
                case 0:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007QUFDWixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNsQjs7Z0JBSkcsSUFBSTtBQU1SLGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsaUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGdCQUFHLENBQUMsTUFBSyxTQUFTLEVBQUU7QUFDbEIsb0JBQUssU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixxQkFBTyxFQUFFLENBQUM7YUFDWCxNQUNJO0FBQ0gsb0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQjtXQUNGLENBQUMsQ0FBQztTQUNKOztBQUVELGFBQU87O2VBQUEsWUFBRzs7O0FBQ1IsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7QUFDekMsY0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEIsbUJBQU8sRUFBRSxDQUFDO1dBQ1gsTUFDSTtBQUNILGdCQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztXQUN4QjtTQUNGOztBQUVELGFBQU87O2VBQUEsVUFBQyxFQUFFLEVBQUU7QUFDVixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFFYixHQUFHOzs7Ozt5QkFERCxJQUFJLENBQUMsT0FBTyxFQUFFOzs7O3lCQUNKLEVBQUUsRUFBRTs7O0FBQWhCLHFCQUFHOztBQUNQLHNCQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7c0RBQ1IsR0FBRzs7Ozs7O1dBQ1gsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBckNHLElBQUk7Ozs7O0FBd0NWLEdBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QixhQUFTLEVBQUUsSUFBSTtBQUNmLFVBQU0sRUFBRSxJQUFJLEVBQ2IsQ0FBQyxDQUFDOztBQUVILFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQyIsImZpbGUiOiJSLkxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcblxuICBjbGFzcyBMb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIH1cblxuICAgIGFjcXVpcmUoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZighdGhpcy5fYWNxdWlyZWQpIHtcbiAgICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IHRydWU7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3F1ZXVlLnB1c2gocmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbGVhc2UoKSB7XG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9hY3F1aXJlZC5zaG91bGQuYmUub2spO1xuICAgICAgaWYodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgcmVzb2x2ZSA9IHRoaXMuX3F1ZXVlWzBdO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fYWNxdWlyZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwZXJmb3JtKGZuKSB7XG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICB5aWVsZCB0aGlzLmFjcXVpcmUoKTtcbiAgICAgICAgbGV0IHJlcyA9IHlpZWxkIGZuKCk7XG4gICAgICAgIHRoaXMucmVsZWFzZSgpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoTG9jay5wcm90b3R5cGUsIHtcbiAgICBfYWNxdWlyZWQ6IG51bGwsXG4gICAgX3F1ZXVlOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gTG9jaztcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=