"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5QbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFUixNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxPQUNrQztVQUE5QixJQUFJLFFBQUosSUFBSTtVQUFFLEdBQUcsUUFBSCxHQUFHO1VBQUUsTUFBTSxRQUFOLE1BQU07VUFBRSxPQUFPLFFBQVAsT0FBTzs7QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM5QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQzVCLENBQUM7QUFDRixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDekMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7Z0JBWEcsTUFBTTtBQWFWLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FmdkIsTUFBTTs7Ozs7QUFrQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxnQ0FBaUM7QUFDeEQsUUFBSSxFQUFFLElBQUk7QUFDVixVQUFNLEVBQUUsSUFBSTtBQUNaLE9BQUcsRUFBRSxJQUFJO0FBQ1QsV0FBTyxFQUFFLElBQUk7QUFDYixlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6IlIuQXBwLlBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgY29uc3QgXyA9IFIuXztcclxuXHJcbiAgY2xhc3MgUGx1Z2luIHtcclxuICAgIGNvbnN0cnVjdG9yKHsgZmx1eCwgcmVxLCB3aW5kb3csIGhlYWRlcnMgfSkge1xyXG4gICAgICBfLmRldigoKSA9PiBmbHV4LnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuRmx1eCkgJiZcclxuICAgICAgICBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3RcclxuICAgICAgKTtcclxuICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheU5hbWUgPSB0aGlzLmdldERpc3BsYXlOYW1lKCk7XHJcbiAgICAgIHRoaXMuZmx1eCA9IGZsdXg7XHJcbiAgICAgIHRoaXMud2luZG93ID0gd2luZG93O1xyXG4gICAgICB0aGlzLnJlcSA9IHJlcTtcclxuICAgICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgZGVzdHJveSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChQbHVnaW4ucHJvdG90eXBlLCAvKiogQGxlbmRzIFBsdWdpbi5Qcm90b3R5cGUgKi8ge1xyXG4gICAgZmx1eDogbnVsbCxcclxuICAgIHdpbmRvdzogbnVsbCxcclxuICAgIHJlcTogbnVsbCxcclxuICAgIGhlYWRlcnM6IG51bGwsXHJcbiAgICBkaXNwbGF5TmFtZTogbnVsbCxcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFBsdWdpbjtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9