"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var url = require("url");
  var _ = require("lodash");
  var should = R.should;

  var request;
  if (R.isClient()) {
    request = require("browser-request");
  } else {
    request = require("request");
  }
  var co = require("co");

  var Uplink = (function () {
    var Uplink = function Uplink(httpEndpoint, socketEndpoint, guid, shouldReloadOnServerRestart) {
      this._httpEndpoint = httpEndpoint;
      this._socketEndPoint = socketEndpoint;
      this._guid = guid;
      if (R.isClient()) {
        this._initInClient();
      }
      if (R.isServer()) {
        this._initInServer();
      }
      this._data = {};
      this._hashes = {};
      this._performUpdateIfNecessary = R.scope(this._performUpdateIfNecessary, this);
      this._shouldFetchKey = R.scope(this._shouldFetchKey, this);
      this.fetch = R.scope(this.fetch, this);
      this.subscribeTo = R.scope(this.subscribeTo, this);
      this.unsubscribeFrom = R.scope(this.unsubscribeFrom, this);
      this.listenTo = R.scope(this.listenTo, this);
      this.unlistenFrom = R.scope(this.unlistenFrom, this);
      this.dispatch = R.scope(this.dispatch, this);
      this.shouldReloadOnServerRestart = shouldReloadOnServerRestart;
    };

    _classProps(Uplink, null, {
      _debugLog: {
        writable: true,
        value: function () {
          var args = arguments;
          _.dev(function () {
            console.log.apply(console, args);
          });
        }
      },
      _emit: {
        writable: true,
        value: function (name, params) {
          var _this = this;

          _.dev(function () {
            return _this._socket.should.be.ok && (null !== _this._socket).should.be.ok;
          });
          this._debugLog(">>> " + name, params);
          this._socket.emit(name, params);
        }
      },
      _initInClient: {
        writable: true,
        value: function () {
          var _this2 = this;

          _.dev(function () {
            return R.isClient().should.be.ok;
          });
          if (this._socketEndPoint) {
            var io;
            if (window.io && _.isFunction(window.io)) {
              io = window.io;
            } else {
              io = require("socket.io-client");
            }
            this._subscriptions = {};
            this._listeners = {};
            //Connect to uplink server-side. Trigger the uplink-server on io.on("connection")
            var socket = this._socket = io(this._socketEndPoint);
            //Prepare all event client-side, listening:
            socket.on("update", R.scope(this._handleUpdate, this));
            socket.on("event", R.scope(this._handleEvent, this));
            socket.on("disconnect", R.scope(this._handleDisconnect, this));
            socket.on("connect", R.scope(this._handleConnect, this));
            socket.on("handshake-ack", R.scope(this._handleHandshakeAck, this));
            socket.on("debug", R.scope(this._handleDebug, this));
            socket.on("log", R.scope(this._handleLog, this));
            socket.on("warn", R.scope(this._handleWarn, this));
            socket.on("err", R.scope(this._handleError, this));
            this.ready = new Promise(function (resolve, reject) {
              _this2._acknowledgeHandshake = resolve;
            });
            if (window.onbeforeunload) {
              var prevHandler = window.onbeforeunload;
              window.onbeforeunload = R.scope(this._handleUnload(prevHandler), this);
            } else {
              window.onbeforeunload = R.scope(this._handleUnload(null), this);
            }
          } else {
            this.ready = Promise.cast(true);
          }
        }
      },
      _initInServer: {
        writable: true,
        value: function () {
          _.dev(function () {
            return R.isServer().should.be.ok;
          });
          this.ready = Promise.cast(true);
        }
      },
      _handleUpdate: {
        writable: true,
        value: function (params) {
          var _this3 = this;

          this._debugLog("<<< update", params);
          _.dev(function () {
            return params.should.be.an.object && params.k.should.be.a.String && params.v.should.be.ok && params.d.should.be.an.Array && params.h.should.be.a.String;
          });
          var key = params.k;
          this._performUpdateIfNecessary(key, params)(function (err, val) {
            _.dev(function () {
              if (err) {
                throw R.Debug.extendError(err, "R.Uplink._handleUpdate(...): couldn't _performUpdateIfNecessary.");
              }
            });
            if (err) {
              return;
            }
            _this3._data[key] = val;
            _this3._hashes[key] = R.hash(JSON.stringify(val));
            if (_.has(_this3._subscriptions, key)) {
              Object.keys(_this3._subscriptions[key]).forEach(function (fn) {
                fn(key, val);
              });
            }
          });
        }
      },
      _shouldFetchKey: {
        writable: true,
        value: function (key, entry) {
          if (!_.has(this._data, key) || !_.has(this._hashes, key)) {
            return true;
          }
          if (this._hashes[key] !== entry.from) {
            return true;
          }
          return false;
        }
      },
      _performUpdateIfNecessary: {
        writable: true,
        value: function (key, entry) {
          var _this4 = this;

          return function (fn) {
            co(regeneratorRuntime.mark(function callee$4$0() {
              return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                while (1) switch (context$5$0.prev = context$5$0.next) {
                  case 0:

                    if (!this._shouldFetchKey(key, entry)) {
                      context$5$0.next = 6;
                      break;
                    }
                    context$5$0.next = 3;
                    return this.fetch(key);

                  case 3: return context$5$0.abrupt("return", context$5$0.sent);
                  case 6: return context$5$0.abrupt("return", R.patch(this._data[key], entry.diff));
                  case 7:
                  case "end": return context$5$0.stop();
                }
              }, callee$4$0, this);
            })).call(_this4, fn);
          };
        }
      },
      _handleEvent: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< event", params.eventName);
          var eventName = params.eventName;
          var eventParams = params.params;
          if (_.has(this._listeners, eventName)) {
            Object.keys(this._listeners[eventName]).forEach(function (fn) {
              fn(eventParams);
            });
          }
        }
      },
      _handleDisconnect: {
        writable: true,
        value: function (params) {
          var _this5 = this;

          this._debugLog("<<< disconnect", params);
          this.ready = new Promise(function (resolve, reject) {
            _this5._acknowledgeHandshake = resolve;
          });
        }
      },
      _handleConnect: {
        writable: true,
        value: function () {
          this._debugLog("<<< connect");
          //notify uplink-server
          this._emit("handshake", { guid: this._guid });
        }
      },
      _handleHandshakeAck: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< handshake-ack", params);
          if (this._pid && params.pid !== this._pid && this.shouldReloadOnServerRestart) {
            _.dev(function () {
              console.warn("Server pid has changed, reloading page.");
            });
            setTimeout(function () {
              window.location.reload(true);
            }, _.random(2000, 10000));
          }
          this._pid = params.pid;
          this._acknowledgeHandshake(params);
        }
      },
      _handleDebug: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< debug", params);
          _.dev(function () {
            console.warn("R.Uplink.debug(...):", params.debug);
          });
        }
      },
      _handleLog: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< log", params);
          console.log("R.Uplink.log(...):", params.log);
        }
      },
      _handleWarn: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< warn", params);
          console.warn("R.Uplink.warn(...):", params.warn);
        }
      },
      _handleError: {
        writable: true,
        value: function (params) {
          this._debugLog("<<< error", params);
          console.error("R.Uplink.err(...):", params.err);
        }
      },
      _handleUnload: {
        writable: true,
        value: function (prevHandler) {
          var _this6 = this;

          return function () {
            if (prevHandler) {
              prevHandler();
            }
            _this6._emit("unhandshake");
          };
        }
      },
      _destroyInClient: {
        writable: true,
        value: function () {
          if (this._socket) {
            this._socket.close();
          }
        }
      },
      _destroyInServer: {
        writable: true,
        value: function () {
          return void 0;
        }
      },
      _subscribeTo: {
        writable: true,
        value: function (key) {
          co(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0:
                  context$4$0.next = 2;
                  return this.ready;

                case 2: this._emit("subscribeTo", { key: key });
                case 3:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          })).call(this, R.Debug.rethrow("R.Uplink._subscribeTo(...): couldn't subscribe (" + key + ")"));
        }
      },
      _unsubscribeFrom: {
        writable: true,
        value: function (key) {
          co(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0:
                  context$4$0.next = 2;
                  return this.ready;

                case 2: this._emit("unsubscribeFrom", { key: key });
                case 3:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          })).call(this, R.Debug.rethrow("R.Uplink._subscribeTo(...): couldn't unsubscribe (" + key + ")"));
        }
      },
      subscribeTo: {
        writable: true,
        value: function (key, fn) {
          var subscription = new R.Uplink.Subscription(key);
          if (!_.has(this._subscriptions, key)) {
            this._subscribeTo(key);
            this._subscriptions[key] = {};
            this._data[key] = {};
            this._hashes[key] = R.hash(JSON.stringify({}));
          }
          this._subscriptions[key][subscription.uniqueId] = fn;
          return subscription;
        }
      },
      unsubscribeFrom: {
        writable: true,
        value: function (key, subscription) {
          var _this7 = this;

          _.dev(function () {
            return _this7._subscriptions.should.be.an.Object && _this7._subscriptions[key].should.be.ok && _this7._subscriptions[key].should.be.an.Object && _this7._subscriptions[key][subscription.uniqueId].should.be.ok && _this7._subscriptions[key][subscription.uniqueId].should.be.a.String;
          });
          delete this._subscriptions[key][subscription.uniqueId];
          if (_.size(this._subscriptions[key]) === 0) {
            delete this._subscriptions[key];
            delete this._data[key];
            delete this._hashes[key];
            this._unsubscribeFrom(key);
          }
        }
      },
      _listenTo: {
        writable: true,
        value: function (eventName) {
          co(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0:
                  context$4$0.next = 2;
                  return this.ready;

                case 2: this._emit("listenTo", { eventName: eventName });
                case 3:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          })).call(this, R.Debug.rethrow("R.Uplink._listenTo: couldn't listen (" + eventName + ")"));
        }
      },
      _unlistenFrom: {
        writable: true,
        value: function (eventName) {
          co(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0:
                  context$4$0.next = 2;
                  return this.ready;

                case 2: this._emit("unlistenFrom", { eventName: eventName });
                case 3:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          })).call(this, R.Debug.rethrow("R.Uplink._unlistenFrom: couldn't unlisten (" + eventName + ")"));
        }
      },
      listenTo: {
        writable: true,
        value: function (eventName, fn) {
          var listener = R.Uplink.Listener(eventName);
          if (!_.has(this._listeners, eventName)) {
            this._listenTo(eventName);
            this._listeners[eventName] = {};
          }
          this._listeners[eventName][listener.uniqueId] = fn;
          return listener;
        }
      },
      unlistenFrom: {
        writable: true,
        value: function (eventName, listener) {
          var _this8 = this;

          _.dev(function () {
            return _this8._listeners.should.be.an.Object && _this8._listeners[eventName].should.be.ok && _this8._listeners[eventName].should.be.an.Object && _this8._listeners[eventName][listener.uniqueId].should.be.ok && _this8._listeners[eventName][listener.uniqueId].should.be.a.String;
          });
          delete this._listeners[eventName];
          if (_.size(this._listeners[eventName]) === 0) {
            delete this._listeners[eventName];
            this._unlistenFrom(eventName);
          }
        }
      },
      _getFullUrl: {
        writable: true,
        value: function (suffix) {
          if (suffix.slice(0, 1) === "/" && this._httpEndpoint.slice(-1) === "/") {
            return this._httpEndpoint.slice(0, -1) + suffix;
          } else {
            return this._httpEndpoint + suffix;
          }
        }
      },
      fetch: {
        writable: true,
        value: function (key) {
          var _this9 = this;

          return new Promise(function (resolve, reject) {
            _this9._debugLog(">>> fetch", key);
            request({
              url: _this9._getFullUrl(key),
              method: "GET",
              json: true,
              withCredentials: false }, function (err, res, body) {
              if (err) {
                _.dev(function () {
                  console.warn("R.Uplink.fetch(...): couldn't fetch '" + key + "':", err.toString());
                });
                return resolve(null);
              } else {
                return resolve(body);
              }
            });
          });
        }
      },
      dispatch: {
        writable: true,
        value: function (action, params) {
          var _this10 = this;

          return new Promise(function (resolve, reject) {
            _this10._debugLog(">>> dispatch", action, params);
            request({
              url: _this10._getFullUrl(action),
              method: "POST",
              body: { guid: _this10._guid, params: params },
              json: true,
              withCredentials: false }, function (err, res, body) {
              if (err) {
                reject(err);
              } else {
                resolve(body);
              }
            });
          });
        }
      },
      destroy: {
        writable: true,
        value: function () {
          if (R.isClient()) {
            this._destroyInClient();
          }
          if (R.isServer()) {
            this._destroyInServer();
          }
        }
      }
    });

    return Uplink;
  })();

  _.extend(Uplink.prototype, /** @lends R.Uplink.prototype */{
    _httpEndpoint: null,
    _socketEndPoint: null,
    _subscriptions: null,
    _listeners: null,
    _socket: null,
    _guid: null,
    _pid: null,
    ready: null,
    shouldReloadOnServerRestart: null,
    _acknowledgeHandshake: null });

  _.extend(Uplink, {
    Subscription: function (key) {
      this.key = key;
      this.uniqueId = _.uniqueId("R.Uplink.Subscription");
    },
    Listener: function (eventName) {
      this.eventName = eventName;
      this.uniqueId = _.uniqueId("R.Uplink.Listener");
    } });

  return Uplink;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlVwbGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBRXhCLE1BQUksT0FBTyxDQUFDO0FBQ1osTUFBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDYixXQUFPLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7R0FDeEMsTUFDSTtBQUNELFdBQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDaEM7QUFDRCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O01Bc0NuQixNQUFNO1FBQU4sTUFBTSxHQVVHLFNBVlQsTUFBTSxDQVVJLFlBQVksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFDO0FBQ3hFLFVBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ2IsWUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO09BQ3hCO0FBQ0QsVUFBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDYixZQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7T0FDeEI7QUFD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QXFCLEVBQUUsSUFBSSxFQUM5QixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDYixnQkFBWSxFQUFBLFVBQUMsR0FBRyxFQUFFO0FBQ2QsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUN2RDtBQUNELFlBQVEsRUFBQSxVQUFDLFNBQVMsRUFBRTtBQUNoQixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixVQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUNuRCxFQUNKLENBQUMsQ0FBQzs7QUFFSCxTQUFPLE1BQU0sQ0FBQztDQUNqQixDQUFDIiwiZmlsZSI6IlIuVXBsaW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbiAgICBjb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG4gICAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG5cbiAgICBsZXQgcmVxdWVzdDtcbiAgICBpZihSLmlzQ2xpZW50KCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVpcmUoJ2Jyb3dzZXItcmVxdWVzdCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcbiAgICB9XG4gICAgY29uc3QgY28gPSByZXF1aXJlKCdjbycpO1xuXG4gICAgLyoqXG4gICAgICogPHA+VGhlIFVwbGluayBtaWNyby1wcm90b2NvbCBpcyBhIHNpbXBsZSBzZXQgb2YgY29udmVudGlvbnMgdG8gaW1wbGVtZW50IHJlYWwtdGltZSByZWFjdGl2ZSBGbHV4IG92ZXIgdGhlIHdpcmUuIDxiciAvPlxuICAgICAqIFRoZSBmcm9udGVuZCBhbmQgdGhlIGJhY2tlbmQgc2VydmVyIHNoYXJlIDIgbWVhbnMgb2YgY29tbXVuaWNhdGlvbnMgOiA8YnIgLz5cbiAgICAgKiAtIGEgV2ViU29ja2V0LWxpa2UgKHNvY2tldC5pbyB3cmFwcGVyKSBkdXBsZXggY29ubmVjdGlvbiB0byBoYW5kc2hha2UgYW5kIHN1YnNjcmliZSB0byBrZXlzL2xpc3RlbiB0byBldmVudHMgPGJyIC8+XG4gICAgICogLSByZWd1bGFycyBIVFRQIHJlcXVlc3RzIChmcm9udCAtPiBiYWNrKSB0byBhY3R1YWxseSBnZXQgZGF0YSBmcm9tIHRoZSBzdG9yZXM8L3A+XG4gICAgICogPHA+XG4gICAgICogUFJPVE9DT0w6IDxiciAvPlxuICAgICAqPGJyIC8+XG4gICAgICogQ29ubmVjdGlvbi9yZWNvbm5lY3Rpb246PGJyIC8+XG4gICAgICo8YnIgLz5cbiAgICAgKiBDbGllbnQ6IGJpbmQgc29ja2V0PGJyIC8+XG4gICAgICogU2VydmVyOiBBY2tub3dsZWRnZSBjb25uZWN0aW9uPGJyIC8+XG4gICAgICogQ2xpZW50OiBzZW5kIFwiaGFuZHNoYWtlXCIgeyBndWlkOiBndWlkIH08YnIgLz5cbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJoYW5kc2hha2UtYWNrXCIgeyByZWNvdmVyZWQ6IGJvb2wgfSAocmVjb3ZlciBwcmV2aW91cyBzZXNzaW9uIGlmIGV4aXN0aW5nIGJhc2VkIHVwb24gZ3VpZDsgcmVjb3ZlcmVkIGlzIHRydWUgaWZmIHByZXZpb3VzIHNlc3Npb24gZXhpc3RlZCk8YnIgLz48YnIgLz5cbiAgICAgKjxiciAvPlxuICAgICAqIFN0b3Jlczo8YnIgLz5cbiAgICAgKiBDbGllbnQ6IHNlbmQgXCJzdWJzY3JpYmVUb1wiIHsga2V5OiBrZXkgfTxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcInVwZGF0ZVwiIHsga2V5OiBrZXkgfTxiciAvPlxuICAgICAqIENsaWVudDogWEhSIEdFVCAvdXBsaW5rL2tleTxiciAvPlxuICAgICAqPGJyIC8+XG4gICAgICogRXZlbnRzOlxuICAgICAqIENsaWVudDogc2VuZCBcImxpc3RlblRvXCIgeyBldmVudE5hbWU6IGV2ZW50TmFtZSB9PGJyIC8+XG4gICAgICogU2VydmVyOiBzZW5kIFwiZXZlbnRcIiB7IGV2ZW50TmFtZTogZXZlbnROYW1lLCBwYXJhbXM6IHBhcmFtcyB9PGJyIC8+XG4gICAgICo8YnIgLz5cbiAgICAgKiBBY3Rpb25zOjxiciAvPlxuICAgICAqIENsaWVudDogWEhSIFBPU1QgL3VwbGluay9hY3Rpb24geyBwYXJhbXM6IHBhcmFtcyB9PGJyIC8+XG4gICAgICo8YnIgLz5cbiAgICAgKiBPdGhlciBub3RpZmljYXRpb25zOjxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcImRlYnVnXCI6IHsgZGVidWc6IGRlYnVnIH0gRGVidWctbGV2ZWwgbWVzc2FnZTxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcImxvZ1wiIHsgbG9nOiBsb2cgfSBMb2ctbGV2ZWwgbWVzc2FnZTxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcIndhcm5cIjogeyB3YXJuOiB3YXJuIH0gV2Fybi1sZXZlbCBtZXNzYWdlPGJyIC8+XG4gICAgICogU2VydmVyOiBzZW5kIFwiZXJyXCI6IHsgZXJyOiBlcnIgfSBFcnJvci1sZXZlbCBtZXNzYWdlPGJyIC8+XG4gICAgICogPC9wPlxuICAgICAqIEBjbGFzcyBSLlVwbGlua1xuICAgICAqL1xuXG4gICAgY2xhc3MgVXBsaW5rIHtcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gSW5pdGlhbGl6ZXMgdGhlIHVwbGluayBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGh0dHBFbmRwb2ludFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzb2NrZXRFbmRwb2ludFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBndWlkXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydFxuICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcihodHRwRW5kcG9pbnQsIHNvY2tldEVuZHBvaW50LCBndWlkLCBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQpe1xuICAgICAgICAgICAgdGhpcy5faHR0cEVuZHBvaW50ID0gaHR0cEVuZHBvaW50O1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0RW5kUG9pbnQgPSBzb2NrZXRFbmRwb2ludDtcbiAgICAgICAgICAgIHRoaXMuX2d1aWQgPSBndWlkO1xuICAgICAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdEluQ2xpZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0SW5TZXJ2ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX2hhc2hlcyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5ID0gUi5zY29wZSh0aGlzLl9wZXJmb3JtVXBkYXRlSWZOZWNlc3NhcnksIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fc2hvdWxkRmV0Y2hLZXkgPSBSLnNjb3BlKHRoaXMuX3Nob3VsZEZldGNoS2V5LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2ggPSBSLnNjb3BlKHRoaXMuZmV0Y2gsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVUbyA9IFIuc2NvcGUodGhpcy5zdWJzY3JpYmVUbywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlRnJvbSA9IFIuc2NvcGUodGhpcy51bnN1YnNjcmliZUZyb20sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5UbyA9IFIuc2NvcGUodGhpcy5saXN0ZW5UbywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnVubGlzdGVuRnJvbSA9IFIuc2NvcGUodGhpcy51bmxpc3RlbkZyb20sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaCA9IFIuc2NvcGUodGhpcy5kaXNwYXRjaCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydCA9IHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kZWJ1Z0xvZygpIHtcbiAgICAgICAgICAgIGxldCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5FbWl0cyBhIHNvY2tldCBzaWduYWwgdG8gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHNpZ25hbFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgVGhlIHNwZWNpZmljcyBwYXJhbXMgdG8gc2VuZFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9lbWl0KG5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc29ja2V0LnNob3VsZC5iZS5vayAmJiAobnVsbCAhPT0gdGhpcy5fc29ja2V0KS5zaG91bGQuYmUub2spO1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJz4+PiAnICsgbmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KG5hbWUsIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gQ3JlYXRpbmcgaW8gY29ubmVjdGlvbiBjbGllbnQtc2lkZSBpbiBvcmRlciB0byB1c2Ugc29ja2V0cyA8L3A+XG4gICAgICAgICogQG1ldGhvZCBfaW5pdEluQ2xpZW50XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2luaXRJbkNsaWVudCgpIHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IFIuaXNDbGllbnQoKS5zaG91bGQuYmUub2spO1xuICAgICAgICAgICAgaWYodGhpcy5fc29ja2V0RW5kUG9pbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW87XG4gICAgICAgICAgICAgICAgaWYod2luZG93LmlvICYmIF8uaXNGdW5jdGlvbih3aW5kb3cuaW8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlvID0gd2luZG93LmlvO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8tY2xpZW50Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgICAgICAgICAvL0Nvbm5lY3QgdG8gdXBsaW5rIHNlcnZlci1zaWRlLiBUcmlnZ2VyIHRoZSB1cGxpbmstc2VydmVyIG9uIGlvLm9uKFwiY29ubmVjdGlvblwiKVxuICAgICAgICAgICAgICAgIGxldCBzb2NrZXQgPSB0aGlzLl9zb2NrZXQgPSBpbyh0aGlzLl9zb2NrZXRFbmRQb2ludCk7XG4gICAgICAgICAgICAgICAgLy9QcmVwYXJlIGFsbCBldmVudCBjbGllbnQtc2lkZSwgbGlzdGVuaW5nOlxuICAgICAgICAgICAgICAgIHNvY2tldC5vbigndXBkYXRlJywgUi5zY29wZSh0aGlzLl9oYW5kbGVVcGRhdGUsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ2V2ZW50JywgUi5zY29wZSh0aGlzLl9oYW5kbGVFdmVudCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIFIuc2NvcGUodGhpcy5faGFuZGxlRGlzY29ubmVjdCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbignY29ubmVjdCcsIFIuc2NvcGUodGhpcy5faGFuZGxlQ29ubmVjdCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbignaGFuZHNoYWtlLWFjaycsIFIuc2NvcGUodGhpcy5faGFuZGxlSGFuZHNoYWtlQWNrLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdkZWJ1ZycsIFIuc2NvcGUodGhpcy5faGFuZGxlRGVidWcsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ2xvZycsIFIuc2NvcGUodGhpcy5faGFuZGxlTG9nLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCd3YXJuJywgUi5zY29wZSh0aGlzLl9oYW5kbGVXYXJuLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdlcnInLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUVycm9yLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNrbm93bGVkZ2VIYW5kc2hha2UgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5vbmJlZm9yZXVubG9hZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJldkhhbmRsZXIgPSB3aW5kb3cub25iZWZvcmV1bmxvYWQ7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IFIuc2NvcGUodGhpcy5faGFuZGxlVW5sb2FkKHByZXZIYW5kbGVyKSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBSLnNjb3BlKHRoaXMuX2hhbmRsZVVubG9hZChudWxsKSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UuY2FzdCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5TZXJ2ZXItc2lkZTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9pbml0SW5TZXJ2ZXJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaW5pdEluU2VydmVyKCkge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gUi5pc1NlcnZlcigpLnNob3VsZC5iZS5vayk7XG4gICAgICAgICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5jYXN0KHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPlRyaWdnZXJlZCB3aGVuIGEgZGF0YSBpcyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWMga2V5IDxiciAvPlxuICAgICAgICAqIENhbGwgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBrZXkgPC9wPlxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZVVwZGF0ZVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgVGhlIHNwZWNpZmljIGtleVxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVVcGRhdGUocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IHVwZGF0ZScsIHBhcmFtcyk7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBcbiAgICAgICAgICAgICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLm9iamVjdCAmJlxuICAgICAgICAgICAgICAgIHBhcmFtcy5rLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgICAgIHBhcmFtcy52LnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgICAgIHBhcmFtcy5kLnNob3VsZC5iZS5hbi5BcnJheSAmJlxuICAgICAgICAgICAgICAgIHBhcmFtcy5oLnNob3VsZC5iZS5hLlN0cmluZ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBrZXkgPSBwYXJhbXMuaztcbiAgICAgICAgICAgIHRoaXMuX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeShrZXksIHBhcmFtcykoKGVyciwgdmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgIF8uZGV2KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgJ1IuVXBsaW5rLl9oYW5kbGVVcGRhdGUoLi4uKTogY291bGRuXFwndCBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5LicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNoZXNba2V5XSA9IFIuaGFzaChKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICAgICAgICAgICAgICBpZihfLmhhcyh0aGlzLl9zdWJzY3JpcHRpb25zLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSkuZm9yRWFjaCgoZm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKGtleSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICogQG1ldGhvZCBfc2hvdWxkRmV0Y2hLZXlcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5XG4gICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gYm9vbCBUaGUgYm9vbGVhblxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9zaG91bGRGZXRjaEtleShrZXksIGVudHJ5KSB7XG4gICAgICAgICAgICBpZighXy5oYXModGhpcy5fZGF0YSwga2V5KSB8fCAhXy5oYXModGhpcy5faGFzaGVzLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLl9oYXNoZXNba2V5XSAhPT0gZW50cnkuZnJvbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+RGV0ZXJtaW5lcyBpZiB0aGUgdGhlIGRhdGEgbXVzdCBiZSBmZXRjaGVkPC9wPlxuICAgICAgICAqIEBtZXRob2QgX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeVxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW50cnlcbiAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm4gVGhlIEZ1bmN0aW9uIHRvIGNhbGxcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5KGtleSwgZW50cnkpIHtcbiAgICAgICAgICAgIHJldHVybiAoZm4pID0+IHtcbiAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nob3VsZEZldGNoS2V5KGtleSwgZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5mZXRjaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFIucGF0Y2godGhpcy5fZGF0YVtrZXldLCBlbnRyeS5kaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUV2ZW50XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVFdmVudChwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgZXZlbnQnLCBwYXJhbXMuZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBwYXJhbXMuZXZlbnROYW1lO1xuICAgICAgICAgICAgbGV0IGV2ZW50UGFyYW1zID0gcGFyYW1zLnBhcmFtcztcbiAgICAgICAgICAgIGlmKF8uaGFzKHRoaXMuX2xpc3RlbmVycywgZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKS5mb3JFYWNoKChmbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmbihldmVudFBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVEaXNjb25uZWN0XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVEaXNjb25uZWN0KHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBkaXNjb25uZWN0JywgcGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNrbm93bGVkZ2VIYW5kc2hha2UgPSByZXNvbHZlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5PY2N1cnMgYWZ0ZXIgYSBjb25uZWN0aW9uLiBXaGVuIGEgY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZCwgdGhlIGNsaWVudCBzZW5kcyBhIHNpZ25hbCBcImhhbmRzaGFrZVwiLjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVEaXNjb25uZWN0XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZUNvbm5lY3QoKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGNvbm5lY3QnKTtcbiAgICAgICAgICAgIC8vbm90aWZ5IHVwbGluay1zZXJ2ZXJcbiAgICAgICAgICAgIHRoaXMuX2VtaXQoJ2hhbmRzaGFrZScsIHsgZ3VpZDogdGhpcy5fZ3VpZCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPiBJZGVudGlmaWVzIGlmIHRoZSBwaWQgb2YgdGhlIHNlcnZlciBoYXMgY2hhbmdlZCAoZHVlIHRvIGEgcG90ZW50aWFsIHJlYm9vdCBzZXJ2ZXItc2lkZSkgc2luY2UgdGhlIGxhc3QgY2xpZW50IGNvbm5lY3Rpb24uIDxiciAvPlxuICAgICAgICAqIElmIHRoaXMgaXMgdGhlIGNhc2UsIGEgcGFnZSByZWxvYWQgaXMgcGVyZm9ybWVkPHA+XG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlSGFuZHNoYWtlQWNrXG4gICAgICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaGFuZGxlSGFuZHNoYWtlQWNrKHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBoYW5kc2hha2UtYWNrJywgcGFyYW1zKTtcbiAgICAgICAgICAgIGlmKHRoaXMuX3BpZCAmJiBwYXJhbXMucGlkICE9PSB0aGlzLl9waWQgJiYgdGhpcy5zaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBfLmRldigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignU2VydmVyIHBpZCBoYXMgY2hhbmdlZCwgcmVsb2FkaW5nIHBhZ2UuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSwgXy5yYW5kb20oMjAwMCwgMTAwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BpZCA9IHBhcmFtcy5waWQ7XG4gICAgICAgICAgICB0aGlzLl9hY2tub3dsZWRnZUhhbmRzaGFrZShwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRGVidWdcbiAgICAgICAgKiBAcGFyYW1zIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVEZWJ1ZyhwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgZGVidWcnLCBwYXJhbXMpO1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5VcGxpbmsuZGVidWcoLi4uKTonLCBwYXJhbXMuZGVidWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVMb2dcbiAgICAgICAgKiBAcGFyYW1zIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVMb2cocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGxvZycsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUi5VcGxpbmsubG9nKC4uLik6JywgcGFyYW1zLmxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVXYXJuXG4gICAgICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaGFuZGxlV2FybihwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgd2FybicsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1IuVXBsaW5rLndhcm4oLi4uKTonLCBwYXJhbXMud2Fybik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVFcnJvclxuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZUVycm9yKHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBlcnJvcicsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSLlVwbGluay5lcnIoLi4uKTonLCBwYXJhbXMuZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPk9jY3VycyB3aGVuIGEgY2xpZW50IHVubG9hZHMgdGhlIGRvY3VtZW50PC9wPlxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZVVubG9hZFxuICAgICAgICAqIEBwYXJhbXMge0Z1bmN0aW9ufSBwcmV2SGFuZGxlciBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBwYWdlIHdpbGwgYmUgdW5sb2FkZWRcbiAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZnVuY3Rpb25cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaGFuZGxlVW5sb2FkKHByZXZIYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHByZXZIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoJ3VuaGFuZHNoYWtlJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+U2ltcGx5IGNsb3NlcyB0aGUgc29ja2V0PC9wPlxuICAgICAgICAqIEBtZXRob2QgX2Rlc3Ryb3lJbkNsaWVudFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9kZXN0cm95SW5DbGllbnQoKSB7XG4gICAgICAgICAgICBpZih0aGlzLl9zb2NrZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5Eb2VzIG5vdGhpbmc8L3A+XG4gICAgICAgICogQG1ldGhvZCBfZGVzdHJveUluQ2xpZW50XG4gICAgICAgICogQHJldHVybiB7Kn0gdm9pZDBcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfZGVzdHJveUluU2VydmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPk5vdGlmaWVzIHRoZSB1cGxpbmstc2VydmVyIHRoYXQgYSBzdWJzY3JpcHRpb24gaXMgcmVxdWlyZWQgYnkgY2xpZW50PC9wPlxuICAgICAgICAqIEBtZXRob2QgX3N1YnNjcmliZVRvXG4gICAgICAgICogQHJldHVybiB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBzdWJzY3JpYmVcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfc3Vic2NyaWJlVG8oa2V5KSB7XG4gICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0KCdzdWJzY3JpYmVUbycsIHsga2V5OiBrZXkgfSk7XG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdygnUi5VcGxpbmsuX3N1YnNjcmliZVRvKC4uLik6IGNvdWxkblxcJ3Qgc3Vic2NyaWJlICgnICsga2V5ICsgJyknKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5Ob3RpZmllcyB0aGUgdXBsaW5rLXNlcnZlciB0aGF0IGEgc3Vic2NyaXB0aW9uIGlzIG92ZXI8L3A+XG4gICAgICAgICogQG1ldGhvZCBfc3Vic2NyaWJlVG9cbiAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHVuc3Vic2NyaWJlXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX3Vuc3Vic2NyaWJlRnJvbShrZXkpIHtcbiAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnJlYWR5O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoJ3Vuc3Vic2NyaWJlRnJvbScsIHsga2V5OiBrZXkgfSk7XG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdygnUi5VcGxpbmsuX3N1YnNjcmliZVRvKC4uLik6IGNvdWxkblxcJ3QgdW5zdWJzY3JpYmUgKCcgKyBrZXkgKyAnKScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkV0YWJsaXNoZXMgYSBzdWJzY3JpcHRpb24gdG8gYSBrZXksIGFuZCBjYWxsIHRoZSBzcGVjaWZpZWQgZnVuY3Rpb24gd2hlbiBfaGFuZGxlVXBkYXRlIG9jY3VyczwvcD5cbiAgICAgICAgKiBAbWV0aG9kIHN1YnNjcmliZVRvXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHN1YnNjcmliZVxuICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBzdWJzY3JpcHRpb24gVGhlIGNyZWF0ZWQgc3Vic2NyaXB0aW9uXG4gICAgICAgICovXG4gICAgICAgIHN1YnNjcmliZVRvKGtleSwgZm4pIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgUi5VcGxpbmsuU3Vic2NyaXB0aW9uKGtleSk7XG4gICAgICAgICAgICBpZighXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZVRvKGtleSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0ge307XG4gICAgICAgICAgICAgICAgdGhpcy5faGFzaGVzW2tleV0gPSBSLmhhc2goSlNPTi5zdHJpbmdpZnkoe30pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdID0gZm47XG4gICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+UmVtb3ZlcyBhIHN1YnNjcmlwdGlvbiB0byBhIGtleTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIHN1YnNjcmliZVRvXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHN1YnNjcmliZVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpcHRpb25cbiAgICAgICAgKi9cbiAgICAgICAgdW5zdWJzY3JpYmVGcm9tKGtleSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV0uc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXS5zaG91bGQuYmUuYS5TdHJpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF07XG4gICAgICAgICAgICBpZihfLnNpemUodGhpcy5fc3Vic2NyaXB0aW9uc1trZXldKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5faGFzaGVzW2tleV07XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmVGcm9tKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5TZW5kcyB0aGUgbGlzdGVuZXIgc2lnbmFsIFwibGlzdGVuVG9cIjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9saXN0ZW5Ub1xuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZSB0byBsaXN0ZW5cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfbGlzdGVuVG8oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0KCdsaXN0ZW5UbycsIHsgZXZlbnROYW1lOiBldmVudE5hbWUgfSk7XG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdygnUi5VcGxpbmsuX2xpc3RlblRvOiBjb3VsZG5cXCd0IGxpc3RlbiAoJyArIGV2ZW50TmFtZSArICcpJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgIC8qKlxuICAgICAgICAqIDxwPlNlbmRzIHRoZSB1bmxpc3RlbmVyIHNpZ25hbCBcInVubGlzdGVuRnJvbVwiPC9wPlxuICAgICAgICAqIEBtZXRob2QgX3VubGlzdGVuRnJvbVxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZSB0byBsaXN0ZW5cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMucmVhZHk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdCgndW5saXN0ZW5Gcm9tJywgeyBldmVudE5hbWU6IGV2ZW50TmFtZSB9KTtcbiAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fdW5saXN0ZW5Gcm9tOiBjb3VsZG5cXCd0IHVubGlzdGVuICgnICsgZXZlbnROYW1lICsgJyknKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5DcmVhdGUgYSBsaXN0ZW5lciBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpYyBuYW1lPC9wPlxuICAgICAgICAqIEBtZXRob2QgbGlzdGVuVG9cbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gbGlzdGVuXG4gICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0cmlnZ2VyZWRcbiAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IGxpc3RlbmVyIFRoZSBjcmVhdGVkIGxpc3RlbmVyXG4gICAgICAgICovXG4gICAgICAgIGxpc3RlblRvKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IFIuVXBsaW5rLkxpc3RlbmVyKGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZighXy5oYXModGhpcy5fbGlzdGVuZXJzLCBldmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuVG8oZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV1bbGlzdGVuZXIudW5pcXVlSWRdID0gZm47XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZW1vdmUgYSBsaXN0ZW5lciA8L3A+XG4gICAgICAgICogQG1ldGhvZCB1bmxpc3RlbkZyb21cbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gcmVtb3ZlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGxpc3RlbmVyXG4gICAgICAgICovXG4gICAgICAgIHVubGlzdGVuRnJvbShldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnNob3VsZC5iZS5hbi5PYmplY3QgJiYgXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV1bbGlzdGVuZXIudW5pcXVlSWRdLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdW2xpc3RlbmVyLnVuaXF1ZUlkXS5zaG91bGQuYmUuYS5TdHJpbmdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICBpZihfLnNpemUodGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VubGlzdGVuRnJvbShldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAqIEBtZXRob2QgX2dldEZ1bGxVcmxcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3VmZml4XG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGxpc3RlbmVyXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2dldEZ1bGxVcmwoc3VmZml4KSB7XG4gICAgICAgICAgICBpZihzdWZmaXguc2xpY2UoMCwgMSkgPT09ICcvJyAmJiB0aGlzLl9odHRwRW5kcG9pbnQuc2xpY2UoLTEpID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKDAsIC0xKSArIHN1ZmZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9odHRwRW5kcG9pbnQgKyBzdWZmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5GZXRjaCBkYXRhIGJ5IEdFVCByZXF1ZXN0IGZyb20gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4gICAgICAgICogQG1ldGhvZCBmZXRjaFxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBmZXRjaFxuICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gb2JqZWN0IEZldGNoZWQgZGF0YSBhY2NvcmRpbmcgdG8gdGhlIGtleVxuICAgICAgICAqL1xuICAgICAgICBmZXRjaChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJz4+PiBmZXRjaCcsIGtleSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5fZ2V0RnVsbFVybChrZXkpLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5VcGxpbmsuZmV0Y2goLi4uKTogY291bGRuXFwndCBmZXRjaCBcXCcnICsga2V5ICsgJ1xcJzonLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoYm9keSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+RGlzcGF0Y2hlcyBhbiBhY3Rpb24gYnkgUE9TVCByZXF1ZXN0IGZyb20gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4gICAgICAgICogQG1ldGhvZCBkaXNwYXRjaFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIHNwZWNpZmljIGFjdGlvbiB0byBkaXNwYXRjaFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IG9iamVjdCBGZXRjaGVkIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgYWN0aW9uXG4gICAgICAgICovXG4gICAgICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKCc+Pj4gZGlzcGF0Y2gnLCBhY3Rpb24sIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5fZ2V0RnVsbFVybChhY3Rpb24pLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogeyBndWlkOiB0aGlzLl9ndWlkLCBwYXJhbXM6IHBhcmFtcyB9LFxuICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJvZHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkRlc3Ryb3kgc29ja2V0IGNsaWVudC1zaWRlPC9wPlxuICAgICAgICAqIEBtZXRob2QgZGVzdHJveVxuICAgICAgICAqL1xuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveUluQ2xpZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXN0cm95SW5TZXJ2ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKFVwbGluay5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUi5VcGxpbmsucHJvdG90eXBlICovIHtcbiAgICAgICAgX2h0dHBFbmRwb2ludDogbnVsbCxcbiAgICAgICAgX3NvY2tldEVuZFBvaW50OiBudWxsLFxuICAgICAgICBfc3Vic2NyaXB0aW9uczogbnVsbCxcbiAgICAgICAgX2xpc3RlbmVyczogbnVsbCxcbiAgICAgICAgX3NvY2tldDogbnVsbCxcbiAgICAgICAgX2d1aWQ6IG51bGwsXG4gICAgICAgIF9waWQ6IG51bGwsXG4gICAgICAgIHJlYWR5OiBudWxsLFxuICAgICAgICBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQ6IG51bGwsXG4gICAgICAgIF9hY2tub3dsZWRnZUhhbmRzaGFrZTogbnVsbCxcbiAgICB9KTtcblxuICAgIF8uZXh0ZW5kKFVwbGluaywge1xuICAgICAgICBTdWJzY3JpcHRpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdSLlVwbGluay5TdWJzY3JpcHRpb24nKTtcbiAgICAgICAgfSxcbiAgICAgICAgTGlzdGVuZXIoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdSLlVwbGluay5MaXN0ZW5lcicpO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFVwbGluaztcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=