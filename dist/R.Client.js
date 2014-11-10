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
  window.React = React;

  var Client = (function () {
    var Client = function Client(App) {
      _.dev(function () {
        return window.React.should.be.ok;
      });
      this.app = new App();
      this.rendered = false;
    };

    _classProps(Client, null, {
      mount: {
        writable: true,
        value: function () {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _this.rendered.should.not.be.ok;
                  });
                  this.rendered = true;
                  context$4$0.next = 4;
                  return this.app.renderIntoDocumentInClient(window);

                case 4:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUV0QixHQUFDLENBQUMsR0FBRyxDQUFDO1dBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtHQUFBLENBQUMsQ0FBQztBQUN2QyxRQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7TUFXZixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxDQUNFLEdBQUcsRUFBRTtBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDdkI7O2dCQUxHLE1BQU07QUFPVixXQUFLOztlQUFBLFlBQUc7QUFDTixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUFDLENBQUM7QUFDNUMsc0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOzt5QkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQzs7Ozs7O1dBQ2xELEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7OztXQWJHLE1BQU07Ozs7O0FBZ0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsc0JBQXNCO0FBQzdDLE9BQUcsRUFBRSxJQUFJO0FBQ1QsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcblxuICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rKTtcbiAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XG5cbiAgLyoqXG4gICogPHA+U2ltcGx5IHByb3ZpZGVzIGFuIHNwZWNpZmllZCBBcHAgZm9yIHRoZSBjbGllbnQ8L3A+XG4gICogPHA+UHJvdmlkZXMgaW5zdGFuY2Ugb2YgQXBwIDwvcD5cbiAgKiA8dWw+XG4gICogPGxpPiBDbGllbnQubW91bnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnMgPC9saT5cbiAgKiA8L3VsPlxuICAqIEBjbGFzcyBSLkNsaWVudFxuICAqL1xuXG4gIGNsYXNzIENsaWVudCB7XG4gICAgY29uc3RydWN0b3IoQXBwKSB7XG4gICAgICBfLmRldigoKSA9PiB3aW5kb3cuUmVhY3Quc2hvdWxkLmJlLm9rKTtcbiAgICAgIHRoaXMuYXBwID0gbmV3IEFwcCgpO1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIG1vdW50KCkge1xuICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5yZW5kZXJlZC5zaG91bGQubm90LmJlLm9rKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XG4gICAgICAgIHlpZWxkIHRoaXMuYXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50KHdpbmRvdyk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcbiAgICBhcHA6IG51bGwsXG4gICAgcmVuZGVyZWQ6IG51bGwsXG4gIH0pO1xuXG4gIHJldHVybiBDbGllbnQ7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9