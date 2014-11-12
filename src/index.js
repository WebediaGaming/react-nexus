const $ = require('./R.$');
const _ = require('lodash-next');
const Animate = require('./R.Animate');
const App = require('./R.App');
const Async = require('./R.Async');
const Client = require('./R.Client');
const Component = require('./R.Component');
const Cordova = require('./R.Cordova');
const Dispatcher = require('./R.Dispatcher');
const EventEmitter = require('./R.EventEmitter');
const Flux = require('./R.Flux');
const Fullscreen = require('./R.Fullscreen');
const History = require('./R.History');
const instantiateReactComponent = require('react/lib/instantiateReactComponent');
const Localize = require('./R.Localize');
const Lock = require('./R.Lock');
const Pure = require('./R.Pure');
const React = require('react');
const ReactChildren = require('./R.ReactChildren');
const ReactCreateClass = require('./R.ReactCreateClass');
const Root = require('./R.Root');
const Router = require('./R.Router');
const should = _.should;
const Store = require('./R.Store');
const Style = require('./R.Style');
const Stylesheet = require('./R.Stylesheet');
const Uplink = require('./R.Uplink');
const Window = require('./R.Window');
const XWindow = require('./R.XWindow');

const R = {};

// Top level dependencies
_.extend(R, { _, should, React, instantiateReactComponent, Lock });

// React monkey patches
_.extend(R, {
  ReactChildren: ReactChildren(R),
  ReactCreateClass: ReactCreateClass(R),
});

// React Nexus core
_.extend(R, {
  $: $(R),
  Animate: Animate(R),
  App: App(R),
  Aysnc: Async(R),
  Client: Client(R),
  Component: Component(R),
  Dispatcher: Dispatcher(R),
  EventEmitter: EventEmitter(R),
  Flux: Flux(R),
  Pure: Pure(R),
  Root: Root(R),
  Router: Router(R),
  Store: Store(R),
});

// React Nexus extensions
_.extend(R, {
  Uplink: Uplink(R),
});

// React Nexus standard app plugins
_.extend(R, {
  Plugins: {
    Cordova: Cordova(R),
    Fullscreen: Fullscreen(R),
    History: History(R),
    Localize: Localize(R),
    Window: Window(R),
    XWindow: XWindow(R),
  },
});

module.exports = R;
