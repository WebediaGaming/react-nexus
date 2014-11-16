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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVoQixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNXO1VBQVAsR0FBRyxRQUFILEdBQUc7QUFDZixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUNuQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUN2Qjs7Z0JBUkcsTUFBTTtBQVVWLFdBQUs7O2VBQUEsaUJBQWE7Y0FBVixNQUFNLFNBQU4sTUFBTTtBQUNaLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDOzs7OztBQUNqQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNwQyxNQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO21CQUFBLENBQy9CLENBQUM7QUFDRix3QkFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDckIsc0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOzt5QkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQzs7Ozs7V0FDbEMsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBbkJHLE1BQU07OztBQXNCWixHQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLHNCQUFzQjtBQUM3QyxPQUFHLEVBQUUsSUFBSTtBQUNULFlBQVEsRUFBRSxJQUFJLEVBQ2YsQ0FBQyxDQUFDOztBQUVILFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcblxuICBjbGFzcyBDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKHsgYXBwIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgd2luZG93LlJlYWN0LnNob3VsZC5iZS5vayAmJlxuICAgICAgICBhcHAuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5BcHApXG4gICAgICApO1xuICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgbW91bnQoeyB3aW5kb3cgfSkge1xuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnJlbmRlcmVkLnNob3VsZC5ub3QuYmUub2tcbiAgICAgICAgKTtcbiAgICAgICAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XG4gICAgICAgIHRoaXMucmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICB5aWVsZCB0aGlzLmFwcC5yZW5kZXIoeyB3aW5kb3cgfSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcbiAgICBhcHA6IG51bGwsXG4gICAgcmVuZGVyZWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBDbGllbnQ7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9