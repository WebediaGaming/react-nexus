"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = require("lodash-next").Promise;var __DEV__ = (process.env.NODE_ENV !== "production");var __PROD__ = !__DEV__;var __BROWSER__ = (typeof window === "object");var __NODE__ = !__BROWSER__;module.exports = function (R) {
  var React = R.React;
  var _ = R._;
  var Plugin = require("./R.App.Plugin")(R);

  var _App = (function () {
    var _App = function _App() {
      var _this = this;
      this.Flux = this.getFluxClass();
      this.Root = this.getRootClass();
      this.template = this.getTemplate();
      this.Plugins = this.getPluginsClasses();

      _.dev(function () {
        return _this.Flux.should.be.a.Function && _this.Root.should.be.a.Function && _this.template.should.be.a.Function && _this.Plugins.should.be.an.Array;
      });
      this.RootFactory = React.createFactory(this.Root);

      this.prerender = _.scope(this.prerender, this);
    };

    _classProps(_App, null, {
      getFluxClass: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getRootClass: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getTemplate: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getPluginsClasses: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getTemplateVars: {
        writable: true,


        // Future-proof: might do something with { req, window } at some point
        // of the future.
        value: regeneratorRuntime.mark(function _callee(_ref) {
          var req;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (true) switch (_context.prev = _context.next) {
              case 0: req = _ref.req;
                _.abstract();
              case 2:
              case "end": return _context.stop();
            }
          }, _callee, this);
        })
      },
      prerender: {
        writable: true,
        // jshint ignore:line

        value: function (req, res) {
          return _.co.wrap(this._prerender).call(this, req, res);
        }
      },
      _prerender: {
        writable: true,
        value: regeneratorRuntime.mark(function _callee2(req, res) {
          var _this2 = this;
          var html, _ret;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (true) switch (_context2.prev = _context2.next) {
              case 0: _context2.prev = 0;
                _context2.next = 3;
                return _this2.render({ req: req });
              case 3: html = _context2.sent;
                _context2.next = 11;
                break;
              case 6: _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);
                _ret = (function () {
                  var err = _context2.t0.toString();
                  var stack;
                  _.dev(function () {
                    return stack = _context2.t0.stack;
                  });
                  _.prod(function () {
                    return stack = null;
                  });
                  return {
                    v: res.status(500).json({ err: err, stack: stack })
                  };
                })();
                if (!(typeof _ret === "object")) {
                  _context2.next = 11;
                  break;
                }
                return _context2.abrupt("return", _ret.v);
              case 11: return _context2.abrupt("return", res.status(200).send(html));
              case 12:
              case "end": return _context2.stop();
            }
          }, _callee2, this, [[0, 6]]);
        })
      },
      render: {
        writable: true,
        value: regeneratorRuntime.mark(function _callee3(_ref2) {
          var _this3 = this;
          var req, window;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (true) switch (_context3.prev = _context3.next) {
              case 0: req = _ref2.req;
                window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
                });
                if (!_.isServer()) {
                  _context3.next = 9;
                  break;
                }
                _context3.next = 6;
                return _this3._renderInServer(req);
              case 6: _context3.t1 = _context3.sent;
                _context3.next = 12;
                break;
              case 9: _context3.next = 11;
                return _this3._renderInClient(window);
              case 11: _context3.t1 = _context3.sent;
              case 12: return _context3.abrupt("return", _context3.t1);
              case 13:
              case "end": return _context3.stop();
            }
          }, _callee3, this);
        })
      },
      _renderInServer: {
        writable: true,
        /**
        * <p>Compute all React Components with data server-side and render the corresponding HTML for the requesting client</p>
        * @method renderToStringInServer
        * @param {object} req The classical request object
        * @return {object} template : the computed HTML template with data for the requesting client
        */
        value: regeneratorRuntime.mark(function _callee4(req) {
          var _this4 = this;
          var guid, headers, flux, plugins, rootProps, surrogateRootComponent, rootComponent, rootHtml, serializedFlux, serializedHeaders;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (true) switch (_context4.prev = _context4.next) {
              case 0: // jshint ignore:line
                _.dev(function () {
                  return _.isServer().should.be.ok && req.headers.should.be.ok;
                });

                guid = _.guid();
                headers = req.headers;
                flux = new _this4.Flux({ guid: guid, headers: headers, req: req });
                _context4.next = 6;
                return flux.bootstrap();
              case 6: plugins = _this4.Plugins.map(function (Plugin) {
                  return new Plugin({ flux: flux, req: req, headers: headers });
                });
                rootProps = { flux: flux, plugins: plugins };
                surrogateRootComponent = new _this4.Root.__ReactNexusSurrogate({ context: {}, props: rootProps, state: {} });
                if (!surrogateRootComponent.componentWillMount) {
                  _.dev(function () {
                    return console.error("Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?");
                  });
                }
                // Emulate React lifecycle
                surrogateRootComponent.componentWillMount();
                _context4.next = 13;
                return surrogateRootComponent.prefetchFluxStores();
              case 13:
                surrogateRootComponent.componentWillUnmount();

                rootComponent = _this4.RootFactory(rootProps);
                flux.injectingFromStores(function () {
                  return rootHtml = React.renderToString(rootComponent);
                });
                serializedFlux = flux.serialize();
                flux.destroy();
                plugins.forEach(function (plugin) {
                  return plugin.destroy();
                });

                serializedHeaders = _.base64Encode(JSON.stringify(headers));
                _context4.next = 22;
                return _this4.getTemplateVars({ req: req });
              case 22: _context4.t2 = _context4.sent;
                _context4.t3 = _.extend({}, _context4.t2, { rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid });
                return _context4.abrupt("return", _this4.template(_context4.t3));
              case 25:
              case "end": return _context4.stop();
            }
          }, _callee4, this);
        })
      },
      _renderInClient: {
        writable: true,


        /**
        * <p>Setting all the data for each React Component and Render it into the client. <br />
        * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
        * @method renderIntoDocumentInClient
        * @param {object} window The classical window object
        */
        value: regeneratorRuntime.mark(function _callee5(window) {
          var _this5 = this;
          var headers, guid, flux, plugins, rootProps, rootComponent;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (true) switch (_context5.prev = _context5.next) {
              case 0: // jshint ignore:line
                _.dev(function () {
                  return _.isClient().should.be.ok && window.__ReactNexus.should.be.an.Object && window.__ReactNexus.guid.should.be.a.String && window.__ReactNexus.serializedFlux.should.be.a.String && window.__ReactNexus.serializedHeaders.should.be.a.String && window.__ReactNexus.rootElement.should.be.ok;
                });
                _.dev(function () {
                  return window.__ReactNexus.app = _this5;
                });
                headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
                guid = window.__ReactNexus.guid;
                flux = new _this5.Flux({ headers: headers, guid: guid, window: window });
                _.dev(function () {
                  return window.__ReactNexus.flux = flux;
                });

                _context5.next = 8;
                return flux.bootstrap({ window: window, headers: headers, guid: guid });
              case 8: // jshint ignore:line
                flux.unserialize(window.__ReactNexus.serializedFlux);
                plugins = _this5.Plugins.forEach(function (Plugin) {
                  return new Plugin({ flux: flux, window: window, headers: headers });
                });
                _.dev(function () {
                  return window.__ReactNexus.plugins = plugins;
                });

                rootProps = { flux: flux, plugins: plugins };
                rootComponent = _this5.RootFactory(rootProps);
                _.dev(function () {
                  return window.__ReactNexus.rootComponent = rootComponent;
                });
                /*
                * Render root component client-side, for each components:
                * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
                * 2. componentWillMount : initialization
                * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
                * Root Component already has this server-rendered markup,
                * React will preserve it and only attach event handlers.
                * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
                */
                flux.injectingFromStores(function () {
                  return React.render(rootComponent, window.__ReactNexus.rootElement);
                });
              case 15:
              case "end": return _context5.stop();
            }
          }, _callee5, this);
        })
      }
    });

    return _App;
  })();

  _.extend(_App.prototype, /** @lends App.prototype */{
    Flux: null,
    Root: null,
    RootFactory: null,
    template: null,
    Plugins: null });

  _.extend(_App, { Plugin: Plugin });
  return _App;
};