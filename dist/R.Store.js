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
          var _this2 = this;

          if (opts === undefined) opts = {};
          var bypassCache = opts.bypassCache;

          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.an.Object;
          });
          if (!bypassCache && this.hasCachedValue(path)) {
            return Promise.resolve(this.getCachedValue(path));
          } else {
            return this.fetch(path).then(function (value) {
              return _this2.propagateUpdate(path, value);
            });
          }
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
          var _this3 = this;

          this._shouldNotBeDestroyed();
          this._cache[path] = value;
          if (this.subscriptions[path]) {
            Object.keys(this.subscriptions[path]).forEach(function (key) {
              return _this3.subscriptions[path][key].update(value);
            });
          }
          return value;
        }
      },
      getCachedValue: {
        writable: true,
        value: function (path) {
          var _this4 = this;

          this._shouldNotBeDestroyed();
          _.dev(function () {
            return path.should.be.a.String && _.has(_this4._cache, path).should.be.ok;
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
          var _this5 = this;

          _.dev(function () {
            return _this5._destroyed.should.not.be.ok;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVwRCxLQUFLO1FBQUwsS0FBSyxHQUNFLFNBRFAsS0FBSyxHQUNLO0FBQ1osVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDekI7O2dCQUxHLEtBQUs7QUFPVCxhQUFPOztlQUFBLFlBQUc7OztBQUNSLGNBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztBQUU3QixnQkFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTttQkFBSyxNQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJO1dBQUEsQ0FBQyxDQUFDOztBQUVyRSxjQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4Qjs7QUFFRCxvQkFBYzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWxDLFVBQUk7O2VBQUEsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFP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QSxDQUFDLENBQUM7QUFDckMsaUJBQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pDOztBQUVELDJCQUFxQjs7ZUFBQSxZQUFHOzs7QUFDdEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO1NBQy9DOzs7O1dBM0ZHLEtBQUs7Ozs7O0FBOEZYLEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtBQUN4QixVQUFNLEVBQUUsSUFBSTtBQUNaLGNBQVUsRUFBRSxJQUFJO0FBQ2hCLGlCQUFhLEVBQUUsSUFBSSxFQUNwQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxZQUFZLEVBQVosWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNsQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzNELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFL0QsR0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQVgsV0FBVyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxDQUFDLENBQUM7O0FBRXpELFNBQU8sS0FBSyxDQUFDO0NBRWQsQ0FBQyIsImZpbGUiOiJSLlN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgY29uc3QgXyA9IFIuXztcbiAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gIGNvbnN0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vUi5TdG9yZS5TdWJzY3JpcHRpb24nKShSKTtcblxuICBjbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB0aGUgY2FjaGVcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlKS5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9jYWNoZVtwYXRoXSA9IG51bGwpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9jYWNoZSA9IG51bGw7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIHB1bGwocGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgICBsZXQgeyBieXBhc3NDYWNoZSB9ID0gb3B0cztcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoIWJ5cGFzc0NhY2hlICYmIHRoaXMuaGFzQ2FjaGVkVmFsdWUocGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmdldENhY2hlZFZhbHVlKHBhdGgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoKS50aGVuKCh2YWx1ZSkgPT4gdGhpcy5wcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIGhhbmRsZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICk7XG4gICAgICBsZXQgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih7IHBhdGgsIGhhbmRsZXIgfSk7XG4gICAgICBsZXQgY3JlYXRlZFBhdGggPSBzdWJzY3JpcHRpb24uYWRkVG8odGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICAgIHRoaXMucHVsbChwYXRoKS50aGVuKGhhbmRsZXIpO1xuICAgICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9O1xuICAgIH1cblxuICAgIHVuc3Vic2NyaWJlRnJvbSh7IHN1YnNjcmlwdGlvbiB9KSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFN1YnNjcmlwdGlvbikpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucyxcbiAgICAgICAgZGVsZXRlZFBhdGg6IHN1YnNjcmlwdGlvbnMucmVtb3ZlRnJvbSh0aGlzLnN1YnNjcmlwdGlvbnMpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXJpYWxpemUoeyBwcmV2ZW50RW5jb2RpbmcgfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIGxldCBzZXJpYWxpemFibGUgPSBfLmV4dGVuZCh7fSwgdGhpcy5fY2FjaGUpO1xuICAgICAgcmV0dXJuIHByZXZlbnRFbmNvZGluZyA/IHNlcmlhbGl6YWJsZSA6IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6YWJsZSkpO1xuICAgIH1cblxuICAgIHVuc2VyaWFsaXplKHNlcmlhbGl6ZWQsIHsgcHJldmVudERlY29kaW5nIH0pIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBsZXQgdW5zZXJpYWxpemFibGUgPSBwcmV2ZW50RGVjb2RpbmcgPyBzZXJpYWxpemVkIDogSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZShzZXJpYWxpemVkKSk7XG4gICAgICBfLmV4dGVuZCh0aGlzLCB7IF9jYWNoZTogdW5zZXJpYWxpemFibGUgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcm9wYWdhdGVVcGRhdGUocGF0aCwgdmFsdWUpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICB0aGlzLl9jYWNoZVtwYXRoXSA9IHZhbHVlO1xuICAgICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSlcbiAgICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdW2tleV0udXBkYXRlKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0Q2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgIF8uaGFzKHRoaXMuX2NhY2hlLCBwYXRoKS5zaG91bGQuYmUub2tcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbcGF0aF07XG4gICAgfVxuXG4gICAgaGFzQ2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIHJldHVybiBfLmhhcyh0aGlzLl9jYWNoZSwgcGF0aCk7XG4gICAgfVxuXG4gICAgX3Nob3VsZE5vdEJlRGVzdHJveWVkKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fZGVzdHJveWVkLnNob3VsZC5ub3QuYmUub2spO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9jYWNoZTogbnVsbCxcbiAgICBfZGVzdHJveWVkOiBudWxsLFxuICAgIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIH0pO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IFN1YnNjcmlwdGlvbiB9KTtcbiAgY29uc3QgTWVtb3J5U3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuTWVtb3J5U3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IEhUVFBTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5IVFRQU3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IFVwbGlua1N0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLlVwbGlua1N0b3JlJykoUiwgU3RvcmUpO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IE1lbW9yeVN0b3JlLCBIVFRQU3RvcmUsIFVwbGlua1N0b3JlIH0pO1xuXG4gIHJldHVybiBTdG9yZTtcblxufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==