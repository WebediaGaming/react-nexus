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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUV0QixHQUFDLENBQUMsR0FBRyxDQUFDO1dBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtHQUFBLENBQUMsQ0FBQzs7TUFFakMsTUFBTTtRQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sT0FDVztVQUFQLEdBQUcsUUFBSCxHQUFHOztBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUNuQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN2Qjs7Z0JBUEcsTUFBTTtBQVNWLFdBQUs7O2VBQUEsaUJBQWE7Y0FBVixNQUFNLFNBQU4sTUFBTTs7QUFDWixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDcEMsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUMvQixDQUFDO0FBQ0Ysd0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLHNCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7eUJBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7OztXQUNsQyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FsQkcsTUFBTTs7Ozs7QUFxQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG5cclxuICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rKTtcclxuXHJcbiAgY2xhc3MgQ2xpZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gd2luZG93LlJlYWN0LnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIGFwcC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkFwcClcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VudCh7IHdpbmRvdyB9KSB7XHJcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgIHRoaXMucmVuZGVyZWQuc2hvdWxkLm5vdC5iZS5va1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgICAgeWllbGQgdGhpcy5hcHAucmVuZGVyKHsgd2luZG93IH0pO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQ2xpZW50ICove1xyXG4gICAgYXBwOiBudWxsLFxyXG4gICAgcmVuZGVyZWQ6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBDbGllbnQ7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==