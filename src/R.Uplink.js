module.exports = function(R) {
    const url = require('url');
    const _ = require('lodash');
    const should = R.should;

    let request;
    if(R.isClient()) {
        request = require('browser-request');
    }
    else {
        request = require('request');
    }
    const co = require('co');

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

    class Uplink {

        /**
        * <p> Initializes the uplink according to the specifications provided </p>
        * @method constructor
        * @param {object} httpEndpoint
        * @param {object} socketEndpoint
        * @param {object} guid
        * @param {object} shouldReloadOnServerRestart
        */
        constructor(httpEndpoint, socketEndpoint, guid, shouldReloadOnServerRestart){
            this._httpEndpoint = httpEndpoint;
            this._socketEndPoint = socketEndpoint;
            this._guid = guid;
            if(R.isClient()) {
                this._initInClient();
            }
            if(R.isServer()) {
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
        }

        _debugLog() {
            let args = arguments;
            _.dev(() => {
                console.log.apply(console, args);
            });
        }

        /**
        * <p>Emits a socket signal to the uplink-server</p>
        * @param {string} name The name of the signal
        * @param {object} params The specifics params to send
        * @private
        */
        _emit(name, params) {
            _.dev(() => this._socket.should.be.ok && (null !== this._socket).should.be.ok);
            this._debugLog('>>> ' + name, params);
            this._socket.emit(name, params);
        }

        /**
        * <p> Creating io connection client-side in order to use sockets </p>
        * @method _initInClient
        * @private
        */
        _initInClient() {
            _.dev(() => R.isClient().should.be.ok);
            if(this._socketEndPoint) {
                let io;
                if(window.io && _.isFunction(window.io)) {
                    io = window.io;
                }
                else {
                    io = require('socket.io-client');
                }
                this._subscriptions = {};
                this._listeners = {};
                //Connect to uplink server-side. Trigger the uplink-server on io.on("connection")
                let socket = this._socket = io(this._socketEndPoint);
                //Prepare all event client-side, listening:
                socket.on('update', R.scope(this._handleUpdate, this));
                socket.on('event', R.scope(this._handleEvent, this));
                socket.on('disconnect', R.scope(this._handleDisconnect, this));
                socket.on('connect', R.scope(this._handleConnect, this));
                socket.on('handshake-ack', R.scope(this._handleHandshakeAck, this));
                socket.on('debug', R.scope(this._handleDebug, this));
                socket.on('log', R.scope(this._handleLog, this));
                socket.on('warn', R.scope(this._handleWarn, this));
                socket.on('err', R.scope(this._handleError, this));
                this.ready = new Promise((resolve, reject) => {
                    this._acknowledgeHandshake = resolve;
                });
                if(window.onbeforeunload) {
                    let prevHandler = window.onbeforeunload;
                    window.onbeforeunload = R.scope(this._handleUnload(prevHandler), this);
                }
                else {
                    window.onbeforeunload = R.scope(this._handleUnload(null), this);
                }
            }
            else {
                this.ready = Promise.cast(true);
            }
        }
        /**
        * <p>Server-side</p>
        * @method _initInServer
        * @private
        */
        _initInServer() {
            _.dev(() => R.isServer().should.be.ok);
            this.ready = Promise.cast(true);
        }
        /**
        * <p>Triggered when a data is updated according to the specific key <br />
        * Call corresponding function key </p>
        * @method _handleUpdate
        * @param {object} params The specific key
        * @private
        */
        _handleUpdate(params) {
            this._debugLog('<<< update', params);
            _.dev(() => 
                params.should.be.an.object &&
                params.k.should.be.a.String &&
                params.v.should.be.ok &&
                params.d.should.be.an.Array &&
                params.h.should.be.a.String
            );
            let key = params.k;
            this._performUpdateIfNecessary(key, params)((err, val) => {
                 _.dev(() => {
                    if(err) {
                        throw R.Debug.extendError(err, 'R.Uplink._handleUpdate(...): couldn\'t _performUpdateIfNecessary.');
                    }
                 });
                if(err) {
                    return;
                }
                this._data[key] = val;
                this._hashes[key] = R.hash(JSON.stringify(val));
                if(_.has(this._subscriptions, key)) {
                    Object.keys(this._subscriptions[key]).forEach((fn) => {
                        fn(key, val);
                    });
                }
            });
        }
        /**
        * @method _shouldFetchKey
        * @param {string} key
        * @param {object} entry
        * @return {Boolean} bool The boolean
        * @private
        */
        _shouldFetchKey(key, entry) {
            if(!_.has(this._data, key) || !_.has(this._hashes, key)) {
                return true;
            }
            if(this._hashes[key] !== entry.from) {
                return true;
            }
            return false;
        }

        /**
        * <p>Determines if the the data must be fetched</p>
        * @method _performUpdateIfNecessary
        * @param {string} key
        * @param {object} entry
        * @return {Function} fn The Function to call
        * @private
        */
        _performUpdateIfNecessary(key, entry) {
            return (fn) => {
                co(function*() {
                    if(this._shouldFetchKey(key, entry)) {
                        return yield this.fetch(key);
                    }
                    else {
                        return R.patch(this._data[key], entry.diff);
                    }
                }).call(this, fn);
            };
        }

        /**
        * @method _handleEvent
        * @param {string} params
        * @private
        */
        _handleEvent(params) {
            this._debugLog('<<< event', params.eventName);
            let eventName = params.eventName;
            let eventParams = params.params;
            if(_.has(this._listeners, eventName)) {
                Object.keys(this._listeners[eventName]).forEach((fn) => {
                    fn(eventParams);
                });
            }
        }

        /**
        * @method _handleDisconnect
        * @param {string} params
        * @private
        */
        _handleDisconnect(params) {
            this._debugLog('<<< disconnect', params);
            this.ready = new Promise((resolve, reject) => {
                this._acknowledgeHandshake = resolve;
            });
        }

        /**
        * <p>Occurs after a connection. When a connection is established, the client sends a signal "handshake".</p>
        * @method _handleDisconnect
        * @private
        */
        _handleConnect() {
            this._debugLog('<<< connect');
            //notify uplink-server
            this._emit('handshake', { guid: this._guid });
        }

        /**
        * <p> Identifies if the pid of the server has changed (due to a potential reboot server-side) since the last client connection. <br />
        * If this is the case, a page reload is performed<p>
        * @method _handleHandshakeAck
        * @params {object} params
        * @private
        */
        _handleHandshakeAck(params) {
            this._debugLog('<<< handshake-ack', params);
            if(this._pid && params.pid !== this._pid && this.shouldReloadOnServerRestart) {
                _.dev(() => {
                    console.warn('Server pid has changed, reloading page.');
                });
                setTimeout(() => {
                    window.location.reload(true);
                }, _.random(2000, 10000));
            }
            this._pid = params.pid;
            this._acknowledgeHandshake(params);
        }

        /**
        * @method _handleDebug
        * @params {object} params
        * @private
        */
        _handleDebug(params) {
            this._debugLog('<<< debug', params);
            _.dev(() => {
                console.warn('R.Uplink.debug(...):', params.debug);
            });
        }

        /**
        * @method _handleLog
        * @params {object} params
        * @private
        */
        _handleLog(params) {
            this._debugLog('<<< log', params);
            console.log('R.Uplink.log(...):', params.log);
        }

        /**
        * @method _handleWarn
        * @params {object} params
        * @private
        */
        _handleWarn(params) {
            this._debugLog('<<< warn', params);
            console.warn('R.Uplink.warn(...):', params.warn);
        }

        /**
        * @method _handleError
        * @params {object} params
        * @private
        */
        _handleError(params) {
            this._debugLog('<<< error', params);
            console.error('R.Uplink.err(...):', params.err);
        }

        /**
        * <p>Occurs when a client unloads the document</p>
        * @method _handleUnload
        * @params {Function} prevHandler The function to execute when the page will be unloaded
        * @return {Function} function
        * @private
        */
        _handleUnload(prevHandler) {
            return () => {
                if(prevHandler) {
                    prevHandler();
                }
                this._emit('unhandshake');
            };
        }

        /**
        * <p>Simply closes the socket</p>
        * @method _destroyInClient
        * @private
        */
        _destroyInClient() {
            if(this._socket) {
                this._socket.close();
            }
        }
        /**
        * <p>Does nothing</p>
        * @method _destroyInClient
        * @return {*} void0
        * @private
        */
        _destroyInServer() {
            return void 0;
        }

        /**
        * <p>Notifies the uplink-server that a subscription is required by client</p>
        * @method _subscribeTo
        * @return {string} key The key to subscribe
        * @private
        */
        _subscribeTo(key) {
            co(function*() {
                yield this.ready;
                this._emit('subscribeTo', { key: key });
            }).call(this, R.Debug.rethrow('R.Uplink._subscribeTo(...): couldn\'t subscribe (' + key + ')'));
        }

        /**
        * <p>Notifies the uplink-server that a subscription is over</p>
        * @method _subscribeTo
        * @return {string} key The key to unsubscribe
        * @private
        */
        _unsubscribeFrom(key) {
            co(function*() {
                yield this.ready;
                this._emit('unsubscribeFrom', { key: key });
            }).call(this, R.Debug.rethrow('R.Uplink._subscribeTo(...): couldn\'t unsubscribe (' + key + ')'));
        }

        /**
        * <p>Etablishes a subscription to a key, and call the specified function when _handleUpdate occurs</p>
        * @method subscribeTo
        * @param {string} key The key to subscribe
        * @param {function} fn The function to execute
        * @return {object} subscription The created subscription
        */
        subscribeTo(key, fn) {
            let subscription = new R.Uplink.Subscription(key);
            if(!_.has(this._subscriptions, key)) {
                this._subscribeTo(key);
                this._subscriptions[key] = {};
                this._data[key] = {};
                this._hashes[key] = R.hash(JSON.stringify({}));
            }
            this._subscriptions[key][subscription.uniqueId] = fn;
            return subscription;
        }

        /**
        * <p>Removes a subscription to a key</p>
        * @method subscribeTo
        * @param {string} key The key to subscribe
        * @param {object} subscription
        */
        unsubscribeFrom(key, subscription) {
            _.dev(() => 
                this._subscriptions.should.be.an.Object &&
                this._subscriptions[key].should.be.ok &&
                this._subscriptions[key].should.be.an.Object &&
                this._subscriptions[key][subscription.uniqueId].should.be.ok &&
                this._subscriptions[key][subscription.uniqueId].should.be.a.String
            );
            delete this._subscriptions[key][subscription.uniqueId];
            if(_.size(this._subscriptions[key]) === 0) {
                delete this._subscriptions[key];
                delete this._data[key];
                delete this._hashes[key];
                this._unsubscribeFrom(key);
            }
        }

        /**
        * <p>Sends the listener signal "listenTo"</p>
        * @method _listenTo
        * @param {string} eventName The eventName to listen
        * @private
        */
        _listenTo(eventName) {
            co(function*() {
                yield this.ready;
                this._emit('listenTo', { eventName: eventName });
            }).call(this, R.Debug.rethrow('R.Uplink._listenTo: couldn\'t listen (' + eventName + ')'));
        }

         /**
        * <p>Sends the unlistener signal "unlistenFrom"</p>
        * @method _unlistenFrom
        * @param {string} eventName The eventName to listen
        * @private
        */
        _unlistenFrom(eventName) {
            co(function*() {
                yield this.ready;
                this._emit('unlistenFrom', { eventName: eventName });
            }).call(this, R.Debug.rethrow('R.Uplink._unlistenFrom: couldn\'t unlisten (' + eventName + ')'));
        }

        /**
        * <p>Create a listener according to a specific name</p>
        * @method listenTo
        * @param {string} eventName The eventName to listen
        * @param {function} fn The function to execute when triggered
        * @return {object} listener The created listener
        */
        listenTo(eventName, fn) {
            let listener = R.Uplink.Listener(eventName);
            if(!_.has(this._listeners, eventName)) {
                this._listenTo(eventName);
                this._listeners[eventName] = {};
            }
            this._listeners[eventName][listener.uniqueId] = fn;
            return listener;
        }

        /**
        * <p>Remove a listener </p>
        * @method unlistenFrom
        * @param {string} eventName The eventName to remove
        * @param {object} listener
        */
        unlistenFrom(eventName, listener) {
            _.dev(() => 
                this._listeners.should.be.an.Object &&
                this._listeners[eventName].should.be.ok &&
                this._listeners[eventName].should.be.an.Object && 
                this._listeners[eventName][listener.uniqueId].should.be.ok &&
                this._listeners[eventName][listener.uniqueId].should.be.a.String
            );
            delete this._listeners[eventName];
            if(_.size(this._listeners[eventName]) === 0) {
                delete this._listeners[eventName];
                this._unlistenFrom(eventName);
            }
        }
        /**
        * @method _getFullUrl
        * @param {string} suffix
        * @param {object} listener
        * @private
        */
        _getFullUrl(suffix) {
            if(suffix.slice(0, 1) === '/' && this._httpEndpoint.slice(-1) === '/') {
                return this._httpEndpoint.slice(0, -1) + suffix;
            }
            else {
                return this._httpEndpoint + suffix;
            }
        }

        /**
        * <p>Fetch data by GET request from the uplink-server</p>
        * @method fetch
        * @param {string} key The key to fetch
        * @return {object} object Fetched data according to the key
        */
        fetch(key) {
            return new Promise((resolve, reject) => {
                this._debugLog('>>> fetch', key);
                request({
                    url: this._getFullUrl(key),
                    method: 'GET',
                    json: true,
                    withCredentials: false,
                }, function(err, res, body) {
                    if(err) {
                        _.dev(() => {
                            console.warn('R.Uplink.fetch(...): couldn\'t fetch \'' + key + '\':', err.toString());
                        });
                        return resolve(null);
                    }
                    else {
                        return resolve(body);
                    }
                });
            });
        }

        /**
        * <p>Dispatches an action by POST request from the uplink-server</p>
        * @method dispatch
        * @param {object} action The specific action to dispatch
        * @param {object} params
        * @return {object} object Fetched data according to the specified action
        */
        dispatch(action, params) {
            return new Promise((resolve, reject) => {
                this._debugLog('>>> dispatch', action, params);
                request({
                    url: this._getFullUrl(action),
                    method: 'POST',
                    body: { guid: this._guid, params: params },
                    json: true,
                    withCredentials: false,
                }, function(err, res, body) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(body);
                    }
                });
            });
        }

        /**
        * <p>Destroy socket client-side</p>
        * @method destroy
        */
        destroy() {
            if(R.isClient()) {
                this._destroyInClient();
            }
            if(R.isServer()) {
                this._destroyInServer();
            }
        }
    }

    _.extend(Uplink.prototype, /** @lends R.Uplink.prototype */ {
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
    });

    _.extend(Uplink, {
        Subscription(key) {
            this.key = key;
            this.uniqueId = _.uniqueId('R.Uplink.Subscription');
        },
        Listener(eventName) {
            this.eventName = eventName;
            this.uniqueId = _.uniqueId('R.Uplink.Listener');
        },
    });

    return Uplink;
};
