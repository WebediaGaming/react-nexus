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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLlN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUVwRCxLQUFLO1FBQUwsS0FBSyxHQUNFLFNBRFAsS0FBSyxHQUNLO0FBQ1osVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDekI7O2dCQUxHLEtBQUs7QUFPVCxhQUFPOztlQUFBLFlBQUc7O0FBQ1IsY0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTdCLGdCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO21CQUFLLE1BQUssTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUk7V0FBQSxDQUFDLENBQUM7O0FBRXJFLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCOztBQUVELG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsVUFBSTs7ZUFBQSxVQUFDLElBQUksRUFBRSxJQUFJLEVBQU87Y0FBWCxJQUFJLGdCQUFKLElBQUksR0FBRyxFQUFFO2NBQ1osV0FBVyxHQUFLLElBQUks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QUEsWUFBRzs7QUFDdEIsV0FBQyxDQUFDLEdBQUcsQ0FBQzttQkFBTSxPQUFLLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1dBQUEsQ0FBQyxDQUFDO1NBQy9DOzs7O1dBekZHLEtBQUs7OztBQTRGWCxHQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7QUFDeEIsVUFBTSxFQUFFLElBQUk7QUFDWixjQUFVLEVBQUUsSUFBSTtBQUNoQixpQkFBYSxFQUFFLElBQUksRUFDcEIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsWUFBWSxFQUFaLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9ELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRS9ELEdBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsQ0FBQyxDQUFDOztBQUV6RCxTQUFPLEtBQUssQ0FBQztDQUVkLENBQUMiLCJmaWxlIjoiUi5TdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gIGNvbnN0IF8gPSBSLl87XG4gIGNvbnN0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vUi5TdG9yZS5TdWJzY3JpcHRpb24nKShSKTtcblxuICBjbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIC8vIEV4cGxpY2l0bHkgbnVsbGlmeSB0aGUgY2FjaGVcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlKS5mb3JFYWNoKChwYXRoKSA9PiB0aGlzLl9jYWNoZVtwYXRoXSA9IG51bGwpO1xuICAgICAgLy8gTnVsbGlmeSByZWZlcmVuY2VzXG4gICAgICB0aGlzLl9jYWNoZSA9IG51bGw7XG4gICAgICB0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgIHB1bGwocGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgICBsZXQgeyBieXBhc3NDYWNoZSB9ID0gb3B0cztcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgaWYoYnlwYXNzQ2FjaGUgfHwgIXRoaXMuX2NhY2hlW3BhdGhdKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlW3BhdGhdID0gdGhpcy5mZXRjaChwYXRoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtwYXRoXTtcbiAgICB9XG5cbiAgICBmZXRjaChwYXRoKSB7IF8uYWJzdHJhY3QoKTsgfSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICApO1xuICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oeyBwYXRoLCBoYW5kbGVyIH0pO1xuICAgICAgbGV0IGNyZWF0ZWRQYXRoID0gc3Vic2NyaXB0aW9uLmFkZFRvKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgICB0aGlzLnB1bGwocGF0aCkudGhlbihoYW5kbGVyKTtcbiAgICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgY3JlYXRlZFBhdGggfTtcbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUZyb20oeyBzdWJzY3JpcHRpb24gfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihTdWJzY3JpcHRpb24pKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmlwdGlvbixcbiAgICAgICAgZGVsZXRlZFBhdGg6IHN1YnNjcmlwdGlvbi5yZW1vdmVGcm9tKHRoaXMuc3Vic2NyaXB0aW9ucyksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNlcmlhbGl6ZSh7IHByZXZlbnRFbmNvZGluZyB9KSB7XG4gICAgICB0aGlzLl9zaG91bGROb3RCZURlc3Ryb3llZCgpO1xuICAgICAgbGV0IHNlcmlhbGl6YWJsZSA9IF8uZXh0ZW5kKHt9LCB0aGlzLl9jYWNoZSk7XG4gICAgICByZXR1cm4gcHJldmVudEVuY29kaW5nID8gc2VyaWFsaXphYmxlIDogXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoc2VyaWFsaXphYmxlKSk7XG4gICAgfVxuXG4gICAgdW5zZXJpYWxpemUoc2VyaWFsaXplZCwgeyBwcmV2ZW50RGVjb2RpbmcgfSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIGxldCB1bnNlcmlhbGl6YWJsZSA9IHByZXZlbnREZWNvZGluZyA/IHNlcmlhbGl6ZWQgOiBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHNlcmlhbGl6ZWQpKTtcbiAgICAgIF8uZXh0ZW5kKHRoaXMsIHsgX2NhY2hlOiB1bnNlcmlhbGl6YWJsZSB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHByb3BhZ2F0ZVVwZGF0ZShwYXRoLCB2YWx1ZSkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIGlmKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXSkge1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pXG4gICAgICAgIC5mb3JFYWNoKChrZXkpID0+IHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXVtrZXldLnVwZGF0ZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGdldENhY2hlZFZhbHVlKHBhdGgpIHtcbiAgICAgIHRoaXMuX3Nob3VsZE5vdEJlRGVzdHJveWVkKCk7XG4gICAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICBfLmhhcyh0aGlzLl9jYWNoZSwgcGF0aCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgIHRoaXMuX2NhY2hlW3BhdGhdLmlzRnVsZmlsbGVkKCkuc2hvdWxkLmJlLm9rXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW3BhdGhdLnZhbHVlKCk7XG4gICAgfVxuXG4gICAgaGFzQ2FjaGVkVmFsdWUocGF0aCkge1xuICAgICAgdGhpcy5fc2hvdWxkTm90QmVEZXN0cm95ZWQoKTtcbiAgICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICAgIHJldHVybiBfLmhhcyh0aGlzLl9jYWNoZSwgcGF0aCk7XG4gICAgfVxuXG4gICAgX3Nob3VsZE5vdEJlRGVzdHJveWVkKCkge1xuICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fZGVzdHJveWVkLnNob3VsZC5ub3QuYmUub2spO1xuICAgIH1cbiAgfVxuXG4gIF8uZXh0ZW5kKFN0b3JlLnByb3RvdHlwZSwge1xuICAgIF9jYWNoZTogbnVsbCxcbiAgICBfZGVzdHJveWVkOiBudWxsLFxuICAgIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIH0pO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IFN1YnNjcmlwdGlvbiB9KTtcbiAgY29uc3QgTWVtb3J5U3RvcmUgPSByZXF1aXJlKCcuL1IuU3RvcmUuTWVtb3J5U3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IEhUVFBTdG9yZSA9IHJlcXVpcmUoJy4vUi5TdG9yZS5IVFRQU3RvcmUnKShSLCBTdG9yZSk7XG4gIGNvbnN0IFVwbGlua1N0b3JlID0gcmVxdWlyZSgnLi9SLlN0b3JlLlVwbGlua1N0b3JlJykoUiwgU3RvcmUpO1xuXG4gIF8uZXh0ZW5kKFN0b3JlLCB7IE1lbW9yeVN0b3JlLCBIVFRQU3RvcmUsIFVwbGlua1N0b3JlIH0pO1xuXG4gIHJldHVybiBTdG9yZTtcblxufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==