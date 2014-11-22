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
          return _.copromise(regeneratorRuntime.mark(function _callee2() {
            var _this2 = this;
            var _ret;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (true) switch (_context2.prev = _context2.next) {
                case 0: _context2.prev = 0;
                  _context2.next = 3;
                  return _this2.render({ req: req });
                case 3: _context2.t0 = _context2.sent;
                  return _context2.abrupt("return", res.status(200).send(_context2.t0));
                case 7: _context2.prev = 7;
                  _context2.t1 = _context2["catch"](0);
                  _ret = (function () {
                    var err = _context2.t1.toString();
                    var stack;
                    _.dev(function () {
                      return stack = _context2.t1.stack;
                    });
                    _.prod(function () {
                      return stack = null;
                    });
                    return {
                      v: res.status(500).json({ err: err, stack: stack })
                    };
                  })();
                  if (!(typeof _ret === "object")) {
                    _context2.next = 12;
                    break;
                  }
                  return _context2.abrupt("return", _ret.v);
                case 12:
                case "end": return _context2.stop();
              }
            }, _callee2, this, [[0, 7]]);
          }), this);
        }
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
              case 6: _context3.t2 = _context3.sent;
                _context3.next = 12;
                break;
              case 9: _context3.next = 11;
                return _this3._renderInClient(window);
              case 11: _context3.t2 = _context3.sent;
              case 12: return _context3.abrupt("return", _context3.t2);
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
              case 22: _context4.t3 = _context4.sent;
                _context4.t4 = _.extend({}, _context4.t3, { rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid });
                return _context4.abrupt("return", _this4.template(_context4.t4));
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
//# sourceMappingURL=data:application/json;base64,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QUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztpQkFBQSxDQUFDLENBQUM7Ozs7O1NBQzlGOzs7O1dBeElHLElBQUc7OztBQTJJVCxHQUFDLENBQUMsTUFBTSxDQUFDLElBQUcsQ0FBQyxTQUFTLDZCQUE2QjtBQUNqRCxRQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUksRUFBRSxJQUFJO0FBQ1YsZUFBVyxFQUFFLElBQUk7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLElBQUcsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFNBQU8sSUFBRyxDQUFDO0NBQ2QsQ0FBQyIsImZpbGUiOiJSLkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgICBjb25zdCBfID0gUi5fO1xuICAgIGNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vUi5BcHAuUGx1Z2luJykoUik7XG5cbiAgICAvKipcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxuICAgICogPHA+UHJvdmlkZXMgbWV0aG9kcyBpbiBvcmRlciB0byByZW5kZXIgdGhlIHNwZWNpZmllZCBBcHAgc2VydmVyLXNpZGUgYW5kIGNsaWVudC1zaWRlPC9wPlxuICAgICogPHVsPlxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnM8L2xpPlxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBjbGFzcyBSLkFwcFxuICAgICovXG4gICAgY2xhc3MgQXBwIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xuICAgICAgICB0aGlzLlJvb3QgPSB0aGlzLmdldFJvb3RDbGFzcygpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5Sb290LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMuUGx1Z2lucy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5Sb290RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcblxuICAgICAgICB0aGlzLnByZXJlbmRlciA9IF8uc2NvcGUodGhpcy5wcmVyZW5kZXIsIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBnZXRGbHV4Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRSb290Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFBsdWdpbnNDbGFzc2VzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgLy8gRnV0dXJlLXByb29mOiBtaWdodCBkbyBzb21ldGhpbmcgd2l0aCB7IHJlcSwgd2luZG93IH0gYXQgc29tZSBwb2ludFxuICAgICAgLy8gb2YgdGhlIGZ1dHVyZS5cbiAgICAgICpnZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSkgeyBfLmFic3RyYWN0KCk7IH0gLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAgIHByZXJlbmRlcihyZXEsIHJlcykge1xuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoeWllbGQgdGhpcy5yZW5kZXIoeyByZXEgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBsZXQgZXJyID0gZS50b1N0cmluZygpO1xuICAgICAgICAgICAgbGV0IHN0YWNrO1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gc3RhY2sgPSBlLnN0YWNrKTtcbiAgICAgICAgICAgIF8ucHJvZCgoKSA9PiBzdGFjayA9IG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyLCBzdGFjayB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAqcmVuZGVyKHsgcmVxLCB3aW5kb3cgfSkgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICAgIHJldHVybiBfLmlzU2VydmVyKCkgPyB5aWVsZCB0aGlzLl9yZW5kZXJJblNlcnZlcihyZXEpIDogeWllbGQgdGhpcy5fcmVuZGVySW5DbGllbnQod2luZG93KTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVyVG9TdHJpbmdJblNlcnZlclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XG4gICAgICAqL1xuICAgICAgKl9yZW5kZXJJblNlcnZlcihyZXEpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICByZXEuaGVhZGVycy5zaG91bGQuYmUub2tcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgZ3VpZCA9IF8uZ3VpZCgpO1xuICAgICAgICBsZXQgaGVhZGVycyA9IHJlcS5oZWFkZXJzO1xuICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XG4gICAgICAgIC8vIFJlZ2lzdGVyIHN0b3JlIChSLlN0b3JlKSA6IFVwbGlua1NlcnZlciBhbmQgTWVtb3J5XG4gICAgICAgIC8vIEluaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXG4gICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKCk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgICAgIC8vIEluaXRpYWxpemVzIHBsdWdpbiBhbmQgZmlsbCBhbGwgY29ycmVzcG9uZGluZyBkYXRhIGZvciBzdG9yZSA6IE1lbW9yeVxuICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSwgaGVhZGVycyB9KSk7XG5cbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICAvLyBDcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICBsZXQgc3Vycm9nYXRlUm9vdENvbXBvbmVudCA9IG5ldyB0aGlzLlJvb3QuX19SZWFjdE5leHVzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xuICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxuICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IHNpbXBsZSBpbml0aWFsaXphdGlvblxuICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICovXG4gICAgICAgIGxldCByb290Q29tcG9uZW50ID0gdGhpcy5Sb290RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICBsZXQgcm9vdEh0bWw7XG4gICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiByb290SHRtbCA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKHJvb3RDb21wb25lbnQpKTtcbiAgICAgICAgLy8gU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcbiAgICAgICAgZmx1eC5kZXN0cm95KCk7XG4gICAgICAgIHBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiBwbHVnaW4uZGVzdHJveSgpKTtcblxuICAgICAgICBsZXQgc2VyaWFsaXplZEhlYWRlcnMgPSBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKF8uZXh0ZW5kKHt9LCB5aWVsZCB0aGlzLmdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSwgeyByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0pKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XG4gICAgICAqIENvbm5lY3RpbmcgdG8gdGhlIHVwbGluay1zZXJ2ZXIgdmlhIGluIG9yZGVyIHRvIGVuYWJsZSB0aGUgZXN0YWJsaXNobWVudCBvZiBzdWJzcmlwdGlvbnMgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50XG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XG4gICAgICAqL1xuICAgICAgKl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQuc2hvdWxkLmJlLm9rXG4gICAgICAgICk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XG4gICAgICAgIGxldCBoZWFkZXJzID0gSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzKSk7XG4gICAgICAgIGxldCBndWlkID0gd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkO1xuICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuZmx1eCA9IGZsdXgpO1xuXG4gICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKHsgd2luZG93LCBoZWFkZXJzLCBndWlkIH0pOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgZmx1eC51bnNlcmlhbGl6ZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4KTtcbiAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93LCBoZWFkZXJzIH0pKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XG5cbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHRoaXMuUm9vdEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudCk7XG4gICAgICAgIC8qXG4gICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IGNsaWVudC1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzOlxuICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXG4gICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcbiAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgKiA0LiBGaW5hbGx5IGNvbXBvbmVudERpZE1vdW50IChzdWJzY3JpYmUgYW5kIGZldGNoaW5nIGRhdGEpIHRoZW4gcmVyZW5kZXJpbmcgd2l0aCBuZXcgcG90ZW50aWFsIGNvbXB1dGVkIGRhdGFcbiAgICAgICAgKi9cbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IFJlYWN0LnJlbmRlcihyb290Q29tcG9uZW50LCB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoQXBwLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBBcHAucHJvdG90eXBlICove1xuICAgICAgRmx1eDogbnVsbCxcbiAgICAgIFJvb3Q6IG51bGwsXG4gICAgICBSb290RmFjdG9yeTogbnVsbCxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgUGx1Z2luczogbnVsbCxcbiAgICB9KTtcblxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XG4gICAgcmV0dXJuIEFwcDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=