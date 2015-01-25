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
    var route = this.state.route;
    var notFound = this.state.notFound;
    var foo = this.state.foo;
    var clicks = this.state.clicks;
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

var localFluxServer = new LocalFlux.Server();
var localFluxClient = new LocalFlux.Client(localFluxServer);

localFluxServer.Store("/route", localFluxServer.lifespan).set("path", "/home").commit();
localFluxServer.Store("/bar", localFluxServer.lifespan).set("mood", "happy").commit();
localFluxServer.Store("/dev/null", localFluxServer.lifespan).set("void", null).commit();

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