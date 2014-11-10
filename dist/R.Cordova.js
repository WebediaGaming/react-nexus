"use strict";

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
module.exports = function (R) {
  return function (params) {
    var Cordova = (function (R) {
      var Cordova = function Cordova() {
        R.App.Plugin.call(this);
      };

      _extends(Cordova, R.App.Plugin);

      _classProps(Cordova, null, {
        getDisplayName: {
          writable: true,
          value: function () {
            return "Cordova";
          }
        },
        installInClient: {
          writable: true,
          value: function (flux, window) {}
        },
        installInServer: {
          writable: true,
          value: function (flux, req) {}
        }
      });

      return Cordova;
    })(R);

    _.extend(Cordova.prototype, {
      displayName: "Cordova" });

    return Cordova;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkNvcmRvdmEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsU0FBTyxVQUFDLE1BQU0sRUFBSztRQUNYLE9BQU8sY0FBUyxDQUFDO1VBQWpCLE9BQU8sR0FDQSxTQURQLE9BQU8sR0FDRztBQURNLEFBRWxCLFNBRm1CLENBQUMsR0FBRyxDQUFDLE1BQU0sV0FFdkIsQ0FBQztPQUNUOztlQUhHLE9BQU8sRUFBUyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07O2tCQUE1QixPQUFPO0FBS1gsc0JBQWM7O2lCQUFBLFlBQUc7QUFDZixtQkFBTyxTQUFTLENBQUM7V0FDbEI7O0FBRUQsdUJBQWU7O2lCQUFBLFVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUU3Qjs7QUFFRCx1QkFBZTs7aUJBQUEsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBRTFCOzs7O2FBZkcsT0FBTztPQUFTLENBQUM7Ozs7QUFrQnZCLEtBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtBQUMxQixpQkFBVyxFQUFFLFNBQVMsRUFDdkIsQ0FBQyxDQUFDOztBQUVILFdBQU8sT0FBTyxDQUFDO0dBQ2hCLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6IlIuQ29yZG92YS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIHJldHVybiAocGFyYW1zKSA9PiB7XG4gICAgY2xhc3MgQ29yZG92YSBleHRlbmRzIFIuQXBwLlBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQ29yZG92YSc7XG4gICAgICB9XG5cbiAgICAgIGluc3RhbGxJbkNsaWVudChmbHV4LCB3aW5kb3cpIHtcblxuICAgICAgfVxuXG4gICAgICBpbnN0YWxsSW5TZXJ2ZXIoZmx1eCwgcmVxKSB7XG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfLmV4dGVuZChDb3Jkb3ZhLnByb3RvdHlwZSwge1xuICAgICAgZGlzcGxheU5hbWU6ICdDb3Jkb3ZhJyxcbiAgICB9KTtcblxuICAgIHJldHVybiBDb3Jkb3ZhO1xuICB9O1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==