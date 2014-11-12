"use strict";

var _slice = Array.prototype.slice;
var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R, Store) {
  var _ = R._;
  var should = R.should;

  var UplinkStore = (function (Store) {
    var UplinkStore = function UplinkStore(_ref) {
      var uplink = _ref.uplink;

      _.dev(function () {
        return uplink.should.be.an.instanceOf(R.Uplink);
      });
      Store.call.apply(Store, [this].concat(_slice.call(arguments)));
      this._uplink = uplink;
    };

    _extends(UplinkStore, Store);

    _classProps(UplinkStore, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          return "UplinkStore";
        }
      }
    });

    return UplinkStore;
  })(Store);

  _.extend(UplinkStore.prototype, {
    _uplink: null });

  return UplinkStore;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLlVwbGlua1N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O01BRWxCLFdBQVcsY0FBUyxLQUFLO1FBQXpCLFdBQVcsR0FDSixTQURQLFdBQVcsT0FDUztVQUFWLE1BQU0sUUFBTixNQUFNOztBQUNsQixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBRmhDLEFBR3RCLFdBSDJCLFlBQUwsS0FBSyw0QkFHbEIsU0FBUyxHQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDdkI7O2FBTEcsV0FBVyxFQUFTLEtBQUs7O2dCQUF6QixXQUFXO0FBT2Ysb0JBQWM7O2VBQUEsWUFBRztBQUNmLGlCQUFPLGFBQWEsQ0FBQztTQUN0Qjs7OztXQVRHLFdBQVc7S0FBUyxLQUFLOzs7O0FBWS9CLEdBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUM5QixXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFPLFdBQVcsQ0FBQztDQUNwQixDQUFDIiwiZmlsZSI6IlIuU3RvcmUuVXBsaW5rU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUiwgU3RvcmUpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgY2xhc3MgVXBsaW5rU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoeyB1cGxpbmsgfSkge1xuICAgICAgXy5kZXYoKCkgPT4gdXBsaW5rLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFIuVXBsaW5rKSk7XG4gICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgdGhpcy5fdXBsaW5rID0gdXBsaW5rO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkge1xuICAgICAgcmV0dXJuICdVcGxpbmtTdG9yZSc7XG4gICAgfVxuICB9XG5cbiAgXy5leHRlbmQoVXBsaW5rU3RvcmUucHJvdG90eXBlLCB7XG4gICAgX3VwbGluazogbnVsbCxcbiAgfSk7XG5cbiAgcmV0dXJuIFVwbGlua1N0b3JlO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==