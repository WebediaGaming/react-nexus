"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var co = require("co");
  var _ = require("lodash");
  var assert = require("assert");
  var url = require("url");

  /**
  * <p>Simply provides an specified App for the RenderServer</p>
  * <p>Provides instance of App </p>
  * <ul>
  * <li> RenderServer.middleware => compute all React Components with data and render the corresponding HTML for the requesting client </li>
  * </ul>
  * @class R.RenderServer
  */
  var RenderServer = function RenderServer(App) {
    R.Debug.dev(function () {
      assert(R.isServer(), "R.RenderServer(...): should only be called in the server.");
    });
    this._app = new App();
    this.middleware = R.scope(this.middleware, this);
  };

  _.extend(RenderServer.prototype, /** @lends R.RenderServer.Prototype */{
    _app: null,
    /**
    * <p> Call the renderToStringInServer from R.App function </p>
    * @method middleware
    */
    middleware: function middleware(req, res) {
      co(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              context$3$0.next = 2;
              return this._app.renderToStringInServer(req);

            case 2: return context$3$0.abrupt("return", context$3$0.sent);
            case 3:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      })).call(this, function (err, val) {
        if (err) {
          if (R.Debug.isDev()) {
            return res.status(500).json({ err: err.toString(), stack: err.stack });
          } else {
            return res.status(500).json({ err: err.toString() });
          }
        } else {
          res.status(200).send(val);
        }
      });
    } });

  return RenderServer;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlJlbmRlclNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixNQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFVekIsTUFBSSxZQUFZLEdBQUcsU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQzFDLEtBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVc7QUFDbkIsWUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSwyREFBMkQsQ0FBQyxDQUFDO0tBQ3JGLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUNwRCxDQUFDOztBQUVGLEdBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsd0NBQXlDO0FBQ3BFLFFBQUksRUFBRSxJQUFJOzs7OztBQUtWLGNBQVUsRUFBRSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLFFBQUUseUJBQUM7Ozs7cUJBQ2MsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUM7Ozs7Ozs7T0FDckQsRUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQzdCLFlBQUcsR0FBRyxFQUFFO0FBQ0osY0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFO0FBQ2hCLG1CQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7V0FDMUUsTUFDSTtBQUNELG1CQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDeEQ7U0FDSixNQUNJO0FBQ0QsYUFBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7T0FDSixDQUFDLENBQUM7S0FDTixFQUNKLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFlBQVksQ0FBQztDQUN2QixDQUFDIiwiZmlsZSI6IlIuUmVuZGVyU2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICAgIHZhciBjbyA9IHJlcXVpcmUoXCJjb1wiKTtcclxuICAgIHZhciBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcclxuICAgIHZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xyXG4gICAgdmFyIHVybCA9IHJlcXVpcmUoXCJ1cmxcIik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIDxwPlNpbXBseSBwcm92aWRlcyBhbiBzcGVjaWZpZWQgQXBwIGZvciB0aGUgUmVuZGVyU2VydmVyPC9wPlxyXG4gICAgKiA8cD5Qcm92aWRlcyBpbnN0YW5jZSBvZiBBcHAgPC9wPlxyXG4gICAgKiA8dWw+XHJcbiAgICAqIDxsaT4gUmVuZGVyU2VydmVyLm1pZGRsZXdhcmUgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQgPC9saT5cclxuICAgICogPC91bD5cclxuICAgICogQGNsYXNzIFIuUmVuZGVyU2VydmVyXHJcbiAgICAqL1xyXG4gICAgdmFyIFJlbmRlclNlcnZlciA9IGZ1bmN0aW9uIFJlbmRlclNlcnZlcihBcHApIHtcclxuICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYXNzZXJ0KFIuaXNTZXJ2ZXIoKSwgXCJSLlJlbmRlclNlcnZlciguLi4pOiBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gdGhlIHNlcnZlci5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fYXBwID0gbmV3IEFwcCgpO1xyXG4gICAgICAgIHRoaXMubWlkZGxld2FyZSA9IFIuc2NvcGUodGhpcy5taWRkbGV3YXJlLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgXy5leHRlbmQoUmVuZGVyU2VydmVyLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBSLlJlbmRlclNlcnZlci5Qcm90b3R5cGUgKi8ge1xyXG4gICAgICAgIF9hcHA6IG51bGwsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD4gQ2FsbCB0aGUgcmVuZGVyVG9TdHJpbmdJblNlcnZlciBmcm9tIFIuQXBwIGZ1bmN0aW9uIDwvcD5cclxuICAgICAgICAqIEBtZXRob2QgbWlkZGxld2FyZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgbWlkZGxld2FyZTogZnVuY3Rpb24gbWlkZGxld2FyZShyZXEsIHJlcykge1xyXG4gICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fYXBwLnJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIocmVxKTtcclxuICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBmdW5jdGlvbihlcnIsIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoUi5EZWJ1Zy5pc0RldigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycjogZXJyLnRvU3RyaW5nKCksIHN0YWNrOiBlcnIuc3RhY2sgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnI6IGVyci50b1N0cmluZygpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHZhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gUmVuZGVyU2VydmVyO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=