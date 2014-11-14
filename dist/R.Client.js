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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5DbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVoQixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNXO1VBQVAsR0FBRyxRQUFILEdBQUc7QUFDZixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUNuQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN2Qjs7Z0JBUkcsTUFBTTtBQVVWLFdBQUs7O2VBQUEsaUJBQWE7Y0FBVixNQUFNLFNBQU4sTUFBTTtBQUNaLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDcEMsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUMvQixDQUFDO0FBQ0Ysd0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLHNCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7eUJBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7Ozs7O1dBQ2xDLEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7OztXQW5CRyxNQUFNOzs7QUFzQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxzQkFBc0I7QUFDN0MsT0FBRyxFQUFFLElBQUk7QUFDVCxZQUFRLEVBQUUsSUFBSSxFQUNmLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG5cclxuICBjbGFzcyBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IoeyBhcHAgfSkge1xyXG4gICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgd2luZG93LlJlYWN0LnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgIGFwcC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkFwcClcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VudCh7IHdpbmRvdyB9KSB7XHJcbiAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgIHRoaXMucmVuZGVyZWQuc2hvdWxkLm5vdC5iZS5va1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgICAgeWllbGQgdGhpcy5hcHAucmVuZGVyKHsgd2luZG93IH0pO1xyXG4gICAgICB9LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQ2xpZW50ICove1xyXG4gICAgYXBwOiBudWxsLFxyXG4gICAgcmVuZGVyZWQ6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBDbGllbnQ7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==