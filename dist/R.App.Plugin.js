"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

  var _Plugin = (function () {
    var _Plugin = function _Plugin(_ref) {
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

    _classProps(_Plugin, null, {
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

    return _Plugin;
  })();

  _.extend(_Plugin.prototype, /** @lends Plugin.Prototype */{
    flux: null,
    window: null,
    req: null,
    headers: null,
    displayName: null });

  return _Plugin;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlIuQXBwLlBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRVIsT0FBTTtRQUFOLE9BQU0sR0FDQyxTQURQLE9BQU0sT0FDa0M7VUFBOUIsSUFBSSxRQUFKLElBQUk7VUFBRSxHQUFHLFFBQUgsR0FBRztVQUFFLE1BQU0sUUFBTixNQUFNO1VBQUUsT0FBTyxRQUFQLE9BQU87QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM5QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQzVCLENBQUM7QUFDRixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDekMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7Z0JBWEcsT0FBTTtBQWFWLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FmdkIsT0FBTTs7O0FBa0JaLEdBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTSxDQUFDLFNBQVMsZ0NBQWlDO0FBQ3hELFFBQUksRUFBRSxJQUFJO0FBQ1YsVUFBTSxFQUFFLElBQUk7QUFDWixPQUFHLEVBQUUsSUFBSTtBQUNULFdBQU8sRUFBRSxJQUFJO0FBQ2IsZUFBVyxFQUFFLElBQUksRUFDbEIsQ0FBQyxDQUFDOztBQUVILFNBQU8sT0FBTSxDQUFDO0NBQ2YsQ0FBQyIsImZpbGUiOiJSLkFwcC5QbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG5cclxuICBjbGFzcyBQbHVnaW4ge1xyXG4gICAgY29uc3RydWN0b3IoeyBmbHV4LCByZXEsIHdpbmRvdywgaGVhZGVycyB9KSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IGZsdXguc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoUi5GbHV4KSAmJlxyXG4gICAgICAgIGhlYWRlcnMuc2hvdWxkLmJlLmFuLk9iamVjdFxyXG4gICAgICApO1xyXG4gICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcclxuICAgICAgdGhpcy5mbHV4ID0gZmx1eDtcclxuICAgICAgdGhpcy53aW5kb3cgPSB3aW5kb3c7XHJcbiAgICAgIHRoaXMucmVxID0gcmVxO1xyXG4gICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICBkZXN0cm95KCkgeyBfLmFic3RyYWN0KCk7IH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKFBsdWdpbi5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGx1Z2luLlByb3RvdHlwZSAqLyB7XHJcbiAgICBmbHV4OiBudWxsLFxyXG4gICAgd2luZG93OiBudWxsLFxyXG4gICAgcmVxOiBudWxsLFxyXG4gICAgaGVhZGVyczogbnVsbCxcclxuICAgIGRpc3BsYXlOYW1lOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gUGx1Z2luO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=