"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var co = require("co");
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
      this.bootstrapTemplateVarsInServer = this.getBootstrapTemplateVarsInServer();

      _.dev(function () {
        return _this.fluxClass.should.be.a.Function && _this.rootClass.should.be.a.Function && _this.vars.should.be.an.Object && _this.template.should.be.a.Function && _this.plugins.should.be.an.Array && _this.bootstrapTemplateVarsInServer.should.be.a.Function;
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
      getBootstrapTemplateVarsInServer: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      renderToStringInServer: {
        writable: true,
        value: function (req) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var guid, flux, plugins, rootProps, surrogateRootComponent, rootComponentFactory, rootComponent, rootHtml, serializedFlux, vars, serializedHeaders;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isServer().should.be.ok && req.headers.should.be.ok;
                  });

                  guid = _.guid();
                  flux = new this.Flux();
                  context$4$0.next = 5;
                  return flux.bootstrapInServer(req, req.headers, guid);

                case 5:
                  plugins = this.Plugins.map(function (Plugin) {
                    return new Plugin({ flux: flux, req: req });
                  });
                  rootProps = { flux: flux, plugins: plugins };
                  surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);

                  if (!surrogateRootComponent.componentWillMount) {
                    _.dev(function () {
                      return console.error("Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?");
                    });
                  }
                  surrogateRootComponent.componentWillMount();
                  context$4$0.next = 12;
                  return surrogateRootComponent.prefetchFluxStores();

                case 12:

                  surrogateRootComponent.componentWillUnmount();

                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);

                  flux.startInjectingFromStores();

                  rootHtml = React.renderToString(rootComponent);

                  flux.stopInjectingFromStores();
                  serializedFlux = flux.serialize();

                  flux.destroy();
                  plugins.forEach(function (plugin) {
                    return plugin.destroy();
                  });

                  context$4$0.next = 23;
                  return this.bootstrapTemplateVarsInServer(req);

                case 23:
                  context$4$0.t0 = context$4$0.sent;
                  vars = _.extend({}, context$4$0.t0, this.vars);
                  serializedHeaders = _.base64Encode(JSON.stringify(req.headers));
                  return context$4$0.abrupt("return", this.template({ vars: vars, rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid }, this.templateLibs));

                case 27:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      },
      renderIntoDocumentInClient: {
        writable: true,
        value: function (window) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var flux, headers, guid, plugins, rootProps, rootComponentFactory, rootComponent;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this2 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isClient().should.be.ok && window.__ReactNexus.should.be.an.Object && window.__ReactNexus.guid.should.be.a.String && window.__ReactNexus.serializedFlux.should.be.a.String && window.__ReactNexus.serializedHeaders.should.be.a.String && window.__ReactNexus.rootElement.should.be.ok;
                  });
                  _.dev(function () {
                    return window.__ReactNexus.app = _this2;
                  });
                  flux = new this.Flux();

                  _.dev(function () {
                    return window.__ReactNexus.flux = flux;
                  });
                  headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
                  guid = window.__ReactNexus.guid;
                  context$4$0.next = 8;
                  return flux.bootstrapInClient({ window: window, headers: headers, guid: guid });

                case 8:

                  flux.unserialize(window.__ReactNexus.serializedFlux);
                  plugins = this.Plugins.forEach(function (Plugin) {
                    return new Plugin({ flux: flux, window: window });
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
                  flux.startInjectingFromStores();
                  /*
                  * Render root component client-side, for each components:
                  * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
                  * 2. componentWillMount : initialization
                  * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
                  * Root Component already has this server-rendered markup,
                  * React will preserve it and only attach event handlers.
                  * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
                  */
                  React.render(rootComponent, window.__ReactNexus.rootElement);
                  flux.stopInjectingFromStores();

                case 18:
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
    fluxClass: null,
    rootClass: null,
    template: null,
    vars: null,
    plugins: null,
    bootstrapTemplateVarsInServer: null });

  var Plugin = (function () {
    var Plugin = function Plugin(_ref) {
      var flux = _ref.flux;
      var req = _ref.req;
      var window = _ref.window;

      _.dev(function () {
        return flux.should.be.instanceOf(R.Flux);
      });
      _.dev(function () {
        return _.isSever() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.displayName = this.getDisplayName();
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
    displayName: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O01BYXZCLEdBQUc7UUFBSCxHQUFHLEdBQ0ksU0FEUCxHQUFHLEdBQ087OztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDeEMsVUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDOztBQUU3RSxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBSyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM3QyxNQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQ25DLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0IsTUFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUNsQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQy9CLE1BQUssNkJBQTZCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUTtPQUFBLENBQ3hELENBQUM7S0FDSDs7Z0JBakJHLEdBQUc7QUFtQlAsa0JBQVk7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVoQzs7ZUFBWSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRWhDLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsaUJBQVc7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUUvQixxQkFBZTs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRW5DLHVCQUFpQjs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBRXJDLHNDQUFnQzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7O0FBT3BELDRCQUFzQjs7ZUFBQSxVQUFDLEdBQUcsRUFBRTtBQUMxQixpQkFBTyxDQUFDLENBQUMsU0FBUyx5QkFBQztnQkFLYixJQUFJLEVBQ0osSUFBSSxFQU1KLE9BQU8sRUFFUCxTQUFTLEVBRVQsc0JBQXNCLEVBUXRCLG9CQUFvQixFQUNwQixhQUFhLEVBU2IsUUFBUSxFQUdSLGNBQWMsRUFJZCxJQUFJLEVBQ0osaUJBQWlCOzs7O0FBekNyQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ25DLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFO21CQUFBLENBQ3pCLENBQUM7O0FBRUUsc0JBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQ2Ysc0JBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O3lCQUdwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDOzs7QUFHaEQseUJBQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU07MkJBQUssSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsQ0FBQzttQkFBQSxDQUFDO0FBRWpFLDJCQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUU7QUFFN0Isd0NBQXNCLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUM7O0FBQy9FLHNCQUFHLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLEVBQUU7QUFDN0MscUJBQUMsQ0FBQyxHQUFHLENBQUM7NkJBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxvR0FBb0csQ0FBQztxQkFBQSxDQUFDLENBQUM7bUJBQ2xJO0FBQ0Qsd0NBQXNCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7eUJBQ3RDLHNCQUFzQixDQUFDLGtCQUFrQixFQUFFOzs7O0FBQ2pELHdDQUFzQixDQUFDLG9CQUFvQixFQUFFLENBQUM7O0FBRTFDLHNDQUFvQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyRCwrQkFBYSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQzs7QUFDbkQsc0JBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDOztBQVE1QiwwQkFBUSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDOztBQUNsRCxzQkFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7QUFFM0IsZ0NBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFOztBQUNyQyxzQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YseUJBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNOzJCQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUU7bUJBQUEsQ0FBQyxDQUFDOzs7eUJBRWhCLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUM7Ozs7QUFBakUsc0JBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsa0JBQWlELElBQUksQ0FBQyxJQUFJO0FBQzVFLG1DQUFpQixHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7c0RBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsY0FBYyxFQUFkLGNBQWMsRUFBRSxpQkFBaUIsRUFBakIsaUJBQWlCLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7Ozs7OztXQUVyRyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7O0FBUUQsZ0NBQTBCOztlQUFBLFVBQUMsTUFBTSxFQUFFO0FBQ2pDLGlCQUFPLENBQUMsQ0FBQyxTQUFTLHlCQUFDO2dCQVNiLElBQUksRUFFSixPQUFPLEVBQ1AsSUFBSSxFQUlKLE9BQU8sRUFHUCxTQUFTLEVBQ1Qsb0JBQW9CLEVBQ3BCLGFBQWE7Ozs7O0FBcEJqQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQ25DLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUN2QyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQzNDLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDckQsTUFBTSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQ3hELE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTttQkFBQSxDQUM3QyxDQUFDO0FBQ0YsbUJBQUMsQ0FBQyxHQUFHLENBQUM7MkJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQU87bUJBQUEsQ0FBQyxDQUFDO0FBQ3hDLHNCQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUMxQixtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJO21CQUFBLENBQUMsQ0FBQztBQUN6Qyx5QkFBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDM0Usc0JBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUk7O3lCQUU3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxDQUFDOzs7O0FBQ3ZELHNCQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDakQseUJBQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07MkJBQUssSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQzttQkFBQSxDQUFDOztBQUM1RSxtQkFBQyxDQUFDLEdBQUcsQ0FBQzsyQkFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxPQUFPO21CQUFBLENBQUMsQ0FBQzs7QUFFL0MsMkJBQVMsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRTtBQUM3QixzQ0FBb0IsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDckQsK0JBQWEsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUM7O0FBQ25ELG1CQUFDLENBQUMsR0FBRyxDQUFDOzJCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLGFBQWE7bUJBQUEsQ0FBQyxDQUFDO0FBQy9ELHNCQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQzs7Ozs7Ozs7OztBQVVoQyx1QkFBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxzQkFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Ozs7OztXQUNoQyxHQUFFLElBQUksQ0FBQyxDQUFDO1NBQ1Y7Ozs7V0FsSUcsR0FBRzs7Ozs7QUFzSVQsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyw2QkFBNkI7QUFDakQsYUFBUyxFQUFFLElBQUk7QUFDZixhQUFTLEVBQUUsSUFBSTtBQUNmLFlBQVEsRUFBRSxJQUFJO0FBQ2QsUUFBSSxFQUFFLElBQUk7QUFDVixXQUFPLEVBQUUsSUFBSTtBQUNiLGlDQUE2QixFQUFFLElBQUksRUFDcEMsQ0FBQyxDQUFDOztNQUVHLE1BQU07UUFBTixNQUFNLEdBQ0MsU0FEUCxNQUFNLE9BQ3lCO1VBQXJCLElBQUksUUFBSixJQUFJO1VBQUUsR0FBRyxRQUFILEdBQUc7VUFBRSxNQUFNLFFBQU4sTUFBTTs7QUFDN0IsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQy9DLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTTtPQUFBLENBQUMsQ0FBQztBQUNoRixVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUMxQzs7Z0JBTEcsTUFBTTtBQU9WLG9CQUFjOztlQUFBLFlBQUc7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFbEMsYUFBTzs7ZUFBQSxZQUFHO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FUdkIsTUFBTTs7Ozs7QUFZWixHQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGdDQUFpQztBQUN4RCxlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IGNvID0gcmVxdWlyZSgnY28nKTtcbiAgICBjb25zdCBSZWFjdCA9IFIuUmVhY3Q7XG4gICAgY29uc3QgXyA9IFIuXztcbiAgICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcbiAgICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4gICAgLyoqXG4gICAgKiA8cD5TaW1wbHkgY3JlYXRlIGFuIEFwcCBjbGFzcyB3aXRoIHNwZWNpZmljczwvcD5cbiAgICAqIDxwPlByb3ZpZGVzIG1ldGhvZHMgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBzcGVjaWZpZWQgQXBwIHNlcnZlci1zaWRlIGFuZCBjbGllbnQtc2lkZTwvcD5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZUFwcCA9PiBpbml0aWFsaXplcyBtZXRob2RzIG9mIGFuIGFwcGxpY2F0aW9uIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWNhdGlvbnMgcHJvdmlkZWQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZVBsdWdpbiA9PiBpbml0aWxpYXppYXRpb24gbWV0aG9kIG9mIGEgcGx1Z2luIGZvciB0aGUgYXBwbGljYXRpb24gPC9saT5cbiAgICAqIDwvdWw+XG4gICAgKiBAY2xhc3MgUi5BcHBcbiAgICAqL1xuICAgIGNsYXNzIEFwcCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GbHV4ID0gdGhpcy5nZXRGbHV4Q2xhc3MoKTtcbiAgICAgICAgdGhpcy5Sb290ID0gdGhpcy5nZXRSb290Q2xhc3MoKTtcbiAgICAgICAgdGhpcy52YXJzID0gdGhpcy5nZXREZWZhdWx0VmFycygpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlTGlicyA9IHRoaXMuZ2V0VGVtcGxhdGVMaWJzKCk7XG4gICAgICAgIHRoaXMuUGx1Z2lucyA9IHRoaXMuZ2V0UGx1Z2luc0NsYXNzZXMoKTtcbiAgICAgICAgdGhpcy5ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlciA9IHRoaXMuZ2V0Qm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXIoKTtcblxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLmZsdXhDbGFzcy5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMucm9vdENsYXNzLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy52YXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5wbHVnaW5zLnNob3VsZC5iZS5hbi5BcnJheSAmJlxuICAgICAgICAgIHRoaXMuYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0RGVmYXVsdFZhcnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlTGlicygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFBsdWdpbnNDbGFzc2VzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Qm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXIoKSB7IF8uYWJzdHJhY3QoKTsgfVxuICAgICAgLyoqXG4gICAgICAqIDxwPkNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIHNlcnZlci1zaWRlIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXJcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcSBUaGUgY2xhc3NpY2FsIHJlcXVlc3Qgb2JqZWN0XG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gdGVtcGxhdGUgOiB0aGUgY29tcHV0ZWQgSFRNTCB0ZW1wbGF0ZSB3aXRoIGRhdGEgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudFxuICAgICAgKi9cbiAgICAgIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIocmVxKSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBndWlkID0gXy5ndWlkKCk7XG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KCk7XG4gICAgICAgICAgLy9SZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxuICAgICAgICAgIC8vSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcEluU2VydmVyKHJlcSwgcmVxLmhlYWRlcnMsIGd1aWQpO1xuXG4gICAgICAgICAgLy9Jbml0aWFsaXplcyBwbHVnaW4gYW5kIGZpbGwgYWxsIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3Igc3RvcmUgOiBNZW1vcnlcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSB9KSk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgICAgZmx1eC5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKi9cbiAgICAgICAgICBsZXQgcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KTtcbiAgICAgICAgICBmbHV4LnN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICAgICAgLy9TZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxuICAgICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XG4gICAgICAgICAgZmx1eC5kZXN0cm95KCk7XG4gICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xuXG4gICAgICAgICAgbGV0IHZhcnMgPSBfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcihyZXEpLCB0aGlzLnZhcnMpO1xuICAgICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KHJlcS5oZWFkZXJzKSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoeyB2YXJzLCByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0sIHRoaXMudGVtcGxhdGVMaWJzKTtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XG4gICAgICAqIENvbm5lY3RpbmcgdG8gdGhlIHVwbGluay1zZXJ2ZXIgdmlhIGluIG9yZGVyIHRvIGVuYWJsZSB0aGUgZXN0YWJsaXNobWVudCBvZiBzdWJzcmlwdGlvbnMgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50XG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XG4gICAgICAqL1xuICAgICAgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQod2luZG93KSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycy5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmFwcCA9IHRoaXMpO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCgpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuZmx1eCA9IGZsdXgpO1xuICAgICAgICAgIGxldCBoZWFkZXJzID0gSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzKSk7XG4gICAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XG5cbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcEluQ2xpZW50KHsgd2luZG93LCBoZWFkZXJzLCBndWlkIH0pO1xuICAgICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93IH0pKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnBsdWdpbnMgPSBwbHVnaW5zKTtcblxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xuICAgICAgICAgIGZsdXguc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICAgICAgLypcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBjbGllbnQtc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50czpcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcbiAgICAgICAgICAqIFJlYWN0IHdpbGwgcHJlc2VydmUgaXQgYW5kIG9ubHkgYXR0YWNoIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICogNC4gRmluYWxseSBjb21wb25lbnREaWRNb3VudCAoc3Vic2NyaWJlIGFuZCBmZXRjaGluZyBkYXRhKSB0aGVuIHJlcmVuZGVyaW5nIHdpdGggbmV3IHBvdGVudGlhbCBjb21wdXRlZCBkYXRhXG4gICAgICAgICAgKi9cbiAgICAgICAgICBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCk7XG4gICAgICAgICAgZmx1eC5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcbiAgICAgIGZsdXhDbGFzczogbnVsbCxcbiAgICAgIHJvb3RDbGFzczogbnVsbCxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgdmFyczogbnVsbCxcbiAgICAgIHBsdWdpbnM6IG51bGwsXG4gICAgICBib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogbnVsbCxcbiAgICB9KTtcblxuICAgIGNsYXNzIFBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3Rvcih7IGZsdXgsIHJlcSwgd2luZG93IH0pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gZmx1eC5zaG91bGQuYmUuaW5zdGFuY2VPZihSLkZsdXgpKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NldmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBkZXN0cm95KCkgeyBfLmFic3RyYWN0KCk7IH1cbiAgICB9XG5cbiAgICBfLmV4dGVuZChQbHVnaW4ucHJvdG90eXBlLCAvKiogQGxlbmRzIFBsdWdpbi5Qcm90b3R5cGUgKi8ge1xuICAgICAgZGlzcGxheU5hbWU6IG51bGwsXG4gICAgfSk7XG5cbiAgICBfLmV4dGVuZChBcHAsIHsgUGx1Z2luIH0pO1xuICAgIHJldHVybiBBcHA7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9