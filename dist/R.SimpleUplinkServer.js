module.exports = function(R) {
    var io = require("socket.io");
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");
    var EventEmitter = require("events").EventEmitter;

    var SimpleUplinkServer = {
        createServer: function createServer(specs) {
            specs = _.extend({
                store: [],
                events: [],
                actions: {},
                bootstrap: R.noopThunk,
                sessionCreated: R.noopThunk,
                sessionDestroyed: R.noopThunk,
            }, specs);
            var SimpleUplinkServerInstance = function SimpleUplinkServerInstance(app, prefix) {
                SimpleUplinkServer.SimpleUplinkServerInstance.call(this, app, prefix);
                this._specs = specs;
            };
            _.extend(SimpleUplinkServerInstance.prototype, SimpleUplinkServer.SimpleUplinkServerInstance.prototype, specs);
            return SimpleUplinkServerInstance;
        },
        SimpleUplinkServerInstance: function SimpleUplinkServerInstance() {
            this._store = {};
            this._storeRouter = new R.Router();
            this._storeRouter.def(_.constant({
                err: "Unknown store key",
            }));
            this._storeEvents = new EventEmitter();
            this._eventsRouter = new R.Router();
            this._eventsRouter.def(_.constant({
                err: "Unknown event name",
            }));
            this._eventsEvents = new EventEmitter();
            this._actionsRouter = new R.Router();
            this._actionsRouter.def(_.constant({
                err: "Unknown action",
            }));
            this._sessions = {};
            this._sessionsEvents = new EventEmitter();
            this._connections = {};
        },
        Connection: function Connection(socket, handleSocketDisconnection, linkSession) {
            this._socket = socket;
            this._handleSocketDisconnection = handleSocketDisconnection;
            this._linkSession = linkSession;
            this._bindHandlers();
        },
        Session: function Session(guid, storeEvents, eventsEvents, sessionsEvents) {
            this._guid = guid;
            this._storeEvents = storeEvents;
            this._eventsEvents = eventsEvents;
            this._messageQueue = [];
            this._expireTimeout = setTimeout(R.scope(this._expire, this), this._timeoutDuration);
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
            this._socket.on("handshake", R.scope(this._handleHandshake, this));
            this._socket.on("subscribeTo", R.scope(this._handleSubscribe, this));
            this._socket.on("unsubscribeFrom", R.scope(this._handleUnsubscribeFrom, this));
            this._socket.on("listenTo", R.scope(this._handleListenTo, this));
            this._socket.on("unlistenFrom", R.scope(this._handleUnlistenFrom, this));
            this._socket.on("disconnect", R.scope(this._handleDisconnect, this));
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
                subscribeTo: R.scope(this.subscribeTo, this),
                unsubscribeFrom: R.scope(this.unsubscribeFrom, this),
                listenTo: R.scope(this.listenTon, this),
                unlistenFrom: R.scope(this.unlistenFrom, this),
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
            this._listeners[eventName] = R.scope(this._signalEvent(eventName), this);
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

    _.extend(SimpleUplinkServer.SimpleUplinkServerInstance.prototype, /** @lends R.SimpleUplinkServer.SimpleUplinkServerInstance.prototype */{
        _specs: null,
        _prefix: null,
        _app: null,
        _io: null,
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
        bootstrap: null,
        sessionCreated: null,
        sessionDestroyed: null,
        setStore: function setStore(key, val) {
            R.Debug.dev(R.scope(function() {
                console.warn("setStore:", key, "->", val);
            }, this));
            this._store[key] = val;
            this._storeEvents.emit("set:" + key, val);
        },
        getStore: function getStore(key, val) {
            return R.scope(function(fn) {
                if(!_.has(this._store, key)) {
                    fn(new Error("No value for key '" + key + "'"));
                }
                else {
                    fn(null, this._store[key]);
                }
            }, this);
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
            return this.getStore(this._extractOriginalPath.apply(null, arguments));
        },
        _bindStoreRoute: function _bindStoreRoute(route) {
            console.warn("store route", route);
            this._storeRouter.route(route, R.scope(this._storeGetter, this));
        },
        _bindEventsRoute: function _bindEventsRoute(route) {
            this._eventsRouter.route(route, R.scope(this._extractOriginalPath, this));
        },
        _bindActionsRoute: function _bindActionsRoute(handler, route) {
            this._actionsRouter.route(route, handler);
        },
        installHandlers: function installHandlers(app, prefix) {
            return R.scope(co(regeneratorRuntime.mark(function callee$2$0() {
                var server;

                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        assert(this._app === null, "R.SimpleUplinkServer.SimpleUplinkServerInstance.installHandlers(...): app already mounted.");
                        this._app = app;
                        this._prefix = prefix || "/uplink/";
                        server = require("http").Server(app);
                        this._io = io(server).of(prefix);
                        this._app.get(this._prefix + "*", R.scope(this._handleHttpGet, this));
                        this._app.post(this._prefix + "*", R.scope(this._handleHttpPost, this));
                        this._io.on("connection", R.scope(this._handleSocketConnection, this));
                        this._handleSocketDisconnection = R.scope(this._handleSocketDisconnection, this);
                        this._sessionsEvents.addListener("expire", R.scope(this._handleSessionExpire, this));
                        _.each(this._specs.store, R.scope(this._bindStoreRoute, this));
                        _.each(this._specs.events, R.scope(this._bindEventsRoute, this));
                        _.each(this._specs.actions, R.scope(this._bindActionsRoute, this));
                        this.bootstrap = R.scope(this._specs.bootstrap, this);
                        context$3$0.next = 16;
                        return this.bootstrap();
                    case 16:
                        return context$3$0.abrupt("return", server);
                    case 17:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            })), this);
        },
        _handleHttpGet: function _handleHttpGet(req, res) {
            var path = req.path.slice(this._prefix.length - 1); // keep the leading slash
            this._storeRouter.match(path)(function(err, res) {
                if(err) {
                    res.status(500).json({ err: err.toString() });
                }
                else {
                    res.status(200).json(res);
                }
            });
        },
        _handleHttpPost: function _handleHttpPost(req, res) {
            var path = req.path.slice(this._prefix.length - 1); // keep the leading slash
            var handler = this._actionsRouter(path);
            assert(req.body.guid);
            if(!_.has(this._sessions, req.body.guid)) {
                this._sessions[guid] = new R.SimpleUplinkServer.Session(guid, this._storeEvents, this._eventsEvents);
                this.sessionCreated(guid);
            }
            handler.call(this, req.body)(function(err, res) {
                if(err) {
                    res.status(500).json({ err: err.toString() });
                }
                else {
                    res.status(200).json(res);
                }
            });
        },
        _handleSocketConnection: function _handleSocketConnection(socket) {
            var connection = new R.SimpleUplinkServer.Connection(socket, this._handleSocketDisconnection, R.scope(this._linkSession, this));
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
            return co(regeneratorRuntime.mark(function callee$2$0() {
                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        if (this._sessions[guid]) {
                            context$3$0.next = 4;
                            break;
                        }

                        this._sessions[guid] = new R.SimpleUplinkServer.Session(guid, this._storeEvents, this._eventsEvents);
                        context$3$0.next = 4;
                        return this.sessionCreated(guid);
                    case 4:
                        return context$3$0.abrupt("return", this._sessions[guid].attachConnection(connection));
                    case 5:
                    case "end":
                        return context$3$0.stop();
                    }
                }, callee$2$0, this);
            }));
        },
        _handleSessionExpire: function _handleSessionExpire(guid) {
            R.Debug.dev(R.scope(function() {
                assert(_.has(this._sessions, guid), "R.SimpleUplinkServer._handleSessionExpire(...): no such session.");
            }, this));
            delete this._sessions[guid];
            this.sessionDestroyed(guid)(R.Debug.rethrow("R.SimpleUplinkServer._handleSessionExpire(...)"));
        },
    });

    R.SimpleUplinkServer = SimpleUplinkServer;
    return R;
};
