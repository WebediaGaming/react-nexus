"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var _ = R._;
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
            subscription: subscription,
            deletedPath: subscription.removeFrom(this.subscriptions) };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVwRCxLQUFLO1FBQUwsS0FBSyxHQUNFLFNBRFAsS0FBSyxHQUNLO0FBQ1osVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDekI7O2dCQUxHLEtBQUs7QUFPVCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTdCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO21CQUFLLE1BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7V0FBQSxDQUFDLENBQUM7O0FBRXJFLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCOztBQUVELFVBQUk7O2VBQUEsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFPO2NBQVgsSUFBSSxnQkFBSixJQUFJLEdBQUcsRUFBRTtjQUNaLFdBQVcsR0FBSyxJQUFJLENBQXBCLFdBQVc7QUFDakIsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsV0FBQyxDQUFD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TSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztTQUMvQzs7OztXQXZGRyxLQUFLOzs7QUEwRlgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ3hCLFVBQU0sRUFBRSxJQUFJO0FBQ1osY0FBVSxFQUFFLElBQUk7QUFDaEIsaUJBQWEsRUFBRSxJQUFJLEVBQ3BCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLFlBQVksRUFBWixZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0QsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUvRCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLENBQUMsQ0FBQzs7QUFFekQsU0FBTyxLQUFLLENBQUM7Q0FFZCxDQUFDIiwiZmlsZSI6IlIuU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICBjb25zdCBfID0gUi5fO1xuICBjb25zdCBTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuL1IuU3RvcmUuU3Vic2NyaXB0aW9uJykoUik7XG5cbiAgY2xhc3MgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdGhlIGNhY2hlXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZSkuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fY2FjaGVbcGF0aF0gPSBudWxsKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fY2FjaGUgPSBudWxsO1xuICAgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWxsKHBhdGgsIG9wdHMgPSB7fSkge1xuICAgICAgbGV0IHsgYnlwYXNzQ2FjaGUgfSA9IG9wdHM7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKGJ5cGFzc0NhY2hlIHx8ICF0aGlzLl9jYWNoZVtwYXRoXSkge1xuICAgICAgICB0aGlzLl9jYWNoZVtwYXRoXSA9IHRoaXMuZmV0Y2gocGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF07XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkgeyBfLmFic3RyYWN0KCk7IH0gLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICBzdWJzY3JpYmVUbyhwYXRoLCBoYW5kbGVyKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgKTtcbiAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHsgcGF0aCwgaGFuZGxlciB9KTtcbiAgICAgIGxldCBjcmVhdGVkUGF0aCA9IHN1YnNjcmlwdGlvbi5hZGRUbyh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgICAgdGhpcy5wdWxsKHBhdGgpLnRoZW4oaGFuZGxlcik7XG4gICAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmVGcm9tKHsgc3Vic2NyaXB0aW9uIH0pIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBzdWJzY3JpcHRpb24uc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoU3Vic2NyaXB0aW9uKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpcHRpb24sXG4gICAgICAgIGRlbGV0ZWRQYXRoOiBzdWJzY3JpcHRpb24ucmVtb3ZlRnJvbSh0aGlzLnN1YnNjcmlwdGlvbnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXJpYWxpemUoeyBwcmV2ZW50RW5jb2RpbmcgfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5fY2FjaGUpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IF9jYWNoZTogdW5zZXJpYWxpemFibGUgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBpZih0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKVxuICAgICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF1ba2V5XS51cGRhdGUodmFsdWUpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBnZXRDYWNoZWRWYWx1ZShwYXRoKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgXy5oYXModGhpcy5fY2FjaGUsIHBhdGgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICB0aGlzLl9jYWNoZVtwYXRoXS5pc0Z1bGZpbGxlZCgpLnNob3VsZC5iZS5va1xuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtwYXRoXS52YWx1ZSgpO1xuICAgIH1cblxuICAgIGhhc0NhY2hlZFZhbHVlKHBhdGgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgICByZXR1cm4gXy5oYXModGhpcy5fY2FjaGUsIHBhdGgpO1xuICAgIH1cblxuICAgIF9zaG91bGROb3RCZURlc3Ryb3llZCgpIHtcbiAgICAgIF8uZGV2KCgpID0+IHRoaXMuX2Rlc3Ryb3llZC5zaG91bGQubm90LmJlLm9rKTtcbiAgICB9XG4gIH1cblxuICBfLmV4dGVuZChTdG9yZS5wcm90b3R5cGUsIHtcbiAgICBfY2FjaGU6IG51bGwsXG4gICAgX2Rlc3Ryb3llZDogbnVsbCxcbiAgICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICB9KTtcblxuICBfLmV4dGVuZChTdG9yZSwgeyBTdWJzY3JpcHRpb24gfSk7XG4gIGNvbnN0IE1lbW9yeVN0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLk1lbW9yeVN0b3JlJykoUiwgU3RvcmUpO1xuICBjb25zdCBIVFRQU3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuSFRUUFN0b3JlJykoUiwgU3RvcmUpO1xuICBjb25zdCBVcGxpbmtTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5VcGxpbmtTdG9yZScpKFIsIFN0b3JlKTtcblxuICBfLmV4dGVuZChTdG9yZSwgeyBNZW1vcnlTdG9yZSwgSFRUUFN0b3JlLCBVcGxpbmtTdG9yZSB9KTtcblxuICByZXR1cm4gU3RvcmU7XG5cbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=