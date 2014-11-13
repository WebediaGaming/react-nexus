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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVwRCxLQUFLO1FBQUwsS0FBSyxHQUNFLFNBRFAsS0FBSyxHQUNLO0FBQ1osVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDekI7O2dCQUxHLEtBQUs7QUFPVCxhQUFPOztlQUFBLFlBQUc7OztBQUNSLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztBQUU3QixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUVyRSxjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4Qjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWxDLFVBQUk7O2VBQUEsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFP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QUM7bUJBQU0sT0FBSyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtXQUFBLENBQUMsQ0FBQztTQUMvQzs7OztXQXhGRyxLQUFLOzs7OztBQTJGWCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDeEIsVUFBTSxFQUFFLElBQUk7QUFDWixjQUFVLEVBQUUsSUFBSTtBQUNoQixpQkFBYSxFQUFFLElBQUksRUFDcEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9ELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRS9ELEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQyxDQUFDOztBQUV6RCxTQUFPLEtBQUssQ0FBQztDQUVkLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICBjb25zdCBTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuL1IuU3RvcmUuU3Vic2NyaXB0aW9uJykoUik7XG5cbiAgY2xhc3MgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5fZGVzdHJveWVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICAvLyBFeHBsaWNpdGx5IG51bGxpZnkgdGhlIGNhY2hlXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZSkuZm9yRWFjaCgocGF0aCkgPT4gdGhpcy5fY2FjaGVbcGF0aF0gPSBudWxsKTtcbiAgICAgIC8vIE51bGxpZnkgcmVmZXJlbmNlc1xuICAgICAgdGhpcy5fY2FjaGUgPSBudWxsO1xuICAgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICBwdWxsKHBhdGgsIG9wdHMgPSB7fSkge1xuICAgICAgbGV0IHsgYnlwYXNzQ2FjaGUgfSA9IG9wdHM7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgIGlmKGJ5cGFzc0NhY2hlIHx8ICF0aGlzLl9jYWNoZVtwYXRoXSkge1xuICAgICAgICB0aGlzLl9jYWNoZVtwYXRoXSA9IHRoaXMuZmV0Y2gocGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF07XG4gICAgfVxuXG4gICAgZmV0Y2gocGF0aCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oeyBwYXRoLCBoYW5kbGVyIH0pO1xuICAgICAgbGV0IGNyZWF0ZWRQYXRoID0gc3Vic2NyaXB0aW9uLmFkZFRvKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgICB0aGlzLnB1bGwocGF0aCkudGhlbihoYW5kbGVyKTtcbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihTdWJzY3JpcHRpb24pKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMsXG4gICAgICAgIGRlbGV0ZWRQYXRoOiBzdWJzY3JpcHRpb25zLnJlbW92ZUZyb20odGhpcy5zdWJzY3JpcHRpb25zKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc2VyaWFsaXplKHsgcHJldmVudEVuY29kaW5nIH0pIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBsZXQgc2VyaWFsaXphYmxlID0gXy5leHRlbmQoe30sIHRoaXMuX2NhY2hlKTtcbiAgICAgIHJldHVybiBwcmV2ZW50RW5jb2RpbmcgPyBzZXJpYWxpemFibGUgOiBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShzZXJpYWxpemFibGUpKTtcbiAgICB9XG5cbiAgICB1bnNlcmlhbGl6ZShzZXJpYWxpemVkLCB7IHByZXZlbnREZWNvZGluZyB9KSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgbGV0IHVuc2VyaWFsaXphYmxlID0gcHJldmVudERlY29kaW5nID8gc2VyaWFsaXplZCA6IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUoc2VyaWFsaXplZCkpO1xuICAgICAgXy5leHRlbmQodGhpcywgeyBfY2FjaGU6IHVuc2VyaWFsaXphYmxlIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHJvcGFnYXRlVXBkYXRlKHBhdGgsIHZhbHVlKSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSlcbiAgICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdW2tleV0udXBkYXRlKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0Q2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIF8uaGFzKHRoaXMuX2NhY2hlLCBwYXRoKS5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF07XG4gICAgfVxuXG4gICAgaGFzQ2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIHJldHVybiBfLmhhcyh0aGlzLl9jYWNoZSwgcGF0aCk7XG4gICAgfVxuXG4gICAgX3Nob3VsZE5vdEJlRGVzdHJveWVkKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fZGVzdHJveWVkLnNob3VsZC5ub3QuYmUub2spO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9jYWNoZTogbnVsbCxcbiAgICBfZGVzdHJveWVkOiBudWxsLFxuICAgIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIH0pO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IFN1YnNjcmlwdGlvbiB9KTtcbiAgY29uc3QgTWVtb3J5U3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuTWVtb3J5U3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IEhUVFBTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5IVFRQU3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IFVwbGlua1N0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLlVwbGlua1N0b3JlJykoUiwgU3RvcmUpO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IE1lbW9yeVN0b3JlLCBIVFRQU3RvcmUsIFVwbGlua1N0b3JlIH0pO1xuXG4gIHJldHVybiBTdG9yZTtcblxufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==