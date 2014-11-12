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
  var should = R.should;
  var path = require("path");
  var Plugin = require("./R.App.Plugin");

  var App = (function () {
    var App = function App() {
      var _this = this;

      this.Flux = this.getFluxClass();
      this.Root = this.getRootClass();
      this.vars = this.getDefaultVars();
      this.template = this.getTemplate();
      this.templateLibs = this.getTemplateLibs();
      this.Plugins = this.getPluginsClasses();

      _.dev(function () {
        return _this.Flux.should.be.a.Function && _this.Root.should.be.a.Function && _this.vars.should.be.an.Object && _this.template.should.be.a.Function && _this.templateLibs.should.be.an.Object && _this.Plugins.should.be.an.Array;
      });
    };

    _classProps(App, null, {
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
      getDefaultVars: {
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
      getTemplateLibs: {
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
        value: function (_ref) {
          var req = _ref.req;
          _.abstract();
        }
      },
      prerender: {
        writable: true,
        value: function (req, res) {
          this.render({ req: req }).then(function (html) {
            return res.status(200).send(html);
          }).catch(function (err) {
            var json = { err: err.toString() };
            _.dev(function () {
              return _.extend(json, { stack: err.stack });
            });
            return res.status(500).json(json);
          });
        }
      },
      render: {
        writable: true,
        value: function (_ref2) {
          var req = _ref2.req;
          var window = _ref2.window;

          _.dev(function () {
            return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
          });
          return _.isServer() ? this._renderInServer(req) : this._renderInClient(window);
        }
      },
      _renderInServer: {
        writable: true,
        value: function (req) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var guid, headers, flux, plugins, rootProps, surrogateRootComponent, rootComponentFactory, rootComponent, rootHtml, serializedFlux, vars, serializedHeaders;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isServer().should.be.ok && req.headers.should.be.ok;
                  });

                  guid = _.guid();
                  headers = req.headers;
                  flux = new this.Flux({ guid: guid, headers: headers, req: req });
                  context$4$0.next = 6;
                  return flux.bootstrap();

                case 6:
                  plugins = this.Plugins.map(function (Plugin) {
                    return new Plugin({ flux: flux, req: req, headers: headers });
                  });
                  rootProps = { flux: flux, plugins: plugins };
                  surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);

                  if (!surrogateRootComponent.componentWillMount) {
                    _.dev(function () {
                      return console.error("Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?");
                    });
                  }
                  // Emulate React lifecycle
                  surrogateRootComponent.componentWillMount();
                  context$4$0.next = 13;
                  return surrogateRootComponent.prefetchFluxStores();

                case 13:

                  surrogateRootComponent.componentWillUnmount();

                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);

                  /*
                  * Render root component server-side, for each components :
                  * 1. getInitialState : return prefetched stored data and fill the component's state
                  * 2. componentWillMount : simple initialization
                  * 3. Render : compute DOM with the component's state
                  */
                  flux.injectingFromStores(function () {
                    return rootHtml = React.renderToString(rootComponent);
                  });
                  serializedFlux = flux.serialize();

                  flux.destroy();
                  plugins.forEach(function (plugin) {
                    return plugin.destroy();
                  });

                  context$4$0.next = 22;
                  return this.getTemplateVars({ req: req });

                case 22:
                  context$4$0.t0 = context$4$0.sent;
                  vars = _.extend({}, context$4$0.t0, this.vars);
                  serializedHeaders = _.base64Encode(JSON.stringify(headers));
                  return context$4$0.abrupt("return", this.template({ vars: vars, rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid }, this.templateLibs));

                case 26:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      },
      _renderInClient: {
        writable: true,
        value: function (window) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var headers, guid, flux, plugins, rootProps, rootComponentFactory, rootComponent;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this2 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isClient().should.be.ok && window.__ReactNexus.should.be.an.Object && window.__ReactNexus.guid.should.be.a.String && window.__ReactNexus.serializedFlux.should.be.a.String && window.__ReactNexus.serializedHeaders.should.be.a.String && window.__ReactNexus.rootElement.should.be.ok;
                  });
                  _.dev(function () {
                    return window.__ReactNexus.app = _this2;
                  });
                  headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
                  guid = window.__ReactNexus.guid;
                  flux = new this.Flux({ headers: headers, guid: guid, window: window });

                  _.dev(function () {
                    return window.__ReactNexus.flux = flux;
                  });

                  context$4$0.next = 8;
                  return flux.bootstrap({ window: window, headers: headers, guid: guid });

                case 8:

                  flux.unserialize(window.__ReactNexus.serializedFlux);
                  plugins = this.Plugins.forEach(function (Plugin) {
                    return new Plugin({ flux: flux, window: window, headers: headers });
                  });

                  _.dev(function () {
                    return window.__ReactNexus.plugins = plugins;
                  });

                  rootProps = { flux: flux, plugins: plugins };
                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);

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

                case 16:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      }
    });

    return App;
  })();

  _.extend(App.prototype, /** @lends App.prototype */{
    Flux: null,
    Root: null,
    template: null,
    vars: null,
    Plugins: null,
    bootstrapTemplateVarsInServer: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7TUFhbkMsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxD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QUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgICBjb25zdCBfID0gUi5fO1xuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi9SLkFwcC5QbHVnaW4nKTtcblxuICAgIC8qKlxuICAgICogPHA+U2ltcGx5IGNyZWF0ZSBhbiBBcHAgY2xhc3Mgd2l0aCBzcGVjaWZpY3M8L3A+XG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XG4gICAgKiA8dWw+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVBcHAgPT4gaW5pdGlhbGl6ZXMgbWV0aG9kcyBvZiBhbiBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9uczwvbGk+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVQbHVnaW4gPT4gaW5pdGlsaWF6aWF0aW9uIG1ldGhvZCBvZiBhIHBsdWdpbiBmb3IgdGhlIGFwcGxpY2F0aW9uIDwvbGk+XG4gICAgKiA8L3VsPlxuICAgICogQGNsYXNzIFIuQXBwXG4gICAgKi9cbiAgICBjbGFzcyBBcHAge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRmx1eCA9IHRoaXMuZ2V0Rmx1eENsYXNzKCk7XG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XG4gICAgICAgIHRoaXMudmFycyA9IHRoaXMuZ2V0RGVmYXVsdFZhcnMoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMgPSB0aGlzLmdldFRlbXBsYXRlTGlicygpO1xuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5Sb290LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy52YXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHRoaXMuUGx1Z2lucy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0RGVmYXVsdFZhcnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlTGlicygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFBsdWdpbnNDbGFzc2VzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIHByZXJlbmRlcihyZXEsIHJlcykge1xuICAgICAgICB0aGlzLnJlbmRlcih7IHJlcSB9KVxuICAgICAgICAudGhlbigoaHRtbCkgPT4gcmVzLnN0YXR1cygyMDApLnNlbmQoaHRtbCkpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgbGV0IGpzb24gPSB7IGVycjogZXJyLnRvU3RyaW5nKCkgfTtcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmV4dGVuZChqc29uLCB7IHN0YWNrOiBlcnIuc3RhY2sgfSkpO1xuICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbihqc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcih7IHJlcSwgd2luZG93IH0pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICAgIHJldHVybiBfLmlzU2VydmVyKCkgPyB0aGlzLl9yZW5kZXJJblNlcnZlcihyZXEpIDogdGhpcy5fcmVuZGVySW5DbGllbnQod2luZG93KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0IG9iamVjdFxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcbiAgICAgICovXG4gICAgICBfcmVuZGVySW5TZXJ2ZXIocmVxKSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBndWlkID0gXy5ndWlkKCk7XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSByZXEuaGVhZGVycztcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XG4gICAgICAgICAgLy8gUmVnaXN0ZXIgc3RvcmUgKFIuU3RvcmUpIDogVXBsaW5rU2VydmVyIGFuZCBNZW1vcnlcbiAgICAgICAgICAvLyBJbml0aWFsaXplcyBmbHV4IGFuZCBVcGxpbmtTZXJ2ZXIgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBmZXRjaCBkYXRhIGZyb20gdXBsaW5rLXNlcnZlclxuICAgICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKCk7XG5cbiAgICAgICAgICAvLyBJbml0aWFsaXplcyBwbHVnaW4gYW5kIGZpbGwgYWxsIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3Igc3RvcmUgOiBNZW1vcnlcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSwgaGVhZGVycyB9KSk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiByb290IGNvbXBvbmVudCB3aXRoIGZsdXhcbiAgICAgICAgICBsZXQgc3Vycm9nYXRlUm9vdENvbXBvbmVudCA9IG5ldyB0aGlzLlJvb3QuX19SZWFjdE5leHVzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xuICAgICAgICAgIGlmKCFzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gY29uc29sZS5lcnJvcignUm9vdCBjb21wb25lbnQgcmVxdWlyZXMgY29tcG9uZW50V2lsbE1vdW50IGltcGxlbWVudGF0aW9uLiBNYXliZSB5b3UgZm9yZ290IHRvIG1peGluIFIuUm9vdC5NaXhpbj8nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEVtdWxhdGUgUmVhY3QgbGlmZWN5Y2xlXG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgICAgbGV0IHJvb3RIdG1sO1xuXG4gICAgICAgICAgLypcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBzZXJ2ZXItc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50cyA6XG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSBhbmQgZmlsbCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcbiAgICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IHNpbXBsZSBpbml0aWFsaXphdGlvblxuICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcbiAgICAgICAgICAqL1xuICAgICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiByb290SHRtbCA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKHJvb3RDb21wb25lbnQpKTtcbiAgICAgICAgICAvLyBTZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxuICAgICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XG4gICAgICAgICAgZmx1eC5kZXN0cm95KCk7XG4gICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xuXG4gICAgICAgICAgbGV0IHZhcnMgPSBfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5nZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSksIHRoaXMudmFycyk7XG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKHsgdmFycywgcm9vdEh0bWwsIHNlcmlhbGl6ZWRGbHV4LCBzZXJpYWxpemVkSGVhZGVycywgZ3VpZCB9LCB0aGlzLnRlbXBsYXRlTGlicyk7XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgKiA8cD5TZXR0aW5nIGFsbCB0aGUgZGF0YSBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQgYW5kIFJlbmRlciBpdCBpbnRvIHRoZSBjbGllbnQuIDxiciAvPlxuICAgICAgKiBDb25uZWN0aW5nIHRvIHRoZSB1cGxpbmstc2VydmVyIHZpYSBpbiBvcmRlciB0byBlbmFibGUgdGhlIGVzdGFibGlzaG1lbnQgb2Ygc3Vic3JpcHRpb25zIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gd2luZG93IFRoZSBjbGFzc2ljYWwgd2luZG93IG9iamVjdFxuICAgICAgKi9cbiAgICAgIF9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudC5zaG91bGQuYmUub2tcbiAgICAgICAgICApO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMpKTtcbiAgICAgICAgICBsZXQgZ3VpZCA9IHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZDtcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5mbHV4ID0gZmx1eCk7XG5cbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTtcbiAgICAgICAgICBmbHV4LnVuc2VyaWFsaXplKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXgpO1xuICAgICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLmZvckVhY2goKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHdpbmRvdywgaGVhZGVycyB9KSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50KTtcbiAgICAgICAgICAvKlxuICAgICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IGNsaWVudC1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzOlxuICAgICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBpbml0aWFsaXphdGlvblxuICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAgICogUm9vdCBDb21wb25lbnQgYWxyZWFkeSBoYXMgdGhpcyBzZXJ2ZXItcmVuZGVyZWQgbWFya3VwLFxuICAgICAgICAgICogUmVhY3Qgd2lsbCBwcmVzZXJ2ZSBpdCBhbmQgb25seSBhdHRhY2ggZXZlbnQgaGFuZGxlcnMuXG4gICAgICAgICAgKiA0LiBGaW5hbGx5IGNvbXBvbmVudERpZE1vdW50IChzdWJzY3JpYmUgYW5kIGZldGNoaW5nIGRhdGEpIHRoZW4gcmVyZW5kZXJpbmcgd2l0aCBuZXcgcG90ZW50aWFsIGNvbXB1dGVkIGRhdGFcbiAgICAgICAgICAqL1xuICAgICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCkpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcbiAgICAgIEZsdXg6IG51bGwsXG4gICAgICBSb290OiBudWxsLFxuICAgICAgdGVtcGxhdGU6IG51bGwsXG4gICAgICB2YXJzOiBudWxsLFxuICAgICAgUGx1Z2luczogbnVsbCxcbiAgICAgIGJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyOiBudWxsLFxuICAgIH0pO1xuXG4gICAgXy5leHRlbmQoQXBwLCB7IFBsdWdpbiB9KTtcbiAgICByZXR1cm4gQXBwO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==