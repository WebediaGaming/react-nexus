"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

require("6to5/polyfill");
var _ = require("lodash");
var should = require("should");
var Promise = (global || window).Promise = require("bluebird");
var __DEV__ = process.env.NODE_ENV !== "production";
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === "object";
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}
var Nexus = _interopRequire(require("../"));

var React = _interopRequire(require("react"));

var LocalFlux = _interopRequire(require("nexus-flux/adapters/Local"));

var div = React.createFactory("div");
var p = React.createFactory("p");

var NestedClass = React.createClass({
  displayName: "NestedClass",
  mixins: [Nexus.Mixin],

  getNexusBindings: function getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo]
    };
  },

  render: function render() {
    return p(null, this.state.bar.get("mood"));
  } });

var Nested = React.createFactory(NestedClass);

var AppRootClass = React.createClass({
  displayName: "AppRootClass",
  mixins: [Nexus.Mixin],

  getNexusBindings: function getNexusBindings(props) {
    return {
      route: [this.getNexus().local, "/route"] };
  },

  getInitialState: function getInitialState() {
    return {
      foo: "/bar" };
  },

  render: function render() {
    return div(null, "My route is ", this.state.route ? this.state.route.get("path") : null, " and foo is ", Nested({ foo: this.state.foo }));
  } });

var AppRoot = React.createFactory(AppRootClass);

var localFluxServer = new LocalFlux.Server();
var localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store("/route", localFluxServer.lifespan).set("path", "/home").commit();
localFluxServer.Store("/bar", localFluxServer.lifespan).set("mood", "happy").commit();
localFluxServer.Store("/dev/null", localFluxServer.lifespan).set("void", null).commit();

var nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(AppRoot(), nexus).then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var html = _ref2[0];
  var data = _ref2[1];
  html.should.be.exactly("<div>My route is /home and foo is <p>happy</p></div>");
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      "/route": { path: "/home" },
      "/bar": { mood: "happy" } } }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
});