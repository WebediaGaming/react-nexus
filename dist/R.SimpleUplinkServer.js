var R = require("../");
var io = require("socket.io");
var _ = require("lodash");
var assert = require("assert");
var co = require("co");
var EventEmitter = require("events").EventEmitter;

var SimpleUplinkServer = {
    createServer: function createServer(specs) {
        specs = _.extend({
            stores: [],
            events: [],
            actions: {},
        }, specs);
        var SimpleUplinkServerInstance = function SimpleUplinkServerInstance(app, prefix) {
            SimpleUplinkServer.SimpleUplinkServerInstance.call(this, app, prefix);
            this._bindHandlers(specs);
        };
        _.extend(SimpleUplinkServerInstance.prototype, SimpleUplinkServer.SimpleUplinkServerInstance.prototype, specs);
        return SimpleUplinkServerInstance;
    },
    SimpleUplinkServerInstance: function SimpleUplinkServerInstance(app, prefix) {
        this._prefix = prefix || "/uplink/";
        this._app = app;
        this._io = io(app);
        _.bindAll(this);
        this._store = {};
        this._storeRouter = new R.Router();
        this._storeRouter.def(_.constant(null));
        this._storeEvents = new EventEmitter();
        this._eventsRouter = new R.Router();
        this._eventsRouter.def(_.constant(null));
        this._eventsEvents = new EventEmitter();
        this._actionsRouter = new R.Router();
        this._actionsRouter.def(_.constant(null));
        this._sessions = {};
        this._sessionsEvents = new EventEmitter();
        this._app.get(this._prefix + "*", this._handleHttpGet);
        this._app.post(this._prefix + "*", this._handleHttpPost);
        this._io.on("connection", this._handleSocketConnection);
        this._sessionsEvents.addListener("expire", this._handleSessionExpire);
    },
    Connection: function Connection(socket, handleSocketDisconnection, linkSession) {
        this._socket = socket;
        _.bindAll(this);
        this._handleSocketDisconnection = handleSocketDisconnection;
        this._linkSession = linkSession;
        this._bindHandlers();
    },
    Session: function Session(guid, storeEvents, eventsEvents, sessionsEvents) {
        _.bindAll(this);
        this._guid = guid;
        this._storeEvents = storeEvents;
        this._eventsEvents = eventsEvents;
        this._messageQueue = [];
        this._expireTimeout = setTimeout(this._expire, this._timeoutDuration);
    },
};

_.extend(SimpleUplinkServer.Connection.prototype, /** @lends R.SimpleUplinkServer.Connection.prototype */ {
    _socket: null,
    guid: null,
    _handleSocketDisconnection: null,
    _linkSession: null,
    _subscribeTo: null,
    _unsubscribeFrom: null,
    _listenTo: null,
    _unlistenFrom: null,
    _bindHandlers: function _bindHandlers() {
        this._socket.on("handshake", this._handleHandshake);
        this._socket.on("subscribeTo", this._handleSubscribe);
        this._socket.on("unsubscribeFrom", this._handleUnsubscribeFrom);
        this._socket.on("listenTo", this._handleListenTo);
        this._socket.on("unlistenFrom", this._handleUnlistenFrom);
        this._socket.on("disconnect", this._handleDisconnect);
    },
    emit: function emit(name, params) {
        this._socket.emit(name, params);
    },
    _handleHandshake: function _handleHandshake(params) {
        if(!_.has(params, "guid") || !_.isString(params.guid)) {
            this.emit("err", { err: "handshake.params.guid: expected String. "});
        }
        else {
            this.guid = params.guid;
            var s = this._linkSession(this, this.guid);
            this.emit("handshake-ack", { recovered: s.recovered });
            this._subscribeTo = s.subscribeTo;
            this._unsubscribeFrom = s.unsubscribeFrom;
            this._listenTo = s.listenTo;
            this._unlistenFrom = s.unlistenFrom;
        }
    },
    _handleSubscribeTo: function _handleSubscribeTo(params) {
        if(!_.has(params, "key") || !_.isString(params.key)) {
            this.emit("err", { err: "subscribeTo.params.key: expected String." });
        }
        else if(!this._subscribeTo) {
            this.emit("err", { err: "subscribeTo: requires handshake." });
        }
        else {
            this._subscribeTo(params.key);
        }
    },
    _handleUnsubscribeFrom: function _handleUnsubscribeFrom(params) {
        if(!_.has(params, "key") || !_.isString(params.key)) {
            this.emit("err", { err: "unsubscribeFrom.params.key: expected String." });
        }
        else if(!this._unsubscribeFrom) {
            this.emit("err", { err: "unsubscribeFrom: requires handshake." });
        }
        else {
            this._unsubscribeFrom(params.key);
        }
    },
    _handleListenTo: function _handleListenTo(params) {
        if(!_.has(params, "eventName") || !_.isString(params.eventName)) {
            this.emit("err", { err: "listenTo.params.eventName: expected String." });
        }
        else if(!this._listenTo) {
            this.emit("err", { err: "listenTo: requires handshake." });
        }
        else {
            this.listenTo(params.eventName);
        }
    },
    _handleUnlistenFrom: function _handleUnlistenFrom(params) {
        if(!_.has(params, "eventName") || !_.isString(params.eventName)) {
            this.emit("err", { err: "unlistenFrom.params.eventName: expected String." });
        }
        else if(!this.unlistenFrom) {
            this.emit("err", { err: "unlistenFrom: requires handshake." });
        }
        else {
            this.unlistenFrom(params.eventName);
        }
    },
    _handleDisconnect: function _handleDisconnect(params) {
        this._handleSocketDisconnection();
    },

});

_.extend(SimpleUplinkServer.Session.prototype, /** @lends R.SimpleUplinkServer.Session */ {
    _guid: null,
    _connection: null,
    _subscriptions: null,
    _listeners: null,
    _storeEvents: null,
    _eventsEvents: null,
    _messageQueue: null,
    _expireTimeout: null,
    _timeoutDuration: 120000,
    attachConnection: function attachConnection(connection) {
        var recovered = (this._connection !== null);
        this.detachConnection();
        _.each(this._messageQueue, function(m) {
            connection.emit(m.name, m.params);
        });
        this._messageQueue = null;
        clearTimeout(this._expireTimeout);
        return {
            recovered: recovered,
            subscribeTo: this.subscribeTo,
            unsubscribeFrom: this.unsubscribeFrom,
            listenTo: this.listenTo,
            unlistenFrom: this.unlistenFrom,
        };
    },
    detachConnection: function detachConnection() {
        if(this._connection === null) {
            return;
        }
        else {
            this._connection = null;
            this._messageQueue = [];
            this._expireTimeout = setTimeout(this._expire, this._timeoutDuration);
        }
    },
    subscribeTo: function subscribeTo(key) {
        R.Debug.dev(R.scope(function() {
            assert(!_.has(this._subscriptions, key), "R.SimpleUplinkServer.Session.subscribeTo(...): already subscribed.");
        }, this));
        this._subscriptions[key] = this._signalUpdate(key);
        this._storeEvents.addListener("set:" + key, this._subscriptions[key]);
    },
    unsubscribeFrom: function unsubscribeFrom(key) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._subscriptions, key), "R.SimpleUplinkServer.Session.unsubscribeFrom(...): not subscribed.");
        }, this));
        this._storeEvents.removeListener("set:" + key, this._subscriptions[key]);
        delete this._subscriptions[key];
    },
    _emit: function _emit(name, params) {
        if(this._connection !== null) {
            this._connection.emit(name, params);
        }
        else {
            this._messageQueue.push({
                name: name,
                params: params,
            });
        }
    },
    _signalUpdate: function _signalUpdate(key) {
        return R.scope(function() {
            this._emit("update", { key: key });
        }, this);
    },
    _signalEvent: function _signalEvent(eventName) {
        return R.scope(function(params) {
            this._emit("event", { eventName: eventName, params: params });
        }, this);
    },
    _expire: function _expire() {
        _.each(_.keys(this._subscriptions), this.unsubscribeFrom);
        _.each(_.keys(this._listeners), this.unlistenFrom);
        this._sessionsEvents.emit(this._guid);
    },
    listenTo: function listenTo(eventName) {
        R.Debug.dev(R.scope(function() {
            assert(!_.has(this._listeners, key), "R.SimpleUplinkServer.Session.listenTo(...): already listening.");
        }, this));
        this._listeners[eventName] = this._signalEvent(eventName);
        this._eventsEvents.addListener("emit:" + eventName, this._listeners[eventName]);
    },
    unlistenFrom: function unlistenFrom(eventName) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._listeners, eventName), "R.SimpleUplinkServer.Session.unlistenFrom(...): not listening.");
        }, this));
        this._eventsEvents.removeListener("emit:" + eventName, this._listeners[eventName]);
        delete this._listeners[eventName];
    },
});

_.extend(SimpleUplinkServerInstance.prototype, /** @lends R.SimpleUplinkServer.SimpleUplinkServerInstance.prototype */{
    _prefix: null,
    _store: null,
    _storeEvents: null,
    _storePatterns: null,
    _storeRouter: null,
    _eventsPatterns: null,
    _eventsRouter: null,
    _eventsEvents: null,
    _actionsPatterns: null,
    _actionsRouter: null,
    _sessions: null,
    _sessionsEvents: null,
    _connections: null,
    setStore: function setStore(key, val) {
        this._store[key] = val;
        this._storeEvents.emit("set:" + key, val);
    },
    getStore: function getStore(key, val) {
        return this._store[key];
    },
    emitEvent: function emitEvent(eventName, params) {
        this._eventsEvents.emit("emit:" + eventName, params);
    },
    emitDebug: function emitDebug(guid, params) {
        R.Debug.dev(R.scope(function() {
            if(this._sessions[guid]) {
                this._sessions[guid].emit("debug", params);
            }
        }, this));
    },
    emitLog: function emitLog(guid, params) {
        if(this._sessions[guid]) {
            this._sessions[guid].emit("log", params);
        }
    },
    emitWarn: function emitLog(guid, params) {
        if(this._sessions[guid]) {
            this._sessions[guid].emit("warn", params);
        }
    },
    emitError: function emitLog(guid, params) {
        if(this._sessions[guid]) {
            this._sessions[guid].emit("err", params);
        }
    },
    _extractOriginalPath: function _extractOriginalPath() {
        return arguments[arguments.length - 1];
    },
    _storeGetter: function _storeGetter() {
        return this._store[this._extractOriginalPath.apply(null, arguments)];
    },
    _bindStoreRoute: function _bindStoreRoute(route) {
        this._storeRouter.route(route, this._storeGetter);
    },
    _bindEventsRoute: function _bindEventsRoute(route) {
        this._eventsRouter.route(route, this._extractOriginalPath);
    },
    _bindActionsRoute: function _bindActionsRoute(handler, route) {
        this._actionsRouter.route(route, handler);
    },
    _bindHandlers: function _bindHandlers(specs) {
        _.each(specs.store, this._bindStoreRoute);
        _.each(specs.events, this._bindEventsRoute);
        _.each(specs.actions, this._bindActionsRoute);
    },
    _handleHttpGet: function _handleHttpGet(req, res) {
        var path = req.path.slice(this._prefix.length);
        var val = this._storeRouter.match(path);
        res.status(200).json(val);
    },
    _handleHttpPost: function _handleHttpPost(req, res) {
        var path = req.path.slice(this._prefix.length);
        var handler = this._actionsRouter(path);
        co(regeneratorRuntime.mark(function callee$1$0() {
            var val;

            return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return handler.call(this);
                case 2:
                    val = context$2$0.sent;
                    res.status(200).json(val);
                case 4:
                case "end":
                    return context$2$0.stop();
                }
            }, callee$1$0, this);
        })).call(this);
    },
    _handleSocketConnection: function _handleSocketConnection(socket) {
        var connection = new R.SimpleUplinkServer.Connection(socket, this._handleSocketDisconnection, this._linkSession);
        this._connections[connection.uniqueId] = connection;
    },
    _handleSocketDisconnection: function _handleSocketDisconnection(uniqueId) {
        var guid = this._connections[uniqueId].guid;
        if(guid && this._sessions[guid]) {
            this._sessions[guid].detachConnection();
        }
        delete this._connections[uniqueId];
    },
    _linkSession: function _linkSession(connection, guid) {
        if(!this._sessions[guid]) {
            this._sessions[guid] = new R.SimpleUplinkServer.Session(guid, this._storeEvents, this._eventsEvents);
        }
        return this._sessions[guid].attachConnection(connection);
    },
    _handleSessionExpire: function _handleSessionExpire(guid) {
        R.Debug.dev(R.scope(function() {
            assert(_.has(this._sessions, guid), "R.SimpleUplinkServer._handleSessionExpire(...): no such session.");
        }, this));
        delete this._sessions[guid];
    },
});

module.exports = {
    SimpleUplinkServer: SimpleUplinkServer,
};

