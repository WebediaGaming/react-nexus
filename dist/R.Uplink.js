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
                while (1) switch (context$5$0.prev = context$5$0.next) {case 0:

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
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
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
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
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
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
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
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlVwbGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBRXhCLE1BQUksT0FBTyxDQUFDO0FBQ1osTUFBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDYixXQUFPLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7R0FDeEMsTUFDSTtBQUNELFdBQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDaEM7QUFDRCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O01Bc0NuQixNQUFNO1FBQU4sTUFBTSxHQVVHLFNBVlQsTUFBTSxDQVVJLFlBQVksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFDO0FBQ3hFLFVBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ2IsWUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO09BQ3hCO0FBQ0QsVUFBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDYixZQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7T0FDeEI7QUFD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QUFFLElBQUksRUFDOUIsQ0FBQyxDQUFDOztBQUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2IsZ0JBQVksRUFBQSxVQUFDLEdBQUcsRUFBRTtBQUNkLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDdkQ7QUFDRCxZQUFRLEVBQUEsVUFBQyxTQUFTLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsVUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDbkQsRUFDSixDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDakIsQ0FBQyIsImZpbGUiOiJSLlVwbGluay5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XHJcbiAgICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKTtcclxuICAgIGNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcclxuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG5cclxuICAgIGxldCByZXF1ZXN0O1xyXG4gICAgaWYoUi5pc0NsaWVudCgpKSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVpcmUoJ2Jyb3dzZXItcmVxdWVzdCcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvID0gcmVxdWlyZSgnY28nKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIDxwPlRoZSBVcGxpbmsgbWljcm8tcHJvdG9jb2wgaXMgYSBzaW1wbGUgc2V0IG9mIGNvbnZlbnRpb25zIHRvIGltcGxlbWVudCByZWFsLXRpbWUgcmVhY3RpdmUgRmx1eCBvdmVyIHRoZSB3aXJlLiA8YnIgLz5cclxuICAgICAqIFRoZSBmcm9udGVuZCBhbmQgdGhlIGJhY2tlbmQgc2VydmVyIHNoYXJlIDIgbWVhbnMgb2YgY29tbXVuaWNhdGlvbnMgOiA8YnIgLz5cclxuICAgICAqIC0gYSBXZWJTb2NrZXQtbGlrZSAoc29ja2V0LmlvIHdyYXBwZXIpIGR1cGxleCBjb25uZWN0aW9uIHRvIGhhbmRzaGFrZSBhbmQgc3Vic2NyaWJlIHRvIGtleXMvbGlzdGVuIHRvIGV2ZW50cyA8YnIgLz5cclxuICAgICAqIC0gcmVndWxhcnMgSFRUUCByZXF1ZXN0cyAoZnJvbnQgLT4gYmFjaykgdG8gYWN0dWFsbHkgZ2V0IGRhdGEgZnJvbSB0aGUgc3RvcmVzPC9wPlxyXG4gICAgICogPHA+XHJcbiAgICAgKiBQUk9UT0NPTDogPGJyIC8+XHJcbiAgICAgKjxiciAvPlxyXG4gICAgICogQ29ubmVjdGlvbi9yZWNvbm5lY3Rpb246PGJyIC8+XHJcbiAgICAgKjxiciAvPlxyXG4gICAgICogQ2xpZW50OiBiaW5kIHNvY2tldDxiciAvPlxyXG4gICAgICogU2VydmVyOiBBY2tub3dsZWRnZSBjb25uZWN0aW9uPGJyIC8+XHJcbiAgICAgKiBDbGllbnQ6IHNlbmQgXCJoYW5kc2hha2VcIiB7IGd1aWQ6IGd1aWQgfTxiciAvPlxyXG4gICAgICogU2VydmVyOiBzZW5kIFwiaGFuZHNoYWtlLWFja1wiIHsgcmVjb3ZlcmVkOiBib29sIH0gKHJlY292ZXIgcHJldmlvdXMgc2Vzc2lvbiBpZiBleGlzdGluZyBiYXNlZCB1cG9uIGd1aWQ7IHJlY292ZXJlZCBpcyB0cnVlIGlmZiBwcmV2aW91cyBzZXNzaW9uIGV4aXN0ZWQpPGJyIC8+PGJyIC8+XHJcbiAgICAgKjxiciAvPlxyXG4gICAgICogU3RvcmVzOjxiciAvPlxyXG4gICAgICogQ2xpZW50OiBzZW5kIFwic3Vic2NyaWJlVG9cIiB7IGtleToga2V5IH08YnIgLz5cclxuICAgICAqIFNlcnZlcjogc2VuZCBcInVwZGF0ZVwiIHsga2V5OiBrZXkgfTxiciAvPlxyXG4gICAgICogQ2xpZW50OiBYSFIgR0VUIC91cGxpbmsva2V5PGJyIC8+XHJcbiAgICAgKjxiciAvPlxyXG4gICAgICogRXZlbnRzOlxyXG4gICAgICogQ2xpZW50OiBzZW5kIFwibGlzdGVuVG9cIiB7IGV2ZW50TmFtZTogZXZlbnROYW1lIH08YnIgLz5cclxuICAgICAqIFNlcnZlcjogc2VuZCBcImV2ZW50XCIgeyBldmVudE5hbWU6IGV2ZW50TmFtZSwgcGFyYW1zOiBwYXJhbXMgfTxiciAvPlxyXG4gICAgICo8YnIgLz5cclxuICAgICAqIEFjdGlvbnM6PGJyIC8+XHJcbiAgICAgKiBDbGllbnQ6IFhIUiBQT1NUIC91cGxpbmsvYWN0aW9uIHsgcGFyYW1zOiBwYXJhbXMgfTxiciAvPlxyXG4gICAgICo8YnIgLz5cclxuICAgICAqIE90aGVyIG5vdGlmaWNhdGlvbnM6PGJyIC8+XHJcbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJkZWJ1Z1wiOiB7IGRlYnVnOiBkZWJ1ZyB9IERlYnVnLWxldmVsIG1lc3NhZ2U8YnIgLz5cclxuICAgICAqIFNlcnZlcjogc2VuZCBcImxvZ1wiIHsgbG9nOiBsb2cgfSBMb2ctbGV2ZWwgbWVzc2FnZTxiciAvPlxyXG4gICAgICogU2VydmVyOiBzZW5kIFwid2FyblwiOiB7IHdhcm46IHdhcm4gfSBXYXJuLWxldmVsIG1lc3NhZ2U8YnIgLz5cclxuICAgICAqIFNlcnZlcjogc2VuZCBcImVyclwiOiB7IGVycjogZXJyIH0gRXJyb3ItbGV2ZWwgbWVzc2FnZTxiciAvPlxyXG4gICAgICogPC9wPlxyXG4gICAgICogQGNsYXNzIFIuVXBsaW5rXHJcbiAgICAgKi9cclxuXHJcbiAgICBjbGFzcyBVcGxpbmsge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPiBJbml0aWFsaXplcyB0aGUgdXBsaW5rIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWNhdGlvbnMgcHJvdmlkZWQgPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGh0dHBFbmRwb2ludFxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNvY2tldEVuZHBvaW50XHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZ3VpZFxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydFxyXG4gICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoaHR0cEVuZHBvaW50LCBzb2NrZXRFbmRwb2ludCwgZ3VpZCwgc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0KXtcclxuICAgICAgICAgICAgdGhpcy5faHR0cEVuZHBvaW50ID0gaHR0cEVuZHBvaW50O1xyXG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRFbmRQb2ludCA9IHNvY2tldEVuZHBvaW50O1xyXG4gICAgICAgICAgICB0aGlzLl9ndWlkID0gZ3VpZDtcclxuICAgICAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0SW5DbGllbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRJblNlcnZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5faGFzaGVzID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeSA9IFIuc2NvcGUodGhpcy5fcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5LCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fc2hvdWxkRmV0Y2hLZXkgPSBSLnNjb3BlKHRoaXMuX3Nob3VsZEZldGNoS2V5LCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5mZXRjaCA9IFIuc2NvcGUodGhpcy5mZXRjaCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlVG8gPSBSLnNjb3BlKHRoaXMuc3Vic2NyaWJlVG8sIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlRnJvbSA9IFIuc2NvcGUodGhpcy51bnN1YnNjcmliZUZyb20sIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvID0gUi5zY29wZSh0aGlzLmxpc3RlblRvLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy51bmxpc3RlbkZyb20gPSBSLnNjb3BlKHRoaXMudW5saXN0ZW5Gcm9tLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaCA9IFIuc2NvcGUodGhpcy5kaXNwYXRjaCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0ID0gc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2RlYnVnTG9nKCkge1xyXG4gICAgICAgICAgICBsZXQgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD5FbWl0cyBhIHNvY2tldCBzaWduYWwgdG8gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc2lnbmFsXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFRoZSBzcGVjaWZpY3MgcGFyYW1zIHRvIHNlbmRcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfZW1pdChuYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5fc29ja2V0LnNob3VsZC5iZS5vayAmJiAobnVsbCAhPT0gdGhpcy5fc29ja2V0KS5zaG91bGQuYmUub2spO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPj4+ICcgKyBuYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChuYW1lLCBwYXJhbXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD4gQ3JlYXRpbmcgaW8gY29ubmVjdGlvbiBjbGllbnQtc2lkZSBpbiBvcmRlciB0byB1c2Ugc29ja2V0cyA8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIF9pbml0SW5DbGllbnRcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaW5pdEluQ2xpZW50KCkge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBSLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICAgICAgaWYodGhpcy5fc29ja2V0RW5kUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbztcclxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5pbyAmJiBfLmlzRnVuY3Rpb24od2luZG93LmlvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlvID0gd2luZG93LmlvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW8gPSByZXF1aXJlKCdzb2NrZXQuaW8tY2xpZW50Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICAgICAgICAgIC8vQ29ubmVjdCB0byB1cGxpbmsgc2VydmVyLXNpZGUuIFRyaWdnZXIgdGhlIHVwbGluay1zZXJ2ZXIgb24gaW8ub24oXCJjb25uZWN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICBsZXQgc29ja2V0ID0gdGhpcy5fc29ja2V0ID0gaW8odGhpcy5fc29ja2V0RW5kUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgLy9QcmVwYXJlIGFsbCBldmVudCBjbGllbnQtc2lkZSwgbGlzdGVuaW5nOlxyXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCd1cGRhdGUnLCBSLnNjb3BlKHRoaXMuX2hhbmRsZVVwZGF0ZSwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdldmVudCcsIFIuc2NvcGUodGhpcy5faGFuZGxlRXZlbnQsIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignZGlzY29ubmVjdCcsIFIuc2NvcGUodGhpcy5faGFuZGxlRGlzY29ubmVjdCwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0JywgUi5zY29wZSh0aGlzLl9oYW5kbGVDb25uZWN0LCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oJ2hhbmRzaGFrZS1hY2snLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUhhbmRzaGFrZUFjaywgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdkZWJ1ZycsIFIuc2NvcGUodGhpcy5faGFuZGxlRGVidWcsIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignbG9nJywgUi5zY29wZSh0aGlzLl9oYW5kbGVMb2csIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHNvY2tldC5vbignd2FybicsIFIuc2NvcGUodGhpcy5faGFuZGxlV2FybiwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKCdlcnInLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUVycm9yLCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYod2luZG93Lm9uYmVmb3JldW5sb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZIYW5kbGVyID0gd2luZG93Lm9uYmVmb3JldW5sb2FkO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IFIuc2NvcGUodGhpcy5faGFuZGxlVW5sb2FkKHByZXZIYW5kbGVyKSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBSLnNjb3BlKHRoaXMuX2hhbmRsZVVubG9hZChudWxsKSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5jYXN0KHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+U2VydmVyLXNpZGU8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIF9pbml0SW5TZXJ2ZXJcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaW5pdEluU2VydmVyKCkge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBSLmlzU2VydmVyKCkuc2hvdWxkLmJlLm9rKTtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UuY2FzdCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD5UcmlnZ2VyZWQgd2hlbiBhIGRhdGEgaXMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljIGtleSA8YnIgLz5cclxuICAgICAgICAqIENhbGwgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBrZXkgPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlVXBkYXRlXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFRoZSBzcGVjaWZpYyBrZXlcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaGFuZGxlVXBkYXRlKHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IHVwZGF0ZScsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5vYmplY3QgJiZcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5rLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnYuc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuZC5zaG91bGQuYmUuYW4uQXJyYXkgJiZcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5oLnNob3VsZC5iZS5hLlN0cmluZ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gcGFyYW1zLms7XHJcbiAgICAgICAgICAgIHRoaXMuX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeShrZXksIHBhcmFtcykoKGVyciwgdmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgJ1IuVXBsaW5rLl9oYW5kbGVVcGRhdGUoLi4uKTogY291bGRuXFwndCBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5LicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xyXG4gICAgICAgICAgICAgICAgaWYoXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSkuZm9yRWFjaCgoZm4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm4oa2V5LCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBAbWV0aG9kIF9zaG91bGRGZXRjaEtleVxyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5XHJcbiAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBib29sIFRoZSBib29sZWFuXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX3Nob3VsZEZldGNoS2V5KGtleSwgZW50cnkpIHtcclxuICAgICAgICAgICAgaWYoIV8uaGFzKHRoaXMuX2RhdGEsIGtleSkgfHwgIV8uaGFzKHRoaXMuX2hhc2hlcywga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5faGFzaGVzW2tleV0gIT09IGVudHJ5LmZyb20pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+RGV0ZXJtaW5lcyBpZiB0aGUgdGhlIGRhdGEgbXVzdCBiZSBmZXRjaGVkPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5XHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW50cnlcclxuICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmbiBUaGUgRnVuY3Rpb24gdG8gY2FsbFxyXG4gICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9wZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnkoa2V5LCBlbnRyeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGZuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fc2hvdWxkRmV0Y2hLZXkoa2V5LCBlbnRyeSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMuZmV0Y2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSLnBhdGNoKHRoaXMuX2RhdGFba2V5XSwgZW50cnkuZGlmZik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBmbik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUV2ZW50XHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2hhbmRsZUV2ZW50KHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGV2ZW50JywgcGFyYW1zLmV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBldmVudE5hbWUgPSBwYXJhbXMuZXZlbnROYW1lO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRQYXJhbXMgPSBwYXJhbXMucGFyYW1zO1xyXG4gICAgICAgICAgICBpZihfLmhhcyh0aGlzLl9saXN0ZW5lcnMsIGV2ZW50TmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKS5mb3JFYWNoKChmbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuKGV2ZW50UGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZURpc2Nvbm5lY3RcclxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXNcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaGFuZGxlRGlzY29ubmVjdChwYXJhbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBkaXNjb25uZWN0JywgcGFyYW1zKTtcclxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPk9jY3VycyBhZnRlciBhIGNvbm5lY3Rpb24uIFdoZW4gYSBjb25uZWN0aW9uIGlzIGVzdGFibGlzaGVkLCB0aGUgY2xpZW50IHNlbmRzIGEgc2lnbmFsIFwiaGFuZHNoYWtlXCIuPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRGlzY29ubmVjdFxyXG4gICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9oYW5kbGVDb25uZWN0KCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGNvbm5lY3QnKTtcclxuICAgICAgICAgICAgLy9ub3RpZnkgdXBsaW5rLXNlcnZlclxyXG4gICAgICAgICAgICB0aGlzLl9lbWl0KCdoYW5kc2hha2UnLCB7IGd1aWQ6IHRoaXMuX2d1aWQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPiBJZGVudGlmaWVzIGlmIHRoZSBwaWQgb2YgdGhlIHNlcnZlciBoYXMgY2hhbmdlZCAoZHVlIHRvIGEgcG90ZW50aWFsIHJlYm9vdCBzZXJ2ZXItc2lkZSkgc2luY2UgdGhlIGxhc3QgY2xpZW50IGNvbm5lY3Rpb24uIDxiciAvPlxyXG4gICAgICAgICogSWYgdGhpcyBpcyB0aGUgY2FzZSwgYSBwYWdlIHJlbG9hZCBpcyBwZXJmb3JtZWQ8cD5cclxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUhhbmRzaGFrZUFja1xyXG4gICAgICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaGFuZGxlSGFuZHNoYWtlQWNrKHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGhhbmRzaGFrZS1hY2snLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9waWQgJiYgcGFyYW1zLnBpZCAhPT0gdGhpcy5fcGlkICYmIHRoaXMuc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBfLmRldigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdTZXJ2ZXIgcGlkIGhhcyBjaGFuZ2VkLCByZWxvYWRpbmcgcGFnZS4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0sIF8ucmFuZG9tKDIwMDAsIDEwMDAwKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcGlkID0gcGFyYW1zLnBpZDtcclxuICAgICAgICAgICAgdGhpcy5fYWNrbm93bGVkZ2VIYW5kc2hha2UocGFyYW1zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRGVidWdcclxuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2hhbmRsZURlYnVnKHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGRlYnVnJywgcGFyYW1zKTtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSLlVwbGluay5kZWJ1ZyguLi4pOicsIHBhcmFtcy5kZWJ1Zyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVMb2dcclxuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2hhbmRsZUxvZyhwYXJhbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBsb2cnLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUi5VcGxpbmsubG9nKC4uLik6JywgcGFyYW1zLmxvZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZVdhcm5cclxuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2hhbmRsZVdhcm4ocGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgd2FybicsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5VcGxpbmsud2FybiguLi4pOicsIHBhcmFtcy53YXJuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRXJyb3JcclxuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2hhbmRsZUVycm9yKHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGVycm9yJywgcGFyYW1zKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUi5VcGxpbmsuZXJyKC4uLik6JywgcGFyYW1zLmVycik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPk9jY3VycyB3aGVuIGEgY2xpZW50IHVubG9hZHMgdGhlIGRvY3VtZW50PC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlVW5sb2FkXHJcbiAgICAgICAgKiBAcGFyYW1zIHtGdW5jdGlvbn0gcHJldkhhbmRsZXIgVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgcGFnZSB3aWxsIGJlIHVubG9hZGVkXHJcbiAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZnVuY3Rpb25cclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfaGFuZGxlVW5sb2FkKHByZXZIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihwcmV2SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0KCd1bmhhbmRzaGFrZScpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD5TaW1wbHkgY2xvc2VzIHRoZSBzb2NrZXQ8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIF9kZXN0cm95SW5DbGllbnRcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfZGVzdHJveUluQ2xpZW50KCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9zb2NrZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+RG9lcyBub3RoaW5nPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfZGVzdHJveUluQ2xpZW50XHJcbiAgICAgICAgKiBAcmV0dXJuIHsqfSB2b2lkMFxyXG4gICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9kZXN0cm95SW5TZXJ2ZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPk5vdGlmaWVzIHRoZSB1cGxpbmstc2VydmVyIHRoYXQgYSBzdWJzY3JpcHRpb24gaXMgcmVxdWlyZWQgYnkgY2xpZW50PC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfc3Vic2NyaWJlVG9cclxuICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc3Vic2NyaWJlXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX3N1YnNjcmliZVRvKGtleSkge1xyXG4gICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XHJcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnJlYWR5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdCgnc3Vic2NyaWJlVG8nLCB7IGtleToga2V5IH0pO1xyXG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdygnUi5VcGxpbmsuX3N1YnNjcmliZVRvKC4uLik6IGNvdWxkblxcJ3Qgc3Vic2NyaWJlICgnICsga2V5ICsgJyknKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPk5vdGlmaWVzIHRoZSB1cGxpbmstc2VydmVyIHRoYXQgYSBzdWJzY3JpcHRpb24gaXMgb3ZlcjwvcD5cclxuICAgICAgICAqIEBtZXRob2QgX3N1YnNjcmliZVRvXHJcbiAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHVuc3Vic2NyaWJlXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX3Vuc3Vic2NyaWJlRnJvbShrZXkpIHtcclxuICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoJ3Vuc3Vic2NyaWJlRnJvbScsIHsga2V5OiBrZXkgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fc3Vic2NyaWJlVG8oLi4uKTogY291bGRuXFwndCB1bnN1YnNjcmliZSAoJyArIGtleSArICcpJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD5FdGFibGlzaGVzIGEgc3Vic2NyaXB0aW9uIHRvIGEga2V5LCBhbmQgY2FsbCB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uIHdoZW4gX2hhbmRsZVVwZGF0ZSBvY2N1cnM8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIHN1YnNjcmliZVRvXHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc3Vic2NyaWJlXHJcbiAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZVxyXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBzdWJzY3JpcHRpb24gVGhlIGNyZWF0ZWQgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgKi9cclxuICAgICAgICBzdWJzY3JpYmVUbyhrZXksIGZuKSB7XHJcbiAgICAgICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgUi5VcGxpbmsuU3Vic2NyaXB0aW9uKGtleSk7XHJcbiAgICAgICAgICAgIGlmKCFfLmhhcyh0aGlzLl9zdWJzY3JpcHRpb25zLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVUbyhrZXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHt9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0gPSBmbjtcclxuICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+UmVtb3ZlcyBhIHN1YnNjcmlwdGlvbiB0byBhIGtleTwvcD5cclxuICAgICAgICAqIEBtZXRob2Qgc3Vic2NyaWJlVG9cclxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBzdWJzY3JpYmVcclxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpcHRpb25cclxuICAgICAgICAqL1xyXG4gICAgICAgIHVuc3Vic2NyaWJlRnJvbShrZXksIHN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0uc2hvdWxkLmJlLmEuU3RyaW5nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXTtcclxuICAgICAgICAgICAgaWYoXy5zaXplKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV07XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2hhc2hlc1trZXldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmVGcm9tKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+U2VuZHMgdGhlIGxpc3RlbmVyIHNpZ25hbCBcImxpc3RlblRvXCI8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIF9saXN0ZW5Ub1xyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnROYW1lIHRvIGxpc3RlblxyXG4gICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9saXN0ZW5UbyhldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoJ2xpc3RlblRvJywgeyBldmVudE5hbWU6IGV2ZW50TmFtZSB9KTtcclxuICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBSLkRlYnVnLnJldGhyb3coJ1IuVXBsaW5rLl9saXN0ZW5UbzogY291bGRuXFwndCBsaXN0ZW4gKCcgKyBldmVudE5hbWUgKyAnKScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAvKipcclxuICAgICAgICAqIDxwPlNlbmRzIHRoZSB1bmxpc3RlbmVyIHNpZ25hbCBcInVubGlzdGVuRnJvbVwiPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBfdW5saXN0ZW5Gcm9tXHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gbGlzdGVuXHJcbiAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX3VubGlzdGVuRnJvbShldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoJ3VubGlzdGVuRnJvbScsIHsgZXZlbnROYW1lOiBldmVudE5hbWUgfSk7XHJcbiAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fdW5saXN0ZW5Gcm9tOiBjb3VsZG5cXCd0IHVubGlzdGVuICgnICsgZXZlbnROYW1lICsgJyknKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPkNyZWF0ZSBhIGxpc3RlbmVyIGFjY29yZGluZyB0byBhIHNwZWNpZmljIG5hbWU8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIGxpc3RlblRvXHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gbGlzdGVuXHJcbiAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRyaWdnZXJlZFxyXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBsaXN0ZW5lciBUaGUgY3JlYXRlZCBsaXN0ZW5lclxyXG4gICAgICAgICovXHJcbiAgICAgICAgbGlzdGVuVG8oZXZlbnROYW1lLCBmbikge1xyXG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBSLlVwbGluay5MaXN0ZW5lcihldmVudE5hbWUpO1xyXG4gICAgICAgICAgICBpZighXy5oYXModGhpcy5fbGlzdGVuZXJzLCBldmVudE5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5UbyhldmVudE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXVtsaXN0ZW5lci51bmlxdWVJZF0gPSBmbjtcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiA8cD5SZW1vdmUgYSBsaXN0ZW5lciA8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIHVubGlzdGVuRnJvbVxyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnROYW1lIHRvIHJlbW92ZVxyXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGxpc3RlbmVyXHJcbiAgICAgICAgKi9cclxuICAgICAgICB1bmxpc3RlbkZyb20oZXZlbnROYW1lLCBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnNob3VsZC5iZS5hbi5PYmplY3QgJiYgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXVtsaXN0ZW5lci51bmlxdWVJZF0uc2hvdWxkLmJlLm9rICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXVtsaXN0ZW5lci51bmlxdWVJZF0uc2hvdWxkLmJlLmEuU3RyaW5nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcclxuICAgICAgICAgICAgaWYoXy5zaXplKHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBAbWV0aG9kIF9nZXRGdWxsVXJsXHJcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3VmZml4XHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gbGlzdGVuZXJcclxuICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBfZ2V0RnVsbFVybChzdWZmaXgpIHtcclxuICAgICAgICAgICAgaWYoc3VmZml4LnNsaWNlKDAsIDEpID09PSAnLycgJiYgdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKC0xKSA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKDAsIC0xKSArIHN1ZmZpeDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9odHRwRW5kcG9pbnQgKyBzdWZmaXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+RmV0Y2ggZGF0YSBieSBHRVQgcmVxdWVzdCBmcm9tIHRoZSB1cGxpbmstc2VydmVyPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBmZXRjaFxyXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGZldGNoXHJcbiAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IG9iamVjdCBGZXRjaGVkIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBrZXlcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZldGNoKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coJz4+PiBmZXRjaCcsIGtleSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuX2dldEZ1bGxVcmwoa2V5KSxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGV2KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5VcGxpbmsuZmV0Y2goLi4uKTogY291bGRuXFwndCBmZXRjaCBcXCcnICsga2V5ICsgJ1xcJzonLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+RGlzcGF0Y2hlcyBhbiBhY3Rpb24gYnkgUE9TVCByZXF1ZXN0IGZyb20gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XHJcbiAgICAgICAgKiBAbWV0aG9kIGRpc3BhdGNoXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBzcGVjaWZpYyBhY3Rpb24gdG8gZGlzcGF0Y2hcclxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcclxuICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gb2JqZWN0IEZldGNoZWQgZGF0YSBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCBhY3Rpb25cclxuICAgICAgICAqL1xyXG4gICAgICAgIGRpc3BhdGNoKGFjdGlvbiwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPj4+IGRpc3BhdGNoJywgYWN0aW9uLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLl9nZXRGdWxsVXJsKGFjdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogeyBndWlkOiB0aGlzLl9ndWlkLCBwYXJhbXM6IHBhcmFtcyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPkRlc3Ryb3kgc29ja2V0IGNsaWVudC1zaWRlPC9wPlxyXG4gICAgICAgICogQG1ldGhvZCBkZXN0cm95XHJcbiAgICAgICAgKi9cclxuICAgICAgICBkZXN0cm95KCkge1xyXG4gICAgICAgICAgICBpZihSLmlzQ2xpZW50KCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lJbkNsaWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKFIuaXNTZXJ2ZXIoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveUluU2VydmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXy5leHRlbmQoVXBsaW5rLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBSLlVwbGluay5wcm90b3R5cGUgKi8ge1xyXG4gICAgICAgIF9odHRwRW5kcG9pbnQ6IG51bGwsXHJcbiAgICAgICAgX3NvY2tldEVuZFBvaW50OiBudWxsLFxyXG4gICAgICAgIF9zdWJzY3JpcHRpb25zOiBudWxsLFxyXG4gICAgICAgIF9saXN0ZW5lcnM6IG51bGwsXHJcbiAgICAgICAgX3NvY2tldDogbnVsbCxcclxuICAgICAgICBfZ3VpZDogbnVsbCxcclxuICAgICAgICBfcGlkOiBudWxsLFxyXG4gICAgICAgIHJlYWR5OiBudWxsLFxyXG4gICAgICAgIHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydDogbnVsbCxcclxuICAgICAgICBfYWNrbm93bGVkZ2VIYW5kc2hha2U6IG51bGwsXHJcbiAgICB9KTtcclxuXHJcbiAgICBfLmV4dGVuZChVcGxpbmssIHtcclxuICAgICAgICBTdWJzY3JpcHRpb24oa2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgICAgICB0aGlzLnVuaXF1ZUlkID0gXy51bmlxdWVJZCgnUi5VcGxpbmsuU3Vic2NyaXB0aW9uJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBMaXN0ZW5lcihldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudE5hbWUgPSBldmVudE5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdSLlVwbGluay5MaXN0ZW5lcicpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gVXBsaW5rO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=