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
  var Subscription = require("./R.Store.Subscription")(R);

  var Store = (function () {
    var Store = function Store() {
      this._destroyed = false;
      this._cache = {};
      this.subscriptions = {};
    };

    _classProps(Store, null, {
      destroy: {
        writable: true,
        value: function () {
          var _this = this;
          this._shouldNotBeDestroyed();
          // Explicitly nullify the cache
          Object.keys(this._cache).forEach(function (path) {
            return _this._cache[path] = null;
          });
          // Nullify references
          this._cache = null;
          this._destroyed = true;
        }
      },
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      pull: {
        writable: true,
        value: function (path, opts) {
          if (opts === undefined) opts = {};
          var bypassCache = opts.bypassCache;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.an.Object;
          });
          if (bypassCache || !this._cache[path]) {
            this._cache[path] = this.fetch(path);
          }
          return this._cache[path];
        }
      },
      fetch: {
        writable: true,
        value: function (path) {
          _.abstract();
        }
      },
      subscribeTo: {
        writable: true,
        value: function (path, handler) {
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && handler.should.be.a.Function;
          });
          var subscription = new Subscription({ path: path, handler: handler });
          var createdPath = subscription.addTo(this.subscriptions);
          this.pull(path).then(handler);
          return { subscription: subscription, createdPath: createdPath };
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (_ref) {
          var subscription = _ref.subscription;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return subscription.should.be.an.instanceOf(Subscription);
          });
          return {
            subscriptions: subscriptions,
            deletedPath: subscriptions.removeFrom(this.subscriptions) };
        }
      },
      serialize: {
        writable: true,
        value: function (_ref2) {
          var preventEncoding = _ref2.preventEncoding;
          this._shouldNotBeDestroyed();
          var serializable = _.extend({}, this._cache);
          return preventEncoding ? serializable : _.base64Encode(JSON.stringify(serializable));
        }
      },
      unserialize: {
        writable: true,
        value: function (serialized, _ref3) {
          var preventDecoding = _ref3.preventDecoding;
          this._shouldNotBeDestroyed();
          var unserializable = preventDecoding ? serialized : JSON.parse(_.base64Decode(serialized));
          _.extend(this, { _cache: unserializable });
          return this;
        }
      },
      propagateUpdate: {
        writable: true,
        value: function (path, value) {
          var _this2 = this;
          this._shouldNotBeDestroyed();
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this2.subscriptions[path][key].update(value);
            });
          }
          return value;
        }
      },
      getCachedValue: {
        writable: true,
        value: function (path) {
          var _this3 = this;
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && _.has(_this3._cache, path).should.be.ok;
          });
          return this._cache[path];
        }
      },
      hasCachedValue: {
        writable: true,
        value: function (path) {
          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String;
          });
          return _.has(this._cache, path);
        }
      },
      _shouldNotBeDestroyed: {
        writable: true,
        value: function () {
          var _this4 = this;
          _.dev(function () {
            return _this4._destroyed.should.not.be.ok;
          });
        }
      }
    });

    return Store;
  })();

  _.extend(Store.prototype, {
    _cache: null,
    _destroyed: null,
    subscriptions: null });

  _.extend(Store, { Subscription: Subscription });
  var MemoryStore = require("./R.Store.MemoryStore")(R, Store);
  var HTTPStore = require("./R.Store.HTTPStore")(R, Store);
  var UplinkStore = require("./R.Store.UplinkStore")(R, Store);

  _.extend(Store, { MemoryStore: MemoryStore, HTTPStore: HTTPStore, UplinkStore: UplinkStore });

  return Store;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRXBELEtBQUs7UUFBTCxLQUFLLEdBQ0UsU0FEUCxLQUFLLEdBQ0s7QUFDWixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixVQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztLQUN6Qjs7Z0JBTEcsS0FBSztBQU9ULGFBQU87O2VBQUEsWUFBRzs7QUFDUixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7QUFFN0IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7bUJBQUssTUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtXQUFBLENBQUMsQ0FBQzs7QUFFckUsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7O0FBRUQsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxVQUFJOztlQUFBLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBTztjQUFYLElBQUks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LENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztTQUMvQzs7OztXQXhGRyxLQUFLOzs7QUEyRlgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ3hCLFVBQU0sRUFBRSxJQUFJO0FBQ1osY0FBVSxFQUFFLElBQUk7QUFDaEIsaUJBQWEsRUFBRSxJQUFJLEVBQ3BCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0QsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUvRCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUMsQ0FBQzs7QUFFekQsU0FBTyxLQUFLLENBQUM7Q0FFZCxDQUFDIiwiZmlsZSI6IlIuU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gIGNvbnN0IF8gPSBSLl87XHJcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XHJcbiAgY29uc3QgU3Vic2NyaXB0aW9uID0gcmVxdWlyZSgnLi9SLlN0b3JlLlN1YnNjcmlwdGlvbicpKFIpO1xyXG5cclxuICBjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX2NhY2hlID0ge307XHJcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB0aGUgY2FjaGVcclxuICAgICAgT2JqZWN0LmtleXModGhpcy5fY2FjaGUpLmZvckVhY2goKHBhdGgpID0+IHRoaXMuX2NhY2hlW3BhdGhdID0gbnVsbCk7XHJcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xyXG4gICAgICB0aGlzLl9jYWNoZSA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgIHB1bGwocGF0aCwgb3B0cyA9IHt9KSB7XHJcbiAgICAgIGxldCB7IGJ5cGFzc0NhY2hlIH0gPSBvcHRzO1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICBpZihieXBhc3NDYWNoZSB8fCAhdGhpcy5fY2FjaGVbcGF0aF0pIHtcclxuICAgICAgICB0aGlzLl9jYWNoZVtwYXRoXSA9IHRoaXMuZmV0Y2gocGF0aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW3BhdGhdO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoKHBhdGgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cclxuICAgICAgKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oeyBwYXRoLCBoYW5kbGVyIH0pO1xyXG4gICAgICBsZXQgY3JlYXRlZFBhdGggPSBzdWJzY3JpcHRpb24uYWRkVG8odGhpcy5zdWJzY3JpcHRpb25zKTtcclxuICAgICAgdGhpcy5wdWxsKHBhdGgpLnRoZW4oaGFuZGxlcik7XHJcbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfTtcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoU3Vic2NyaXB0aW9uKSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc3Vic2NyaXB0aW9ucyxcclxuICAgICAgICBkZWxldGVkUGF0aDogc3Vic2NyaXB0aW9ucy5yZW1vdmVGcm9tKHRoaXMuc3Vic2NyaXB0aW9ucyksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nIH0pIHtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgbGV0IHNlcmlhbGl6YWJsZSA9IF8uZXh0ZW5kKHt9LCB0aGlzLl9jYWNoZSk7XHJcbiAgICAgIHJldHVybiBwcmV2ZW50RW5jb2RpbmcgPyBzZXJpYWxpemFibGUgOiBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShzZXJpYWxpemFibGUpKTtcclxuICAgIH1cclxuXHJcbiAgICB1bnNlcmlhbGl6ZShzZXJpYWxpemVkLCB7IHByZXZlbnREZWNvZGluZyB9KSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIGxldCB1bnNlcmlhbGl6YWJsZSA9IHByZXZlbnREZWNvZGluZyA/IHNlcmlhbGl6ZWQgOiBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHNlcmlhbGl6ZWQpKTtcclxuICAgICAgXy5leHRlbmQodGhpcywgeyBfY2FjaGU6IHVuc2VyaWFsaXphYmxlIH0pO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpIHtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKVxyXG4gICAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXVtrZXldLnVwZGF0ZSh2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDYWNoZWRWYWx1ZShwYXRoKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgXy5oYXModGhpcy5fY2FjaGUsIHBhdGgpLnNob3VsZC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF07XHJcbiAgICB9XHJcblxyXG4gICAgaGFzQ2FjaGVkVmFsdWUocGF0aCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XHJcbiAgICAgIHJldHVybiBfLmhhcyh0aGlzLl9jYWNoZSwgcGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3Nob3VsZE5vdEJlRGVzdHJveWVkKCkge1xyXG4gICAgICBfLmRldigoKSA9PiB0aGlzLl9kZXN0cm95ZWQuc2hvdWxkLm5vdC5iZS5vayk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfLmV4dGVuZChTdG9yZS5wcm90b3R5cGUsIHtcclxuICAgIF9jYWNoZTogbnVsbCxcclxuICAgIF9kZXN0cm95ZWQ6IG51bGwsXHJcbiAgICBzdWJzY3JpcHRpb25zOiBudWxsLFxyXG4gIH0pO1xyXG5cclxuICBfLmV4dGVuZChTdG9yZSwgeyBTdWJzY3JpcHRpb24gfSk7XHJcbiAgY29uc3QgTWVtb3J5U3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuTWVtb3J5U3RvcmUnKShSLCBTdG9yZSk7XHJcbiAgY29uc3QgSFRUUFN0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLkhUVFBTdG9yZScpKFIsIFN0b3JlKTtcclxuICBjb25zdCBVcGxpbmtTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5VcGxpbmtTdG9yZScpKFIsIFN0b3JlKTtcclxuXHJcbiAgXy5leHRlbmQoU3RvcmUsIHsgTWVtb3J5U3RvcmUsIEhUVFBTdG9yZSwgVXBsaW5rU3RvcmUgfSk7XHJcblxyXG4gIHJldHVybiBTdG9yZTtcclxuXHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==