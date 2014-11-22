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

  var _Client = (function () {
    var _Client = function _Client(_ref) {
      var app = _ref.app;
      _.dev(function () {
        return _.isClient().should.be.ok && window.React.should.be.ok && app.should.be.an.instanceOf(R.App);
      });
      this.app = app;
      this.rendered = false;
    };

    _classProps(_Client, null, {
      mount: {
        writable: true,
        value: regeneratorRuntime.mark(function _callee(_ref2) {
          var _this = this;
          var window;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0: window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return window.should.be.an.Object && _this.rendered.should.not.be.ok;
                });
                window.React = React;
                _this.rendered = true;
                _context.next = 6;
                return _this.app.render({ window: window });
              case 6: return _context.abrupt("return", _context.sent);
              case 7:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      }
    });

    return _Client;
  })();

  _.extend(_Client.prototype, /** @lends Client */{
    app: null,
    rendered: null });

  return _Client;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O01BRWhCLE9BQU07UUFBTixPQUFNLEdBQ0MsU0FEUCxPQUFNLE9BQ1c7VUFBUCxHQUFHLFFBQUgsR0FBRztBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQ25DLENBQUM7QUFDRixVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCOztnQkFSRyxPQUFNO0FBVVQsV0FBSzs7dUNBQUE7O2NBQUcsTUFBTTs7O3NCQUFOLE1BQU0sU0FBTixNQUFNOztBQUNiLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BDLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQUEsQ0FDL0IsQ0FBQztBQUNGLHNCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixzQkFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDOzt1QkFDUixNQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7OztTQUN6Qzs7OztXQWpCRyxPQUFNOzs7QUFvQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE9BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgY2xhc3MgQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIHdpbmRvdy5SZWFjdC5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgKm1vdW50KHsgd2luZG93IH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlZC5zaG91bGQubm90LmJlLm9rXHJcbiAgICAgICk7XHJcbiAgICAgIHdpbmRvdy5SZWFjdCA9IFJlYWN0O1xyXG4gICAgICB0aGlzLnJlbmRlcmVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIHlpZWxkIHRoaXMuYXBwLnJlbmRlcih7IHdpbmRvdyB9KTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcclxuICAgIGFwcDogbnVsbCxcclxuICAgIHJlbmRlcmVkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gQ2xpZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=