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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5QbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7TUFFbEIsTUFBTTtRQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sT0FDa0M7VUFBOUIsSUFBSSxRQUFKLElBQUk7VUFBRSxHQUFHLFFBQUgsR0FBRztVQUFFLE1BQU0sUUFBTixNQUFNO1VBQUUsT0FBTyxRQUFQLE9BQU87QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM5QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQzVCLENBQUM7QUFDRixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDekMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7Z0JBWEcsTUFBTTtBQWFWLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FmdkIsTUFBTTs7O0FBa0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsZ0NBQWlDO0FBQ3hELFFBQUksRUFBRSxJQUFJO0FBQ1YsVUFBTSxFQUFFLElBQUk7QUFDWixPQUFHLEVBQUUsSUFBSTtBQUNULFdBQU8sRUFBRSxJQUFJO0FBQ2IsZUFBVyxFQUFFLElBQUksRUFDbEIsQ0FBQyxDQUFDOztBQUVILFNBQU8sTUFBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkFwcC5QbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcblxyXG4gIGNsYXNzIFBsdWdpbiB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHJlcSwgd2luZG93LCBoZWFkZXJzIH0pIHtcclxuICAgICAgXy5kZXYoKCkgPT4gZmx1eC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXHJcbiAgICAgICAgaGVhZGVycy5zaG91bGQuYmUuYW4uT2JqZWN0XHJcbiAgICAgICk7XHJcbiAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xyXG4gICAgICB0aGlzLmZsdXggPSBmbHV4O1xyXG4gICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcclxuICAgICAgdGhpcy5yZXEgPSByZXE7XHJcbiAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG4gIH1cclxuXHJcbiAgXy5leHRlbmQoUGx1Z2luLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBQbHVnaW4uUHJvdG90eXBlICovIHtcclxuICAgIGZsdXg6IG51bGwsXHJcbiAgICB3aW5kb3c6IG51bGwsXHJcbiAgICByZXE6IG51bGwsXHJcbiAgICBoZWFkZXJzOiBudWxsLFxyXG4gICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBQbHVnaW47XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==