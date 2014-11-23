"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");var $ = require("./R.$");
var _ = require("lodash-next");
var Animate = require("./R.Animate");
var App = require("./R.App");
var Async = require("./R.Async");
var Client = require("./R.Client");
var Component = require("./R.Component");
var Cordova = require("./R.Cordova");
var Dispatcher = require("./R.Dispatcher");
var EventEmitter = require("./R.EventEmitter");
var Flux = require("./R.Flux");
var Fullscreen = require("./R.Fullscreen");
var History = require("./R.History");
var instantiateReactComponent = require("react/lib/instantiateReactComponent");
var Localize = require("./R.Localize");
var Lock = require("./R.Lock");
var Pure = require("./R.Pure");
var React = require("react");
var ReactChildren = require("./R.ReactChildren");
var ReactCreateClass = require("./R.ReactCreateClass");
var Root = require("./R.Root");
var Router = require("nexus-router");
var should = _.should;
var Store = require("./R.Store");
var Window = require("./R.Window");
var XWindow = require("./R.XWindow");


// Top level dependencies
var R = { _: _, should: should, React: React, instantiateReactComponent: instantiateReactComponent, Lock: Lock, Router: Router };

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

if (typeof window === "object" && typeof window.R === "undefined") {
  window.R = R;
}
if (typeof global === "object" && typeof global.R === "undefined") {
  global.R = R;
}

module.exports = R;