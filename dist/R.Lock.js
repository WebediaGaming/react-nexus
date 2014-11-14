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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5Mb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLElBQUk7UUFBSixJQUFJLEdBQ0csU0FEUCxJQUFJLEdBQ007QUFDWixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNsQjs7Z0JBSkcsSUFBSTtBQU1SLGFBQU87O2VBQUEsWUFBRzs7QUFDUixpQkFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsZ0JBQUcsQ0FBQyxNQUFLLFNBQVMsRUFBRTtBQUNsQixvQkFBSyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLHFCQUFPLEVBQUUsQ0FBQzthQUNYLE1BQ0k7QUFDSCxvQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzNCO1dBQ0YsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsYUFBTzs7ZUFBQSxZQUFHOztBQUNSLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sT0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO0FBQ3pDLGNBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLGdCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGdCQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3BCLG1CQUFPLEVBQUUsQ0FBQztXQUNYLE1BQ0k7QUFDSCxnQkFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7V0FDeEI7U0FDRjs7QUFFRCxhQUFPOztlQUFBLFVBQUMsRUFBRSxFQUFFO0FBQ1YsaUJBQU8sQ0FBQyxDQUFDLFNBQVMseUJBQUM7Z0JBRWIsR0FBRzs7Ozs7eUJBREQsSUFBSSxDQUFDLE9BQU8sRUFBRTs7O3lCQUNKLEVBQUUsRUFBRTs7QUFBaEIscUJBQUc7QUFDUCxzQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3NEQUNSLEdBQUc7Ozs7O1dBQ1gsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBckNHLElBQUk7OztBQXdDVixHQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkIsYUFBUyxFQUFFLElBQUk7QUFDZixVQUFNLEVBQUUsSUFBSSxFQUNiLENBQUMsQ0FBQzs7QUFFSCxTQUFPLElBQUksQ0FBQztDQUNiLENBQUMiLCJmaWxlIjoiUi5Mb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuICBjbGFzcyBMb2NrIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLl9hY3F1aXJlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFjcXVpcmUoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYoIXRoaXMuX2FjcXVpcmVkKSB7XHJcbiAgICAgICAgICB0aGlzLl9hY3F1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fcXVldWUucHVzaChyZXNvbHZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbGVhc2UoKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2FjcXVpcmVkLnNob3VsZC5iZS5vayk7XHJcbiAgICAgIGlmKHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgcmVzb2x2ZSA9IHRoaXMuX3F1ZXVlWzBdO1xyXG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2FjcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwZXJmb3JtKGZuKSB7XHJcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgeWllbGQgdGhpcy5hY3F1aXJlKCk7XHJcbiAgICAgICAgbGV0IHJlcyA9IHlpZWxkIGZuKCk7XHJcbiAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChMb2NrLnByb3RvdHlwZSwge1xyXG4gICAgX2FjcXVpcmVkOiBudWxsLFxyXG4gICAgX3F1ZXVlOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gTG9jaztcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9