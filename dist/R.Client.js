"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
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
        value: regeneratorRuntime.mark(function callee$2$0(_ref2) {
          var window;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            var _this = this;
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
                window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return window.should.be.an.Object && _this.rendered.should.not.be.ok;
                });
                window.React = React;
                this.rendered = true;
                context$3$0.next = 6;
                return this.app.render({ window: window });

              case 6: return context$3$0.abrupt("return", context$3$0.sent);
              case 7:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })
      }
    });

    return Client;
  })();

  _.extend(Client.prototype, /** @lends Client */{
    app: null,
    rendered: null });

  return Client;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LW5leHVzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFaEIsTUFBTTtRQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sT0FDVztVQUFQLEdBQUcsUUFBSCxHQUFHOztBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQ25DLENBQUM7QUFDRixVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOztnQkFSRyxNQUFNO0FBVVQsV0FBSzs7dUNBQUE7Y0FBRyxNQUFNOzs7O0FBQU4sc0JBQU0sU0FBTixNQUFNOztBQUNiLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BDLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQUEsQ0FDL0IsQ0FBQztBQUNGLHNCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixvQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O3VCQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDOzs7Ozs7O1NBQ3pDOzs7O1dBakJHLE1BQU07Ozs7O0FBb0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsc0JBQXNCO0FBQzdDLE9BQUcsRUFBRSxJQUFJO0FBQ1QsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgY2xhc3MgQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIHdpbmRvdy5SZWFjdC5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgKm1vdW50KHsgd2luZG93IH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlZC5zaG91bGQubm90LmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHdpbmRvdy5SZWFjdCA9IFJlYWN0O1xyXG4gICAgICB0aGlzLnJlbmRlcmVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIHlpZWxkIHRoaXMuYXBwLnJlbmRlcih7IHdpbmRvdyB9KTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcclxuICAgIGFwcDogbnVsbCxcclxuICAgIHJlbmRlcmVkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gQ2xpZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=