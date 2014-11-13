"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
var _ = require("lodash-next");
var should = _.should;

var Subscription = (function () {
  var Subscription = function Subscription(_ref) {
    var path = _ref.path;
    var handler = _ref.handler;

    _.dev(function () {
      return path.should.be.a.String && handler.should.be.a.Function;
    });
    _.extend(this, { path: path, handler: handler, id: _.uniqueId(path) });
  };

  _classProps(Subscription, null, {
    addTo: {
      writable: true,
      value: function (subscriptions) {
        var _this = this;

        _.dev(function () {
          return subscriptions.should.be.an.Object;
        });
        if (!subscriptions[this.path]) {
          subscriptions[this.path] = {};
        }
        _.dev(function () {
          return subscriptions[_this.path].should.be.an.Object && subscriptions[_this.path][_this.id].should.not.be.ok;
        });
        subscriptions[this.path][this.id] = this;
        return Object.keys(subscriptions[this.path]).length === 1;
      }
    },
    removeFrom: {
      writable: true,
      value: function (subscriptions) {
        var _this2 = this;

        _.dev(function () {
          return subscriptions.should.be.an.Object && subscriptions[_this2.path].shoulbe.be.an.Object && subscriptions[_this2.path][_this2.id].should.be.exactly(_this2);
        });
        delete subscriptions[this.path][this.id];
        if (Object.keys(subscriptions[this.path]).length === 0) {
          delete subscriptions[this.path];
          return true;
        }
        return false;
      }
    },
    update: {
      writable: true,
      value: function (value) {
        _.dev(function () {
          return (value === null || _.isObject(value)).should.be.ok;
        });
        this.handler.call(null, value);
      }
    }
  });

  return Subscription;
})();

_.extend(Subscription.prototype, {
  path: null,
  handler: null,
  id: null });

module.exports = Subscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9VcGxpbmsuU3Vic2NyaXB0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakMsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7SUFFbEIsWUFBWTtNQUFaLFlBQVksR0FDTixTQUROLFlBQVksT0FDYztRQUFqQixJQUFJLFFBQUosSUFBSTtRQUFFLE9BQU8sUUFBUCxPQUFPOztBQUN4QixLQUFDLENBQUMsR0FBRyxDQUFDO2FBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDakMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVE7S0FBQSxDQUM3QixDQUFDO0FBQ0YsS0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQzFEOztjQU5JLFlBQVk7QUFRaEIsU0FBSzs7YUFBQSxVQUFDLGFBQWEsRUFBRTs7O0FBQ25CLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07U0FBQSxDQUFDLENBQUM7QUFDL0MsWUFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDNUIsdUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQy9CO0FBQ0QsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxhQUFhLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQ3RELGFBQWEsQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUFBLENBQ25ELENBQUM7QUFDRixxQkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pDLGVBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztPQUMzRDs7QUFFRCxjQUFVOzthQUFBLFVBQUMsYUFBYSxFQUFFOzs7QUFDeEIsU0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFBTSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUMzQyxhQUFhLENBQUMsT0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdDLGFBQWEsQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLE9BQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLFFBQU07U0FBQSxDQUMxRCxDQUFDO0FBQ0YsZUFBTyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN6QyxZQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckQsaUJBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsVUFBTTs7YUFBQSxVQUFDLEtBQUssRUFBRTtBQUNaLFNBQUMsQ0FBQyxHQUFHLENBQUM7aUJBQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDaEUsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ2hDOzs7O1NBcENHLFlBQVk7Ozs7O0FBdUNsQixDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7QUFDaEMsTUFBSSxFQUFFLElBQUk7QUFDVCxTQUFPLEVBQUUsSUFBSTtBQUNkLElBQUUsRUFBRSxJQUFJLEVBQ1IsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6IlVwbGluay5TdWJzY3JpcHRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gtbmV4dCcpO1xuY29uc3Qgc2hvdWxkID0gXy5zaG91bGQ7XG5cbmNsYXNzIFN1YnNjcmlwdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHsgcGF0aCwgaGFuZGxlciB9KSB7XG4gICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICApO1xuICAgIF8uZXh0ZW5kKHRoaXMsIHsgcGF0aCwgaGFuZGxlciwgaWQ6IF8udW5pcXVlSWQocGF0aCkgfSk7XG5cdH1cblxuICBhZGRUbyhzdWJzY3JpcHRpb25zKSB7XG4gICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICBpZighc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdKSB7XG4gICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0gPSB7fTtcbiAgICB9XG4gICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgIHN1YnNjcmlwdGlvbnNbdGhpcy5wYXRoXVt0aGlzLmlkXS5zaG91bGQubm90LmJlLm9rXG4gICAgKTtcbiAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0gPSB0aGlzO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zW3RoaXMucGF0aF0pLmxlbmd0aCA9PT0gMTtcbiAgfVxuXG4gIHJlbW92ZUZyb20oc3Vic2NyaXB0aW9ucykge1xuICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdLnNob3VsYmUuYmUuYW4uT2JqZWN0ICYmXG4gICAgICBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF0uc2hvdWxkLmJlLmV4YWN0bHkodGhpcylcbiAgICApO1xuICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF1bdGhpcy5pZF07XG4gICAgaWYoT2JqZWN0LmtleXMoc3Vic2NyaXB0aW9uc1t0aGlzLnBhdGhdKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlbGV0ZSBzdWJzY3JpcHRpb25zW3RoaXMucGF0aF07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdXBkYXRlKHZhbHVlKSB7XG4gICAgXy5kZXYoKCkgPT4gKHZhbHVlID09PSBudWxsIHx8IF8uaXNPYmplY3QodmFsdWUpKS5zaG91bGQuYmUub2spO1xuICAgIHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIHZhbHVlKTtcbiAgfVxufVxuXG5fLmV4dGVuZChTdWJzY3JpcHRpb24ucHJvdG90eXBlLCB7XG5cdHBhdGg6IG51bGwsXG4gIGhhbmRsZXI6IG51bGwsXG5cdGlkOiBudWxsLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3Vic2NyaXB0aW9uO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9