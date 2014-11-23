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
const Router = require('nexus-router');
const should = _.should;
const Store = require('./R.Store');
const Window = require('./R.Window');
const XWindow = require('./R.XWindow');


// Top level dependencies
const R = { _, should, React, instantiateReactComponent, Lock, Router };

// React monkey patches
R.ReactChildren = ReactChildren(R);
R.ReactCreateClass = ReactCreateClass(R);

// React Nexus Core
R.Pure = Pure(R);
R.Async = Async(R);
R.Animate = Animate(R);
R.Flux = Flux(R);
R.$ = $(R);
R.App = App(R);
R.Client = Client(R);
R.Dispatcher = Dispatcher(R);
R.EventEmitter = EventEmitter(R);
R.Store = Store(R);

// React Nexus components
R.Component = Component(R);
R.Root = Root(R);

// React Nexus App plugins
R.Plugins = {};
R.Plugins.Cordova = Cordova(R);
R.Plugins.Fullscreen = Fullscreen(R);
R.Plugins.History = History(R);
R.Plugins.Localize = Localize(R);
R.Plugins.Window = Window(R);
R.Plugins.XWindow = XWindow(R);

if(typeof window === 'object') { window.R = window.R || R; }
if(typeof global === 'object') { global.R = global.R || R; }

module.exports = R;
