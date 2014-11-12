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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUV0QixHQUFDLENBQUMsR0FBRyxDQUFDO1dBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtHQUFBLENBQUMsQ0FBQztBQUN2QyxRQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7TUFXZixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxDQUNFLEdBQUcsRUFBRTtBQUNmLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtPQUFBLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDdkI7O2dCQUxHLE1BQU07QUFPVixXQUFLOztlQUFBLFlBQUc7QUFDTixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQzs7Ozs7QUFDakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUFDLENBQUM7QUFDNUMsc0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOzt5QkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQzs7Ozs7O1dBQ2xELEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7OztXQWJHLE1BQU07Ozs7O0FBZ0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsc0JBQXNCO0FBQzdDLE9BQUcsRUFBRSxJQUFJO0FBQ1QsWUFBUSxFQUFFLElBQUksRUFDZixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayk7XHJcbiAgd2luZG93LlJlYWN0ID0gUmVhY3Q7XHJcblxyXG4gIC8qKlxyXG4gICogPHA+U2ltcGx5IHByb3ZpZGVzIGFuIHNwZWNpZmllZCBBcHAgZm9yIHRoZSBjbGllbnQ8L3A+XHJcbiAgKiA8cD5Qcm92aWRlcyBpbnN0YW5jZSBvZiBBcHAgPC9wPlxyXG4gICogPHVsPlxyXG4gICogPGxpPiBDbGllbnQubW91bnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnMgPC9saT5cclxuICAqIDwvdWw+XHJcbiAgKiBAY2xhc3MgUi5DbGllbnRcclxuICAqL1xyXG5cclxuICBjbGFzcyBDbGllbnQge1xyXG4gICAgY29uc3RydWN0b3IoQXBwKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5SZWFjdC5zaG91bGQuYmUub2spO1xyXG4gICAgICB0aGlzLmFwcCA9IG5ldyBBcHAoKTtcclxuICAgICAgdGhpcy5yZW5kZXJlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdW50KCkge1xyXG4gICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMucmVuZGVyZWQuc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgICAgeWllbGQgdGhpcy5hcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQod2luZG93KTtcclxuICAgICAgfSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChDbGllbnQucHJvdG90eXBlLCAvKiogQGxlbmRzIENsaWVudCAqL3tcclxuICAgIGFwcDogbnVsbCxcclxuICAgIHJlbmRlcmVkOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gQ2xpZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=