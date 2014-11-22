"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
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
                surrogateRootComponent = new _this4.Root.__ReactNexusSurrogate({}, rootProps);
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
//# sourceMappingURL=data:application/json;base64,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UyxDQUFDO0FBQy9DLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLGFBQWE7aUJBQUEsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBVS9ELG9CQUFJLENBQUMsbUJBQW1CLENBQUM7eUJBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7aUJBQUEsQ0FBQyxDQUFDOzs7OztTQUM5Rjs7OztXQTdJRyxJQUFHOzs7QUFnSlQsR0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFHLENBQUMsU0FBUyw2QkFBNkI7QUFDakQsUUFBSSxFQUFFLElBQUk7QUFDVixRQUFJLEVBQUUsSUFBSTtBQUNWLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLFlBQVEsRUFBRSxJQUFJO0FBQ2QsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLElBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG4gICAgY29uc3QgXyA9IFIuXztcbiAgICBjb25zdCBQbHVnaW4gPSByZXF1aXJlKCcuL1IuQXBwLlBsdWdpbicpKFIpO1xuXG4gICAgLyoqXG4gICAgKiA8cD5TaW1wbHkgY3JlYXRlIGFuIEFwcCBjbGFzcyB3aXRoIHNwZWNpZmljczwvcD5cbiAgICAqIDxwPlByb3ZpZGVzIG1ldGhvZHMgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBzcGVjaWZpZWQgQXBwIHNlcnZlci1zaWRlIGFuZCBjbGllbnQtc2lkZTwvcD5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZUFwcCA9PiBpbml0aWFsaXplcyBtZXRob2RzIG9mIGFuIGFwcGxpY2F0aW9uIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWNhdGlvbnMgcHJvdmlkZWQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZVBsdWdpbiA9PiBpbml0aWxpYXppYXRpb24gbWV0aG9kIG9mIGEgcGx1Z2luIGZvciB0aGUgYXBwbGljYXRpb24gPC9saT5cbiAgICAqIDwvdWw+XG4gICAgKiBAY2xhc3MgUi5BcHBcbiAgICAqL1xuICAgIGNsYXNzIEFwcCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GbHV4ID0gdGhpcy5nZXRGbHV4Q2xhc3MoKTtcbiAgICAgICAgdGhpcy5Sb290ID0gdGhpcy5nZXRSb290Q2xhc3MoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy5QbHVnaW5zID0gdGhpcy5nZXRQbHVnaW5zQ2xhc3NlcygpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuRmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMuUm9vdC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudGVtcGxhdGUuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuUm9vdEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG5cbiAgICAgICAgdGhpcy5wcmVyZW5kZXIgPSBfLnNjb3BlKHRoaXMucHJlcmVuZGVyLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIC8vIEZ1dHVyZS1wcm9vZjogbWlnaHQgZG8gc29tZXRoaW5nIHdpdGggeyByZXEsIHdpbmRvdyB9IGF0IHNvbWUgcG9pbnRcbiAgICAgIC8vIG9mIHRoZSBmdXR1cmUuXG4gICAgICAqZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pIHsgXy5hYnN0cmFjdCgpOyB9IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgICBwcmVyZW5kZXIocmVxLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF8uY28ud3JhcCh0aGlzLl9wcmVyZW5kZXIpXG4gICAgICAgIC5jYWxsKHRoaXMsIHJlcSwgcmVzKTtcbiAgICAgIH1cblxuICAgICAgKl9wcmVyZW5kZXIocmVxLCByZXMpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIGxldCBodG1sO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGh0bWwgPSB5aWVsZCB0aGlzLnJlbmRlcih7IHJlcSB9KTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgIGxldCBlcnIgPSBlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgbGV0IHN0YWNrO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHN0YWNrID0gZS5zdGFjayk7XG4gICAgICAgICAgXy5wcm9kKCgpID0+IHN0YWNrID0gbnVsbCk7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyLCBzdGFjayB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoaHRtbCk7XG4gICAgICB9XG5cbiAgICAgICpyZW5kZXIoeyByZXEsIHdpbmRvdyB9KSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIF8uaXNTZXJ2ZXIoKSA/IHlpZWxkIHRoaXMuX3JlbmRlckluU2VydmVyKHJlcSkgOiB5aWVsZCB0aGlzLl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0IG9iamVjdFxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcbiAgICAgICovXG4gICAgICAqX3JlbmRlckluU2VydmVyKHJlcSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgIHJlcS5oZWFkZXJzLnNob3VsZC5iZS5va1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBndWlkID0gXy5ndWlkKCk7XG4gICAgICAgIGxldCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XG4gICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGd1aWQsIGhlYWRlcnMsIHJlcSB9KTtcbiAgICAgICAgLy8gUmVnaXN0ZXIgc3RvcmUgKFIuU3RvcmUpIDogVXBsaW5rU2VydmVyIGFuZCBNZW1vcnlcbiAgICAgICAgLy8gSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcbiAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XG4gICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLm1hcCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgcmVxLCBoZWFkZXJzIH0pKTtcblxuICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2Ygcm9vdCBjb21wb25lbnQgd2l0aCBmbHV4XG4gICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XG4gICAgICAgIGlmKCFzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IGNvbnNvbGUuZXJyb3IoJ1Jvb3QgY29tcG9uZW50IHJlcXVpcmVzIGNvbXBvbmVudFdpbGxNb3VudCBpbXBsZW1lbnRhdGlvbi4gTWF5YmUgeW91IGZvcmdvdCB0byBtaXhpbiBSLlJvb3QuTWl4aW4/JykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVtdWxhdGUgUmVhY3QgbGlmZWN5Y2xlXG4gICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgIHlpZWxkIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XG4gICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAvKlxuICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBzZXJ2ZXItc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50cyA6XG4gICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogc2ltcGxlIGluaXRpYWxpemF0aW9uXG4gICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcbiAgICAgICAgKi9cbiAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSB0aGlzLlJvb3RGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgIGxldCByb290SHRtbDtcbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHJvb3RIdG1sID0gUmVhY3QucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCkpO1xuICAgICAgICAvLyBTZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxuICAgICAgICBsZXQgc2VyaWFsaXplZEZsdXggPSBmbHV4LnNlcmlhbGl6ZSgpO1xuICAgICAgICBmbHV4LmRlc3Ryb3koKTtcbiAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xuXG4gICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoXy5leHRlbmQoe30sIHlpZWxkIHRoaXMuZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pLCB7IHJvb3RIdG1sLCBzZXJpYWxpemVkRmx1eCwgc2VyaWFsaXplZEhlYWRlcnMsIGd1aWQgfSkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICogPHA+U2V0dGluZyBhbGwgdGhlIGRhdGEgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50IGFuZCBSZW5kZXIgaXQgaW50byB0aGUgY2xpZW50LiA8YnIgLz5cbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnRcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHdpbmRvdyBUaGUgY2xhc3NpY2FsIHdpbmRvdyBvYmplY3RcbiAgICAgICovXG4gICAgICAqX3JlbmRlckluQ2xpZW50KHdpbmRvdykgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudC5zaG91bGQuYmUub2tcbiAgICAgICAgKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5hcHAgPSB0aGlzKTtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMpKTtcbiAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XG4gICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdyB9KTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5mbHV4ID0gZmx1eCk7XG5cbiAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoeyB3aW5kb3csIGhlYWRlcnMsIGd1aWQgfSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICBmbHV4LnVuc2VyaWFsaXplKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXgpO1xuICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5mb3JFYWNoKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCB3aW5kb3csIGhlYWRlcnMgfSkpO1xuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnBsdWdpbnMgPSBwbHVnaW5zKTtcblxuICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgIGxldCByb290Q29tcG9uZW50ID0gdGhpcy5Sb290RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50KTtcbiAgICAgICAgLypcbiAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XG4gICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogaW5pdGlhbGl6YXRpb25cbiAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICogUm9vdCBDb21wb25lbnQgYWxyZWFkeSBoYXMgdGhpcyBzZXJ2ZXItcmVuZGVyZWQgbWFya3VwLFxuICAgICAgICAqIFJlYWN0IHdpbGwgcHJlc2VydmUgaXQgYW5kIG9ubHkgYXR0YWNoIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxuICAgICAgICAqL1xuICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XG4gICAgICBGbHV4OiBudWxsLFxuICAgICAgUm9vdDogbnVsbCxcbiAgICAgIFJvb3RGYWN0b3J5OiBudWxsLFxuICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICBQbHVnaW5zOiBudWxsLFxuICAgIH0pO1xuXG4gICAgXy5leHRlbmQoQXBwLCB7IFBsdWdpbiB9KTtcbiAgICByZXR1cm4gQXBwO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==