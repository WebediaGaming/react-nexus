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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFhdkIsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdCLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDbEMsTUFBSyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUNyQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLO09BQUEsQ0FDaEMsQ0FBQztLQUNIOztnQkFoQkcsR0FBRztBQWtCUCxrQkFBWTs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWhDOztlQUFZLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFaEMsb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxpQkFBVzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRS9CLHFCQUFlOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbkMsdUJBQWlCOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFckMscUJBQWU7O2VBQUEsZ0JBQVU7Y0FBUCxHQUFHLFFBQUgsR0FBRztBQUFNLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUUxQyxZQUFNOztlQUFBLGlCQUFrQjtjQUFmLEdBQUcsU0FBSCxHQUFHO2NBQUUsTUFBTSxTQUFOLE1BQU07O0FBQ2xCLFdBQUMsQ0FBQyxHQUFHLENBQUM7bUJBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07V0FBQSxDQUFDLENBQUM7QUFDakYsaUJBQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRjs7QUFPRCxxQkFBZTs7ZUFBQSxVQUFDLEdBQUcsRUFBRTtBQUNuQixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFLYixJQUFJLEVBQ0osT0FBTyxFQUNQLElBQUksRUFNSixPQUFPLEVBRVAsU0FBUyxFQUVULHNCQUFzQixFQVN0QixvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLFFBQVEsRUFVUixjQUFjLEVBSWQsSUFBSSxFQUNKLGlCQUFpQjs7OztBQTFDckIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUN6QixDQUFDOztBQUVFLHNCQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUNmLHlCQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU87QUFDckIsc0JBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxDQUFDOzt5QkFHMUMsSUFBSSxDQUFDLFNBQVMsRUFBRTs7O0FBR2xCLHlCQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNOzJCQUFLLElBQUksTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQzttQkFBQSxDQUFDO0FBRTFFLDJCQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUU7QUFFN0Isd0NBQXNCLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUM7O0FBQy9FLHNCQUFHLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLEVBQUU7QUFDN0MscUJBQUMsQ0FBQyxHQUFHLENBQUM7NkJBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxvR0FBb0csQ0FBQztxQkFBQSxDQUFDLENBQUM7bUJBQ2xJOztBQUVELHdDQUFzQixDQUFDLGtCQUFrQixFQUFFLENBQUM7O3lCQUN0QyxzQkFBc0IsQ0FBQyxrQkFBa0IsRUFBRTs7OztBQUNqRCx3Q0FBc0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOztBQUUxQyxzQ0FBb0IsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckQsK0JBQWEsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUM7Ozs7Ozs7OztBQVNuRCxzQkFBSSxDQUFDLG1CQUFtQixDQUFDOzJCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQzttQkFBQSxDQUFDLENBQUM7QUFFM0UsZ0NBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFOztBQUNyQyxzQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YseUJBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNOzJCQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUU7bUJBQUEsQ0FBQyxDQUFDOzs7eUJBRWhCLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUM7Ozs7QUFBdkQsc0JBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsa0JBQXVDLElBQUksQ0FBQyxJQUFJO0FBQ2xFLG1DQUFpQixHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztzREFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxjQUFjLEVBQWQsY0FBYyxFQUFFLGlCQUFpQixFQUFqQixpQkFBaUIsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQzs7Ozs7O1dBRXJHLEdBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjs7QUFRRCxxQkFBZTs7ZUFBQSxVQUFDLE1BQU0sRUFBRTtBQUN0QixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFTYixPQUFPLEVBQ1AsSUFBSSxFQUNKLElBQUksRUFLSixPQUFPLEVBR1AsU0FBUyxFQUNULG9CQUFvQixFQUNwQixhQUFhOzs7OztBQXBCakIsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUNuQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDdkMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3JELE1BQU0sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUN4RCxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7bUJBQUEsQ0FDN0MsQ0FBQztBQUNGLG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFPO21CQUFBLENBQUMsQ0FBQztBQUN4Qyx5QkFBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDM0Usc0JBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUk7QUFDL0Isc0JBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDOztBQUNuRCxtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJO21CQUFBLENBQUMsQ0FBQzs7O3lCQUV2QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQzs7OztBQUMvQyxzQkFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pELHlCQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNOzJCQUFLLElBQUksTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsQ0FBQzttQkFBQSxDQUFDOztBQUNyRixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxPQUFPO21CQUFBLENBQUMsQ0FBQzs7QUFFL0MsMkJBQVMsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRTtBQUM3QixzQ0FBb0IsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckQsK0JBQWEsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUM7O0FBQ25ELG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLGFBQWE7bUJBQUEsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBVS9ELHNCQUFJLENBQUMsbUJBQW1CLENBQUM7MkJBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7bUJBQUEsQ0FBQyxDQUFDOzs7Ozs7V0FDOUYsR0FBRSxJQUFJLENBQUMsQ0FBQztTQUNWOzs7O1dBcklHLEdBQUc7Ozs7O0FBeUlULEdBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsNkJBQTZCO0FBQ2pELFFBQUksRUFBRSxJQUFJO0FBQ1YsUUFBSSxFQUFFLElBQUk7QUFDVixZQUFRLEVBQUUsSUFBSTtBQUNkLFFBQUksRUFBRSxJQUFJO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixpQ0FBNkIsRUFBRSxJQUFJLEVBQ3BDLENBQUMsQ0FBQzs7TUFFRyxNQUFNO1FBQU4sTUFBTSxHQUNDLFNBRFAsTUFBTSxRQUNrQztVQUE5QixJQUFJLFNBQUosSUFBSTtVQUFFLEdBQUcsU0FBSCxHQUFHO1VBQUUsTUFBTSxTQUFOLE1BQU07VUFBRSxPQUFPLFNBQVAsT0FBTzs7QUFDdEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUM5QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQzVCLENBQUM7QUFDRixPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU07T0FBQSxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDekMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN4Qjs7Z0JBWEcsTUFBTTtBQWFWLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FmdkIsTUFBTTs7Ozs7QUFrQlosR0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxnQ0FBaUM7QUFDeEQsUUFBSSxFQUFFLElBQUk7QUFDVixVQUFNLEVBQUUsSUFBSTtBQUNaLE9BQUcsRUFBRSxJQUFJO0FBQ1QsV0FBTyxFQUFFLElBQUk7QUFDYixlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgICBjb25zdCBfID0gUi5fO1xuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbiAgICAvKipcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxuICAgICogPHA+UHJvdmlkZXMgbWV0aG9kcyBpbiBvcmRlciB0byByZW5kZXIgdGhlIHNwZWNpZmllZCBBcHAgc2VydmVyLXNpZGUgYW5kIGNsaWVudC1zaWRlPC9wPlxuICAgICogPHVsPlxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnM8L2xpPlxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBjbGFzcyBSLkFwcFxuICAgICovXG4gICAgY2xhc3MgQXBwIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xuICAgICAgICB0aGlzLlJvb3QgPSB0aGlzLmdldFJvb3RDbGFzcygpO1xuICAgICAgICB0aGlzLnZhcnMgPSB0aGlzLmdldERlZmF1bHRWYXJzKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldFRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVMaWJzID0gdGhpcy5nZXRUZW1wbGF0ZUxpYnMoKTtcbiAgICAgICAgdGhpcy5QbHVnaW5zID0gdGhpcy5nZXRQbHVnaW5zQ2xhc3NlcygpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuRmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMuUm9vdC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudmFycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudGVtcGxhdGVMaWJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGdldEZsdXhDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldERlZmF1bHRWYXJzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZUxpYnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICByZW5kZXIoeyByZXEsIHdpbmRvdyB9KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8gdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVyVG9TdHJpbmdJblNlcnZlclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XG4gICAgICAqL1xuICAgICAgX3JlbmRlckluU2VydmVyKHJlcSkge1xuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICAgIHJlcS5oZWFkZXJzLnNob3VsZC5iZS5va1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBsZXQgZ3VpZCA9IF8uZ3VpZCgpO1xuICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgZ3VpZCwgaGVhZGVycywgcmVxIH0pO1xuICAgICAgICAgIC8vIFJlZ2lzdGVyIHN0b3JlIChSLlN0b3JlKSA6IFVwbGlua1NlcnZlciBhbmQgTWVtb3J5XG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCgpO1xuXG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMubWFwKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCByZXEsIGhlYWRlcnMgfSkpO1xuXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2Ygcm9vdCBjb21wb25lbnQgd2l0aCBmbHV4XG4gICAgICAgICAgbGV0IHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQgPSBuZXcgdGhpcy5Sb290Ll9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7fSwgcm9vdFByb3BzKTtcbiAgICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGNvbnNvbGUuZXJyb3IoJ1Jvb3QgY29tcG9uZW50IHJlcXVpcmVzIGNvbXBvbmVudFdpbGxNb3VudCBpbXBsZW1lbnRhdGlvbi4gTWF5YmUgeW91IGZvcmdvdCB0byBtaXhpbiBSLlJvb3QuTWl4aW4/JykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgeWllbGQgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICAgIGxldCByb290SHRtbDtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKi9cbiAgICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KSk7XG4gICAgICAgICAgLy8gU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcbiAgICAgICAgICBsZXQgc2VyaWFsaXplZEZsdXggPSBmbHV4LnNlcmlhbGl6ZSgpO1xuICAgICAgICAgIGZsdXguZGVzdHJveSgpO1xuICAgICAgICAgIHBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiBwbHVnaW4uZGVzdHJveSgpKTtcblxuICAgICAgICAgIGxldCB2YXJzID0gXy5leHRlbmQoe30sIHlpZWxkIHRoaXMuZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pLCB0aGlzLnZhcnMpO1xuICAgICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSh7IHZhcnMsIHJvb3RIdG1sLCBzZXJpYWxpemVkRmx1eCwgc2VyaWFsaXplZEhlYWRlcnMsIGd1aWQgfSwgdGhpcy50ZW1wbGF0ZUxpYnMpO1xuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICogPHA+U2V0dGluZyBhbGwgdGhlIGRhdGEgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50IGFuZCBSZW5kZXIgaXQgaW50byB0aGUgY2xpZW50LiA8YnIgLz5cbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnRcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHdpbmRvdyBUaGUgY2xhc3NpY2FsIHdpbmRvdyBvYmplY3RcbiAgICAgICovXG4gICAgICBfcmVuZGVySW5DbGllbnQod2luZG93KSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycy5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmFwcCA9IHRoaXMpO1xuICAgICAgICAgIGxldCBoZWFkZXJzID0gSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzKSk7XG4gICAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgaGVhZGVycywgZ3VpZCwgd2luZG93IH0pO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuZmx1eCA9IGZsdXgpO1xuXG4gICAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoeyB3aW5kb3csIGhlYWRlcnMsIGd1aWQgfSk7XG4gICAgICAgICAgZmx1eC51bnNlcmlhbGl6ZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4KTtcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5mb3JFYWNoKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCB3aW5kb3csIGhlYWRlcnMgfSkpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucGx1Z2lucyA9IHBsdWdpbnMpO1xuXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgLypcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBjbGllbnQtc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50czpcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcbiAgICAgICAgICAqIFJlYWN0IHdpbGwgcHJlc2VydmUgaXQgYW5kIG9ubHkgYXR0YWNoIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICogNC4gRmluYWxseSBjb21wb25lbnREaWRNb3VudCAoc3Vic2NyaWJlIGFuZCBmZXRjaGluZyBkYXRhKSB0aGVuIHJlcmVuZGVyaW5nIHdpdGggbmV3IHBvdGVudGlhbCBjb21wdXRlZCBkYXRhXG4gICAgICAgICAgKi9cbiAgICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQpKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XG4gICAgICBGbHV4OiBudWxsLFxuICAgICAgUm9vdDogbnVsbCxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgdmFyczogbnVsbCxcbiAgICAgIFBsdWdpbnM6IG51bGwsXG4gICAgICBib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogbnVsbCxcbiAgICB9KTtcblxuICAgIGNsYXNzIFBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHJlcSwgd2luZG93LCBoZWFkZXJzIH0pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gZmx1eC5zaG91bGQuYmUuYW4uaW5zdGFuY2VPZihSLkZsdXgpICYmXG4gICAgICAgICAgaGVhZGVycy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgICAgICk7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xuICAgICAgICB0aGlzLmZsdXggPSBmbHV4O1xuICAgICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdztcbiAgICAgICAgdGhpcy5yZXEgPSByZXE7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICB9XG5cbiAgICAgIGdldERpc3BsYXlOYW1lKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZGVzdHJveSgpIHsgXy5hYnN0cmFjdCgpOyB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoUGx1Z2luLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBQbHVnaW4uUHJvdG90eXBlICovIHtcbiAgICAgIGZsdXg6IG51bGwsXG4gICAgICB3aW5kb3c6IG51bGwsXG4gICAgICByZXE6IG51bGwsXG4gICAgICBoZWFkZXJzOiBudWxsLFxuICAgICAgZGlzcGxheU5hbWU6IG51bGwsXG4gICAgfSk7XG5cbiAgICBfLmV4dGVuZChBcHAsIHsgUGx1Z2luIH0pO1xuICAgIHJldHVybiBBcHA7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9