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
                case 0:
                  _this = this;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVoQixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNXO1VBQVAsR0FBRyxRQUFILEdBQUc7O0FBQ2YsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FDbkMsQ0FBQztBQUNGLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDdkI7O2dCQVJHLE1BQU07QUFVVixXQUFLOztlQUFBLGlCQUFhO2NBQVYsTUFBTSxTQUFOLE1BQU07O0FBQ1osaUJBQU8sQ0FBQyxDQUFDLFNBQVMseUJBQUM7Ozs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDcEMsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUMvQixDQUFDO0FBQ0Ysd0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLHNCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7eUJBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7OztXQUNsQyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FuQkcsTUFBTTs7Ozs7QUFzQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuXG4gIGNsYXNzIENsaWVudCB7XG4gICAgY29uc3RydWN0b3IoeyBhcHAgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB3aW5kb3cuUmVhY3Quc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIGFwcC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkFwcClcbiAgICAgICk7XG4gICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBtb3VudCh7IHdpbmRvdyB9KSB7XG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHRoaXMucmVuZGVyZWQuc2hvdWxkLm5vdC5iZS5va1xuICAgICAgICApO1xuICAgICAgICB3aW5kb3cuUmVhY3QgPSBSZWFjdDtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XG4gICAgICAgIHlpZWxkIHRoaXMuYXBwLnJlbmRlcih7IHdpbmRvdyB9KTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQ2xpZW50ICove1xuICAgIGFwcDogbnVsbCxcbiAgICByZW5kZXJlZDogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIENsaWVudDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=