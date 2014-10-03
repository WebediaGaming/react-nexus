module.exports = function(R) {
    var io = require("socket.io");
    var _ = require("lodash");
    var assert = require("assert");
    var co = require("co");
    var EventEmitter = require("events").EventEmitter;
    var bodyParser = require("body-parser");

    var SimpleUplinkServer = {
        createServer: function createServer(specs) {
            R.Debug.dev(function() {
                assert(specs.store && _.isArray(specs.store), "R.SimpleUplinkServer.createServer(...).specs.store: expecting Array.");
                assert(specs.events && _.isArray(specs.events), "R.SimpleUplinkServer.createServer(...).specs.events: expecting Array.");
                assert(specs.actions && _.isPlainObject(specs.actions), "R.SimpleUplinkServer.createServer(...).specs.actions: expecting Object.");
                assert(specs.sessionCreated && _.isFunction(specs.sessionCreated), "R.SimpleUplinkServer.createServer(...).specs.sessionCreated: expecting Function.");
                assert(specs.sessionDestroyed && _.isFunction(specs.sessionDestroyed), "R.SimpleUplinkServer.createServer(...).specs.sessionDestroyed: expecting Function.");
                assert(specs.sessionTimeout && _.isNumber(specs.sessionTimeout), "R.SimpleUplinkServer.createServer(...).specs.sessionTimeout: expecting Number.");
            });
            var SimpleUplinkServerInstance = function SimpleUplinkServerInstance() {
                SimpleUplinkServer.SimpleUplinkServerInstance.call(this);
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

            this._linkSession = R.scope(this._linkSession, this);
            this._unlinkSession = R.scope(this._unlinkSession, this);
        },
        _SimpleUplinkServerInstanceProtoProps: /** @lends R.SimpleUplinkServer.SimpleUplinkServerInstance.prototype */{
            _specs: null,
            _prefix: null,
            _app: null,
            _io: null,
            _store: null,
            _storeEvents: null,
            _storeRouter: null,
            _eventsRouter: null,
            _eventsEvents: null,
            _actionsRouter: null,
            _sessions: null,
            _sessionsEvents: null,
            _connections: null,
            bootstrap: null,
            sessionCreated: null,
            sessionDestroyed: null,
            sessionTimeout: null,
            setStore: function setStore(key, val) {
                return R.scope(function(fn) {
                    try {
                        this._store[key] = val;
                        this._storeEvents.emit("set:" + key, val);
                    }
                    catch(err) {
                        return fn(R.Debug.extendError(err, "R.SimpleUplinkServer.setStore('" + key + "', '" + val + "')"));
                    }
                    _.defer(function() {
                        fn(null, val);
                    });
                }, this);
            },
            getStore: function getStore(key) {
                return R.scope(function(fn) {
                    var val;
                    try {
                        R.Debug.dev(R.scope(function() {
                            assert(_.has(this._store, key), "R.SimpleUplinkServer(...).getStore: no such key (" + key + ")");
                        }, this));
                        val = this._store[key];
                    }
                    catch(err) {
                        return fn(R.Debug.extendError(err, "R.SimpleUplinkServer.getStore('" + key + "')"));
                    }
                    _.defer(function() {
                        fn(null, val);
                    });
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
            _bindStoreRoute: function _bindStoreRoute(route) {
                this._storeRouter.route(route, this._extractOriginalPath);
            },
            _bindEventsRoute: function _bindEventsRoute(route) {
                this._eventsRouter.route(route, this._extractOriginalPath);
            },
            _bindActionsRoute: function _bindActionsRoute(handler, route) {
                this._actionsRouter.route(route, _.constant(R.scope(handler, this)));
            },
            installHandlers: regeneratorRuntime.mark(function installHandlers(app, prefix) {
                var server;

                return regeneratorRuntime.wrap(function installHandlers$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        assert(this._app === null, "R.SimpleUplinkServer.SimpleUplinkServerInstance.installHandlers(...): app already mounted.");
                        this._app = app;
                        this._prefix = prefix || "/uplink/";
                        server = require("http").Server(app);
                        this._io = io(server).of(prefix);
                        this._app.get(this._prefix + "*", R.scope(this._handleHttpGet, this));
                        this._app.post(this._prefix + "*", bodyParser.json(), R.scope(this._handleHttpPost, this));
                        this._io.on("connection", R.scope(this._handleSocketConnection, this));
                        this._handleSocketDisconnection = R.scope(this._handleSocketDisconnection, this);
                        this._sessionsEvents.addListener("expire", R.scope(this._handleSessionExpire, this));
                        _.each(this._specs.store, R.scope(this._bindStoreRoute, this));
                        _.each(this._specs.events, R.scope(this._bindEventsRoute, this));
                        _.each(this._specs.actions, R.scope(this._bindActionsRoute, this));
                        this.bootstrap = R.scope(this._specs.bootstrap, this);
                        context$2$0.next = 16;
                        return this.bootstrap();
                    case 16:
                        return context$2$0.abrupt("return", server);
                    case 17:
                    case "end":
                        return context$2$0.stop();
                    }
                }, installHandlers, this);
            }),
            _handleHttpGet: function _handleHttpGet(req, res, next) {
                co(regeneratorRuntime.mark(function callee$2$0() {
                    var path, key;

                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            path = req.path.slice(this._prefix.length - 1);
                            key = this._storeRouter.match(path);
                            R.Debug.dev(function() {
                                console.warn("<<< fetch", path);
                            });
                            context$3$0.next = 5;
                            return this.getStore(key);
                        case 5:
                            return context$3$0.abrupt("return", context$3$0.sent);
                        case 6:
                        case "end":
                            return context$3$0.stop();
                        }
                    }, callee$2$0, this);
                })).call(this, function(err, val) {
                    if(err) {
                        if(R.Debug.isDev()) {
                            return res.status(500).json({ err: err.toString(), stack: err.stack });
                        }
                        else {
                            return res.status(500).json({ err: err.toString() });
                        }
                    }
                    else {
                        return res.status(200).json(val);
                    }
                });
            },
            _handleHttpPost: function _handleHttpPost(req, res) {
                co(regeneratorRuntime.mark(function callee$2$0() {
                    var path, handler, params;

                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            path = req.path.slice(this._prefix.length - 1);
                            handler = this._actionsRouter.match(path);
                            assert(_.isObject(req.body), "body: expecting Object.");
                            assert(req.body.guid && _.isString(req.body.guid), "guid: expecting String.");
                            assert(req.body.params && _.isPlainObject(req.body.params), "params: expecting Object.");

                            if (_.has(this._sessions, req.body.guid)) {
                                context$3$0.next = 9;
                                break;
                            }

                            this._sessions[guid] = new R.SimpleUplinkServer.Session(guid, this._storeEvents, this._eventsEvents, this._sessionsEvents, this.sessionTimeout);
                            context$3$0.next = 9;
                            return this.sessionCreated(guid);
                        case 9:
                            params = _.extend({}, { guid: req.body.guid }, req.body.params);
                            R.Debug.dev(function() {
                                console.warn("<<< action", path, params);
                            });
                            context$3$0.next = 13;
                            return handler(params);
                        case 13:
                            return context$3$0.abrupt("return", context$3$0.sent);
                        case 14:
                        case "end":
                            return context$3$0.stop();
                        }
                    }, callee$2$0, this);
                })).call(this, function(err, val) {
                    if(err) {
                        if(R.Debug.isDev()) {
                            return res.status(500).json({ err: err.toString(), stack: err.stack });
                        }
                        else {
                            return res.status(500).json({ err: err.toString() });
                        }
                    }
                    else {
                        res.status(200).json(val);
                    }
                });
            },
            _handleSocketConnection: function _handleSocketConnection(socket) {
                var connection = new R.SimpleUplinkServer.Connection(socket, this._handleSocketDisconnection, this._linkSession, this._unlinkSession);
                this._connections[connection.uniqueId] = connection;
            },
            _handleSocketDisconnection: function _handleSocketDisconnection(uniqueId) {
                var guid = this._connections[uniqueId].guid;
                if(guid && this._sessions[guid]) {
                    this._sessions[guid].detachConnection();
                }
                delete this._connections[uniqueId];
            },
            _linkSession: regeneratorRuntime.mark(function _linkSession(connection, guid) {
                return regeneratorRuntime.wrap(function _linkSession$(context$2$0) {
                    while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        if (this._sessions[guid]) {
                            context$2$0.next = 4;
                            break;
                        }

                        this._sessions[guid] = new R.SimpleUplinkServer.Session(guid, this._storeEvents, this._eventsEvents, this._sessionsEvents, this.sessionTimeout);
                        context$2$0.next = 4;
                        return this.sessionCreated(guid);
                    case 4:
                        return context$2$0.abrupt("return", this._sessions[guid].attachConnection(connection));
                    case 5:
                    case "end":
                        return context$2$0.stop();
                    }
                }, _linkSession, this);
            }),
            _unlinkSession: function _unlinkSession(connection, guid) {
                return R.scope(function(fn) {
                    try {
                        if(this._sessions[guid]) {
                            this._sessions[guid].terminate();
                        }
                    }
                    catch(err) {
                        return fn(R.Debug.extendError("R.SimpleUplinkServerInstance._unlinkSession(...)"));
                    }
                    return fn(null);
                }, this);
            },
            _handleSessionExpire: function _handleSessionExpire(guid) {
                R.Debug.dev(R.scope(function() {
                    assert(_.has(this._sessions, guid), "R.SimpleUplinkServer._handleSessionExpire(...): no such session.");
                }, this));
                delete this._sessions[guid];
                co(regeneratorRuntime.mark(function callee$2$0() {
                    return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                        while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            context$3$0.next = 2;
                            return this.sessionDestroyed(guid);
                        case 2:
                        case "end":
                            return context$3$0.stop();
                        }
                    }, callee$2$0, this);
                })).call(this, R.Debug.rethrow("R.SimpleUplinkServer._handleSessionExpire(...)"));
            },
        },
        Connection: function Connection(socket, handleSocketDisconnection, linkSession, unlinkSession) {
            this.uniqueId = _.uniqueId("R.SimpleUplinkServer.Connection");
            this._socket = socket;
            this._handleSocketDisconnection = handleSocketDisconnection;
            this._linkSession = linkSession;
            this._unlinkSession = unlinkSession;
            this._bindHandlers();
        },
        _ConnectionProtoProps: /** @lends R.SimpleUplinkServer.Connection.prototype */{
            _socket: null,
            uniqueId: null,
            guid: null,
            _handleSocketDisconnection: null,
            _linkSession: null,
            _unlinkSession: null,
            _subscribeTo: null,
            _unsubscribeFrom: null,
            _listenTo: null,
            _unlistenFrom: null,
            _disconnected: null,
            _bindHandlers: function _bindHandlers() {
                this._socket.on("handshake", R.scope(this._handleHandshake, this));
                this._socket.on("subscribeTo", R.scope(this._handleSubscribeTo, this));
                this._socket.on("unsubscribeFrom", R.scope(this._handleUnsubscribeFrom, this));
                this._socket.on("listenTo", R.scope(this._handleListenTo, this));
                this._socket.on("unlistenFrom", R.scope(this._handleUnlistenFrom, this));
                this._socket.on("disconnect", R.scope(this._handleDisconnect, this));
                this._socket.on("unhandshake", R.scope(this._handleUnHandshake, this));
            },
            emit: function emit(name, params) {
                R.Debug.dev(function() {
                    console.warn("[C] >>> " + name, params);
                });
                this._socket.emit(name, params);
            },
            _handleHandshake: function _handleHandshake(params) {
                if(!_.has(params, "guid") || !_.isString(params.guid)) {
                    this.emit("err", { err: "handshake.params.guid: expected String."});
                }
                else if(this.guid) {
                    this.emit("err", { err: "handshake: session already linked."});
                }
                else {
                    co(regeneratorRuntime.mark(function callee$2$0() {
                        var s;

                        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                            while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                this.guid = params.guid;
                                context$3$0.next = 3;
                                return this._linkSession(this, this.guid);
                            case 3:
                                s = context$3$0.sent;
                                this.emit("handshake-ack", { recovered: s.recovered });
                                this._subscribeTo = s.subscribeTo;
                                this._unsubscribeFrom = s.unsubscribeFrom;
                                this._listenTo = s.listenTo;
                                this._unlistenFrom = s.unlistenFrom;
                            case 9:
                            case "end":
                                return context$3$0.stop();
                            }
                        }, callee$2$0, this);
                    })).call(this, R.Debug.rethrow("R.SimpleUplinkServer.Connection._handleHandshake(...)"));
                }
            },
            _handleUnHandshake: function _handleUnHandshake() {
                if(!this.guid) {
                    this.emit("err", { err: "unhandshake: no active session."});
                }
                else {
                    co(regeneratorRuntime.mark(function callee$2$0() {
                        var s;

                        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                            while (1) switch (context$3$0.prev = context$3$0.next) {
                            case 0:
                                this._subscribeTo = null;
                                this._unsubscribeFrom = null;
                                this._listenTo = null;
                                this._unlistenFrom = null;
                                context$3$0.next = 6;
                                return this._unlinkSession(this, this.guid);
                            case 6:
                                s = context$3$0.sent;
                                this.emit("unhandshake-ack");
                                this.guid = null;
                            case 9:
                            case "end":
                                return context$3$0.stop();
                            }
                        }, callee$2$0, this);
                    })).call(this, R.Debug.rethrow("R.SimpleUplinkServer.Connection._handleUnHandshake(...)"));
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
                    this._emit("err", { err: "unlistenFrom: requires handshake." });
                }
                else {
                    this.unlistenFrom(params.eventName);
                }
            },
            _handleDisconnect: function _handleDisconnect() {
                this._handleSocketDisconnection(this.uniqueId, false);
            },
        },
        Session: function Session(guid, storeEvents, eventsEvents, sessionsEvents, timeout) {
            this._guid = guid;
            this._storeEvents = storeEvents;
            this._eventsEvents = eventsEvents;
            this._sessionsEvents = sessionsEvents;
            this._messageQueue = [];
            this._timeoutDuration = timeout;
            this._expire = R.scope(this._expire, this);
            this._expireTimeout = setTimeout(this._expire, this._timeoutDuration);
            this._subscriptions = {};
            this._listeners = {};
        },
        _SessionProtoProps: /** @lends R.SimpleUplinkServer.Session.prototype */{
            _guid: null,
            _connection: null,
            _subscriptions: null,
            _listeners: null,
            _storeEvents: null,
            _eventsEvents: null,
            _sessionsEvents: null,
            _messageQueue: null,
            _expireTimeout: null,
            _timeoutDuration: null,
            attachConnection: function attachConnection(connection) {
                var recovered = (this._connection !== null);
                this.detachConnection();
                this._connection = connection;
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
            terminate: function terminate() {
                this._expire();
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
                R.Debug.dev(function() {
                    console.warn("[S] >>> " + name, params);
                });
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
                _.each(_.keys(this._subscriptions), R.scope(this.unsubscribeFrom, this));
                _.each(_.keys(this._listeners), R.scope(this.unlistenFrom, this));
                this._sessionsEvents.emit("expire", this._guid);
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
        },
    };

    _.extend(SimpleUplinkServer.SimpleUplinkServerInstance.prototype, SimpleUplinkServer._SimpleUplinkServerInstanceProtoProps);
    _.extend(SimpleUplinkServer.Connection.prototype, SimpleUplinkServer._ConnectionProtoProps);
    _.extend(SimpleUplinkServer.Session.prototype, SimpleUplinkServer._SessionProtoProps);

    return SimpleUplinkServer;
};
