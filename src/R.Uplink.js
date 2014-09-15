var R = require("../");
var url = require("url");
var _ = require("lodash");
var assert = require("assert");
var Promise = require("bluebird");
var request = require("request");

var Uplink = function Uplink(httpEndpoint, socketEndpoint, guid) {
    this._httpEndpoint = httpEndpoint;
    this._socketEndPoint = socketEndpoint;
    this._guid = guid;
    if(R.isClient()) {
        this._initInClient(glob);
    }
    if(R.isServer()) {
        this._initInServer(glob);
    }
    _.bindAll(this);
    this._promiseForHandshake = Promise.reject(new Error("No socket connection."));
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
    _initInClient: function _initInClient(window) {
        var io = require("socket.io");
        if(this._socketEndPoint) {
            this._socket = io(this._socketEndPoint);
            socket.on("update", this._handleUpdate);
            socket.on("event", this._handleEvent);
            socket.on("disconnect", this._handleDisconnect);
            socket.on("connect", this._handleConnect);
            socket.on("handshake-ack", this._handleHandshakeAck);
            socket.on("log", this._handleLog);
            socket.on("warn", this._handleWarn);
            socket.on("err", this._handleError);
            socket.on("debug", this._handleDebug);
        }
    },
    _initInServer: function _initInServer(req) {

    },
    _handleUpdate: function _handleUpdate(params) {

    },
    _handleEvent: function _handleEvent(params) {

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
    _handleLog: function _handleLog(params) {
        console.log("R.Uplink.log(...):", params.log);
    },
    _handleWarn: function _handleWarn(params) {
        console.warn("R.Uplink.warn(...):", params.warn);
    },
    _handleError: function _handleError(params) {
        console.error("R.Uplink.err(...):", params.err);
    },
    _handleDebug: function _handleDebug(params) {
        R.Debug.dev(function() {
            console.warn("R.Uplink.debug(...):", params.debug);
        });
    },
    _destroyInClient: function _destroyInClient() {
        if(this._socket) {
            this._socket.close();
        }
    },
    _destroyInServer: function _destroyInServer() {

    },
    _subscribeTo: function _subscribeTo(key) {
        co(function*() {
            yield this._promiseForHandshake();
            this.emit("subscribe", { key: key });
        }).call(this);
    },
    _unsubscribeFrom: function _unsubscribeFrom(key) {
        co(function*() {
            yield this._promiseForHandshake();
            this.emit("unsubscribe", { key: key });
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

    },
    dispatch: function dispatch(action, params) {

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

module.exports = {
    Uplink: Uplink,
};
