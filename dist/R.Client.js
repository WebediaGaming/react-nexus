"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = require("lodash");
  var assert = require("assert");
  var React = R.React;

  assert(R.isClient(), "R.Client: should only be loaded in the client.");
  window.React = React;
  /**
  * <p>Simply provides an specified App for the client</p>
  * <p>Provides instance of App </p>
  * <ul>
  * <li> Client.mount => compute all React Components client-side and establishes a connection via socket in order to make data subscriptions </li>
  * </ul>
  * @class R.Client
  */
  var Client = function Client(App) {
    R.Debug.dev(function () {
      if (!window.React) {
        console.warn("Warning: React is not attached to window.");
      }
    });
    window.React = React;
    R.Debug.dev(R.scope(function () {
      if (!window.__ReactOnRails) {
        window.__ReactOnRails = {};
      }
      if (!window.__ReactOnRails.apps) {
        window.__ReactOnRails.apps = [];
      }
      window.__ReactOnRails.apps.push(this);
    }, this));
    this._app = new App();
  };

  _.extend(Client.prototype, /** @lends R.Client.prototype */{
    _app: null,
    _rendered: false,
    /**
    * <p> Call the renderIntoDocumentInClient from R.App function </p>
    * @method mount
    */
    mount: regeneratorRuntime.mark(function mount() {
      return regeneratorRuntime.wrap(function mount$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {case 0:

            assert(!this._rendered, "R.Client.render(...): should only call mount() once.");
            context$2$0.next = 3;
            return this._app.renderIntoDocumentInClient(window);

          case 3:
          case "end": return context$2$0.stop();
        }
      }, mount, this);
    }) });

  return Client;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7O0FBRXBCLFFBQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztBQUN2RSxRQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7Ozs7Ozs7O0FBU3JCLE1BQUksTUFBTSxHQUFHLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRTtBQUM5QixLQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ25CLFVBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2QsZUFBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO09BQzdEO0tBQ0osQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDckIsS0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFXO0FBQzNCLFVBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLGNBQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO09BQzlCO0FBQ0QsVUFBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzVCLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztPQUNuQztBQUNELFlBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDVixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7R0FDekIsQ0FBQzs7QUFFRixHQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGtDQUFtQztBQUN4RCxRQUFJLEVBQUUsSUFBSTtBQUNWLGFBQVMsRUFBRSxLQUFLOzs7OztBQUtoQixTQUFLLDBCQUFFLFNBQVUsS0FBSzs7OztBQUNsQixrQkFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzREFBc0QsQ0FBQyxDQUFDOzttQkFDMUUsSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUM7Ozs7O1NBRnJDLEtBQUs7S0FHckIsQ0FBQSxFQUNKLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNqQixDQUFDIiwiZmlsZSI6IlIuQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICAgIHZhciBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcclxuICAgIHZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xyXG4gICAgdmFyIFJlYWN0ID0gUi5SZWFjdDtcclxuXHJcbiAgICBhc3NlcnQoUi5pc0NsaWVudCgpLCBcIlIuQ2xpZW50OiBzaG91bGQgb25seSBiZSBsb2FkZWQgaW4gdGhlIGNsaWVudC5cIik7XHJcbiAgICB3aW5kb3cuUmVhY3QgPSBSZWFjdDtcclxuICAgIC8qKlxyXG4gICAgKiA8cD5TaW1wbHkgcHJvdmlkZXMgYW4gc3BlY2lmaWVkIEFwcCBmb3IgdGhlIGNsaWVudDwvcD5cclxuICAgICogPHA+UHJvdmlkZXMgaW5zdGFuY2Ugb2YgQXBwIDwvcD5cclxuICAgICogPHVsPlxyXG4gICAgKiA8bGk+IENsaWVudC5tb3VudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9ucyA8L2xpPlxyXG4gICAgKiA8L3VsPlxyXG4gICAgKiBAY2xhc3MgUi5DbGllbnRcclxuICAgICovXHJcbiAgICB2YXIgQ2xpZW50ID0gZnVuY3Rpb24gQ2xpZW50KEFwcCkge1xyXG4gICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZighd2luZG93LlJlYWN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBSZWFjdCBpcyBub3QgYXR0YWNoZWQgdG8gd2luZG93LlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdpbmRvdy5SZWFjdCA9IFJlYWN0O1xyXG4gICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKCF3aW5kb3cuX19SZWFjdE9uUmFpbHMpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0T25SYWlscyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCF3aW5kb3cuX19SZWFjdE9uUmFpbHMuYXBwcykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Ll9fUmVhY3RPblJhaWxzLmFwcHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE9uUmFpbHMuYXBwcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgIH0sIHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9hcHAgPSBuZXcgQXBwKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIF8uZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUi5DbGllbnQucHJvdG90eXBlICovIHtcclxuICAgICAgICBfYXBwOiBudWxsLFxyXG4gICAgICAgIF9yZW5kZXJlZDogZmFsc2UsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD4gQ2FsbCB0aGUgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgZnJvbSBSLkFwcCBmdW5jdGlvbiA8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIG1vdW50XHJcbiAgICAgICAgKi9cclxuICAgICAgICBtb3VudDogZnVuY3Rpb24qIG1vdW50KCkge1xyXG4gICAgICAgICAgICBhc3NlcnQoIXRoaXMuX3JlbmRlcmVkLCBcIlIuQ2xpZW50LnJlbmRlciguLi4pOiBzaG91bGQgb25seSBjYWxsIG1vdW50KCkgb25jZS5cIik7XHJcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuX2FwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCh3aW5kb3cpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gQ2xpZW50O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=