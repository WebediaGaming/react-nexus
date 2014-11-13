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
var should = _.should;

var Listener = require("./Uplink.Listener");
var Subscription = require("./Uplink.Subscription");

// These socket.io handlers are actually called like Uplink instance method
// (using .call). In their body 'this' is therefore an Uplink instance.
// They are declared here to avoid cluttering the Uplink class definition
// and method naming collisions.
var ioHandlers = {
  connect: function () {},

  disconnect: function () {},

  handshakeAck: function () {},

  update: function () {},

  emit: function () {},

  debug: function () {},

  log: function () {},

  warn: function () {},

  err: function () {} };

var Uplink = (function () {
  var Uplink = function Uplink(_ref) {
    var _this = this;
    var url = _ref.url;
    var guid = _ref.guid;
    var shouldReloadOnServerRestart = _ref.shouldReloadOnServerRestart;

    _.dev(function () {
      return url.should.be.a.String && guid.should.be.a.String;
    });
    this.io = io(url);
    this.guid = guid;
    this.shouldReloadOnServerRestart = shouldReloadOnServerRestart;
    this.handshake = new Promise(function (resolve, reject) {
      return _this._handshake = { resolve: resolve, reject: reject };
    });
    this.listeners = {};
    this.subscriptions = {};
    this.bindIOHandlers();
  };

  _classProps(Uplink, null, {
    bindIOHandlers: {
      writable: true,
      value: function () {
        var _this2 = this;

        Object.keys(ioHandlers).forEach(function (event) {
          return _this2.io.on(event, function (params) {
            return ioHandlers[event].call(_this2, params);
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
    fetch: {
      writable: true,
      value: function (path) {}
    },
    _remoteSubscribeTo: {
      writable: true,
      value: function (path) {
        _.dev(function () {
          return path.should.be.a.String;
        });
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
        }
        return { subscription: subscription, deletedPath: deletedPath };
      }
    },
    update: {
      writable: true,
      value: function (path, value) {
        var _this3 = this;

        _.dev(function () {
          return path.should.be.a.String && (value === null || _.isObject(value)).should.be.ok;
        });
        if (this.subscriptions[path]) {
          Object.keys(this.subscriptions[path]).forEach(function (key) {
            return _this3.subscriptions[path][key].update(value);
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
        var _this4 = this;

        _.dev(function () {
          return room.should.be.a.String && params.should.be.an.Object;
        });
        if (this.listeners[room]) {
          Object.keys(this.listeners[room]).forEach(function (key) {
            return _this4.listeners[room][key].emit(params);
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
  io: null,
  listeners: null,
  shouldReloadOnServerRestart: null,
  subscriptions: null });

module.exports = Uplink;

// class Uplink {
//     /**
//     * <p> Initializes the uplink according to the specifications provided </p>
//     * @method constructor
//     * @param {object} httpEndpoint
//     * @param {object} socketEndpoint
//     * @param {object} guid
//     * @param {object} shouldReloadOnServerRestart
//     */
//     constructor(httpEndpoint, socketEndpoint, guid, shouldReloadOnServerRestart){
//       this._httpEndpoint = httpEndpoint;
//       this._socketEndPoint = socketEndpoint;
//       this._guid = guid;
//       if(R.isClient()) {
//         this._initInClient();
//       }
//       if(R.isServer()) {
//         this._initInServer();
//       }
//       this._data = {};
//       this._hashes = {};
//       this._performUpdateIfNecessary = R.scope(this._performUpdateIfNecessary, this);
//       this._shouldFetchKey = R.scope(this._shouldFetchKey, this);
//       this.fetch = R.scope(this.fetch, this);
//       this.subscribeTo = R.scope(this.subscribeTo, this);
//       this.unsubscribeFrom = R.scope(this.unsubscribeFrom, this);
//       this.listenTo = R.scope(this.listenTo, this);
//       this.unlistenFrom = R.scope(this.unlistenFrom, this);
//       this.dispatch = R.scope(this.dispatch, this);
//       this.shouldReloadOnServerRestart = shouldReloadOnServerRestart;
//     }

//     _debugLog() {
//       let args = arguments;
//       _.dev(() => {
//         console.log.apply(console, args);
//       });
//     }

//     /**
//     * <p>Emits a socket signal to the uplink-server</p>
//     * @param {string} name The name of the signal
//     * @param {object} params The specifics params to send
//     * @private
//     */
//     _emit(name, params) {
//       _.dev(() => this._socket.should.be.ok && (null !== this._socket).should.be.ok);
//       this._debugLog('>>> ' + name, params);
//       this._socket.emit(name, params);
//     }

//     /**
//     * <p> Creating io connection client-side in order to use sockets </p>
//     * @method _initInClient
//     * @private
//     */
//     _initInClient() {
//       _.dev(() => R.isClient().should.be.ok);
//       if(this._socketEndPoint) {
//         let io;
//         if(window.io && _.isFunction(window.io)) {
//           io = window.io;
//         }
//         else {
//           io = require('socket.io-client');
//         }
//         this._subscriptions = {};
//         this._listeners = {};
//             //Connect to uplink server-side. Trigger the uplink-server on io.on("connection")
//             let socket = this._socket = io(this._socketEndPoint);
//             //Prepare all event client-side, listening:
//             socket.on('update', R.scope(this._handleUpdate, this));
//             socket.on('event', R.scope(this._handleEvent, this));
//             socket.on('disconnect', R.scope(this._handleDisconnect, this));
//             socket.on('connect', R.scope(this._handleConnect, this));
//             socket.on('handshake-ack', R.scope(this._handleHandshakeAck, this));
//             socket.on('debug', R.scope(this._handleDebug, this));
//             socket.on('log', R.scope(this._handleLog, this));
//             socket.on('warn', R.scope(this._handleWarn, this));
//             socket.on('err', R.scope(this._handleError, this));
//             this.ready = new Promise((resolve, reject) => {
//               this._acknowledgeHandshake = resolve;
//             });
//             if(window.onbeforeunload) {
//               let prevHandler = window.onbeforeunload;
//               window.onbeforeunload = R.scope(this._handleUnload(prevHandler), this);
//             }
//             else {
//               window.onbeforeunload = R.scope(this._handleUnload(null), this);
//             }
//           }
//           else {
//             this.ready = Promise.cast(true);
//           }
//         }
//     /**
//     * <p>Server-side</p>
//     * @method _initInServer
//     * @private
//     */
//     _initInServer() {
//       _.dev(() => R.isServer().should.be.ok);
//       this.ready = Promise.cast(true);
//     }
//     /**
//     * <p>Triggered when a data is updated according to the specific key <br />
//     * Call corresponding function key </p>
//     * @method _handleUpdate
//     * @param {object} params The specific key
//     * @private
//     */
//     _handleUpdate(params) {
//       this._debugLog('<<< update', params);
//       _.dev(() =>
//         params.should.be.an.object &&
//         params.k.should.be.a.String &&
//         params.v.should.be.ok &&
//         params.d.should.be.an.Array &&
//         params.h.should.be.a.String
//         );
//       let key = params.k;
//       this._performUpdateIfNecessary(key, params)((err, val) => {
//        _.dev(() => {
//         if(err) {
//           throw R.Debug.extendError(err, 'R.Uplink._handleUpdate(...): couldn\'t _performUpdateIfNecessary.');
//         }
//       });
//        if(err) {
//         return;
//       }
//       this._data[key] = val;
//       this._hashes[key] = R.hash(JSON.stringify(val));
//       if(_.has(this._subscriptions, key)) {
//         Object.keys(this._subscriptions[key]).forEach((fn) => {
//           fn(key, val);
//         });
//       }
//     });
//     }
//     /**
//     * @method _shouldFetchKey
//     * @param {string} key
//     * @param {object} entry
//     * @return {Boolean} bool The boolean
//     * @private
//     */
//     _shouldFetchKey(key, entry) {
//       if(!_.has(this._data, key) || !_.has(this._hashes, key)) {
//         return true;
//       }
//       if(this._hashes[key] !== entry.from) {
//         return true;
//       }
//       return false;
//     }

//     /**
//     * <p>Determines if the the data must be fetched</p>
//     * @method _performUpdateIfNecessary
//     * @param {string} key
//     * @param {object} entry
//     * @return {Function} fn The Function to call
//     * @private
//     */
//     _performUpdateIfNecessary(key, entry) {
//       return (fn) => {
//         co(function*() {
//           if(this._shouldFetchKey(key, entry)) {
//             return yield this.fetch(key);
//           }
//           else {
//             return R.patch(this._data[key], entry.diff);
//           }
//         }).call(this, fn);
//       };
//     }

//     /**
//     * @method _handleEvent
//     * @param {string} params
//     * @private
//     */
//     _handleEvent(params) {
//       this._debugLog('<<< event', params.eventName);
//       let eventName = params.eventName;
//       let eventParams = params.params;
//       if(_.has(this._listeners, eventName)) {
//         Object.keys(this._listeners[eventName]).forEach((fn) => {
//           fn(eventParams);
//         });
//       }
//     }

//     /**
//     * @method _handleDisconnect
//     * @param {string} params
//     * @private
//     */
//     _handleDisconnect(params) {
//       this._debugLog('<<< disconnect', params);
//       this.ready = new Promise((resolve, reject) => {
//         this._acknowledgeHandshake = resolve;
//       });
//     }

//     /**
//     * <p>Occurs after a connection. When a connection is established, the client sends a signal "handshake".</p>
//     * @method _handleDisconnect
//     * @private
//     */
//     _handleConnect() {
//       this._debugLog('<<< connect');
//         //notify uplink-server
//         this._emit('handshake', { guid: this._guid });
//       }

//     /**
//     * <p> Identifies if the pid of the server has changed (due to a potential reboot server-side) since the last client connection. <br />
//     * If this is the case, a page reload is performed<p>
//     * @method _handleHandshakeAck
//     * @params {object} params
//     * @private
//     */
//     _handleHandshakeAck(params) {
//       this._debugLog('<<< handshake-ack', params);
//       if(this._pid && params.pid !== this._pid && this.shouldReloadOnServerRestart) {
//         _.dev(() => {
//           console.warn('Server pid has changed, reloading page.');
//         });
//         setTimeout(() => {
//           window.location.reload(true);
//         }, _.random(2000, 10000));
//       }
//       this._pid = params.pid;
//       this._acknowledgeHandshake(params);
//     }

//     /**
//     * @method _handleDebug
//     * @params {object} params
//     * @private
//     */
//     _handleDebug(params) {
//       this._debugLog('<<< debug', params);
//       _.dev(() => {
//         console.warn('R.Uplink.debug(...):', params.debug);
//       });
//     }

//     /**
//     * @method _handleLog
//     * @params {object} params
//     * @private
//     */
//     _handleLog(params) {
//       this._debugLog('<<< log', params);
//       console.log('R.Uplink.log(...):', params.log);
//     }

//     /**
//     * @method _handleWarn
//     * @params {object} params
//     * @private
//     */
//     _handleWarn(params) {
//       this._debugLog('<<< warn', params);
//       console.warn('R.Uplink.warn(...):', params.warn);
//     }

//     /**
//     * @method _handleError
//     * @params {object} params
//     * @private
//     */
//     _handleError(params) {
//       this._debugLog('<<< error', params);
//       console.error('R.Uplink.err(...):', params.err);
//     }

//     /**
//     * <p>Occurs when a client unloads the document</p>
//     * @method _handleUnload
//     * @params {Function} prevHandler The function to execute when the page will be unloaded
//     * @return {Function} function
//     * @private
//     */
//     _handleUnload(prevHandler) {
//       return () => {
//         if(prevHandler) {
//           prevHandler();
//         }
//         this._emit('unhandshake');
//       };
//     }

//     /**
//     * <p>Simply closes the socket</p>
//     * @method _destroyInClient
//     * @private
//     */
//     _destroyInClient() {
//       if(this._socket) {
//         this._socket.close();
//       }
//     }
//     /**
//     * <p>Does nothing</p>
//     * @method _destroyInClient
//     * @return {*} void0
//     * @private
//     */
//     _destroyInServer() {
//       return void 0;
//     }

//     /**
//     * <p>Notifies the uplink-server that a subscription is required by client</p>
//     * @method _subscribeTo
//     * @return {string} key The key to subscribe
//     * @private
//     */
//     _subscribeTo(key) {
//       co(function*() {
//         yield this.ready;
//         this._emit('subscribeTo', { key: key });
//       }).call(this, R.Debug.rethrow('R.Uplink._subscribeTo(...): couldn\'t subscribe (' + key + ')'));
//     }

//     /**
//     * <p>Notifies the uplink-server that a subscription is over</p>
//     * @method _subscribeTo
//     * @return {string} key The key to unsubscribe
//     * @private
//     */
//     _unsubscribeFrom(key) {
//       co(function*() {
//         yield this.ready;
//         this._emit('unsubscribeFrom', { key: key });
//       }).call(this, R.Debug.rethrow('R.Uplink._subscribeTo(...): couldn\'t unsubscribe (' + key + ')'));
//     }

//     /**
//     * <p>Etablishes a subscription to a key, and call the specified function when _handleUpdate occurs</p>
//     * @method subscribeTo
//     * @param {string} key The key to subscribe
//     * @param {function} fn The function to execute
//     * @return {object} subscription The created subscription
//     */
//     subscribeTo(key, fn) {
//       let subscription = new R.Uplink.Subscription(key);
//       if(!_.has(this._subscriptions, key)) {
//         this._subscribeTo(key);
//         this._subscriptions[key] = {};
//         this._data[key] = {};
//         this._hashes[key] = R.hash(JSON.stringify({}));
//       }
//       this._subscriptions[key][subscription.uniqueId] = fn;
//       return subscription;
//     }

//     /**
//     * <p>Removes a subscription to a key</p>
//     * @method subscribeTo
//     * @param {string} key The key to subscribe
//     * @param {object} subscription
//     */
//     unsubscribeFrom(key, subscription) {
//       _.dev(() =>
//         this._subscriptions.should.be.an.Object &&
//         this._subscriptions[key].should.be.ok &&
//         this._subscriptions[key].should.be.an.Object &&
//         this._subscriptions[key][subscription.uniqueId].should.be.ok &&
//         this._subscriptions[key][subscription.uniqueId].should.be.a.String
//         );
//       delete this._subscriptions[key][subscription.uniqueId];
//       if(_.size(this._subscriptions[key]) === 0) {
//         delete this._subscriptions[key];
//         delete this._data[key];
//         delete this._hashes[key];
//         this._unsubscribeFrom(key);
//       }
//     }

//     /**
//     * <p>Sends the listener signal "listenTo"</p>
//     * @method _listenTo
//     * @param {string} eventName The eventName to listen
//     * @private
//     */
//     _listenTo(eventName) {
//       co(function*() {
//         yield this.ready;
//         this._emit('listenTo', { eventName: eventName });
//       }).call(this, R.Debug.rethrow('R.Uplink._listenTo: couldn\'t listen (' + eventName + ')'));
//     }

//      /**
//     * <p>Sends the unlistener signal "unlistenFrom"</p>
//     * @method _unlistenFrom
//     * @param {string} eventName The eventName to listen
//     * @private
//     */
//     _unlistenFrom(eventName) {
//       co(function*() {
//         yield this.ready;
//         this._emit('unlistenFrom', { eventName: eventName });
//       }).call(this, R.Debug.rethrow('R.Uplink._unlistenFrom: couldn\'t unlisten (' + eventName + ')'));
//     }

//     /**
//     * <p>Create a listener according to a specific name</p>
//     * @method listenTo
//     * @param {string} eventName The eventName to listen
//     * @param {function} fn The function to execute when triggered
//     * @return {object} listener The created listener
//     */
//     listenTo(eventName, fn) {
//       let listener = R.Uplink.Listener(eventName);
//       if(!_.has(this._listeners, eventName)) {
//         this._listenTo(eventName);
//         this._listeners[eventName] = {};
//       }
//       this._listeners[eventName][listener.uniqueId] = fn;
//       return listener;
//     }

//     /**
//     * <p>Remove a listener </p>
//     * @method unlistenFrom
//     * @param {string} eventName The eventName to remove
//     * @param {object} listener
//     */
//     unlistenFrom(eventName, listener) {
//       _.dev(() =>
//         this._listeners.should.be.an.Object &&
//         this._listeners[eventName].should.be.ok &&
//         this._listeners[eventName].should.be.an.Object &&
//         this._listeners[eventName][listener.uniqueId].should.be.ok &&
//         this._listeners[eventName][listener.uniqueId].should.be.a.String
//         );
//       delete this._listeners[eventName];
//       if(_.size(this._listeners[eventName]) === 0) {
//         delete this._listeners[eventName];
//         this._unlistenFrom(eventName);
//       }
//     }
//     /**
//     * @method _getFullUrl
//     * @param {string} suffix
//     * @param {object} listener
//     * @private
//     */
//     _getFullUrl(suffix) {
//       if(suffix.slice(0, 1) === '/' && this._httpEndpoint.slice(-1) === '/') {
//         return this._httpEndpoint.slice(0, -1) + suffix;
//       }
//       else {
//         return this._httpEndpoint + suffix;
//       }
//     }

//     /**
//     * <p>Fetch data by GET request from the uplink-server</p>
//     * @method fetch
//     * @param {string} key The key to fetch
//     * @return {object} object Fetched data according to the key
//     */
//     fetch(key) {
//       return new Promise((resolve, reject) => {
//         this._debugLog('>>> fetch', key);
//         request({
//           url: this._getFullUrl(key),
//           method: 'GET',
//           json: true,
//           withCredentials: false,
//         }, function(err, res, body) {
//           if(err) {
//             _.dev(() => {
//               console.warn('R.Uplink.fetch(...): couldn\'t fetch \'' + key + '\':', err.toString());
//             });
//             return resolve(null);
//           }
//           else {
//             return resolve(body);
//           }
//         });
//       });
//     }

//     /**
//     * <p>Dispatches an action by POST request from the uplink-server</p>
//     * @method dispatch
//     * @param {object} action The specific action to dispatch
//     * @param {object} params
//     * @return {object} object Fetched data according to the specified action
//     */
//     dispatch(action, params) {
//       return new Promise((resolve, reject) => {
//         this._debugLog('>>> dispatch', action, params);
//         request({
//           url: this._getFullUrl(action),
//           method: 'POST',
//           body: { guid: this._guid, params: params },
//           json: true,
//           withCredentials: false,
//         }, function(err, res, body) {
//           if(err) {
//             reject(err);
//           }
//           else {
//             resolve(body);
//           }
//         });
//       });
//     }

//     /**
//     * <p>Destroy socket client-side</p>
//     * @method destroy
//     */
//     destroy() {
//       if(R.isClient()) {
//         this._destroyInClient();
//       }
//       if(R.isServer()) {
//         this._destroyInServer();
//       }
//     }
//   }

//   _.extend(Uplink.prototype, /** @lends R.Uplink.prototype */ {
//     _httpEndpoint: null,
//     _socketEndPoint: null,
//     _subscriptions: null,
//     _listeners: null,
//     _socket: null,
//     _guid: null,
//     _pid: null,
//     ready: null,
//     shouldReloadOnServerRestart: null,
//     _acknowledgeHandshake: null,
//   });

//   _.extend(Uplink, {
//     Subscription(key) {
//       this.key = key;
//       this.uniqueId = _.uniqueId('R.Uplink.Subscription');
//     },
//     Listener(eventName) {
//       this.eventName = eventName;
//       this.uniqueId = _.uniqueId('R.Uplink.Listener');
//     },
//   });

//   return Uplink;
// };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9VcGxpbmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvRSxJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOztBQUV4QixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5QyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7Ozs7O0FBTXRELElBQU0sVUFBVSxHQUFHO0FBQ2pCLFNBQU8sRUFBQSxZQUFHLEVBRVQ7O0FBRUQsWUFBVSxFQUFBLFlBQUcsRUFFWjs7QUFFRCxjQUFZLEVBQUEsWUFBRyxFQUVkOztBQUVELFFBQU0sRUFBQSxZQUFHLEVBRVI7O0FBRUQsUUFBSSxZQUFHLEVBRU47O0FBRUQsT0FBSyxFQUFBLFlBQUcsRUFFUDs7QUFFRCxLQUFHLEVBQUEsWUFBRyxFQUVMOztBQUVELE1BQUksRUFBQSxZQUFHLEVBRU47O0FBRUQsS0FBRyxFQUFBLFlBQUcsRUFFTCxFQUNGLENBQUM7O0lBRUksTUFBTTtNQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sT0FDOEM7O1FBQTFDLEdBQUcsUUFBSCxHQUFHO1FBQUUsSUFBSSxRQUFKLElBQUk7UUFBRSwyQkFBMkIsUUFBM0IsMkJBQTJCOztBQUNsRCxLQUFD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SCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJVcGxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gtbmV4dCcpO1xuXG5jb25zdCBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcbmNvbnN0IHJlcXVlc3QgPSBfLmlzU2VydmVyKCkgPyByZXF1aXJlKCdyZXF1ZXN0JykgOiByZXF1aXJlKCdicm93c2VyLXJlcXVlc3QnKTtcbmNvbnN0IHNob3VsZCA9IF8uc2hvdWxkO1xuXG5jb25zdCBMaXN0ZW5lciA9IHJlcXVpcmUoJy4vVXBsaW5rLkxpc3RlbmVyJyk7XG5jb25zdCBTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuL1VwbGluay5TdWJzY3JpcHRpb24nKTtcblxuLy8gVGhlc2Ugc29ja2V0LmlvIGhhbmRsZXJzIGFyZSBhY3R1YWxseSBjYWxsZWQgbGlrZSBVcGxpbmsgaW5zdGFuY2UgbWV0aG9kXG4vLyAodXNpbmcgLmNhbGwpLiBJbiB0aGVpciBib2R5ICd0aGlzJyBpcyB0aGVyZWZvcmUgYW4gVXBsaW5rIGluc3RhbmNlLlxuLy8gVGhleSBhcmUgZGVjbGFyZWQgaGVyZSB0byBhdm9pZCBjbHV0dGVyaW5nIHRoZSBVcGxpbmsgY2xhc3MgZGVmaW5pdGlvblxuLy8gYW5kIG1ldGhvZCBuYW1pbmcgY29sbGlzaW9ucy5cbmNvbnN0IGlvSGFuZGxlcnMgPSB7XG4gIGNvbm5lY3QoKSB7XG5cbiAgfSxcblxuICBkaXNjb25uZWN0KCkge1xuXG4gIH0sXG5cbiAgaGFuZHNoYWtlQWNrKCkge1xuXG4gIH0sXG5cbiAgdXBkYXRlKCkge1xuXG4gIH0sXG5cbiAgZW1pdCgpIHtcblxuICB9LFxuXG4gIGRlYnVnKCkge1xuXG4gIH0sXG5cbiAgbG9nKCkge1xuXG4gIH0sXG5cbiAgd2FybigpIHtcblxuICB9LFxuXG4gIGVycigpIHtcblxuICB9LFxufTtcblxuY2xhc3MgVXBsaW5rIHtcbiAgY29uc3RydWN0b3IoeyB1cmwsIGd1aWQsIHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydCB9KSB7XG4gICAgXy5kZXYoKCkgPT4gdXJsLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmdcbiAgICAgICk7XG4gICAgdGhpcy5pbyA9IGlvKHVybCk7XG4gICAgdGhpcy5ndWlkID0gZ3VpZDtcbiAgICB0aGlzLnNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydCA9IHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydDtcbiAgICB0aGlzLmhhbmRzaGFrZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHRoaXMuX2hhbmRzaGFrZSA9IHsgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0ge307XG4gICAgdGhpcy5iaW5kSU9IYW5kbGVycygpO1xuICB9XG5cbiAgYmluZElPSGFuZGxlcnMoKSB7XG4gICAgT2JqZWN0LmtleXMoaW9IYW5kbGVycylcbiAgICAuZm9yRWFjaCgoZXZlbnQpID0+IHRoaXMuaW8ub24oZXZlbnQsIChwYXJhbXMpID0+IGlvSGFuZGxlcnNbZXZlbnRdLmNhbGwodGhpcywgcGFyYW1zKSkpO1xuICB9XG5cbiAgcHVzaChldmVudCwgcGFyYW1zKSB7XG4gICAgdGhpcy5pby5lbWl0KGV2ZW50LCBwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZmV0Y2gocGF0aCkge1xuXG4gIH1cblxuICBfcmVtb3RlU3Vic2NyaWJlVG8ocGF0aCkge1xuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICB0aGlzLmlvLmVtaXQoJ3N1YnNjcmliZVRvJywgeyBwYXRoIH0pO1xuICB9XG5cbiAgX3JlbW90ZVVuc3Vic2NyaWJlRnJvbShwYXRoKSB7XG4gICAgXy5kZXYoKCkgPT4gcGF0aC5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIHRoaXMuaW8uZW1pdCgndW5zdWJzY3JpYmVGcm9tJywgeyBwYXRoIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlVG8ocGF0aCwgaGFuZGxlcikge1xuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgKTtcbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih7IHBhdGgsIGhhbmRsZXIgfSk7XG4gICAgbGV0IGNyZWF0ZWRQYXRoID0gc3Vic2NyaXB0aW9uLmFkZFRvKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgaWYoY3JlYXRlZFBhdGgpIHtcbiAgICAgIHRoaXMuX3JlbW90ZVN1YnNjcmliZVRvKHBhdGgpO1xuICAgIH1cbiAgICByZXR1cm4geyBzdWJzY3JpcHRpb24sIGNyZWF0ZWRQYXRoIH07XG4gIH1cblxuICB1bnN1YnNjcmliZUZyb20oc3Vic2NyaXB0aW9uKSB7XG4gICAgXy5kZXYoKCkgPT4gc3Vic2NyaXB0aW9uLnNob3VsZC5iZS5hbi5pbnN0YW5jZU9mKFN1YnNjcmlwdGlvbikpO1xuICAgIGxldCBkZWxldGVkUGF0aCA9IHN1YnNjcmlwdGlvbi5yZW1vdmVGcm9tKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgaWYoZGVsZXRlZFBhdGgpIHtcbiAgICAgIHRoaXMuX3JlbW90ZVVuc3Vic2NyaWJlRnJvbShzdWJzY3JpcHRpb24ucGF0aCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN1YnNjcmlwdGlvbiwgZGVsZXRlZFBhdGggfTtcbiAgfVxuXG4gIHVwZGF0ZShwYXRoLCB2YWx1ZSkge1xuICAgIF8uZGV2KCgpID0+IHBhdGguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAodmFsdWUgPT09IG51bGwgfHwgXy5pc09iamVjdCh2YWx1ZSkpLnNob3VsZC5iZS5va1xuICAgICk7XG4gICAgaWYodGhpcy5zdWJzY3JpcHRpb25zW3BhdGhdKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF0pXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB0aGlzLnN1YnNjcmlwdGlvbnNbcGF0aF1ba2V5XS51cGRhdGUodmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBfcmVtb3RlTGlzdGVuVG8ocm9vbSkge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nKTtcbiAgICB0aGlzLmlvLmVtaXQoJ2xpc3RlblRvJywgeyByb29tIH0pO1xuICB9XG5cbiAgX3JlbW90ZVVubGlzdGVuRnJvbShyb29tKSB7XG4gICAgXy5kZXYoKCkgPT4gcm9vbS5zaG91bGQuYmUuYS5TdHJpbmcpO1xuICAgIHRoaXMuaW8uZW1pdCgndW5saXN0ZW5Gcm9tJywgeyByb29tIH0pO1xuICB9XG5cbiAgbGlzdGVuVG8ocm9vbSwgaGFuZGxlcikge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBoYW5kbGVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgKTtcbiAgICBsZXQgbGlzdGVuZXIgPSBuZXcgTGlzdGVuZXIoeyByb29tLCBoYW5kbGVyIH0pO1xuICAgIGxldCBjcmVhdGVkUm9vbSA9IGxpc3RlbmVyLmFkZFRvKHRoaXMubGlzdGVuZXJzKTtcbiAgICBpZihjcmVhdGVkUm9vbSkge1xuICAgICAgdGhpcy5fcmVtb3RlTGlzdGVuVG8ocm9vbSk7XG4gICAgfVxuICAgIHJldHVybiB7IGxpc3RlbmVyLCBjcmVhdGVkUm9vbSB9O1xuICB9XG5cbiAgdW5saXN0ZW5Gcm9tKGxpc3RlbmVyKSB7XG4gICAgXy5kZXYoKCkgPT4gbGlzdGVuZXIuc2hvdWxkLmJlLmFuLmluc3RhbmNlT2YoTGlzdGVuZXIpKTtcbiAgICBsZXQgZGVsZXRlZFJvb20gPSBzdWJzY3JpcHRpb24ucmVtb3ZlRnJvbSh0aGlzLmxpc3RlbmVycyk7XG4gICAgaWYoZGVsZXRlZFJvb20pIHtcbiAgICAgIHRoaXMuX3JlbW90ZVVubGlzdGVuRnJvbShsaXN0ZW5lci5yb29tKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgbGlzdGVuZXIsIGRlbGV0ZWRSb29tIH07XG4gIH1cblxuICBlbWl0KHJvb20sIHBhcmFtcykge1xuICAgIF8uZGV2KCgpID0+IHJvb20uc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICBwYXJhbXMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgICk7XG4gICAgaWYodGhpcy5saXN0ZW5lcnNbcm9vbV0pIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzW3Jvb21dKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4gdGhpcy5saXN0ZW5lcnNbcm9vbV1ba2V5XS5lbWl0KHBhcmFtcykpO1xuICAgIH1cbiAgfVxufVxuXG5fLmV4dGVuZChVcGxpbmsucHJvdG90eXBlLCB7XG4gIGd1aWQ6IG51bGwsXG4gIGhhbmRzaGFrZTogbnVsbCxcbiAgaW86IG51bGwsXG4gIGxpc3RlbmVyczogbnVsbCxcbiAgc2hvdWxkUmVsb2FkT25TZXJ2ZXJSZXN0YXJ0OiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXBsaW5rO1xuXG4vLyBjbGFzcyBVcGxpbmsge1xuXG4vLyAgICAgLyoqXG4vLyAgICAgKiA8cD4gSW5pdGlhbGl6ZXMgdGhlIHVwbGluayBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvcD5cbi8vICAgICAqIEBtZXRob2QgY29uc3RydWN0b3Jcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBodHRwRW5kcG9pbnRcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzb2NrZXRFbmRwb2ludFxuLy8gICAgICogQHBhcmFtIHtvYmplY3R9IGd1aWRcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnRcbi8vICAgICAqL1xuLy8gICAgIGNvbnN0cnVjdG9yKGh0dHBFbmRwb2ludCwgc29ja2V0RW5kcG9pbnQsIGd1aWQsIHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydCl7XG4vLyAgICAgICB0aGlzLl9odHRwRW5kcG9pbnQgPSBodHRwRW5kcG9pbnQ7XG4vLyAgICAgICB0aGlzLl9zb2NrZXRFbmRQb2ludCA9IHNvY2tldEVuZHBvaW50O1xuLy8gICAgICAgdGhpcy5fZ3VpZCA9IGd1aWQ7XG4vLyAgICAgICBpZihSLmlzQ2xpZW50KCkpIHtcbi8vICAgICAgICAgdGhpcy5faW5pdEluQ2xpZW50KCk7XG4vLyAgICAgICB9XG4vLyAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbi8vICAgICAgICAgdGhpcy5faW5pdEluU2VydmVyKCk7XG4vLyAgICAgICB9XG4vLyAgICAgICB0aGlzLl9kYXRhID0ge307XG4vLyAgICAgICB0aGlzLl9oYXNoZXMgPSB7fTtcbi8vICAgICAgIHRoaXMuX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeSA9IFIuc2NvcGUodGhpcy5fcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5LCB0aGlzKTtcbi8vICAgICAgIHRoaXMuX3Nob3VsZEZldGNoS2V5ID0gUi5zY29wZSh0aGlzLl9zaG91bGRGZXRjaEtleSwgdGhpcyk7XG4vLyAgICAgICB0aGlzLmZldGNoID0gUi5zY29wZSh0aGlzLmZldGNoLCB0aGlzKTtcbi8vICAgICAgIHRoaXMuc3Vic2NyaWJlVG8gPSBSLnNjb3BlKHRoaXMuc3Vic2NyaWJlVG8sIHRoaXMpO1xuLy8gICAgICAgdGhpcy51bnN1YnNjcmliZUZyb20gPSBSLnNjb3BlKHRoaXMudW5zdWJzY3JpYmVGcm9tLCB0aGlzKTtcbi8vICAgICAgIHRoaXMubGlzdGVuVG8gPSBSLnNjb3BlKHRoaXMubGlzdGVuVG8sIHRoaXMpO1xuLy8gICAgICAgdGhpcy51bmxpc3RlbkZyb20gPSBSLnNjb3BlKHRoaXMudW5saXN0ZW5Gcm9tLCB0aGlzKTtcbi8vICAgICAgIHRoaXMuZGlzcGF0Y2ggPSBSLnNjb3BlKHRoaXMuZGlzcGF0Y2gsIHRoaXMpO1xuLy8gICAgICAgdGhpcy5zaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQgPSBzaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQ7XG4vLyAgICAgfVxuXG4vLyAgICAgX2RlYnVnTG9nKCkge1xuLy8gICAgICAgbGV0IGFyZ3MgPSBhcmd1bWVudHM7XG4vLyAgICAgICBfLmRldigoKSA9PiB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuLy8gICAgICAgfSk7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoqXG4vLyAgICAgKiA8cD5FbWl0cyBhIHNvY2tldCBzaWduYWwgdG8gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4vLyAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgc2lnbmFsXG4vLyAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFRoZSBzcGVjaWZpY3MgcGFyYW1zIHRvIHNlbmRcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfZW1pdChuYW1lLCBwYXJhbXMpIHtcbi8vICAgICAgIF8uZGV2KCgpID0+IHRoaXMuX3NvY2tldC5zaG91bGQuYmUub2sgJiYgKG51bGwgIT09IHRoaXMuX3NvY2tldCkuc2hvdWxkLmJlLm9rKTtcbi8vICAgICAgIHRoaXMuX2RlYnVnTG9nKCc+Pj4gJyArIG5hbWUsIHBhcmFtcyk7XG4vLyAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChuYW1lLCBwYXJhbXMpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+IENyZWF0aW5nIGlvIGNvbm5lY3Rpb24gY2xpZW50LXNpZGUgaW4gb3JkZXIgdG8gdXNlIHNvY2tldHMgPC9wPlxuLy8gICAgICogQG1ldGhvZCBfaW5pdEluQ2xpZW50XG4vLyAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICovXG4vLyAgICAgX2luaXRJbkNsaWVudCgpIHtcbi8vICAgICAgIF8uZGV2KCgpID0+IFIuaXNDbGllbnQoKS5zaG91bGQuYmUub2spO1xuLy8gICAgICAgaWYodGhpcy5fc29ja2V0RW5kUG9pbnQpIHtcbi8vICAgICAgICAgbGV0IGlvO1xuLy8gICAgICAgICBpZih3aW5kb3cuaW8gJiYgXy5pc0Z1bmN0aW9uKHdpbmRvdy5pbykpIHtcbi8vICAgICAgICAgICBpbyA9IHdpbmRvdy5pbztcbi8vICAgICAgICAgfVxuLy8gICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG4vLyAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuLy8gICAgICAgICAgICAgLy9Db25uZWN0IHRvIHVwbGluayBzZXJ2ZXItc2lkZS4gVHJpZ2dlciB0aGUgdXBsaW5rLXNlcnZlciBvbiBpby5vbihcImNvbm5lY3Rpb25cIilcbi8vICAgICAgICAgICAgIGxldCBzb2NrZXQgPSB0aGlzLl9zb2NrZXQgPSBpbyh0aGlzLl9zb2NrZXRFbmRQb2ludCk7XG4vLyAgICAgICAgICAgICAvL1ByZXBhcmUgYWxsIGV2ZW50IGNsaWVudC1zaWRlLCBsaXN0ZW5pbmc6XG4vLyAgICAgICAgICAgICBzb2NrZXQub24oJ3VwZGF0ZScsIFIuc2NvcGUodGhpcy5faGFuZGxlVXBkYXRlLCB0aGlzKSk7XG4vLyAgICAgICAgICAgICBzb2NrZXQub24oJ2V2ZW50JywgUi5zY29wZSh0aGlzLl9oYW5kbGVFdmVudCwgdGhpcykpO1xuLy8gICAgICAgICAgICAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgUi5zY29wZSh0aGlzLl9oYW5kbGVEaXNjb25uZWN0LCB0aGlzKSk7XG4vLyAgICAgICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUNvbm5lY3QsIHRoaXMpKTtcbi8vICAgICAgICAgICAgIHNvY2tldC5vbignaGFuZHNoYWtlLWFjaycsIFIuc2NvcGUodGhpcy5faGFuZGxlSGFuZHNoYWtlQWNrLCB0aGlzKSk7XG4vLyAgICAgICAgICAgICBzb2NrZXQub24oJ2RlYnVnJywgUi5zY29wZSh0aGlzLl9oYW5kbGVEZWJ1ZywgdGhpcykpO1xuLy8gICAgICAgICAgICAgc29ja2V0Lm9uKCdsb2cnLCBSLnNjb3BlKHRoaXMuX2hhbmRsZUxvZywgdGhpcykpO1xuLy8gICAgICAgICAgICAgc29ja2V0Lm9uKCd3YXJuJywgUi5zY29wZSh0aGlzLl9oYW5kbGVXYXJuLCB0aGlzKSk7XG4vLyAgICAgICAgICAgICBzb2NrZXQub24oJ2VycicsIFIuc2NvcGUodGhpcy5faGFuZGxlRXJyb3IsIHRoaXMpKTtcbi8vICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAgICAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgaWYod2luZG93Lm9uYmVmb3JldW5sb2FkKSB7XG4vLyAgICAgICAgICAgICAgIGxldCBwcmV2SGFuZGxlciA9IHdpbmRvdy5vbmJlZm9yZXVubG9hZDtcbi8vICAgICAgICAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gUi5zY29wZSh0aGlzLl9oYW5kbGVVbmxvYWQocHJldkhhbmRsZXIpLCB0aGlzKTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBSLnNjb3BlKHRoaXMuX2hhbmRsZVVubG9hZChudWxsKSwgdGhpcyk7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UuY2FzdCh0cnVlKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAvKipcbi8vICAgICAqIDxwPlNlcnZlci1zaWRlPC9wPlxuLy8gICAgICogQG1ldGhvZCBfaW5pdEluU2VydmVyXG4vLyAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICovXG4vLyAgICAgX2luaXRJblNlcnZlcigpIHtcbi8vICAgICAgIF8uZGV2KCgpID0+IFIuaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2spO1xuLy8gICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UuY2FzdCh0cnVlKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgKiA8cD5UcmlnZ2VyZWQgd2hlbiBhIGRhdGEgaXMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljIGtleSA8YnIgLz5cbi8vICAgICAqIENhbGwgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBrZXkgPC9wPlxuLy8gICAgICogQG1ldGhvZCBfaGFuZGxlVXBkYXRlXG4vLyAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFRoZSBzcGVjaWZpYyBrZXlcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlVXBkYXRlKHBhcmFtcykge1xuLy8gICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCB1cGRhdGUnLCBwYXJhbXMpO1xuLy8gICAgICAgXy5kZXYoKCkgPT5cbi8vICAgICAgICAgcGFyYW1zLnNob3VsZC5iZS5hbi5vYmplY3QgJiZcbi8vICAgICAgICAgcGFyYW1zLmsuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4vLyAgICAgICAgIHBhcmFtcy52LnNob3VsZC5iZS5vayAmJlxuLy8gICAgICAgICBwYXJhbXMuZC5zaG91bGQuYmUuYW4uQXJyYXkgJiZcbi8vICAgICAgICAgcGFyYW1zLmguc2hvdWxkLmJlLmEuU3RyaW5nXG4vLyAgICAgICAgICk7XG4vLyAgICAgICBsZXQga2V5ID0gcGFyYW1zLms7XG4vLyAgICAgICB0aGlzLl9wZXJmb3JtVXBkYXRlSWZOZWNlc3Nhcnkoa2V5LCBwYXJhbXMpKChlcnIsIHZhbCkgPT4ge1xuLy8gICAgICAgIF8uZGV2KCgpID0+IHtcbi8vICAgICAgICAgaWYoZXJyKSB7XG4vLyAgICAgICAgICAgdGhyb3cgUi5EZWJ1Zy5leHRlbmRFcnJvcihlcnIsICdSLlVwbGluay5faGFuZGxlVXBkYXRlKC4uLik6IGNvdWxkblxcJ3QgX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeS4nKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSk7XG4vLyAgICAgICAgaWYoZXJyKSB7XG4vLyAgICAgICAgIHJldHVybjtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcbi8vICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuLy8gICAgICAgaWYoXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSkge1xuLy8gICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zdWJzY3JpcHRpb25zW2tleV0pLmZvckVhY2goKGZuKSA9PiB7XG4vLyAgICAgICAgICAgZm4oa2V5LCB2YWwpO1xuLy8gICAgICAgICB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIF9zaG91bGRGZXRjaEtleVxuLy8gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuLy8gICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5XG4vLyAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBib29sIFRoZSBib29sZWFuXG4vLyAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICovXG4vLyAgICAgX3Nob3VsZEZldGNoS2V5KGtleSwgZW50cnkpIHtcbi8vICAgICAgIGlmKCFfLmhhcyh0aGlzLl9kYXRhLCBrZXkpIHx8ICFfLmhhcyh0aGlzLl9oYXNoZXMsIGtleSkpIHtcbi8vICAgICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgICB9XG4vLyAgICAgICBpZih0aGlzLl9oYXNoZXNba2V5XSAhPT0gZW50cnkuZnJvbSkge1xuLy8gICAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBmYWxzZTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPkRldGVybWluZXMgaWYgdGhlIHRoZSBkYXRhIG11c3QgYmUgZmV0Y2hlZDwvcD5cbi8vICAgICAqIEBtZXRob2QgX3BlcmZvcm1VcGRhdGVJZk5lY2Vzc2FyeVxuLy8gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuLy8gICAgICogQHBhcmFtIHtvYmplY3R9IGVudHJ5XG4vLyAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm4gVGhlIEZ1bmN0aW9uIHRvIGNhbGxcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfcGVyZm9ybVVwZGF0ZUlmTmVjZXNzYXJ5KGtleSwgZW50cnkpIHtcbi8vICAgICAgIHJldHVybiAoZm4pID0+IHtcbi8vICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuLy8gICAgICAgICAgIGlmKHRoaXMuX3Nob3VsZEZldGNoS2V5KGtleSwgZW50cnkpKSB7XG4vLyAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5mZXRjaChrZXkpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgIHJldHVybiBSLnBhdGNoKHRoaXMuX2RhdGFba2V5XSwgZW50cnkuZGlmZik7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KS5jYWxsKHRoaXMsIGZuKTtcbi8vICAgICAgIH07XG4vLyAgICAgfVxuXG4vLyAgICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIF9oYW5kbGVFdmVudFxuLy8gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtc1xuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9oYW5kbGVFdmVudChwYXJhbXMpIHtcbi8vICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgZXZlbnQnLCBwYXJhbXMuZXZlbnROYW1lKTtcbi8vICAgICAgIGxldCBldmVudE5hbWUgPSBwYXJhbXMuZXZlbnROYW1lO1xuLy8gICAgICAgbGV0IGV2ZW50UGFyYW1zID0gcGFyYW1zLnBhcmFtcztcbi8vICAgICAgIGlmKF8uaGFzKHRoaXMuX2xpc3RlbmVycywgZXZlbnROYW1lKSkge1xuLy8gICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSkuZm9yRWFjaCgoZm4pID0+IHtcbi8vICAgICAgICAgICBmbihldmVudFBhcmFtcyk7XG4vLyAgICAgICAgIH0pO1xuLy8gICAgICAgfVxuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCBfaGFuZGxlRGlzY29ubmVjdFxuLy8gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtc1xuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9oYW5kbGVEaXNjb25uZWN0KHBhcmFtcykge1xuLy8gICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBkaXNjb25uZWN0JywgcGFyYW1zKTtcbi8vICAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlID0gcmVzb2x2ZTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+T2NjdXJzIGFmdGVyIGEgY29ubmVjdGlvbi4gV2hlbiBhIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQsIHRoZSBjbGllbnQgc2VuZHMgYSBzaWduYWwgXCJoYW5kc2hha2VcIi48L3A+XG4vLyAgICAgKiBAbWV0aG9kIF9oYW5kbGVEaXNjb25uZWN0XG4vLyAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICovXG4vLyAgICAgX2hhbmRsZUNvbm5lY3QoKSB7XG4vLyAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGNvbm5lY3QnKTtcbi8vICAgICAgICAgLy9ub3RpZnkgdXBsaW5rLXNlcnZlclxuLy8gICAgICAgICB0aGlzLl9lbWl0KCdoYW5kc2hha2UnLCB7IGd1aWQ6IHRoaXMuX2d1aWQgfSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPiBJZGVudGlmaWVzIGlmIHRoZSBwaWQgb2YgdGhlIHNlcnZlciBoYXMgY2hhbmdlZCAoZHVlIHRvIGEgcG90ZW50aWFsIHJlYm9vdCBzZXJ2ZXItc2lkZSkgc2luY2UgdGhlIGxhc3QgY2xpZW50IGNvbm5lY3Rpb24uIDxiciAvPlxuLy8gICAgICogSWYgdGhpcyBpcyB0aGUgY2FzZSwgYSBwYWdlIHJlbG9hZCBpcyBwZXJmb3JtZWQ8cD5cbi8vICAgICAqIEBtZXRob2QgX2hhbmRsZUhhbmRzaGFrZUFja1xuLy8gICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlSGFuZHNoYWtlQWNrKHBhcmFtcykge1xuLy8gICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBoYW5kc2hha2UtYWNrJywgcGFyYW1zKTtcbi8vICAgICAgIGlmKHRoaXMuX3BpZCAmJiBwYXJhbXMucGlkICE9PSB0aGlzLl9waWQgJiYgdGhpcy5zaG91bGRSZWxvYWRPblNlcnZlclJlc3RhcnQpIHtcbi8vICAgICAgICAgXy5kZXYoKCkgPT4ge1xuLy8gICAgICAgICAgIGNvbnNvbGUud2FybignU2VydmVyIHBpZCBoYXMgY2hhbmdlZCwgcmVsb2FkaW5nIHBhZ2UuJyk7XG4vLyAgICAgICAgIH0pO1xuLy8gICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbi8vICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuLy8gICAgICAgICB9LCBfLnJhbmRvbSgyMDAwLCAxMDAwMCkpO1xuLy8gICAgICAgfVxuLy8gICAgICAgdGhpcy5fcGlkID0gcGFyYW1zLnBpZDtcbi8vICAgICAgIHRoaXMuX2Fja25vd2xlZGdlSGFuZHNoYWtlKHBhcmFtcyk7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIF9oYW5kbGVEZWJ1Z1xuLy8gICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlRGVidWcocGFyYW1zKSB7XG4vLyAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGRlYnVnJywgcGFyYW1zKTtcbi8vICAgICAgIF8uZGV2KCgpID0+IHtcbi8vICAgICAgICAgY29uc29sZS53YXJuKCdSLlVwbGluay5kZWJ1ZyguLi4pOicsIHBhcmFtcy5kZWJ1Zyk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIEBtZXRob2QgX2hhbmRsZUxvZ1xuLy8gICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlTG9nKHBhcmFtcykge1xuLy8gICAgICAgdGhpcy5fZGVidWdMb2coJzw8PCBsb2cnLCBwYXJhbXMpO1xuLy8gICAgICAgY29uc29sZS5sb2coJ1IuVXBsaW5rLmxvZyguLi4pOicsIHBhcmFtcy5sb2cpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogQG1ldGhvZCBfaGFuZGxlV2FyblxuLy8gICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlV2FybihwYXJhbXMpIHtcbi8vICAgICAgIHRoaXMuX2RlYnVnTG9nKCc8PDwgd2FybicsIHBhcmFtcyk7XG4vLyAgICAgICBjb25zb2xlLndhcm4oJ1IuVXBsaW5rLndhcm4oLi4uKTonLCBwYXJhbXMud2Fybik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoqXG4vLyAgICAgKiBAbWV0aG9kIF9oYW5kbGVFcnJvclxuLy8gICAgICogQHBhcmFtcyB7b2JqZWN0fSBwYXJhbXNcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfaGFuZGxlRXJyb3IocGFyYW1zKSB7XG4vLyAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPDw8IGVycm9yJywgcGFyYW1zKTtcbi8vICAgICAgIGNvbnNvbGUuZXJyb3IoJ1IuVXBsaW5rLmVyciguLi4pOicsIHBhcmFtcy5lcnIpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+T2NjdXJzIHdoZW4gYSBjbGllbnQgdW5sb2FkcyB0aGUgZG9jdW1lbnQ8L3A+XG4vLyAgICAgKiBAbWV0aG9kIF9oYW5kbGVVbmxvYWRcbi8vICAgICAqIEBwYXJhbXMge0Z1bmN0aW9ufSBwcmV2SGFuZGxlciBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBwYWdlIHdpbGwgYmUgdW5sb2FkZWRcbi8vICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmdW5jdGlvblxuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9oYW5kbGVVbmxvYWQocHJldkhhbmRsZXIpIHtcbi8vICAgICAgIHJldHVybiAoKSA9PiB7XG4vLyAgICAgICAgIGlmKHByZXZIYW5kbGVyKSB7XG4vLyAgICAgICAgICAgcHJldkhhbmRsZXIoKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLl9lbWl0KCd1bmhhbmRzaGFrZScpO1xuLy8gICAgICAgfTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPlNpbXBseSBjbG9zZXMgdGhlIHNvY2tldDwvcD5cbi8vICAgICAqIEBtZXRob2QgX2Rlc3Ryb3lJbkNsaWVudFxuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9kZXN0cm95SW5DbGllbnQoKSB7XG4vLyAgICAgICBpZih0aGlzLl9zb2NrZXQpIHtcbi8vICAgICAgICAgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+RG9lcyBub3RoaW5nPC9wPlxuLy8gICAgICogQG1ldGhvZCBfZGVzdHJveUluQ2xpZW50XG4vLyAgICAgKiBAcmV0dXJuIHsqfSB2b2lkMFxuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9kZXN0cm95SW5TZXJ2ZXIoKSB7XG4vLyAgICAgICByZXR1cm4gdm9pZCAwO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+Tm90aWZpZXMgdGhlIHVwbGluay1zZXJ2ZXIgdGhhdCBhIHN1YnNjcmlwdGlvbiBpcyByZXF1aXJlZCBieSBjbGllbnQ8L3A+XG4vLyAgICAgKiBAbWV0aG9kIF9zdWJzY3JpYmVUb1xuLy8gICAgICogQHJldHVybiB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBzdWJzY3JpYmVcbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfc3Vic2NyaWJlVG8oa2V5KSB7XG4vLyAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4vLyAgICAgICAgIHlpZWxkIHRoaXMucmVhZHk7XG4vLyAgICAgICAgIHRoaXMuX2VtaXQoJ3N1YnNjcmliZVRvJywgeyBrZXk6IGtleSB9KTtcbi8vICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fc3Vic2NyaWJlVG8oLi4uKTogY291bGRuXFwndCBzdWJzY3JpYmUgKCcgKyBrZXkgKyAnKScpKTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPk5vdGlmaWVzIHRoZSB1cGxpbmstc2VydmVyIHRoYXQgYSBzdWJzY3JpcHRpb24gaXMgb3ZlcjwvcD5cbi8vICAgICAqIEBtZXRob2QgX3N1YnNjcmliZVRvXG4vLyAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHVuc3Vic2NyaWJlXG4vLyAgICAgKiBAcHJpdmF0ZVxuLy8gICAgICovXG4vLyAgICAgX3Vuc3Vic2NyaWJlRnJvbShrZXkpIHtcbi8vICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbi8vICAgICAgICAgeWllbGQgdGhpcy5yZWFkeTtcbi8vICAgICAgICAgdGhpcy5fZW1pdCgndW5zdWJzY3JpYmVGcm9tJywgeyBrZXk6IGtleSB9KTtcbi8vICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fc3Vic2NyaWJlVG8oLi4uKTogY291bGRuXFwndCB1bnN1YnNjcmliZSAoJyArIGtleSArICcpJykpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+RXRhYmxpc2hlcyBhIHN1YnNjcmlwdGlvbiB0byBhIGtleSwgYW5kIGNhbGwgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiB3aGVuIF9oYW5kbGVVcGRhdGUgb2NjdXJzPC9wPlxuLy8gICAgICogQG1ldGhvZCBzdWJzY3JpYmVUb1xuLy8gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IHRvIHN1YnNjcmliZVxuLy8gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGVcbi8vICAgICAqIEByZXR1cm4ge29iamVjdH0gc3Vic2NyaXB0aW9uIFRoZSBjcmVhdGVkIHN1YnNjcmlwdGlvblxuLy8gICAgICovXG4vLyAgICAgc3Vic2NyaWJlVG8oa2V5LCBmbikge1xuLy8gICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBSLlVwbGluay5TdWJzY3JpcHRpb24oa2V5KTtcbi8vICAgICAgIGlmKCFfLmhhcyh0aGlzLl9zdWJzY3JpcHRpb25zLCBrZXkpKSB7XG4vLyAgICAgICAgIHRoaXMuX3N1YnNjcmliZVRvKGtleSk7XG4vLyAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSA9IHt9O1xuLy8gICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSB7fTtcbi8vICAgICAgICAgdGhpcy5faGFzaGVzW2tleV0gPSBSLmhhc2goSlNPTi5zdHJpbmdpZnkoe30pKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdID0gZm47XG4vLyAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+UmVtb3ZlcyBhIHN1YnNjcmlwdGlvbiB0byBhIGtleTwvcD5cbi8vICAgICAqIEBtZXRob2Qgc3Vic2NyaWJlVG9cbi8vICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSB0byBzdWJzY3JpYmVcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpcHRpb25cbi8vICAgICAqL1xuLy8gICAgIHVuc3Vic2NyaWJlRnJvbShrZXksIHN1YnNjcmlwdGlvbikge1xuLy8gICAgICAgXy5kZXYoKCkgPT5cbi8vICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4vLyAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XS5zaG91bGQuYmUub2sgJiZcbi8vICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbi8vICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc1trZXldW3N1YnNjcmlwdGlvbi51bmlxdWVJZF0uc2hvdWxkLmJlLm9rICYmXG4vLyAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdLnNob3VsZC5iZS5hLlN0cmluZ1xuLy8gICAgICAgICApO1xuLy8gICAgICAgZGVsZXRlIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XVtzdWJzY3JpcHRpb24udW5pcXVlSWRdO1xuLy8gICAgICAgaWYoXy5zaXplKHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSkgPT09IDApIHtcbi8vICAgICAgICAgZGVsZXRlIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XTtcbi8vICAgICAgICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbi8vICAgICAgICAgZGVsZXRlIHRoaXMuX2hhc2hlc1trZXldO1xuLy8gICAgICAgICB0aGlzLl91bnN1YnNjcmliZUZyb20oa2V5KTtcbi8vICAgICAgIH1cbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPlNlbmRzIHRoZSBsaXN0ZW5lciBzaWduYWwgXCJsaXN0ZW5Ub1wiPC9wPlxuLy8gICAgICogQG1ldGhvZCBfbGlzdGVuVG9cbi8vICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZSB0byBsaXN0ZW5cbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfbGlzdGVuVG8oZXZlbnROYW1lKSB7XG4vLyAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4vLyAgICAgICAgIHlpZWxkIHRoaXMucmVhZHk7XG4vLyAgICAgICAgIHRoaXMuX2VtaXQoJ2xpc3RlblRvJywgeyBldmVudE5hbWU6IGV2ZW50TmFtZSB9KTtcbi8vICAgICAgIH0pLmNhbGwodGhpcywgUi5EZWJ1Zy5yZXRocm93KCdSLlVwbGluay5fbGlzdGVuVG86IGNvdWxkblxcJ3QgbGlzdGVuICgnICsgZXZlbnROYW1lICsgJyknKSk7XG4vLyAgICAgfVxuXG4vLyAgICAgIC8qKlxuLy8gICAgICogPHA+U2VuZHMgdGhlIHVubGlzdGVuZXIgc2lnbmFsIFwidW5saXN0ZW5Gcm9tXCI8L3A+XG4vLyAgICAgKiBAbWV0aG9kIF91bmxpc3RlbkZyb21cbi8vICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZSB0byBsaXN0ZW5cbi8vICAgICAqIEBwcml2YXRlXG4vLyAgICAgKi9cbi8vICAgICBfdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSkge1xuLy8gICAgICAgY28oZnVuY3Rpb24qKCkge1xuLy8gICAgICAgICB5aWVsZCB0aGlzLnJlYWR5O1xuLy8gICAgICAgICB0aGlzLl9lbWl0KCd1bmxpc3RlbkZyb20nLCB7IGV2ZW50TmFtZTogZXZlbnROYW1lIH0pO1xuLy8gICAgICAgfSkuY2FsbCh0aGlzLCBSLkRlYnVnLnJldGhyb3coJ1IuVXBsaW5rLl91bmxpc3RlbkZyb206IGNvdWxkblxcJ3QgdW5saXN0ZW4gKCcgKyBldmVudE5hbWUgKyAnKScpKTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPkNyZWF0ZSBhIGxpc3RlbmVyIGFjY29yZGluZyB0byBhIHNwZWNpZmljIG5hbWU8L3A+XG4vLyAgICAgKiBAbWV0aG9kIGxpc3RlblRvXG4vLyAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudE5hbWUgdG8gbGlzdGVuXG4vLyAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRyaWdnZXJlZFxuLy8gICAgICogQHJldHVybiB7b2JqZWN0fSBsaXN0ZW5lciBUaGUgY3JlYXRlZCBsaXN0ZW5lclxuLy8gICAgICovXG4vLyAgICAgbGlzdGVuVG8oZXZlbnROYW1lLCBmbikge1xuLy8gICAgICAgbGV0IGxpc3RlbmVyID0gUi5VcGxpbmsuTGlzdGVuZXIoZXZlbnROYW1lKTtcbi8vICAgICAgIGlmKCFfLmhhcyh0aGlzLl9saXN0ZW5lcnMsIGV2ZW50TmFtZSkpIHtcbi8vICAgICAgICAgdGhpcy5fbGlzdGVuVG8oZXZlbnROYW1lKTtcbi8vICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSB7fTtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdW2xpc3RlbmVyLnVuaXF1ZUlkXSA9IGZuO1xuLy8gICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+UmVtb3ZlIGEgbGlzdGVuZXIgPC9wPlxuLy8gICAgICogQG1ldGhvZCB1bmxpc3RlbkZyb21cbi8vICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50TmFtZSB0byByZW1vdmVcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsaXN0ZW5lclxuLy8gICAgICovXG4vLyAgICAgdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbi8vICAgICAgIF8uZGV2KCgpID0+XG4vLyAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4vLyAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnNob3VsZC5iZS5vayAmJlxuLy8gICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4vLyAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdW2xpc3RlbmVyLnVuaXF1ZUlkXS5zaG91bGQuYmUub2sgJiZcbi8vICAgICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV1bbGlzdGVuZXIudW5pcXVlSWRdLnNob3VsZC5iZS5hLlN0cmluZ1xuLy8gICAgICAgICApO1xuLy8gICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuLy8gICAgICAgaWYoXy5zaXplKHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKSA9PT0gMCkge1xuLy8gICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4vLyAgICAgICAgIHRoaXMuX3VubGlzdGVuRnJvbShldmVudE5hbWUpO1xuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAqIEBtZXRob2QgX2dldEZ1bGxVcmxcbi8vICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdWZmaXhcbi8vICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsaXN0ZW5lclxuLy8gICAgICogQHByaXZhdGVcbi8vICAgICAqL1xuLy8gICAgIF9nZXRGdWxsVXJsKHN1ZmZpeCkge1xuLy8gICAgICAgaWYoc3VmZml4LnNsaWNlKDAsIDEpID09PSAnLycgJiYgdGhpcy5faHR0cEVuZHBvaW50LnNsaWNlKC0xKSA9PT0gJy8nKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9odHRwRW5kcG9pbnQuc2xpY2UoMCwgLTEpICsgc3VmZml4O1xuLy8gICAgICAgfVxuLy8gICAgICAgZWxzZSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLl9odHRwRW5kcG9pbnQgKyBzdWZmaXg7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuXG4vLyAgICAgLyoqXG4vLyAgICAgKiA8cD5GZXRjaCBkYXRhIGJ5IEdFVCByZXF1ZXN0IGZyb20gdGhlIHVwbGluay1zZXJ2ZXI8L3A+XG4vLyAgICAgKiBAbWV0aG9kIGZldGNoXG4vLyAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gZmV0Y2hcbi8vICAgICAqIEByZXR1cm4ge29iamVjdH0gb2JqZWN0IEZldGNoZWQgZGF0YSBhY2NvcmRpbmcgdG8gdGhlIGtleVxuLy8gICAgICovXG4vLyAgICAgZmV0Y2goa2V5KSB7XG4vLyAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLy8gICAgICAgICB0aGlzLl9kZWJ1Z0xvZygnPj4+IGZldGNoJywga2V5KTtcbi8vICAgICAgICAgcmVxdWVzdCh7XG4vLyAgICAgICAgICAgdXJsOiB0aGlzLl9nZXRGdWxsVXJsKGtleSksXG4vLyAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbi8vICAgICAgICAgICBqc29uOiB0cnVlLFxuLy8gICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4vLyAgICAgICAgIH0sIGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XG4vLyAgICAgICAgICAgaWYoZXJyKSB7XG4vLyAgICAgICAgICAgICBfLmRldigoKSA9PiB7XG4vLyAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUi5VcGxpbmsuZmV0Y2goLi4uKTogY291bGRuXFwndCBmZXRjaCBcXCcnICsga2V5ICsgJ1xcJzonLCBlcnIudG9TdHJpbmcoKSk7XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGJvZHkpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9XG5cbi8vICAgICAvKipcbi8vICAgICAqIDxwPkRpc3BhdGNoZXMgYW4gYWN0aW9uIGJ5IFBPU1QgcmVxdWVzdCBmcm9tIHRoZSB1cGxpbmstc2VydmVyPC9wPlxuLy8gICAgICogQG1ldGhvZCBkaXNwYXRjaFxuLy8gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgc3BlY2lmaWMgYWN0aW9uIHRvIGRpc3BhdGNoXG4vLyAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXG4vLyAgICAgKiBAcmV0dXJuIHtvYmplY3R9IG9iamVjdCBGZXRjaGVkIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgYWN0aW9uXG4vLyAgICAgKi9cbi8vICAgICBkaXNwYXRjaChhY3Rpb24sIHBhcmFtcykge1xuLy8gICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgICAgICAgdGhpcy5fZGVidWdMb2coJz4+PiBkaXNwYXRjaCcsIGFjdGlvbiwgcGFyYW1zKTtcbi8vICAgICAgICAgcmVxdWVzdCh7XG4vLyAgICAgICAgICAgdXJsOiB0aGlzLl9nZXRGdWxsVXJsKGFjdGlvbiksXG4vLyAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4vLyAgICAgICAgICAgYm9keTogeyBndWlkOiB0aGlzLl9ndWlkLCBwYXJhbXM6IHBhcmFtcyB9LFxuLy8gICAgICAgICAgIGpzb246IHRydWUsXG4vLyAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSxcbi8vICAgICAgICAgfSwgZnVuY3Rpb24oZXJyLCByZXMsIGJvZHkpIHtcbi8vICAgICAgICAgICBpZihlcnIpIHtcbi8vICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgICBlbHNlIHtcbi8vICAgICAgICAgICAgIHJlc29sdmUoYm9keSk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9KTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKlxuLy8gICAgICogPHA+RGVzdHJveSBzb2NrZXQgY2xpZW50LXNpZGU8L3A+XG4vLyAgICAgKiBAbWV0aG9kIGRlc3Ryb3lcbi8vICAgICAqL1xuLy8gICAgIGRlc3Ryb3koKSB7XG4vLyAgICAgICBpZihSLmlzQ2xpZW50KCkpIHtcbi8vICAgICAgICAgdGhpcy5fZGVzdHJveUluQ2xpZW50KCk7XG4vLyAgICAgICB9XG4vLyAgICAgICBpZihSLmlzU2VydmVyKCkpIHtcbi8vICAgICAgICAgdGhpcy5fZGVzdHJveUluU2VydmVyKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgXy5leHRlbmQoVXBsaW5rLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBSLlVwbGluay5wcm90b3R5cGUgKi8ge1xuLy8gICAgIF9odHRwRW5kcG9pbnQ6IG51bGwsXG4vLyAgICAgX3NvY2tldEVuZFBvaW50OiBudWxsLFxuLy8gICAgIF9zdWJzY3JpcHRpb25zOiBudWxsLFxuLy8gICAgIF9saXN0ZW5lcnM6IG51bGwsXG4vLyAgICAgX3NvY2tldDogbnVsbCxcbi8vICAgICBfZ3VpZDogbnVsbCxcbi8vICAgICBfcGlkOiBudWxsLFxuLy8gICAgIHJlYWR5OiBudWxsLFxuLy8gICAgIHNob3VsZFJlbG9hZE9uU2VydmVyUmVzdGFydDogbnVsbCxcbi8vICAgICBfYWNrbm93bGVkZ2VIYW5kc2hha2U6IG51bGwsXG4vLyAgIH0pO1xuXG4vLyAgIF8uZXh0ZW5kKFVwbGluaywge1xuLy8gICAgIFN1YnNjcmlwdGlvbihrZXkpIHtcbi8vICAgICAgIHRoaXMua2V5ID0ga2V5O1xuLy8gICAgICAgdGhpcy51bmlxdWVJZCA9IF8udW5pcXVlSWQoJ1IuVXBsaW5rLlN1YnNjcmlwdGlvbicpO1xuLy8gICAgIH0sXG4vLyAgICAgTGlzdGVuZXIoZXZlbnROYW1lKSB7XG4vLyAgICAgICB0aGlzLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbi8vICAgICAgIHRoaXMudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdSLlVwbGluay5MaXN0ZW5lcicpO1xuLy8gICAgIH0sXG4vLyAgIH0pO1xuXG4vLyAgIHJldHVybiBVcGxpbms7XG4vLyB9O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9