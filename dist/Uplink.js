"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
var _ = require("lodash-next");

var io = require("socket.io-client");
var request = _.isServer() ? require("request") : require("browser-request");
var resolve = require("url").resolve;
var should = _.should;

var Listener = require("./Uplink.Listener");
var Subscription = require("./Uplink.Subscription");

// These socket.io handlers are actually called like Uplink instance method
// (using .call). In their body 'this' is therefore an Uplink instance.
// They are declared here to avoid cluttering the Uplink class definition
// and method naming collisions.
var ioHandlers = {
  connect: function () {
    this.io.emit("handshake", { guid: this.guid });
  },

  reconnect: function () {},

  disconnect: function () {},

  handshakeAck: function (_ref) {
    var pid = _ref.pid;

    if (this.pid !== null && pid !== this.pid && this.shouldReloadOnServerRestart && _.isClient()) {
      window.location.reload();
    }
    this.pid = pid;
    this._handshake({ pid: pid, guid: guid });
  },

  update: function (_ref2) {
    var _this = this;
    var path = _ref2.path;
    var diff = _ref2.diff;
    var hash = _ref2.hash;

    // At the uplink level, updates are transmitted
    // as (diff, hash). If the uplink client has
    // a cached value with the matching hash, then
    // the diff is applied. If not, then the full value
    // is fetched.
    _.dev(function () {
      return path.should.be.a.String;
    });
    if (!this.store[path]) {
      return;
    }
    if (this.store[path].hash === hash) {
      this.store[path].value = _.patch(this.store[path], diff);
      this.store[path].hash = _.hash(this.store[path].value);
      this.update(path, this.store[path]);
    } else {
      this.pull(path, { bypassCache: true }).then(function (value) {
        return _this.store[path] = { value: value, hash: _.hash(value) };
      });
    }
  },

  emit: function (_ref3) {
    var room = _ref3.room;
    var params = _ref3.params;

    _.dev(function () {
      return room.should.be.a.String && params.should.be.an.Object;
    });
    this.emit(room, params);
  },

  debug: function (params) {
    _.dev(function () {
      return params.should.be.an.Object;
    });
    console.table(params);
  },

  log: function (_ref4) {
    var message = _ref4.message;

    _.dev(function () {
      return message.should.be.a.String;
    });
    console.log(message);
  },

  warn: function (_ref5) {
    var message = _ref5.message;

    _.dev(function () {
      return message.should.be.a.String;
    });
    console.warn(message);
  },

  err: function (_ref6) {
    var message = _ref6.message;

    _.dev(function () {
      return message.should.be.a.String;
    });
    console.error(message);
  } };

var Uplink = (function () {
  var Uplink = function Uplink(_ref7) {
    var _this2 = this;
    var url = _ref7.url;
    var guid = _ref7.guid;
    var shouldReloadOnServerRestart = _ref7.shouldReloadOnServerRestart;

    _.dev(function () {
      return url.should.be.a.String && guid.should.be.a.String;
    });
    this.http = resolve(url, "http");
    this.io = io(resolve(url, "io"));
    this.pid = null;
    this.guid = guid;
    this.shouldReloadOnServerRestart = shouldReloadOnServerRestart;
    this.handshake = new Promise(function (resolve, reject) {
      return _this2._handshake = { resolve: resolve, reject: reject };
    }).cancellable();
    this.listeners = {};
    this.subscriptions = {};
    this.store = {};
    this.pending = {};
    this.bindIOHandlers();
  };

  _classProps(Uplink, null, {
    destroy: {
      writable: true,
      value: function () {
        var _this3 = this;

        // Cancel all pending requests/active subscriptions/listeners
        if (!this.handshake.isResolved()) {
          this.handshake.cancel();
        }
        Object.keys(this.subscriptions).forEach(function (path) {
          return Object.keys(_this3.subscriptions[path]).forEach(function (id) {
            return _this3.unsubscribeFrom(_this3.subscriptions[path][id]);
          });
        });
        Object.keys(this.listeners).forEach(function (room) {
          return Object.keys(_this3.listeners[room]).forEach(function (id) {
            return _this3.unlistenFrom(_this3.listeners[room][id]);
          });
        });
        Object.keys(this.pending).forEach(function (path) {
          _this3.pending[path].cancel();
          delete _this3.pending[path];
        });
        this.io.close();
      }
    },
    bindIOHandlers: {
      writable: true,
      value: function () {
        var _this4 = this;

        Object.keys(ioHandlers).forEach(function (event) {
          return _this4.io.on(event, function (params) {
            return ioHandlers[event].call(_this4, params);
          });
        });
      }
    },
    push: {
      writable: true,
      value: function (event, params) {
        this.io.emit(event, params);
        return this;
      }
    },
    pull: {
      writable: true,
      value: function (path, opts) {
        var _this5 = this;

        if (opts === undefined) opts = {};
        var bypassCache = opts.bypassCache;

        _.dev(function () {
          return path.should.be.a.String;
        });
        if (!this.pending[path] || bypassCache) {
          this.pending[path] = this.fetch(path).cancellable().then(function (value) {
            // As soon as the result is received, removed from the pending list.
            delete _this5.pending[path];
            return value;
          });
        }
        _.dev(function () {
          return _this5.pending[path].then.should.be.a.Function;
        });
        return this.pending[path];
      }
    },
    fetch: {
      writable: true,
      value: function (path) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          return request({ method: "GET", url: resolve(_this6.http, path), json: true }, function (err, res, body) {
            return err ? reject(err) : resolve(body);
          });
        });
      }
    },
    dispatch: {
      writable: true,
      value: function (action, params) {
        var _this7 = this;

        _.dev(function () {
          return action.should.be.a.String && params.should.be.an.Object;
        });
        return new Promise(function (resolve, reject) {
          return request({ method: "POST", url: resolve(_this7.http, path), json: true, body: _.extend({}, params, { guid: _this7.guid }) }, function (err, res, body) {
            return err ? reject(err) : resolve(body);
          });
        });
      }
    },
    _remoteSubscribeTo: {
      writable: true,
      value: function (path) {
        _.dev(function () {
          return path.should.be.a.String;
        });
        this.store[path] = { value: null, hash: null };
        this.io.emit("subscribeTo", { path: path });
      }
    },
    _remoteUnsubscribeFrom: {
      writable: true,
      value: function (path) {
        _.dev(function () {
          return path.should.be.a.String;
        });
        this.io.emit("unsubscribeFrom", { path: path });
        delete this.store[path];
      }
    },
    subscribeTo: {
      writable: true,
      value: function (path, handler) {
        _.dev(function () {
          return path.should.be.a.String && handler.should.be.a.Function;
        });
        var subscription = new Subscription({ path: path, handler: handler });
        var createdPath = subscription.addTo(this.subscriptions);
        if (createdPath) {
          this._remoteSubscribeTo(path);
        }
        return { subscription: subscription, createdPath: createdPath };
      }
    },
    unsubscribeFrom: {
      writable: true,
      value: function (subscription) {
        _.dev(function () {
          return subscription.should.be.an.instanceOf(Subscription);
        });
        var deletedPath = subscription.removeFrom(this.subscriptions);
        if (deletedPath) {
          this._remoteUnsubscribeFrom(subscription.path);
          delete this.store[path];
        }
        return { subscription: subscription, deletedPath: deletedPath };
      }
    },
    update: {
      writable: true,
      value: function (path, value) {
        var _this8 = this;

        _.dev(function () {
          return path.should.be.a.String && (value === null || _.isObject(value)).should.be.ok;
        });
        if (this.subscriptions[path]) {
          Object.keys(this.subscriptions[path]).forEach(function (key) {
            return _this8.subscriptions[path][key].update(value);
          });
        }
      }
    },
    _remoteListenTo: {
      writable: true,
      value: function (room) {
        _.dev(function () {
          return room.should.be.a.String;
        });
        this.io.emit("listenTo", { room: room });
      }
    },
    _remoteUnlistenFrom: {
      writable: true,
      value: function (room) {
        _.dev(function () {
          return room.should.be.a.String;
        });
        this.io.emit("unlistenFrom", { room: room });
      }
    },
    listenTo: {
      writable: true,
      value: function (room, handler) {
        _.dev(function () {
          return room.should.be.a.String && handler.should.be.a.Function;
        });
        var listener = new Listener({ room: room, handler: handler });
        var createdRoom = listener.addTo(this.listeners);
        if (createdRoom) {
          this._remoteListenTo(room);
        }
        return { listener: listener, createdRoom: createdRoom };
      }
    },
    unlistenFrom: {
      writable: true,
      value: function (listener) {
        _.dev(function () {
          return listener.should.be.an.instanceOf(Listener);
        });
        var deletedRoom = subscription.removeFrom(this.listeners);
        if (deletedRoom) {
          this._remoteUnlistenFrom(listener.room);
        }
        return { listener: listener, deletedRoom: deletedRoom };
      }
    },
    emit: {
      writable: true,
      value: function (room, params) {
        var _this9 = this;

        _.dev(function () {
          return room.should.be.a.String && params.should.be.an.Object;
        });
        if (this.listeners[room]) {
          Object.keys(this.listeners[room]).forEach(function (key) {
            return _this9.listeners[room][key].emit(params);
          });
        }
      }
    }
  });

  return Uplink;
})();

_.extend(Uplink.prototype, {
  guid: null,
  handshake: null,
  _handshake: null,
  io: null,
  pid: null,
  listeners: null,
  shouldReloadOnServerRestart: null,
  subscriptions: null,
  store: null });

module.exports = Uplink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9VcGxpbmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvRSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBRXhCLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlDLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzs7Ozs7QUFNdEQsSUFBTSxVQUFVLEdBQUc7QUFDakIsU0FBTyxFQUFBLFlBQUc7QUFDUixRQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7R0FDaEQ7O0FBRUQsV0FBUyxFQUFBLFlBQUcsRUFHWDs7QUFFRCxZQUFVLEVBQUEsWUFBRyxFQUdaOztBQUVELGNBQVksRUFBQSxnQkFBVTtRQUFQLEdBQUcsUUFBSCxHQUFHOztBQUNoQixRQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQywyQkFBMkIsSUFB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LElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ2hDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7bUJBQUssT0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztXQUFBLENBQUMsQ0FBQztTQUMzRDtPQUNGOzs7O1NBaktHLE1BQU07Ozs7O0FBb0taLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUN6QixNQUFJLEVBQUUsSUFBSTtBQUNWLFdBQVMsRUFBRSxJQUFJO0FBQ2YsWUFBVSxFQUFFLElBQUk7QUFDaEIsSUFBRSxFQUFFLElBQUk7QUFDUixLQUFHLEVBQUUsSUFBSTtBQUNULFdBQVMsRUFBRSxJQUFJO0FBQ2YsNkJBQTJCLEVBQUUsSUFBSTtBQUNqQyxlQUFhLEVBQUUsSUFBSTtBQUNuQixPQUFLLEVBQUUsSUFBSSxFQUNaLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJVcGxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gtbmV4dCcpO1xuXG5jb25zdCBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcbmNvbnN0IHJlcXVlc3QgPSBfLmlzU2VydmVyKCkgPyByZXF1aXJlKCdyZXF1ZXN0JykgOiByZXF1aXJlKCdicm93c2VyLXJlcXVlc3QnKTtcbmNvbnN0IHJlc29sdmUgPSByZXF1aXJlKCd1cmwnKS5yZXNvbHZlO1xuY29uc3Qgc2hvdWxkID0gXy5zaG91bGQ7XG5cbmNvbnN0IExpc3RlbmVyID0gcmVxdWlyZSgnLi9VcGxpbmsuTGlzdGVuZXInKTtcbmNvbnN0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4vVXBsaW5rLlN1YnNjcmlwdGlvbicpO1xuXG4vLyBUaGVzZSBzb2NrZXQuaW8gaGFuZGxlcnMgYXJlIGFjdHVhbGx5IGNhbGxlZCBsaWtlIFVwbGluayBpbnN0YW5jZSBtZXRob2Rcbi8vICh1c2luZyAuY2FsbCkuIEluIHRoZWlyIGJvZHkgJ3RoaXMnIGlzIHRoZXJlZm9yZSBhbiBVcGxpbmsgaW5zdGFuY2UuXG4vLyBUaGV5IGFyZSBkZWNsYXJlZCBoZXJlIHRvIGF2b2lkIGNsdXR0ZXJpbmcgdGhlIFVwbGluayBjbGFzcyBkZWZpbml0aW9uXG4vLyBhbmQgbWV0aG9kIG5hbWluZyBjb2xsaXNpb25zLlxuY29uc3QgaW9IYW5kbGVycyA9IHtcbiAgY29ubmVjdCgpIHtcbiAgICB0aGlzLmlvLmVtaXQoJ2hhbmRzaGFrZScsIHsgZ3VpZDogdGhpcy5ndWlkIH0pO1xuICB9LFxuXG4gIHJlY29ubmVjdCgpIHtcbiAgICAvLyBUT0RPXG4gICAgLy8gSGFuZGxlIHJlY29ubmVjdGlvbnMgcHJvcGVybHkuXG4gIH0sXG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICAvLyBUT0RPXG4gICAgLy8gSGFuZGxlIGRpc2Nvbm5lY3Rpb25zIHByb3Blcmx5XG4gIH0sXG5cbiAgaGFuZHNoYWtlQWNrKHsgcGlkIH0pIHtcbiAgICBpZih0aGlzLnBpZCAhPT0gbnVsbCAmJiBwaWQgIT09IHRoaXMucGlkICYmIHRoaXMuc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0ICYmIF8uaXNDbGllbnQoKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cbiAgICB0aGlzLnBpZCA9IHBpZDtcbiAgICB0aGlzLl9oYW5kc2hha2UoeyBwaWQsIGd1aWQgfSk7XG4gIH0sXG5cbiAgdXBkYXRlKHsgcGF0aCwgZGlmZiwgaGFzaCB9KSB7XG4gICAgLy8gQXQgdGhlIHVwbGluayBsZXZlbCwgdXBkYXRlcyBhcmUgdHJhbnNtaXR0ZWRcbiAgICAvLyBhcyAoZGlmZiwgaGFzaCkuIElmIHRoZSB1cGxpbmsgY2xpZW50IGhhc1xuICAgIC8vIGEgY2FjaGVkIHZhbHVlIHdpdGggdGhlIG1hdGNoaW5nIGhhc2gsIHRoZW5cbiAgICAvLyB0aGUgZGlmZiBpcyBhcHBsaWVkLiBJZiBub3QsIHRoZW4gdGhlIGZ1bGwgdmFsdWVcbiAgICAvLyBpcyBmZXRjaGVkLlxuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICBpZighdGhpcy5zdG9yZVtwYXRoXSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZih0aGlzLnN0b3JlW3BhdGhdLmhhc2ggPT09IGhhc2gpIHtcbiAgICAgIHRoaXMuc3RvcmVbcGF0aF0udmFsdWUgPSBfLnBhdGNoKHRoaXMuc3RvcmVbcGF0aF0sIGRpZmYpO1xuICAgICAgdGhpcy5zdG9yZVtwYXRoXS5oYXNoID0gXy5oYXNoKHRoaXMuc3RvcmVbcGF0aF0udmFsdWUpO1xuICAgICAgdGhpcy51cGRhdGUocGF0aCwgdGhpcy5zdG9yZVtwYXRoXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5wdWxsKHBhdGgsIHsgYnlwYXNzQ2FjaGU6IHRydWUgfSlcbiAgICAgIC50aGVuKCh2YWx1ZSkgPT4gdGhpcy5zdG9yZVtwYXRoXSA9IHsgdmFsdWUsIGhhc2g6IF8uaGFzaCh2YWx1ZSkgfSk7XG4gICAgfVxuICB9LFxuXG4gIGVtaXQoeyByb29tLCBwYXJhbXMgfSkge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmIHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICB0aGlzLmVtaXQocm9vbSwgcGFyYW1zKTtcblxuICB9LFxuXG4gIGRlYnVnKHBhcmFtcykge1xuICAgIF8uZGV2KCgpID0+IHBhcmFtcy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICBjb25zb2xlLnRhYmxlKHBhcmFtcyk7XG4gIH0sXG5cbiAgbG9nKHsgbWVzc2FnZSB9KSB7XG4gICAgXy5kZXYoKCkgPT4gbWVzc2FnZS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICB9LFxuXG4gIHdhcm4oeyBtZXNzYWdlIH0pIHtcbiAgICBfLmRldigoKSA9PiBtZXNzYWdlLnNob3VsZC5iZS5hLlN0cmluZyk7XG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICB9LFxuXG4gIGVycih7IG1lc3NhZ2UgfSkge1xuICAgIF8uZGV2KCgpID0+IG1lc3NhZ2Uuc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9LFxufTtcblxuY2xhc3MgVXBsaW5rIHtcbiAgY29uc3RydWN0b3IoeyB1cmwsIGd1aWQsIHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydCB9KSB7XG4gICAgXy5kZXYoKCkgPT4gdXJsLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmdcbiAgICApO1xuICAgIHRoaXMuaHR0cCA9IHJlc29sdmUodXJsLCAnaHR0cCcpO1xuICAgIHRoaXMuaW8gPSBpbyhyZXNvbHZlKHVybCwgJ2lvJykpO1xuICAgIHRoaXMucGlkID0gbnVsbDtcbiAgICB0aGlzLmd1aWQgPSBndWlkO1xuICAgIHRoaXMuc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0ID0gc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0O1xuICAgIHRoaXMuaGFuZHNoYWtlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gdGhpcy5faGFuZHNoYWtlID0geyByZXNvbHZlLCByZWplY3QgfSkuY2FuY2VsbGFibGUoKTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLnBlbmRpbmcgPSB7fTtcbiAgICB0aGlzLmJpbmRJT0hhbmRsZXJzKCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIENhbmNlbCBhbGwgcGVuZGluZyByZXF1ZXN0cy9hY3RpdmUgc3Vic2NyaXB0aW9ucy9saXN0ZW5lcnNcbiAgICBpZighdGhpcy5oYW5kc2hha2UuaXNSZXNvbHZlZCgpKSB7XG4gICAgICB0aGlzLmhhbmRzaGFrZS5jYW5jZWwoKTtcbiAgICB9XG4gICAgT2JqZWN0LmtleXModGhpcy5zdWJzY3JpcHRpb25zKVxuICAgIC5mb3JFYWNoKChwYXRoKSA9PiBPYmplY3Qua2V5cyh0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pXG4gICAgICAuZm9yRWFjaCgoaWQpID0+IHRoaXMudW5zdWJzY3JpYmVGcm9tKHRoaXMuc3Vic2NyaXB0aW9uc1twYXRoXVtpZF0pKVxuICAgICk7XG4gICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpXG4gICAgLmZvckVhY2goKHJvb20pID0+IE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW3Jvb21dKVxuICAgICAgLmZvckVhY2goKGlkKSA9PiB0aGlzLnVubGlzdGVuRnJvbSh0aGlzLmxpc3RlbmVyc1tyb29tXVtpZF0pKVxuICAgICk7XG4gICAgT2JqZWN0LmtleXModGhpcy5wZW5kaW5nKVxuICAgIC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdbcGF0aF0uY2FuY2VsKCk7XG4gICAgICBkZWxldGUgdGhpcy5wZW5kaW5nW3BhdGhdO1xuICAgIH0pO1xuICAgIHRoaXMuaW8uY2xvc2UoKTtcbiAgfVxuXG4gIGJpbmRJT0hhbmRsZXJzKCkge1xuICAgIE9iamVjdC5rZXlzKGlvSGFuZGxlcnMpXG4gICAgLmZvckVhY2goKGV2ZW50KSA9PiB0aGlzLmlvLm9uKGV2ZW50LCAocGFyYW1zKSA9PiBpb0hhbmRsZXJzW2V2ZW50XS5jYWxsKHRoaXMsIHBhcmFtcykpKTtcbiAgfVxuXG4gIHB1c2goZXZlbnQsIHBhcmFtcykge1xuICAgIHRoaXMuaW8uZW1pdChldmVudCwgcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1bGwocGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgbGV0IHsgYnlwYXNzQ2FjaGUgfSA9IG9wdHM7XG4gICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIGlmKCF0aGlzLnBlbmRpbmdbcGF0aF0gfHwgYnlwYXNzQ2FjaGUpIHtcbiAgICAgIHRoaXMucGVuZGluZ1twYXRoXSA9IHRoaXMuZmV0Y2gocGF0aCkuY2FuY2VsbGFibGUoKS50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBBcyBzb29uIGFzIHRoZSByZXN1bHQgaXMgcmVjZWl2ZWQsIHJlbW92ZWQgZnJvbSB0aGUgcGVuZGluZyBsaXN0LlxuICAgICAgICBkZWxldGUgdGhpcy5wZW5kaW5nW3BhdGhdO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgXy5kZXYoKCkgPT4gdGhpcy5wZW5kaW5nW3BhdGhdLnRoZW4uc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgIHJldHVybiB0aGlzLnBlbmRpbmdbcGF0aF07XG4gIH1cblxuICBmZXRjaChwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICByZXF1ZXN0KHsgbWV0aG9kOiAnR0VUJywgdXJsOiByZXNvbHZlKHRoaXMuaHR0cCwgcGF0aCksIGpzb246IHRydWUgfSwgKGVyciwgcmVzLCBib2R5KSA9PiBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoYm9keSkpXG4gICAgKTtcbiAgfVxuXG4gIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKSB7XG4gICAgXy5kZXYoKCkgPT4gYWN0aW9uLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICApO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcmVxdWVzdCh7IG1ldGhvZDogJ1BPU1QnLCB1cmw6IHJlc29sdmUodGhpcy5odHRwLCBwYXRoKSwganNvbjogdHJ1ZSwgYm9keTogXy5leHRlbmQoe30sIHBhcmFtcywgeyBndWlkOiB0aGlzLmd1aWQgfSkgfSwgKGVyciwgcmVzLCBib2R5KSA9PiBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoYm9keSkpXG4gICAgKTtcbiAgfVxuXG4gIF9yZW1vdGVTdWJzY3JpYmVUbyhwYXRoKSB7XG4gICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIHRoaXMuc3RvcmVbcGF0aF0gPSB7IHZhbHVlOiBudWxsLCBoYXNoOiBudWxsIH07XG4gICAgdGhpcy5pby5lbWl0KCdzdWJzY3JpYmVUbycsIHsgcGF0aCB9KTtcbiAgfVxuXG4gIF9yZW1vdGVVbnN1YnNjcmliZUZyb20ocGF0aCkge1xuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICB0aGlzLmlvLmVtaXQoJ3Vuc3Vic2NyaWJlRnJvbScsIHsgcGF0aCB9KTtcbiAgICBkZWxldGUgdGhpcy5zdG9yZVtwYXRoXTtcbiAgfVxuXG4gIHN1YnNjcmliZVRvKHBhdGgsIGhhbmRsZXIpIHtcbiAgICBfLmRldigoKSA9PiBwYXRoLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgaGFuZGxlci5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICk7XG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oeyBwYXRoLCBoYW5kbGVyIH0pO1xuICAgIGxldCBjcmVhdGVkUGF0aCA9IHN1YnNjcmlwdGlvbi5hZGRUbyh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgIGlmKGNyZWF0ZWRQYXRoKSB7XG4gICAgICB0aGlzLl9yZW1vdGVTdWJzY3JpYmVUbyhwYXRoKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3Vic2NyaXB0aW9uLCBjcmVhdGVkUGF0aCB9O1xuICB9XG5cbiAgdW5zdWJzY3JpYmVGcm9tKHN1YnNjcmlwdGlvbikge1xuICAgIF8uZGV2KCgpID0+IHN1YnNjcmlwdGlvbi5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihTdWJzY3JpcHRpb24pKTtcbiAgICBsZXQgZGVsZXRlZFBhdGggPSBzdWJzY3JpcHRpb24ucmVtb3ZlRnJvbSh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgIGlmKGRlbGV0ZWRQYXRoKSB7XG4gICAgICB0aGlzLl9yZW1vdGVVbnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uLnBhdGgpO1xuICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbcGF0aF07XG4gICAgfVxuICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgfVxuXG4gIHVwZGF0ZShwYXRoLCB2YWx1ZSkge1xuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAodmFsdWUgPT09IG51bGwgfHwgXy5pc09iamVjdCh2YWx1ZSkpLnNob3VsZC5iZS5va1xuICAgICk7XG4gICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF1ba2V5XS51cGRhdGUodmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3RlTGlzdGVuVG8ocm9vbSkge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICB0aGlzLmlvLmVtaXQoJ2xpc3RlblRvJywgeyByb29tIH0pO1xuICB9XG5cbiAgX3JlbW90ZVVubGlzdGVuRnJvbShyb29tKSB7XG4gICAgXy5kZXYoKCkgPT4gcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIHRoaXMuaW8uZW1pdCgndW5saXN0ZW5Gcm9tJywgeyByb29tIH0pO1xuICB9XG5cbiAgbGlzdGVuVG8ocm9vbSwgaGFuZGxlcikge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgKTtcbiAgICBsZXQgbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIoeyByb29tLCBoYW5kbGVyIH0pO1xuICAgIGxldCBjcmVhdGVkUm9vbSA9IGxpc3RlbmVyLmFkZFRvKHRoaXMubGlzdGVuZXJzKTtcbiAgICBpZihjcmVhdGVkUm9vbSkge1xuICAgICAgdGhpcy5fcmVtb3RlTGlzdGVuVG8ocm9vbSk7XG4gICAgfVxuICAgIHJldHVybiB7IGxpc3RlbmVyLCBjcmVhdGVkUm9vbSB9O1xuICB9XG5cbiAgdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSB7XG4gICAgXy5kZXYoKCkgPT4gbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoTGlzdGVuZXIpKTtcbiAgICBsZXQgZGVsZXRlZFJvb20gPSBzdWJzY3JpcHRpb24ucmVtb3ZlRnJvbSh0aGlzLmxpc3RlbmVycyk7XG4gICAgaWYoZGVsZXRlZFJvb20pIHtcbiAgICAgIHRoaXMuX3JlbW90ZVVubGlzdGVuRnJvbShsaXN0ZW5lci5yb29tKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgbGlzdGVuZXIsIGRlbGV0ZWRSb29tIH07XG4gIH1cblxuICBlbWl0KHJvb20sIHBhcmFtcykge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICk7XG4gICAgaWYodGhpcy5saXN0ZW5lcnNbcm9vbV0pIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW3Jvb21dKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5saXN0ZW5lcnNbcm9vbV1ba2V5XS5lbWl0KHBhcmFtcykpO1xuICAgIH1cbiAgfVxufVxuXG5fLmV4dGVuZChVcGxpbmsucHJvdG90eXBlLCB7XG4gIGd1aWQ6IG51bGwsXG4gIGhhbmRzaGFrZTogbnVsbCxcbiAgX2hhbmRzaGFrZTogbnVsbCxcbiAgaW86IG51bGwsXG4gIHBpZDogbnVsbCxcbiAgbGlzdGVuZXJzOiBudWxsLFxuICBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQ6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIHN0b3JlOiBudWxsLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXBsaW5rO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9