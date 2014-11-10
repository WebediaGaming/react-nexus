"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var url = require("url");
  var _ = require("lodash");
  var assert = require("assert");
  var request;
  if (R.isClient()) {
    request = require("browser-request");
  } else {
    request = require("request");
  }
  var co = require("co");

  /**
   * <p>The Uplink micro-protocol is a simple set of conventions to implement real-time reactive Flux over the wire. <br />
   * The frontend and the backend server share 2 means of communications : <br />
   * - a WebSocket-like (socket.io wrapper) duplex connection to handshake and subscribe to keys/listen to events <br />
   * - regulars HTTP requests (front -> back) to actually get data from the stores</p>
   * <p>
   * PROTOCOL: <br />
   *<br />
   * Connection/reconnection:<br />
   *<br />
   * Client: bind socket<br />
   * Server: Acknowledge connection<br />
   * Client: send "handshake" { guid: guid }<br />
   * Server: send "handshake-ack" { recovered: bool } (recover previous session if existing based upon guid; recovered is true iff previous session existed)<br /><br />
   *<br />
   * Stores:<br />
   * Client: send "subscribeTo" { key: key }<br />
   * Server: send "update" { key: key }<br />
   * Client: XHR GET /uplink/key<br />
   *<br />
   * Events:
   * Client: send "listenTo" { eventName: eventName }<br />
   * Server: send "event" { eventName: eventName, params: params }<br />
   *<br />
   * Actions:<br />
   * Client: XHR POST /uplink/action { params: params }<br />
   *<br />
   * Other notifications:<br />
   * Server: send "debug": { debug: debug } Debug-level message<br />
   * Server: send "log" { log: log } Log-level message<br />
   * Server: send "warn": { warn: warn } Warn-level message<br />
   * Server: send "err": { err: err } Error-level message<br />
   * </p>
   * @class R.Uplink
   */

  /**
  * <p> Initializes the uplink according to the specifications provided </p>
  * @method Uplink
  * @param {object} httpEndpoint
  * @param {object} socketEndpoint
  * @param {object} guid
  * @param {object} shouldReloadOnServerRestart
  */
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
    _acknowledgeHandshake: null,
    _debugLog: function _debugLog() {
      var args = arguments;
      R.Debug.dev(function () {
        console.log.apply(console, args);
      });
    },
    /**
    * <p>Emits a socket signal to the uplink-server</p>
    * @param {string} name The name of the signal
    * @param {object} params The specifics params to send
    * @private
    */
    _emit: function _emit(name, params) {
      R.Debug.dev(R.scope(function () {
        assert(this._socket && null !== this._socket, "R.Uplink.emit(...): no active socket ('" + name + "', '" + params + "')");
      }, this));
      this._debugLog(">>> " + name, params);
      this._socket.emit(name, params);
    },

    /**
    * <p> Creating io connection client-side in order to use sockets </p>
    * @method _initInClient
    * @private
    */
    _initInClient: function _initInClient() {
      R.Debug.dev(function () {
        assert(R.isClient(), "R.Uplink._initInClient(...): should only be called in the client.");
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
        this.ready = new Promise(R.scope(function (resolve, reject) {
          this._acknowledgeHandshake = resolve;
        }, this));
        if (window.onbeforeunload) {
          var prevHandler = window.onbeforeunload;
          window.onbeforeunload = R.scope(this._handleUnload(prevHandler), this);
        } else {
          window.onbeforeunload = R.scope(this._handleUnload(null), this);
        }
      } else {
        this.ready = Promise.cast(true);
      }
    },
    /**
    * <p>Server-side</p>
    * @method _initInServer
    * @private
    */
    _initInServer: function _initInClient() {
      R.Debug.dev(function () {
        assert(R.isServer(), "R.Uplink._initInServer(...): should only be called in the server.");
      });
      this.ready = Promise.cast(true);
    },
    /**
    * <p>Triggered when a data is updated according to the specific key <br />
    * Call corresponding function key </p>
    * @method _handleUpdate
    * @param {object} params The specific key
    * @private
    */
    _handleUpdate: function _handleUpdate(params) {
      this._debugLog("<<< update", params);
      R.Debug.dev(function () {
        assert(_.isObject(params), "R.Uplink._handleUpdate.params: expecting Object.");
        assert(params.k && _.isString(params.k), "R.Uplink._handleUpdate.params.k: expecting String.");
        assert(_.has(params, "v"), "R.Uplink._handleUpdate.params.v: expecting an entry.");
        assert(params.d && _.isArray(params.d), "R.Uplink._handleUpdate.params.d: expecting Array.");
        assert(params.h && _.isString(params.h), "R.Uplink._handleUpdate.params.h: expecting String.");
      });
      var key = params.k;
      this._performUpdateIfNecessary(key, params)(R.scope(function (err, val) {
        R.Debug.dev(function () {
          if (err) {
            throw R.Debug.extendError(err, "R.Uplink._handleUpdate(...): couldn't _performUpdateIfNecessary.");
          }
        });
        if (err) {
          return;
        }
        this._data[key] = val;
        this._hashes[key] = R.hash(JSON.stringify(val));
        if (_.has(this._subscriptions, key)) {
          _.each(this._subscriptions[key], function (fn) {
            fn(key, val);
          });
        }
      }, this));
    },
    /**
    * @method _shouldFetchKey
    * @param {string} key
    * @param {object} entry
    * @return {Boolean} bool The boolean
    * @private
    */
    _shouldFetchKey: function _shouldFetchKey(key, entry) {
      if (!_.has(this._data, key) || !_.has(this._hashes, key)) {
        return true;
      }
      if (this._hashes[key] !== entry.from) {
        return true;
      }
      return false;
    },

    /**
    * <p>Determines if the the data must be fetched</p>
    * @method _performUpdateIfNecessary
    * @param {string} key
    * @param {object} entry
    * @return {Function} fn The Function to call
    * @private
    */
    _performUpdateIfNecessary: function _performUpdateIfNecessary(key, entry) {
      return R.scope(function (fn) {
        co(regeneratorRuntime.mark(function callee$3$0() {
          return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
            while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                if (!this._shouldFetchKey(key, entry)) {
                  context$4$0.next = 6;
                  break;
                }
                context$4$0.next = 3;
                return this.fetch(key);

              case 3: return context$4$0.abrupt("return", context$4$0.sent);
              case 6: return context$4$0.abrupt("return", R.patch(this._data[key], entry.diff));
              case 7:
              case "end": return context$4$0.stop();
            }
          }, callee$3$0, this);
        })).call(this, fn);
      }, this);
    },

    /**
    * @method _handleEvent
    * @param {string} params
    * @private
    */
    _handleEvent: function _handleEvent(params) {
      this._debugLog("<<< event", params.eventName);
      var eventName = params.eventName;
      var eventParams = params.params;
      if (_.has(this._listeners, eventName)) {
        _.each(this._listeners[eventName], function (fn) {
          fn(eventParams);
        });
      }
    },
    /**
    * @method _handleDisconnect
    * @param {string} params
    * @private
    */
    _handleDisconnect: function _handleDisconnect(params) {
      this._debugLog("<<< disconnect", params);
      this.ready = new Promise(R.scope(function (resolve, reject) {
        this._acknowledgeHandshake = resolve;
      }, this));
    },
    /**
    * <p>Occurs after a connection. When a connection is established, the client sends a signal "handshake".</p>
    * @method _handleDisconnect
    * @private
    */
    _handleConnect: function _handleConnect() {
      this._debugLog("<<< connect");
      //notify uplink-server
      this._emit("handshake", { guid: this._guid });
    },

    /**
    * <p> Identifies if the pid of the server has changed (due to a potential reboot server-side) since the last client connection. <br />
    * If this is the case, a page reload is performed<p>
    * @method _handleHandshakeAck
    * @params {object} params
    * @private
    */
    _handleHandshakeAck: function _handleHandshakeAck(params) {
      this._debugLog("<<< handshake-ack", params);
      if (this._pid && params.pid !== this._pid && this.shouldReloadOnServerRestart) {
        R.Debug.dev(function () {
          console.warn("Server pid has changed, reloading page.");
        });
        setTimeout(function () {
          window.location.reload(true);
        }, _.random(2000, 10000));
      }
      this._pid = params.pid;
      this._acknowledgeHandshake(params);
    },
    /**
    * @method _handleDebug
    * @params {object} params
    * @private
    */
    _handleDebug: function _handleDebug(params) {
      this._debugLog("<<< debug", params);
      R.Debug.dev(function () {
        console.warn("R.Uplink.debug(...):", params.debug);
      });
    },
    /**
    * @method _handleLog
    * @params {object} params
    * @private
    */
    _handleLog: function _handleLog(params) {
      this._debugLog("<<< log", params);
      console.log("R.Uplink.log(...):", params.log);
    },
    /**
    * @method _handleWarn
    * @params {object} params
    * @private
    */
    _handleWarn: function _handleWarn(params) {
      this._debugLog("<<< warn", params);
      console.warn("R.Uplink.warn(...):", params.warn);
    },
    /**
    * @method _handleError
    * @params {object} params
    * @private
    */
    _handleError: function _handleError(params) {
      this._debugLog("<<< error", params);
      console.error("R.Uplink.err(...):", params.err);
    },

    /**
    * <p>Occurs when a client unloads the document</p>
    * @method _handleUnload
    * @params {Function} prevHandler The function to execute when the page will be unloaded
    * @return {Function} function
    * @private
    */
    _handleUnload: function _handleUnload(prevHandler) {
      return R.scope(function () {
        if (prevHandler) {
          prevHandler();
        }
        this._emit("unhandshake");
      }, this);
    },

    /**
    * <p>Simply closes the socket</p>
    * @method _destroyInClient
    * @private
    */
    _destroyInClient: function _destroyInClient() {
      if (this._socket) {
        this._socket.close();
      }
    },
    /**
    * <p>Does nothing</p>
    * @method _destroyInClient
    * @return {*} void0
    * @private
    */
    _destroyInServer: function _destroyInServer() {
      return void 0;
    },

    /**
    * <p>Notifies the uplink-server that a subscription is required by client</p>
    * @method _subscribeTo
    * @return {string} key The key to subscribe
    * @private
    */
    _subscribeTo: function _subscribeTo(key) {
      co(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              context$3$0.next = 2;
              return this.ready;

            case 2: this._emit("subscribeTo", { key: key });
            case 3:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      })).call(this, R.Debug.rethrow("R.Uplink._subscribeTo(...): couldn't subscribe (" + key + ")"));
    },

    /**
    * <p>Notifies the uplink-server that a subscription is over</p>
    * @method _subscribeTo
    * @return {string} key The key to unsubscribe
    * @private
    */
    _unsubscribeFrom: function _unsubscribeFrom(key) {
      co(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              context$3$0.next = 2;
              return this.ready;

            case 2: this._emit("unsubscribeFrom", { key: key });
            case 3:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      })).call(this, R.Debug.rethrow("R.Uplink._subscribeTo(...): couldn't unsubscribe (" + key + ")"));
    },

    /**
    * <p>Etablishes a subscription to a key, and call the specified function when _handleUpdate occurs</p>
    * @method subscribeTo
    * @param {string} key The key to subscribe
    * @param {function} fn The function to execute
    * @return {object} subscription The created subscription
    */
    subscribeTo: function subscribeTo(key, fn) {
      var subscription = new R.Uplink.Subscription(key);
      if (!_.has(this._subscriptions, key)) {
        this._subscribeTo(key);
        this._subscriptions[key] = {};
        this._data[key] = {};
        this._hashes[key] = R.hash(JSON.stringify({}));
      }
      this._subscriptions[key][subscription.uniqueId] = fn;
      return subscription;
    },

    /**
    * <p>Removes a subscription to a key</p>
    * @method subscribeTo
    * @param {string} key The key to subscribe
    * @param {object} subscription
    */
    unsubscribeFrom: function unsubscribeFrom(key, subscription) {
      R.Debug.dev(R.scope(function () {
        assert(_.has(this._subscriptions, key), "R.Uplink.unsub(...): no such key.");
        assert(_.has(this._subscriptions[key], subscription.uniqueId), "R.Uplink.unsub(...): no such subscription.");
      }, this));
      delete this._subscriptions[key][subscription.uniqueId];
      if (_.size(this._subscriptions[key]) === 0) {
        delete this._subscriptions[key];
        delete this._data[key];
        delete this._hashes[key];
        this._unsubscribeFrom(key);
      }
    },
    /**
    * <p>Sends the listener signal "listenTo"</p>
    * @method _listenTo
    * @param {string} eventName The eventName to listen
    * @private
    */
    _listenTo: function _listenTo(eventName) {
      co(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              context$3$0.next = 2;
              return this.ready;

            case 2: this._emit("listenTo", { eventName: eventName });
            case 3:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      })).call(this, R.Debug.rethrow("R.Uplink._listenTo: couldn't listen (" + eventName + ")"));
    },
    /**
    * <p>Sends the unlistener signal "unlistenFrom"</p>
    * @method _unlistenFrom
    * @param {string} eventName The eventName to listen
    * @private
    */
    _unlistenFrom: function _unlistenFrom(eventName) {
      co(regeneratorRuntime.mark(function callee$2$0() {
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
              context$3$0.next = 2;
              return this.ready;

            case 2: this._emit("unlistenFrom", { eventName: eventName });
            case 3:
            case "end": return context$3$0.stop();
          }
        }, callee$2$0, this);
      })).call(this, R.Debug.rethrow("R.Uplink._unlistenFrom: couldn't unlisten (" + eventName + ")"));
    },
    /**
    * <p>Create a listener according to a specific name</p>
    * @method listenTo
    * @param {string} eventName The eventName to listen
    * @param {function} fn The function to execute when triggered
    * @return {object} listener The created listener
    */
    listenTo: function listenTo(eventName, fn) {
      var listener = R.Uplink.Listener(eventName);
      if (!_.has(this._listeners, eventName)) {
        this._listenTo(eventName);
        this._listeners[eventName] = {};
      }
      this._listeners[eventName][listener.uniqueId] = fn;
      return listener;
    },

    /**
    * <p>Remove a listener </p>
    * @method unlistenFrom
    * @param {string} eventName The eventName to remove
    * @param {object} listener
    */
    unlistenFrom: function unlistenFrom(eventName, listener) {
      R.Debug.dev(R.scope(function () {
        assert(_.has(this._listeners, eventName), "R.Uplink.removeListener(...): no such eventName.");
        assert(_.has(this._listeners[eventName], listener.uniqueId), "R.Uplink.removeListener(...): no such listener.");
      }, this));
      delete this._listeners[eventName];
      if (_.size(this._listeners[eventName]) === 0) {
        delete this._listeners[eventName];
        this._unlistenFrom(eventName);
      }
    },
    /**
    * @method _getFullUrl
    * @param {string} suffix
    * @param {object} listener
    * @private
    */
    _getFullUrl: function _getFullUrl(suffix) {
      if (suffix.slice(0, 1) === "/" && this._httpEndpoint.slice(-1) === "/") {
        return this._httpEndpoint.slice(0, -1) + suffix;
      } else {
        return this._httpEndpoint + suffix;
      }
    },
    /**
    * <p>Fetch data by GET request from the uplink-server</p>
    * @method fetch
    * @param {string} key The key to fetch
    * @return {object} object Fetched data according to the key
    */
    fetch: function fetch(key) {
      return new Promise(R.scope(function (resolve, reject) {
        this._debugLog(">>> fetch", key);
        request({
          url: this._getFullUrl(key),
          method: "GET",
          json: true,
          withCredentials: false }, function (err, res, body) {
          if (err) {
            R.Debug.dev(function () {
              console.warn("R.Uplink.fetch(...): couldn't fetch '" + key + "':", err.toString());
            });
            return resolve(null);
          } else {
            return resolve(body);
          }
        });
      }, this));
    },

    /**
    * <p>Dispatches an action by POST request from the uplink-server</p>
    * @method dispatch
    * @param {object} action The specific action to dispatch
    * @param {object} params
    * @return {object} object Fetched data according to the specified action
    */
    dispatch: function dispatch(action, params) {
      return new Promise(R.scope(function (resolve, reject) {
        this._debugLog(">>> dispatch", action, params);
        request({
          url: this._getFullUrl(action),
          method: "POST",
          body: { guid: this._guid, params: params },
          json: true,
          withCredentials: false }, function (err, res, body) {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        });
      }, this));
    },
    /**
    * <p>Destroy socket client-side</p>
    * @method destroy
    */
    destroy: function destroy() {
      if (R.isClient()) {
        this._destroyInClient();
      }
      if (R.isServer()) {
        this._destroyInServer();
      }
    } });

  _.extend(Uplink, {
    Subscription: function Subscription(key) {
      this.key = key;
      this.uniqueId = _.uniqueId("R.Uplink.Subscription");
    },
    Listener: function Listener(eventName) {
      this.eventName = eventName;
      this.uniqueId = _.uniqueId("R.Uplink.Listener");
    } });

  return Uplink;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlVwbGluay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixNQUFJLE9BQU8sQ0FBQztBQUNaLE1BQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ2IsV0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0dBQ3hDLE1BQ0k7QUFDRCxXQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ2hDO0FBQ0QsTUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEN2QixNQUFJLE1BQU0sR0FBRyxTQUFTLE1BQU0sQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRTtBQUMxRixRQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztBQUNsQyxRQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztBQUN0QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNiLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN4QjtBQUNELFFBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FB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QUFDLHVCQUF1QixDQUFDLENBQUM7S0FDdkQ7QUFDRCxZQUFRLEVBQUUsU0FBUyxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQ25DLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ25ELEVBQ0osQ0FBQyxDQUFDOztBQUVILFNBQU8sTUFBTSxDQUFDO0NBQ2pCLENBQUMiLCJmaWxlIjoiUi5VcGxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIHZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xuICAgIHZhciBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcbiAgICB2YXIgcmVxdWVzdDtcbiAgICBpZihSLmlzQ2xpZW50KCkpIHtcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVpcmUoXCJicm93c2VyLXJlcXVlc3RcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIik7XG4gICAgfVxuICAgIHZhciBjbyA9IHJlcXVpcmUoXCJjb1wiKTtcblxuICAgIC8qKlxuICAgICAqIDxwPlRoZSBVcGxpbmsgbWljcm8tcHJvdG9jb2wgaXMgYSBzaW1wbGUgc2V0IG9mIGNvbnZlbnRpb25zIHRvIGltcGxlbWVudCByZWFsLXRpbWUgcmVhY3RpdmUgRmx1eCBvdmVyIHRoZSB3aXJlLiA8YnIgLz5cbiAgICAgKiBUaGUgZnJvbnRlbmQgYW5kIHRoZSBiYWNrZW5kIHNlcnZlciBzaGFyZSAyIG1lYW5zIG9mIGNvbW11bmljYXRpb25zIDogPGJyIC8+XG4gICAgICogLSBhIFdlYlNvY2tldC1saWtlIChzb2NrZXQuaW8gd3JhcHBlcikgZHVwbGV4IGNvbm5lY3Rpb24gdG8gaGFuZHNoYWtlIGFuZCBzdWJzY3JpYmUgdG8ga2V5cy9saXN0ZW4gdG8gZXZlbnRzIDxiciAvPlxuICAgICAqIC0gcmVndWxhcnMgSFRUUCByZXF1ZXN0cyAoZnJvbnQgLT4gYmFjaykgdG8gYWN0dWFsbHkgZ2V0IGRhdGEgZnJvbSB0aGUgc3RvcmVzPC9wPlxuICAgICAqIDxwPlxuICAgICAqIFBST1RPQ09MOiA8YnIgLz5cbiAgICAgKjxiciAvPlxuICAgICAqIENvbm5lY3Rpb24vcmVjb25uZWN0aW9uOjxiciAvPlxuICAgICAqPGJyIC8+XG4gICAgICogQ2xpZW50OiBiaW5kIHNvY2tldDxiciAvPlxuICAgICAqIFNlcnZlcjogQWNrbm93bGVkZ2UgY29ubmVjdGlvbjxiciAvPlxuICAgICAqIENsaWVudDogc2VuZCBcImhhbmRzaGFrZVwiIHsgZ3VpZDogZ3VpZCB9PGJyIC8+XG4gICAgICogU2VydmVyOiBzZW5kIFwiaGFuZHNoYWtlLWFja1wiIHsgcmVjb3ZlcmVkOiBib29sIH0gKHJlY292ZXIgcHJldmlvdXMgc2Vzc2lvbiBpZiBleGlzdGluZyBiYXNlZCB1cG9uIGd1aWQ7IHJlY292ZXJlZCBpcyB0cnVlIGlmZiBwcmV2aW91cyBzZXNzaW9uIGV4aXN0ZWQpPGJyIC8+PGJyIC8+XG4gICAgICo8YnIgLz5cbiAgICAgKiBTdG9yZXM6PGJyIC8+XG4gICAgICogQ2xpZW50OiBzZW5kIFwic3Vic2NyaWJlVG9cIiB7IGtleToga2V5IH08YnIgLz5cbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJ1cGRhdGVcIiB7IGtleToga2V5IH08YnIgLz5cbiAgICAgKiBDbGllbnQ6IFhIUiBHRVQgL3VwbGluay9rZXk8YnIgLz5cbiAgICAgKjxiciAvPlxuICAgICAqIEV2ZW50czpcbiAgICAgKiBDbGllbnQ6IHNlbmQgXCJsaXN0ZW5Ub1wiIHsgZXZlbnROYW1lOiBldmVudE5hbWUgfTxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcImV2ZW50XCIgeyBldmVudE5hbWU6IGV2ZW50TmFtZSwgcGFyYW1zOiBwYXJhbXMgfTxiciAvPlxuICAgICAqPGJyIC8+XG4gICAgICogQWN0aW9uczo8YnIgLz5cbiAgICAgKiBDbGllbnQ6IFhIUiBQT1NUIC91cGxpbmsvYWN0aW9uIHsgcGFyYW1zOiBwYXJhbXMgfTxiciAvPlxuICAgICAqPGJyIC8+XG4gICAgICogT3RoZXIgbm90aWZpY2F0aW9uczo8YnIgLz5cbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJkZWJ1Z1wiOiB7IGRlYnVnOiBkZWJ1ZyB9IERlYnVnLWxldmVsIG1lc3NhZ2U8YnIgLz5cbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJsb2dcIiB7IGxvZzogbG9nIH0gTG9nLWxldmVsIG1lc3NhZ2U8YnIgLz5cbiAgICAgKiBTZXJ2ZXI6IHNlbmQgXCJ3YXJuXCI6IHsgd2Fybjogd2FybiB9IFdhcm4tbGV2ZWwgbWVzc2FnZTxiciAvPlxuICAgICAqIFNlcnZlcjogc2VuZCBcImVyclwiOiB7IGVycjogZXJyIH0gRXJyb3ItbGV2ZWwgbWVzc2FnZTxiciAvPlxuICAgICAqIDwvcD5cbiAgICAgKiBAY2xhc3MgUi5VcGxpbmtcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICogPHA+IEluaXRpYWxpemVzIHRoZSB1cGxpbmsgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L3A+XG4gICAgKiBAbWV0aG9kIFVwbGlua1xuICAgICogQHBhcmFtIHtvYmplY3R9IGh0dHBFbmRwb2ludFxuICAgICogQHBhcmFtIHtvYmplY3R9IHNvY2tldEVuZHBvaW50XG4gICAgKiBAcGFyYW0ge29iamVjdH0gZ3VpZFxuICAgICogQHBhcmFtIHtvYmplY3R9IHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydFxuICAgICovXG4gICAgdmFyIFVwbGluayA9IGZ1bmN0aW9uIFVwbGluayhodHRwRW5kcG9pbnQsIHNvY2tldEVuZHBvaW50LCBndWlkLCBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQpIHtcbiAgICAgICAgdGhpcy5faHR0cEVuZHBvaW50ID0gaHR0cEVuZHBvaW50O1xuICAgICAgICB0aGlzLl9zb2NrZXRFbmRQb2ludCA9IHNvY2tldEVuZHBvaW50O1xuICAgICAgICB0aGlzLl9ndWlkID0gZ3VpZDtcbiAgICAgICAgaWYoUi5pc0NsaWVudCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0SW5DbGllbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRJblNlcnZlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5faGFzaGVzID0ge307XG4gICAgICAgIHRoaXMuX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeSA9IFIuc2NvcGUodGhpcy5fcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fc2hvdWxkRmV0Y2hLZXkgPSBSLnNjb3BlKHRoaXMuX3Nob3VsZEZldGNoS2V5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5mZXRjaCA9IFIuc2NvcGUodGhpcy5mZXRjaCwgdGhpcyk7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVG8gPSBSLnNjb3BlKHRoaXMuc3Vic2NyaWJlVG8sIHRoaXMpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlRnJvbSA9IFIuc2NvcGUodGhpcy51bnN1YnNjcmliZUZyb20sIHRoaXMpO1xuICAgICAgICB0aGlzLmxpc3RlblRvID0gUi5zY29wZSh0aGlzLmxpc3RlblRvLCB0aGlzKTtcbiAgICAgICAgdGhpcy51bmxpc3RlbkZyb20gPSBSLnNjb3BlKHRoaXMudW5saXN0ZW5Gcm9tLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCA9IFIuc2NvcGUodGhpcy5kaXNwYXRjaCwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0ID0gc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0O1xuICAgIH07XG5cbiAgICBfLmV4dGVuZChVcGxpbmsucHJvdG90eXBlLCAvKiogQGxlbmRzIFIuVXBsaW5rLnByb3RvdHlwZSAqLyB7XG4gICAgICAgIF9odHRwRW5kcG9pbnQ6IG51bGwsXG4gICAgICAgIF9zb2NrZXRFbmRQb2ludDogbnVsbCxcbiAgICAgICAgX3N1YnNjcmlwdGlvbnM6IG51bGwsXG4gICAgICAgIF9saXN0ZW5lcnM6IG51bGwsXG4gICAgICAgIF9zb2NrZXQ6IG51bGwsXG4gICAgICAgIF9ndWlkOiBudWxsLFxuICAgICAgICBfcGlkOiBudWxsLFxuICAgICAgICByZWFkeTogbnVsbCxcbiAgICAgICAgc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0OiBudWxsLFxuICAgICAgICBfYWNrbm93bGVkZ2VIYW5kc2hha2U6IG51bGwsXG4gICAgICAgIF9kZWJ1Z0xvZzogZnVuY3Rpb24gX2RlYnVnTG9nKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5FbWl0cyBhIHNvY2tldCBzaWduYWwgdG8gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHNpZ25hbFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgVGhlIHNwZWNpZmljcyBwYXJhbXMgdG8gc2VuZFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9lbWl0OiBmdW5jdGlvbiBfZW1pdChuYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMuX3NvY2tldCAmJiBudWxsICE9PSB0aGlzLl9zb2NrZXQsIFwiUi5VcGxpbmsuZW1pdCguLi4pOiBubyBhY3RpdmUgc29ja2V0ICgnXCIgKyBuYW1lICsgXCInLCAnXCIgKyBwYXJhbXMgKyBcIicpXCIpO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coXCI+Pj4gXCIgKyBuYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQobmFtZSwgcGFyYW1zKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gQ3JlYXRpbmcgaW8gY29ubmVjdGlvbiBjbGllbnQtc2lkZSBpbiBvcmRlciB0byB1c2Ugc29ja2V0cyA8L3A+XG4gICAgICAgICogQG1ldGhvZCBfaW5pdEluQ2xpZW50XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2luaXRJbkNsaWVudDogZnVuY3Rpb24gX2luaXRJbkNsaWVudCgpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFzc2VydChSLmlzQ2xpZW50KCksIFwiUi5VcGxpbmsuX2luaXRJbkNsaWVudCguLi4pOiBzaG91bGQgb25seSBiZSBjYWxsZWQgaW4gdGhlIGNsaWVudC5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKHRoaXMuX3NvY2tldEVuZFBvaW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGlvO1xuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5pbyAmJiBfLmlzRnVuY3Rpb24od2luZG93LmlvKSkge1xuICAgICAgICAgICAgICAgICAgICBpbyA9IHdpbmRvdy5pbztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlvID0gcmVxdWlyZShcInNvY2tldC5pby1jbGllbnRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICAgICAgICAgICAgICAvL0Nvbm5lY3QgdG8gdXBsaW5rIHNlcnZlci1zaWRlLiBUcmlnZ2VyIHRoZSB1cGxpbmstc2VydmVyIG9uIGlvLm9uKFwiY29ubmVjdGlvblwiKVxuICAgICAgICAgICAgICAgIHZhciBzb2NrZXQgPSB0aGlzLl9zb2NrZXQgPSBpbyh0aGlzLl9zb2NrZXRFbmRQb2ludCk7XG4gICAgICAgICAgICAgICAgLy9QcmVwYXJlIGFsbCBldmVudCBjbGllbnQtc2lkZSwgbGlzdGVuaW5nOlxuICAgICAgICAgICAgICAgIHNvY2tldC5vbihcInVwZGF0ZVwiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZVVwZGF0ZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbihcImV2ZW50XCIsIFIuc2NvcGUodGhpcy5faGFuZGxlRXZlbnQsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsIFIuc2NvcGUodGhpcy5faGFuZGxlRGlzY29ubmVjdCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbihcImNvbm5lY3RcIiwgUi5zY29wZSh0aGlzLl9oYW5kbGVDb25uZWN0LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgc29ja2V0Lm9uKFwiaGFuZHNoYWtlLWFja1wiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUhhbmRzaGFrZUFjaywgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbihcImRlYnVnXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlRGVidWcsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oXCJsb2dcIiwgUi5zY29wZSh0aGlzLl9oYW5kbGVMb2csIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBzb2NrZXQub24oXCJ3YXJuXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlV2FybiwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHNvY2tldC5vbihcImVyclwiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUVycm9yLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKFIuc2NvcGUoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgaWYod2luZG93Lm9uYmVmb3JldW5sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2SGFuZGxlciA9IHdpbmRvdy5vbmJlZm9yZXVubG9hZDtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gUi5zY29wZSh0aGlzLl9oYW5kbGVVbmxvYWQocHJldkhhbmRsZXIpLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IFIuc2NvcGUodGhpcy5faGFuZGxlVW5sb2FkKG51bGwpLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5jYXN0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5TZXJ2ZXItc2lkZTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9pbml0SW5TZXJ2ZXJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaW5pdEluU2VydmVyOiBmdW5jdGlvbiBfaW5pdEluQ2xpZW50KCkge1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KFIuaXNTZXJ2ZXIoKSwgXCJSLlVwbGluay5faW5pdEluU2VydmVyKC4uLik6IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBpbiB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UuY2FzdCh0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+VHJpZ2dlcmVkIHdoZW4gYSBkYXRhIGlzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpYyBrZXkgPGJyIC8+XG4gICAgICAgICogQ2FsbCBjb3JyZXNwb25kaW5nIGZ1bmN0aW9uIGtleSA8L3A+XG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlVXBkYXRlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBUaGUgc3BlY2lmaWMga2V5XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZVVwZGF0ZTogZnVuY3Rpb24gX2hhbmRsZVVwZGF0ZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPDw8IHVwZGF0ZVwiLCBwYXJhbXMpO1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaXNPYmplY3QocGFyYW1zKSwgXCJSLlVwbGluay5faGFuZGxlVXBkYXRlLnBhcmFtczogZXhwZWN0aW5nIE9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHBhcmFtcy5rICYmIF8uaXNTdHJpbmcocGFyYW1zLmspLCBcIlIuVXBsaW5rLl9oYW5kbGVVcGRhdGUucGFyYW1zLms6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyhwYXJhbXMsIFwidlwiKSwgXCJSLlVwbGluay5faGFuZGxlVXBkYXRlLnBhcmFtcy52OiBleHBlY3RpbmcgYW4gZW50cnkuXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChwYXJhbXMuZCAmJiBfLmlzQXJyYXkocGFyYW1zLmQpLCBcIlIuVXBsaW5rLl9oYW5kbGVVcGRhdGUucGFyYW1zLmQ6IGV4cGVjdGluZyBBcnJheS5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHBhcmFtcy5oICYmIF8uaXNTdHJpbmcocGFyYW1zLmgpLCBcIlIuVXBsaW5rLl9oYW5kbGVVcGRhdGUucGFyYW1zLmg6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIga2V5ID0gcGFyYW1zLms7XG4gICAgICAgICAgICB0aGlzLl9wZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnkoa2V5LCBwYXJhbXMpKFIuc2NvcGUoZnVuY3Rpb24oZXJyLCB2YWwpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgXCJSLlVwbGluay5faGFuZGxlVXBkYXRlKC4uLik6IGNvdWxkbid0IF9wZXJmb3JtVXBkYXRlSWZOZWNlc3NhcnkuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YVtrZXldID0gdmFsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgICAgICAgICAgICAgIGlmKF8uaGFzKHRoaXMuX3N1YnNjcmlwdGlvbnMsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSwgZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKGtleSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9zaG91bGRGZXRjaEtleVxuICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZW50cnlcbiAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBib29sIFRoZSBib29sZWFuXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX3Nob3VsZEZldGNoS2V5OiBmdW5jdGlvbiBfc2hvdWxkRmV0Y2hLZXkoa2V5LCBlbnRyeSkge1xuICAgICAgICAgICAgaWYoIV8uaGFzKHRoaXMuX2RhdGEsIGtleSkgfHwgIV8uaGFzKHRoaXMuX2hhc2hlcywga2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy5faGFzaGVzW2tleV0gIT09IGVudHJ5LmZyb20pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5EZXRlcm1pbmVzIGlmIHRoZSB0aGUgZGF0YSBtdXN0IGJlIGZldGNoZWQ8L3A+XG4gICAgICAgICogQG1ldGhvZCBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbnRyeVxuICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmbiBUaGUgRnVuY3Rpb24gdG8gY2FsbFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9wZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnk6IGZ1bmN0aW9uIF9wZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnkoa2V5LCBlbnRyeSkge1xuICAgICAgICAgICAgcmV0dXJuIFIuc2NvcGUoZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nob3VsZEZldGNoS2V5KGtleSwgZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5mZXRjaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFIucGF0Y2godGhpcy5fZGF0YVtrZXldLCBlbnRyeS5kaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgZm4pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRXZlbnRcbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZUV2ZW50OiBmdW5jdGlvbiBfaGFuZGxlRXZlbnQocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZyhcIjw8PCBldmVudFwiLCBwYXJhbXMuZXZlbnROYW1lKTtcbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSBwYXJhbXMuZXZlbnROYW1lO1xuICAgICAgICAgICAgdmFyIGV2ZW50UGFyYW1zID0gcGFyYW1zLnBhcmFtcztcbiAgICAgICAgICAgIGlmKF8uaGFzKHRoaXMuX2xpc3RlbmVycywgZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSwgZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm4oZXZlbnRQYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVEaXNjb25uZWN0XG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVEaXNjb25uZWN0OiBmdW5jdGlvbiBfaGFuZGxlRGlzY29ubmVjdChwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPDw8IGRpc2Nvbm5lY3RcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZShSLnNjb3BlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+T2NjdXJzIGFmdGVyIGEgY29ubmVjdGlvbi4gV2hlbiBhIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQsIHRoZSBjbGllbnQgc2VuZHMgYSBzaWduYWwgXCJoYW5kc2hha2VcIi48L3A+XG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRGlzY29ubmVjdFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVDb25uZWN0OiBmdW5jdGlvbiBfaGFuZGxlQ29ubmVjdCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPDw8IGNvbm5lY3RcIik7XG4gICAgICAgICAgICAvL25vdGlmeSB1cGxpbmstc2VydmVyXG4gICAgICAgICAgICB0aGlzLl9lbWl0KFwiaGFuZHNoYWtlXCIsIHsgZ3VpZDogdGhpcy5fZ3VpZCB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gSWRlbnRpZmllcyBpZiB0aGUgcGlkIG9mIHRoZSBzZXJ2ZXIgaGFzIGNoYW5nZWQgKGR1ZSB0byBhIHBvdGVudGlhbCByZWJvb3Qgc2VydmVyLXNpZGUpIHNpbmNlIHRoZSBsYXN0IGNsaWVudCBjb25uZWN0aW9uLiA8YnIgLz5cbiAgICAgICAgKiBJZiB0aGlzIGlzIHRoZSBjYXNlLCBhIHBhZ2UgcmVsb2FkIGlzIHBlcmZvcm1lZDxwPlxuICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUhhbmRzaGFrZUFja1xuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZUhhbmRzaGFrZUFjazogZnVuY3Rpb24gX2hhbmRsZUhhbmRzaGFrZUFjayhwYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPDw8IGhhbmRzaGFrZS1hY2tcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgIGlmKHRoaXMuX3BpZCAmJiBwYXJhbXMucGlkICE9PSB0aGlzLl9waWQgJiYgdGhpcy5zaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiU2VydmVyIHBpZCBoYXMgY2hhbmdlZCwgcmVsb2FkaW5nIHBhZ2UuXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSwgXy5yYW5kb20oMjAwMCwgMTAwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BpZCA9IHBhcmFtcy5waWQ7XG4gICAgICAgICAgICB0aGlzLl9hY2tub3dsZWRnZUhhbmRzaGFrZShwYXJhbXMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVEZWJ1Z1xuICAgICAgICAqIEBwYXJhbXMge29iamVjdH0gcGFyYW1zXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX2hhbmRsZURlYnVnOiBmdW5jdGlvbiBfaGFuZGxlRGVidWcocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZyhcIjw8PCBkZWJ1Z1wiLCBwYXJhbXMpO1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUi5VcGxpbmsuZGVidWcoLi4uKTpcIiwgcGFyYW1zLmRlYnVnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVMb2dcbiAgICAgICAgKiBAcGFyYW1zIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVMb2c6IGZ1bmN0aW9uIF9oYW5kbGVMb2cocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZyhcIjw8PCBsb2dcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUi5VcGxpbmsubG9nKC4uLik6XCIsIHBhcmFtcy5sb2cpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVXYXJuXG4gICAgICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfaGFuZGxlV2FybjogZnVuY3Rpb24gX2hhbmRsZVdhcm4ocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0xvZyhcIjw8PCB3YXJuXCIsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSLlVwbGluay53YXJuKC4uLik6XCIsIHBhcmFtcy53YXJuKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlRXJyb3JcbiAgICAgICAgKiBAcGFyYW1zIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVFcnJvcjogZnVuY3Rpb24gX2hhbmRsZUVycm9yKHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdMb2coXCI8PDwgZXJyb3JcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSLlVwbGluay5lcnIoLi4uKTpcIiwgcGFyYW1zLmVycik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+T2NjdXJzIHdoZW4gYSBjbGllbnQgdW5sb2FkcyB0aGUgZG9jdW1lbnQ8L3A+XG4gICAgICAgICogQG1ldGhvZCBfaGFuZGxlVW5sb2FkXG4gICAgICAgICogQHBhcmFtcyB7RnVuY3Rpb259IHByZXZIYW5kbGVyIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIHBhZ2Ugd2lsbCBiZSB1bmxvYWRlZFxuICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmdW5jdGlvblxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9oYW5kbGVVbmxvYWQ6IGZ1bmN0aW9uIF9oYW5kbGVVbmxvYWQocHJldkhhbmRsZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmKHByZXZIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoXCJ1bmhhbmRzaGFrZVwiKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPlNpbXBseSBjbG9zZXMgdGhlIHNvY2tldDwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9kZXN0cm95SW5DbGllbnRcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfZGVzdHJveUluQ2xpZW50OiBmdW5jdGlvbiBfZGVzdHJveUluQ2xpZW50KCkge1xuICAgICAgICAgICAgaWYodGhpcy5fc29ja2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkRvZXMgbm90aGluZzwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF9kZXN0cm95SW5DbGllbnRcbiAgICAgICAgKiBAcmV0dXJuIHsqfSB2b2lkMFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9kZXN0cm95SW5TZXJ2ZXI6IGZ1bmN0aW9uIF9kZXN0cm95SW5TZXJ2ZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPk5vdGlmaWVzIHRoZSB1cGxpbmstc2VydmVyIHRoYXQgYSBzdWJzY3JpcHRpb24gaXMgcmVxdWlyZWQgYnkgY2xpZW50PC9wPlxuICAgICAgICAqIEBtZXRob2QgX3N1YnNjcmliZVRvXG4gICAgICAgICogQHJldHVybiB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBzdWJzY3JpYmVcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICBfc3Vic2NyaWJlVG86IGZ1bmN0aW9uIF9zdWJzY3JpYmVUbyhrZXkpIHtcbiAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnJlYWR5O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoXCJzdWJzY3JpYmVUb1wiLCB7IGtleToga2V5IH0pO1xuICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBSLkRlYnVnLnJldGhyb3coXCJSLlVwbGluay5fc3Vic2NyaWJlVG8oLi4uKTogY291bGRuJ3Qgc3Vic2NyaWJlIChcIiArIGtleSArIFwiKVwiKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+Tm90aWZpZXMgdGhlIHVwbGluay1zZXJ2ZXIgdGhhdCBhIHN1YnNjcmlwdGlvbiBpcyBvdmVyPC9wPlxuICAgICAgICAqIEBtZXRob2QgX3N1YnNjcmliZVRvXG4gICAgICAgICogQHJldHVybiB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byB1bnN1YnNjcmliZVxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF91bnN1YnNjcmliZUZyb206IGZ1bmN0aW9uIF91bnN1YnNjcmliZUZyb20oa2V5KSB7XG4gICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0KFwidW5zdWJzY3JpYmVGcm9tXCIsIHsga2V5OiBrZXkgfSk7XG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdyhcIlIuVXBsaW5rLl9zdWJzY3JpYmVUbyguLi4pOiBjb3VsZG4ndCB1bnN1YnNjcmliZSAoXCIgKyBrZXkgKyBcIilcIikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkV0YWJsaXNoZXMgYSBzdWJzY3JpcHRpb24gdG8gYSBrZXksIGFuZCBjYWxsIHRoZSBzcGVjaWZpZWQgZnVuY3Rpb24gd2hlbiBfaGFuZGxlVXBkYXRlIG9jY3VyczwvcD5cbiAgICAgICAgKiBAbWV0aG9kIHN1YnNjcmliZVRvXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHN1YnNjcmliZVxuICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBzdWJzY3JpcHRpb24gVGhlIGNyZWF0ZWQgc3Vic2NyaXB0aW9uXG4gICAgICAgICovXG4gICAgICAgIHN1YnNjcmliZVRvOiBmdW5jdGlvbiBzdWJzY3JpYmVUbyhrZXksIGZuKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IFIuVXBsaW5rLlN1YnNjcmlwdGlvbihrZXkpO1xuICAgICAgICAgICAgaWYoIV8uaGFzKHRoaXMuX3N1YnNjcmlwdGlvbnMsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVUbyhrZXkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHt9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV1bc3Vic2NyaXB0aW9uLnVuaXF1ZUlkXSA9IGZuO1xuICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZW1vdmVzIGEgc3Vic2NyaXB0aW9uIHRvIGEga2V5PC9wPlxuICAgICAgICAqIEBtZXRob2Qgc3Vic2NyaWJlVG9cbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc3Vic2NyaWJlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHN1YnNjcmlwdGlvblxuICAgICAgICAqL1xuICAgICAgICB1bnN1YnNjcmliZUZyb206IGZ1bmN0aW9uIHVuc3Vic2NyaWJlRnJvbShrZXksIHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSwgXCJSLlVwbGluay51bnN1YiguLi4pOiBubyBzdWNoIGtleS5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSwgc3Vic2NyaXB0aW9uLnVuaXF1ZUlkKSwgXCJSLlVwbGluay51bnN1YiguLi4pOiBubyBzdWNoIHN1YnNjcmlwdGlvbi5cIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF07XG4gICAgICAgICAgICBpZihfLnNpemUodGhpcy5fc3Vic2NyaXB0aW9uc1trZXldKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV07XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5faGFzaGVzW2tleV07XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmVGcm9tKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPlNlbmRzIHRoZSBsaXN0ZW5lciBzaWduYWwgXCJsaXN0ZW5Ub1wiPC9wPlxuICAgICAgICAqIEBtZXRob2QgX2xpc3RlblRvXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnROYW1lIHRvIGxpc3RlblxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9saXN0ZW5UbzogZnVuY3Rpb24gX2xpc3RlblRvKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMucmVhZHk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdChcImxpc3RlblRvXCIsIHsgZXZlbnROYW1lOiBldmVudE5hbWUgfSk7XG4gICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdyhcIlIuVXBsaW5rLl9saXN0ZW5UbzogY291bGRuJ3QgbGlzdGVuIChcIiArIGV2ZW50TmFtZSArIFwiKVwiKSk7XG4gICAgICAgIH0sXG4gICAgICAgICAvKipcbiAgICAgICAgKiA8cD5TZW5kcyB0aGUgdW5saXN0ZW5lciBzaWduYWwgXCJ1bmxpc3RlbkZyb21cIjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIF91bmxpc3RlbkZyb21cbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gbGlzdGVuXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgX3VubGlzdGVuRnJvbTogZnVuY3Rpb24gX3VubGlzdGVuRnJvbShldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnJlYWR5O1xuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoXCJ1bmxpc3RlbkZyb21cIiwgeyBldmVudE5hbWU6IGV2ZW50TmFtZSB9KTtcbiAgICAgICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KFwiUi5VcGxpbmsuX3VubGlzdGVuRnJvbTogY291bGRuJ3QgdW5saXN0ZW4gKFwiICsgZXZlbnROYW1lICsgXCIpXCIpKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICogPHA+Q3JlYXRlIGEgbGlzdGVuZXIgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWMgbmFtZTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGxpc3RlblRvXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnROYW1lIHRvIGxpc3RlblxuICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdHJpZ2dlcmVkXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBsaXN0ZW5lciBUaGUgY3JlYXRlZCBsaXN0ZW5lclxuICAgICAgICAqL1xuICAgICAgICBsaXN0ZW5UbzogZnVuY3Rpb24gbGlzdGVuVG8oZXZlbnROYW1lLCBmbikge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gUi5VcGxpbmsuTGlzdGVuZXIoZXZlbnROYW1lKTtcbiAgICAgICAgICAgIGlmKCFfLmhhcyh0aGlzLl9saXN0ZW5lcnMsIGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5UbyhldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXVtsaXN0ZW5lci51bmlxdWVJZF0gPSBmbjtcbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5SZW1vdmUgYSBsaXN0ZW5lciA8L3A+XG4gICAgICAgICogQG1ldGhvZCB1bmxpc3RlbkZyb21cbiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gcmVtb3ZlXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGxpc3RlbmVyXG4gICAgICAgICovXG4gICAgICAgIHVubGlzdGVuRnJvbTogZnVuY3Rpb24gdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX2xpc3RlbmVycywgZXZlbnROYW1lKSwgXCJSLlVwbGluay5yZW1vdmVMaXN0ZW5lciguLi4pOiBubyBzdWNoIGV2ZW50TmFtZS5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLCBsaXN0ZW5lci51bmlxdWVJZCksIFwiUi5VcGxpbmsucmVtb3ZlTGlzdGVuZXIoLi4uKTogbm8gc3VjaCBsaXN0ZW5lci5cIik7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICBpZihfLnNpemUodGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VubGlzdGVuRnJvbShldmVudE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiBAbWV0aG9kIF9nZXRGdWxsVXJsXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN1ZmZpeFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsaXN0ZW5lclxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIF9nZXRGdWxsVXJsOiBmdW5jdGlvbiBfZ2V0RnVsbFVybChzdWZmaXgpIHtcbiAgICAgICAgICAgIGlmKHN1ZmZpeC5zbGljZSgwLCAxKSA9PT0gXCIvXCIgJiYgdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKC0xKSA9PT0gXCIvXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKDAsIC0xKSArIHN1ZmZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9odHRwRW5kcG9pbnQgKyBzdWZmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkZldGNoIGRhdGEgYnkgR0VUIHJlcXVlc3QgZnJvbSB0aGUgdXBsaW5rLXNlcnZlcjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGZldGNoXG4gICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIGZldGNoXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBvYmplY3QgRmV0Y2hlZCBkYXRhIGFjY29yZGluZyB0byB0aGUga2V5XG4gICAgICAgICovXG4gICAgICAgIGZldGNoOiBmdW5jdGlvbiBmZXRjaChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShSLnNjb3BlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPj4+IGZldGNoXCIsIGtleSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5fZ2V0RnVsbFVybChrZXkpLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyLCByZXMsIGJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSLlVwbGluay5mZXRjaCguLi4pOiBjb3VsZG4ndCBmZXRjaCAnXCIgKyBrZXkgKyBcIic6XCIsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIDxwPkRpc3BhdGNoZXMgYW4gYWN0aW9uIGJ5IFBPU1QgcmVxdWVzdCBmcm9tIHRoZSB1cGxpbmstc2VydmVyPC9wPlxuICAgICAgICAqIEBtZXRob2QgZGlzcGF0Y2hcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBzcGVjaWZpYyBhY3Rpb24gdG8gZGlzcGF0Y2hcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXG4gICAgICAgICogQHJldHVybiB7b2JqZWN0fSBvYmplY3QgRmV0Y2hlZCBkYXRhIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIGFjdGlvblxuICAgICAgICAqL1xuICAgICAgICBkaXNwYXRjaDogZnVuY3Rpb24gZGlzcGF0Y2goYWN0aW9uLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShSLnNjb3BlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnTG9nKFwiPj4+IGRpc3BhdGNoXCIsIGFjdGlvbiwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLl9nZXRGdWxsVXJsKGFjdGlvbiksXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHsgZ3VpZDogdGhpcy5fZ3VpZCwgcGFyYW1zOiBwYXJhbXMgfSxcbiAgICAgICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIsIHJlcywgYm9keSkge1xuICAgICAgICAgICAgICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD5EZXN0cm95IHNvY2tldCBjbGllbnQtc2lkZTwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcbiAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGlmKFIuaXNDbGllbnQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lJbkNsaWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoUi5pc1NlcnZlcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveUluU2VydmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBfLmV4dGVuZChVcGxpbmssIHtcbiAgICAgICAgU3Vic2NyaXB0aW9uOiBmdW5jdGlvbiBTdWJzY3JpcHRpb24oa2V5KSB7XG4gICAgICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKFwiUi5VcGxpbmsuU3Vic2NyaXB0aW9uXCIpO1xuICAgICAgICB9LFxuICAgICAgICBMaXN0ZW5lcjogZnVuY3Rpb24gTGlzdGVuZXIoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKFwiUi5VcGxpbmsuTGlzdGVuZXJcIik7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gVXBsaW5rO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==