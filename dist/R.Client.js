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

  _.dev(function () {
    return _.isClient().should.be.ok;
  });

  var Client = (function () {
    var Client = function Client(_ref) {
      var app = _ref.app;

      _.dev(function () {
        return window.React.should.be.ok && app.should.be.an.instanceOf(R.App);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUV0QixHQUFDLENBQUMsR0FBRyxDQUFDO1dBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtHQUFBLENBQUMsQ0FBQzs7TUFFakMsTUFBTTtRQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sT0FDVztVQUFQLEdBQUcsUUFBSCxHQUFHOztBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUNuQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN2Qjs7Z0JBUEcsTUFBTTtBQVNWLFdBQUs7O2VBQUEsaUJBQWE7Y0FBVixNQUFNLFNBQU4sTUFBTTs7QUFDWixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDcEMsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUMvQixDQUFDO0FBQ0Ysd0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLHNCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7eUJBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7OztXQUNsQyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FsQkcsTUFBTTs7Ozs7QUFxQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2spO1xuXG4gIGNsYXNzIENsaWVudCB7XG4gICAgY29uc3RydWN0b3IoeyBhcHAgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gd2luZG93LlJlYWN0LnNob3VsZC5iZS5vayAmJlxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXG4gICAgICApO1xuICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbW91bnQoeyB3aW5kb3cgfSkge1xuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICB5aWVsZCB0aGlzLmFwcC5yZW5kZXIoeyB3aW5kb3cgfSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcbiAgICBhcHA6IG51bGwsXG4gICAgcmVuZGVyZWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBDbGllbnQ7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9