module.exports = function(R) {
    var url = require("url");
    var _ = require("lodash");
    var assert = require("assert");
    var Promise = require("bluebird");
    var request = require("request");
    var co = require("co");

    /**
     * The Uplink micro-protocol is a simple set of conventions to implement real-time reactive Flux over the wire.
     * The frontend and the backend server share 2 means of communications :
     * - a WebSocket-like (socket.io wrapper) duplex connection to handshake and subscribe to keys/listen to events
     * - regulars HTTP requests (front -> back) to actually get data from the stores
     *
     * PROTOCOL:
     *
     * Connection/reconnection:
     *
     * Client: bind socket
     * Server: Acknowledge connection
     * Client: send "handshake" { guid: guid }
     * Server: send "handshake-ack" { recovered: bool } (recover previous session if existing based upon guid; recovered is true iff previous session existed)
     *
     * Stores:
     * Client: send "subscribeTo" { key: key }
     * Server: send "update" { key: key }
     * Client: XHR GET /uplink/key
     *
     * Events:
     * Client: send "listenTo" { eventName: eventName }
     * Server: send "event" { eventName: eventName, params: params }
     *
     * Actions:
     * Client: XHR POST /uplink/action { params: params }
     *
     * Other notifications:
     * Server: send "debug": { debug: debug } Debug-level message
     * Server: send "log" { log: log } Log-level message
     * Server: send "warn": { warn: warn } Warn-level message
     * Server: send "err": { err: err } Error-level message
     */

    var Uplink = function Uplink(httpEndpoint, socketEndpoint, guid) {
        this._httpEndpoint = httpEndpoint;
        this._socketEndPoint = socketEndpoint;
        this._guid = guid;
        _.bindAll(this);
        if(R.isClient()) {
            this._initInClient();
        }
        if(R.isServer()) {
            this._initInServer();
        }
    };

    _.extend(Uplink.prototype, /** @lends R.Uplink.prototype */ {
        _httpEndpoint: null,
        _socketEndPoint: null,
        _subscriptions: null,
        _listeners: null,
        _socket: null,
        _guid: null,
        _promiseForHandshake: null,
        _acknowledgeHandshake: null,
        _initInClient: function _initInClient() {
            var io = require("socket.io");
            if(this._socketEndPoint) {
                this._socket = io(this._socketEndPoint);
                socket.on("update", this._handleUpdate);
                socket.on("event", this._handleEvent);
                socket.on("disconnect", this._handleDisconnect);
                socket.on("connect", this._handleConnect);
                socket.on("handshake-ack", this._handleHandshakeAck);
                socket.on("debug", this._handleDebug);
                socket.on("log", this._handleLog);
                socket.on("warn", this._handleWarn);
                socket.on("err", this._handleError);
                this._promiseForHandshake = new Promise(R.scope(function(resolve, reject) {
                    this._acknowledgeHandshake = resolve;
                }, this));
            }
        },
        _initInServer: _.noop,
        _handleUpdate: function _handleUpdate(params) {
            var key = params.key;
            if(_.has(this._subscriptions, key)) {
                _.each(this._subscriptions[key], function(fn) {
                    fn();
                });
            }
        },
        _handleEvent: function _handleEvent(params) {
            var eventName = params.eventName;
            var eventParams = params.params;
            if(_.has(this._listeners, eventName)) {
                _.each(this._listeners[eventName], function(fn) {
                    fn(eventParams);
                });
            }
        },
        _handleDisconnect: function _handleDisconnect(params) {
            this._promiseForHandshake = new Promise(R.scope(function(resolve, reject) {
                this._acknowledgeHandshake = {
                    resolve: resolve,
                    reject: reject,
                };
            }, this));
        },
        _handleConnect: function _handleConnect() {
            this._socket.emit("handshake", { guid: this._guid });
        },
        _handleHandshakeAck: function _handleHandshakeAck(params) {
            this._acknowledgeHandshake.resolve(params);
        },
        _handleDebug: function _handleDebug(params) {
            R.Debug.dev(function() {
                console.warn("R.Uplink.debug(...):", params.debug);
            });
        },
        _handleLog: function _handleLog(params) {
            console.log("R.Uplink.log(...):", params.log);
        },
        _handleWarn: function _handleWarn(params) {
            console.warn("R.Uplink.warn(...):", params.warn);
        },
        _handleError: function _handleError(params) {
            console.error("R.Uplink.err(...):", params.err);
        },
        _destroyInClient: function _destroyInClient() {
            if(this._socket) {
                this._socket.close();
            }
        },
        _destroyInServer: function _destroyInServer() {
            return void 0;
        },
        _subscribeTo: function _subscribeTo(key) {
            co(function*() {
                yield this._promiseForHandshake();
                this.emit("subscribeTo", { key: key });
            }).call(this);
        },
        _unsubscribeFrom: function _unsubscribeFrom(key) {
            co(function*() {
                yield this._promiseForHandshake();
                this.emit("unsubscribeFrom", { key: key });
            }).call(this);
        },
        subscribeTo: function subscribeTo(key, fn) {
            var subscription = new R.Uplink.Subscription(key);
            if(!_.has(this._subscriptions, key)) {
                this._subscribeTo(key);
                this._subscriptions[key] = {};
            }
            this._subscriptions[key][subscription.uniqueId] = fn;
            return subscription;
        },
        unsubscribeFrom: function unsubscribeFrom(key, subscription) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._subscriptions, key), "R.Uplink.unsub(...): no such key.");
                assert(_.has(this._subscriptions[key], subscription.uniqueId), "R.Uplink.unsub(...): no such subscription.");
            }, this));
            delete this._subscriptions[key];
            if(_.size(this._subscriptions[key]) === 0) {
                delete this._subscriptions[key];
                this._unsubscribeFrom(key);
            }
        },
        _listenTo: function _listenTo(eventName) {
            co(function*() {
                yield this._promiseForHandshake();
                this.emit("listenTo", { eventName: eventName });
            }).call(this);
        },
        _unlistenFrom: function _unlistenFrom(eventName) {
            co(function*() {
                yield this._promiseForHandshake();
                this.emit("unlistenFrom", { eventName: eventName });
            }).call(this);
        },
        listenTo: function listenTo(eventName, fn) {
            var listener = R.Uplink.Listener(eventName);
            if(!_.has(this._listeners, eventName)) {
                this._listenTo(eventName);
                this._listeners[eventName] = {};
            }
            this._listeners[eventName][listener.uniqueId] = fn;
            return listener;
        },
        unlistenFrom: function unlistenFrom(eventName, listener) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._listeners, eventName), "R.Uplink.removeListener(...): no such eventName.");
                assert(_.has(this._listeners[eventName], listener.uniqueId), "R.Uplink.removeListener(...): no such listener.");
            }, this));
            delete this._listeners[eventName];
            if(_.size(this._listeners[eventName]) === 0) {
                delete this._listeners[eventName];
                this._unlistenFrom(eventName);
            }
        },
        fetch: function fetch(key) {
            return R.scope(function(fn) {
                request({ url: url.resolve(this._httpEndpoint, key), method: "GET", json: true }, function(err, res, body) {
                    return err ? fn(err) : fn(null, body);
                });
            }, this);
        },
        dispatch: function dispatch(action, params) {
            return R.scope(function(fn) {
                request({ url: url.resolve(this._httpEndpoint, action), body: { guid: this._guid, params: params }, json: true }, function(err, res, body) {
                    return err ? fn(err) : fn(null, body);
                });
            }, this);
        },
        destroy: function destroy() {
            if(R.isClient()) {
                this._destroyInClient();
            }
            if(R.isServer()) {
                this._destroyInServer();
            }
        },
    });

    _.extend(Uplink, {
        Subscription: function Subscription(key) {
            this.key = key;
            this.uniqueId = _.uniqueId("R.Uplink.Subscription");
        },
        Listener: function Listener(eventName) {
            this.eventName = eventName;
            this.uniqueId = _.uniqueId("R.Uplink.Listener");
        },
    });

    R.Uplink = Uplink;
    return R;
};
