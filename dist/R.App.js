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
            var guid, flux, rootProps, surrogateRootComponent, rootComponentFactory, rootComponent, rootHtml, serializedFlux, vars, serializedHeaders;
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

                  //Initializes plugin and fill all corresponding data for store : Memory
                  this.Plugins.forEach(function (Plugin) {
                    var plugin = new Plugin();
                    _.dev(function () {
                      return plugin.installInServer.should.be.a.Function;
                    });
                    plugin.installInServer(flux, req);
                  });

                  rootProps = { flux: flux };
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

                  context$4$0.next = 22;
                  return this.bootstrapTemplateVarsInServer(req);

                case 22:
                  context$4$0.t0 = context$4$0.sent;
                  vars = _.extend({}, context$4$0.t0, this.vars);
                  serializedHeaders = _.base64Encode(JSON.stringify(req.headers));
                  return context$4$0.abrupt("return", this.template({ vars: vars, rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid }, this.templateLibs));

                case 26:
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
            var flux, headers, guid, rootProps, rootComponentFactory, rootComponent;
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

                  _.dev(function () {
                    return window.__ReactNexus.plugins = [];
                  });
                  this.Plugins.forEach(function (Plugin) {
                    var plugin = new Plugin();
                    _.dev(function () {
                      return window.__ReactNexus.plugins.push(plugin);
                    });
                    _.dev(function () {
                      return plugin.installInClient.should.be.a.Function;
                    });
                    plugin.installInClient(flux, window);
                  });

                  rootProps = { flux: flux };
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
    var Plugin = function Plugin() {
      this.displayName = this.getDisplayName();
    };

    _classProps(Plugin, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      installInServer: {
        writable: true,
        value: function (flux, req) {
          _.abstract();
        }
      },
      installInClient: {
        writable: true,
        value: function (flux, window) {
          _.abstract();
        }
      }
    });

    return Plugin;
  })();

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */{
    displayName: null });

  App.Plugin = Plugin;
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O01BYXZCLEdBQUc7UUFBSCxHQUFHLEdBQ0ksU0FEUCxHQUFHLEdBQ087OztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDeEMsVUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDOztBQUU3RSxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBSyxTQUFTLENBQUMsTUFBTSxDQUFD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TUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLDZCQUE2QjtBQUNqRCxhQUFTLEVBQUUsSUFBSTtBQUNmLGFBQVMsRUFBRSxJQUFJO0FBQ2YsWUFBUSxFQUFFLElBQUk7QUFDZCxRQUFJLEVBQUUsSUFBSTtBQUNWLFdBQU8sRUFBRSxJQUFJO0FBQ2IsaUNBQTZCLEVBQUUsSUFBSSxFQUNwQyxDQUFDLENBQUM7O01BRUcsTUFBTTtRQUFOLE1BQU0sR0FDQyxTQURQLE1BQU0sR0FDSTtBQUNaLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQzFDOztnQkFIRyxNQUFNO0FBS1Ysb0JBQWM7O2VBQUEsWUFBRztBQUFFLFdBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUFFOztBQUVsQyxxQkFBZTs7ZUFBQSxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFBRSxXQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FBRTs7QUFFNUMscUJBQWU7O2VBQUEsVUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQUUsV0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQUU7Ozs7V0FUM0MsTUFBTTs7Ozs7QUFZWixHQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGdDQUFpQztBQUN4RCxlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDcEIsU0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDIiwiZmlsZSI6IlIuQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcbiAgICBjb25zdCBjbyA9IHJlcXVpcmUoJ2NvJyk7XG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICAgIGNvbnN0IF8gPSBSLl87XG4gICAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuICAgIC8qKlxuICAgICogPHA+U2ltcGx5IGNyZWF0ZSBhbiBBcHAgY2xhc3Mgd2l0aCBzcGVjaWZpY3M8L3A+XG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XG4gICAgKiA8dWw+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVBcHAgPT4gaW5pdGlhbGl6ZXMgbWV0aG9kcyBvZiBhbiBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9uczwvbGk+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVQbHVnaW4gPT4gaW5pdGlsaWF6aWF0aW9uIG1ldGhvZCBvZiBhIHBsdWdpbiBmb3IgdGhlIGFwcGxpY2F0aW9uIDwvbGk+XG4gICAgKiA8L3VsPlxuICAgICogQGNsYXNzIFIuQXBwXG4gICAgKi9cbiAgICBjbGFzcyBBcHAge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRmx1eCA9IHRoaXMuZ2V0Rmx1eENsYXNzKCk7XG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XG4gICAgICAgIHRoaXMudmFycyA9IHRoaXMuZ2V0RGVmYXVsdFZhcnMoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMgPSB0aGlzLmdldFRlbXBsYXRlTGlicygpO1xuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XG4gICAgICAgIHRoaXMuYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXIgPSB0aGlzLmdldEJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyKCk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5mbHV4Q2xhc3Muc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLnJvb3RDbGFzcy5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudmFycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMucGx1Z2lucy5zaG91bGQuYmUuYW4uQXJyYXkgJiZcbiAgICAgICAgICB0aGlzLmJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyLnNob3VsZC5iZS5hLkZ1bmN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGdldEZsdXhDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldERlZmF1bHRWYXJzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZUxpYnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldEJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyKCkgeyBfLmFic3RyYWN0KCk7IH1cbiAgICAgIC8qKlxuICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0IG9iamVjdFxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcbiAgICAgICovXG4gICAgICByZW5kZXJUb1N0cmluZ0luU2VydmVyKHJlcSkge1xuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICAgIHJlcS5oZWFkZXJzLnNob3VsZC5iZS5va1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBsZXQgZ3VpZCA9IF8uZ3VpZCgpO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCgpO1xuICAgICAgICAgIC8vUmVnaXN0ZXIgc3RvcmUgKFIuU3RvcmUpIDogVXBsaW5rU2VydmVyIGFuZCBNZW1vcnlcbiAgICAgICAgICAvL0luaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXG4gICAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXBJblNlcnZlcihyZXEsIHJlcS5oZWFkZXJzLCBndWlkKTtcblxuICAgICAgICAgIC8vSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XG4gICAgICAgICAgdGhpcy5QbHVnaW5zLmZvckVhY2goKFBsdWdpbikgPT4ge1xuICAgICAgICAgICAgbGV0IHBsdWdpbiA9IG5ldyBQbHVnaW4oKTtcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IHBsdWdpbi5pbnN0YWxsSW5TZXJ2ZXIuc2hvdWxkLmJlLmEuRnVuY3Rpb24pO1xuICAgICAgICAgICAgcGx1Z2luLmluc3RhbGxJblNlcnZlcihmbHV4LCByZXEpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCB9O1xuXG4gICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgICAgZmx1eC5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKi9cbiAgICAgICAgICBsZXQgcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KTtcbiAgICAgICAgICBmbHV4LnN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICAgICAgLy9TZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxuICAgICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XG4gICAgICAgICAgZmx1eC5kZXN0cm95KCk7XG5cbiAgICAgICAgICBsZXQgdmFycyA9IF8uZXh0ZW5kKHt9LCB5aWVsZCB0aGlzLmJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyKHJlcSksIHRoaXMudmFycyk7XG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkocmVxLmhlYWRlcnMpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSh7IHZhcnMsIHJvb3RIdG1sLCBzZXJpYWxpemVkRmx1eCwgc2VyaWFsaXplZEhlYWRlcnMsIGd1aWQgfSwgdGhpcy50ZW1wbGF0ZUxpYnMpO1xuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICogPHA+U2V0dGluZyBhbGwgdGhlIGRhdGEgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50IGFuZCBSZW5kZXIgaXQgaW50byB0aGUgY2xpZW50LiA8YnIgLz5cbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnRcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHdpbmRvdyBUaGUgY2xhc3NpY2FsIHdpbmRvdyBvYmplY3RcbiAgICAgICovXG4gICAgICByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCh3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudC5zaG91bGQuYmUub2tcbiAgICAgICAgICApO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KCk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5mbHV4ID0gZmx1eCk7XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMpKTtcbiAgICAgICAgICBsZXQgZ3VpZCA9IHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZDtcblxuICAgICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwSW5DbGllbnQoeyB3aW5kb3csIGhlYWRlcnMsIGd1aWQgfSk7XG4gICAgICAgICAgZmx1eC51bnNlcmlhbGl6ZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4KTtcblxuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucGx1Z2lucyA9IFtdKTtcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGx1Z2luID0gbmV3IFBsdWdpbigpO1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zLnB1c2gocGx1Z2luKSk7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBwbHVnaW4uaW5zdGFsbEluQ2xpZW50LnNob3VsZC5iZS5hLkZ1bmN0aW9uKTtcbiAgICAgICAgICAgIHBsdWdpbi5pbnN0YWxsSW5DbGllbnQoZmx1eCwgd2luZG93KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXggfTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xuICAgICAgICAgIGZsdXguc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICAgICAgLypcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBjbGllbnQtc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50czpcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcbiAgICAgICAgICAqIFJlYWN0IHdpbGwgcHJlc2VydmUgaXQgYW5kIG9ubHkgYXR0YWNoIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICogNC4gRmluYWxseSBjb21wb25lbnREaWRNb3VudCAoc3Vic2NyaWJlIGFuZCBmZXRjaGluZyBkYXRhKSB0aGVuIHJlcmVuZGVyaW5nIHdpdGggbmV3IHBvdGVudGlhbCBjb21wdXRlZCBkYXRhXG4gICAgICAgICAgKi9cbiAgICAgICAgICBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCk7XG4gICAgICAgICAgZmx1eC5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcbiAgICAgIGZsdXhDbGFzczogbnVsbCxcbiAgICAgIHJvb3RDbGFzczogbnVsbCxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgdmFyczogbnVsbCxcbiAgICAgIHBsdWdpbnM6IG51bGwsXG4gICAgICBib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogbnVsbCxcbiAgICB9KTtcblxuICAgIGNsYXNzIFBsdWdpbiB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5TmFtZSA9IHRoaXMuZ2V0RGlzcGxheU5hbWUoKTtcbiAgICAgIH1cblxuICAgICAgZ2V0RGlzcGxheU5hbWUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBpbnN0YWxsSW5TZXJ2ZXIoZmx1eCwgcmVxKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBpbnN0YWxsSW5DbGllbnQoZmx1eCwgd2luZG93KSB7IF8uYWJzdHJhY3QoKTsgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKFBsdWdpbi5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGx1Z2luLlByb3RvdHlwZSAqLyB7XG4gICAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICB9KTtcblxuICAgIEFwcC5QbHVnaW4gPSBQbHVnaW47XG4gICAgcmV0dXJuIEFwcDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=