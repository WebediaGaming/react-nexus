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
  var React = R.React;

  var Client = (function () {
    var Client = function Client(_ref) {
      var app = _ref.app;
      _.dev(function () {
        return _.isClient().should.be.ok && window.React.should.be.ok && app.should.be.an.instanceOf(R.App);
      });
      this.app = app;
      this.rendered = false;
    };

    _classProps(Client, null, {
      mount: {
        writable: true,
        value: function (_ref2) {
          var window = _ref2.window;
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var _this;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0: _this = this;
                  _.dev(function () {
                    return window.should.be.an.Object && _this.rendered.should.not.be.ok;
                  });
                  window.React = React;
                  this.rendered = true;
                  context$4$0.next = 6;
                  return this.app.render({ window: window });
                case 6:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      }
    });

    return Client;
  })();

  _.extend(Client.prototype, /** @lends Client */{
    app: null,
    rendered: null });

  return Client;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O01BRWhCLE1BQU07UUFBTixNQUFNLEdBQ0MsU0FEUCxNQUFNLE9BQ1c7VUFBUCxHQUFHLFFBQUgsR0FBRztBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQ25DLENBQUM7QUFDRixVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOztnQkFSRyxNQUFNO0FBVVYsV0FBSzs7ZUFBQSxpQkFBYTtjQUFWLE1BQU0sU0FBTixNQUFNO0FBQ1osaUJBQU8sQ0FBQyxDQUFDLFNBQVMseUJBQUM7Ozs7O0FBQ2pCLG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BDLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7bUJBQUEsQ0FDL0IsQ0FBQztBQUNGLHdCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixzQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O3lCQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDOzs7OztXQUNsQyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FuQkcsTUFBTTs7O0FBc0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsc0JBQXNCO0FBQzdDLE9BQUcsRUFBRSxJQUFJO0FBQ1QsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgY2xhc3MgQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIHdpbmRvdy5SZWFjdC5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbW91bnQoeyB3aW5kb3cgfSkge1xyXG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkLnNob3VsZC5ub3QuYmUub2tcclxuICAgICAgICApO1xyXG4gICAgICAgIHdpbmRvdy5SZWFjdCA9IFJlYWN0O1xyXG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xyXG4gICAgICAgIHlpZWxkIHRoaXMuYXBwLnJlbmRlcih7IHdpbmRvdyB9KTtcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcclxuICAgIGFwcDogbnVsbCxcclxuICAgIHJlbmRlcmVkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gQ2xpZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=