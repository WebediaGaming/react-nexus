const _ = require('lodash-next');

const io = require('socket.io-client');
const request = _.isServer() ? require('request') : require('browser-request');
const resolve = require('url').resolve;
const should = _.should;

const Listener = require('./Uplink.Listener');
const Subscription = require('./Uplink.Subscription');

// These socket.io handlers are actually called like Uplink instance method
// (using .call). In their body 'this' is therefore an Uplink instance.
// They are declared here to avoid cluttering the Uplink class definition
// and method naming collisions.
const ioHandlers = {
  connect() {
    this.io.emit('handshake', { guid: this.guid });
  },

  reconnect() {
    // TODO
    // Handle reconnections properly.
  },

  disconnect() {
    // TODO
    // Handle disconnections properly
  },

  handshakeAck({ pid }) {
    if(this.pid !== null && pid !== this.pid && this.shouldReloadOnServerRestart && _.isClient()) {
      window.location.reload();
    }
    this.pid = pid;
    this._handshake({ pid, guid });
  },

  update({ path, diff, hash }) {
    // At the uplink level, updates are transmitted
    // as (diff, hash). If the uplink client has
    // a cached value with the matching hash, then
    // the diff is applied. If not, then the full value
    // is fetched.
    _.dev(() => path.should.be.a.String);
    if(!this.store[path]) {
      return;
    }
    if(this.store[path].hash === hash) {
      this.store[path].value = _.patch(this.store[path], diff);
      this.store[path].hash = _.hash(this.store[path].value);
      this.update(path, this.store[path]);
    }
    else {
      this.pull(path, { bypassCache: true })
      .then((value) => this.store[path] = { value, hash: _.hash(value) });
    }
  },

  emit({ room, params }) {
    _.dev(() => room.should.be.a.String && params.should.be.an.Object);
    this.emit(room, params);

  },

  debug(params) {
    _.dev(() => params.should.be.an.Object);
    console.table(params);
  },

  log({ message }) {
    _.dev(() => message.should.be.a.String);
    console.log(message);
  },

  warn({ message }) {
    _.dev(() => message.should.be.a.String);
    console.warn(message);
  },

  err({ message }) {
    _.dev(() => message.should.be.a.String);
    console.error(message);
  },
};

class Uplink {
  constructor({ url, guid, shouldReloadOnServerRestart }) {
    _.dev(() => url.should.be.a.String &&
      guid.should.be.a.String
    );
    this.http = resolve(url, 'http');
    this.io = io(resolve(url, 'io'));
    this.pid = null;
    this.guid = guid;
    this.shouldReloadOnServerRestart = shouldReloadOnServerRestart;
    this.handshake = new Promise((resolve, reject) => this._handshake = { resolve, reject }).cancellable();
    this.listeners = {};
    this.subscriptions = {};
    this.store = {};
    this.pending = {};
    this.bindIOHandlers();
  }

  destroy() {
    // Cancel all pending requests/active subscriptions/listeners
    if(!this.handshake.isResolved()) {
      this.handshake.cancel();
    }
    Object.keys(this.subscriptions)
    .forEach((path) => Object.keys(this.subscriptions[path])
      .forEach((id) => this.unsubscribeFrom(this.subscriptions[path][id]))
    );
    Object.keys(this.listeners)
    .forEach((room) => Object.keys(this.listeners[room])
      .forEach((id) => this.unlistenFrom(this.listeners[room][id]))
    );
    Object.keys(this.pending)
    .forEach((path) => {
      this.pending[path].cancel();
      delete this.pending[path];
    });
    this.io.close();
  }

  bindIOHandlers() {
    Object.keys(ioHandlers)
    .forEach((event) => this.io.on(event, (params) => ioHandlers[event].call(this, params)));
  }

  push(event, params) {
    this.io.emit(event, params);
    return this;
  }

  pull(path, opts = {}) {
    let { bypassCache } = opts;
    _.dev(() => path.should.be.a.String);
    if(!this.pending[path] || bypassCache) {
      this.pending[path] = this.fetch(path).cancellable().then((value) => {
        // As soon as the result is received, removed from the pending list.
        delete this.pending[path];
        return value;
      });
    }
    _.dev(() => this.pending[path].then.should.be.a.Function);
    return this.pending[path];
  }

  fetch(path) {
    return new Promise((resolve, reject) =>
      request({ method: 'GET', url: resolve(this.http, path), json: true }, (err, res, body) => err ? reject(err) : resolve(body))
    );
  }

  dispatch(action, params) {
    _.dev(() => action.should.be.a.String &&
      params.should.be.an.Object
    );
    return new Promise((resolve, reject) =>
      request({ method: 'POST', url: resolve(this.http, path), json: true, body: _.extend({}, params, { guid: this.guid }) }, (err, res, body) => err ? reject(err) : resolve(body))
    );
  }

  _remoteSubscribeTo(path) {
    _.dev(() => path.should.be.a.String);
    this.store[path] = { value: null, hash: null };
    this.io.emit('subscribeTo', { path });
  }

  _remoteUnsubscribeFrom(path) {
    _.dev(() => path.should.be.a.String);
    this.io.emit('unsubscribeFrom', { path });
    delete this.store[path];
  }

  subscribeTo(path, handler) {
    _.dev(() => path.should.be.a.String &&
      handler.should.be.a.Function
    );
    let subscription = new Subscription({ path, handler });
    let createdPath = subscription.addTo(this.subscriptions);
    if(createdPath) {
      this._remoteSubscribeTo(path);
    }
    return { subscription, createdPath };
  }

  unsubscribeFrom(subscription) {
    _.dev(() => subscription.should.be.an.instanceOf(Subscription));
    let deletedPath = subscription.removeFrom(this.subscriptions);
    if(deletedPath) {
      this._remoteUnsubscribeFrom(subscription.path);
      delete this.store[path];
    }
    return { subscription, deletedPath };
  }

  update(path, value) {
    _.dev(() => path.should.be.a.String &&
      (value === null || _.isObject(value)).should.be.ok
    );
    if(this.subscriptions[path]) {
      Object.keys(this.subscriptions[path])
      .forEach((key) => this.subscriptions[path][key].update(value));
    }
  }

  _remoteListenTo(room) {
    _.dev(() => room.should.be.a.String);
    this.io.emit('listenTo', { room });
  }

  _remoteUnlistenFrom(room) {
    _.dev(() => room.should.be.a.String);
    this.io.emit('unlistenFrom', { room });
  }

  listenTo(room, handler) {
    _.dev(() => room.should.be.a.String &&
      handler.should.be.a.Function
    );
    let listener = new Listener({ room, handler });
    let createdRoom = listener.addTo(this.listeners);
    if(createdRoom) {
      this._remoteListenTo(room);
    }
    return { listener, createdRoom };
  }

  unlistenFrom(listener) {
    _.dev(() => listener.should.be.an.instanceOf(Listener));
    let deletedRoom = subscription.removeFrom(this.listeners);
    if(deletedRoom) {
      this._remoteUnlistenFrom(listener.room);
    }
    return { listener, deletedRoom };
  }

  emit(room, params) {
    _.dev(() => room.should.be.a.String &&
      params.should.be.an.Object
    );
    if(this.listeners[room]) {
      Object.keys(this.listeners[room])
      .forEach((key) => this.listeners[room][key].emit(params));
    }
  }
}

_.extend(Uplink.prototype, {
  guid: null,
  handshake: null,
  _handshake: null,
  io: null,
  pid: null,
  listeners: null,
  shouldReloadOnServerRestart: null,
  subscriptions: null,
  store: null,
});

module.exports = Uplink;
