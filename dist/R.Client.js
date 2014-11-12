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
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return window.should.be.an.Object && _this.rendered.should.not.be.ok;
                  });
                  window.React = React;
                  this.rendered = true;
                  context$4$0.next = 5;
                  return this.app.render({ window: window });

                case 5:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVoQixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNXO1VBQVAsR0FBRyxRQUFILEdBQUc7O0FBQ2YsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FDbkMsQ0FBQztBQUNGLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDdkI7O2dCQVJHLE1BQU07QUFVVixXQUFLOztlQUFBLGlCQUFhO2NBQVYsTUFBTSxTQUFOLE1BQU07O0FBQ1osaUJBQU8sQ0FBQyxDQUFDLFNBQVMseUJBQUM7Ozs7O0FBQ2pCLG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3BDLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7bUJBQUEsQ0FDL0IsQ0FBQztBQUNGLHdCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixzQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O3lCQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDOzs7Ozs7V0FDbEMsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBbkJHLE1BQU07Ozs7O0FBc0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsc0JBQXNCO0FBQzdDLE9BQUcsRUFBRSxJQUFJO0FBQ1QsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcblxuICBjbGFzcyBDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgd2luZG93LlJlYWN0LnNob3VsZC5iZS5vayAmJlxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXG4gICAgICApO1xuICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbW91bnQoeyB3aW5kb3cgfSkge1xuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICB5aWVsZCB0aGlzLmFwcC5yZW5kZXIoeyB3aW5kb3cgfSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcbiAgICBhcHA6IG51bGwsXG4gICAgcmVuZGVyZWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBDbGllbnQ7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9