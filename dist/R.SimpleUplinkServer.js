"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var io = require("socket.io");
  var _ = require("lodash");
  var assert = require("assert");
  var co = require("co");
  var EventEmitter = require("events").EventEmitter;
  var bodyParser = require("body-parser");

  /**
  * <p> SimpleUplinkServer represents an uplink-server that will be able to store data via an other server.<br />
  * There also will be able to notify each client who suscribes to a data when an update will occurs thanks to socket </p>
  * <p> SimpleUplinkServer will be requested by GET or POST via R.Uplink server-side and client-side
  * @class R.SimpleUplinkServer
  */
  var SimpleUplinkServer = {
    /**
    * <p> Initializes the SimpleUplinkServer according to the specifications provided </p>
    * @method createApp
    * @param {object} specs All the specifications of the SimpleUplinkServer
    * @return {SimpleUplinkServerInstance} SimpleUplinkServerInstance The instance of the created SimpleUplinkServer
    */
    createServer: function createServer(specs) {
      R.Debug.dev(function () {
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
        this._pid = R.guid("SimpleUplinkServer");
      };
      _.extend(SimpleUplinkServerInstance.prototype, SimpleUplinkServer.SimpleUplinkServerInstance.prototype, specs);
      return SimpleUplinkServerInstance;
    },
    /**
    * <p> Setting up necessary methods for the SimpleUplinkServer </p>
    * @method SimpleUplinkServerInstance
    */
    SimpleUplinkServerInstance: function SimpleUplinkServerInstance() {
      this._store = {};
      this._hashes = {};
      this._storeRouter = new R.Router();
      this._storeRouter.def(_.constant({
        err: "Unknown store key" }));
      this._storeEvents = new EventEmitter();
      this._eventsRouter = new R.Router();
      this._eventsRouter.def(_.constant({
        err: "Unknown event name" }));
      this._eventsEvents = new EventEmitter();
      this._actionsRouter = new R.Router();
      this._actionsRouter.def(_.constant({
        err: "Unknown action" }));
      this._sessions = {};
      this._sessionsEvents = new EventEmitter();
      this._connections = {};

      this._linkSession = R.scope(this._linkSession, this);
      this._unlinkSession = R.scope(this._unlinkSession, this);
    },
    _SimpleUplinkServerInstanceProtoProps: /** @lends R.SimpleUplinkServer.SimpleUplinkServerInstance.prototype */{
      _specs: null,
      _pid: null,
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
      /**
      * <p>Saves data in store.
      * Called by another server that will provide data for each updated data </p>
      * @method setStore
      * @param {string} key The specified key to set
      * @param {string} val The value to save
      * @return {function} 
      */
      setStore: function setStore(key, val) {
        return R.scope(function (fn) {
          try {
            var previousVal = this._store[key] || {};
            var previousHash = this._hashes[key] || R.hash(JSON.stringify(previousVal));
            var diff = R.diff(previousVal, val);
            var hash = R.hash(JSON.stringify(val));
            this._store[key] = val;
            this._hashes[key] = hash;
            this._storeEvents.emit("set:" + key, {
              k: key,
              d: diff,
              h: previousHash });
          } catch (err) {
            return fn(R.Debug.extendError(err, "R.SimpleUplinkServer.setStore('" + key + "', '" + val + "')"));
          }
          _.defer(function () {
            fn(null, val);
          });
        }, this);
      },

      /**
      * <p> Provides data from store. <br />
      * Called when the fetching data occurs. <br />
      * Requested by GET from R.Store server-side or client-side</p>
      * @method getStore
      * @param {string} key The specified key to set
      * @return {function} 
      */
      getStore: function getStore(key) {
        return R.scope(function (fn) {
          var val;
          try {
            R.Debug.dev(R.scope(function () {
              if (!_.has(this._store, key)) {
                console.warn("R.SimpleUplinkServer(...).getStore: no such key (" + key + ")");
              }
            }, this));
            val = this._store[key];
          } catch (err) {
            return fn(R.Debug.extendError(err, "R.SimpleUplinkServer.getStore('" + key + "')"));
          }
          _.defer(function () {
            fn(null, val);
          });
        }, this);
      },
      /**
      * @method emitEvent
      * @param {string} eventName
      * @param {object} params
      */
      emitEvent: function emitEvent(eventName, params) {
        this._eventsEvents.emit("emit:" + eventName, params);
      },
      /**
      * @method emitDebug
      * @param {string} guid
      * @param {object} params
      */
      emitDebug: function emitDebug(guid, params) {
        R.Debug.dev(R.scope(function () {
          if (this._sessions[guid]) {
            this._sessions[guid].emit("debug", params);
          }
        }, this));
      },
      /**
      * @method emitLog
      * @param {string} guid
      * @param {object} params
      */
      emitLog: function emitLog(guid, params) {
        if (this._sessions[guid]) {
          this._sessions[guid].emit("log", params);
        }
      },
      /**
      * @method emitWarn
      * @param {string} guid
      * @param {object} params
      */
      emitWarn: function emitLog(guid, params) {
        if (this._sessions[guid]) {
          this._sessions[guid].emit("warn", params);
        }
      },
      /**
      * @method emitError
      * @param {string} guid
      * @param {object} params
      */
      emitError: function emitLog(guid, params) {
        if (this._sessions[guid]) {
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
      /** 
      * <p> Setting up UplinkServer. <br />
      * - create the socket connection <br />
      * - init get and post app in order to provide data via R.Uplink.fetch</p>
      * @method installHandlers
      * @param {object} app The specified App
      * @param {string} prefix The prefix string that will be requested. Tipically "/uplink"
      */
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

            case 16: return context$2$0.abrupt("return", server);
            case 17:
            case "end": return context$2$0.stop();
          }
        }, installHandlers, this);
      }),
      /**
      * <p>Return the saved data from store</p>
      * <p>Requested from R.Store server-side or client-side</p>
      * @method _handleHttpGet
      * @param {object} req The classical request
      * @param {object} res The response to send
      * @param {object} next
      * @return {string} val The computed json value
      */
      _handleHttpGet: function _handleHttpGet(req, res, next) {
        co(regeneratorRuntime.mark(function callee$2$0() {
          var path, key;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                path = req.path.slice(this._prefix.length - 1);
                key = this._storeRouter.match(path);

                R.Debug.dev(function () {
                  console.warn("<<< fetch", path);
                });
                context$3$0.next = 5;
                return this.getStore(key);

              case 5: return context$3$0.abrupt("return", context$3$0.sent);
              case 6:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })).call(this, function (err, val) {
          if (err) {
            if (R.Debug.isDev()) {
              return res.status(500).json({ err: err.toString(), stack: err.stack });
            } else {
              return res.status(500).json({ err: err.toString() });
            }
          } else {
            return res.status(200).json(val);
          }
        });
      },
      /**
      * @method _handleHttpPost
      * @param {object} req The classical request
      * @param {object} res The response to send
      * @return {string} str
      */
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

                R.Debug.dev(function () {
                  console.warn("<<< action", path, params);
                });
                context$3$0.next = 13;
                return handler(params);

              case 13: return context$3$0.abrupt("return", context$3$0.sent);
              case 14:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })).call(this, function (err, val) {
          if (err) {
            if (R.Debug.isDev()) {
              return res.status(500).json({ err: err.toString(), stack: err.stack });
            } else {
              return res.status(500).json({ err: err.toString() });
            }
          } else {
            res.status(200).json(val);
          }
        });
      },
      /** 
      * <p> Create a R.SimpleUplinkServer.Connection in order to set up handler items. <br />
      * Triggered when a socket connection is established </p>
      * @method _handleSocketConnection
      * @param {Object} socket The socket used in the connection
      */
      _handleSocketConnection: function _handleSocketConnection(socket) {
        var connection = new R.SimpleUplinkServer.Connection(this._pid, socket, this._handleSocketDisconnection, this._linkSession, this._unlinkSession);
        this._connections[connection.uniqueId] = connection;
      },

      /** 
      * <p> Destroy a R.SimpleUplinkServer.Connection. <br />
      * Triggered when a socket connection is closed </p>
      * @method _handleSocketDisconnection
      * @param {string} uniqueId The unique Id of the connection
      */
      _handleSocketDisconnection: function _handleSocketDisconnection(uniqueId) {
        var guid = this._connections[uniqueId].guid;
        if (guid && this._sessions[guid]) {
          this._sessions[guid].detachConnection();
        }
        delete this._connections[uniqueId];
      },

      /** 
      * <p>Link a Session in order to set up subscribing and unsubscribing methods uplink-server-side</p>
      * @method _linkSession
      * @param {SimpleUplinkServer.Connection} connection The created connection
      * @param {string} guid Unique string GUID
      * @return {object} the object that contains methods subscriptions/unsubscriptions
      */
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

            case 4: return context$2$0.abrupt("return", this._sessions[guid].attachConnection(connection));
            case 5:
            case "end": return context$2$0.stop();
          }
        }, _linkSession, this);
      }),

      /** 
      * <p>Unlink a Session</p>
      * @method _unlinkSession
      * @param {SimpleUplinkServer.Connection} connection 
      * @param {string} guid Unique string GUID
      * @return {Function} fn
      */
      _unlinkSession: function _unlinkSession(connection, guid) {
        return R.scope(function (fn) {
          try {
            if (this._sessions[guid]) {
              this._sessions[guid].terminate();
            }
          } catch (err) {
            return fn(R.Debug.extendError("R.SimpleUplinkServerInstance._unlinkSession(...)"));
          }
          return fn(null);
        }, this);
      },
      /** 
      * @method _handleSessionExpire
      * @param {string} guid Unique string GUID
      */
      _handleSessionExpire: function _handleSessionExpire(guid) {
        R.Debug.dev(R.scope(function () {
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
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })).call(this, R.Debug.rethrow("R.SimpleUplinkServer._handleSessionExpire(...)"));
      } },
    /** 
    * <p>Setting up a connection in order to initialies methods and to provides specifics listeners on the socket</p>
    * @method Connection
    * @param {object} pid 
    * @param {object} socket
    * @param {object} handleSocketDisconnection
    * @param {object} linkSession 
    * @param {object} unlinkSession
    */
    Connection: function Connection(pid, socket, handleSocketDisconnection, linkSession, unlinkSession) {
      this._pid = pid;
      this.uniqueId = _.uniqueId("R.SimpleUplinkServer.Connection");
      this._socket = socket;
      this._handleSocketDisconnection = handleSocketDisconnection;
      this._linkSession = linkSession;
      this._unlinkSession = unlinkSession;
      this._bindHandlers();
    },
    _ConnectionProtoProps: /** @lends R.SimpleUplinkServer.Connection.prototype */{
      _socket: null,
      _pid: null,
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
      /** 
      * <p>Setting up the specifics listeners for the socket</p>
      * @method _bindHandlers
      */
      _bindHandlers: function _bindHandlers() {
        this._socket.on("handshake", R.scope(this._handleHandshake, this));
        this._socket.on("subscribeTo", R.scope(this._handleSubscribeTo, this));
        this._socket.on("unsubscribeFrom", R.scope(this._handleUnsubscribeFrom, this));
        this._socket.on("listenTo", R.scope(this._handleListenTo, this));
        this._socket.on("unlistenFrom", R.scope(this._handleUnlistenFrom, this));
        this._socket.on("disconnect", R.scope(this._handleDisconnect, this));
        this._socket.on("unhandshake", R.scope(this._handleUnHandshake, this));
      },
      /**
      * <p> Simply emit a specific action on the socket </p>
      * @method emit
      * @param {string} name The name of the action to send
      * @param {object} params The params 
      */
      emit: function emit(name, params) {
        R.Debug.dev(function () {
          console.warn("[C] >>> " + name, params);
        });
        this._socket.emit(name, params);
      },
      /**
      * <p> Triggered by the recently connected client. <br />
      * Combines methods of subscriptions that will be triggered by the client via socket listening</p>
      * @method _handleHandshake
      * @param {String} params Contains the unique string GUID
      */
      _handleHandshake: function _handleHandshake(params) {
        if (!_.has(params, "guid") || !_.isString(params.guid)) {
          this.emit("err", { err: "handshake.params.guid: expected String." });
        } else if (this.guid) {
          this.emit("err", { err: "handshake: session already linked." });
        } else {
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

                  this.emit("handshake-ack", {
                    pid: this._pid,
                    recovered: s.recovered });
                  this._subscribeTo = s.subscribeTo;
                  this._unsubscribeFrom = s.unsubscribeFrom;
                  this._listenTo = s.listenTo;
                  this._unlistenFrom = s.unlistenFrom;

                case 9:
                case "end": return context$3$0.stop();
              }
            }, callee$2$0, this);
          })).call(this, R.Debug.rethrow("R.SimpleUplinkServer.Connection._handleHandshake(...)"));
        }
      },
      /**
      * <p> Triggered by the recently disconnected client. <br />
      * Removes methods of subscriptions</p>
      * @method _handleHandshake
      */
      _handleUnHandshake: function _handleUnHandshake() {
        if (!this.guid) {
          this.emit("err", { err: "unhandshake: no active session." });
        } else {
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
                case "end": return context$3$0.stop();
              }
            }, callee$2$0, this);
          })).call(this, R.Debug.rethrow("R.SimpleUplinkServer.Connection._handleUnHandshake(...)"));
        }
      },
      /** 
      * <p>Maps the triggered event with the _subscribeTo methods </p>
      * @method _handleSubscribeTo
      * @param {object} params Contains the key provided by client
      */
      _handleSubscribeTo: function _handleSubscribeTo(params) {
        if (!_.has(params, "key") || !_.isString(params.key)) {
          this.emit("err", { err: "subscribeTo.params.key: expected String." });
        } else if (!this._subscribeTo) {
          this.emit("err", { err: "subscribeTo: requires handshake." });
        } else {
          this._subscribeTo(params.key);
        }
      },
      /** 
      * <p>Maps the triggered event with the _unsubscribeFrom methods</p>
      * @method _handleUnsubscribeFrom
      * @param {object} params Contains the key provided by client
      */
      _handleUnsubscribeFrom: function _handleUnsubscribeFrom(params) {
        if (!_.has(params, "key") || !_.isString(params.key)) {
          this.emit("err", { err: "unsubscribeFrom.params.key: expected String." });
        } else if (!this._unsubscribeFrom) {
          this.emit("err", { err: "unsubscribeFrom: requires handshake." });
        } else {
          this._unsubscribeFrom(params.key);
        }
      },
      /** 
      * <p>Maps the triggered event with the listenTo methods</p>
      * @method _handleListenTo
      * @param {object} params Contains the eventName provided by client
      */
      _handleListenTo: function _handleListenTo(params) {
        if (!_.has(params, "eventName") || !_.isString(params.eventName)) {
          this.emit("err", { err: "listenTo.params.eventName: expected String." });
        } else if (!this._listenTo) {
          this.emit("err", { err: "listenTo: requires handshake." });
        } else {
          this.listenTo(params.eventName);
        }
      },
      /** 
      * <p>Maps the triggered event with the unlistenFrom methods</p>
      * @method _handleUnlistenFrom
      * @param {object} params Contains the eventName provided by client
      */
      _handleUnlistenFrom: function _handleUnlistenFrom(params) {
        if (!_.has(params, "eventName") || !_.isString(params.eventName)) {
          this.emit("err", { err: "unlistenFrom.params.eventName: expected String." });
        } else if (!this.unlistenFrom) {
          this._emit("err", { err: "unlistenFrom: requires handshake." });
        } else {
          this.unlistenFrom(params.eventName);
        }
      },
      /** 
      * <p>Triggered by the recently disconnected client.</p>
      * @method _handleDisconnect
      */
      _handleDisconnect: function _handleDisconnect() {
        this._handleSocketDisconnection(this.uniqueId, false);
      } },
    /** 
    * <p>Setting up a session</p>
    * @method Session
    * @param {object} pid 
    * @param {object} storeEvents
    * @param {object} eventsEvents
    * @param {object} sessionsEvents 
    * @param {object} timeout
    */
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
      /**
      * <p>Bind the subscribing and unsubscribing methods when a connection is established <br />
      * Methods that trigger on client issues (like emit("subscribeTo"), emit("unsubscribeFrom"))</p>
      * @method attachConnection
      * @param {SimpleUplinkServer.Connection} connection the current created connection
      * @return {object} the binded object with methods
      */
      attachConnection: function attachConnection(connection) {
        var recovered = (this._connection !== null);
        this.detachConnection();
        this._connection = connection;
        _.each(this._messageQueue, function (m) {
          connection.emit(m.name, m.params);
        });
        this._messageQueue = null;
        clearTimeout(this._expireTimeout);
        return {
          recovered: recovered,
          subscribeTo: R.scope(this.subscribeTo, this),
          unsubscribeFrom: R.scope(this.unsubscribeFrom, this),
          listenTo: R.scope(this.listenTo, this),
          unlistenFrom: R.scope(this.unlistenFrom, this) };
      },
      /**
      * <p>Remove the previously added connection, and clean the message queue </p>
      * @method detachConnection
      */
      detachConnection: function detachConnection() {
        if (this._connection === null) {
          return;
        } else {
          this._connection = null;
          this._messageQueue = [];
          this._expireTimeout = setTimeout(this._expire, this._timeoutDuration);
        }
      },
      /**
      * @method terminate
      */
      terminate: function terminate() {
        this._expire();
      },
      /** 
      * <p>Method invoked by client via socket emit <br />
      * Store the _signalUpdate method in subscription <br />
      * Add a listener that will call _signalUpdate when triggered </p>
      * @method subscribeTo
      * @param {string} key The key to subscribe
      */
      subscribeTo: function subscribeTo(key) {
        R.Debug.dev(R.scope(function () {
          assert(!_.has(this._subscriptions, key), "R.SimpleUplinkServer.Session.subscribeTo(...): already subscribed.");
        }, this));
        this._subscriptions[key] = this._signalUpdate();
        this._storeEvents.addListener("set:" + key, this._subscriptions[key]);
      },

      /** 
      * <p>Method invoked by client via socket emit <br />
      * Remove a listener according to the key</p>
      * @method subscribeTo
      * @param {string} key The key to unsubscribe
      */
      unsubscribeFrom: function unsubscribeFrom(key) {
        R.Debug.dev(R.scope(function () {
          assert(_.has(this._subscriptions, key), "R.SimpleUplinkServer.Session.unsubscribeFrom(...): not subscribed.");
        }, this));
        this._storeEvents.removeListener("set:" + key, this._subscriptions[key]);
        delete this._subscriptions[key];
      },
      /**
      * <p> Simply emit a specific action on the socket </p>
      * @method _emit
      * @param {string} name The name of the action to send
      * @param {object} params The params 
      */
      _emit: function _emit(name, params) {
        R.Debug.dev(function () {
          console.warn("[S] >>> " + name, params);
        });
        if (this._connection !== null) {
          this._connection.emit(name, params);
        } else {
          this._messageQueue.push({
            name: name,
            params: params });
        }
      },
      /** <p>Push an update action on the socket. <br />
      * The client is listening on the action "update" socket </p>
      * @method _signalUpdate
      */
      _signalUpdate: function _signalUpdate() {
        return R.scope(function (patch) {
          this._emit("update", patch);
        }, this);
      },
      /** <p>Push an event action on the socket. <br />
      * The client is listening on the action "event" socket </p>
      * @method _signalEvent
      */
      _signalEvent: function _signalEvent(eventName) {
        return R.scope(function (params) {
          this._emit("event", { eventName: eventName, params: params });
        }, this);
      },
      /**
      * @method _expire
      */
      _expire: function _expire() {
        _.each(_.keys(this._subscriptions), R.scope(this.unsubscribeFrom, this));
        _.each(_.keys(this._listeners), R.scope(this.unlistenFrom, this));
        this._sessionsEvents.emit("expire", this._guid);
      },
      /**
      * <p> Create a listener for the events </p>
      * @method listenTo
      * @param {string} eventName The name of the event that will be registered
      */
      listenTo: function listenTo(eventName) {
        R.Debug.dev(R.scope(function () {
          assert(!_.has(this._listeners, key), "R.SimpleUplinkServer.Session.listenTo(...): already listening.");
        }, this));
        this._listeners[eventName] = this._signalEvent(eventName);
        this._eventsEvents.addListener("emit:" + eventName, this._listeners[eventName]);
      },
      /**
      * <p> Remove a listener from the events </p>
      * @method unlistenFrom
      * @param {string} eventName The name of the event that will be unregistered
      */
      unlistenFrom: function unlistenFrom(eventName) {
        R.Debug.dev(R.scope(function () {
          assert(_.has(this._listeners, eventName), "R.SimpleUplinkServer.Session.unlistenFrom(...): not listening.");
        }, this));
        this._eventsEvents.removeListener("emit:" + eventName, this._listeners[eventName]);
        delete this._listeners[eventName];
      } } };

  _.extend(SimpleUplinkServer.SimpleUplinkServerInstance.prototype, SimpleUplinkServer._SimpleUplinkServerInstanceProtoProps);
  _.extend(SimpleUplinkServer.Connection.prototype, SimpleUplinkServer._ConnectionProtoProps);
  _.extend(SimpleUplinkServer.Session.prototype, SimpleUplinkServer._SessionProtoProps);

  return SimpleUplinkServer;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLlNpbXBsZVVwbGlua1NlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUIsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixNQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUNsRCxNQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7Ozs7O0FBUXhDLE1BQUksa0JBQWtCLEdBQUc7Ozs7Ozs7QUFPckIsZ0JBQVksRUFBRSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDdkMsT0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixjQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxzRUFBc0UsQ0FBQyxDQUFDO0FBQ3RILGNBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLHVFQUF1RSxDQUFDLENBQUM7QUFDekgsY0FBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMs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QkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUV0RixTQUFPLGtCQUFrQixDQUFDO0NBQzdCLENBQUMiLCJmaWxlIjoiUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIHZhciBpbyA9IHJlcXVpcmUoXCJzb2NrZXQuaW9cIik7XG4gICAgdmFyIF8gPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuICAgIHZhciBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xuICAgIHZhciBjbyA9IHJlcXVpcmUoXCJjb1wiKTtcbiAgICB2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXI7XG4gICAgdmFyIGJvZHlQYXJzZXIgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7XG5cbiAgICAvKipcbiAgICAqIDxwPiBTaW1wbGVVcGxpbmtTZXJ2ZXIgcmVwcmVzZW50cyBhbiB1cGxpbmstc2VydmVyIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHN0b3JlIGRhdGEgdmlhIGFuIG90aGVyIHNlcnZlci48YnIgLz5cbiAgICAqIFRoZXJlIGFsc28gd2lsbCBiZSBhYmxlIHRvIG5vdGlmeSBlYWNoIGNsaWVudCB3aG8gc3VzY3JpYmVzIHRvIGEgZGF0YSB3aGVuIGFuIHVwZGF0ZSB3aWxsIG9jY3VycyB0aGFua3MgdG8gc29ja2V0IDwvcD5cbiAgICAqIDxwPiBTaW1wbGVVcGxpbmtTZXJ2ZXIgd2lsbCBiZSByZXF1ZXN0ZWQgYnkgR0VUIG9yIFBPU1QgdmlhIFIuVXBsaW5rIHNlcnZlci1zaWRlIGFuZCBjbGllbnQtc2lkZVxuICAgICogQGNsYXNzIFIuU2ltcGxlVXBsaW5rU2VydmVyXG4gICAgKi9cbiAgICB2YXIgU2ltcGxlVXBsaW5rU2VydmVyID0ge1xuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gSW5pdGlhbGl6ZXMgdGhlIFNpbXBsZVVwbGlua1NlcnZlciBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvcD5cbiAgICAgICAgKiBAbWV0aG9kIGNyZWF0ZUFwcFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzcGVjcyBBbGwgdGhlIHNwZWNpZmljYXRpb25zIG9mIHRoZSBTaW1wbGVVcGxpbmtTZXJ2ZXJcbiAgICAgICAgKiBAcmV0dXJuIHtTaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZX0gU2ltcGxlVXBsaW5rU2VydmVySW5zdGFuY2UgVGhlIGluc3RhbmNlIG9mIHRoZSBjcmVhdGVkIFNpbXBsZVVwbGlua1NlcnZlclxuICAgICAgICAqL1xuICAgICAgICBjcmVhdGVTZXJ2ZXI6IGZ1bmN0aW9uIGNyZWF0ZVNlcnZlcihzcGVjcykge1xuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLnN0b3JlICYmIF8uaXNBcnJheShzcGVjcy5zdG9yZSksIFwiUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuY3JlYXRlU2VydmVyKC4uLikuc3BlY3Muc3RvcmU6IGV4cGVjdGluZyBBcnJheS5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmV2ZW50cyAmJiBfLmlzQXJyYXkoc3BlY3MuZXZlbnRzKSwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5jcmVhdGVTZXJ2ZXIoLi4uKS5zcGVjcy5ldmVudHM6IGV4cGVjdGluZyBBcnJheS5cIik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmFjdGlvbnMgJiYgXy5pc1BsYWluT2JqZWN0KHNwZWNzLmFjdGlvbnMpLCBcIlIuU2ltcGxlVXBsaW5rU2VydmVyLmNyZWF0ZVNlcnZlciguLi4pLnNwZWNzLmFjdGlvbnM6IGV4cGVjdGluZyBPYmplY3QuXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChzcGVjcy5zZXNzaW9uQ3JlYXRlZCAmJiBfLmlzRnVuY3Rpb24oc3BlY3Muc2Vzc2lvbkNyZWF0ZWQpLCBcIlIuU2ltcGxlVXBsaW5rU2VydmVyLmNyZWF0ZVNlcnZlciguLi4pLnNwZWNzLnNlc3Npb25DcmVhdGVkOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChzcGVjcy5zZXNzaW9uRGVzdHJveWVkICYmIF8uaXNGdW5jdGlvbihzcGVjcy5zZXNzaW9uRGVzdHJveWVkKSwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5jcmVhdGVTZXJ2ZXIoLi4uKS5zcGVjcy5zZXNzaW9uRGVzdHJveWVkOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xuICAgICAgICAgICAgICAgIGFzc2VydChzcGVjcy5zZXNzaW9uVGltZW91dCAmJiBfLmlzTnVtYmVyKHNwZWNzLnNlc3Npb25UaW1lb3V0KSwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5jcmVhdGVTZXJ2ZXIoLi4uKS5zcGVjcy5zZXNzaW9uVGltZW91dDogZXhwZWN0aW5nIE51bWJlci5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBTaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZSA9IGZ1bmN0aW9uIFNpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlKCkge1xuICAgICAgICAgICAgICAgIFNpbXBsZVVwbGlua1NlcnZlci5TaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NwZWNzID0gc3BlY3M7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGlkID0gUi5ndWlkKFwiU2ltcGxlVXBsaW5rU2VydmVyXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKFNpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlLnByb3RvdHlwZSwgU2ltcGxlVXBsaW5rU2VydmVyLlNpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlLnByb3RvdHlwZSwgc3BlY3MpO1xuICAgICAgICAgICAgcmV0dXJuIFNpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgKiA8cD4gU2V0dGluZyB1cCBuZWNlc3NhcnkgbWV0aG9kcyBmb3IgdGhlIFNpbXBsZVVwbGlua1NlcnZlciA8L3A+XG4gICAgICAgICogQG1ldGhvZCBTaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZVxuICAgICAgICAqL1xuICAgICAgICBTaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZTogZnVuY3Rpb24gU2ltcGxlVXBsaW5rU2VydmVySW5zdGFuY2UoKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZSA9IHt9O1xuICAgICAgICAgICAgdGhpcy5faGFzaGVzID0ge307XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVJvdXRlciA9IG5ldyBSLlJvdXRlcigpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVSb3V0ZXIuZGVmKF8uY29uc3RhbnQoe1xuICAgICAgICAgICAgICAgIGVycjogXCJVbmtub3duIHN0b3JlIGtleVwiLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgICB0aGlzLl9ldmVudHNSb3V0ZXIgPSBuZXcgUi5Sb3V0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50c1JvdXRlci5kZWYoXy5jb25zdGFudCh7XG4gICAgICAgICAgICAgICAgZXJyOiBcIlVua25vd24gZXZlbnQgbmFtZVwiLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRzRXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1JvdXRlciA9IG5ldyBSLlJvdXRlcigpO1xuICAgICAgICAgICAgdGhpcy5fYWN0aW9uc1JvdXRlci5kZWYoXy5jb25zdGFudCh7XG4gICAgICAgICAgICAgICAgZXJyOiBcIlVua25vd24gYWN0aW9uXCIsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB0aGlzLl9zZXNzaW9ucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5fc2Vzc2lvbnNFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLl9saW5rU2Vzc2lvbiA9IFIuc2NvcGUodGhpcy5fbGlua1Nlc3Npb24sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fdW5saW5rU2Vzc2lvbiA9IFIuc2NvcGUodGhpcy5fdW5saW5rU2Vzc2lvbiwgdGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIF9TaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZVByb3RvUHJvcHM6IC8qKiBAbGVuZHMgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuU2ltcGxlVXBsaW5rU2VydmVySW5zdGFuY2UucHJvdG90eXBlICove1xuICAgICAgICAgICAgX3NwZWNzOiBudWxsLFxuICAgICAgICAgICAgX3BpZDogbnVsbCxcbiAgICAgICAgICAgIF9wcmVmaXg6IG51bGwsXG4gICAgICAgICAgICBfYXBwOiBudWxsLFxuICAgICAgICAgICAgX2lvOiBudWxsLFxuICAgICAgICAgICAgX3N0b3JlOiBudWxsLFxuICAgICAgICAgICAgX3N0b3JlRXZlbnRzOiBudWxsLFxuICAgICAgICAgICAgX3N0b3JlUm91dGVyOiBudWxsLFxuICAgICAgICAgICAgX2V2ZW50c1JvdXRlcjogbnVsbCxcbiAgICAgICAgICAgIF9ldmVudHNFdmVudHM6IG51bGwsXG4gICAgICAgICAgICBfYWN0aW9uc1JvdXRlcjogbnVsbCxcbiAgICAgICAgICAgIF9zZXNzaW9uczogbnVsbCxcbiAgICAgICAgICAgIF9zZXNzaW9uc0V2ZW50czogbnVsbCxcbiAgICAgICAgICAgIF9jb25uZWN0aW9uczogbnVsbCxcbiAgICAgICAgICAgIGJvb3RzdHJhcDogbnVsbCxcbiAgICAgICAgICAgIHNlc3Npb25DcmVhdGVkOiBudWxsLFxuICAgICAgICAgICAgc2Vzc2lvbkRlc3Ryb3llZDogbnVsbCxcbiAgICAgICAgICAgIHNlc3Npb25UaW1lb3V0OiBudWxsLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPlNhdmVzIGRhdGEgaW4gc3RvcmUuXG4gICAgICAgICAgICAqIENhbGxlZCBieSBhbm90aGVyIHNlcnZlciB0aGF0IHdpbGwgcHJvdmlkZSBkYXRhIGZvciBlYWNoIHVwZGF0ZWQgZGF0YSA8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2Qgc2V0U3RvcmVcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgc3BlY2lmaWVkIGtleSB0byBzZXRcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbCBUaGUgdmFsdWUgdG8gc2F2ZVxuICAgICAgICAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2V0U3RvcmU6IGZ1bmN0aW9uIHNldFN0b3JlKGtleSwgdmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFIuc2NvcGUoZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1ZhbCA9IHRoaXMuX3N0b3JlW2tleV0gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNIYXNoID0gdGhpcy5faGFzaGVzW2tleV0gfHwgUi5oYXNoKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzVmFsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IFIuZGlmZihwcmV2aW91c1ZhbCwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNoID0gUi5oYXNoKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RvcmVba2V5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhc2hlc1trZXldID0gaGFzaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JlRXZlbnRzLmVtaXQoXCJzZXQ6XCIgKyBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZDogZGlmZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOiBwcmV2aW91c0hhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihSLkRlYnVnLmV4dGVuZEVycm9yKGVyciwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5zZXRTdG9yZSgnXCIgKyBrZXkgKyBcIicsICdcIiArIHZhbCArIFwiJylcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF8uZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbihudWxsLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD4gUHJvdmlkZXMgZGF0YSBmcm9tIHN0b3JlLiA8YnIgLz5cbiAgICAgICAgICAgICogQ2FsbGVkIHdoZW4gdGhlIGZldGNoaW5nIGRhdGEgb2NjdXJzLiA8YnIgLz5cbiAgICAgICAgICAgICogUmVxdWVzdGVkIGJ5IEdFVCBmcm9tIFIuU3RvcmUgc2VydmVyLXNpZGUgb3IgY2xpZW50LXNpZGU8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgZ2V0U3RvcmVcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgc3BlY2lmaWVkIGtleSB0byBzZXRcbiAgICAgICAgICAgICogQHJldHVybiB7ZnVuY3Rpb259IFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZShrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUi5zY29wZShmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighXy5oYXModGhpcy5fc3RvcmUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUi5TaW1wbGVVcGxpbmtTZXJ2ZXIoLi4uKS5nZXRTdG9yZTogbm8gc3VjaCBrZXkgKFwiICsga2V5ICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuX3N0b3JlW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oUi5EZWJ1Zy5leHRlbmRFcnJvcihlcnIsIFwiUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuZ2V0U3RvcmUoJ1wiICsga2V5ICsgXCInKVwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXy5kZWZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuKG51bGwsIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBAbWV0aG9kIGVtaXRFdmVudFxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbWl0RXZlbnQ6IGZ1bmN0aW9uIGVtaXRFdmVudChldmVudE5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c0V2ZW50cy5lbWl0KFwiZW1pdDpcIiArIGV2ZW50TmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogQG1ldGhvZCBlbWl0RGVidWdcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGd1aWRcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVtaXREZWJ1ZzogZnVuY3Rpb24gZW1pdERlYnVnKGd1aWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nlc3Npb25zW2d1aWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXNzaW9uc1tndWlkXS5lbWl0KFwiZGVidWdcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogQG1ldGhvZCBlbWl0TG9nXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBndWlkXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbWl0TG9nOiBmdW5jdGlvbiBlbWl0TG9nKGd1aWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nlc3Npb25zW2d1aWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb25zW2d1aWRdLmVtaXQoXCJsb2dcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIEBtZXRob2QgZW1pdFdhcm5cbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGd1aWRcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVtaXRXYXJuOiBmdW5jdGlvbiBlbWl0TG9nKGd1aWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nlc3Npb25zW2d1aWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb25zW2d1aWRdLmVtaXQoXCJ3YXJuXCIsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBAbWV0aG9kIGVtaXRFcnJvclxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZ3VpZFxuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAqLyAgICAgICAgICAgIFxuICAgICAgICAgICAgZW1pdEVycm9yOiBmdW5jdGlvbiBlbWl0TG9nKGd1aWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX3Nlc3Npb25zW2d1aWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb25zW2d1aWRdLmVtaXQoXCJlcnJcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgX2V4dHJhY3RPcmlnaW5hbFBhdGg6IGZ1bmN0aW9uIF9leHRyYWN0T3JpZ2luYWxQYXRoKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9iaW5kU3RvcmVSb3V0ZTogZnVuY3Rpb24gX2JpbmRTdG9yZVJvdXRlKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcmVSb3V0ZXIucm91dGUocm91dGUsIHRoaXMuX2V4dHJhY3RPcmlnaW5hbFBhdGgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9iaW5kRXZlbnRzUm91dGU6IGZ1bmN0aW9uIF9iaW5kRXZlbnRzUm91dGUocm91dGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNSb3V0ZXIucm91dGUocm91dGUsIHRoaXMuX2V4dHJhY3RPcmlnaW5hbFBhdGgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF9iaW5kQWN0aW9uc1JvdXRlOiBmdW5jdGlvbiBfYmluZEFjdGlvbnNSb3V0ZShoYW5kbGVyLCByb3V0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGlvbnNSb3V0ZXIucm91dGUocm91dGUsIF8uY29uc3RhbnQoUi5zY29wZShoYW5kbGVyLCB0aGlzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKiBcbiAgICAgICAgICAgICogPHA+IFNldHRpbmcgdXAgVXBsaW5rU2VydmVyLiA8YnIgLz5cbiAgICAgICAgICAgICogLSBjcmVhdGUgdGhlIHNvY2tldCBjb25uZWN0aW9uIDxiciAvPlxuICAgICAgICAgICAgKiAtIGluaXQgZ2V0IGFuZCBwb3N0IGFwcCBpbiBvcmRlciB0byBwcm92aWRlIGRhdGEgdmlhIFIuVXBsaW5rLmZldGNoPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGluc3RhbGxIYW5kbGVyc1xuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gYXBwIFRoZSBzcGVjaWZpZWQgQXBwXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggVGhlIHByZWZpeCBzdHJpbmcgdGhhdCB3aWxsIGJlIHJlcXVlc3RlZC4gVGlwaWNhbGx5IFwiL3VwbGlua1wiXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgaW5zdGFsbEhhbmRsZXJzOiBmdW5jdGlvbiogaW5zdGFsbEhhbmRsZXJzKGFwcCwgcHJlZml4KSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KHRoaXMuX2FwcCA9PT0gbnVsbCwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5TaW1wbGVVcGxpbmtTZXJ2ZXJJbnN0YW5jZS5pbnN0YWxsSGFuZGxlcnMoLi4uKTogYXBwIGFscmVhZHkgbW91bnRlZC5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwID0gYXBwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZWZpeCA9IHByZWZpeCB8fCBcIi91cGxpbmsvXCI7XG4gICAgICAgICAgICAgICAgdmFyIHNlcnZlciA9IHJlcXVpcmUoXCJodHRwXCIpLlNlcnZlcihhcHApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lvID0gaW8oc2VydmVyKS5vZihwcmVmaXgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcC5nZXQodGhpcy5fcHJlZml4ICsgXCIqXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlSHR0cEdldCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcC5wb3N0KHRoaXMuX3ByZWZpeCArIFwiKlwiLCBib2R5UGFyc2VyLmpzb24oKSwgUi5zY29wZSh0aGlzLl9oYW5kbGVIdHRwUG9zdCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lvLm9uKFwiY29ubmVjdGlvblwiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZVNvY2tldENvbm5lY3Rpb24sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uID0gUi5zY29wZSh0aGlzLl9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXNzaW9uc0V2ZW50cy5hZGRMaXN0ZW5lcihcImV4cGlyZVwiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZVNlc3Npb25FeHBpcmUsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5fc3BlY3Muc3RvcmUsIFIuc2NvcGUodGhpcy5fYmluZFN0b3JlUm91dGUsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5fc3BlY3MuZXZlbnRzLCBSLnNjb3BlKHRoaXMuX2JpbmRFdmVudHNSb3V0ZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9zcGVjcy5hY3Rpb25zLCBSLnNjb3BlKHRoaXMuX2JpbmRBY3Rpb25zUm91dGUsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJvb3RzdHJhcCA9IFIuc2NvcGUodGhpcy5fc3BlY3MuYm9vdHN0cmFwLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmJvb3RzdHJhcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZXJ2ZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPlJldHVybiB0aGUgc2F2ZWQgZGF0YSBmcm9tIHN0b3JlPC9wPlxuICAgICAgICAgICAgKiA8cD5SZXF1ZXN0ZWQgZnJvbSBSLlN0b3JlIHNlcnZlci1zaWRlIG9yIGNsaWVudC1zaWRlPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVIdHRwR2V0XG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0XG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXMgVGhlIHJlc3BvbnNlIHRvIHNlbmRcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IG5leHRcbiAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSB2YWwgVGhlIGNvbXB1dGVkIGpzb24gdmFsdWVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfaGFuZGxlSHR0cEdldDogZnVuY3Rpb24gX2hhbmRsZUh0dHBHZXQocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXRoID0gcmVxLnBhdGguc2xpY2UodGhpcy5fcHJlZml4Lmxlbmd0aCAtIDEpOyAvLyBrZWVwIHRoZSBsZWFkaW5nIHNsYXNoXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLl9zdG9yZVJvdXRlci5tYXRjaChwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCI8PDwgZmV0Y2hcIiwgcGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5nZXRTdG9yZShrZXkpO1xuICAgICAgICAgICAgICAgIH0pLmNhbGwodGhpcywgZnVuY3Rpb24oZXJyLCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihSLkRlYnVnLmlzRGV2KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnI6IGVyci50b1N0cmluZygpLCBzdGFjazogZXJyLnN0YWNrIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyOiBlcnIudG9TdHJpbmcoKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUh0dHBQb3N0XG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0XG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXMgVGhlIHJlc3BvbnNlIHRvIHNlbmRcbiAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBzdHJcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfaGFuZGxlSHR0cFBvc3Q6IGZ1bmN0aW9uIF9oYW5kbGVIdHRwUG9zdChyZXEsIHJlcykge1xuICAgICAgICAgICAgICAgIGNvKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhdGggPSByZXEucGF0aC5zbGljZSh0aGlzLl9wcmVmaXgubGVuZ3RoIC0gMSk7IC8vIGtlZXAgdGhlIGxlYWRpbmcgc2xhc2hcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB0aGlzLl9hY3Rpb25zUm91dGVyLm1hdGNoKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc09iamVjdChyZXEuYm9keSksIFwiYm9keTogZXhwZWN0aW5nIE9iamVjdC5cIik7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChyZXEuYm9keS5ndWlkICYmIF8uaXNTdHJpbmcocmVxLmJvZHkuZ3VpZCksIFwiZ3VpZDogZXhwZWN0aW5nIFN0cmluZy5cIik7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChyZXEuYm9keS5wYXJhbXMgJiYgXy5pc1BsYWluT2JqZWN0KHJlcS5ib2R5LnBhcmFtcyksIFwicGFyYW1zOiBleHBlY3RpbmcgT2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIV8uaGFzKHRoaXMuX3Nlc3Npb25zLCByZXEuYm9keS5ndWlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Vzc2lvbnNbZ3VpZF0gPSBuZXcgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuU2Vzc2lvbihndWlkLCB0aGlzLl9zdG9yZUV2ZW50cywgdGhpcy5fZXZlbnRzRXZlbnRzLCB0aGlzLl9zZXNzaW9uc0V2ZW50cywgdGhpcy5zZXNzaW9uVGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnNlc3Npb25DcmVhdGVkKGd1aWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBfLmV4dGVuZCh7fSwgeyBndWlkOiByZXEuYm9keS5ndWlkIH0sIHJlcS5ib2R5LnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiPDw8IGFjdGlvblwiLCBwYXRoLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGhhbmRsZXIocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVyciwgdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoUi5EZWJ1Zy5pc0RldigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyOiBlcnIudG9TdHJpbmcoKSwgc3RhY2s6IGVyci5zdGFjayB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycjogZXJyLnRvU3RyaW5nKCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD4gQ3JlYXRlIGEgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuQ29ubmVjdGlvbiBpbiBvcmRlciB0byBzZXQgdXAgaGFuZGxlciBpdGVtcy4gPGJyIC8+XG4gICAgICAgICAgICAqIFRyaWdnZXJlZCB3aGVuIGEgc29ja2V0IGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQgPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVTb2NrZXRDb25uZWN0aW9uXG4gICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb2NrZXQgVGhlIHNvY2tldCB1c2VkIGluIHRoZSBjb25uZWN0aW9uXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2hhbmRsZVNvY2tldENvbm5lY3Rpb246IGZ1bmN0aW9uIF9oYW5kbGVTb2NrZXRDb25uZWN0aW9uKHNvY2tldCkge1xuICAgICAgICAgICAgICAgIHZhciBjb25uZWN0aW9uID0gbmV3IFIuU2ltcGxlVXBsaW5rU2VydmVyLkNvbm5lY3Rpb24odGhpcy5fcGlkLCBzb2NrZXQsIHRoaXMuX2hhbmRsZVNvY2tldERpc2Nvbm5lY3Rpb24sIHRoaXMuX2xpbmtTZXNzaW9uLCB0aGlzLl91bmxpbmtTZXNzaW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uc1tjb25uZWN0aW9uLnVuaXF1ZUlkXSA9IGNvbm5lY3Rpb247XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiogXG4gICAgICAgICAgICAqIDxwPiBEZXN0cm95IGEgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuQ29ubmVjdGlvbi4gPGJyIC8+XG4gICAgICAgICAgICAqIFRyaWdnZXJlZCB3aGVuIGEgc29ja2V0IGNvbm5lY3Rpb24gaXMgY2xvc2VkIDwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfaGFuZGxlU29ja2V0RGlzY29ubmVjdGlvblxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pcXVlSWQgVGhlIHVuaXF1ZSBJZCBvZiB0aGUgY29ubmVjdGlvblxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uOiBmdW5jdGlvbiBfaGFuZGxlU29ja2V0RGlzY29ubmVjdGlvbih1bmlxdWVJZCkge1xuICAgICAgICAgICAgICAgIHZhciBndWlkID0gdGhpcy5fY29ubmVjdGlvbnNbdW5pcXVlSWRdLmd1aWQ7XG4gICAgICAgICAgICAgICAgaWYoZ3VpZCAmJiB0aGlzLl9zZXNzaW9uc1tndWlkXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXNzaW9uc1tndWlkXS5kZXRhY2hDb25uZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jb25uZWN0aW9uc1t1bmlxdWVJZF07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiogXG4gICAgICAgICAgICAqIDxwPkxpbmsgYSBTZXNzaW9uIGluIG9yZGVyIHRvIHNldCB1cCBzdWJzY3JpYmluZyBhbmQgdW5zdWJzY3JpYmluZyBtZXRob2RzIHVwbGluay1zZXJ2ZXItc2lkZTwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfbGlua1Nlc3Npb25cbiAgICAgICAgICAgICogQHBhcmFtIHtTaW1wbGVVcGxpbmtTZXJ2ZXIuQ29ubmVjdGlvbn0gY29ubmVjdGlvbiBUaGUgY3JlYXRlZCBjb25uZWN0aW9uXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBndWlkIFVuaXF1ZSBzdHJpbmcgR1VJRFxuICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRoZSBvYmplY3QgdGhhdCBjb250YWlucyBtZXRob2RzIHN1YnNjcmlwdGlvbnMvdW5zdWJzY3JpcHRpb25zXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2xpbmtTZXNzaW9uOiBmdW5jdGlvbiogX2xpbmtTZXNzaW9uKGNvbm5lY3Rpb24sIGd1aWQpIHtcbiAgICAgICAgICAgICAgICBpZighdGhpcy5fc2Vzc2lvbnNbZ3VpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Vzc2lvbnNbZ3VpZF0gPSBuZXcgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuU2Vzc2lvbihndWlkLCB0aGlzLl9zdG9yZUV2ZW50cywgdGhpcy5fZXZlbnRzRXZlbnRzLCB0aGlzLl9zZXNzaW9uc0V2ZW50cywgdGhpcy5zZXNzaW9uVGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuc2Vzc2lvbkNyZWF0ZWQoZ3VpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXNzaW9uc1tndWlkXS5hdHRhY2hDb25uZWN0aW9uKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD5VbmxpbmsgYSBTZXNzaW9uPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF91bmxpbmtTZXNzaW9uXG4gICAgICAgICAgICAqIEBwYXJhbSB7U2ltcGxlVXBsaW5rU2VydmVyLkNvbm5lY3Rpb259IGNvbm5lY3Rpb24gXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBndWlkIFVuaXF1ZSBzdHJpbmcgR1VJRFxuICAgICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfdW5saW5rU2Vzc2lvbjogZnVuY3Rpb24gX3VubGlua1Nlc3Npb24oY29ubmVjdGlvbiwgZ3VpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBSLnNjb3BlKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9zZXNzaW9uc1tndWlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nlc3Npb25zW2d1aWRdLnRlcm1pbmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKFIuRGVidWcuZXh0ZW5kRXJyb3IoXCJSLlNpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlLl91bmxpbmtTZXNzaW9uKC4uLilcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihudWxsKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiogXG4gICAgICAgICAgICAqIEBtZXRob2QgX2hhbmRsZVNlc3Npb25FeHBpcmVcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGd1aWQgVW5pcXVlIHN0cmluZyBHVUlEXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2hhbmRsZVNlc3Npb25FeHBpcmU6IGZ1bmN0aW9uIF9oYW5kbGVTZXNzaW9uRXhwaXJlKGd1aWQpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc2Vzc2lvbnMsIGd1aWQpLCBcIlIuU2ltcGxlVXBsaW5rU2VydmVyLl9oYW5kbGVTZXNzaW9uRXhwaXJlKC4uLik6IG5vIHN1Y2ggc2Vzc2lvbi5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zZXNzaW9uc1tndWlkXTtcbiAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuc2Vzc2lvbkRlc3Ryb3llZChndWlkKTtcbiAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdyhcIlIuU2ltcGxlVXBsaW5rU2VydmVyLl9oYW5kbGVTZXNzaW9uRXhwaXJlKC4uLilcIikpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLyoqIFxuICAgICAgICAqIDxwPlNldHRpbmcgdXAgYSBjb25uZWN0aW9uIGluIG9yZGVyIHRvIGluaXRpYWxpZXMgbWV0aG9kcyBhbmQgdG8gcHJvdmlkZXMgc3BlY2lmaWNzIGxpc3RlbmVycyBvbiB0aGUgc29ja2V0PC9wPlxuICAgICAgICAqIEBtZXRob2QgQ29ubmVjdGlvblxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwaWQgXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNvY2tldFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBoYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IGxpbmtTZXNzaW9uIFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB1bmxpbmtTZXNzaW9uXG4gICAgICAgICovXG4gICAgICAgIENvbm5lY3Rpb246IGZ1bmN0aW9uIENvbm5lY3Rpb24ocGlkLCBzb2NrZXQsIGhhbmRsZVNvY2tldERpc2Nvbm5lY3Rpb24sIGxpbmtTZXNzaW9uLCB1bmxpbmtTZXNzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9waWQgPSBwaWQ7XG4gICAgICAgICAgICB0aGlzLnVuaXF1ZUlkID0gXy51bmlxdWVJZChcIlIuU2ltcGxlVXBsaW5rU2VydmVyLkNvbm5lY3Rpb25cIik7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uID0gaGFuZGxlU29ja2V0RGlzY29ubmVjdGlvbjtcbiAgICAgICAgICAgIHRoaXMuX2xpbmtTZXNzaW9uID0gbGlua1Nlc3Npb247XG4gICAgICAgICAgICB0aGlzLl91bmxpbmtTZXNzaW9uID0gdW5saW5rU2Vzc2lvbjtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRIYW5kbGVycygpO1xuICAgICAgICB9LFxuICAgICAgICBfQ29ubmVjdGlvblByb3RvUHJvcHM6IC8qKiBAbGVuZHMgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuQ29ubmVjdGlvbi5wcm90b3R5cGUgKi97XG4gICAgICAgICAgICBfc29ja2V0OiBudWxsLFxuICAgICAgICAgICAgX3BpZDogbnVsbCxcbiAgICAgICAgICAgIHVuaXF1ZUlkOiBudWxsLFxuICAgICAgICAgICAgZ3VpZDogbnVsbCxcbiAgICAgICAgICAgIF9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgX2xpbmtTZXNzaW9uOiBudWxsLFxuICAgICAgICAgICAgX3VubGlua1Nlc3Npb246IG51bGwsXG4gICAgICAgICAgICBfc3Vic2NyaWJlVG86IG51bGwsXG4gICAgICAgICAgICBfdW5zdWJzY3JpYmVGcm9tOiBudWxsLFxuICAgICAgICAgICAgX2xpc3RlblRvOiBudWxsLFxuICAgICAgICAgICAgX3VubGlzdGVuRnJvbTogbnVsbCxcbiAgICAgICAgICAgIF9kaXNjb25uZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAvKiogXG4gICAgICAgICAgICAqIDxwPlNldHRpbmcgdXAgdGhlIHNwZWNpZmljcyBsaXN0ZW5lcnMgZm9yIHRoZSBzb2NrZXQ8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgX2JpbmRIYW5kbGVyc1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9iaW5kSGFuZGxlcnM6IGZ1bmN0aW9uIF9iaW5kSGFuZGxlcnMoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiaGFuZHNoYWtlXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlSGFuZHNoYWtlLCB0aGlzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwic3Vic2NyaWJlVG9cIiwgUi5zY29wZSh0aGlzLl9oYW5kbGVTdWJzY3JpYmVUbywgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldC5vbihcInVuc3Vic2NyaWJlRnJvbVwiLCBSLnNjb3BlKHRoaXMuX2hhbmRsZVVuc3Vic2NyaWJlRnJvbSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldC5vbihcImxpc3RlblRvXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlTGlzdGVuVG8sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJ1bmxpc3RlbkZyb21cIiwgUi5zY29wZSh0aGlzLl9oYW5kbGVVbmxpc3RlbkZyb20sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQub24oXCJkaXNjb25uZWN0XCIsIFIuc2NvcGUodGhpcy5faGFuZGxlRGlzY29ubmVjdCwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldC5vbihcInVuaGFuZHNoYWtlXCIsIFIuc2NvcGUodGhpcy5faGFuZGxlVW5IYW5kc2hha2UsIHRoaXMpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogPHA+IFNpbXBseSBlbWl0IGEgc3BlY2lmaWMgYWN0aW9uIG9uIHRoZSBzb2NrZXQgPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGVtaXRcbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGFjdGlvbiB0byBzZW5kXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgVGhlIHBhcmFtcyBcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbWl0OiBmdW5jdGlvbiBlbWl0KG5hbWUsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJbQ10gPj4+IFwiICsgbmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdChuYW1lLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD4gVHJpZ2dlcmVkIGJ5IHRoZSByZWNlbnRseSBjb25uZWN0ZWQgY2xpZW50LiA8YnIgLz5cbiAgICAgICAgICAgICogQ29tYmluZXMgbWV0aG9kcyBvZiBzdWJzY3JpcHRpb25zIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgYnkgdGhlIGNsaWVudCB2aWEgc29ja2V0IGxpc3RlbmluZzwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfaGFuZGxlSGFuZHNoYWtlXG4gICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMgQ29udGFpbnMgdGhlIHVuaXF1ZSBzdHJpbmcgR1VJRFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9oYW5kbGVIYW5kc2hha2U6IGZ1bmN0aW9uIF9oYW5kbGVIYW5kc2hha2UocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYoIV8uaGFzKHBhcmFtcywgXCJndWlkXCIpIHx8ICFfLmlzU3RyaW5nKHBhcmFtcy5ndWlkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJcIiwgeyBlcnI6IFwiaGFuZHNoYWtlLnBhcmFtcy5ndWlkOiBleHBlY3RlZCBTdHJpbmcuXCJ9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLmd1aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyXCIsIHsgZXJyOiBcImhhbmRzaGFrZTogc2Vzc2lvbiBhbHJlYWR5IGxpbmtlZC5cIn0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY28oZnVuY3Rpb24qKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkID0gcGFyYW1zLmd1aWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IHlpZWxkIHRoaXMuX2xpbmtTZXNzaW9uKHRoaXMsIHRoaXMuZ3VpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJoYW5kc2hha2UtYWNrXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHRoaXMuX3BpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvdmVyZWQ6IHMucmVjb3ZlcmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVUbyA9IHMuc3Vic2NyaWJlVG87XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91bnN1YnNjcmliZUZyb20gPSBzLnVuc3Vic2NyaWJlRnJvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlblRvID0gcy5saXN0ZW5UbztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VubGlzdGVuRnJvbSA9IHMudW5saXN0ZW5Gcm9tO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYWxsKHRoaXMsIFIuRGVidWcucmV0aHJvdyhcIlIuU2ltcGxlVXBsaW5rU2VydmVyLkNvbm5lY3Rpb24uX2hhbmRsZUhhbmRzaGFrZSguLi4pXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPiBUcmlnZ2VyZWQgYnkgdGhlIHJlY2VudGx5IGRpc2Nvbm5lY3RlZCBjbGllbnQuIDxiciAvPlxuICAgICAgICAgICAgKiBSZW1vdmVzIG1ldGhvZHMgb2Ygc3Vic2NyaXB0aW9uczwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfaGFuZGxlSGFuZHNoYWtlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2hhbmRsZVVuSGFuZHNoYWtlOiBmdW5jdGlvbiBfaGFuZGxlVW5IYW5kc2hha2UoKSB7XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuZ3VpZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJcIiwgeyBlcnI6IFwidW5oYW5kc2hha2U6IG5vIGFjdGl2ZSBzZXNzaW9uLlwifSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbyhmdW5jdGlvbiooKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVUbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91bnN1YnNjcmliZUZyb20gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuVG8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW5saXN0ZW5Gcm9tID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0geWllbGQgdGhpcy5fdW5saW5rU2Vzc2lvbih0aGlzLCB0aGlzLmd1aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwidW5oYW5kc2hha2UtYWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ndWlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkuY2FsbCh0aGlzLCBSLkRlYnVnLnJldGhyb3coXCJSLlNpbXBsZVVwbGlua1NlcnZlci5Db25uZWN0aW9uLl9oYW5kbGVVbkhhbmRzaGFrZSguLi4pXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD5NYXBzIHRoZSB0cmlnZ2VyZWQgZXZlbnQgd2l0aCB0aGUgX3N1YnNjcmliZVRvIG1ldGhvZHMgPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVTdWJzY3JpYmVUb1xuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIENvbnRhaW5zIHRoZSBrZXkgcHJvdmlkZWQgYnkgY2xpZW50XG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2hhbmRsZVN1YnNjcmliZVRvOiBmdW5jdGlvbiBfaGFuZGxlU3Vic2NyaWJlVG8ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYoIV8uaGFzKHBhcmFtcywgXCJrZXlcIikgfHwgIV8uaXNTdHJpbmcocGFyYW1zLmtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyXCIsIHsgZXJyOiBcInN1YnNjcmliZVRvLnBhcmFtcy5rZXk6IGV4cGVjdGVkIFN0cmluZy5cIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZighdGhpcy5fc3Vic2NyaWJlVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyXCIsIHsgZXJyOiBcInN1YnNjcmliZVRvOiByZXF1aXJlcyBoYW5kc2hha2UuXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVUbyhwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD5NYXBzIHRoZSB0cmlnZ2VyZWQgZXZlbnQgd2l0aCB0aGUgX3Vuc3Vic2NyaWJlRnJvbSBtZXRob2RzPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVVbnN1YnNjcmliZUZyb21cbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBDb250YWlucyB0aGUga2V5IHByb3ZpZGVkIGJ5IGNsaWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9oYW5kbGVVbnN1YnNjcmliZUZyb206IGZ1bmN0aW9uIF9oYW5kbGVVbnN1YnNjcmliZUZyb20ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYoIV8uaGFzKHBhcmFtcywgXCJrZXlcIikgfHwgIV8uaXNTdHJpbmcocGFyYW1zLmtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyXCIsIHsgZXJyOiBcInVuc3Vic2NyaWJlRnJvbS5wYXJhbXMua2V5OiBleHBlY3RlZCBTdHJpbmcuXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIXRoaXMuX3Vuc3Vic2NyaWJlRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJcIiwgeyBlcnI6IFwidW5zdWJzY3JpYmVGcm9tOiByZXF1aXJlcyBoYW5kc2hha2UuXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91bnN1YnNjcmliZUZyb20ocGFyYW1zLmtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKiBcbiAgICAgICAgICAgICogPHA+TWFwcyB0aGUgdHJpZ2dlcmVkIGV2ZW50IHdpdGggdGhlIGxpc3RlblRvIG1ldGhvZHM8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgX2hhbmRsZUxpc3RlblRvXG4gICAgICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgQ29udGFpbnMgdGhlIGV2ZW50TmFtZSBwcm92aWRlZCBieSBjbGllbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfaGFuZGxlTGlzdGVuVG86IGZ1bmN0aW9uIF9oYW5kbGVMaXN0ZW5UbyhwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZighXy5oYXMocGFyYW1zLCBcImV2ZW50TmFtZVwiKSB8fCAhXy5pc1N0cmluZyhwYXJhbXMuZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJcIiwgeyBlcnI6IFwibGlzdGVuVG8ucGFyYW1zLmV2ZW50TmFtZTogZXhwZWN0ZWQgU3RyaW5nLlwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKCF0aGlzLl9saXN0ZW5Ubykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoXCJlcnJcIiwgeyBlcnI6IFwibGlzdGVuVG86IHJlcXVpcmVzIGhhbmRzaGFrZS5cIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuVG8ocGFyYW1zLmV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKiBcbiAgICAgICAgICAgICogPHA+TWFwcyB0aGUgdHJpZ2dlcmVkIGV2ZW50IHdpdGggdGhlIHVubGlzdGVuRnJvbSBtZXRob2RzPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9oYW5kbGVVbmxpc3RlbkZyb21cbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBDb250YWlucyB0aGUgZXZlbnROYW1lIHByb3ZpZGVkIGJ5IGNsaWVudFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9oYW5kbGVVbmxpc3RlbkZyb206IGZ1bmN0aW9uIF9oYW5kbGVVbmxpc3RlbkZyb20ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYoIV8uaGFzKHBhcmFtcywgXCJldmVudE5hbWVcIikgfHwgIV8uaXNTdHJpbmcocGFyYW1zLmV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZXJyXCIsIHsgZXJyOiBcInVubGlzdGVuRnJvbS5wYXJhbXMuZXZlbnROYW1lOiBleHBlY3RlZCBTdHJpbmcuXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIXRoaXMudW5saXN0ZW5Gcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoXCJlcnJcIiwgeyBlcnI6IFwidW5saXN0ZW5Gcm9tOiByZXF1aXJlcyBoYW5kc2hha2UuXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVubGlzdGVuRnJvbShwYXJhbXMuZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgIC8qKiBcbiAgICAgICAgICAgICogPHA+VHJpZ2dlcmVkIGJ5IHRoZSByZWNlbnRseSBkaXNjb25uZWN0ZWQgY2xpZW50LjwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfaGFuZGxlRGlzY29ubmVjdFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9oYW5kbGVEaXNjb25uZWN0OiBmdW5jdGlvbiBfaGFuZGxlRGlzY29ubmVjdCgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVTb2NrZXREaXNjb25uZWN0aW9uKHRoaXMudW5pcXVlSWQsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIC8qKiBcbiAgICAgICAgKiA8cD5TZXR0aW5nIHVwIGEgc2Vzc2lvbjwvcD5cbiAgICAgICAgKiBAbWV0aG9kIFNlc3Npb25cbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcGlkIFxuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdG9yZUV2ZW50c1xuICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudHNFdmVudHNcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc2Vzc2lvbnNFdmVudHMgXG4gICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRpbWVvdXRcbiAgICAgICAgKi9cbiAgICAgICAgU2Vzc2lvbjogZnVuY3Rpb24gU2Vzc2lvbihndWlkLCBzdG9yZUV2ZW50cywgZXZlbnRzRXZlbnRzLCBzZXNzaW9uc0V2ZW50cywgdGltZW91dCkge1xuICAgICAgICAgICAgdGhpcy5fZ3VpZCA9IGd1aWQ7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZUV2ZW50cyA9IHN0b3JlRXZlbnRzO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRzRXZlbnRzID0gZXZlbnRzRXZlbnRzO1xuICAgICAgICAgICAgdGhpcy5fc2Vzc2lvbnNFdmVudHMgPSBzZXNzaW9uc0V2ZW50cztcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VRdWV1ZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fdGltZW91dER1cmF0aW9uID0gdGltZW91dDtcbiAgICAgICAgICAgIHRoaXMuX2V4cGlyZSA9IFIuc2NvcGUodGhpcy5fZXhwaXJlLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cGlyZVRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX2V4cGlyZSwgdGhpcy5fdGltZW91dER1cmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgICAgICB9LFxuICAgICAgICBfU2Vzc2lvblByb3RvUHJvcHM6IC8qKiBAbGVuZHMgUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuU2Vzc2lvbi5wcm90b3R5cGUgKi97XG4gICAgICAgICAgICBfZ3VpZDogbnVsbCxcbiAgICAgICAgICAgIF9jb25uZWN0aW9uOiBudWxsLFxuICAgICAgICAgICAgX3N1YnNjcmlwdGlvbnM6IG51bGwsXG4gICAgICAgICAgICBfbGlzdGVuZXJzOiBudWxsLFxuICAgICAgICAgICAgX3N0b3JlRXZlbnRzOiBudWxsLFxuICAgICAgICAgICAgX2V2ZW50c0V2ZW50czogbnVsbCxcbiAgICAgICAgICAgIF9zZXNzaW9uc0V2ZW50czogbnVsbCxcbiAgICAgICAgICAgIF9tZXNzYWdlUXVldWU6IG51bGwsXG4gICAgICAgICAgICBfZXhwaXJlVGltZW91dDogbnVsbCxcbiAgICAgICAgICAgIF90aW1lb3V0RHVyYXRpb246IG51bGwsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogPHA+QmluZCB0aGUgc3Vic2NyaWJpbmcgYW5kIHVuc3Vic2NyaWJpbmcgbWV0aG9kcyB3aGVuIGEgY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZCA8YnIgLz5cbiAgICAgICAgICAgICogTWV0aG9kcyB0aGF0IHRyaWdnZXIgb24gY2xpZW50IGlzc3VlcyAobGlrZSBlbWl0KFwic3Vic2NyaWJlVG9cIiksIGVtaXQoXCJ1bnN1YnNjcmliZUZyb21cIikpPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGF0dGFjaENvbm5lY3Rpb25cbiAgICAgICAgICAgICogQHBhcmFtIHtTaW1wbGVVcGxpbmtTZXJ2ZXIuQ29ubmVjdGlvbn0gY29ubmVjdGlvbiB0aGUgY3VycmVudCBjcmVhdGVkIGNvbm5lY3Rpb25cbiAgICAgICAgICAgICogQHJldHVybiB7b2JqZWN0fSB0aGUgYmluZGVkIG9iamVjdCB3aXRoIG1ldGhvZHNcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBhdHRhY2hDb25uZWN0aW9uOiBmdW5jdGlvbiBhdHRhY2hDb25uZWN0aW9uKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjb3ZlcmVkID0gKHRoaXMuX2Nvbm5lY3Rpb24gIT09IG51bGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9tZXNzYWdlUXVldWUsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbi5lbWl0KG0ubmFtZSwgbS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VRdWV1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2V4cGlyZVRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlY292ZXJlZDogcmVjb3ZlcmVkLFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUbzogUi5zY29wZSh0aGlzLnN1YnNjcmliZVRvLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdW5zdWJzY3JpYmVGcm9tOiBSLnNjb3BlKHRoaXMudW5zdWJzY3JpYmVGcm9tLCB0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuVG86IFIuc2NvcGUodGhpcy5saXN0ZW5UbywgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHVubGlzdGVuRnJvbTogUi5zY29wZSh0aGlzLnVubGlzdGVuRnJvbSwgdGhpcyksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICogPHA+UmVtb3ZlIHRoZSBwcmV2aW91c2x5IGFkZGVkIGNvbm5lY3Rpb24sIGFuZCBjbGVhbiB0aGUgbWVzc2FnZSBxdWV1ZSA8L3A+XG4gICAgICAgICAgICAqIEBtZXRob2QgZGV0YWNoQ29ubmVjdGlvblxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRldGFjaENvbm5lY3Rpb246IGZ1bmN0aW9uIGRldGFjaENvbm5lY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY29ubmVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVF1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V4cGlyZVRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuX2V4cGlyZSwgdGhpcy5fdGltZW91dER1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIEBtZXRob2QgdGVybWluYXRlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGVybWluYXRlOiBmdW5jdGlvbiB0ZXJtaW5hdGUoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhwaXJlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD5NZXRob2QgaW52b2tlZCBieSBjbGllbnQgdmlhIHNvY2tldCBlbWl0IDxiciAvPlxuICAgICAgICAgICAgKiBTdG9yZSB0aGUgX3NpZ25hbFVwZGF0ZSBtZXRob2QgaW4gc3Vic2NyaXB0aW9uIDxiciAvPlxuICAgICAgICAgICAgKiBBZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgY2FsbCBfc2lnbmFsVXBkYXRlIHdoZW4gdHJpZ2dlcmVkIDwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBzdWJzY3JpYmVUb1xuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gc3Vic2NyaWJlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgc3Vic2NyaWJlVG86IGZ1bmN0aW9uIHN1YnNjcmliZVRvKGtleSkge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5TZXNzaW9uLnN1YnNjcmliZVRvKC4uLik6IGFscmVhZHkgc3Vic2NyaWJlZC5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNba2V5XSA9IHRoaXMuX3NpZ25hbFVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JlRXZlbnRzLmFkZExpc3RlbmVyKFwic2V0OlwiICsga2V5LCB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqIFxuICAgICAgICAgICAgKiA8cD5NZXRob2QgaW52b2tlZCBieSBjbGllbnQgdmlhIHNvY2tldCBlbWl0IDxiciAvPlxuICAgICAgICAgICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBhY2NvcmRpbmcgdG8gdGhlIGtleTwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBzdWJzY3JpYmVUb1xuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgdG8gdW5zdWJzY3JpYmVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICB1bnN1YnNjcmliZUZyb206IGZ1bmN0aW9uIHVuc3Vic2NyaWJlRnJvbShrZXkpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihSLnNjb3BlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXModGhpcy5fc3Vic2NyaXB0aW9ucywga2V5KSwgXCJSLlNpbXBsZVVwbGlua1NlcnZlci5TZXNzaW9uLnVuc3Vic2NyaWJlRnJvbSguLi4pOiBub3Qgc3Vic2NyaWJlZC5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3JlRXZlbnRzLnJlbW92ZUxpc3RlbmVyKFwic2V0OlwiICsga2V5LCB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW2tleV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIDxwPiBTaW1wbHkgZW1pdCBhIHNwZWNpZmljIGFjdGlvbiBvbiB0aGUgc29ja2V0IDwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfZW1pdFxuICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgYWN0aW9uIHRvIHNlbmRcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBUaGUgcGFyYW1zIFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIF9lbWl0OiBmdW5jdGlvbiBfZW1pdChuYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiW1NdID4+PiBcIiArIG5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY29ubmVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmVtaXQobmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2VRdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKiA8cD5QdXNoIGFuIHVwZGF0ZSBhY3Rpb24gb24gdGhlIHNvY2tldC4gPGJyIC8+XG4gICAgICAgICAgICAqIFRoZSBjbGllbnQgaXMgbGlzdGVuaW5nIG9uIHRoZSBhY3Rpb24gXCJ1cGRhdGVcIiBzb2NrZXQgPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9zaWduYWxVcGRhdGVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfc2lnbmFsVXBkYXRlOiBmdW5jdGlvbiBfc2lnbmFsVXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBSLnNjb3BlKGZ1bmN0aW9uKHBhdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VtaXQoXCJ1cGRhdGVcIiwgcGF0Y2gpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKiA8cD5QdXNoIGFuIGV2ZW50IGFjdGlvbiBvbiB0aGUgc29ja2V0LiA8YnIgLz5cbiAgICAgICAgICAgICogVGhlIGNsaWVudCBpcyBsaXN0ZW5pbmcgb24gdGhlIGFjdGlvbiBcImV2ZW50XCIgc29ja2V0IDwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCBfc2lnbmFsRXZlbnRcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfc2lnbmFsRXZlbnQ6IGZ1bmN0aW9uIF9zaWduYWxFdmVudChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUi5zY29wZShmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdChcImV2ZW50XCIsIHsgZXZlbnROYW1lOiBldmVudE5hbWUsIHBhcmFtczogcGFyYW1zIH0pO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBAbWV0aG9kIF9leHBpcmVcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBfZXhwaXJlOiBmdW5jdGlvbiBfZXhwaXJlKCkge1xuICAgICAgICAgICAgICAgIF8uZWFjaChfLmtleXModGhpcy5fc3Vic2NyaXB0aW9ucyksIFIuc2NvcGUodGhpcy51bnN1YnNjcmliZUZyb20sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICBfLmVhY2goXy5rZXlzKHRoaXMuX2xpc3RlbmVycyksIFIuc2NvcGUodGhpcy51bmxpc3RlbkZyb20sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXNzaW9uc0V2ZW50cy5lbWl0KFwiZXhwaXJlXCIsIHRoaXMuX2d1aWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD4gQ3JlYXRlIGEgbGlzdGVuZXIgZm9yIHRoZSBldmVudHMgPC9wPlxuICAgICAgICAgICAgKiBAbWV0aG9kIGxpc3RlblRvXG4gICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGlzdGVuVG86IGZ1bmN0aW9uIGxpc3RlblRvKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCghXy5oYXModGhpcy5fbGlzdGVuZXJzLCBrZXkpLCBcIlIuU2ltcGxlVXBsaW5rU2VydmVyLlNlc3Npb24ubGlzdGVuVG8oLi4uKTogYWxyZWFkeSBsaXN0ZW5pbmcuXCIpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSA9IHRoaXMuX3NpZ25hbEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzRXZlbnRzLmFkZExpc3RlbmVyKFwiZW1pdDpcIiArIGV2ZW50TmFtZSwgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiA8cD4gUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSB0aGUgZXZlbnRzIDwvcD5cbiAgICAgICAgICAgICogQG1ldGhvZCB1bmxpc3RlbkZyb21cbiAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCB3aWxsIGJlIHVucmVnaXN0ZXJlZFxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVubGlzdGVuRnJvbTogZnVuY3Rpb24gdW5saXN0ZW5Gcm9tKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KFIuc2NvcGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChfLmhhcyh0aGlzLl9saXN0ZW5lcnMsIGV2ZW50TmFtZSksIFwiUi5TaW1wbGVVcGxpbmtTZXJ2ZXIuU2Vzc2lvbi51bmxpc3RlbkZyb20oLi4uKTogbm90IGxpc3RlbmluZy5cIik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c0V2ZW50cy5yZW1vdmVMaXN0ZW5lcihcImVtaXQ6XCIgKyBldmVudE5hbWUsIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH07XG5cbiAgICBfLmV4dGVuZChTaW1wbGVVcGxpbmtTZXJ2ZXIuU2ltcGxlVXBsaW5rU2VydmVySW5zdGFuY2UucHJvdG90eXBlLCBTaW1wbGVVcGxpbmtTZXJ2ZXIuX1NpbXBsZVVwbGlua1NlcnZlckluc3RhbmNlUHJvdG9Qcm9wcyk7XG4gICAgXy5leHRlbmQoU2ltcGxlVXBsaW5rU2VydmVyLkNvbm5lY3Rpb24ucHJvdG90eXBlLCBTaW1wbGVVcGxpbmtTZXJ2ZXIuX0Nvbm5lY3Rpb25Qcm90b1Byb3BzKTtcbiAgICBfLmV4dGVuZChTaW1wbGVVcGxpbmtTZXJ2ZXIuU2Vzc2lvbi5wcm90b3R5cGUsIFNpbXBsZVVwbGlua1NlcnZlci5fU2Vzc2lvblByb3RvUHJvcHMpO1xuXG4gICAgcmV0dXJuIFNpbXBsZVVwbGlua1NlcnZlcjtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=