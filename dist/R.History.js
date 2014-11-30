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

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var _ = R._;
  var url = require("url");

  function Plugin(_ref) {
    var storeName = _ref.storeName;
    var dispatcherName = _ref.dispatcherName;
    _.dev(function () {
      return storeName.should.be.a.String && dispatcherName.should.be.a.String;
    });

    var _History = (function (R) {
      var _History = function _History(_ref2) {
        var _this = this;
        var flux = _ref2.flux;
        var window = _ref2.window;
        var req = _ref2.req;
        R.App.Plugin.call.apply(R.App.Plugin, [this].concat(_slice.call(arguments)));
        if ((__BROWSER__)) {
          (function () {
            var dispatcher = flux.getDispatcher(dispatcherName);
            dispatcher.addActionHandler("/History/navigate", function (_ref3) {
              var pathname = _ref3.pathname;
              return Promise["try"](function () {
                _.dev(function () {
                  return pathname.should.be.a.String;
                });
                var urlObj = _.extend(url.parse(window.location.href), { pathname: pathname });
                window.history.pushState(null, null, url.format(urlObj));
                _this.navigate(urlObj);
              });
            });
            window.addEventListener("popstate", function () {
              return _this.navigate(window.location.href);
            });
            _this.navigate(url.parse(window.location.href));
          })();
        } else {
          this.navigate(url.parse(req.url));
        }
      };

      _extends(_History, R.App.Plugin);

      _classProps(_History, null, {
        destroy: {
          writable: true,
          value: function () {}
        },
        navigate: {
          writable: true,
          value: function (urlObj) {
            var store = this.flux.getStore(storeName);
            _.dev(function () {
              return store.set.should.be.a.Function && urlObj.should.be.an.Object;
            });
            return store.set("/History/location", urlObj);
          }
        },
        getDisplayName: {
          writable: true,
          value: function () {
            return "History";
          }
        }
      });

      return _History;
    })(R);

    return _History;
  }

  return Plugin;
};