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
            return path.should.be.a.String && _.has(_this3._cache, path).should.be.ok && _this3._cache[path].isFulfilled().should.be.ok;
          });
          return this._cache[path].value();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O01BRXBELEtBQUs7UUFBTCxLQUFLLEdBQ0UsU0FEUCxLQUFLLEdBQ0s7QUFDWixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixVQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixVQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztLQUN6Qjs7Z0JBTEcsS0FBSztBQU9ULGFBQU87O2VBQUEsWUFBRzs7QUFDUixjQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7QUFFN0IsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7bUJBQUssTUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtXQUFBLENBQUMsQ0FBQzs7QUFFckUsY0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsY0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7O0FBRUQsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxVQUFJOztlQUFBLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBTztjQUFYLElBQUks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QUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDOztBQUVELDJCQUFxQjs7ZUFBQSxZQUFHOztBQUN0QixXQUFDLENBQUMsR0FBRyxDQUFDO21CQUFNLE9BQUssVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7V0FBQSxDQUFDLENBQUM7U0FDL0M7Ozs7V0F6RkcsS0FBSzs7O0FBNEZYLEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN4QixVQUFNLEVBQUUsSUFBSTtBQUNaLGNBQVUsRUFBRSxJQUFJO0FBQ2hCLGlCQUFhLEVBQUUsSUFBSSxFQUNwQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNsQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFL0QsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDLENBQUM7O0FBRXpELFNBQU8sS0FBSyxDQUFDO0NBRWQsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICBjb25zdCBfID0gUi5fO1xyXG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gIGNvbnN0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vUi5TdG9yZS5TdWJzY3JpcHRpb24nKShSKTtcclxuXHJcbiAgY2xhc3MgU3RvcmUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHRoaXMuX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9jYWNoZSA9IHt9O1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdGhlIGNhY2hlXHJcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlKS5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9jYWNoZVtwYXRoXSA9IG51bGwpO1xyXG4gICAgICAvLyBOdWxsaWZ5IHJlZmVyZW5jZXNcclxuICAgICAgdGhpcy5fY2FjaGUgPSBudWxsO1xyXG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICBwdWxsKHBhdGgsIG9wdHMgPSB7fSkge1xyXG4gICAgICBsZXQgeyBieXBhc3NDYWNoZSB9ID0gb3B0cztcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgaWYoYnlwYXNzQ2FjaGUgfHwgIXRoaXMuX2NhY2hlW3BhdGhdKSB7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVbcGF0aF0gPSB0aGlzLmZldGNoKHBhdGgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtwYXRoXTtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaChwYXRoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHsgcGF0aCwgaGFuZGxlciB9KTtcclxuICAgICAgbGV0IGNyZWF0ZWRQYXRoID0gc3Vic2NyaXB0aW9uLmFkZFRvKHRoaXMuc3Vic2NyaXB0aW9ucyk7XHJcbiAgICAgIHRoaXMucHVsbChwYXRoKS50aGVuKGhhbmRsZXIpO1xyXG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcclxuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcclxuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFN1YnNjcmlwdGlvbikpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1YnNjcmlwdGlvbnMsXHJcbiAgICAgICAgZGVsZXRlZFBhdGg6IHN1YnNjcmlwdGlvbnMucmVtb3ZlRnJvbSh0aGlzLnN1YnNjcmlwdGlvbnMpLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZyB9KSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5fY2FjaGUpO1xyXG4gICAgICByZXR1cm4gcHJldmVudEVuY29kaW5nID8gc2VyaWFsaXphYmxlIDogXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphYmxlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zZXJpYWxpemUoc2VyaWFsaXplZCwgeyBwcmV2ZW50RGVjb2RpbmcgfSkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XHJcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgX2NhY2hlOiB1bnNlcmlhbGl6YWJsZSB9KTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIGlmKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSlcclxuICAgICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF1ba2V5XS51cGRhdGUodmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2FjaGVkVmFsdWUocGF0aCkge1xyXG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xyXG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgIF8uaGFzKHRoaXMuX2NhY2hlLCBwYXRoKS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICB0aGlzLl9jYWNoZVtwYXRoXS5pc0Z1bGZpbGxlZCgpLnNob3VsZC5iZS5va1xyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF0udmFsdWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYXNDYWNoZWRWYWx1ZShwYXRoKSB7XHJcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XHJcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcclxuICAgICAgcmV0dXJuIF8uaGFzKHRoaXMuX2NhY2hlLCBwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBfc2hvdWxkTm90QmVEZXN0cm95ZWQoKSB7XHJcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2Rlc3Ryb3llZC5zaG91bGQubm90LmJlLm9rKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF8uZXh0ZW5kKFN0b3JlLnByb3RvdHlwZSwge1xyXG4gICAgX2NhY2hlOiBudWxsLFxyXG4gICAgX2Rlc3Ryb3llZDogbnVsbCxcclxuICAgIHN1YnNjcmlwdGlvbnM6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IFN1YnNjcmlwdGlvbiB9KTtcclxuICBjb25zdCBNZW1vcnlTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5NZW1vcnlTdG9yZScpKFIsIFN0b3JlKTtcclxuICBjb25zdCBIVFRQU3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuSFRUUFN0b3JlJykoUiwgU3RvcmUpO1xyXG4gIGNvbnN0IFVwbGlua1N0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLlVwbGlua1N0b3JlJykoUiwgU3RvcmUpO1xyXG5cclxuICBfLmV4dGVuZChTdG9yZSwgeyBNZW1vcnlTdG9yZSwgSFRUUFN0b3JlLCBVcGxpbmtTdG9yZSB9KTtcclxuXHJcbiAgcmV0dXJuIFN0b3JlO1xyXG5cclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9