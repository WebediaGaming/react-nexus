"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

require("babel/polyfill");
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

var _nexusFlux = require("nexus-flux");

var Remutable = _nexusFlux.Remutable;
var Lifespan = _nexusFlux.Lifespan;

var Nested = React.createClass({
  displayName: "Nested",

  mixins: [Nexus.Mixin],

  getNexusBindings: function getNexusBindings(props) {
    return {
      bar: [this.getNexus().local, props.foo]
    };
  },

  render: function render() {
    var bar = this.state.bar;

    return React.createElement(
      "span",
      null,
      bar ? bar.get("mood") : null
    );
  } });

var App = React.createClass({
  displayName: "App",

  mixins: [Nexus.Mixin],

  getNexusBindings: function getNexusBindings(props) {
    return {
      route: [this.getNexus().local, "/route"],
      notFound: [this.getNexus().local, "/notFound"] };
  },

  getInitialState: function getInitialState() {
    return {
      foo: "/bar",
      clicks: 0 };
  },

  click: function click() {
    this.setState({ clicks: this.state.clicks + 1 });
  },

  render: function render() {
    var _state = this.state;
    var route = _state.route;
    var notFound = _state.notFound;
    var foo = _state.foo;
    var clicks = _state.clicks;

    return React.createElement(
      "div",
      { className: "App" },
      React.createElement(
        "p",
        null,
        "My route is ",
        route ? route.get("path") : null,
        " and foo is ",
        React.createElement(Nested, { foo: foo }),
        "."
      ),
      React.createElement(
        "p",
        null,
        "The clicks counter is ",
        clicks,
        ". ",
        React.createElement(
          "button",
          { onClick: this.click },
          "increase counter"
        )
      )
    );
  } });

var stores = {
  "/route": new Remutable({
    path: "/home" }),
  "/bar": new Remutable({
    mood: "happy" }),
  "/dev/null": new Remutable({
    "void": null }) };

var localFluxServer = new LocalFlux.Server(stores);
var localFluxClient = new LocalFlux.Client(localFluxServer);

var nexus = { local: localFluxClient };

Nexus.prerenderAppToStaticMarkup(React.createElement(App, null), nexus).then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var html = _ref2[0];
  var data = _ref2[1];

  console.log(html, data);
  html.should.be.exactly("<div class=\"App\"><p>My route is /home and foo is <span>happy</span>.</p><p>The clicks counter is 0. <button>increase counter</button></p></div>");
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      "/route": { path: "/home" },
      "/bar": { mood: "happy" },
      "/notFound": void 0 } }));
  localFluxServer.lifespan.release();
  localFluxClient.lifespan.release();
})["catch"](function (err) {
  throw err;
});