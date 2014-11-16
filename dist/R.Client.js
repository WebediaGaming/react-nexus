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
          var _this, window;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: _this = this;
                window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return window.should.be.an.Object && _this.rendered.should.not.be.ok;
                });
                window.React = React;
                this.rendered = true;
                context$3$0.next = 7;
                return this.app.render({ window: window });
              case 7: return context$3$0.abrupt("return", context$3$0.sent);
              case 8:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVoQixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNXO1VBQVAsR0FBRyxRQUFILEdBQUc7QUFDZixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUNuQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN2Qjs7Z0JBUkcsTUFBTTtBQVVULFdBQUs7O3VDQUFBO3FCQUFHLE1BQU07Ozs7QUFBTixzQkFBTSxTQUFOLE1BQU07O0FBQ2IsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDcEMsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFBQSxDQUMvQixDQUFDO0FBQ0Ysc0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLG9CQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7dUJBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7OztTQUN6Qzs7OztXQWpCRyxNQUFNOzs7QUFvQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG5cbiAgY2xhc3MgQ2xpZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih7IGFwcCB9KSB7XG4gICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHdpbmRvdy5SZWFjdC5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgYXBwLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuQXBwKVxuICAgICAgKTtcbiAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgICptb3VudCh7IHdpbmRvdyB9KSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgdGhpcy5yZW5kZXJlZC5zaG91bGQubm90LmJlLm9rXG4gICAgICApO1xuICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB5aWVsZCB0aGlzLmFwcC5yZW5kZXIoeyB3aW5kb3cgfSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQ2xpZW50ICove1xuICAgIGFwcDogbnVsbCxcbiAgICByZW5kZXJlZDogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIENsaWVudDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=