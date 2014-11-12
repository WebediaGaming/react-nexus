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

  var Plugin = (function () {
    var Plugin = function Plugin(_ref) {
      var flux = _ref.flux;
      var req = _ref.req;
      var window = _ref.window;
      var headers = _ref.headers;

      _.dev(function () {
        return flux.should.be.an.instanceOf(R.Flux) && headers.should.be.an.Object;
      });
      _.dev(function () {
        return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.displayName = this.getDisplayName();
      this.flux = flux;
      this.window = window;
      this.req = req;
      this.headers = headers;
    };

    _classProps(Plugin, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      destroy: {
        writable: true,
        value: function () {
          _.abstract();
        }
      }
    });

    return Plugin;
  })();

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */{
    flux: null,
    window: null,
    req: null,
    headers: null,
    displayName: null });

  return Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5QbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLE1BQU07UUFBTixNQUFNLEdBQ0MsU0FEUCxNQUFNLE9BQ2tDO1VBQTlCLElBQUksUUFBSixJQUFJO1VBQUUsR0FBRyxRQUFILEdBQUc7VUFBRSxNQUFNLFFBQU4sTUFBTTtVQUFFLE9BQU8sUUFBUCxPQUFPOztBQUN0QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQzlDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNO09BQUEsQ0FDNUIsQ0FBQztBQUNGLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQUMsQ0FBQztBQUNqRixVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN6QyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQ3hCOztnQkFYRyxNQUFNO0FBYVYsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxhQUFPOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7OztXQWZ2QixNQUFNOzs7OztBQWtCWixHQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGdDQUFpQztBQUN4RCxRQUFJLEVBQUUsSUFBSTtBQUNWLFVBQU0sRUFBRSxJQUFJO0FBQ1osT0FBRyxFQUFFLElBQUk7QUFDVCxXQUFPLEVBQUUsSUFBSTtBQUNiLGVBQVcsRUFBRSxJQUFJLEVBQ2xCLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNmLENBQUMiLCJmaWxlIjoiUi5BcHAuUGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgUGx1Z2luIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHJlcSwgd2luZG93LCBoZWFkZXJzIH0pIHtcbiAgICAgIF8uZGV2KCgpID0+IGZsdXguc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5GbHV4KSAmJlxuICAgICAgICBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICAgICk7XG4gICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIHRoaXMuZGlzcGxheU5hbWUgPSB0aGlzLmdldERpc3BsYXlOYW1lKCk7XG4gICAgICB0aGlzLmZsdXggPSBmbHV4O1xuICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XG4gICAgICB0aGlzLnJlcSA9IHJlcTtcbiAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgZGVzdHJveSgpIHsgXy5hYnN0cmFjdCgpOyB9XG4gIH1cblxuICBfLmV4dGVuZChQbHVnaW4ucHJvdG90eXBlLCAvKiogQGxlbmRzIFBsdWdpbi5Qcm90b3R5cGUgKi8ge1xuICAgIGZsdXg6IG51bGwsXG4gICAgd2luZG93OiBudWxsLFxuICAgIHJlcTogbnVsbCxcbiAgICBoZWFkZXJzOiBudWxsLFxuICAgIGRpc3BsYXlOYW1lOiBudWxsLFxuICB9KTtcblxuICByZXR1cm4gUGx1Z2luO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==