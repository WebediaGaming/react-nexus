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

  var Plugin = (function () {
    var Plugin = function Plugin(_ref3) {
      var flux = _ref3.flux;
      var req = _ref3.req;
      var window = _ref3.window;
      var headers = _ref3.headers;

      _.dev(function () {
        return flux.should.be.an.instanceOf(R.Flux) && headers.should.be.an.Object;
      });
      _.dev(function () {
        return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.displayName = this.getDisplayName();
      this.flux = flux;
      this.window = window;
      this.req = req;
      this.headers = headers;
    };

    _classProps(Plugin, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      destroy: {
        writable: true,
        value: function () {
          _.abstract();
        }
      }
    });

    return Plugin;
  })();

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */{
    flux: null,
    window: null,
    req: null,
    headers: null,
    displayName: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFhdkIsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FB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akIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7Z0JBWEcsTUFBTTtBQWFWLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FmdkIsTUFBTTs7Ozs7QUFrQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxnQ0FBaUM7QUFDeEQsUUFBSSxFQUFFLElBQUk7QUFDVixVQUFNLEVBQUUsSUFBSTtBQUNaLE9BQUcsRUFBRSxJQUFJO0FBQ1QsV0FBTyxFQUFFLElBQUk7QUFDYixlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG4gICAgY29uc3QgXyA9IFIuXztcclxuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHJcbiAgICAvKipcclxuICAgICogPHA+U2ltcGx5IGNyZWF0ZSBhbiBBcHAgY2xhc3Mgd2l0aCBzcGVjaWZpY3M8L3A+XHJcbiAgICAqIDxwPlByb3ZpZGVzIG1ldGhvZHMgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBzcGVjaWZpZWQgQXBwIHNlcnZlci1zaWRlIGFuZCBjbGllbnQtc2lkZTwvcD5cclxuICAgICogPHVsPlxyXG4gICAgKiA8bGk+IEFwcC5jcmVhdGVBcHAgPT4gaW5pdGlhbGl6ZXMgbWV0aG9kcyBvZiBhbiBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvbGk+XHJcbiAgICAqIDxsaT4gQXBwLnJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQgPC9saT5cclxuICAgICogPGxpPiBBcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnM8L2xpPlxyXG4gICAgKiA8bGk+IEFwcC5jcmVhdGVQbHVnaW4gPT4gaW5pdGlsaWF6aWF0aW9uIG1ldGhvZCBvZiBhIHBsdWdpbiBmb3IgdGhlIGFwcGxpY2F0aW9uIDwvbGk+XHJcbiAgICAqIDwvdWw+XHJcbiAgICAqIEBjbGFzcyBSLkFwcFxyXG4gICAgKi9cclxuICAgIGNsYXNzIEFwcCB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuRmx1eCA9IHRoaXMuZ2V0Rmx1eENsYXNzKCk7XHJcbiAgICAgICAgdGhpcy5Sb290ID0gdGhpcy5nZXRSb290Q2xhc3MoKTtcclxuICAgICAgICB0aGlzLnZhcnMgPSB0aGlzLmdldERlZmF1bHRWYXJzKCk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlTGlicyA9IHRoaXMuZ2V0VGVtcGxhdGVMaWJzKCk7XHJcbiAgICAgICAgdGhpcy5QbHVnaW5zID0gdGhpcy5nZXRQbHVnaW5zQ2xhc3NlcygpO1xyXG5cclxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLkZsdXguc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICAgIHRoaXMuUm9vdC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgICAgdGhpcy52YXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgIHRoaXMudGVtcGxhdGUuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICAgIHRoaXMudGVtcGxhdGVMaWJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgIHRoaXMuUGx1Z2lucy5zaG91bGQuYmUuYW4uQXJyYXlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXRGbHV4Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldERlZmF1bHRWYXJzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFRlbXBsYXRlKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFRlbXBsYXRlTGlicygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIHJlbmRlcih7IHJlcSwgd2luZG93IH0pIHtcclxuICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8gdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7XHJcbiAgICAgIH1cclxuICAgICAgLyoqXHJcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXHJcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcSBUaGUgY2xhc3NpY2FsIHJlcXVlc3Qgb2JqZWN0XHJcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XHJcbiAgICAgICovXHJcbiAgICAgIF9yZW5kZXJJblNlcnZlcihyZXEpIHtcclxuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICByZXEuaGVhZGVycy5zaG91bGQuYmUub2tcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgbGV0IGd1aWQgPSBfLmd1aWQoKTtcclxuICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XHJcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XHJcbiAgICAgICAgICAvLyBSZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxyXG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcclxuICAgICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKCk7XHJcblxyXG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XHJcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSwgaGVhZGVycyB9KSk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiByb290IGNvbXBvbmVudCB3aXRoIGZsdXhcclxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XHJcbiAgICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gY29uc29sZS5lcnJvcignUm9vdCBjb21wb25lbnQgcmVxdWlyZXMgY29tcG9uZW50V2lsbE1vdW50IGltcGxlbWVudGF0aW9uLiBNYXliZSB5b3UgZm9yZ290IHRvIG1peGluIFIuUm9vdC5NaXhpbj8nKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxyXG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcclxuICAgICAgICAgIHlpZWxkIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XHJcbiAgICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xyXG4gICAgICAgICAgbGV0IHJvb3RIdG1sO1xyXG5cclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBzZXJ2ZXItc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50cyA6XHJcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxyXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcclxuICAgICAgICAgICovXHJcbiAgICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KSk7XHJcbiAgICAgICAgICAvLyBTZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxyXG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcclxuICAgICAgICAgIGZsdXguZGVzdHJveSgpO1xyXG4gICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xyXG5cclxuICAgICAgICAgIGxldCB2YXJzID0gXy5leHRlbmQoe30sIHlpZWxkIHRoaXMuZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pLCB0aGlzLnZhcnMpO1xyXG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoeyB2YXJzLCByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0sIHRoaXMudGVtcGxhdGVMaWJzKTtcclxuXHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XHJcbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XHJcbiAgICAgICovXHJcbiAgICAgIF9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50LnNob3VsZC5iZS5va1xyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XHJcbiAgICAgICAgICBsZXQgaGVhZGVycyA9IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycykpO1xyXG4gICAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XHJcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XHJcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmZsdXggPSBmbHV4KTtcclxuXHJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTtcclxuICAgICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XHJcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5mb3JFYWNoKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCB3aW5kb3csIGhlYWRlcnMgfSkpO1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudCk7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XHJcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xyXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBpbml0aWFsaXphdGlvblxyXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXHJcbiAgICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcclxuICAgICAgICAgICogUmVhY3Qgd2lsbCBwcmVzZXJ2ZSBpdCBhbmQgb25seSBhdHRhY2ggZXZlbnQgaGFuZGxlcnMuXHJcbiAgICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxyXG4gICAgICAgICAgKi9cclxuICAgICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCkpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcclxuICAgICAgRmx1eDogbnVsbCxcclxuICAgICAgUm9vdDogbnVsbCxcclxuICAgICAgdGVtcGxhdGU6IG51bGwsXHJcbiAgICAgIHZhcnM6IG51bGwsXHJcbiAgICAgIFBsdWdpbnM6IG51bGwsXHJcbiAgICAgIGJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyOiBudWxsLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY2xhc3MgUGx1Z2luIHtcclxuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCByZXEsIHdpbmRvdywgaGVhZGVycyB9KSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gZmx1eC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXHJcbiAgICAgICAgICBoZWFkZXJzLnNob3VsZC5iZS5hbi5PYmplY3RcclxuICAgICAgICApO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xyXG4gICAgICAgIHRoaXMuZGlzcGxheU5hbWUgPSB0aGlzLmdldERpc3BsYXlOYW1lKCk7XHJcbiAgICAgICAgdGhpcy5mbHV4ID0gZmx1eDtcclxuICAgICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcclxuICAgICAgICB0aGlzLnJlcSA9IHJlcTtcclxuICAgICAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBkZXN0cm95KCkgeyBfLmFic3RyYWN0KCk7IH1cclxuICAgIH1cclxuXHJcbiAgICBfLmV4dGVuZChQbHVnaW4ucHJvdG90eXBlLCAvKiogQGxlbmRzIFBsdWdpbi5Qcm90b3R5cGUgKi8ge1xyXG4gICAgICBmbHV4OiBudWxsLFxyXG4gICAgICB3aW5kb3c6IG51bGwsXHJcbiAgICAgIHJlcTogbnVsbCxcclxuICAgICAgaGVhZGVyczogbnVsbCxcclxuICAgICAgZGlzcGxheU5hbWU6IG51bGwsXHJcbiAgICB9KTtcclxuXHJcbiAgICBfLmV4dGVuZChBcHAsIHsgUGx1Z2luIH0pO1xyXG4gICAgcmV0dXJuIEFwcDtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9